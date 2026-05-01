"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	FileUp,
	Loader2,
	MoreHorizontal,
	Plus,
	Stethoscope,
	Trash2,
	X,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
	Controller,
	type FieldErrors,
	type Resolver,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { GetHospitalsReturn } from "@/actions/hospital.action";
import type { GetMedicalCategoriesReturn } from "@/actions/medicalCategories.action";
import { Badge } from "@/components/ui/badge";
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
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDoctor, useUpdateDoctor } from "@/hooks/useDoctors";
import { useFetchHospitals } from "@/hooks/useHospitals";
import { useFetchMedicalCategories } from "@/hooks/useMedicalCategories";
import {
	type CreateDoctorInput,
	createDoctorSchema,
	type UpdateDoctorInput,
} from "@/validators/doctors";

type MedicalCategoryItem = GetMedicalCategoriesReturn["items"][number];
type HospitalItem = GetHospitalsReturn["items"][number];

const DEFAULT_VALUES: CreateDoctorInput = {
	name: "",
	slug: "",
	departments: [],
	qualifications: [
		{
			degree: "",
			institution: "",
			passingYear: new Date().getFullYear(),
		},
	],
	designation: "",
	experience: undefined,
	bio: "",
	contact: {
		phone: "",
		email: "",
	},
	profileImage: "",
	gender: undefined,
	bmdc: "",
	speciality: [],
	chamber: [],
	isVerified: false,
	isActive: true,
	rating: 0,
	reviewCount: 0,
};

const slugify = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface DoctorFormDialogProps {
	mode?: "create" | "edit";
	doctorId?: string;
	initialData?: UpdateDoctorInput;
	trigger?: React.ReactNode;
}

function normalizeDoctorFormValues(
	data?: UpdateDoctorInput,
): CreateDoctorInput {
	type QualificationItem = CreateDoctorInput["qualifications"][number];

	const qualificationsSource =
		data?.qualifications && data.qualifications.length > 0
			? data.qualifications
			: DEFAULT_VALUES.qualifications;

	return {
		...DEFAULT_VALUES,
		...data,
		departments: data?.departments ?? [],
		qualifications: qualificationsSource.map(
			(item): QualificationItem => ({
				degree: item.degree ?? "",
				institution: item.institution ?? "",
				passingYear: item.passingYear ?? new Date().getFullYear(),
			}),
		),
		designation: data?.designation ?? "",
		bio: data?.bio ?? "",
		contact: {
			phone: data?.contact?.phone ?? "",
			email: data?.contact?.email ?? "",
		},
		bmdc: data?.bmdc ?? "",
		chamber: data?.chamber ?? [],
		rating: data?.rating ?? 0,
	};
}

const getFirstErrorMessage = (
	errors: FieldErrors<CreateDoctorInput>,
): string => {
	const queue: unknown[] = Object.values(errors);

	while (queue.length > 0) {
		const current = queue.shift();
		if (!current || typeof current !== "object") {
			continue;
		}

		if ("message" in current && typeof current.message === "string") {
			return current.message;
		}

		if (Array.isArray(current)) {
			for (const item of current) {
				queue.push(item);
			}
			continue;
		}

		for (const nested of Object.values(current as Record<string, unknown>)) {
			queue.push(nested);
		}
	}

	return "Please fix the form errors and try again.";
};

