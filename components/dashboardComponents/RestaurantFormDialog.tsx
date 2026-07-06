"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, Loader2, Plus, Trash2, Utensils, X, FileUp } from "lucide-react";
import Image from "next/image";
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
  RESTAURANT_EXPERIENCES,
} from "@/validators/restaurants";

const CATEGORIES = [
  "Fast Food",
  "Fine Dining",
  "Cafe",
  "Buffet",
  "Street Food",
  "Bakery",
];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

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
  experience: [],
};

const uploadToCloudinary = async (files: FileList) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to upload images");
  }

  return response.json() as Promise<{ urls: string[] }>;
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
  const [isUploading, setIsUploading] = useState(false);

  const { data: areasData = [] } = useFetchAreas();
  const { mutate: createRes, isPending: isCreating } = useCreateRestaurant();
  const { mutate: updateRes, isPending: isUpdating } = useUpdateRestaurant();

  const isEdit = !!restaurant;
  const isPending = isCreating || isUpdating;

  const form = useForm({
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
          experience: restaurant.experience || [],
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

  const gallery = form.watch("gallery") || [];
  const experience = form.watch("experience") || [];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const invalidFiles = Array.from(files).filter(f => !ALLOWED_IMAGE_TYPES.includes(f.type));
    if (invalidFiles.length > 0) {
      toast.error("Only JPG, PNG, and WEBP images are allowed");
      return;
    }

    setIsUploading(true);
    try {
      const data = await uploadToCloudinary(files);
      form.setValue("gallery", [...gallery, ...data.urls], { shouldDirty: true });
      toast.success(`${data.urls.length} image(s) uploaded successfully`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to upload images";
      toast.error(message);
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const removeGalleryUrl = (url: string) =>
    form.setValue("gallery", gallery.filter((g) => g !== url), { shouldDirty: true });

  const amenities = form.watch("amenities") || [];
  const addAmenity = () => {
    if (amenityInput.trim() && !amenities.includes(amenityInput.trim())) {
      form.setValue("amenities", [...amenities, amenityInput.trim()], { shouldDirty: true });
      setAmenityInput("");
    }
  };

  const toggleExperience = (exp: typeof RESTAURANT_EXPERIENCES[number]) => {
    const current = form.getValues("experience") as typeof RESTAURANT_EXPERIENCES[number][] || [];
    const updated = current.includes(exp)
      ? current.filter((e) => e !== exp)
      : [...current, exp];
    form.setValue("experience", updated, { shouldDirty: true });
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
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Restaurant" : "Add New Restaurant"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Basic Information
            </p>
            <FieldGroup>
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel>Restaurant Name *</FieldLabel>
                    <Input {...field} placeholder="e.g. Sultan's Dine" />
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
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
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
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
                            <SelectItem key={c} value={c}>{c}</SelectItem>
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
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                      {fieldState.error && <FieldError errors={[fieldState.error]} />}
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
                    {fieldState.error && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="detail"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Detail Description</FieldLabel>
                    <Textarea {...field} placeholder="Describe the restaurant..." className="resize-none h-24" />
                  </Field>
                )}
              />
            </FieldGroup>
          </section>

          <Separator />

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Restaurant Gallery
              </p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploading}
                />
                <Button type="button" variant="outline" size="sm" asChild disabled={isUploading}>
                  <span>
                    {isUploading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : <FileUp className="mr-2 h-3 w-3" />}
                    Upload Photos
                  </span>
                </Button>
              </label>
            </div>

            {gallery.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {gallery.map((url) => (
                  <div key={url} className="relative aspect-square group rounded-lg overflow-hidden border bg-muted">
                    <Image src={url} alt="Restaurant" fill className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeGalleryUrl(url)}
                      className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 border border-dashed rounded-xl bg-slate-50/50">
                <ImageIcon className="h-8 w-8 text-slate-300 mb-2" />
                <p className="text-xs text-slate-400">No images uploaded yet</p>
              </div>
            )}
          </section>

          <Separator />

          <section className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Dining Experience
            </p>
            <div className="flex flex-wrap gap-2">
              {RESTAURANT_EXPERIENCES.map((exp) => (
                <Badge
                  key={exp}
                  variant={experience.includes(exp) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/10"
                  onClick={() => toggleExperience(exp)}
                >
                  {exp}
                </Badge>
              ))}
            </div>
          </section>

          <Separator />

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Menu Items
              </p>
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
              {fields.map((item, index) => (
                <div key={item.id} className="flex gap-2 items-start">
                  <Input
                    {...form.register(`menu.${index}.name`)}
                    placeholder="Item name"
                    className="flex-1"
                  />
                  <Input
                    {...form.register(`menu.${index}.price`)}
                    placeholder="Price"
                    className="w-28"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </section>

          <Separator />

          <section className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Amenities
            </p>
            <div className="flex gap-2">
              <Input
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                placeholder="e.g. WiFi, Air Condition"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addAmenity())}
              />
              <Button type="button" variant="outline" onClick={addAmenity}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {amenities.map((item) => (
                <Badge key={item} variant="secondary" className="gap-1 pr-1">
                  {item}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => form.setValue("amenities", amenities.filter((a) => a !== item), { shouldDirty: true })}
                  />
                </Badge>
              ))}
            </div>
          </section>

          <div className="flex justify-end gap-3 pt-4 border-t mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isUploading} className="min-w-[140px]">
              {isPending && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              {isEdit ? "Update Restaurant" : "Create Restaurant"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}