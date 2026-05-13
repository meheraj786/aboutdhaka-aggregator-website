"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Edit, MoreVertical, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { AreaFormDialog } from "@/components/dashboardComponents/AreaFormDialog";
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
import { useDeleteArea, useFetchPaginatedAreas } from "@/hooks/useAreas";

interface IArea {
	_id: string;
	name: string;
	createdAt?: string;
	updatedAt?: string;
}

export default function AreasPage() {
	const [params, setParams] = useState({ page: 1, pageSize: 10, search: "" });
	const [editingArea, setEditingArea] = useState<IArea | null>(null);
	const [formDialogOpen, setFormDialogOpen] = useState(false);
	const { data, isLoading } = useFetchPaginatedAreas(params);
	const { mutate: deleteArea } = useDeleteArea();

	const handlePaginationChange = useCallback((p: PaginationParams) => {
		setParams((prev) => ({
			...prev,
			page: p.page,
			pageSize: p.pageSize,
			search: p.search ?? "",
		}));
	}, []);

	const columns = useMemo<ColumnDef<IArea>[]>(
		() => [
			{
				accessorKey: "name",
				header: createSortableHeader("Area Name"),
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
									setEditingArea(row.original);
									setFormDialogOpen(true);
								}}
							>
								<Edit className="mr-2 h-4 w-4" /> Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => {
									if (confirm("Are you sure you want to delete this area?")) {
										deleteArea(row.original._id);
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
		[deleteArea],
	);

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Areas</h1>
					<p className="text-muted-foreground text-sm">
						Manage geographic areas in the system.
					</p>
				</div>
				<AreaFormDialog />
			</div>

			{editingArea && (
				<AreaFormDialog
					area={editingArea}
					open={formDialogOpen}
					onOpenChange={(open) => {
						setFormDialogOpen(open);
						if (!open) setEditingArea(null);
					}}
				/>
			)}

			<DataTable<IArea, unknown>
				columns={columns}
				data={(data?.items as IArea[]) ?? []}
				totalCount={data?.totalCount ?? 0}
				currentPage={data?.currentPage ?? 1}
				pageSize={params.pageSize}
				loading={isLoading}
				onPaginationChange={handlePaginationChange}
				searchPlaceholder="Search by area name..."
			/>
		</div>
	);
}