export function DoctorFormDialog({
	mode = "create",
	doctorId,
	initialData,
	trigger,
}: DoctorFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [specialityInput, setSpecialityInput] = useState("");
	const [isUploadingImage, setIsUploadingImage] = useState(false);

	const { data: categoriesData } = useFetchMedicalCategories({
		page: 1,
		pageSize: 200,
		type: "doctor",
		isActive: true,
		sortBy: "name",
		sortOrder: "asc",
	});
	const { data: hospitalsData } = useFetchHospitals({
		page: 1,
		pageSize: 200,
	});
	const { mutate: createDoctor, isPending: isCreating } = useCreateDoctor();
	const { mutate: updateDoctor, isPending: isUpdating } = useUpdateDoctor();

	const isPending = isCreating || isUpdating;

	const categories = useMemo(
		() => categoriesData?.items ?? [],
		[categoriesData],
	);
	const hospitals = useMemo(() => hospitalsData?.items ?? [], [hospitalsData]);

	const form = useForm<CreateDoctorInput>({
		resolver: zodResolver(createDoctorSchema) as Resolver<CreateDoctorInput>,
		defaultValues: normalizeDoctorFormValues(initialData),
	});

	useEffect(() => {
		if (!open) {
			form.reset(normalizeDoctorFormValues(initialData));
			setSpecialityInput("");
		}
	}, [open, form, initialData]);

	useEffect(() => {
		form.register("speciality");
	}, [form]);

	const watchedName = form.watch("name");
	useEffect(() => {
		if (mode === "create") {
			form.setValue("slug", slugify(watchedName || ""), { shouldDirty: true });
		}
	}, [watchedName, form, mode]);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "qualifications",
	});

	const uploadToCloudinary = async (file: File) => {
		const formData = new FormData();
		formData.append("files", file);

		const response = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Failed to upload image");
		}

		return response.json() as Promise<{ urls: string[] }>;
	};

	const uploadProfileImage = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		const [file] = files;
		if (!file) return;

		if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
			toast.error("Only JPG, PNG, and WEBP images are allowed");
			event.target.value = "";
			return;
		}

		setIsUploadingImage(true);
		try {
			const data = await uploadToCloudinary(file);
			const imageUrl = data.urls[0];
			if (!imageUrl) {
				throw new Error("Image upload did not return a URL");
			}

			form.setValue("profileImage", imageUrl, { shouldDirty: true });
			toast.success("Profile image uploaded successfully");
			if (event.target) {
				event.target.value = "";
			}
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to upload image";
			toast.error(message);
		} finally {
			setIsUploadingImage(false);
		}
	};

	const onSubmit = (values: CreateDoctorInput) => {
		const pendingSpeciality = specialityInput.trim();
		const speciality = [...(form.getValues("speciality") ?? [])];

		if (pendingSpeciality && !speciality.includes(pendingSpeciality)) {
			speciality.push(pendingSpeciality);
		}

		const payload = {
			...values,
			speciality,
			contact: {
				phone: values.contact.phone.trim(),
				email: values.contact.email.trim(),
			},
			experience:
				typeof values.experience === "number" &&
				!Number.isNaN(values.experience)
					? values.experience
					: undefined,
		};

		if (mode === "edit" && doctorId) {
			updateDoctor(
				{ id: doctorId, data: payload as UpdateDoctorInput },
				{
					onSuccess: () => {
						setOpen(false);
						toast.success("Doctor updated successfully");
					},
				},
			);
			return;
		}

		createDoctor(payload, {
			onSuccess: () => {
				setOpen(false);
				form.reset(DEFAULT_VALUES);
				setSpecialityInput("");
				toast.success("Doctor added successfully");
			},
		});
	};

	const onInvalid = (errors: FieldErrors<CreateDoctorInput>) => {
		toast.error(getFirstErrorMessage(errors));
	};

	const selectedDepartments = form.watch("departments") ?? [];
	const selectedChambers = form.watch("chamber") ?? [];
	const specialities = form.watch("speciality") ?? [];
	const profileImage = form.watch("profileImage");

	const addSpeciality = () => {
		const trimmed = specialityInput.trim();
		if (!trimmed || specialities.includes(trimmed)) return;
		form.setValue("speciality", [...specialities, trimmed], {
			shouldDirty: true,
			shouldValidate: true,
		});
		setSpecialityInput("");
	};

	const removeSpeciality = (value: string) => {
		form.setValue(
			"speciality",
			specialities.filter((s) => s !== value),
			{ shouldDirty: true, shouldValidate: true },
		);
	};

	const defaultTrigger = (
		<Button className="gap-2">
			<Plus className="h-4 w-4" /> Add Doctor
		</Button>
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>

			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-190">
				<DialogHeader>
					<DialogTitle>
						{mode === "edit" ? "Edit Doctor" : "Add New Doctor"}
					</DialogTitle>
					<DialogDescription>
						{mode === "edit"
							? "Update doctor profile and availability details."
							: "Create a new doctor profile for the dashboard."}
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={form.handleSubmit(onSubmit, onInvalid)}
					className="space-y-6 mt-2"
				>
					<section className="space-y-4">
						<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
							Basic Information
						</p>

						<FieldGroup>
							<Controller
								name="name"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Name *</FieldLabel>
										<Input {...field} placeholder="e.g. Dr. Jane Doe" />
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Controller
									name="designation"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Designation *</FieldLabel>
											<Input {...field} placeholder="e.g. Consultant" />
											{fieldState.error && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
								<Controller
									name="experience"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Experience (years)</FieldLabel>
											<Input
												type="number"
												min={0}
												value={field.value ?? ""}
												onChange={(e) => {
													const value = e.target.value;
													field.onChange(
														value === "" ? undefined : Number(value),
													);
												}}
											/>
											{fieldState.error && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Controller
									name="gender"
									control={form.control}
									render={({ field }) => (
										<Field>
											<FieldLabel>Gender</FieldLabel>
											<Select
												value={field.value}
												onValueChange={(value) =>
													field.onChange(value === "none" ? undefined : value)
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="Select gender" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="none">Not specified</SelectItem>
													<SelectItem value="male">Male</SelectItem>
													<SelectItem value="female">Female</SelectItem>
													<SelectItem value="other">Other</SelectItem>
												</SelectContent>
											</Select>
										</Field>
									)}
								/>
								<Controller
									name="bmdc"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>BMDC Registration *</FieldLabel>
											<Input {...field} placeholder="e.g. A-12345" />
											{fieldState.error && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>

							<Controller
								name="slug"
								control={form.control}
								render={({ field }) => (
									<Field>
										<FieldLabel>
											Slug{" "}
											{mode === "create" ? "(auto generated)" : "(optional)"}
										</FieldLabel>
										<Input {...field} placeholder="doctor-slug" />
									</Field>
								)}
							/>

							<Controller
								name="bio"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Bio *</FieldLabel>
										<Textarea
											{...field}
											placeholder="Short professional biography"
											className="min-h-24 resize-none"
										/>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</section>

					<Separator />

					<section className="space-y-4">
						<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
							Profile Image
						</p>

						<Field>
							<FieldLabel>Upload Profile Image</FieldLabel>
							<div className="space-y-3">
								{!profileImage ? (
									<label className="inline-flex">
										<input
											type="file"
											accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
											multiple={false}
											onChange={uploadProfileImage}
											className="hidden"
										/>
										<Button
											type="button"
											variant="outline"
											disabled={isUploadingImage}
											asChild
										>
											<span>
												{isUploadingImage ? (
													<>
														<Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
														Uploading
													</>
												) : (
													<>
														<FileUp className="mr-2 h-4 w-4" /> Upload Image
													</>
												)}
											</span>
										</Button>
									</label>
								) : null}

								{profileImage ? (
									<div className="flex items-start gap-3 rounded-md border p-3">
										<div className="relative h-24 w-24 overflow-hidden rounded-md border bg-muted">
											<Image
												src={profileImage}
												alt="Doctor profile"
												fill
												sizes="96px"
												className="object-cover"
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium">
												Profile image uploaded
											</p>
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => form.setValue("profileImage", "")}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								) : null}
							</div>
						</Field>
					</section>

					<Separator />

					<section className="space-y-4">
						<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
							Associations
						</p>

						<FieldGroup>
							<Controller
								name="departments"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Departments *</FieldLabel>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant="outline"
													className="w-full justify-start"
												>
													<Stethoscope className="mr-2 h-4 w-4" />
													{selectedDepartments.length > 0
														? `${selectedDepartments.length} selected`
														: "Select departments"}
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent className="w-72 max-h-72 overflow-y-auto">
												{categories.length === 0 ? (
													<p className="p-2 text-sm text-muted-foreground">
														No departments available
													</p>
												) : (
													categories.map((category: MedicalCategoryItem) => {
														const categoryId = String(category._id);
														const checked =
															selectedDepartments.includes(categoryId);

														return (
															<DropdownMenuCheckboxItem
																key={categoryId}
																checked={checked}
																onCheckedChange={(isChecked) => {
																	if (isChecked) {
																		field.onChange([
																			...selectedDepartments,
																			categoryId,
																		]);
																	} else {
																		field.onChange(
																			selectedDepartments.filter(
																				(id) => id !== categoryId,
																			),
																		);
																	}
																}}
															>
																{category.name}
															</DropdownMenuCheckboxItem>
														);
													})
												)}
											</DropdownMenuContent>
										</DropdownMenu>

										{selectedDepartments.length > 0 && (
											<div className="mt-2 flex flex-wrap gap-1">
												{categories
													.filter((c: MedicalCategoryItem) =>
														selectedDepartments.includes(String(c._id)),
													)
													.map((c: MedicalCategoryItem) => (
														<Badge key={String(c._id)} variant="secondary">
															{c.name}
														</Badge>
													))}
											</div>
										)}

										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<Controller
								name="chamber"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Chambers (Hospitals) *</FieldLabel>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant="outline"
													className="w-full justify-start"
												>
													<MoreHorizontal className="mr-2 h-4 w-4" />
													{selectedChambers.length > 0
														? `${selectedChambers.length} selected`
														: "Select chambers"}
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent className="w-72 max-h-72 overflow-y-auto">
												{hospitals.length === 0 ? (
													<p className="p-2 text-sm text-muted-foreground">
														No hospitals available
													</p>
												) : (
													hospitals.map((hospital: HospitalItem) => {
														const hospitalId = String(hospital._id);
														const checked =
															selectedChambers.includes(hospitalId);
														return (
															<DropdownMenuCheckboxItem
																key={hospitalId}
																checked={checked}
																onCheckedChange={(isChecked) => {
																	if (isChecked) {
																		field.onChange([
																			...selectedChambers,
																			hospitalId,
																		]);
																	} else {
																		field.onChange(
																			selectedChambers.filter(
																				(id) => id !== hospitalId,
																			),
																		);
																	}
																}}
															>
																{hospital.name}
															</DropdownMenuCheckboxItem>
														);
													})
												)}
											</DropdownMenuContent>
										</DropdownMenu>

										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</section>

					<Separator />

					<section className="space-y-4">
						<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
							Qualifications & Speciality
						</p>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<FieldLabel>Academic Qualifications *</FieldLabel>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() =>
										append({
											degree: "",
											institution: "",
											passingYear: new Date().getFullYear(),
										})
									}
								>
									<Plus className="mr-1 h-3 w-3" /> Add Qualification
								</Button>
							</div>

							{fields.length === 0 && (
								<p className="text-xs text-muted-foreground border border-dashed rounded-md py-2 px-3">
									No qualifications added yet.
								</p>
							)}

							{form.formState.errors.qualifications && (
								<FieldError errors={[form.formState.errors.qualifications]} />
							)}

							{fields.map((qField, index) => (
								<div
									key={qField.id}
									className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start"
								>
									<Input
										placeholder="Degree"
										className="md:col-span-4"
										{...form.register(`qualifications.${index}.degree`)}
									/>
									<Input
										placeholder="Institution"
										className="md:col-span-5"
										{...form.register(`qualifications.${index}.institution`)}
									/>
									<Input
										type="number"
										placeholder="Year"
										className="md:col-span-2"
										value={form.watch(`qualifications.${index}.passingYear`)}
										onChange={(e) => {
											form.setValue(
												`qualifications.${index}.passingYear`,
												Number(e.target.value),
												{ shouldDirty: true },
											);
										}}
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="md:col-span-1"
										onClick={() => remove(index)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>

						<Field>
							<FieldLabel>Speciality</FieldLabel>
							<div className="flex gap-2">
								<Input
									value={specialityInput}
									onChange={(e) => setSpecialityInput(e.target.value)}
									placeholder="e.g. Cardiology"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											addSpeciality();
										}
									}}
								/>
								<Button type="button" variant="outline" onClick={addSpeciality}>
									Add
								</Button>
							</div>
							{specialities.length > 0 && (
								<div className="mt-2 flex flex-wrap gap-2">
									{specialities.map((item) => (
										<Badge key={item} variant="secondary" className="pr-1 py-1">
											{item}
											<X
												className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
												onClick={() => removeSpeciality(item)}
											/>
										</Badge>
									))}
								</div>
							)}
						</Field>
					</section>

					<Separator />

					<section className="space-y-4">
						<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
							Contact & Status
						</p>

						<FieldGroup>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Controller
									name="contact.phone"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Phone *</FieldLabel>
											<Input {...field} placeholder="e.g. 017xxxxxxxx" />
											{fieldState.error && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name="contact.email"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Email *</FieldLabel>
											<Input {...field} placeholder="e.g. doctor@email.com" />
											{fieldState.error && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Controller
									name="rating"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Rating (0-5) *</FieldLabel>
											<Input
												type="number"
												step="0.1"
												min={0}
												max={5}
												value={field.value ?? 0}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
											{fieldState.error && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name="reviewCount"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Review Count</FieldLabel>
											<Input
												type="number"
												min={0}
												value={field.value ?? 0}
												onChange={(e) => field.onChange(Number(e.target.value))}
											/>
											{fieldState.error && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<Controller
									name="isVerified"
									control={form.control}
									render={({ field }) => (
										<Field>
											<div className="flex items-center justify-between rounded-md border p-3">
												<div>
													<FieldLabel>Verified Doctor</FieldLabel>
													<p className="text-xs text-muted-foreground">
														Show verification badge in listings
													</p>
												</div>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</div>
										</Field>
									)}
								/>

								<Controller
									name="isActive"
									control={form.control}
									render={({ field }) => (
										<Field>
											<div className="flex items-center justify-between rounded-md border p-3">
												<div>
													<FieldLabel>Active Profile</FieldLabel>
													<p className="text-xs text-muted-foreground">
														Control doctor visibility in the app
													</p>
												</div>
												<Switch
													checked={field.value}
													onCheckedChange={field.onChange}
												/>
											</div>
										</Field>
									)}
								/>
							</div>
						</FieldGroup>
					</section>

					<div className="flex justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{mode === "edit" ? "Update Doctor" : "Create Doctor"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
