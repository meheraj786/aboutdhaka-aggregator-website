"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import type { IPCComponentPopulated } from "@/actions/pcComponent.action";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useCreateComponent,
	useUpdateComponent,
} from "@/hooks/usePCComponents";
import { useFetchShops } from "@/hooks/useShops";
import {
	type PCComponentInput,
	pcComponentInputSchema,
} from "@/validators/pcComponent";

const CATEGORIES = [
	"CPU",
	"GPU",
	"RAM",
	"Motherboard",
	"Storage",
	"PSU",
	"Case",
	"Cooler",
] as const;

const USAGE_TAGS = [
	"Gaming",
	"Content Creation",
	"Development",
	"Office & Web",
] as const;

const BUDGET_TIERS = [
	{ value: "budget", label: "Budget" },
	{ value: "mid", label: "Mid-range" },
	{ value: "high-end", label: "High-end" },
] as const;

const SOCKET_OPTIONS = [
	{ value: "AM4", label: "AM4 — AMD Ryzen 3000 / 5000" },
	{ value: "AM5", label: "AM5 — AMD Ryzen 7000+" },
	{ value: "LGA1700", label: "LGA1700 — Intel 12th / 13th / 14th Gen" },
	{ value: "LGA1200", label: "LGA1200 — Intel 10th / 11th Gen" },
	{ value: "LGA1151", label: "LGA1151 — Intel 8th / 9th Gen" },
	{ value: "other", label: "Other" },
] as const;

const RAM_GEN_OPTIONS = [
	{ value: "DDR3", label: "DDR3" },
	{ value: "DDR4", label: "DDR4" },
	{ value: "DDR5", label: "DDR5" },
] as const;

const STORAGE_INTERFACE_OPTIONS = [
	{ value: "NVMe_Gen3", label: "NVMe Gen 3 (M.2 PCIe 3.0)" },
	{ value: "NVMe_Gen4", label: "NVMe Gen 4 (M.2 PCIe 4.0)" },
	{ value: "SATA", label: "SATA (SSD / HDD)" },
] as const;

const STOCK_OPTIONS = [
	{ value: "in_stock", label: "In Stock" },
	{ value: "out_of_stock", label: "Out of Stock" },
	{ value: "limited", label: "Limited" },
] as const;

function Field({
	label,
	hint,
	error,
	children,
}: {
	label: string;
	hint?: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-1.5">
			<Label className="text-xs font-semibold text-slate-700">{label}</Label>
			{hint && <p className="text-[10px] text-slate-400">{hint}</p>}
			{children}
			{error && <p className="text-[11px] text-red-500">{error}</p>}
		</div>
	);
}

function buildDefaults(
	editing: IPCComponentPopulated | null,
): PCComponentInput {
	if (!editing) {
		return {
			name: "",
			brand: "",
			category: "CPU",
			imageUrl: "",
			usageTags: [],
			minBudgetTier: "mid",
			specs: {},
			shopListings: [],
			socket: undefined,
			cores: undefined,
			threads: undefined,
			tdpWatt: undefined,
			supportedRamGeneration: undefined,
			supportedStorageInterfaces: undefined,
			ramGeneration: undefined,
			ramCapacityGb: undefined,
			vramGb: undefined,
			gpuTdpWatt: undefined,
			storageInterface: undefined,
			storageCapacityGb: undefined,
			wattage: undefined,
		};
	}
	return {
		name: editing.name,
		brand: editing.brand,
		category: editing.category,
		imageUrl: editing.imageUrl ?? "",
		usageTags: editing.usageTags as PCComponentInput["usageTags"],
		minBudgetTier: editing.minBudgetTier,
		specs: (editing.specs ?? {}) as Record<string, string | number | boolean>,
		shopListings: editing.shopListings.map((l) => ({
			shop: l.shop._id,
			price: l.price,
			stock: l.stock,
			url: l.url ?? "",
		})),
		socket: editing.socket,
		cores: editing.cores,
		threads: editing.threads,
		tdpWatt: editing.tdpWatt,
		supportedRamGeneration: editing.supportedRamGeneration,
		supportedStorageInterfaces: editing.supportedStorageInterfaces,
		ramGeneration: editing.ramGeneration,
		ramCapacityGb: editing.ramCapacityGb,
		vramGb: editing.vramGb,
		gpuTdpWatt: editing.gpuTdpWatt,
		storageInterface: editing.storageInterface,
		storageCapacityGb: editing.storageCapacityGb,
		wattage: editing.wattage,
	};
}

