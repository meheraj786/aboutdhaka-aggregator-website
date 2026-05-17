"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { GetHospitalsReturn } from "@/actions/hospital.action";
import DataTable, {
	createSortableHeader,
	type PaginationParams,
} from "@/components/dashboardComponents/DataTable";
import { HospitalFormDialog } from "@/components/dashboardComponents/HospitalFormDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteHospital, useFetchHospitals } from "@/hooks/useHospitals";
import type { CreateHospitalInput } from "@/validators/hospitals";

type HospitalItem = GetHospitalsReturn["items"][number];

const toDateTimeLocal = (value?: string | Date) => {
	if (!value) return "";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "";
	const pad = (n: number) => n.toString().padStart(2, "0");
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const mapHospitalToFormInput = (
	hospital: HospitalItem,
): CreateHospitalInput => ({
	name: hospital.name ?? "",
	types: (hospital.types ?? []) as unknown as CreateHospitalInput["types"],
	about: hospital.about ?? "",
	address: {
		area: hospital.address?.area ?? "",
		district: hospital.address?.district ?? "Dhaka",
		division: hospital.address?.division ?? "Dhaka",
		coordinates: {
			lat: hospital.address?.coordinates?.lat ?? 0,
			lng: hospital.address?.coordinates?.lng ?? 0,
		},
	},
	contact: {
		phone:
			hospital.contact?.phone && hospital.contact.phone.length > 0
				? hospital.contact.phone
				: [""],
		email: hospital.contact?.email ?? "",
		website: hospital.contact?.website ?? "",
	},
	services: hospital.services ?? [],
	testPrices: hospital.testPrices ?? [],
	images: hospital.images ?? [],
	thumbnail: hospital.thumbnail ?? "",
	facilities: hospital.facilities ?? [],
	totalBeds: hospital.totalBeds ?? 0,
	established: hospital.established ?? 0,
	reviews:
		(
			hospital.reviews as
				| Array<{
						reviewer?: string;
						comment?: string;
						time?: string | Date;
						initial?: string;
						rating?: number;
				  }>
				| undefined
		)?.map(
			(review: {
				reviewer?: string;
				comment?: string;
				time?: string | Date;
				initial?: string;
				rating?: number;
			}) => ({
				reviewer: review.reviewer ?? "",
				comment: review.comment ?? "",
				time: toDateTimeLocal(review.time as string | Date),
				initial: review.initial ?? "",
				rating: review.rating ?? 0,
			}),
		) ?? [],
	googleMapReviewLink: hospital.googleMapReviewLink ?? "",
	isVerified: hospital.isVerified ?? false,
	isActive: hospital.isActive ?? true,
	rating: hospital.rating ?? 0,
	slug: hospital.slug,
});

export type GetHospitalsParams = {
	page: number;
	pageSize: number;
	search?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
};

export default function HospitalsPage() {
	const [params, setParams] = useState<GetHospitalsParams>({
		page: 1,
		pageSize: 10,
		search: "",
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const { data, isLoading } = useFetchHospitals(params);
	const { mutate: deleteHosp } = useDeleteHospital();

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
				search: p.search ?? "",
				sortBy: p.sortBy,
				sortOrder: p.sortOrder as "asc" | "desc" | undefined,
			};
		});
	}, []);

	const columns = useMemo<ColumnDef<HospitalItem>[]>(
		() => [
			{
				accessorKey: "name",
				header: createSortableHeader("Hospital Name"),
			},
			{
				id: "categories",
				header: "Categories",
				cell: ({ row }) => {
					const types = (row.original.types ?? []) as string[];
					return types && types.length > 0 ? (
						<div className="flex flex-wrap gap-1">
							{types.map((type) => (
								<Badge key={type} variant="secondary" className="text-xs">
									{type}
								</Badge>
							))}
						</div>
					) : (
						<span className="text-muted-foreground text-sm">—</span>
					);
				},
			},
			{
				id: "area",
				header: "Area",
				cell: ({ row }) => {
					const area = row.original.address?.area ?? "—";
					return <span>{area}</span>;
				},
			},
			{
				id: "phone",
				header: "Phone",
				cell: ({ row }) => {
					const phone = row.original.contact?.phone?.[0] ?? "—";
					return <span>{phone}</span>;
				},
			},
			{
				id: "email",
				header: "Email",
				cell: ({ row }) => {
					const email = row.original.contact?.email ?? "—";
					return <span>{email}</span>;
				},
			},
			{
				accessorKey: "rating",
				header: "Rating",
				cell: ({ row }) => {
					const rating = row.original.rating ?? "—";
					return <span>{rating}</span>;
				},
			},
			{
				id: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="icon">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<HospitalFormDialog
								mode="edit"
								hospitalId={String(row.original._id)}
								initialData={mapHospitalToFormInput(row.original)}
								trigger={
									<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
										<Pencil className="mr-2 h-4 w-4" /> Edit
									</DropdownMenuItem>
								}
							/>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									if (
										confirm("Are you sure you want to delete this hospital?")
									) {
										deleteHosp(String(row.original._id), {
											onSuccess: () => toast.success("Hospital deleted"),
										});
									}
								}}
								className="text-destructive"
							>
								<Trash2 className="mr-2 h-4 w-4" /> Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				),
			},
		],
		[deleteHosp],
	);

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Hospitals</h1>
					<p className="text-muted-foreground text-sm">
						Manage all hospital and clinic listings.
					</p>
				</div>
				<HospitalFormDialog />
			</div>

			<DataTable<HospitalItem, unknown>
				columns={columns}
				data={(data?.items as HospitalItem[]) ?? []}
				totalCount={data?.totalCount ?? 0}
				currentPage={data?.currentPage ?? 1}
				pageSize={params.pageSize}
				loading={isLoading}
				onPaginationChange={handlePaginationChange}
				searchPlaceholder="Search hospitals by name..."
				enableColumnVisibility
				enableExport
			/>
		</div>
	);
}
