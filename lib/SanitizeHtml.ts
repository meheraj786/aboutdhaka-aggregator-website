import sanitizeHtml from "sanitize-html";

export function sanitizeBlogHtml(dirty: string): string {
	return sanitizeHtml(dirty, {
		allowedTags: [
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"p",
			"br",
			"hr",
			"strong",
			"em",
			"u",
			"s",
			"code",
			"pre",
			"blockquote",
			"ul",
			"ol",
			"li",
			"a",
			"img",
		],
		allowedAttributes: {
			a: ["href", "target", "rel"],
			img: ["src", "alt", "class", "width", "height"],
			"*": ["class"],
		},
		// Force external links to be safe
		transformTags: {
			a: (tagName, attribs) => ({
				tagName,
				attribs: {
					...attribs,
					target: "_blank",
					rel: "noopener noreferrer",
				},
			}),
		},
	});
}
