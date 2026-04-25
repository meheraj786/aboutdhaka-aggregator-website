"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type {
	GetMedicalCategoriesParams,
	GetMedicalCategoriesReturn,
} from "@/actions/medicalCategories.action";
import DataTable, {
	createSortableHeader,
	type PaginationParams,
} from "@/components/dashboardComponents/DataTable";
import { MedicalCategoryFormDialog } from "@/components/dashboardComponents/MedicalCategoryFormDialog";
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
	useDeleteMedicalCategory,
	useFetchMedicalCategories,
} from "@/hooks/useMedicalCategories";

type MedicalCategoryItem = GetMedicalCategoriesReturn["items"][number];

export default function MedicalCategoriesPage() {
	const [params, setParams] = useState<GetMedicalCategoriesParams>({
		page: 1,
		pageSize: 10,
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const { data, isLoading } = useFetchMedicalCategories(params);
	const { mutate: deleteCategory } = useDeleteMedicalCategory();

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

	const handleDelete = useCallback(
		(id: string) => {
			deleteCategory(id, {
				onSuccess: () => toast.success("Medical category deleted"),
				onError: () => toast.error("Failed to delete medical category"),
			});
		},
		[deleteCategory],
	);

	const columns = useMemo<ColumnDef<MedicalCategoryItem>[]>(
		() => [
			{
				accessorKey: "name",
				header: createSortableHeader("Name"),
				cell: ({ row }) => (
					<span className="font-medium">{row.getValue("name")}</span>
				),
			},
			{
				accessorKey: "type",
				header: "Type",
				cell: ({ row }) => {
					const type = row.getValue<"hospital" | "doctor">("type");
					return (
						<Badge
							variant={type === "hospital" ? "default" : "secondary"}
							className="capitalize"
						>
							{type}
						</Badge>
					);
				},
			},
			{
				accessorKey: "description",
				header: "Description",
				cell: ({ row }) => {
					const description = row.getValue<string>("description");
					return description ? (
						<div className="max-w-75 truncate text-sm text-muted-foreground">
							{description}
						</div>
					) : (
						<span className="text-muted-foreground text-sm">—</span>
					);
				},
			},
			{
				accessorKey: "isActive",
				header: "Status",
				cell: ({ row }) => {
					const isActive = row.getValue<boolean>("isActive");
					return (
						<Badge variant={isActive ? "default" : "outline"}>
							{isActive ? "Active" : "Inactive"}
						</Badge>
					);
				},
			},
			{
				id: "actions",
				header: "Actions",
				cell: ({ row }) => {
					const id = String((row.original as { _id: unknown })._id);
					const category = row.original as MedicalCategoryItem;
					return (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="h-8 w-8 p-0">
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<MedicalCategoryFormDialog
									mode="edit"
									categoryId={id}
									initialData={{
										name: category.name,
										type: category.type,
										description: category.description,
										isActive: category.isActive,
									}}
									trigger={
										<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
											<Pencil className="mr-2 h-4 w-4" />
											Edit
										</DropdownMenuItem>
									}
								/>
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
													delete this medical category.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<AlertDialogAction
													className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
													onClick={() => handleDelete(id)}
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
		],
		[handleDelete],
	);

	return (
		<div className="p-6 space-y-6">
			{/* Page header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Medical Categories
					</h1>
					<p className="text-muted-foreground text-sm mt-1">
						Manage medical categories for hospitals and doctors.
					</p>
				</div>

				{/* Add Category button */}
				<MedicalCategoryFormDialog />
			</div>

			{/* Data Table */}
			<DataTable<MedicalCategoryItem, unknown>
				columns={columns}
				data={(data?.items as MedicalCategoryItem[]) ?? []}
				totalCount={data?.totalCount ?? 0}
				currentPage={data?.currentPage ?? 1}
				pageSize={params.pageSize}
				loading={isLoading}
				onPaginationChange={handlePaginationChange}
				searchPlaceholder="Search medical categories..."
				enableColumnVisibility
				enableExport
			/>
		</div>
	);
}
