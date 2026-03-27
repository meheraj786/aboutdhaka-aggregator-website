import { z } from "zod";

export const createRestaurantSchema = z.object({
  name: z.string().min(1, "Name is required"),
  area: z.string().min(1, "Area is required"),
  location: z.string().min(1, "Location is required"),
  category: z.string().default(""),
  detail: z.string().default(""),
  rating: z.coerce.number().default(0),
  phone: z.string().default(""),
  amenities: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
  menu: z
    .array(
      z.object({
        name: z.string().min(1, "Item name is required"),
        price: z.string().min(1, "Price is required"),
      }),
    )
    .default([]),
  hours: z.record(z.string()).optional(),
});

export const updateRestaurantSchema = createRestaurantSchema.partial();

export type CreateRestaurantInput = z.infer<typeof createRestaurantSchema>;
export type UpdateRestaurantInput = z.infer<typeof updateRestaurantSchema>;
