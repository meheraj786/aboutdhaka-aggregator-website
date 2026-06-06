"use client";

import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { type Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	Heading1,
	Heading2,
	Heading3,
	ImageIcon,
	Italic,
	Link as LinkIcon,
	List,
	ListOrdered,
	Loader2,
	Minus,
	Quote,
	Redo,
	Strikethrough,
	UnderlineIcon,
	Undo,
	Unlink,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// ── Toolbar button ───────────────────────────────────────────────────────────

interface ToolbarButtonProps {
	onClick: () => void;
	isActive?: boolean;
	disabled?: boolean;
	tooltip: string;
	children: React.ReactNode;
}

function ToolbarButton({
	onClick,
	isActive,
	disabled,
	tooltip,
	children,
}: ToolbarButtonProps) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					className={cn(
						"h-8 w-8",
						isActive && "bg-accent text-accent-foreground",
					)}
					onClick={onClick}
					disabled={disabled}
				>
					{children}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom" className="text-xs">
				{tooltip}
			</TooltipContent>
		</Tooltip>
	);
}

// ── Image upload button ──────────────────────────────────────────────────────

function ImageUploadButton({ editor }: { editor: Editor }) {
	const inputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		e.target.value = "";

		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("files", file);

			const res = await fetch("/api/upload", {
				method: "POST",
				body: formData,
			});

			if (!res.ok) {
				const err = (await res.json()) as { error?: string };
				throw new Error(err.error ?? "Upload failed");
			}

			const data = (await res.json()) as { urls: string[] };
			const url = data.urls[0];
			if (!url) throw new Error("No URL returned");

			editor
				.chain()
				.focus()
				.insertContent({ type: "image", attrs: { src: url } })
				.run();

			toast.success("Image inserted");
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Failed to upload image",
			);
		} finally {
			setUploading(false);
		}
	};

	return (
		<>
			<input
				ref={inputRef}
				type="file"
				accept=".jpg,.jpeg,.png,.webp"
				className="hidden"
				onChange={handleFileChange}
			/>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="h-8 w-8"
						onClick={() => inputRef.current?.click()}
						disabled={uploading}
					>
						{uploading ? (
							<Loader2 className="h-4 w-4 animate-spin" />
						) : (
							<ImageIcon className="h-4 w-4" />
						)}
					</Button>
				</TooltipTrigger>
				<TooltipContent side="bottom" className="text-xs">
					Insert Image
				</TooltipContent>
			</Tooltip>
		</>
	);
}

// ── Toolbar ──────────────────────────────────────────────────────────────────

