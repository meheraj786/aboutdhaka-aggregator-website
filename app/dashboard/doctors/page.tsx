"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Hospital, Pencil, Star, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type {
	GetDoctorsParams,
	GetDoctorsReturn,
} from "@/actions/doctor.action";
import DataTable, {
	createSortableHeader,
	type PaginationParams,
} from "@/components/dashboardComponents/DataTable";
import { DoctorFormDialog } from "@/components/dashboardComponents/DoctorFormDialog";
import { DoctorHospitalsModal } from "@/components/dashboardComponents/DoctorHospitalsModal";
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

import { useDeleteDoctor, useFetchDoctors } from "@/hooks/useDoctors";
import type { CreateDoctorInput } from "@/validators/doctors";

type DoctorItem = GetDoctorsReturn["items"][number];

export default function DoctorsPage() {
	const [params, setParams] = useState<GetDoctorsParams>({
		page: 1,
		pageSize: 10,
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const { data, isLoading } = useFetchDoctors(params);
	const { mutate: deleteDoctor } = useDeleteDoctor();

	const handlePaginationChange = useCallback((p: PaginationParams) => {
		setParams((prev) => {
			if (
				prev.page === p.page &&
				prev.pageSize === p.pageSize &&
				prev.search === p.search &&
				prev.sortBy === p.sortBy &&
				prev.sortOrder === p.sortOrder
			) {
				return prev;
			}

			return {
				page: p.page,
				pageSize: p.pageSize,
				search: p.search,
				sortBy: p.sortBy,
				sortOrder: p.sortOrder as "asc" | "desc" | undefined,
			};
		});
	}, []);

	const columns = useMemo<ColumnDef<DoctorItem>[]>(
		() => [
			{
				accessorKey: "name",
				header: createSortableHeader("Name"),
				cell: ({ row }) => (
					<div>
						<p className="font-medium">{row.getValue("name")}</p>
						<p className="text-xs text-muted-foreground">
							{row.original.designation || "No designation"}
						</p>
					</div>
				),
			},
			{
				id: "departments",
				header: "Departments",
				cell: ({ row }) => {
					const departments =
						(row.original.departments as Array<
							{ _id?: string; name?: string; slug?: string } | string
						>) ?? [];

					if (departments.length === 0) {
						return <span className="text-sm text-muted-foreground">-</span>;
					}

					return (
						<div className="flex flex-wrap gap-1 max-w-65">
							{departments.slice(0, 2).map((department, index) => {
								const label =
									typeof department === "string"
										? department
										: department.name || department.slug || "Department";

								const key =
									typeof department === "string"
										? `${department}-${index}`
										: (department._id ?? `${label}-${index}`);

								return (
									<Badge key={key} variant="secondary" className="text-xs">
										{label}
									</Badge>
								);
							})}
							{departments.length > 2 ? (
								<Badge variant="outline" className="text-xs">
									+{departments.length - 2}
								</Badge>
							) : null}
						</div>
					);
				},
			},
			{
				accessorKey: "speciality",
				header: "Speciality",
				cell: ({ row }) => {
					const speciality = row.original.speciality ?? [];
					if (!speciality.length) {
						return <span className="text-sm text-muted-foreground">-</span>;
					}

					return (
						<div className="max-w-50 truncate text-sm">
							{speciality.join(", ")}
						</div>
					);
				},
			},
			{
				accessorKey: "experience",
				header: createSortableHeader("Experience"),
				cell: ({ row }) => {
					const experience = row.original.experience;
					return experience ? `${experience} yrs` : "-";
				},
			},
			{
				accessorKey: "rating",
				header: createSortableHeader("Rating"),
				cell: ({ row }) => (
					<div className="flex items-center gap-1">
						<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
						{Number(row.original.rating || 0).toFixed(1)}
					</div>
				),
			},
			{
				accessorKey: "isActive",
				header: "Status",
				cell: ({ row }) => (
					<div className="flex items-center gap-2">
						<Badge variant={row.original.isActive ? "default" : "outline"}>
							{row.original.isActive ? "Active" : "Inactive"}
						</Badge>
						{row.original.isVerified ? (
							<Badge variant="secondary">Verified</Badge>
						) : null}
					</div>
				),
			},
			{
				id: "actions",
				header: "Actions",
				cell: ({ row }) => {
					const doctor = row.original;
					const id = String(doctor._id);
					const departments = (doctor.departments ?? []) as Array<
						string | { _id?: unknown }
					>;
					const chambers = (doctor.chamber ?? []) as Array<
						string | { _id?: unknown }
					>;

					const departmentIds = departments.map((department) =>
						typeof department === "string"
							? department
							: String(department._id),
					) as unknown as CreateDoctorInput["departments"];

					const chamberIds = chambers.map((hospital) =>
						typeof hospital === "string" ? hospital : String(hospital._id),
					);

					return (
						<div className="flex items-center gap-2">
							{/* Hospital Assignments */}
							<DoctorHospitalsModal
								doctorId={id}
								doctorName={doctor.name}
								trigger={
									<Button
										variant="outline"
										size="icon"
										className="h-8 w-8"
										title="Hospital Assignments"
									>
										<Hospital className="h-4 w-4" />
									</Button>
								}
							/>

							{/* Edit */}
							<DoctorFormDialog
								mode="edit"
								doctorId={id}
								initialData={{
									name: doctor.name,
									slug: doctor.slug,
									departments: departmentIds,
									qualifications: doctor.qualifications ?? [],
									designation: doctor.designation,
									experience: doctor.experience,
									bio: doctor.bio,
									contact: {
										phone: doctor.contact?.phone,
										email: doctor.contact?.email,
									},
									profileImage: doctor.profileImage,
									gender: doctor.gender,
									bmdc: doctor.bmdc,
									speciality: doctor.speciality ?? [],
									chamber: chamberIds,
									isVerified: doctor.isVerified,
									isActive: doctor.isActive,
									rating: doctor.rating,
									reviewCount: doctor.reviewCount,
								}}
								trigger={
									<Button
										variant="outline"
										size="icon"
										className="h-8 w-8"
										title="Edit"
									>
										<Pencil className="h-4 w-4" />
									</Button>
								}
							/>

							{/* Delete */}
							<AlertDialog>
								<AlertDialogTrigger asChild>
									<Button
										variant="outline"
										size="icon"
										className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
										title="Delete"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</AlertDialogTrigger>
								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle>Are you sure?</AlertDialogTitle>
										<AlertDialogDescription>
											This will permanently delete this doctor profile.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<AlertDialogAction
											className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
											onClick={() =>
												deleteDoctor(id, {
													onSuccess: () => toast.success("Doctor deleted"),
												})
											}
										>
											Delete
										</AlertDialogAction>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					);
				},
			},
		],
		[deleteDoctor],
	);

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Doctors</h1>
					<p className="text-muted-foreground text-sm mt-1">
						Manage doctor profiles, departments, and chambers.
					</p>
				</div>

				<DoctorFormDialog mode="create" />
			</div>

			<DataTable<DoctorItem, unknown>
				columns={columns}
				data={(data?.items as DoctorItem[]) ?? []}
				totalCount={data?.totalCount ?? 0}
				currentPage={data?.currentPage ?? 1}
				pageSize={params.pageSize}
				onPaginationChange={handlePaginationChange}
				loading={isLoading}
				searchPlaceholder="Search by name, designation, or speciality..."
				enableColumnVisibility
				enableExport
			/>
		</div>
	);
}
