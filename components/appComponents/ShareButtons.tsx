"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { FaFacebook, FaLinkedin, FaTwitter } from "react-icons/fa";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
	url: string;
	title: string;
	description?: string;
	className?: string;
}

export default function ShareButtons({
	url,
	title,
	description = "",
	className,
}: ShareButtonsProps) {
	const [copied, setCopied] = useState(false);

	const encodedUrl = encodeURIComponent(url);
	const encodedTitle = encodeURIComponent(title);
	const encodedDesc = encodeURIComponent(description);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(url);
			setCopied(true);
			toast.success("Link copied to clipboard!");
			setTimeout(() => setCopied(false), 2500);
		} catch {
			toast.error("Failed to copy link");
		}
	};

	const linkClass =
		"inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors";

	return (
		<div className={cn("flex flex-wrap items-center gap-2", className)}>
			<span className="text-xs text-slate-400 font-medium mr-1">Share:</span>

			{/* Facebook */}
			<a
				href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Share on Facebook"
				className={cn(linkClass, "bg-[#1877F2] hover:bg-[#166fe5] text-white")}
			>
				<FaFacebook className="h-4 w-4" />
				<span className="hidden sm:inline">Facebook</span>
			</a>

			{/* Twitter / X */}
			<a
				href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Share on Twitter"
				className={cn(linkClass, "bg-[#0f1419] hover:bg-[#272c30] text-white")}
			>
				<FaTwitter className="h-4 w-4" />
				<span className="hidden sm:inline">Twitter / X</span>
			</a>

			{/* LinkedIn */}
			<a
				href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDesc}`}
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Share on LinkedIn"
				className={cn(linkClass, "bg-[#0A66C2] hover:bg-[#0958a8] text-white")}
			>
				<FaLinkedin className="h-4 w-4" />
				<span className="hidden sm:inline">LinkedIn</span>
			</a>

			{/* Copy link */}
			<button
				type="button"
				onClick={handleCopy}
				aria-label="Copy link"
				className={cn(
					linkClass,
					copied
						? "bg-green-500 hover:bg-green-600 text-white"
						: "bg-slate-100 hover:bg-slate-200 text-slate-700",
				)}
			>
				{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
				<span className="hidden sm:inline">
					{copied ? "Copied!" : "Copy link"}
				</span>
			</button>
		</div>
	);
}