function Toolbar({ editor }: { editor: Editor }) {
	const setLink = useCallback(() => {
		const previous = editor.getAttributes("link").href as string | undefined;
		const url = window.prompt("Enter URL", previous ?? "https://");
		if (url === null) return;
		if (url === "") {
			editor.chain().focus().extendMarkRange("link").unsetLink().run();
			return;
		}
		editor
			.chain()
			.focus()
			.extendMarkRange("link")
			.setLink({ href: url, target: "_blank" })
			.run();
	}, [editor]);

	return (
		<div className="flex flex-wrap items-center gap-0.5 border-b p-1.5 bg-muted/30">
			{/* Headings */}
			<ToolbarButton
				tooltip="Heading 1"
				onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
				isActive={editor.isActive("heading", { level: 1 })}
			>
				<Heading1 className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				tooltip="Heading 2"
				onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
				isActive={editor.isActive("heading", { level: 2 })}
			>
				<Heading2 className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				tooltip="Heading 3"
				onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
				isActive={editor.isActive("heading", { level: 3 })}
			>
				<Heading3 className="h-4 w-4" />
			</ToolbarButton>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* Inline marks */}
			<ToolbarButton
				tooltip="Bold (Ctrl+B)"
				onClick={() => editor.chain().focus().toggleBold().run()}
				isActive={editor.isActive("bold")}
			>
				<Bold className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				tooltip="Italic (Ctrl+I)"
				onClick={() => editor.chain().focus().toggleItalic().run()}
				isActive={editor.isActive("italic")}
			>
				<Italic className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				tooltip="Underline (Ctrl+U)"
				onClick={() => editor.chain().focus().toggleUnderline().run()}
				isActive={editor.isActive("underline")}
			>
				<UnderlineIcon className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				tooltip="Strikethrough"
				onClick={() => editor.chain().focus().toggleStrike().run()}
				isActive={editor.isActive("strike")}
			>
				<Strikethrough className="h-4 w-4" />
			</ToolbarButton>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* Alignment */}
			<ToolbarButton
				tooltip="Align Left"
				onClick={() => editor.chain().focus().setTextAlign("left").run()}
				isActive={editor.isActive({ textAlign: "left" })}
			>
				<AlignLeft className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				tooltip="Align Center"
				onClick={() => editor.chain().focus().setTextAlign("center").run()}
				isActive={editor.isActive({ textAlign: "center" })}
			>
				<AlignCenter className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				tooltip="Align Right"
				onClick={() => editor.chain().focus().setTextAlign("right").run()}
				isActive={editor.isActive({ textAlign: "right" })}
			>
				<AlignRight className="h-4 w-4" />
			</ToolbarButton>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* Lists */}
			<ToolbarButton
				tooltip="Bullet List"
				onClick={() => editor.chain().focus().toggleBulletList().run()}
				isActive={editor.isActive("bulletList")}
			>
				<List className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				tooltip="Ordered List"
				onClick={() => editor.chain().focus().toggleOrderedList().run()}
				isActive={editor.isActive("orderedList")}
			>
				<ListOrdered className="h-4 w-4" />
			</ToolbarButton>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* Blockquote & HR */}
			<ToolbarButton
				tooltip="Blockquote"
				onClick={() => editor.chain().focus().toggleBlockquote().run()}
				isActive={editor.isActive("blockquote")}
			>
				<Quote className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				tooltip="Horizontal Rule"
				onClick={() => editor.chain().focus().setHorizontalRule().run()}
			>
				<Minus className="h-4 w-4" />
			</ToolbarButton>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* Link */}
			<ToolbarButton
				tooltip="Set Link"
				onClick={setLink}
				isActive={editor.isActive("link")}
			>
				<LinkIcon className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				tooltip="Remove Link"
				onClick={() => editor.chain().focus().unsetLink().run()}
				disabled={!editor.isActive("link")}
			>
				<Unlink className="h-4 w-4" />
			</ToolbarButton>

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* Image */}
			<ImageUploadButton editor={editor} />

			<Separator orientation="vertical" className="h-6 mx-1" />

			{/* History */}
			<ToolbarButton
				tooltip="Undo (Ctrl+Z)"
				onClick={() => editor.chain().focus().undo().run()}
				disabled={!editor.can().undo()}
			>
				<Undo className="h-4 w-4" />
			</ToolbarButton>
			<ToolbarButton
				tooltip="Redo (Ctrl+Y)"
				onClick={() => editor.chain().focus().redo().run()}
				disabled={!editor.can().redo()}
			>
				<Redo className="h-4 w-4" />
			</ToolbarButton>
		</div>
	);
}

// ── Main component ───────────────────────────────────────────────────────────

interface RichTextEditorProps {
	value: string;
	onChange: (html: string) => void;
	placeholder?: string;
	error?: boolean;
	className?: string;
	minHeight?: string;
}

export function RichTextEditor({
	value,
	onChange,
	placeholder = "Start writing...",
	error,
	className,
	minHeight = "min-h-60",
}: RichTextEditorProps) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Link.configure({
				openOnClick: false,
				HTMLAttributes: { class: "text-primary underline" },
			}),
			Placeholder.configure({ placeholder }),
			Image.configure({
				HTMLAttributes: {
					class: "rounded-md max-w-full my-3",
				},
			}),
		],
		content: value || "",
		immediatelyRender: false,
		onUpdate({ editor }) {
			const html = editor.isEmpty ? "" : editor.getHTML();
			onChange(html);
		},
	});

	// Sync external value changes (e.g. form.reset when dialog closes)
	// Guard against cursor-jump by only updating when content truly differs
	if (editor && value !== (editor.isEmpty ? "" : editor.getHTML())) {
		editor.commands.setContent(value || "");
	}

	return (
		<div
			className={cn(
				"rounded-md border bg-background focus-within:ring-2 focus-within:ring-ring transition-shadow",
				error && "border-destructive focus-within:ring-destructive",
				className,
			)}
		>
			{editor && <Toolbar editor={editor} />}
			<EditorContent
				editor={editor}
				className={cn(
					"prose prose-sm dark:prose-invert max-w-none px-3 py-2",
					"[&_.tiptap]:outline-none",
					// placeholder
					"[&_.tiptap_p.is-editor-empty:first-child::before]:text-muted-foreground",
					"[&_.tiptap_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]",
					"[&_.tiptap_p.is-editor-empty:first-child::before]:float-left",
					"[&_.tiptap_p.is-editor-empty:first-child::before]:pointer-events-none",
					"[&_.tiptap_p.is-editor-empty:first-child::before]:h-0",
					// images
					"[&_.tiptap_img]:rounded-md [&_.tiptap_img]:max-w-full [&_.tiptap_img]:my-3",
					minHeight,
				)}
			/>
		</div>
	);
}
