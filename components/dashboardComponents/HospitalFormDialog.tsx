"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Activity, Loader2, Plus, Stethoscope, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import {
	Controller,
	type Resolver,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useFetchAreas } from "@/hooks/useAreas";
import { useCreateHospital } from "@/hooks/useHospitals";
import {
	type CreateHospitalInput,
	createHospitalSchema,
} from "@/validators/hospitals";

const HOSPITAL_CATEGORIES = [
	"General",
	"Specialized",
	"Medical College",
	"Clinic",
	"Diagnostic Center",
	"Maternity",
	"Dental",
	"Eye Hospital",
];

const DEFAULT_VALUES: CreateHospitalInput = {
	name: "",
	area: "",
	location: "",
	category: "General",
	phone: "",
	detail: "",
	rating: 0,
	testPrices: [],
	services: [],
	image: "",
};

export function HospitalFormDialog() {
	const [open, setOpen] = useState(false);
	const [serviceInput, setServiceInput] = useState("");
	const { data: areasData = [] } = useFetchAreas();
	const { mutate: createHosp, isPending } = useCreateHospital();

	const areas = useMemo(() => areasData, [areasData]);

	const form = useForm<CreateHospitalInput>({
		resolver: zodResolver(
			createHospitalSchema,
		) as Resolver<CreateHospitalInput>,
		defaultValues: DEFAULT_VALUES,
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "testPrices",
	});

	const services = form.watch("services") || [];

	const addService = () => {
		const trimmed = serviceInput.trim();
		if (trimmed && !services.includes(trimmed)) {
			form.setValue("services", [...services, trimmed]);
			setServiceInput("");
		}
	};

	const removeService = (item: string) => {
		form.setValue(
			"services",
			services.filter((s) => s !== item),
		);
	};

	const onSubmit = (values: CreateHospitalInput) => {
		createHosp(values, {
			onSuccess: () => {
				setOpen(false);
				form.reset(DEFAULT_VALUES);
				toast.success("Hospital added successfully!");
			},
		});
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(val) => {
				setOpen(val);
				if (!val) form.reset(DEFAULT_VALUES);
			}}
		>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="h-4 w-4" /> Add Hospital
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Add New Hospital</DialogTitle>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
					{/* Basic Information Section */}
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Hospital Name *</FieldLabel>
									<Input {...field} placeholder="e.g. Evercare Hospital" />
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="area"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Area *</FieldLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="Select Area" />
											</SelectTrigger>
											<SelectContent>
												{areas.map((a) => (
													<SelectItem key={String(a._id)} value={String(a._id)}>
														{a.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name="category"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Category *</FieldLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="Select Category" />
											</SelectTrigger>
											<SelectContent>
												{HOSPITAL_CATEGORIES.map((cat) => (
													<SelectItem key={cat} value={cat}>
														{cat}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="phone"
								control={form.control}
								render={({ field }) => (
									<Field>
										<FieldLabel>Phone Number</FieldLabel>
										<Input {...field} placeholder="e.g. +880 1XXX-XXXXXX" />
									</Field>
								)}
							/>
							<Controller
								name="rating"
								control={form.control}
								render={({ field }) => (
									<Field>
										<FieldLabel>Rating (0-5)</FieldLabel>
										<Input
											{...field}
											type="number"
											step="0.1"
											placeholder="e.g. 4.5"
											onChange={(e) =>
												field.onChange(parseFloat(e.target.value) || 0)
											}
										/>
									</Field>
								)}
							/>
						</div>

						<Controller
							name="location"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Location / Full Address *</FieldLabel>
									<Input {...field} placeholder="House, Road, Block..." />
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
						<Controller
							name="image"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Image URL</FieldLabel>
									<Input
										{...field}
										placeholder="https://example.com/image.jpg"
									/>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="detail"
							control={form.control}
							render={({ field }) => (
								<Field>
									<FieldLabel>Description / Detail</FieldLabel>
									<Textarea
										{...field}
										placeholder="Briefly describe the hospital..."
										className="min-h-[100px] resize-none"
									/>
								</Field>
							)}
						/>
					</FieldGroup>

					<Separator />

					{/* Services Section */}
					<section className="space-y-3">
						<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
							<Activity className="h-4 w-4" /> Available Services
						</FieldLabel>
						<div className="flex gap-2">
							<Input
								value={serviceInput}
								onChange={(e) => setServiceInput(e.target.value)}
								placeholder="e.g. ICU, Emergency 24/7, Lab"
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addService();
									}
								}}
							/>
							<Button type="button" variant="outline" onClick={addService}>
								Add
							</Button>
						</div>
						<div className="flex flex-wrap gap-2">
							{services.map((item) => (
								<Badge key={item} variant="secondary" className="pr-1 py-1">
									{item}
									<X
										className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
										onClick={() => removeService(item)}
									/>
								</Badge>
							))}
						</div>
					</section>

					<Separator />

					{/* Test Prices Section */}
					<section className="space-y-4">
						<div className="flex items-center justify-between">
							<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
								<Stethoscope className="h-4 w-4" /> Diagnostic Test Prices
							</FieldLabel>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-7 text-xs"
								onClick={() => append({ name: "", price: "" })}
							>
								<Plus className="h-3 w-3 mr-1" /> Add Test
							</Button>
						</div>
						<div className="space-y-3">
							{fields.map((field, index) => (
								<div key={field.id} className="flex gap-2 items-start">
									<div className="flex-1">
										<Input
											{...form.register(`testPrices.${index}.name`)}
											placeholder="Test Name (e.g. MRI)"
										/>
									</div>
									<div className="w-28">
										<Input
											{...form.register(`testPrices.${index}.price`)}
											placeholder="Price (৳)"
										/>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="text-muted-foreground hover:text-destructive"
										onClick={() => remove(index)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
							{fields.length === 0 && (
								<p className="text-xs text-center text-muted-foreground py-2 border border-dashed rounded-md">
									No diagnostic tests added yet.
								</p>
							)}
						</div>
					</section>

					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="min-w-[120px]"
							disabled={isPending}
						>
							{isPending ? (
								<>
									<Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving...
								</>
							) : (
								"Save Hospital"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
