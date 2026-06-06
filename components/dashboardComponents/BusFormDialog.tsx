"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDown, ChevronUp, Loader2, Plus, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
import { useCreateBus, useUpdateBus } from "@/hooks/useBus";
import { useFetchBusStops } from "@/hooks/useBusStops";
import { type CreateBusInput, createBusSchema } from "@/validators/buses";

interface IBusStop {
	_id: string;
	stopName: string;
}

interface IBus {
	_id: string;
	busName: string;
	stops: IBusStop[];
}

interface BusFormDialogProps {
	bus?: IBus;
	trigger?: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function BusFormDialog({
	bus,
	trigger,
	open: controlledOpen,
	onOpenChange,
}: BusFormDialogProps) {
	const [localOpen, setLocalOpen] = useState(false);
	const [selectedStops, setSelectedStops] = useState<string[]>([]);
	const [searchQuery, setSearchQuery] = useState("");
	const { data: busStopsData } = useFetchBusStops({ page: 1, pageSize: 1000 });
	const { mutate: createBus, isPending: isCreating } = useCreateBus();
	const { mutate: updateBus, isPending: isUpdating } = useUpdateBus();
	const isPending = isCreating || isUpdating;
	const isEditing = !!bus;

	// Handle controlled vs uncontrolled open state
	const isOpen = controlledOpen !== undefined ? controlledOpen : localOpen;
	const handleOpenChange = (newOpen: boolean) => {
		if (controlledOpen !== undefined) {
			onOpenChange?.(newOpen);
		} else {
			setLocalOpen(newOpen);
		}
	};

	const busStops = busStopsData?.items ?? [];

	const form = useForm<CreateBusInput>({
		resolver: zodResolver(createBusSchema) as Resolver<CreateBusInput>,
		defaultValues: {
			busName: "",
			stops: [],
		},
	});

	// Initialize form with bus data when in edit mode
	useEffect(() => {
		if (isEditing && bus) {
			const stopIds = bus.stops.map((s) => s._id);
			form.setValue("busName", bus.busName);
			form.setValue("stops", stopIds);
			setSelectedStops(stopIds);
		}
	}, [isEditing, bus, form]);

	// Get stop details for selected stops
	const selectedStopsDetails = useMemo(() => {
		return selectedStops
			.map((id) => busStops.find((stop: { _id: string }) => stop._id === id))
			.filter(Boolean);
	}, [selectedStops, busStops]);

	// Filter available stops based on search and exclude selected
	const filteredStops = useMemo(() => {
		const selectedIds = new Set(selectedStops);
		return busStops.filter(
			(stop: { stopName: string; area: string; _id: string }) => {
				const matchesSearch =
					stop.stopName.toLowerCase().includes(searchQuery.toLowerCase()) ||
					stop.area.toLowerCase().includes(searchQuery.toLowerCase());
				return matchesSearch && !selectedIds.has(stop._id);
			},
		);
	}, [busStops, searchQuery, selectedStops]);

	const onSubmit = (values: CreateBusInput) => {
		if (isEditing && bus) {
			updateBus(
				{ id: bus._id, data: values },
				{
					onSuccess: () => {
						handleOpenChange(false);
						form.reset();
						setSelectedStops([]);
						setSearchQuery("");
					},
				},
			);
		} else {
			createBus(values, {
				onSuccess: () => {
					handleOpenChange(false);
					form.reset();
					setSelectedStops([]);
					setSearchQuery("");
				},
			});
		}
	};

	const addStop = (stopId: string) => {
		setSelectedStops((prev) => {
			const newStops = [...prev, stopId];
			form.setValue("stops", newStops);
			return newStops;
		});
	};

	const removeStop = (stopId: string) => {
		setSelectedStops((prev) => {
			const newStops = prev.filter((id) => id !== stopId);
			form.setValue("stops", newStops);
			return newStops;
		});
	};

	const moveStopUp = (index: number) => {
		if (index > 0) {
			setSelectedStops((prev) => {
				const newStops = [...prev];
				[newStops[index], newStops[index - 1]] = [
					newStops[index - 1],
					newStops[index],
				];
				form.setValue("stops", newStops);
				return newStops;
			});
		}
	};

	const moveStopDown = (index: number) => {
		if (index < selectedStops.length - 1) {
			setSelectedStops((prev) => {
				const newStops = [...prev];
				[newStops[index], newStops[index + 1]] = [
					newStops[index + 1],
					newStops[index],
				];
				form.setValue("stops", newStops);
				return newStops;
			});
		}
	};

	return (
		<Dialog
			open={isOpen}
			onOpenChange={(val) => {
				handleOpenChange(val);
				if (!val) {
					form.reset();
					setSelectedStops([]);
					setSearchQuery("");
				}
			}}
		>
			<DialogTrigger asChild>
				{trigger || (
					<Button className="gap-2">
						<Plus className="h-4 w-4" /> Add Bus
					</Button>
				)}
			</DialogTrigger>
			<DialogContent className="max-w-4xl! max-h-[90vh] overflow-hidden flex flex-col">
				<DialogHeader>
					<DialogTitle>{isEditing ? "Edit Bus" : "Add New Bus"}</DialogTitle>
					<DialogDescription>
						Set bus name and arrange stops in order. Search and select from
						available stops.
					</DialogDescription>
				</DialogHeader>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-6 overflow-hidden flex-1"
				>
					<FieldGroup>
						<Controller
							name="busName"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Bus Name *</FieldLabel>
									<Input
										{...field}
										placeholder="e.g. Route 101 Express, City Bus A"
									/>
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>

					<Field>
						<FieldLabel>Select & Arrange Stops *</FieldLabel>
						{form.formState.errors.stops && (
							<FieldError errors={[form.formState.errors.stops]} />
						)}

						<div className="grid grid-cols-2 gap-4 overflow-hidden flex-1">
							{/* Available Stops */}
							<div className="flex flex-col border border-slate-200 rounded-lg overflow-hidden">
								<div className="p-3 border-b border-slate-200 bg-slate-50">
									<div className="flex items-center gap-2">
										<Search className="w-4 h-4 text-slate-400" />
										<input
											type="text"
											placeholder="Search stops..."
											value={searchQuery}
											onChange={(e) => setSearchQuery(e.target.value)}
											className="flex-1 border-0 bg-transparent text-sm outline-none"
										/>
									</div>
								</div>
								<div className="flex-1 overflow-y-auto">
									{filteredStops.length === 0 ? (
										<p className="p-4 text-sm text-slate-500 text-center">
											{busStops.length === 0
												? "No stops available"
												: "No matching stops"}
										</p>
									) : (
										<div className="space-y-2 p-3">
											{filteredStops.map(
												(stop: {
													_id: string;
													stopName: string;
													area: string;
												}) => (
													<button
														key={stop._id}
														type="button"
														onClick={() => addStop(stop._id)}
														className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors"
													>
														<p className="text-sm font-medium text-slate-900">
															{stop.stopName}
														</p>
														<p className="text-xs text-slate-600">
															{stop.area}
														</p>
													</button>
												),
											)}
										</div>
									)}
								</div>
							</div>

							{/* Selected Stops (in order) */}
							<div className="flex flex-col border border-slate-200 rounded-lg bg-green-50 overflow-hidden">
								<div className="p-3 border-b border-green-200 bg-green-100">
									<p className="text-sm font-semibold text-slate-900">
										Bus Route ({selectedStops.length})
									</p>
								</div>
								<div className="flex-1 overflow-y-auto">
									{selectedStops.length === 0 ? (
										<p className="p-4 text-sm text-slate-500 text-center">
											Add stops to create route
										</p>
									) : (
										<div className="space-y-2 p-3">
											{selectedStopsDetails.map(
												(
													stop: { stopName: string; area: string; _id: string },
													index,
												) => (
													<div
														key={stop?._id}
														className="p-3 bg-white border border-green-300 rounded-lg flex items-center gap-2"
													>
														<div className="flex-1">
															<p className="text-sm font-medium text-slate-900">
																{index + 1}. {stop?.stopName}
															</p>
															<p className="text-xs text-slate-500">
																{stop?.area}
															</p>
														</div>
														<div className="flex gap-1">
															<button
																type="button"
																onClick={() => moveStopUp(index)}
																disabled={index === 0}
																className="p-1 hover:bg-slate-100 disabled:opacity-50 rounded"
																title="Move up"
															>
																<ChevronUp className="w-4 h-4" />
															</button>
															<button
																type="button"
																onClick={() => moveStopDown(index)}
																disabled={index === selectedStops.length - 1}
																className="p-1 hover:bg-slate-100 disabled:opacity-50 rounded"
																title="Move down"
															>
																<ChevronDown className="w-4 h-4" />
															</button>
															<button
																type="button"
																onClick={() => removeStop(stop?._id)}
																className="p-1 hover:bg-red-100 text-red-600 rounded"
																title="Remove"
															>
																<X className="w-4 h-4" />
															</button>
														</div>
													</div>
												),
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</Field>

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
								"Update Bus"
							) : (
								"Save Bus"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
