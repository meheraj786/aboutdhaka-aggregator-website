"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
	Controller,
	type FieldErrors,
	type Resolver,
	useFieldArray,
	useForm,
} from "react-hook-form";
import { toast } from "sonner";
import type { GetHospitalsReturn } from "@/actions/hospital.action";
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
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
	useCreateDoctorHospital,
	useUpdateDoctorHospital,
} from "@/hooks/useDoctorHospitals";
import { useFetchHospitals } from "@/hooks/useHospitals";
import {
	type CreateDoctorHospitalInput,
	createDoctorHospitalSchema,
	type UpdateDoctorHospitalInput,
} from "@/validators/doctorHospitals";

type HospitalItem = GetHospitalsReturn["items"][number];

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const WEEKDAYS = [
	"Saturday",
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
] as const;

const DEFAULT_SCHEDULE_SLOT: CreateDoctorHospitalInput["schedule"][number] = {
	day: "Saturday",
	startTime: "",
	endTime: "",
	maxPatients: 20,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildDefaultValues(
	doctorId: string,
	data?: UpdateDoctorHospitalInput,
): CreateDoctorHospitalInput {
	return {
		doctor: doctorId,
		hospital:
			data?.hospital && typeof data.hospital === "string" ? data.hospital : "",
		department: data?.department ?? "",
		roomOrChamber: data?.roomOrChamber ?? "",
		schedule: data?.schedule?.length
			? data.schedule
			: [{ ...DEFAULT_SCHEDULE_SLOT }],
		consultationFee: data?.consultationFee,
		appointmentAvailable: data?.appointmentAvailable ?? true,
		isActive: data?.isActive ?? true,
	};
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DoctorHospitalFormDialogProps {
	mode?: "create" | "edit";
	doctorId: string;
	assignmentId?: string;
	initialData?: UpdateDoctorHospitalInput;
	trigger?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DoctorHospitalFormDialog({
	mode = "create",
	doctorId,
	assignmentId,
	initialData,
	trigger,
}: DoctorHospitalFormDialogProps) {
	const [open, setOpen] = useState(false);

	const { data: hospitalsData } = useFetchHospitals({ page: 1, pageSize: 200 });
	const hospitals = useMemo(
		() => (hospitalsData?.items ?? []) as HospitalItem[],
		[hospitalsData],
	);

	const { mutate: createAssignment, isPending: isCreating } =
		useCreateDoctorHospital();
	const { mutate: updateAssignment, isPending: isUpdating } =
		useUpdateDoctorHospital();

	const isPending = isCreating || isUpdating;

	const form = useForm<CreateDoctorHospitalInput>({
		resolver: zodResolver(
			createDoctorHospitalSchema,
		) as unknown as Resolver<CreateDoctorHospitalInput>,
		defaultValues: buildDefaultValues(doctorId, initialData),
	});

	// Reset form whenever dialog closes
	useEffect(() => {
		if (!open) {
			form.reset(buildDefaultValues(doctorId, initialData));
		}
	}, [open, doctorId, initialData, form]);

	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "schedule",
	});

	const onSubmit = (values: CreateDoctorHospitalInput) => {
		if (mode === "edit" && assignmentId) {
			updateAssignment(
				{ id: assignmentId, data: values as UpdateDoctorHospitalInput },
				{
					onSuccess: () => {
						setOpen(false);
						toast.success("Assignment updated successfully");
					},
				},
			);
			return;
		}

		createAssignment(values, {
			onSuccess: () => {
				setOpen(false);
				form.reset(buildDefaultValues(doctorId));
				toast.success("Hospital assignment added");
			},
		});
	};

	const defaultTrigger = (
		<Button size="sm" className="gap-2">
			<Plus className="h-4 w-4" />
			Add Assignment
		</Button>
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>

			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						{mode === "edit" ? "Edit Assignment" : "Add Hospital Assignment"}
					</DialogTitle>
					<DialogDescription>
						{mode === "edit"
							? "Update the details of this hospital assignment."
							: "Assign this doctor to a hospital with schedule details."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
					{/* ── Assignment Details ─────────────────────────────────────── */}
					<section className="space-y-4">
						<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
							Assignment Details
						</p>

						<FieldGroup>
							{/* Hospital */}
							<Controller
								name="hospital"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>
											Hospital <span className="text-destructive">*</span>
										</FieldLabel>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger aria-invalid={fieldState.invalid}>
												<SelectValue placeholder="Select hospital" />
											</SelectTrigger>
											<SelectContent>
												{hospitals.map((h) => (
													<SelectItem key={String(h._id)} value={String(h._id)}>
														{h.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								{/* Department */}
								<Controller
									name="department"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Department</FieldLabel>
											<Input
												{...field}
												value={field.value ?? ""}
												placeholder="e.g. Cardiology"
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								{/* Room / Chamber */}
								<Controller
									name="roomOrChamber"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Room / Chamber</FieldLabel>
											<Input
												{...field}
												value={field.value ?? ""}
												placeholder="e.g. Room 201"
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</div>

							{/* Consultation Fee */}
							<Controller
								name="consultationFee"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field data-invalid={fieldState.invalid}>
										<FieldLabel>Consultation Fee (৳)</FieldLabel>
										<Input
											type="number"
											min={0}
											value={field.value ?? ""}
											onChange={(e) =>
												field.onChange(
													e.target.value === ""
														? undefined
														: Number(e.target.value),
												)
											}
											placeholder="e.g. 800"
										/>
										{fieldState.invalid && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>

							{/* Appointment Available */}
							<Controller
								name="appointmentAvailable"
								control={form.control}
								render={({ field }) => (
									<Field>
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<FieldLabel>Appointment Available</FieldLabel>
												<p className="text-xs text-muted-foreground">
													Allow patients to book appointments at this hospital
												</p>
											</div>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</div>
									</Field>
								)}
							/>

							{/* Active */}
							<Controller
								name="isActive"
								control={form.control}
								render={({ field }) => (
									<Field>
										<div className="flex items-center justify-between">
											<div className="space-y-0.5">
												<FieldLabel>Active</FieldLabel>
												<p className="text-xs text-muted-foreground">
													Show this assignment in the system
												</p>
											</div>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</div>
									</Field>
								)}
							/>
						</FieldGroup>
					</section>

					<Separator />

					{/* ── Schedule ───────────────────────────────────────────────── */}
					<section className="space-y-4">
						<div className="flex items-center justify-between">
							<p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
								Schedule Slots
							</p>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={() => append({ ...DEFAULT_SCHEDULE_SLOT })}
							>
								<Plus className="h-4 w-4 mr-1" />
								Add Slot
							</Button>
						</div>

						{fields.length === 0 && (
							<div
								className={`text-sm text-center py-4 border rounded-md ${
									(
										form.formState.errors.schedule as
											| { message?: string }
											| undefined
									)?.message
										? "border-destructive text-destructive"
										: "text-muted-foreground"
								}`}
							>
								{(
									form.formState.errors.schedule as
										| { message?: string }
										| undefined
								)?.message ??
									'No schedule slots yet. Click "Add Slot" to add one.'}
							</div>
						)}

						<div className="space-y-3">
							{fields.map((fieldItem, index) => (
								<div
									key={fieldItem.id}
									className="grid grid-cols-[1fr_1fr_1fr_80px_36px] gap-2 items-start p-3 rounded-md border bg-muted/30"
								>
									{/* Day */}
									<Controller
										name={`schedule.${index}.day`}
										control={form.control}
										render={({ field: f }) => (
											<Field>
												<FieldLabel className="text-xs">Day</FieldLabel>
												<Select value={f.value} onValueChange={f.onChange}>
													<SelectTrigger className="h-8 text-xs">
														<SelectValue />
													</SelectTrigger>
													<SelectContent>
														{WEEKDAYS.map((d) => (
															<SelectItem key={d} value={d} className="text-xs">
																{d}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</Field>
										)}
									/>

									{/* Start Time */}
									<Controller
										name={`schedule.${index}.startTime`}
										control={form.control}
										render={({ field: f }) => {
											const scheduleErrs = form.formState.errors.schedule as
												| FieldErrors<
														CreateDoctorHospitalInput["schedule"][number]
												  >[]
												| undefined;
											const err = scheduleErrs?.[index]?.startTime;
											return (
												<Field data-invalid={!!err}>
													<FieldLabel className="text-xs">
														Start <span className="text-destructive">*</span>
													</FieldLabel>
													<Input
														{...f}
														type="time"
														className="h-8 text-xs"
														aria-invalid={!!err}
													/>
													{err && (
														<FieldError
															errors={[err]}
															className="text-[10px] leading-tight"
														/>
													)}
												</Field>
											);
										}}
									/>

									{/* End Time */}
									<Controller
										name={`schedule.${index}.endTime`}
										control={form.control}
										render={({ field: f }) => {
											const scheduleErrs = form.formState.errors.schedule as
												| FieldErrors<
														CreateDoctorHospitalInput["schedule"][number]
												  >[]
												| undefined;
											const err = scheduleErrs?.[index]?.endTime;
											return (
												<Field data-invalid={!!err}>
													<FieldLabel className="text-xs">
														End <span className="text-destructive">*</span>
													</FieldLabel>
													<Input
														{...f}
														type="time"
														className="h-8 text-xs"
														aria-invalid={!!err}
													/>
													{err && (
														<FieldError
															errors={[err]}
															className="text-[10px] leading-tight"
														/>
													)}
												</Field>
											);
										}}
									/>

									{/* Max Patients */}
									<Controller
										name={`schedule.${index}.maxPatients`}
										control={form.control}
										render={({ field: f }) => {
											const scheduleErrs = form.formState.errors.schedule as
												| FieldErrors<
														CreateDoctorHospitalInput["schedule"][number]
												  >[]
												| undefined;
											const err = scheduleErrs?.[index]?.maxPatients;
											return (
												<Field data-invalid={!!err}>
													<FieldLabel className="text-xs">Max Pts</FieldLabel>
													<Input
														type="number"
														min={1}
														className="h-8 text-xs"
														aria-invalid={!!err}
														value={f.value}
														onChange={(e) => f.onChange(Number(e.target.value))}
													/>
													{err && (
														<FieldError
															errors={[err]}
															className="text-[10px] leading-tight"
														/>
													)}
												</Field>
											);
										}}
									/>

									{/* Remove */}
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-8 w-8 mt-5 text-destructive hover:text-destructive"
										onClick={() => remove(index)}
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							))}
						</div>
					</section>

					{/* ── Footer ─────────────────────────────────────────────────── */}
					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isPending}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isPending}>
							{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{mode === "edit" ? "Update Assignment" : "Add Assignment"}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
