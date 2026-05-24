"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { IShopPopulated } from "@/actions/shop.action";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateShop, useUpdateShop } from "@/hooks/useShops";
import { type ShopInput, shopInputSchema } from "@/validators/shops";

// function getErrorMessage(error: unknown): string {
// 	if (error instanceof Error) return error.message;
// 	if (typeof error === "object" && error !== null && "message" in error) {
// 		const msg = (error as Record<string, unknown>).message;
// 		return typeof msg === "string" ? msg : "An error occurred";
// 	}
// 	return "An error occurred";
// }

function Field({
	label,
	error,
	children,
}: {
	label: string;
	error?: string;
	children: React.ReactNode;
}) {
	return (
		<div className="space-y-1.5">
			<Label className="text-xs font-semibold text-slate-700">{label}</Label>
			{children}
			{error && <p className="text-[11px] text-red-500">{error}</p>}
		</div>
	);
}

function buildShopDefaults(editing: IShopPopulated | null): ShopInput {
	if (!editing) {
		return {
			name: "",
			location: "",
			lat: undefined,
			long: undefined,
			rating: 0,
			website: "",
			phone: "",
		};
	}
	return {
		name: editing.name,
		location: editing.location,
		lat: editing.lat,
		long: editing.long,
		rating: editing.rating ?? 0,
		website: editing.website ?? "",
		phone: editing.phone ?? "",
	};
}

export function ShopFormDialog({
	open,
	onOpenChange,
	editing,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	editing: IShopPopulated | null;
}) {
	const createMutation = useCreateShop();
	const updateMutation = useUpdateShop();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<ShopInput>({
		resolver: zodResolver(shopInputSchema),
		defaultValues: buildShopDefaults(editing),
	});

	// ✅ FIX: re-initialize whenever editing changes
	useEffect(() => {
		reset(buildShopDefaults(editing));
	}, [editing, reset]);

	const onSubmit = async (data: ShopInput) => {
		if (editing) {
			await updateMutation.mutateAsync({ id: editing._id, data });
		} else {
			await createMutation.mutateAsync(data);
		}
		onOpenChange(false);
	};

	const isPending = createMutation.isPending || updateMutation.isPending;

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{editing ? "Edit Shop" : "Add New Shop"}</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					<Field label="Shop Name" error={errors.name?.message}>
						<Input placeholder="e.g. TechHub Dhaka" {...register("name")} />
					</Field>

					<Field label="Location" error={errors.location?.message}>
						<Input
							placeholder="e.g. Bashundhara City, Dhaka"
							{...register("location")}
						/>
					</Field>

					<div className="grid grid-cols-2 gap-4">
						<Field label="Latitude" error={errors.lat?.message}>
							<Input
								type="number"
								step="any"
								placeholder="23.8103"
								{...register("lat", { valueAsNumber: true })}
							/>
						</Field>
						<Field label="Longitude" error={errors.long?.message}>
							<Input
								type="number"
								step="any"
								placeholder="90.4125"
								{...register("long", { valueAsNumber: true })}
							/>
						</Field>
					</div>

					<Field label="Rating (0–5)" error={errors.rating?.message}>
						<Input
							type="number"
							step="0.1"
							min="0"
							max="5"
							placeholder="4.5"
							{...register("rating", { valueAsNumber: true })}
						/>
					</Field>

					<Field label="Website (optional)" error={errors.website?.message}>
						<Input
							type="url"
							placeholder="https://..."
							{...register("website")}
						/>
					</Field>

					<Field label="Phone (optional)" error={errors.phone?.message}>
						<Input placeholder="+880 1XXX XXXXXX" {...register("phone")} />
					</Field>

					<div className="flex gap-2 pt-2">
						<Button type="submit" disabled={isPending} className="flex-1">
							{isPending ? "Saving..." : editing ? "Update Shop" : "Add Shop"}
						</Button>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							className="flex-1"
						>
							Cancel
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
