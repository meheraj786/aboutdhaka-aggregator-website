"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Activity,
	FileUp,
	Loader2,
	Plus,
	Stethoscope,
	Trash2,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import {
	Controller,
	type Resolver,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { GetMedicalCategoriesReturn } from "@/actions/medicalCategories.action";
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
import { Textarea } from "@/components/ui/textarea";
import { useFetchAreas } from "@/hooks/useAreas";
import { useCreateHospital } from "@/hooks/useHospitals";
import { useFetchMedicalCategories } from "@/hooks/useMedicalCategories";
import {
	type CreateHospitalInput,
	createHospitalSchema,
} from "@/validators/hospitals";

type MedicalCategoryItem = GetMedicalCategoriesReturn["items"][number];

// Separate component for facilities field to avoid hooks in render function
function FacilitiesField({
	value,
	onChange,
	error,
}: {
	value: string[];
	onChange: (value: string[]) => void;
	error?: { message?: string };
}) {
	const [localValue, setLocalValue] = useState(value?.join(", ") || "");

	// Sync local value when field value changes externally
	useEffect(() => {
		setLocalValue(value?.join(", ") || "");
	}, [value]);

	return (
		<Field>
			<FieldLabel>Facilities (comma-separated) *</FieldLabel>
			<Textarea
				value={localValue}
				onChange={(e) => {
					setLocalValue(e.target.value);
				}}
				onBlur={() => {
					// Convert to array when user leaves the field
					const cleanedArray = localValue
						.split(",")
						.map((f) => f.trim())
						.filter(Boolean);
					onChange(cleanedArray);
				}}
				placeholder="e.g. Parking, WiFi, Cafeteria"
				className="min-h-20 resize-none"
			/>
			{error && <FieldError errors={[error]} />}
		</Field>
	);
}

const DISTRICTS = [
	"Dhaka",
	"Chittagong",
	"Khulna",
	"Rajshahi",
	"Barisal",
	"Sylhet",
	"Rangpur",
	"Mymensingh",
];

const slugify = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const DEFAULT_VALUES: CreateHospitalInput = {
	name: "",
	types: [],
	address: {
		area: "",
		district: "Dhaka",
		division: "Dhaka",
		coordinates: {
			lat: 0,
			lng: 0,
		},
	},
	contact: {
		phone: [""],
		email: "",
		website: "",
	},
	services: [],
	testPrices: [],
	images: [],
	thumbnail: "",
	facilities: [],
	totalBeds: 0,
	established: 0,
	reviews: [],
	googleMapReviewLink: "",
	isVerified: false,
	isActive: true,
	rating: 0,
};

export function HospitalFormDialog() {
	const [open, setOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
	const [uploadedImages, setUploadedImages] = useState<string[]>([]);
	const [uploadedThumbnail, setUploadedThumbnail] = useState("");
	const { data: areasData = [] } = useFetchAreas();
	const { data: categoriesData } = useFetchMedicalCategories({
		type: "hospital",
		isActive: true,
	});
	const { mutate: createHosp, isPending } = useCreateHospital();

	const areas = useMemo(() => areasData, [areasData]);
	const categories = useMemo(
		() => categoriesData?.items ?? [],
		[categoriesData],
	);

	const form = useForm<CreateHospitalInput>({
		resolver: zodResolver(
			createHospitalSchema,
		) as Resolver<CreateHospitalInput>,
		defaultValues: DEFAULT_VALUES,
		mode: "onTouched",
		reValidateMode: "onChange",
	});

	const {
		formState: { errors },
	} = form;

	const watchedName = form.watch("name");

	useEffect(() => {
		const generatedSlug = slugify(watchedName || "");
		form.setValue("slug", generatedSlug, { shouldDirty: true });
	}, [watchedName, form]);

	const {
		fields: testPriceFields,
		append: appendTestPrice,
		remove: removeTestPrice,
	} = useFieldArray({
		control: form.control,
		name: "testPrices",
	});

	const {
		fields: serviceFields,
		append: appendService,
		remove: removeService,
	} = useFieldArray({
		control: form.control,
		name: "services",
	});

	const {
		fields: reviewFields,
		append: appendReview,
		remove: removeReview,
	} = useFieldArray({
		control: form.control,
		name: "reviews",
	});

	const phoneValues = form.watch("contact.phone") || [""];

	const appendPhone = () => {
		form.setValue("contact.phone", [...phoneValues, ""], {
			shouldDirty: true,
		});
	};

	const removePhone = (index: number) => {
		const updatedPhones = phoneValues.filter((_, i) => i !== index);
		form.setValue(
			"contact.phone",
			updatedPhones.length ? updatedPhones : [""],
			{
				shouldDirty: true,
			},
		);
	};

	const uploadToCloudinary = async (files: FileList) => {
		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append("files", files[i]);
		}

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

	const uploadImages = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		setIsUploading(true);
		try {
			const data = await uploadToCloudinary(files);
			const currentImages = form.getValues("images") || [];
			form.setValue("images", [...currentImages, ...data.urls]);
			setUploadedImages([...uploadedImages, ...data.urls]);
			toast.success(`${data.urls.length} image(s) uploaded successfully`);

			// Reset file input
			if (event.target) {
				event.target.value = "";
			}
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to upload images";
			toast.error(message);
		} finally {
			setIsUploading(false);
		}
	};

	const uploadThumbnail = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		setIsUploadingThumbnail(true);
		try {
			const data = await uploadToCloudinary(files);
			const thumbnailUrl = data.urls[0];
			if (!thumbnailUrl) {
				throw new Error("Thumbnail upload did not return a URL");
			}

			form.setValue("thumbnail", thumbnailUrl);
			setUploadedThumbnail(thumbnailUrl);
			toast.success("Thumbnail uploaded successfully");

			if (event.target) {
				event.target.value = "";
			}
		} catch (error) {
			const message =
				error instanceof Error ? error.message : "Failed to upload thumbnail";
			toast.error(message);
		} finally {
			setIsUploadingThumbnail(false);
		}
	};

	const removeImage = (url: string) => {
		const currentImages = form.getValues("images") || [];
		form.setValue(
			"images",
			currentImages.filter((img) => img !== url),
		);
		setUploadedImages(uploadedImages.filter((img) => img !== url));
	};

	const onSubmit = (values: CreateHospitalInput) => {
		createHosp(values, {
			onSuccess: () => {
				setOpen(false);
				form.reset(DEFAULT_VALUES);
				setUploadedImages([]);
				setUploadedThumbnail("");
				toast.success("Hospital added successfully!");
			},
		});
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(val) => {
				setOpen(val);
				if (!val) {
					form.reset(DEFAULT_VALUES);
					setUploadedImages([]);
					setUploadedThumbnail("");
				}
			}}
		>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="h-4 w-4" /> Add Hospital
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-175">
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

						{/* Categories Field */}
						<Controller
							name="types"
							control={form.control}
							render={({ field, fieldState }) => {
								const selectedTypes = field.value || [];
								const selectedCategories = categories.filter(
									(cat: MedicalCategoryItem) =>
										selectedTypes.includes(String(cat._id)),
								);
								return (
									<Field>
										<FieldLabel>Categories *</FieldLabel>
										<DropdownMenu>
											<DropdownMenuTrigger asChild>
												<Button
													type="button"
													variant="outline"
													className="w-full justify-start font-normal"
												>
													{selectedTypes.length === 0
														? "Select categories..."
														: `${selectedTypes.length} selected`}
												</Button>
											</DropdownMenuTrigger>
											<DropdownMenuContent className="w-75 max-h-75 overflow-y-auto">
												{categories.length === 0 ? (
													<p className="text-sm text-muted-foreground p-2">
														No categories available
													</p>
												) : (
													categories.map((category: MedicalCategoryItem) => {
														const categoryId = String(category._id);
														const isChecked =
															selectedTypes.includes(categoryId);

														return (
															<DropdownMenuCheckboxItem
																key={categoryId}
																checked={isChecked}
																onCheckedChange={(checked) => {
																	if (checked) {
																		field.onChange([
																			...selectedTypes,
																			categoryId,
																		]);
																	} else {
																		field.onChange(
																			selectedTypes.filter(
																				(id: string) => id !== categoryId,
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

										{/* Display selected categories as badges */}
										{selectedCategories.length > 0 && (
											<div className="flex flex-wrap gap-1 mt-2">
												{selectedCategories.map(
													(category: MedicalCategoryItem) => (
														<Badge
															key={String(category._id)}
															variant="secondary"
															className="text-xs"
														>
															{category.name}
														</Badge>
													),
												)}
											</div>
										)}

										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								);
							}}
						/>

						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="rating"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Rating (0-5) *</FieldLabel>
										<Input
											{...field}
											type="text"
											inputMode="numeric"
											min="0"
											max="5"
											placeholder="e.g. 4"
											value={field.value?.toString() ?? ""}
											onChange={(e) => {
												const sanitized = e.target.value.replace(/[^0-9]/g, "");
												const latestDigit = sanitized.slice(-1);

												if (latestDigit === "") {
													field.onChange(undefined);
													return;
												}

												const numeric = Number(latestDigit);
												if (numeric >= 0 && numeric <= 5) {
													field.onChange(numeric);
												}
											}}
										/>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name="slug"
								control={form.control}
								render={({ field }) => (
									<Field>
										<FieldLabel>Slug (auto generated)</FieldLabel>
										<Input {...field} placeholder="hospital-slug" readOnly />
									</Field>
								)}
							/>
						</div>
					</FieldGroup>

					<Separator />

					{/* Address Section */}
					<section className="space-y-3">
						<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
							Address Information *
						</FieldLabel>

						<Controller
							name="address.area"
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
												<SelectItem key={String(a._id)} value={a.name}>
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

						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="address.district"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>District *</FieldLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="Select District" />
											</SelectTrigger>
											<SelectContent>
												{DISTRICTS.map((district) => (
													<SelectItem key={district} value={district}>
														{district}
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
								name="address.division"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Division *</FieldLabel>
										<Input {...field} placeholder="Division" />
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="address.coordinates.lat"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Latitude *</FieldLabel>
										<Input
											type="number"
											step="any"
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value === ""
														? undefined
														: Number(e.target.value),
												)
											}
											placeholder="23.8103"
										/>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name="address.coordinates.lng"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Longitude *</FieldLabel>
										<Input
											type="number"
											step="any"
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value === ""
														? undefined
														: Number(e.target.value),
												)
											}
											placeholder="90.4125"
										/>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>
					</section>

					<Separator />

					{/* Contact Section */}
					<section className="space-y-3">
						<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
							Contact Information *
						</FieldLabel>

						<div className="space-y-2">
							{phoneValues.map((_, index) => (
								<div key={`phone-${index}`} className="flex gap-2 items-end">
									<div className="flex-1">
										<Input
											{...form.register(`contact.phone.${index}`)}
											placeholder="Phone number *"
										/>
									</div>
									{phoneValues.length > 1 && (
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => removePhone(index)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									)}
								</div>
							))}
							{errors.contact?.phone?.message && (
								<p className="text-sm text-destructive">
									{errors.contact.phone.message}
								</p>
							)}
							{phoneValues.map((_, index) => {
								const phoneError = errors.contact?.phone?.[index];
								if (!phoneError) return null;
								return (
									<p
										key={`phone-error-${index}`}
										className="text-sm text-destructive"
									>
										{phoneError.message}
									</p>
								);
							})}
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => appendPhone()}
							>
								<Plus className="h-3 w-3 mr-1" /> Add Phone
							</Button>
						</div>

						<Controller
							name="contact.email"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Email *</FieldLabel>
									<Input
										{...field}
										type="email"
										placeholder="info@hospital.com"
									/>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<Controller
							name="contact.website"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Website *</FieldLabel>
									<Input {...field} placeholder="https://hospital.com" />
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</section>

					<Separator />

					{/* Images Upload Section */}
					<section className="space-y-3">
						<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
							<FileUp className="h-4 w-4" /> Hospital Images ( optional )
						</FieldLabel>
						<div className="border-2 border-dashed rounded-lg p-4">
							<input
								type="file"
								multiple
								accept=".jpg,.jpeg,.png,.webp"
								onChange={uploadImages}
								disabled={isUploading}
								className="hidden"
								id="image-upload"
							/>
							<label
								htmlFor="image-upload"
								className="flex flex-col items-center justify-center cursor-pointer"
							>
								<FileUp className="h-8 w-8 text-muted-foreground mb-2" />
								<span className="text-sm font-medium">
									{isUploading ? "Uploading..." : "Click to upload images"}
								</span>
								<span className="text-xs text-muted-foreground">
									JPG, PNG, WEBP (Max 5MB each)
								</span>
							</label>
						</div>

						{uploadedImages.length > 0 && (
							<div className="grid grid-cols-3 gap-2">
								{uploadedImages.map((url) => (
									<div
										key={url}
										className="relative group rounded-md overflow-hidden"
									>
										<Image
											src={url}
											alt="Hospital"
											width={240}
											height={96}
											className="h-24 w-full object-cover"
											unoptimized
										/>
										<button
											type="button"
											onClick={() => removeImage(url)}
											className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<Trash2 className="h-4 w-4 text-white" />
										</button>
									</div>
								))}
							</div>
						)}

						<div className="space-y-2">
							<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
								<FileUp className="h-4 w-4" /> Thumbnail Upload *
							</FieldLabel>

							{/* Show upload button only when no thumbnail is uploaded */}
							{!uploadedThumbnail && !form.watch("thumbnail") ? (
								<div className="border rounded-lg p-3">
									<input
										type="file"
										accept=".jpg,.jpeg,.png,.webp"
										onChange={uploadThumbnail}
										disabled={isUploadingThumbnail}
										className="hidden"
										id="thumbnail-upload"
									/>
									<label
										htmlFor="thumbnail-upload"
										className="flex items-center justify-center cursor-pointer py-3"
									>
										<span className="text-sm font-medium">
											{isUploadingThumbnail
												? "Uploading thumbnail..."
												: "Upload Thumbnail"}
										</span>
									</label>
								</div>
							) : (
								<div className="space-y-2">
									<div className="relative inline-block">
										<Image
											src={uploadedThumbnail || form.watch("thumbnail") || ""}
											alt="Thumbnail preview"
											width={144}
											height={96}
											className="h-24 w-36 object-cover rounded-md border"
											unoptimized
										/>
									</div>
									<Button
										type="button"
										variant="outline"
										size="sm"
										onClick={() => {
											form.setValue("thumbnail", "");
											setUploadedThumbnail("");
										}}
										className="w-full"
									>
										<Trash2 className="h-4 w-4 mr-1" /> Remove
									</Button>
								</div>
							)}
							{errors.thumbnail?.message && (
								<p className="text-sm text-destructive">
									{errors.thumbnail.message}
								</p>
							)}
						</div>
					</section>

					<Separator />

					{/* Services Section */}
					<section className="space-y-3">
						<div className="flex items-center justify-between">
							<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
								<Activity className="h-4 w-4" /> Services *
							</FieldLabel>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-7 text-xs"
								onClick={() =>
									appendService({
										name: "",
										description: "",
										averageCost: undefined,
									})
								}
							>
								<Plus className="h-3 w-3 mr-1" /> Add Service
							</Button>
						</div>

						<div className="space-y-3">
							{serviceFields.map((field, index) => (
								<div key={field.id} className="space-y-2 p-3 border rounded-md">
									<div className="grid grid-cols-2 gap-2">
										<div>
											<Input
												{...form.register(`services.${index}.name`)}
												placeholder="Service name (e.g., ICU)"
											/>
											{errors.services?.[index]?.name?.message && (
												<p className="text-sm text-destructive mt-1">
													{errors.services[index]?.name?.message}
												</p>
											)}
										</div>
										<div>
											<Input
												{...form.register(`services.${index}.averageCost`, {
													valueAsNumber: true,
												})}
												type="number"
												placeholder="Avg Cost (₳)"
											/>
											{errors.services?.[index]?.averageCost?.message && (
												<p className="text-sm text-destructive mt-1">
													{errors.services[index]?.averageCost?.message}
												</p>
											)}
										</div>
									</div>
									<div className="flex gap-2">
										<Input
											{...form.register(`services.${index}.description`)}
											placeholder="Description (optional)"
											className="flex-1"
										/>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => removeService(index)}
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							))}
							{errors.services?.message && (
								<p className="text-sm text-destructive">
									{errors.services.message}
								</p>
							)}
						</div>
					</section>

					<Separator />

					{/* Diagnostic Tests Section */}
					<section className="space-y-3">
						<div className="flex items-center justify-between">
							<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
								<Stethoscope className="h-4 w-4" /> Diagnostic Tests *
							</FieldLabel>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="h-7 text-xs"
								onClick={() => appendTestPrice({ name: "", price: "" })}
							>
								<Plus className="h-3 w-3 mr-1" /> Add Test
							</Button>
						</div>

						<div className="space-y-2">
							{testPriceFields.map((field, index) => (
								<div key={field.id} className="flex gap-2 items-start">
									<div className="flex-1">
										<Input
											{...form.register(`testPrices.${index}.name`)}
											placeholder="Test Name (e.g., MRI)"
										/>
										{errors.testPrices?.[index]?.name?.message && (
											<p className="text-sm text-destructive mt-1">
												{errors.testPrices[index]?.name?.message}
											</p>
										)}
									</div>
									<div className="w-24">
										<Input
											{...form.register(`testPrices.${index}.price`)}
											placeholder="Price (₳)"
										/>
										{errors.testPrices?.[index]?.price?.message && (
											<p className="text-sm text-destructive mt-1">
												{errors.testPrices[index]?.price?.message}
											</p>
										)}
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="text-muted-foreground hover:text-destructive"
										onClick={() => removeTestPrice(index)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
							{testPriceFields.length === 0 && (
								<p className="text-xs text-center text-muted-foreground py-2 border border-dashed rounded-md">
									No diagnostic tests added yet.
								</p>
							)}
							{errors.testPrices?.message && (
								<p className="text-sm text-destructive">
									{errors.testPrices.message}
								</p>
							)}
						</div>
					</section>

					<Separator />

					{/* Additional Info Section */}
					<section className="space-y-3">
						<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
							Additional Information *
						</FieldLabel>

						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="totalBeds"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Total Beds *</FieldLabel>
										<Input
											{...field}
											type="number"
											placeholder="e.g. 100"
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value === ""
														? undefined
														: Number(e.target.value),
												)
											}
										/>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name="established"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Established Year *</FieldLabel>
										<Input
											{...field}
											type="number"
											placeholder="e.g. 2010"
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value === ""
														? undefined
														: Number(e.target.value),
												)
											}
										/>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>

						<Controller
							name="facilities"
							control={form.control}
							render={({ field, fieldState }) => (
								<FacilitiesField
									value={field.value}
									onChange={field.onChange}
									error={fieldState.error}
								/>
							)}
						/>
						<Controller
							name="googleMapReviewLink"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Google Map Review Link *</FieldLabel>
									<Input {...field} placeholder="https://maps.google.com/..." />
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
									Reviews (at least 2) *
								</FieldLabel>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() =>
										appendReview({
											reviewer: "",
											comment: "",
											time: "",
											initial: "",
											rating: 0,
										})
									}
								>
									<Plus className="h-3 w-3 mr-1" /> Add Review
								</Button>
							</div>

							{reviewFields.map((field, index) => (
								<div key={field.id} className="space-y-2 p-3 border rounded-md">
									<div className="grid grid-cols-2 gap-2">
										<div>
											<Input
												{...form.register(`reviews.${index}.reviewer`)}
												placeholder="Reviewer name"
											/>
											{errors.reviews?.[index]?.reviewer?.message && (
												<p className="text-sm text-destructive mt-1">
													{errors.reviews[index]?.reviewer?.message}
												</p>
											)}
										</div>
										<div>
											<Input
												{...form.register(`reviews.${index}.initial`)}
												placeholder="Initial"
											/>
											{errors.reviews?.[index]?.initial?.message && (
												<p className="text-sm text-destructive mt-1">
													{errors.reviews[index]?.initial?.message}
												</p>
											)}
										</div>
									</div>
									<div className="grid grid-cols-2 gap-2">
										<div>
											<Input
												{...form.register(`reviews.${index}.time`)}
												type="datetime-local"
											/>
											{errors.reviews?.[index]?.time?.message && (
												<p className="text-sm text-destructive mt-1">
													{errors.reviews[index]?.time?.message}
												</p>
											)}
										</div>
										<div>
											<Input
												{...form.register(`reviews.${index}.rating`, {
													valueAsNumber: true,
												})}
												type="number"
												min="0"
												max="5"
												step="0.1"
												placeholder="Rating"
											/>
											{errors.reviews?.[index]?.rating?.message && (
												<p className="text-sm text-destructive mt-1">
													{errors.reviews[index]?.rating?.message}
												</p>
											)}
										</div>
									</div>
									<Textarea
										{...form.register(`reviews.${index}.comment`)}
										placeholder="Comment"
										className="min-h-20 resize-none"
									/>
									{errors.reviews?.[index]?.comment?.message && (
										<p className="text-sm text-destructive mt-1">
											{errors.reviews[index]?.comment?.message}
										</p>
									)}
									<Button
										type="button"
										variant="ghost"
										size="sm"
										onClick={() => removeReview(index)}
									>
										<Trash2 className="h-4 w-4 mr-1" /> Remove Review
									</Button>
								</div>
							))}
							{errors.reviews?.message && (
								<p className="text-sm text-destructive">
									{errors.reviews.message}
								</p>
							)}
						</div>
					</section>

					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isPending || isUploading || isUploadingThumbnail}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="min-w-30"
							disabled={isPending || isUploading || isUploadingThumbnail}
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
