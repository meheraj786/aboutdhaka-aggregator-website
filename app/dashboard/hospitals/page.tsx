"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { GetHospitalsReturn } from "@/actions/hospital.action";
import DataTable, {
	createSortableHeader,
	type PaginationParams,
} from "@/components/dashboardComponents/DataTable";
import { HospitalFormDialog } from "@/components/dashboardComponents/HospitalFormDialog";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteHospital, useFetchHospitals } from "@/hooks/useHospitals";

type HospitalItem = GetHospitalsReturn["items"][number];

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
				id: "area",
				header: "Area",
				cell: ({ row }) => {
					const area = row.original.address?.area ?? "—";
					return <span>{area}</span>;
				},
			},
			{
				id: "district",
				header: "District",
				cell: ({ row }) => {
					const district = row.original.address?.district ?? "—";
					return <span>{district}</span>;
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
