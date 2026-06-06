"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Pencil, Star, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type {
	GetPlaceByIdReturn,
	GetPlacesParams,
} from "@/actions/place.action";
import DataTable, {
	createSortableHeader,
	type PaginationParams,
} from "@/components/dashboardComponents/DataTable";
import { PlaceFormDialog } from "@/components/dashboardComponents/PlaceFormDialog";
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
import { useDeletePlace, useFetchPlaces } from "@/hooks/usePlaces";
import { useSeedAreas } from "@/hooks/useSeedAreas";

function PlacesColumns(
	onDelete: (id: string) => void,
): ColumnDef<GetPlaceByIdReturn>[] {
	return [
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
				<Badge variant="secondary">{row.getValue("category") ?? "—"}</Badge>
			),
		},
		{
			accessorKey: "location",
			header: createSortableHeader("Location"),
			cell: ({ row }) => (
				<div className="w-40 truncate">{row.getValue("location") ?? "—"}</div>
			),
		},
		{
			// area is populated — show the name
			id: "area",
			header: "Area",
			cell: ({ row }) => {
				const area = row.original?.area;
				return <span>{area?.name ?? "—"}</span>;
			},
		},
		{
			accessorKey: "rating",
			header: createSortableHeader("Rating"),
			cell: ({ row }) => {
				const rating = row.getValue<number>("rating");
				return rating ? (
					<span className="flex items-center gap-1">
						<Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
						{rating.toFixed(1)}
					</span>
				) : (
					<span className="text-muted-foreground text-sm">—</span>
				);
			},
		},
		{
			accessorKey: "fee",
			header: createSortableHeader("Fee"),
			cell: ({ row }) => {
				const fee = row.getValue<number>("fee");
				return fee ? (
					<span>৳{fee}</span>
				) : (
					<Badge variant="outline" className="text-green-600 border-green-300">
						Free
					</Badge>
				);
			},
		},
		{
			accessorKey: "closingDay",
			header: "Closing Day",
			cell: ({ row }) => <span>{row.getValue("closingDay") ?? "—"}</span>,
		},
		{
			id: "actions",
			header: "Actions",
			cell: ({ row }) => {
				const id = String((row.original as { _id: unknown })._id);
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline" className="h-8 w-8 p-0">
								<MoreVertical className="h-4 w-4 mx-auto" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem
								onClick={() => {
									toast.info("Edit coming soon");
								}}
							>
								<Pencil className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuSeparator />

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
												Are you absolutely sure?
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently
												delete this place.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<AlertDialogAction
												className="bg-red-500 text-white"
												onClick={() => onDelete(id)}
											>
												Delete
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];
}

export default function PlacesDashboardPage() {
	const [params, setParams] = useState<GetPlacesParams>({
		page: 1,
		pageSize: 10,
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const { data, isLoading } = useFetchPlaces(params);
	const { mutate: deletePlace } = useDeletePlace();
	const { mutate: seed, isPending: isSeeding } = useSeedAreas();

	const handleDelete = useCallback(
		(id: string) => {
			deletePlace(id, {
				onSuccess: () => toast.success("Place deleted"),
				onError: () => toast.error("Failed to delete place"),
			});
		},
		[deletePlace],
	);

	const handleSeed = () => {
		if (
			!confirm(
				"Are you sure you want to seed all Dhaka areas? This will only add missing areas.",
			)
		)
			return;
		seed();
	};

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

	const columns = useMemo(() => PlacesColumns(handleDelete), [handleDelete]);

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Places</h1>
					<p className="text-muted-foreground text-sm mt-1">
						Manage all places listed in the directory.
					</p>
				</div>

				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						className="hidden"
						onClick={handleSeed}
						disabled={isSeeding}
					>
						{isSeeding ? "Seeding..." : "Seed Areas"}
					</Button>
					<PlaceFormDialog />
				</div>
			</div>

			<DataTable<GetPlaceByIdReturn, unknown>
				columns={columns || []}
				data={(data?.items as GetPlaceByIdReturn[]) ?? []}
				totalCount={data?.totalCount ?? 0}
				currentPage={data?.currentPage ?? 1}
				pageSize={params.pageSize}
				onPaginationChange={handlePaginationChange}
				loading={isLoading}
				searchPlaceholder="Search by name, location, category…"
				enableExport
				enableColumnVisibility
			/>
		</div>
	);
}
