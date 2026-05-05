"use client";

import { Loader2, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { GetDoctorHospitalsReturn } from "@/actions/doctorHospital.action";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	useDeleteDoctorHospital,
	useFetchDoctorHospitals,
} from "@/hooks/useDoctorHospitals";
import type { Weekday } from "@/models/doctorhospital.model";
import type { UpdateDoctorHospitalInput } from "@/validators/doctorHospitals";
import { DoctorHospitalFormDialog } from "./DoctorHospitalFormDialog";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AssignmentItem = GetDoctorHospitalsReturn["items"][number];

type PopulatedHospital = {
	_id?: unknown;
	name?: string;
	address?: { area?: string };
};

type ScheduleSlot = {
	day: Weekday;
	startTime: string;
	endTime: string;
	maxPatients: number;
};

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DoctorHospitalsModalProps {
	doctorId: string;
	doctorName: string;
	trigger?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DoctorHospitalsModal({
	doctorId,
	doctorName,
	trigger,
}: DoctorHospitalsModalProps) {
	const [open, setOpen] = useState(false);

	// Only fetch when the modal is open to avoid unnecessary requests
	const { data, isLoading } = useFetchDoctorHospitals(
		{ doctor: doctorId, pageSize: 100 },
		open,
	);

	const { mutate: deleteAssignment } = useDeleteDoctorHospital();

	const assignments = (data?.items ?? []) as AssignmentItem[];

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				{trigger ?? (
					<Button variant="outline" size="sm">
						Hospital Assignments
					</Button>
				)}
			</DialogTrigger>

			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-7xl w-[95vw]">
				<DialogHeader>
					<DialogTitle>Hospital Assignments</DialogTitle>
					<DialogDescription>
						Managing hospital assignments for{" "}
						<span className="font-medium text-foreground">{doctorName}</span>.
					</DialogDescription>
				</DialogHeader>

				{/* Add button */}
				<div className="flex justify-end">
					<DoctorHospitalFormDialog mode="create" doctorId={doctorId} />
				</div>

				{/* Content */}
				{isLoading ? (
					<div className="flex items-center justify-center py-16">
						<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
					</div>
				) : assignments.length === 0 ? (
					<div className="text-center py-12 border rounded-md text-sm text-muted-foreground">
						No hospital assignments yet. Click "Add Assignment" to get started.
					</div>
				) : (
					<div className="border rounded-md overflow-hidden">
						<div className="overflow-x-auto">
							<Table className="min-w-max">
								<TableHeader>
									<TableRow>
										<TableHead className="bg-primary text-primary-foreground font-semibold min-w-[180px]">
											Hospital
										</TableHead>
										<TableHead className="bg-primary text-primary-foreground font-semibold min-w-[130px]">
											Department
										</TableHead>
										<TableHead className="bg-primary text-primary-foreground font-semibold min-w-[130px]">
											Room / Chamber
										</TableHead>
										<TableHead className="bg-primary text-primary-foreground font-semibold min-w-[220px]">
											Schedule
										</TableHead>
										<TableHead className="bg-primary text-primary-foreground font-semibold min-w-[100px]">
											Fee (৳)
										</TableHead>
										<TableHead className="bg-primary text-primary-foreground font-semibold min-w-[130px]">
											Status
										</TableHead>
										<TableHead className="bg-primary text-primary-foreground font-semibold w-16">
											Actions
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{assignments.map((assignment, index) => {
										const id = String(assignment._id);

										// Hospital may be a populated object or bare string ID
										const hospital = assignment.hospital as
											| PopulatedHospital
											| string;
										const hospitalName =
											typeof hospital === "string"
												? hospital
												: (hospital?.name ?? "Unknown");
										const hospitalId =
											typeof hospital === "string"
												? hospital
												: String(hospital?._id ?? "");

										const scheduleSlots = (assignment.schedule ??
											[]) as unknown as ScheduleSlot[];

										// Build initialData for the edit dialog
										const editInitialData: UpdateDoctorHospitalInput = {
											doctor: doctorId,
											hospital: hospitalId,
											department: assignment.department as string | undefined,
											roomOrChamber: assignment.roomOrChamber as
												| string
												| undefined,
											schedule: scheduleSlots,
											consultationFee: assignment.consultationFee as
												| number
												| undefined,
											appointmentAvailable:
												assignment.appointmentAvailable as boolean,
											isActive: assignment.isActive as boolean,
										};

										return (
											<TableRow
												key={id}
												className={
													index % 2 === 0 ? "bg-background" : "bg-muted/30"
												}
											>
												{/* Hospital */}
												<TableCell className="font-medium whitespace-nowrap">
													{hospitalName}
												</TableCell>

												{/* Department */}
												<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
													{(assignment.department as string) || "—"}
												</TableCell>

												{/* Room / Chamber */}
												<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
													{(assignment.roomOrChamber as string) || "—"}
												</TableCell>

												{/* Schedule */}
												<TableCell>
													{scheduleSlots.length === 0 ? (
														<span className="text-sm text-muted-foreground">
															—
														</span>
													) : (
														<div className="flex flex-wrap gap-1">
															{scheduleSlots.slice(0, 2).map((slot, si) => (
																<Badge
																	key={`${id}-slot-${si}`}
																	variant="secondary"
																	className="text-xs whitespace-nowrap"
																>
																	{slot.day} {slot.startTime}–{slot.endTime}
																</Badge>
															))}
															{scheduleSlots.length > 2 && (
																<Badge
																	variant="outline"
																	className="text-xs whitespace-nowrap"
																>
																	+{scheduleSlots.length - 2} more
																</Badge>
															)}
														</div>
													)}
												</TableCell>

												{/* Consultation Fee */}
												<TableCell className="text-sm whitespace-nowrap">
													{(assignment.consultationFee as number | undefined) !=
													null
														? `৳${(assignment.consultationFee as number).toLocaleString()}`
														: "—"}
												</TableCell>

												{/* Status */}
												<TableCell>
													<div className="flex flex-col gap-1">
														<Badge
															variant={
																(assignment.appointmentAvailable as boolean)
																	? "default"
																	: "outline"
															}
															className="text-xs w-fit whitespace-nowrap"
														>
															{(assignment.appointmentAvailable as boolean)
																? "Appt. Available"
																: "No Appointment"}
														</Badge>
														<Badge
															variant={
																(assignment.isActive as boolean)
																	? "secondary"
																	: "outline"
															}
															className="text-xs w-fit"
														>
															{(assignment.isActive as boolean)
																? "Active"
																: "Inactive"}
														</Badge>
													</div>
												</TableCell>

												{/* Actions */}
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="outline" className="h-8 w-8 p-0">
																<MoreVertical className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															{/* Edit */}
															<DoctorHospitalFormDialog
																mode="edit"
																doctorId={doctorId}
																assignmentId={id}
																initialData={editInitialData}
																trigger={
																	<DropdownMenuItem
																		onSelect={(e) => e.preventDefault()}
																	>
																		<Pencil className="mr-2 h-4 w-4" />
																		Edit
																	</DropdownMenuItem>
																}
															/>

															<DropdownMenuSeparator />

															{/* Delete */}
															<DropdownMenuItem
																onSelect={(e) => e.preventDefault()}
																className="text-destructive focus:text-destructive"
															>
																<AlertDialog>
																	<AlertDialogTrigger asChild>
																		<div className="flex items-center w-full cursor-default">
																			<Trash2 className="mr-2 h-4 w-4" />
																			Delete
																		</div>
																	</AlertDialogTrigger>
																	<AlertDialogContent>
																		<AlertDialogHeader>
																			<AlertDialogTitle>
																				Are you sure?
																			</AlertDialogTitle>
																			<AlertDialogDescription>
																				This will permanently remove{" "}
																				<strong>{hospitalName}</strong> from{" "}
																				{doctorName}&apos;s assignments.
																			</AlertDialogDescription>
																		</AlertDialogHeader>
																		<AlertDialogFooter>
																			<AlertDialogCancel>
																				Cancel
																			</AlertDialogCancel>
																			<AlertDialogAction
																				className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
																				onClick={() =>
																					deleteAssignment(id, {
																						onSuccess: () =>
																							toast.success(
																								"Assignment removed",
																							),
																					})
																				}
																			>
																				Delete
																			</AlertDialogAction>
																		</AlertDialogFooter>
																	</AlertDialogContent>
																</AlertDialog>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</div>
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}
