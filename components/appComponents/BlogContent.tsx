import parse from "html-react-parser";
import { sanitizeBlogHtml } from "@/lib/SanitizeHtml";

interface BlogContentProps {
	html: string;
	className?: string;
}

export default function BlogContent({ html, className }: BlogContentProps) {
	const clean = sanitizeBlogHtml(html);

	return <div className={className}>{parse(clean)}</div>;
}
