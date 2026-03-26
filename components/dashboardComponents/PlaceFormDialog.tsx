"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
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
	FieldDescription,
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
import { useCreatePlace } from "@/hooks/usePlaces";
import { type CreatePlaceInput, createPlaceSchema } from "@/validators/places";

// ── Constants ──────────────────────────────────────────────────────────────────

const CATEGORIES = [
	"Museum",
	"Historical",
	"Park",
	"Cultural",
	"Architectural",
	"Religious",
	"Entertainment",
	"Nature",
	"Shopping",
	"Other",
];

const DAYS = [
	"Saturday",
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Closed All Week",
];

const COMMON_FACILITIES = [
	"Parking",
	"Restroom",
	"Wheelchair Access",
	"Cafeteria",
	"WiFi",
	"Security",
	"Guided Tour",
	"Photography Allowed",
];

// ── Component ──────────────────────────────────────────────────────────────────

export function PlaceFormDialog() {
	const [open, setOpen] = useState(false);
	const [facilityInput, setFacilityInput] = useState("");
	const [galleryInput, setGalleryInput] = useState("");

	const { data: areas = [], isLoading: areasLoading } = useFetchAreas();
	const { mutate: createPlace, isPending } = useCreatePlace();

	const form = useForm<CreatePlaceInput>({
		resolver: zodResolver(createPlaceSchema),
		defaultValues: {
			name: "",
			area: "",
			location: "",
			category: "",
			detail: "",
			rating: 0,
			closingDay: "",
			fee: 0,
			contact: "",
			facilities: [],
			gallery: [],
			hours: {},
		},
	});

	useEffect(() => {
		if (!open) {
			form.reset();
			setFacilityInput("");
			setGalleryInput("");
		}
	}, [open, form]);

	const onSubmit = (values: CreatePlaceInput) => {
		createPlace(values, {
			onSuccess: () => {
				setOpen(false);
				toast.success("Event has been created.");
			},
		});
	};

	// ── Facilities helpers ─────────────────────────────────────────────────────
	const facilities = form.watch("facilities") ?? [];

	const addFacility = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed || facilities.includes(trimmed)) return;
		form.setValue("facilities", [...facilities, trimmed]);
		setFacilityInput("");
	};

	const removeFacility = (item: string) =>
		form.setValue(
			"facilities",
			facilities.filter((f) => f !== item),
		);

	// ── Gallery helpers ────────────────────────────────────────────────────────
	const gallery = form.watch("gallery") ?? [];

	const addGalleryUrl = () => {
		const trimmed = galleryInput.trim();
		if (!trimmed || gallery.includes(trimmed)) return;
		form.setValue("gallery", [...gallery, trimmed]);
		setGalleryInput("");
	};

	const removeGalleryUrl = (url: string) =>
		form.setValue(
			"gallery",
			gallery.filter((g) => g !== url),
		);

	// ── Render ─────────────────────────────────────────────────────────────────
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Add Place
				</Button>
			</DialogTrigger>

			<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle className="text-xl font-bold">Add New Place</DialogTitle>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
					{/* ── Basic Info ──────────────────────────────────────────────── */}
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
										<FieldLabel htmlFor="place-name">
											Name <span className="text-destructive">*</span>
										</FieldLabel>
										<Input
											{...field}
											id="place-name"
											aria-invalid={fieldState.invalid}
											placeholder="e.g. Ahsan Manzil"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							{/* Area + Category */}
							<div className="grid grid-cols-2 gap-4">
								<Controller
									name="area"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="place-area">
												Area <span className="text-destructive">*</span>
											</FieldLabel>
											<Select
												name={field.name}
												value={field.value}
												onValueChange={field.onChange}
												disabled={areasLoading}
											>
												<SelectTrigger
													id="place-area"
													aria-invalid={fieldState.invalid}
												>
													<SelectValue
														placeholder={
															areasLoading ? "Loading…" : "Select area"
														}
													/>
												</SelectTrigger>
												<SelectContent>
													{areas.map((area) => (
														<SelectItem
															key={String(area._id)}
															value={String(area._id)}
														>
															{area.name}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name="category"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="place-category">
												Category <span className="text-destructive">*</span>
											</FieldLabel>
											<Select
												name={field.name}
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger
													id="place-category"
													aria-invalid={fieldState.invalid}
												>
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
												<SelectContent>
													{CATEGORIES.map((cat) => (
														<SelectItem key={cat} value={cat}>
															{cat}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>

							{/* Location */}
							<Controller
								name="location"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="place-location">
											Location <span className="text-destructive">*</span>
										</FieldLabel>
										<Input
											{...field}
											id="place-location"
											aria-invalid={fieldState.invalid}
											placeholder="e.g. Sadarghat, Old Dhaka"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							{/* Detail */}
							<Controller
								name="detail"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel htmlFor="place-detail">Description</FieldLabel>
										<Textarea
											{...field}
											id="place-detail"
											aria-invalid={fieldState.invalid}
											placeholder="Write a short description of this place…"
											className="resize-none min-h-[90px]"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</FieldGroup>
					</section>

					<Separator />

					{/* ── Details ─────────────────────────────────────────────────── */}
					<section className="space-y-4">
						<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
							Details
						</p>

						<FieldGroup>
							<div className="grid grid-cols-2 gap-4">
								{/* Rating */}
								<Controller
									name="rating"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="place-rating">
												Rating (0–5)
											</FieldLabel>
											<Input
												{...field}
												id="place-rating"
												type="number"
												step="0.1"
												min={0}
												max={5}
												aria-invalid={fieldState.invalid}
												placeholder="0.0"
												onChange={(e) =>
													field.onChange(parseFloat(e.target.value) || 0)
												}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								{/* Fee */}
								<Controller
									name="fee"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="place-fee">Entry Fee (৳)</FieldLabel>
											<Input
												{...field}
												id="place-fee"
												type="number"
												min={0}
												aria-invalid={fieldState.invalid}
												placeholder="0"
												onChange={(e) =>
													field.onChange(parseFloat(e.target.value) || 0)
												}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4">
								{/* Closing Day */}
								<Controller
									name="closingDay"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="place-closing">
												Closing Day
											</FieldLabel>
											<Select
												name={field.name}
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger
													id="place-closing"
													aria-invalid={fieldState.invalid}
												>
													<SelectValue placeholder="Select day" />
												</SelectTrigger>
												<SelectContent>
													{DAYS.map((day) => (
														<SelectItem key={day} value={day}>
															{day}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								{/* Contact */}
								<Controller
									name="contact"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="place-contact">Contact</FieldLabel>
											<Input
												{...field}
												id="place-contact"
												aria-invalid={fieldState.invalid}
												placeholder="+880 1XX-XXXXXXX"
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>

							{/* Hours */}
							<Field>
								<FieldLabel>Opening Hours</FieldLabel>
								<FieldDescription>
									Optional — leave blank if not applicable.
								</FieldDescription>
								<div className="grid grid-cols-2 gap-4 mt-1">
									<Field>
										<FieldLabel className="text-muted-foreground text-xs">
											Opens at
										</FieldLabel>
										<Input
											type="time"
											onChange={(e) => {
												const current =
													(form.getValues("hours") as Record<string, string>) ??
													{};
												form.setValue("hours", {
													...current,
													open: e.target.value,
												});
											}}
										/>
									</Field>
									<Field>
										<FieldLabel className="text-muted-foreground text-xs">
											Closes at
										</FieldLabel>
										<Input
											type="time"
											onChange={(e) => {
												const current =
													(form.getValues("hours") as Record<string, string>) ??
													{};
												form.setValue("hours", {
													...current,
													close: e.target.value,
												});
											}}
										/>
									</Field>
								</div>
							</Field>
						</FieldGroup>
					</section>

					<Separator />

					{/* ── Facilities ───────────────────────────────────────────────── */}
					<section className="space-y-3">
						<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
							Facilities
						</p>

						<div className="flex flex-wrap gap-2">
							{COMMON_FACILITIES.map((item) => (
								<button
									key={item}
									type="button"
									onClick={() => addFacility(item)}
									disabled={facilities.includes(item)}
									className="text-xs px-3 py-1 rounded-full border border-dashed border-slate-300 text-slate-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
								>
									+ {item}
								</button>
							))}
						</div>

						<div className="flex gap-2">
							<Input
								placeholder="Add custom facility…"
								value={facilityInput}
								onChange={(e) => setFacilityInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addFacility(facilityInput);
									}
								}}
							/>
							<Button
								type="button"
								variant="outline"
								onClick={() => addFacility(facilityInput)}
							>
								Add
							</Button>
						</div>

						{facilities.length > 0 && (
							<div className="flex flex-wrap gap-2">
								{facilities.map((item) => (
									<Badge key={item} variant="secondary" className="gap-1 pr-1">
										{item}
										<button
											type="button"
											onClick={() => removeFacility(item)}
											className="ml-1 rounded-full hover:bg-destructive/20 p-0.5"
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								))}
							</div>
						)}
					</section>

					<Separator />

					{/* ── Gallery ──────────────────────────────────────────────────── */}
					<section className="space-y-3">
						<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
							Gallery URLs
						</p>

						<div className="flex gap-2">
							<Input
								placeholder="Paste image URL…"
								value={galleryInput}
								onChange={(e) => setGalleryInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addGalleryUrl();
									}
								}}
							/>
							<Button type="button" variant="outline" onClick={addGalleryUrl}>
								Add
							</Button>
						</div>

						{gallery.length > 0 && (
							<div className="space-y-2">
								{gallery.map((url, i) => (
									<div
										key={url}
										className="flex items-center gap-2 text-xs bg-muted rounded-lg px-3 py-2"
									>
										<span className="text-muted-foreground w-4">{i + 1}.</span>
										<span className="flex-1 truncate">{url}</span>
										<button
											type="button"
											onClick={() => removeGalleryUrl(url)}
											className="text-muted-foreground hover:text-destructive transition-colors"
										>
											<X className="h-3.5 w-3.5" />
										</button>
									</div>
								))}
							</div>
						)}
					</section>

					{/* ── Submit ───────────────────────────────────────────────────── */}
					<div className="flex justify-end gap-3 pt-2">
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
							disabled={isPending}
							className="min-w-[120px]"
						>
							{isPending ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" />
									Saving…
								</>
							) : (
								"Save Place"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
