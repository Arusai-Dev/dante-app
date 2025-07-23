import { useState, useRef, useEffect } from "react";
import { ImageIcon, ChevronDown, Sparkles, Send } from "lucide-react";
import ChatBubble from "@/components/chatBubble";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function Sidebar({ onWidthChange }) {
	type Message = {
		role: "user" | "assistant";
		content: string;
	};

	const models = [
		{
			id: "gpt-4.1-nano",
			name: "GPT 4.1 Nano",
			description:
				"Fast and efficient answers, favors speed over reasoning",
		},
		{
			id: "gpt-4",
			name: "GPT 4",
			description: "Most capable model, best for tougher questions",
		},
		{
			id: "gpt-3.5-turbo",
			name: "GPT 3.5 Turbo",
			description: "Balanced performance and speed.",
		},
	];

	const [message, setMessage] = useState("");
	const [sidebarWidth, setSidebarWidth] = useState(430);
	const [allMessages, setAllMessages] = useState<Message[]>([]);
	const [selectedModel, setSelectedModel] = useState(models[0]);
	const [isTyping, setIsTyping] = useState(false);

	const isResizing = useRef(false);
	const sidebarRef = useRef(null);
	const startX = useRef(0);
	const startWidth = useRef(430);

	useEffect(() => {
		onWidthChange(sidebarWidth);
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (message.length > 0) {
			const userMessage: Message = {
				role: "user",
				content: message,
			};

			const updatedMessages = [...allMessages, userMessage];
			setAllMessages(updatedMessages);
			setMessage("");
			setIsTyping(true);
		}
	};

	const handleMouseDown = (e) => {
		e.preventDefault();
		isResizing.current = true;
		startX.current = e.clientX;
		startWidth.current = sidebarWidth;
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseMove = (e) => {
		if (!isResizing.current) return;
		const deltaX = e.clientX - startX.current;
		const newWidth = Math.max(
			320,
			Math.min(600, startWidth.current + deltaX)
		);
		setSidebarWidth(newWidth);
	};

	const handleMouseUp = () => {
		isResizing.current = false;
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	};

	return (
		<>
			<div className="p-4 border-b border-neutral-800" ref={sidebarRef}>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant="outline"
							className="w-full justify-between bg-white hover:bg-gray-100 border-white text-black text-sm font-medium"
						>
							<div className="flex items-center space-x-2">
								<Sparkles className="w-3.5 h-3.5" />
								<span>{selectedModel.name}</span>
							</div>
							<ChevronDown className="w-3.5 h-3.5" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-full bg-neutral-800 border-neutral-700"
						align="start"
					>
						{models.map((model) => (
							<DropdownMenuItem
								key={model.id}
								onClick={() => setSelectedModel(model)}
								className="flex flex-col items-start p-3 cursor-pointer"
							>
								<div className="flex items-center justify-between w-full hover:text-black ">
									<span className="font-medium text-white text-sm hover:text-black">
										{model.name}
									</span>
									{selectedModel.id === model.id && (
										<Badge
											variant="secondary"
											className="bg-neutral-700 text-neutral-300 border-neutral-600 text-xs"
										>
											Active
										</Badge>
									)}
								</div>
								<span className="text-xs text-neutral-400 mt-0.5">
									{model.description}
								</span>
							</DropdownMenuItem>
						))}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<div
				className="flex-1 overflow-y-auto p-4 space-y-3"
				style={{ height: "calc(100vh - 240px)" }}
			>
				{allMessages.length === 0 && (
					<div className="text-center py-8">
						<div className="p-4 bg-neutral-800/50 rounded-lg border border-neutral-700">
							<p className="text-neutral-400 text-sm">
								Ask me about your flashcards!
							</p>
						</div>
					</div>
				)}

				{allMessages.map((msg, index) => (
					<ChatBubble
						key={index}
						message={msg.content}
						sender={msg.role}
					/>
				))}

				{isTyping && (
					<div className="flex items-center space-x-2 text-neutral-400 text-sm px-3 py-2">
						<div className="flex space-x-1">
							<div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"></div>
							<div
								className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"
								style={{ animationDelay: "0.1s" }}
							></div>
							<div
								className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"
								style={{ animationDelay: "0.2s" }}
							></div>
						</div>
						<span className="text-xs">
							{selectedModel.name} is thinking...
						</span>
					</div>
				)}
			</div>

			<div className="p-4 border-t border-neutral-700">
				<form onSubmit={handleSubmit} className="space-y-3">
					<div className="relative">
						<textarea
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									handleSubmit(e);
								}
							}}
							placeholder="Ask about your cards..."
							className="w-full bg-neutral-800 text-white placeholder-neutral-400 rounded-lg p-3 pr-12 resize-none focus:outline-none focus:ring-1 focus:ring-neutral-600 focus:bg-neutral-700 transition-all duration-200 border border-neutral-700 text-sm"
							rows={2}
						/>
						<Button
							type="submit"
							size="sm"
							disabled={!message.trim() || isTyping}
							className="absolute right-2 bottom-6 bg-white hover:bg-gray-100 text-black disabled:bg-neutral-600 disabled:text-neutral-400 p-1.5 h-7 w-7"
						>
							<Send className="w-3.5 h-3.5" />
						</Button>
					</div>

					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled
						className="w-full bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 text-sm"
					>
						<ImageIcon className="w-4 h-4 mr-2" />
						Upload Image
					</Button>
				</form>
			</div>

			<div
				className="absolute right-0 top-0 bottom-0 w-1 bg-neutral-700 hover:bg-neutral-600 cursor-col-resize transition-colors duration-200"
				onMouseDown={handleMouseDown}
			/>
		</>
	);
}
