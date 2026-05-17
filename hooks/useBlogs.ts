import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
	createBlog,
	deleteBlog,
	type GetBlogsParams,
	getBlogById,
	getBlogs,
	updateBlog,
} from "@/actions/blogs.action";
import { queryKeys } from "@/lib/queryKeys";

export function useFetchBlogs(params: GetBlogsParams = {}) {
	return useQuery({
		queryKey: [queryKeys.blogs, "get", params],
		queryFn: () => getBlogs(params),
		placeholderData: (prev) => prev,
	});
}

export type UseFetchBlogsResponse = Awaited<ReturnType<typeof getBlogs>>;

export function useFetchBlogById(id: string) {
	return useQuery({
		queryKey: [queryKeys.blogs, id],
		queryFn: () => getBlogById(id),
		enabled: !!id,
	});
}

export function useCreateBlog() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: createBlog,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.blogs] });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to create blog");
		},
	});
}

export function useUpdateBlog() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({ id, data }: { id: string; data: unknown }) =>
			updateBlog(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.blogs] });
		},
		onError: (error) => {
			toast.error(error.message || "Failed to update blog");
		},
	});
}

export function useDeleteBlog() {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteBlog,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [queryKeys.blogs] });
			toast.success("Blog deleted successfully");
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete blog");
		},
	});
}
