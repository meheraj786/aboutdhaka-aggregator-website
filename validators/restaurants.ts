
import { z } from "zod";

export const RESTAURANT_EXPERIENCES = [
  "Date Night",
  "Family",
  "Friends",
  "Business Meeting",
  "Celebration",
  "Rooftop",
] as const;

export const createRestaurantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  area: z.string().min(1, "Area is required"),
  location: z.string().min(1, "Location is required"),
  category: z.string(),
  detail: z.string(),
  rating: z.number().min(0).max(5),
  phone: z.string(),
  amenities: z.array(z.string()),
  gallery: z.array(z.string()),
  menu: z.array(
    z.object({
      name: z.string().min(1, "Item name is required"),
      price: z.string().min(1, "Price is required"),
    }),
  ),
  hours: z.record(z.string(), z.string()).optional(),
  experience: z.array(z.enum(RESTAURANT_EXPERIENCES)).default([]),
});

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export const updateRestaurantSchema = createRestaurantSchema.partial();