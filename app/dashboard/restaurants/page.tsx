"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Pencil, Star, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type {
	GetRestaurantByIdReturn,
	GetRestaurantsParams,
} from "@/actions/restaurants.action";
import DataTable, {
	createSortableHeader,
	type PaginationParams,
} from "@/components/dashboardComponents/DataTable";
import { RestaurantFormDialog } from "@/components/dashboardComponents/RestaurantFormDialog";
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
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	useDeleteRestaurant,
	useFetchRestaurants,
} from "@/hooks/useRestaurants";

export default function RestaurantsPage() {
	const [params, setParams] = useState<GetRestaurantsParams>({
		page: 1,
		pageSize: 10,
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const { data, isLoading } = useFetchRestaurants(params);
	const { mutate: deleteRes } = useDeleteRestaurant();

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
				sortOrder: p.sortOrder as "asc" | "desc",
			};
		});
	}, []);

	const columns = useMemo<ColumnDef<GetRestaurantByIdReturn>[]>(
		() => [
			{
				accessorKey: "name",
				header: createSortableHeader("Name"),
				cell: ({ row }) => (
					<span className="font-medium">{row.getValue("name")}</span>
				),
			},
			{
				accessorKey: "category",
				header: "Category",
				cell: ({ row }) => (
					<Badge variant="secondary">{row.getValue("category") || "—"}</Badge>
				),
			},
			{
				id: "area",
				header: "Area",
				cell: ({ row }) => row.original.area?.name || "—",
			},
			{
				accessorKey: "rating",
				header: createSortableHeader("Rating"),
				cell: ({ row }) => (
					<div className="flex items-center gap-1">
						<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
						{Number(row.getValue("rating")).toFixed(1)}
					</div>
				),
			},
			{
				accessorKey: "location",
				header: "Location",
				cell: ({ row }) => (
					<div className="max-w-[200px] truncate">
						{row.getValue("location")}
					</div>
				),
			},
			{
				id: "actions",
				header: "Actions",
				cell: ({ row }) => (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="h-8 w-8 p-0">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => toast.info("Edit coming soon")}>
								<Pencil className="mr-2 h-4 w-4" /> Edit
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onSelect={(e) => e.preventDefault()}
								className="text-destructive"
							>
								<AlertDialog>
									<AlertDialogTrigger asChild>
										<div className="flex items-center w-full cursor-default">
											<Trash2 className="mr-2 h-4 w-4" /> Delete
										</div>
									</AlertDialogTrigger>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle>Are you sure?</AlertDialogTitle>
											<AlertDialogDescription>
												This will permanently delete this restaurant.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
												onClick={() =>
													deleteRes(row.original._id, {
														onSuccess: () =>
															toast.success("Restaurant deleted"),
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
				),
			},
		],
		[deleteRes],
	);

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Restaurants</h1>
					<p className="text-muted-foreground text-sm">
						Manage all dining spots.
					</p>
				</div>
				<RestaurantFormDialog />
			</div>

			<DataTable
				columns={columns}
				data={data?.items || []}
				totalCount={data?.totalCount || 0}
				currentPage={data?.currentPage || 1}
				pageSize={params.pageSize}
				onPaginationChange={handlePaginationChange}
				loading={isLoading}
				searchPlaceholder="Search restaurants..."
			/>
		</div>
	);
}
