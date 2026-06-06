"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Plus, Trash2, Utensils, X } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { GetRestaurantByIdReturn } from "@/actions/restaurants.action";
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
import {
	useCreateRestaurant,
	useUpdateRestaurant,
} from "@/hooks/useRestaurants";
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
	menu: [],
};

interface RestaurantFormDialogProps {
	restaurant?: GetRestaurantByIdReturn | null;
	trigger?: ReactNode;
}

export function RestaurantFormDialog({
	restaurant = null,
	trigger = null,
}: RestaurantFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [amenityInput, setAmenityInput] = useState("");
	const [galleryInput, setGalleryInput] = useState("");

	const { data: areasData = [] } = useFetchAreas();
	const { mutate: createRes, isPending: isCreating } = useCreateRestaurant();
	const { mutate: updateRes, isPending: isUpdating } = useUpdateRestaurant();

	const isEdit = !!restaurant;

	const form = useForm<CreateRestaurantInput>({
		resolver: zodResolver(createRestaurantSchema),
		defaultValues: DEFAULT_VALUES,
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "menu",
	});

	useEffect(() => {
		if (open) {
			if (isEdit && restaurant) {
				const areaId =
					restaurant.area &&
					typeof restaurant.area === "object" &&
					"_id" in restaurant.area
						? String(restaurant.area._id)
						: String(restaurant.area || "");

				form.reset({
					...restaurant,
					area: areaId,
					menu: restaurant.menu || [],
					amenities: restaurant.amenities || [],
					gallery: restaurant.gallery || [],
					detail: restaurant.detail || "",
					phone: restaurant.phone || "",
					category: restaurant.category || "",
					rating: restaurant.rating || 0,
				} as CreateRestaurantInput);
			} else {
				form.reset(DEFAULT_VALUES);
			}
		}
	}, [open, isEdit, restaurant, form]);

	const onSubmit = (values: CreateRestaurantInput) => {
		if (isEdit && restaurant) {
			updateRes(
				{ id: restaurant._id, data: values },
				{
					onSuccess: () => {
						setOpen(false);
						toast.success("Restaurant updated!");
					},
					onError: (error) => {
						toast.error(error.message || "Something went wrong");
					},
				},
			);
		} else {
			createRes(values, {
				onSuccess: () => {
					setOpen(false);
					toast.success("Restaurant created!");
				},
				onError: (error) => {
					toast.error(error.message || "Something went wrong");
				},
			});
		}
	};

	const amenities = form.watch("amenities") || [];
	const gallery = form.watch("gallery") || [];

	const addAmenity = () => {
		if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
			form.setValue("amenities", [...amenities, amenityInput.trim()]);
			setAmenityInput("");
		}
	};

	const addGalleryUrl = () => {
		if (galleryInput.trim() && !gallery.includes(galleryInput.trim())) {
			form.setValue("gallery", [...gallery, galleryInput.trim()]);
			setGalleryInput("");
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger || (
					<Button className="gap-2">
						<Plus className="h-4 w-4" /> Add Restaurant
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>
						{isEdit ? "Edit Restaurant" : "Add New Restaurant"}
					</DialogTitle>
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
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Area *</FieldLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger>
												<SelectValue placeholder="Select Area" />
											</SelectTrigger>
											<SelectContent>
												{areasData.map((a) => (
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

						<div className="grid grid-cols-2 gap-4">
							<Controller
								name="rating"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Rating (0-5)</FieldLabel>
										<Input
											{...field}
											type="number"
											step="0.1"
											onChange={(e) =>
												field.onChange(e.target.valueAsNumber || 0)
											}
										/>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name="phone"
								control={form.control}
								render={({ field }) => (
									<Field>
										<FieldLabel>Phone Number</FieldLabel>
										<Input {...field} placeholder="017..." />
									</Field>
								)}
							/>
						</div>

						<Controller
							name="location"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Full Address *</FieldLabel>
									<Input {...field} placeholder="House, Road, Block..." />
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
									<FieldLabel>Detail Description</FieldLabel>
									<Textarea
										{...field}
										placeholder="Describe the restaurant..."
									/>
								</Field>
							)}
						/>
					</FieldGroup>

					<Separator />

					{/* Menu Section */}
					<section className="space-y-4">
						<div className="flex items-center justify-between">
							<FieldLabel className="flex items-center gap-2">
								<Utensils className="h-4 w-4" /> Menu Items
							</FieldLabel>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => append({ name: "", price: "" })}
							>
								<Plus className="h-4 w-4 mr-1" /> Add Item
							</Button>
						</div>
						<div className="space-y-3">
							{fields.map((field, index) => (
								<div key={field.id} className="flex gap-2 items-start">
									<Input
										{...form.register(`menu.${index}.name`)}
										placeholder="Item name"
										className="flex-1"
									/>
									<Input
										{...form.register(`menu.${index}.price`)}
										placeholder="Price"
										className="w-24"
									/>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										onClick={() => remove(index)}
										className="text-destructive"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					</section>

					<Separator />

					{/* Amenities */}
					<section className="space-y-3">
						<FieldLabel>Amenities</FieldLabel>
						<div className="flex gap-2">
							<Input
								value={amenityInput}
								onChange={(e) => setAmenityInput(e.target.value)}
								placeholder="e.g. WiFi, Parking"
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
								<Badge key={item} variant="secondary" className="gap-1">
									{item}
									<X
										className="h-3 w-3 cursor-pointer"
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

					{/* Gallery */}
					<section className="space-y-3">
						<FieldLabel>Gallery URLs</FieldLabel>
						<div className="flex gap-2">
							<Input
								value={galleryInput}
								onChange={(e) => setGalleryInput(e.target.value)}
								placeholder="Image URL..."
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
						<div className="grid grid-cols-1 gap-2">
							{gallery.map((url, idx) => (
								<div
									key={idx}
									className="flex items-center gap-2 p-2 border rounded bg-muted/50"
								>
									<ImageIcon className="h-4 w-4 shrink-0" />
									<span className="text-xs truncate flex-1">{url}</span>
									<X
										className="h-4 w-4 cursor-pointer text-destructive"
										onClick={() =>
											form.setValue(
												"gallery",
												gallery.filter((g) => g !== url),
											)
										}
									/>
								</div>
							))}
						</div>
					</section>

					<div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isCreating || isUpdating}>
							{(isCreating || isUpdating) && (
								<Loader2 className="animate-spin mr-2 h-4 w-4" />
							)}
							{isEdit ? "Update Restaurant" : "Create Restaurant"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
