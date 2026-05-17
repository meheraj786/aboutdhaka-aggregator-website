"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Controller, type Resolver, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "@/components/ui/richTextEditor";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useCreateBlog, useUpdateBlog } from "@/hooks/useBlogs";
import {
	BLOG_CATEGORIES,
	type CreateBlogInput,
	createBlogSchema,
} from "@/validators/blogs";

const slugify = (value: string) =>
	value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");

const DEFAULT_VALUES: CreateBlogInput = {
	title: "",
	slug: "",
	category: "Health Tips",
	readingMin: 5,
	authorId: "",
	isAdminPost: true,
	imageUrl: "",
	description: "",
	isActive: true,
};

const buildDefaultValues = (
	initialData?: Partial<CreateBlogInput>,
): CreateBlogInput => ({
	title: initialData?.title ?? DEFAULT_VALUES.title,
	slug: initialData?.slug ?? DEFAULT_VALUES.slug,
	category: initialData?.category ?? DEFAULT_VALUES.category,
	readingMin: initialData?.readingMin ?? DEFAULT_VALUES.readingMin,
	authorId: initialData?.authorId ?? DEFAULT_VALUES.authorId,
	isAdminPost: initialData?.isAdminPost ?? DEFAULT_VALUES.isAdminPost,
	imageUrl: initialData?.imageUrl ?? DEFAULT_VALUES.imageUrl,
	description: initialData?.description ?? DEFAULT_VALUES.description,
	isActive: initialData?.isActive ?? DEFAULT_VALUES.isActive,
});

interface BlogFormDialogProps {
	mode?: "create" | "edit";
	blogId?: string;
	initialData?: Partial<CreateBlogInput>;
	trigger?: React.ReactNode;
}

