"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { useFetchAreas } from "@/hooks/useAreas";
import { useCreateBusStop, useUpdateBusStop } from "@/hooks/useBusStops";
import {
	type CreateBusStopInput,
	createBusStopSchema,
} from "@/validators/busStops";

interface IBusStop {
	_id: string;
	stopName: string;
	area: string;
	location: {
		type: "Point";
		coordinates: [number, number];
	};
	createdAt?: string;
	updatedAt?: string;
}

interface BusStopFormDialogProps {
	busStop?: IBusStop;
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function BusStopFormDialog({
	busStop,
	trigger,
	open: controlledOpen,
	onOpenChange,
}: BusStopFormDialogProps) {
	const [localOpen, setLocalOpen] = useState(false);
	const { data: areas = [] } = useFetchAreas();
	const { mutate: createStop, isPending: isCreating } = useCreateBusStop();
	const { mutate: updateStop, isPending: isUpdating } = useUpdateBusStop();
	const isPending = isCreating || isUpdating;
	const isEditing = !!busStop;

	// Handle controlled vs uncontrolled open state
	const isOpen = controlledOpen !== undefined ? controlledOpen : localOpen;
	const handleOpenChange = (newOpen: boolean) => {
		if (controlledOpen !== undefined) {
			onOpenChange?.(newOpen);
		} else {
			setLocalOpen(newOpen);
		}
	};

	const form = useForm<CreateBusStopInput>({
		resolver: zodResolver(createBusStopSchema) as Resolver<CreateBusStopInput>,
		defaultValues: {
			stopName: "",
			area: "",
			latitude: 0,
			longitude: 0,
		},
	});

	// Initialize form with busStop data when in edit mode
	useEffect(() => {
		if (isEditing && busStop) {
			form.setValue("stopName", busStop.stopName);
			form.setValue("area", busStop.area);
			form.setValue("latitude", busStop.location.coordinates[1]);
			form.setValue("longitude", busStop.location.coordinates[0]);
		}
	}, [isEditing, busStop, form]);

	const onSubmit = (values: CreateBusStopInput) => {
		if (isEditing && busStop) {
			updateStop(
				{ id: busStop._id, data: values },
				{
					onSuccess: () => {
						handleOpenChange(false);
						form.reset();
					},
				},
			);
		} else {
			createStop(values, {
				onSuccess: () => {
					handleOpenChange(false);
					form.reset();
				},
			});
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(val) => {
				handleOpenChange(val);
				if (!val) form.reset();
			}}
		>
			<DialogTrigger asChild>
				{trigger || (
					<Button className="gap-2">
						<Plus className="h-4 w-4" /> Add Bus Stop
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{isEditing ? "Edit Bus Stop" : "Add New Bus Stop"}
					</DialogTitle>
					<DialogDescription>
						Provide the stop name and exact coordinates to add it to the route
						system.
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
					<FieldGroup>
						<Controller
							name="stopName"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Stop Name *</FieldLabel>
									<Input {...field} placeholder="e.g. Shankar Bus Stand" />
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

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
											{areas.map((a: { name: string; _id: string }) => (
												<SelectItem key={a._id} value={a.name}>
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
								name="latitude"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Latitude *</FieldLabel>
										<Input
											{...field}
											type="number"
											step="any"
											onChange={(e) =>
												field.onChange(
													e.target.value === "" ? 0 : Number(e.target.value),
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
								name="longitude"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Longitude *</FieldLabel>
										<Input
											{...field}
											type="number"
											step="any"
											onChange={(e) =>
												field.onChange(
													e.target.value === "" ? 0 : Number(e.target.value),
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
					</FieldGroup>

					<div className="flex justify-end gap-3 pt-2">
						<Button
							type="button"
							variant="outline"
							onClick={() => handleOpenChange(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending} className="min-w-24">
							{isPending ? (
								<>
									<Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving...
								</>
							) : isEditing ? (
								"Update Stop"
							) : (
								"Save Stop"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
