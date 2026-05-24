"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Controller,
	type SubmitHandler,
	useFieldArray,
	useForm,
} from "react-hook-form";
import type { IPCComponentPopulated } from "@/actions/pcComponent.action";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
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
type UsageTag = (typeof USAGE_TAGS)[number];

const BUDGET_TIERS = [
	{ value: "budget" as const, label: "Budget" },
	{ value: "mid" as const, label: "Mid-range" },
	{ value: "high-end" as const, label: "High-end" },
] as const;

const STOCK_OPTIONS = [
	{ value: "in_stock" as const, label: "In Stock" },
	{ value: "out_of_stock" as const, label: "Out of Stock" },
	{ value: "limited" as const, label: "Limited" },
] as const;

function Field({
	label,
	error,
	children,
}: {
	label: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-1.5">
			<Label className="text-xs font-semibold text-slate-700">{label}</Label>
			{children}
			{error && <p className="text-[11px] text-red-500">{error}</p>}
		</div>
	);
}

function buildDefaultValues(
	editing: IPCComponentPopulated | null,
): PCComponentInput {
	if (!editing) {
		return {
			name: "",
			brand: "",
			category: "CPU",
			imageUrl: undefined,
			specs: {},
			usageTags: [],
			minBudgetTier: "mid",
			cores: undefined,
			threads: undefined,
			shopListings: [],
		};
	}

	const cleanedSpecs: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(editing.specs ?? {})) {
		if (value !== null && value !== undefined) {
			cleanedSpecs[key] = value;
		}
	}

	return {
		name: editing.name,
		brand: editing.brand,
		category: editing.category,
		imageUrl: editing.imageUrl ?? undefined,
		specs: cleanedSpecs,
		usageTags: (editing.usageTags ?? []).map((tag) => {
			if (
				tag === "Gaming" ||
				tag === "Content Creation" ||
				tag === "Development" ||
				tag === "Office & Web"
			) {
				return tag;
			}
			return "Gaming";
		}),
		minBudgetTier: editing.minBudgetTier ?? "mid",
		cores: editing.cores,
		threads: editing.threads,
		shopListings: (editing.shopListings ?? []).map((l) => {
			const shopId =
				typeof l.shop === "object" && l.shop !== null && "_id" in l.shop
					? (l.shop as { _id: string })._id
					: String(l.shop);
			return {
				shop: shopId,
				price: l.price,
				stock: l.stock,
				url: l.url ?? "",
			};
		}),
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
	const { data: shops = [] } = useFetchShops();
	const createMutation = useCreateComponent();
	const updateMutation = useUpdateComponent();

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(pcComponentInputSchema),
		defaultValues: buildDefaultValues(editing),
	});

	useEffect(() => {
		reset(buildDefaultValues(editing));
	}, [editing, reset]);

	const { fields, append, remove } = useFieldArray({
		control,
		name: "shopListings",
	});

	const currentSpecs = watch("specs") ?? {};
	const currentTags = watch("usageTags") ?? [];
	const currentCategory = watch("category");

	const [specKey, setSpecKey] = useState("");
	const [specVal, setSpecVal] = useState("");

	const addSpec = () => {
		if (!specKey.trim()) return;
		setValue("specs", { ...currentSpecs, [specKey.trim()]: specVal });
		setSpecKey("");
		setSpecVal("");
	};

	const removeSpec = (key: string) => {
		const updated = { ...currentSpecs };
		delete updated[key];
		setValue("specs", updated);
	};

	const toggleTag = (tag: UsageTag) => {
		const next = currentTags.includes(tag)
			? currentTags.filter((t) => t !== tag)
			: [...currentTags, tag];
		setValue("usageTags", next, { shouldValidate: true });
	};

	const onSubmit: SubmitHandler<PCComponentInput> = async (data) => {
		if (editing) {
			await updateMutation.mutateAsync({ id: editing._id, data });
		} else {
			await createMutation.mutateAsync(data);
		}
		onOpenChange(false);
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{editing ? "Edit Component" : "Add New Component"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<Field label="Name" error={errors.name?.message}>
							<Input placeholder="e.g. Ryzen 7 7700X" {...register("name")} />
						</Field>
						<Field label="Brand" error={errors.brand?.message}>
							<Input placeholder="e.g. AMD" {...register("brand")} />
						</Field>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<Field label="Category" error={errors.category?.message}>
							<Controller
								control={control}
								name="category"
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
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
								)}
							/>
						</Field>

						<Field
							label="Min Budget Tier"
							error={errors.minBudgetTier?.message}
						>
							<Controller
								control={control}
								name="minBudgetTier"
								render={({ field }) => (
									<Select value={field.value} onValueChange={field.onChange}>
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
								)}
							/>
						</Field>
					</div>

					{currentCategory === "CPU" && (
						<div className="grid grid-cols-2 gap-4">
							<Field label="Cores" error={errors.cores?.message}>
								<Input
									type="number"
									{...register("cores", { valueAsNumber: true })}
								/>
							</Field>
							<Field label="Threads" error={errors.threads?.message}>
								<Input
									type="number"
									{...register("threads", { valueAsNumber: true })}
								/>
							</Field>
						</div>
					)}

					<Field label="Image URL (optional)" error={errors.imageUrl?.message}>
						<Input placeholder="https://..." {...register("imageUrl")} />
					</Field>

					<div className="space-y-2">
						<Label className="text-xs font-semibold text-slate-700">
							Usage Tags
						</Label>
						<div className="flex flex-wrap gap-2">
							{USAGE_TAGS.map((tag) => (
								<button
									key={tag}
									type="button"
									onClick={() => toggleTag(tag)}
									className={
										currentTags.includes(tag)
											? "px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-600 text-white border border-blue-600"
											: "px-3 py-1.5 rounded-full text-xs font-semibold border border-slate-200 hover:border-slate-300"
									}
								>
									{tag}
								</button>
							))}
						</div>
					</div>

					<div className="space-y-2">
						<Label className="text-xs font-semibold text-slate-700">
							Specs
						</Label>
						<div className="flex gap-2">
							<Input
								placeholder="Key"
								value={specKey}
								onChange={(e) => setSpecKey(e.target.value)}
								className="flex-1"
							/>
							<Input
								placeholder="Value"
								value={specVal}
								onChange={(e) => setSpecVal(e.target.value)}
								className="flex-1"
							/>
							<Button type="button" variant="outline" onClick={addSpec}>
								<Plus className="w-4 h-4" />
							</Button>
						</div>

						{Object.keys(currentSpecs).length > 0 && (
							<div className="flex flex-wrap gap-2 mt-2">
								{Object.entries(currentSpecs).map(([k, v]) => (
									<span
										key={k}
										className="flex items-center gap-1 text-xs bg-slate-100 text-slate-700 px-3 py-1 rounded-full"
									>
										{k}: {String(v)}
										<button
											type="button"
											onClick={() => removeSpec(k)}
											className="ml-1 text-red-400 hover:text-red-600"
										>
											<X className="w-3 h-3" />
										</button>
									</span>
								))}
							</div>
						)}
					</div>

					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label className="text-xs font-semibold text-slate-700">
								Shop Listings
							</Label>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() =>
									append({ shop: "", price: 0, stock: "in_stock", url: "" })
								}
							>
								<Plus className="w-3.5 h-3.5 mr-1" /> Add Shop
							</Button>
						</div>

						{fields.length === 0 && (
							<p className="text-xs text-slate-400 text-center py-4 border border-dashed border-slate-200 rounded-xl">
								No shop listings yet
							</p>
						)}

						{fields.map((field, index) => (
							<div
								key={field.id}
								className="p-4 rounded-xl border border-slate-100 bg-slate-50 space-y-3"
							>
								<div className="flex justify-between">
									<p className="text-xs font-semibold text-slate-600">
										Listing #{index + 1}
									</p>
									<button
										type="button"
										onClick={() => remove(index)}
										className="text-red-400 hover:text-red-600"
									>
										<X className="w-4 h-4" />
									</button>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<Field
										label="Shop"
										error={errors.shopListings?.[index]?.shop?.message}
									>
										<Controller
											control={control}
											name={`shopListings.${index}.shop`}
											render={({ field }) => (
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger className="bg-white">
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
											)}
										/>
									</Field>

									<Field
										label="Price (BDT)"
										error={errors.shopListings?.[index]?.price?.message}
									>
										<Input
											type="number"
											{...register(`shopListings.${index}.price`, {
												valueAsNumber: true,
											})}
											className="bg-white"
										/>
									</Field>
								</div>

								<div className="grid grid-cols-2 gap-3">
									<Field
										label="Stock"
										error={errors.shopListings?.[index]?.stock?.message}
									>
										<Controller
											control={control}
											name={`shopListings.${index}.stock`}
											render={({ field }) => (
												<Select
													value={field.value}
													onValueChange={field.onChange}
												>
													<SelectTrigger className="bg-white">
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
											)}
										/>
									</Field>

									<Field
										label="URL (optional)"
										error={errors.shopListings?.[index]?.url?.message}
									>
										<Input
											{...register(`shopListings.${index}.url`)}
											placeholder="https://..."
											className="bg-white"
										/>
									</Field>
								</div>
							</div>
						))}
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending
								? "Saving..."
								: editing
									? "Update Component"
									: "Add Component"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