export function BlogFormDialog({
	mode = "create",
	blogId,
	initialData,
	trigger,
}: BlogFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadedImage, setUploadedImage] = useState("");

	const { mutate: createBlog, isPending: isCreating } = useCreateBlog();
	const { mutate: updateBlog, isPending: isUpdating } = useUpdateBlog();
	const isPending = isCreating || isUpdating;

	const form = useForm<CreateBlogInput>({
		resolver: zodResolver(createBlogSchema) as Resolver<CreateBlogInput>,
		defaultValues: buildDefaultValues(initialData),
		mode: "onTouched",
		reValidateMode: "onChange",
	});

	const watchedTitle = form.watch("title");

	// Auto-generate slug from title
	useEffect(() => {
		form.setValue("slug", slugify(watchedTitle || ""), { shouldDirty: true });
	}, [watchedTitle, form]);

	// Reset form when dialog closes
	useEffect(() => {
		if (!open) {
			const nextValues = buildDefaultValues(initialData);
			form.reset(nextValues);
			setUploadedImage(nextValues.imageUrl || "");
		}
	}, [open, initialData, form]);

	// Sync uploadedImage with initialData on mount
	useEffect(() => {
		setUploadedImage(initialData?.imageUrl || "");
	}, [initialData?.imageUrl]);

	const uploadToCloudinary = async (files: FileList) => {
		const formData = new FormData();
		for (let i = 0; i < files.length; i++) {
			formData.append("files", files[i]);
		}
		const response = await fetch("/api/upload", {
			method: "POST",
			body: formData,
		});
		if (!response.ok) {
			const errorData = await response.json();
			throw new Error(errorData.error || "Failed to upload image");
		}
		return response.json() as Promise<{ urls: string[] }>;
	};

	const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = event.target.files;
		if (!files || files.length === 0) return;

		setIsUploading(true);
		try {
			const data = await uploadToCloudinary(files);
			const url = data.urls[0];
			if (!url) throw new Error("Upload failed");
			form.setValue("imageUrl", url);
			setUploadedImage(url);
			toast.success("Image uploaded successfully");
			if (event.target) event.target.value = "";
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to upload image",
			);
		} finally {
			setIsUploading(false);
		}
	};

	const onSubmit = (values: CreateBlogInput) => {
		if (mode === "edit" && blogId) {
			updateBlog(
				{ id: blogId, data: values },
				{
					onSuccess: () => {
						setOpen(false);
						toast.success("Blog updated successfully!");
					},
				},
			);
			return;
		}

		createBlog(values, {
			onSuccess: () => {
				setOpen(false);
				toast.success("Blog created successfully!");
			},
		});
	};

	const defaultTrigger = (
		<Button className="gap-2">
			<Plus className="h-4 w-4" /> Add Blog
		</Button>
	);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{trigger ?? defaultTrigger}</DialogTrigger>
			<DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-150">
				<DialogHeader>
					<DialogTitle>
						{mode === "edit" ? "Edit Blog" : "Add New Blog"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-2">
					<FieldGroup>
						{/* Title */}
						<Controller
							name="title"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Title *</FieldLabel>
									<Input {...field} placeholder="e.g. How to Stay Healthy" />
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							{/* Slug */}
							<Controller
								name="slug"
								control={form.control}
								render={({ field }) => (
									<Field>
										<FieldLabel>Slug (auto generated)</FieldLabel>
										<Input {...field} placeholder="blog-slug" readOnly />
									</Field>
								)}
							/>

							{/* Reading time */}
							<Controller
								name="readingMin"
								control={form.control}
								render={({ field, fieldState }) => (
									<Field>
										<FieldLabel>Reading Time (min)</FieldLabel>
										<Input
											type="number"
											min={1}
											max={120}
											{...field}
											onChange={(e) =>
												field.onChange(
													e.target.value === ""
														? undefined
														: Number(e.target.value),
												)
											}
											placeholder="e.g. 5"
										/>
										{fieldState.error && (
											<FieldError errors={[fieldState.error]} />
										)}
									</Field>
								)}
							/>
						</div>

						{/* Category */}
						<Controller
							name="category"
							control={form.control}
							render={({ field, fieldState }) => (
								<Field>
									<FieldLabel>Category *</FieldLabel>
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger>
											<SelectValue placeholder="Select a category" />
										</SelectTrigger>
										<SelectContent>
											{BLOG_CATEGORIES.map((cat) => (
												<SelectItem key={cat} value={cat}>
													{cat}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									{field.value && (
										<Badge variant="secondary" className="w-fit mt-1 text-xs">
											{field.value}
										</Badge>
									)}
									{fieldState.error && (
										<FieldError errors={[fieldState.error]} />
									)}
								</Field>
							)}
						/>
					</FieldGroup>

					<Separator />

					{/* Image upload */}
					<section className="space-y-3">
						<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
							<FileUp className="h-4 w-4" /> Cover Image
						</FieldLabel>

						{!uploadedImage ? (
							<div className="border-2 border-dashed rounded-lg p-4">
								<input
									type="file"
									accept=".jpg,.jpeg,.png,.webp"
									onChange={uploadImage}
									disabled={isUploading}
									className="hidden"
									id="blog-image-upload"
								/>
								<label
									htmlFor="blog-image-upload"
									className="flex flex-col items-center justify-center cursor-pointer py-4"
								>
									<FileUp className="h-8 w-8 text-muted-foreground mb-2" />
									<span className="text-sm font-medium">
										{isUploading
											? "Uploading..."
											: "Click to upload cover image"}
									</span>
								</label>
							</div>
						) : (
							<div className="space-y-2">
								<div className="relative rounded-md overflow-hidden">
									<Image
										src={uploadedImage}
										alt="Blog cover"
										width={600}
										height={200}
										className="h-40 w-full object-cover"
										unoptimized
									/>
								</div>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => {
										form.setValue("imageUrl", "");
										setUploadedImage("");
									}}
									className="w-full"
								>
									<Trash2 className="h-4 w-4 mr-1" /> Remove Image
								</Button>
							</div>
						)}
					</section>

					<Separator />

					{/* Description */}
					<Controller
						name="description"
						control={form.control}
						render={({ field, fieldState }) => (
							<Field>
								<FieldLabel>Description *</FieldLabel>
								<RichTextEditor
									value={field.value}
									onChange={field.onChange}
									placeholder="Write the blog content here..."
									error={!!fieldState.error}
									minHeight="min-h-52"
								/>
								{fieldState.error && <FieldError errors={[fieldState.error]} />}
							</Field>
						)}
					/>

					<Separator />

					{/* Toggles */}
					<section className="space-y-4">
						<FieldLabel className="text-xs uppercase tracking-wider text-muted-foreground">
							Settings
						</FieldLabel>

						<Controller
							name="isAdminPost"
							control={form.control}
							render={({ field }) => (
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium">Admin Post</p>
										<p className="text-xs text-muted-foreground">
											Mark this as an official admin post
										</p>
									</div>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</div>
							)}
						/>

						<Controller
							name="isActive"
							control={form.control}
							render={({ field }) => (
								<div className="flex items-center justify-between">
									<div>
										<p className="text-sm font-medium">Active</p>
										<p className="text-xs text-muted-foreground">
											Publish this blog publicly
										</p>
									</div>
									<Switch
										checked={field.value}
										onCheckedChange={field.onChange}
									/>
								</div>
							)}
						/>
					</section>

					{/* Actions */}
					<div className="flex justify-end gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={() => setOpen(false)}
							disabled={isPending || isUploading}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							className="min-w-30"
							disabled={isPending || isUploading}
						>
							{isPending ? (
								<>
									<Loader2 className="animate-spin mr-2 h-4 w-4" /> Saving...
								</>
							) : (
								"Save Blog"
							)}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}
