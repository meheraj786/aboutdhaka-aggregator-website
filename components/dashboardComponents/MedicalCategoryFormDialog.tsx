"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
	useCreateMedicalCategory,
	useUpdateMedicalCategory,
} from "@/hooks/useMedicalCategories";
import {
	type CreateMedicalCategoryInput,
	createMedicalCategorySchema,
} from "@/validators/medicalCategories";

const DEFAULT_VALUES: CreateMedicalCategoryInput = {
	name: "",
	slug: "",
	type: "hospital",
	description: "",
	icon: "",
	isActive: true,
};

interface MedicalCategoryFormDialogProps {
	mode?: "create" | "edit";
	categoryId?: string;
	initialData?: CreateMedicalCategoryInput & { _id?: string };
	trigger?: React.ReactNode;
}

export function MedicalCategoryFormDialog({
	mode = "create",
	categoryId,
	initialData,
	trigger,
}: MedicalCategoryFormDialogProps) {
	const [open, setOpen] = useState(false);

	const { mutate: createCategory, isPending: isCreating } =
		useCreateMedicalCategory();
	const { mutate: updateCategory, isPending: isUpdating } =
		useUpdateMedicalCategory();

	const isPending = isCreating || isUpdating;

	const resolver = useMemo(() => zodResolver(createMedicalCategorySchema), []);

	const form = useForm<CreateMedicalCategoryInput>({
		resolver,
		defaultValues: initialData || DEFAULT_VALUES,
	});

	// Reset form when dialog opens/closes or initialData changes
	useEffect(() => {
		if (open && initialData) {
			form.reset(initialData);
		} else if (!open) {
			form.reset(initialData || DEFAULT_VALUES);
		}
	}, [open, initialData, form]);

	const handleOpenChange = (newOpen: boolean) => {
		setOpen(newOpen);
		if (!newOpen) {
			form.reset(initialData || DEFAULT_VALUES);
		}
	};

	const onSubmit = (values: CreateMedicalCategoryInput) => {
		if (mode === "edit" && categoryId) {
			updateCategory(
				{ id: categoryId, data: values },
				{
					onSuccess: () => {
						handleOpenChange(false);
						toast.success("Medical category updated successfully");
					},
				},
			);
		} else {
			createCategory(values, {
				onSuccess: () => {
					handleOpenChange(false);
					toast.success("Medical category created successfully");
				},
			});
		}
	};

	const defaultTrigger = (
		<Button className="gap-2">
			<Plus className="h-4 w-4" />
			Add Category
		</Button>
	);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>

			<DialogContent className="max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">
						{mode === "edit" ? "Edit Medical Category" : "Add Medical Category"}
					</DialogTitle>
					<DialogDescription>
						{mode === "edit"
							? "Update the medical category details below."
							: "Create a new medical category for hospitals or doctors."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
					{/* Basic Information */}
					<section className="space-y-4">
						<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
							Basic Information
						</p>

						<FieldGroup>
							{/* Name */}
							<Controller
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="category-name">
											Category Name <span className="text-destructive">*</span>
										</FieldLabel>
										<Input
											{...field}
											id="category-name"
											aria-invalid={fieldState.invalid}
											placeholder="e.g. Cardiology, Neurology"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							{/* Type */}
							<Controller
								name="type"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="category-type">
											Type <span className="text-destructive">*</span>
										</FieldLabel>
										<Select
											name={field.name}
											value={field.value}
											onValueChange={field.onChange}
										>
											<SelectTrigger
												id="category-type"
												aria-invalid={fieldState.invalid}
											>
												<SelectValue placeholder="Select type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="hospital">Hospital</SelectItem>
												<SelectItem value="doctor">Doctor</SelectItem>
											</SelectContent>
										</Select>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							{/* Description */}
							<Controller
								name="description"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="category-description">
											Description
										</FieldLabel>
										<Textarea
											{...field}
											id="category-description"
											aria-invalid={fieldState.invalid}
											placeholder="Brief description of this medical category"
											rows={3}
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							{/* Active Status */}
							<Controller
								name="isActive"
								control={form.control}
								render={({ field }) => (
									<Field>
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<FieldLabel htmlFor="category-active">
													Active Status
												</FieldLabel>
												<p className="text-xs text-muted-foreground">
													Enable this category to be visible in the system
												</p>
											</div>
											<Switch
												id="category-active"
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</div>
									</Field>
								)}
							/>
						</FieldGroup>
					</section>

					{/* Submit Button */}
					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{mode === "edit" ? "Update Category" : "Create Category"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
