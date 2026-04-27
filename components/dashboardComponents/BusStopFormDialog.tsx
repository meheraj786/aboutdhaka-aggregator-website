"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription, // ইমপোর্ট করা হয়েছে
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
import { useCreateBusStop } from "@/hooks/useBusStops";
import {
	type CreateBusStopInput,
	createBusStopSchema,
} from "@/validators/busStops";

export function BusStopFormDialog() {
	const [open, setOpen] = useState(false);
	const { data: areas = [] } = useFetchAreas();
	const { mutate: createStop, isPending } = useCreateBusStop();

	const form = useForm<CreateBusStopInput>({
		resolver: zodResolver(createBusStopSchema) as Resolver<CreateBusStopInput>,
		defaultValues: {
			stopName: "",
			area: "",
			latitude: 0,
			longitude: 0,
		},
	});

	const onSubmit = (values: CreateBusStopInput) => {
		createStop(values, {
			onSuccess: () => {
				setOpen(false);
				form.reset();
			},
		});
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(val) => {
				setOpen(val);
				if (!val) form.reset();
			}}
		>
			<DialogTrigger asChild>
				<Button className="gap-2">
					<Plus className="h-4 w-4" /> Add Bus Stop
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Add New Bus Stop</DialogTitle>
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
							onClick={() => setOpen(false)}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending} className="min-w-24">
							{isPending ? (
								<>
									<Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving...
								</>
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
