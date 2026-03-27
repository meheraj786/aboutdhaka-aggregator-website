"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	Image as ImageIcon,
	Loader2,
	Plus,
	Trash2,
	Utensils,
	X,
} from "lucide-react";
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
import { useFetchAreas } from "@/hooks/useAreas";
import { useCreateRestaurant } from "@/hooks/useRestaurants";
import {
	type CreateRestaurantInput,
	createRestaurantSchema,
} from "@/validators/restaurants";
import { Textarea } from "../ui/textarea";

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

export function RestaurantFormDialog() {
	const [open, setOpen] = useState(false);
	const [amenityInput, setAmenityInput] = useState("");
	const [galleryInput, setGalleryInput] = useState("");

	const { data: areasData = [] } = useFetchAreas();
	const { mutate: createRes, isPending } = useCreateRestaurant();
	const areas = useMemo(() => areasData, [areasData]);

	const form = useForm<CreateRestaurantInput>({
		resolver: zodResolver(
			createRestaurantSchema,
		) as Resolver<CreateRestaurantInput>,
		defaultValues: DEFAULT_VALUES,
	});

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "menu",
	});

	const onSubmit = (values: CreateRestaurantInput) => {
		createRes(values, {
			onSuccess: () => {
				setOpen(false);
				form.reset(DEFAULT_VALUES);
				setAmenityInput("");
				setGalleryInput("");
				toast.success("Restaurant added successfully!");
			},
			onError: (error) => {
				toast.error(error.message || "Failed to create restaurant");
			},
		});
	};

	const amenities = form.watch("amenities") || [];
	const gallery = form.watch("gallery") || [];

	const addAmenity = () => {
		const trimmed = amenityInput.trim();
		if (trimmed && !amenities.includes(trimmed)) {
			form.setValue("amenities", [...amenities, trimmed]);
			setAmenityInput("");
		}
	};

	const addGalleryUrl = () => {
		const trimmed = galleryInput.trim();
		if (trimmed && !gallery.includes(trimmed)) {
			form.setValue("gallery", [...gallery, trimmed]);
			setGalleryInput("");
		}
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
					<Plus className="h-4 w-4" />
					Add Restaurant
				</Button>
			</DialogTrigger>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
				<DialogHeader>
					<DialogTitle>Add New Restaurant</DialogTitle>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
					{/* Basic Info */}
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
										<FieldLabel>Rating</FieldLabel>
										<Input {...field} placeholder="e.g. 4.5" />
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
							<Controller
								name="phone"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Phone</FieldLabel>
										<Input {...field} placeholder="e.g. 0123456789" />
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
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
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Add Detail</FieldLabel>
									<Textarea {...field} placeholder="About the Restaurant..." />
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>

					<Separator />

					{/* Menu Section */}
					<section className="space-y-4">
						<div className="flex items-center justify-between">
							<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
								<Utensils className="h-3.5 w-3.5" /> Restaurant Menu
							</FieldLabel>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => append({ name: "", price: "" })}
								className="h-7 text-xs"
							>
								<Plus className="h-3 w-3 mr-1" /> Add Item
							</Button>
						</div>

						<div className="space-y-3">
							{fields.map((field, index) => (
								<div key={field.id} className="flex gap-2 items-start">
									<div className="flex-1">
										<Input
											{...form.register(`menu.${index}.name` as const)}
											placeholder="Item Name (e.g. Kacchi)"
											className={
												form.formState.errors.menu?.[index]?.name
													? "border-destructive"
													: ""
											}
										/>
									</div>
									<div className="w-24">
										<Input
											{...form.register(`menu.${index}.price` as const)}
											placeholder="Price"
											className={
												form.formState.errors.menu?.[index]?.price
													? "border-destructive"
													: ""
											}
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
									No menu items added yet.
								</p>
							)}
						</div>
					</section>

					<Separator />

					{/* Amenities Section */}
					<section className="space-y-3">
						<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
							Amenities
						</FieldLabel>
						<div className="flex gap-2">
							<Input
								value={amenityInput}
								onChange={(e) => setAmenityInput(e.target.value)}
								placeholder="e.g. WiFi, AC"
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

					{/* Gallery Section */}
					<section className="space-y-3">
						<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
							Gallery Images
						</FieldLabel>
						<div className="flex gap-2">
							<Input
								value={galleryInput}
								onChange={(e) => setGalleryInput(e.target.value)}
								placeholder="Paste image URL..."
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
							<div className="grid grid-cols-1 gap-2">
								{gallery.map((url, index) => (
									<div
										key={index}
										className="flex items-center gap-2 p-2 border rounded-md bg-muted/50"
									>
										<ImageIcon className="h-4 w-4 text-muted-foreground shrink-0" />
										<span className="text-xs truncate flex-1">{url}</span>
										<button
											type="button"
											onClick={() =>
												form.setValue(
													"gallery",
													gallery.filter((g) => g !== url),
												)
											}
											className="text-muted-foreground hover:text-destructive"
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
