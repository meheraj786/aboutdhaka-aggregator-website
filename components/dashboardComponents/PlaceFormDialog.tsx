"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X, FileUp, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useFetchAreas } from "@/hooks/useAreas";
import { useCreatePlace, useUpdatePlace } from "@/hooks/usePlaces";
import { type CreatePlaceInput, createPlaceSchema, PLACE_EXPERIENCE } from "@/validators/places";

const CATEGORIES = [
  "Museum", "Historical", "Park", "Cultural", "Architectural",
  "Religious", "Entertainment", "Nature", "Shopping", "Other",
];

const DAYS = [
  "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday",
  "Thursday", "Friday", "Closed All Week", "Open All Week",
];

const COMMON_FACILITIES = [
  "Parking", "Restroom", "Wheelchair Access", "Cafeteria",
  "WiFi", "Security", "Guided Tour", "Photography Allowed",
];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const DEFAULT_VALUES: CreatePlaceInput = {
  name: "",
  area: "",
  location: "",
  category: "",
  detail: "",
  rating: 0,
  fee: 0,
  facilities: [],
  gallery: [],
  closingDay: "",
  contact: "",
  hours: {},
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

interface PlaceFormDialogProps {
  mode?: "create" | "edit";
  placeId?: string;
  initialData?: any;
  trigger?: React.ReactNode;
}

export function PlaceFormDialog({
  mode = "create",
  placeId,
  initialData,
  trigger,
}: PlaceFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [facilityInput, setFacilityInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const { data: areas = [], isLoading: areasLoading } = useFetchAreas();
  const { mutate: createPlace, isPending: isCreating } = useCreatePlace();
  const { mutate: updatePlace, isPending: isUpdating } = useUpdatePlace();

  const isPending = isCreating || isUpdating;

  const normalizedValues = useMemo(() => {
    if (!initialData) return DEFAULT_VALUES;
    return {
      ...DEFAULT_VALUES,
      ...initialData,
      area: typeof initialData.area === 'object' ? initialData.area._id : initialData.area,
      gallery: initialData.gallery || [],
      facilities: initialData.facilities || [],
      hours: initialData.hours || {},
      experience: initialData.experience || [],
    };
  }, [initialData]);

  const form = useForm({
    resolver: zodResolver(createPlaceSchema),
    defaultValues: normalizedValues,
  });

  useEffect(() => {
    if (open) {
      form.reset(normalizedValues);
    }
  }, [open, normalizedValues, form]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && mode === "create") {
      form.reset(DEFAULT_VALUES);
      setFacilityInput("");
    }
  };

  const onSubmit = (values: CreatePlaceInput) => {
    if (mode === "edit" && placeId) {
      updatePlace({ id: placeId, data: values }, {
        onSuccess: () => {
          setOpen(false);
          toast.success("Place updated successfully");
        }
      });
    } else {
      createPlace(values, {
        onSuccess: () => {
          handleOpenChange(false);
          toast.success("Place created successfully");
        },
      });
    }
  };

  const gallery = form.watch("gallery") ?? [];
  const experience = form.watch("experience") ?? [];

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
    form.setValue("gallery", gallery.filter((g: string) => g !== url), { shouldDirty: true });

  const facilities = form.watch("facilities") ?? [];

  const addFacility = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed || facilities.includes(trimmed)) return;
    form.setValue("facilities", [...facilities, trimmed], { shouldDirty: true });
    setFacilityInput("");
  };

  const removeFacility = (item: string) =>
    form.setValue("facilities", facilities.filter((f: string) => f !== item), { shouldDirty: true });

  const toggleExperience = (exp: typeof PLACE_EXPERIENCE[number]) => {
    const current = form.getValues("experience") as typeof PLACE_EXPERIENCE[number][] || [];
    const updated = current.includes(exp)
      ? current.filter((e) => e !== exp)
      : [...current, exp];
    form.setValue("experience", updated, { shouldDirty: true });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Place
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {mode === "edit" ? "Edit Place" : "Add New Place"}
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
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Name *</FieldLabel>
                    <Input {...field} placeholder="e.g. Ahsan Manzil" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Controller
                  name="area"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Area *</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger disabled={areasLoading}>
                          <SelectValue placeholder={areasLoading ? "Loading…" : "Select area"} />
                        </SelectTrigger>
                        <SelectContent>
                          {areas.map((area) => (
                            <SelectItem key={String(area._id)} value={String(area._id)}>
                              {area.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />

                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel>Category *</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </div>

              <Controller
                name="location"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Location *</FieldLabel>
                    <Input {...field} placeholder="e.g. Sadarghat, Old Dhaka" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="detail"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Description</FieldLabel>
                    <Textarea {...field} placeholder="Write a short description..." className="resize-none min-h-[90px]" />
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </FieldGroup>
          </section>

          <Separator />

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Place Gallery
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
                    {isUploading ? (
                      <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    ) : (
                      <FileUp className="mr-2 h-3 w-3" />
                    )}
                    Upload Images
                  </span>
                </Button>
              </label>
            </div>

            {gallery.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {gallery.map((url: string) => (
                  <div key={url} className="relative aspect-square group rounded-lg overflow-hidden border bg-muted">
                    <Image
                      src={url}
                      alt="Place gallery"
                      fill
                      className="object-cover"
                    />
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
              Experience
            </p>
            <div className="flex flex-wrap gap-2">
              {PLACE_EXPERIENCE.map((exp) => (
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
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Operating Details
            </p>

            <FieldGroup>
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="rating"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Rating (0–5)</FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        step="0.1"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </Field>
                  )}
                />
                <Controller
                  name="fee"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Entry Fee (৳)</FieldLabel>
                      <Input
                        {...field}
                        type="number"
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Controller
                  name="closingDay"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Closing Day</FieldLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {DAYS.map((day) => (
                            <SelectItem key={day} value={day}>{day}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  name="contact"
                  control={form.control}
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Contact</FieldLabel>
                      <Input {...field} placeholder="+880 1XX..." />
                    </Field>
                  )}
                />
              </div>

              <Field>
                <FieldLabel>Opening Hours</FieldLabel>
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <Input
                    type="time"
                    value={form.watch("hours.open") || ""}
                    onChange={(e) => {
                      const current = form.getValues("hours") ?? {};
                      form.setValue("hours", { ...current, open: e.target.value }, { shouldDirty: true });
                    }}
                  />
                  <Input
                    type="time"
                    value={form.watch("hours.close") || ""}
                    onChange={(e) => {
                      const current = form.getValues("hours") ?? {};
                      form.setValue("hours", { ...current, close: e.target.value }, { shouldDirty: true });
                    }}
                  />
                </div>
              </Field>
            </FieldGroup>
          </section>

          <Separator />

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
                  className="text-[10px] uppercase font-bold px-3 py-1 rounded-full border border-slate-200 text-slate-500 hover:border-blue-600 hover:text-blue-600 disabled:opacity-30 transition-all"
                >
                  + {item}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Custom facility..."
                value={facilityInput}
                onChange={(e) => setFacilityInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFacility(facilityInput))}
              />
              <Button type="button" variant="outline" onClick={() => addFacility(facilityInput)}>Add</Button>
            </div>

            {facilities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {facilities.map((item: string) => (
                  <Badge key={item} variant="secondary" className="gap-1 pr-1">
                    {item}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => removeFacility(item)} />
                  </Badge>
                ))}
              </div>
            )}
          </section>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || isUploading} className="min-w-[120px]">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "edit" ? "Update Place" : "Save Place"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}