export function ComponentFormDialog({
	open,
	onOpenChange,
	editing,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editing: IPCComponentPopulated | null;
}) {
	const createMutation = useCreateComponent();
	const updateMutation = useUpdateComponent();
	const { data: shops = [] } = useFetchShops();

	const {
		register,
		handleSubmit,
		reset,
		watch,
		setValue,
		control,
		formState: { errors },
	} = useForm<PCComponentInput>({
		resolver: zodResolver(pcComponentInputSchema),
		defaultValues: buildDefaults(editing),
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "shopListings",
	});

	useEffect(() => {
		reset(buildDefaults(editing));
	}, [editing, reset]);

	const watchedCategory = watch("category");
	const watchedUsageTags = watch("usageTags");
	const watchedStorageInterfaces = watch("supportedStorageInterfaces") ?? [];

	const toggleUsageTag = (tag: PCComponentInput["usageTags"][number]) => {
		const current = watchedUsageTags ?? [];
		if (current.includes(tag)) {
			setValue(
				"usageTags",
				current.filter((t) => t !== tag),
			);
		} else {
			setValue("usageTags", [...current, tag]);
		}
	};

	const toggleStorageInterface = (
		iface: "NVMe_Gen3" | "NVMe_Gen4" | "SATA",
	) => {
		const current = watchedStorageInterfaces;
		if (current.includes(iface)) {
			setValue(
				"supportedStorageInterfaces",
				current.filter((i) => i !== iface),
			);
		} else {
			setValue("supportedStorageInterfaces", [...current, iface]);
		}
	};

	const onSubmit = async (data: PCComponentInput) => {
		if (editing) {
			await updateMutation.mutateAsync({ id: editing._id, data });
		} else {
			await createMutation.mutateAsync(data);
		}
		onOpenChange(false);
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	const isCpu = watchedCategory === "CPU";
	const isMotherboard = watchedCategory === "Motherboard";
	const isRam = watchedCategory === "RAM";
	const isGpu = watchedCategory === "GPU";
	const isStorage = watchedCategory === "Storage";
	const isPsu = watchedCategory === "PSU";
	const showSocket = isCpu || isMotherboard;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{editing ? "Edit Component" : "Add New Component"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{/* ── Basic Info ─────────────────────────────────────────────────── */}
					<div className="space-y-4">
						<p className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
							Basic Info
						</p>

						<div className="grid grid-cols-2 gap-4">
							<Field label="Name" error={errors.name?.message}>
								<Input placeholder="e.g. Ryzen 5 5600X" {...register("name")} />
							</Field>
							<Field label="Brand" error={errors.brand?.message}>
								<Input placeholder="e.g. AMD" {...register("brand")} />
							</Field>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<Field label="Category" error={errors.category?.message}>
								<Select
									value={watchedCategory}
									onValueChange={(v) =>
										setValue("category", v as PCComponentInput["category"])
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{CATEGORIES.map((c) => (
											<SelectItem key={c} value={c}>
												{c}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>

							<Field label="Budget Tier" error={errors.minBudgetTier?.message}>
								<Select
									value={watch("minBudgetTier")}
									onValueChange={(v) =>
										setValue(
											"minBudgetTier",
											v as PCComponentInput["minBudgetTier"],
										)
									}
								>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{BUDGET_TIERS.map((t) => (
											<SelectItem key={t.value} value={t.value}>
												{t.label}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</Field>
						</div>

						<Field
							label="Image URL (optional)"
							error={errors.imageUrl?.message}
						>
							<Input placeholder="https://..." {...register("imageUrl")} />
						</Field>
					</div>

					{/* ── Usage Tags ─────────────────────────────────────────────────── */}
					<div className="space-y-3">
						<p className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
							Usage Tags
						</p>
						<div className="flex flex-wrap gap-3">
							{USAGE_TAGS.map((tag) => (
								<label
									htmlFor={tag}
									key={tag}
									className="flex items-center gap-2 cursor-pointer"
								>
									<Checkbox
										checked={(watchedUsageTags ?? []).includes(tag)}
										onCheckedChange={() => toggleUsageTag(tag)}
									/>
									<span className="text-sm text-slate-700">{tag}</span>
								</label>
							))}
						</div>
					</div>

					{/* ── Compatibility Fields ────────────────────────────────────────── */}
					{(showSocket ||
						isCpu ||
						isMotherboard ||
						isRam ||
						isGpu ||
						isStorage ||
						isPsu) && (
						<div className="space-y-4">
							<p className="text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-2">
								Compatibility & Specs
								<span className="ml-2 text-[10px] font-normal normal-case text-slate-400">
									Used for smart filtering
								</span>
							</p>

							{/* Socket — CPU and Motherboard */}
							{showSocket && (
								<Field
									label="Socket Type"
									hint={
										isCpu
											? "The physical socket this CPU fits into"
											: "The socket this motherboard supports"
									}
									error={errors.socket?.message}
								>
									<Select
										value={watch("socket") ?? ""}
										onValueChange={(v) =>
											setValue(
												"socket",
												v === ""
													? undefined
													: (v as PCComponentInput["socket"]),
											)
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select socket" />
										</SelectTrigger>
										<SelectContent>
											{SOCKET_OPTIONS.map((s) => (
												<SelectItem key={s.value} value={s.value}>
													{s.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</Field>
							)}

							{/* CPU specific */}
							{isCpu && (
								<div className="grid grid-cols-3 gap-3">
									<Field label="Cores" error={errors.cores?.message}>
										<Input
											type="number"
											placeholder="6"
											{...register("cores", { valueAsNumber: true })}
										/>
									</Field>
									<Field label="Threads" error={errors.threads?.message}>
										<Input
											type="number"
											placeholder="12"
											{...register("threads", { valueAsNumber: true })}
										/>
									</Field>
									<Field
										label="TDP (Watt)"
										hint="CPU heat output"
										error={errors.tdpWatt?.message}
									>
										<Input
											type="number"
											placeholder="65"
											{...register("tdpWatt", { valueAsNumber: true })}
										/>
									</Field>
								</div>
							)}

							{/* Motherboard specific */}
							{isMotherboard && (
								<>
									<Field
										label="Supported RAM Generation"
										hint="DDR generation this motherboard supports"
										error={errors.supportedRamGeneration?.message}
									>
										<Select
											value={watch("supportedRamGeneration") ?? ""}
											onValueChange={(v) =>
												setValue(
													"supportedRamGeneration",
													v === ""
														? undefined
														: (v as PCComponentInput["supportedRamGeneration"]),
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select DDR generation" />
											</SelectTrigger>
											<SelectContent>
												{RAM_GEN_OPTIONS.map((r) => (
													<SelectItem key={r.value} value={r.value}>
														{r.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>

									<Field
										label="Supported Storage Interfaces"
										hint="Check all storage types this motherboard supports"
									>
										<div className="flex flex-wrap gap-3 mt-1">
											{STORAGE_INTERFACE_OPTIONS.map((iface) => (
												<label
													htmlFor={iface.value}
													key={iface.value}
													className="flex items-center gap-2 cursor-pointer"
												>
													<Checkbox
														checked={watchedStorageInterfaces.includes(
															iface.value,
														)}
														onCheckedChange={() =>
															toggleStorageInterface(iface.value)
														}
													/>
													<span className="text-sm text-slate-700">
														{iface.label}
													</span>
												</label>
											))}
										</div>
									</Field>
								</>
							)}

							{/* RAM specific */}
							{isRam && (
								<div className="grid grid-cols-2 gap-4">
									<Field
										label="RAM Generation"
										hint="Must match motherboard's supported DDR gen"
										error={errors.ramGeneration?.message}
									>
										<Select
											value={watch("ramGeneration") ?? ""}
											onValueChange={(v) =>
												setValue(
													"ramGeneration",
													v === ""
														? undefined
														: (v as PCComponentInput["ramGeneration"]),
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select generation" />
											</SelectTrigger>
											<SelectContent>
												{RAM_GEN_OPTIONS.map((r) => (
													<SelectItem key={r.value} value={r.value}>
														{r.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>

									<Field
										label="Capacity (GB)"
										error={errors.ramCapacityGb?.message}
									>
										<Input
											type="number"
											placeholder="16"
											{...register("ramCapacityGb", { valueAsNumber: true })}
										/>
									</Field>
								</div>
							)}

							{/* GPU specific */}
							{isGpu && (
								<div className="grid grid-cols-2 gap-4">
									<Field label="VRAM (GB)" error={errors.vramGb?.message}>
										<Input
											type="number"
											placeholder="8"
											{...register("vramGb", { valueAsNumber: true })}
										/>
									</Field>
									<Field
										label="GPU TDP (Watt)"
										hint="Power draw under load"
										error={errors.gpuTdpWatt?.message}
									>
										<Input
											type="number"
											placeholder="200"
											{...register("gpuTdpWatt", { valueAsNumber: true })}
										/>
									</Field>
								</div>
							)}

							{/* Storage specific */}
							{isStorage && (
								<div className="grid grid-cols-2 gap-4">
									<Field
										label="Storage Interface"
										hint="Must be supported by the motherboard"
										error={errors.storageInterface?.message}
									>
										<Select
											value={watch("storageInterface") ?? ""}
											onValueChange={(v) =>
												setValue(
													"storageInterface",
													v === ""
														? undefined
														: (v as PCComponentInput["storageInterface"]),
												)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select interface" />
											</SelectTrigger>
											<SelectContent>
												{STORAGE_INTERFACE_OPTIONS.map((s) => (
													<SelectItem key={s.value} value={s.value}>
														{s.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>

									<Field
										label="Capacity (GB)"
										error={errors.storageCapacityGb?.message}
									>
										<Input
											type="number"
											placeholder="1000"
											{...register("storageCapacityGb", {
												valueAsNumber: true,
											})}
										/>
									</Field>
								</div>
							)}

							{/* PSU specific */}
							{isPsu && (
								<Field
									label="Wattage (W)"
									hint="Total rated output — must cover CPU TDP + GPU TDP + ~100W system"
									error={errors.wattage?.message}
								>
									<Input
										type="number"
										placeholder="650"
										{...register("wattage", { valueAsNumber: true })}
									/>
								</Field>
							)}
						</div>
					)}

					{/* ── Shop Listings ──────────────────────────────────────────────── */}
					<div className="space-y-3">
						<div className="flex items-center justify-between border-b border-slate-100 pb-2">
							<p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
								Shop Listings
							</p>
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={() =>
									append({ shop: "", price: 0, stock: "in_stock", url: "" })
								}
								className="gap-1 h-7 text-xs"
							>
								<Plus className="w-3 h-3" />
								Add Shop
							</Button>
						</div>

						{fields.length === 0 && (
							<p className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-lg">
								No shop listings yet. Add one above.
							</p>
						)}

						{fields.map((field, index) => (
							<div
								key={field.id}
								className="border border-slate-100 rounded-xl p-4 space-y-3 bg-slate-50/50"
							>
								<div className="flex items-center justify-between">
									<span className="text-xs font-semibold text-slate-600">
										Listing #{index + 1}
									</span>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => remove(index)}
										className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
									>
										<Trash2 className="w-3.5 h-3.5" />
									</Button>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<Field
										label="Shop"
										error={errors.shopListings?.[index]?.shop?.message}
									>
										<Select
											value={watch(`shopListings.${index}.shop`)}
											onValueChange={(v) =>
												setValue(`shopListings.${index}.shop`, v)
											}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select shop" />
											</SelectTrigger>
											<SelectContent>
												{shops.map((s) => (
													<SelectItem key={s._id} value={s._id}>
														{s.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>

									<Field
										label="Stock"
										error={errors.shopListings?.[index]?.stock?.message}
									>
										<Select
											value={watch(`shopListings.${index}.stock`)}
											onValueChange={(v) =>
												setValue(
													`shopListings.${index}.stock`,
													v as "in_stock" | "out_of_stock" | "limited",
												)
											}
										>
											<SelectTrigger>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{STOCK_OPTIONS.map((s) => (
													<SelectItem key={s.value} value={s.value}>
														{s.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<Field
										label="Price (BDT)"
										error={errors.shopListings?.[index]?.price?.message}
									>
										<Input
											type="number"
											placeholder="15000"
											{...register(`shopListings.${index}.price`, {
												valueAsNumber: true,
											})}
										/>
									</Field>

									<Field
										label="Product URL (optional)"
										error={errors.shopListings?.[index]?.url?.message}
									>
										<Input
											placeholder="https://..."
											{...register(`shopListings.${index}.url`)}
										/>
									</Field>
								</div>
							</div>
						))}
					</div>

					{/* ── Submit ────────────────────────────────────────────────────── */}
					<div className="flex gap-2 pt-2">
						<Button type="submit" disabled={isPending} className="flex-1">
							{isPending
								? "Saving..."
								: editing
									? "Update Component"
									: "Add Component"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="flex-1"
						>
							Cancel
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
