"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { GetBlogsReturn } from "@/actions/blogs.action";
import { BlogFormDialog } from "@/components/dashboardComponents/BlogDialogForm";
import DataTable, {
	createSortableHeader,
	type PaginationParams,
} from "@/components/dashboardComponents/DataTable";
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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDeleteBlog, useFetchBlogs } from "@/hooks/useBlogs";
import type { CreateBlogInput } from "@/validators/blogs";
import { BLOG_CATEGORIES, type BlogCategory } from "@/validators/blogs";

type BlogItem = GetBlogsReturn["items"][number];

const mapBlogToFormInput = (blog: BlogItem): CreateBlogInput => ({
	title: blog.title ?? "",
	slug: blog.slug ?? "",
	category: blog.category as BlogCategory,
	readingMin: blog.readingMin ?? 5,
	authorId: blog.authorId ?? "",
	isAdminPost: blog.isAdminPost ?? true,
	imageUrl: blog.imageUrl ?? "",
	description: blog.description ?? "",
	isActive: blog.isActive ?? true,
});

export type GetBlogsParams = {
	page: number;
	pageSize: number;
	search?: string;
	category?: BlogCategory | "all";
	sortBy?: string;
	sortOrder?: "asc" | "desc";
};

export default function BlogsPage() {
	const [params, setParams] = useState<GetBlogsParams>({
		page: 1,
		pageSize: 10,
		search: "",
		category: "all",
		sortBy: "createdAt",
		sortOrder: "desc",
	});

	const { data, isLoading } = useFetchBlogs(params);
	const { mutate: deleteBlog } = useDeleteBlog();

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
				...prev,
				page: p.page,
				pageSize: p.pageSize,
				search: p.search ?? "",
				sortBy: p.sortBy,
				sortOrder: p.sortOrder as "asc" | "desc" | undefined,
			};
		});
	}, []);

	// Category filter handler — independent of pagination change
	const handleCategoryChange = useCallback((value: string) => {
		setParams((prev) => ({
			...prev,
			page: 1, // reset to first page on filter change
			category: value as BlogCategory | "all",
		}));
	}, []);

	const columns = useMemo<ColumnDef<BlogItem>[]>(
		() => [
			{
				accessorKey: "title",
				header: createSortableHeader("Title"),
			},
			{
				accessorKey: "category",
				header: "Category",
				cell: ({ row }) => (
					<Badge variant="secondary" className="text-xs">
						{row.original.category}
					</Badge>
				),
			},
			{
				accessorKey: "readingMin",
				header: "Reading Time",
				cell: ({ row }) => <span>{row.original.readingMin} min</span>,
			},
			{
				id: "isAdminPost",
				header: "Admin Post",
				cell: ({ row }) =>
					row.original.isAdminPost ? (
						<Badge variant="default" className="text-xs">
							Admin
						</Badge>
					) : (
						<Badge variant="outline" className="text-xs">
							User
						</Badge>
					),
			},
			{
				id: "isActive",
				header: "Status",
				cell: ({ row }) =>
					row.original.isActive ? (
						<Badge className="text-xs bg-green-500 hover:bg-green-600">
							Active
						</Badge>
					) : (
						<Badge variant="destructive" className="text-xs">
							Inactive
						</Badge>
					),
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
							<BlogFormDialog
								mode="edit"
								blogId={String(row.original._id)}
								initialData={mapBlogToFormInput(row.original)}
								trigger={
									<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
										<Pencil className="mr-2 h-4 w-4" /> Edit
									</DropdownMenuItem>
								}
							/>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									if (confirm("Are you sure you want to delete this blog?")) {
										deleteBlog(String(row.original._id), {
											onSuccess: () => toast.success("Blog deleted"),
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
		[deleteBlog],
	);

	return (
		<div className="p-6 space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Blogs</h1>
					<p className="text-muted-foreground text-sm">
						Manage all blog posts and articles.
					</p>
				</div>
				<BlogFormDialog />
			</div>

			{/* Category filter — sits above the DataTable */}
			<div className="flex items-center gap-3">
				<span className="text-sm text-muted-foreground">
					Filter by category:
				</span>
				<Select
					value={params.category ?? "all"}
					onValueChange={handleCategoryChange}
				>
					<SelectTrigger className="w-48">
						<SelectValue placeholder="All Categories" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Categories</SelectItem>
						{BLOG_CATEGORIES.map((cat) => (
							<SelectItem key={cat} value={cat}>
								{cat}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<DataTable<BlogItem, unknown>
				columns={columns}
				data={(data?.items as BlogItem[]) ?? []}
				totalCount={data?.totalCount ?? 0}
				currentPage={data?.currentPage ?? 1}
				pageSize={params.pageSize}
				loading={isLoading}
				onPaginationChange={handlePaginationChange}
				searchPlaceholder="Search blogs by title..."
				enableColumnVisibility
				enableExport
			/>
		</div>
	);
}
