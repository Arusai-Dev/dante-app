import "katex/dist/katex.min.css";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Bot, User } from "lucide-react";

export default function ChatBubble({ message, sender }) {
	return (
		<div
			className={`flex items-start gap-3 ${
				sender === "user" ? "flex-row-reverse" : ""
			}`}
		>
			<div
				className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
					sender === "user"
						? "bg-white text-neutral-900"
						: "bg-neutral-700 text-white"
				}`}
			>
				{sender === "user" ? (
					<User className="w-4 h-4" />
				) : (
					<Bot className="w-4 h-4" />
				)}
			</div>
			<div
				className={`max-w-[80%] ${
					sender === "user" ? "text-right" : ""
				}`}
			>
				<div
					className={`inline-block px-4 py-3 rounded-2xl text-sm leading-relaxed ${
						sender === "user"
							? "bg-white text-neutral-900 rounded-br-md shadow-sm"
							: "bg-neutral-800 text-white rounded-bl-md border border-neutral-700"
					}`}
				>
					<ReactMarkdown
						remarkPlugins={[remarkMath]}
						rehypePlugins={[rehypeKatex]}
					>
						{processKatexInMarkdown(message)}
					</ReactMarkdown>
				</div>
			</div>
		</div>
	);
}

export function processKatexInMarkdown(markdown: string) {
	const markdownWithKatexSyntax = markdown
		.replace(/\\\\\[/g, "$$$$")
		.replace(/\\\\\]/g, "$$$$")
		.replace(/\\\\\(/g, "$$$$")
		.replace(/\\\\\)/g, "$$$$")
		.replace(/\\\[/g, "$$$$")
		.replace(/\\\]/g, "$$$$")
		.replace(/\\\(/g, "$$$$")
		.replace(/\\\)/g, "$$$$");
	return markdownWithKatexSyntax;
}
