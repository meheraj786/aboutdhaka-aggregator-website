"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Loader2, Plus, X } from "lucide-react"; // ImageIcon যোগ করা হয়েছে
import { useMemo, useState } from "react";
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
import { useFetchAreas } from "@/hooks/useAreas";
import { useCreateRestaurant } from "@/hooks/useRestaurants";
import {
	type CreateRestaurantInput,
	createRestaurantSchema,
} from "@/validators/restaurants";

const CATEGORIES = [
	"Fast Food",
	"Fine Dining",
	"Cafe",
	"Buffet",
	"Street Food",
	"Bakery",
];

export function RestaurantFormDialog() {
	const [open, setOpen] = useState(false);
	const [amenityInput, setAmenityInput] = useState("");
	const [galleryInput, setGalleryInput] = useState(""); // Gallery input এর জন্য স্টেট

	const { data: areasData = [] } = useFetchAreas();
	const { mutate: createRes, isPending } = useCreateRestaurant();

	const areas = useMemo(() => areasData, [areasData]);

	const DEFAULT_VALUES: CreateRestaurantInput = {
		name: "",
		area: "",
		location: "",
		category: "",
		detail: "",
		rating: 0,
		phone: "",
		amenities: [],
		gallery: [],
		hours: {},
		menu: undefined,
	};

	const form = useForm<CreateRestaurantInput>({
		resolver: zodResolver(createRestaurantSchema),
		defaultValues: DEFAULT_VALUES,
	});

	const onSubmit = (values: CreateRestaurantInput) => {
		createRes(values, {
			onSuccess: () => {
				setOpen(false);
				form.reset();
				setAmenityInput("");
				setGalleryInput("");
				toast.success("Restaurant added successfully!");
			},
		});
	};

	// --- Amenities Helpers ---
	const amenities = form.watch("amenities") || [];
	const addAmenity = () => {
		if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
			form.setValue("amenities", [...amenities, amenityInput.trim()]);
			setAmenityInput("");
		}
	};

	// --- Gallery Helpers ---
	const gallery = form.watch("gallery") || [];
	const addGalleryUrl = () => {
		const trimmed = galleryInput.trim();
		if (!trimmed) return;

		// সচরাচর URL ভ্যালিডেশন (ঐচ্ছিক, Zod ও এটি চেক করবে)
		if (!trimmed.startsWith("http")) {
			toast.error("Please enter a valid Image URL");
			return;
		}

		if (gallery.includes(trimmed)) {
			toast.error("This image is already added");
			return;
		}

		form.setValue("gallery", [...gallery, trimmed]);
		setGalleryInput("");
	};

	const removeGalleryUrl = (url: string) => {
		form.setValue(
			"gallery",
			gallery.filter((g) => g !== url),
		);
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="h-4 w-4" /> Add Restaurant
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle>Add New Restaurant</DialogTitle>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
					<FieldGroup>
						<Controller
							name="name"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Restaurant Name *</FieldLabel>
									<Input {...field} placeholder="e.g. Sultan's Dine" />
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
								render={({ field }) => (
									<Field>
										<FieldLabel>Area *</FieldLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="Select Area" />
											</SelectTrigger>
											<SelectContent>
												{areas.map((a) => (
													<SelectItem key={a._id} value={a._id}>
														{a.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</Field>
								)}
							/>
							<Controller
								name="category"
								control={form.control}
								render={({ field }) => (
									<Field>
										<FieldLabel>Category</FieldLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="Category" />
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
								)}
							/>
						</div>

						<Controller
							name="location"
							control={form.control}
							render={({ field }) => (
								<Field>
									<FieldLabel>Full Address *</FieldLabel>
									<Input {...field} placeholder="House, Road, Block..." />
								</Field>
							)}
						/>
					</FieldGroup>

					<Separator />

					{/* --- Amenities Section --- */}
					<section className="space-y-3">
						<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
							Amenities
						</FieldLabel>
						<div className="flex gap-2">
							<Input
								value={amenityInput}
								onChange={(e) => setAmenityInput(e.target.value)}
								placeholder="Add amenity (e.g. WiFi, AC)..."
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addAmenity();
									}
								}}
							/>
							<Button type="button" variant="outline" onClick={addAmenity}>
								Add
							</Button>
						</div>
						<div className="flex flex-wrap gap-2">
							{amenities.map((item) => (
								<Badge key={item} variant="secondary" className="pr-1 py-1">
									{item}
									<X
										className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive"
										onClick={() =>
											form.setValue(
												"amenities",
												amenities.filter((a) => a !== item),
											)
										}
									/>
								</Badge>
							))}
						</div>
					</section>

					<Separator />

					{/* --- Gallery Section --- */}
					<section className="space-y-3">
						<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
							Gallery Images (URLs)
						</FieldLabel>
						<div className="flex gap-2">
							<Input
								value={galleryInput}
								onChange={(e) => setGalleryInput(e.target.value)}
								placeholder="Paste image URL here..."
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										addGalleryUrl();
									}
								}}
							/>
							<Button type="button" variant="outline" onClick={addGalleryUrl}>
								<Plus className="h-4 w-4" />
							</Button>
						</div>

						{gallery.length > 0 && (
							<div className="grid grid-cols-1 gap-2 mt-2">
								{gallery.map((url, index) => (
									<div
										key={index}
										className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
									>
										<ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
										<span className="text-xs truncate flex-1">{url}</span>
										<button
											type="button"
											onClick={() => removeGalleryUrl(url)}
											className="text-muted-foreground hover:text-destructive transition-colors"
										>
											<X className="h-4 w-4" />
										</button>
									</div>
								))}
							</div>
						)}
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
								"Save Restaurant"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
