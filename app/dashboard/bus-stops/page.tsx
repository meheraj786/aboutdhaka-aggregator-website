"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { BusStopFormDialog } from "@/components/dashboardComponents/BusStopFormDialog";
import DataTable, {
	createSortableHeader,
	type PaginationParams,
} from "@/components/dashboardComponents/DataTable";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteBusStop, useFetchBusStops } from "@/hooks/useBusStops";

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

export default function BusStopsPage() {
	const [params, setParams] = useState({ page: 1, pageSize: 10, search: "" });
	const [editingStop, setEditingStop] = useState<IBusStop | null>(null);
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const { data, isLoading } = useFetchBusStops(params);
	const { mutate: deleteStop } = useDeleteBusStop();

	const handlePaginationChange = useCallback((p: PaginationParams) => {
		setParams((prev) => ({
			...prev,
			page: p.page,
			pageSize: p.pageSize,
			search: p.search ?? "",
		}));
	}, []);

	const columns = useMemo<ColumnDef<IBusStop>[]>(
		() => [
			{
				accessorKey: "stopName",
				header: createSortableHeader("Stop Name"),
			},
			{
				accessorKey: "area",
				header: "Area",
			},
			{
				id: "location",
				header: "Coordinates",
				cell: ({ row }) => {
					const [lng, lat] = row.original.location.coordinates;
					return (
						<span className="text-xs font-mono">
							{lat.toFixed(4)}, {lng.toFixed(4)}
						</span>
					);
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
									setEditingStop(row.original);
									setFormDialogOpen(true);
								}}
							>
								<Edit className="mr-2 h-4 w-4" /> Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									if (confirm("Are you sure you want to delete this stop?")) {
										deleteStop(row.original._id);
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
		[deleteStop],
	);

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Bus Stops</h1>
					<p className="text-muted-foreground text-sm">
						Manage terminal and midway bus stops.
					</p>
				</div>
				<BusStopFormDialog />
			</div>

			{editingStop && (
				<BusStopFormDialog
					busStop={editingStop}
					open={formDialogOpen}
					onOpenChange={(open) => {
						setFormDialogOpen(open);
						if (!open) setEditingStop(null);
					}}
				/>
			)}

			<DataTable<IBusStop, unknown>
				columns={columns}
				data={(data?.items as IBusStop[]) ?? []}
				totalCount={data?.totalCount ?? 0}
				currentPage={data?.currentPage ?? 1}
				pageSize={params.pageSize}
				loading={isLoading}
				onPaginationChange={handlePaginationChange}
				searchPlaceholder="Search by stop name..."
			/>
		</div>
	);
}
