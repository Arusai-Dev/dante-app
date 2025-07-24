"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { ImageIcon, ChevronDown, Sparkles, Send, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import ChatBubble from "./chatBubble";

type Message = {
	role: "user" | "assistant";
	content: string;
};

const models = [
	{
		id: "gpt-4.1-nano",
		name: "GPT 4.1 Nano",
		description: "Fast and efficient answers, favors speed over reasoning",
		badge: "Fast",
		color: "bg-emerald-500",
	},
	{
		id: "gpt-4",
		name: "GPT 4",
		description: "Most capable model, best for tougher questions",
		badge: "Pro",
		color: "bg-purple-500",
	},
	{
		id: "gpt-3.5-turbo",
		name: "GPT 3.5 Turbo",
		description: "Balanced performance and speed",
		badge: "Balanced",
		color: "bg-white",
	},
];

interface SidebarProps {
	onWidthChange: (width: number) => void;
}


export default function Sidebar({ onWidthChange }: SidebarProps) {
	const [message, setMessage] = useState("");
	const [sidebarWidth, setSidebarWidth] = useState(430);
	const [allMessages, setAllMessages] = useState<Message[]>([]);
	const [selectedModel, setSelectedModel] = useState(models[0]);
	const [isTyping, setIsTyping] = useState(false);
	const isResizing = useRef(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const startX = useRef(0);
	const startWidth = useRef(430);

	useEffect(() => {
		const savedMessages = localStorage.getItem("sidebar-chat-history");
		if (savedMessages) {
			try {
				const parsedMessages = JSON.parse(savedMessages);
				setAllMessages(parsedMessages);
			} catch (error) {
				console.error("Error loading chat history:", error);
			}
		}
	}, []);

	useEffect(() => {
		if (allMessages.length > 0) {
			localStorage.setItem(
				"sidebar-chat-history",
				JSON.stringify(allMessages)
			);
		}
	}, [allMessages]);

	useEffect(() => {
		onWidthChange(sidebarWidth);
	}, [sidebarWidth, onWidthChange]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (message.trim().length > 0) {
			const userMessage: Message = {
				role: "user",
				content: message,
			};
			const updatedMessages = [...allMessages, userMessage];

			setAllMessages(updatedMessages);
			setMessage("");
			setIsTyping(true);

			const modelApi = await fetch(`/api/chat/${selectedModel.id}`, {
				method: "POST",
				headers: { "Content-Type": "application/json", "Access-Control-Allow-Methods": "*", "Access-Control-Allow-Origin": "*" },
				body: JSON.stringify({
					history: updatedMessages
				})
			}) 
			
			const modelApiRes = await modelApi.json();
			const modelMessage = modelApiRes.response;

			const aiMessage: Message = {
				role: "assistant",
				content: modelMessage,
			};
			setAllMessages((prev) => [...prev, aiMessage]);
			setIsTyping(false);
		}
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		e.preventDefault();
		isResizing.current = true;
		startX.current = e.clientX;
		startWidth.current = sidebarWidth;
		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);
	};

	const handleMouseMove = (e: MouseEvent) => {
		if (!isResizing.current) return;
		const deltaX = e.clientX - startX.current;
		const newWidth = Math.max(
			320,
			Math.min(800, startWidth.current + deltaX)
		);
		setSidebarWidth(newWidth);
	};

	const handleMouseUp = () => {
		isResizing.current = false;
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	};

	return (
		<div
			className="relative h-full bg-neutral-900 border-r border-neutral-800 flex flex-col shadow-2xl"
			style={{ width: sidebarWidth }}
			ref={sidebarRef}
		>
			<div
				className="flex-1 overflow-y-auto p-6 space-y-6 bg-neutral-900 "
				style={{ height: "calc(100vh - 200px)" }}
			>
				{allMessages.length === 0 && (
					<div className="text-center py-12">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-neutral-800 to-neutral-700 rounded-full mb-4 border border-neutral-700">
							<Sparkles className="w-8 h-8 text-white" />
						</div>
						<h3 className="text-lg font-medium text-white mb-2">
							Ready to help!
						</h3>
						<p className="text-sm text-neutral-400 max-w-xs mx-auto leading-relaxed">
							Ask me anything about your flashcards or any topic
							you&apos;d like to explore.
						</p>
					</div>
				)}

				{allMessages.map((msg, index) => (
					<div
						key={index}
						className="animate-in slide-in-from-bottom-2 duration-300"
					>
						<ChatBubble message={msg.content} sender={msg.role} />
					</div>
				))}

				{isTyping && (
					<div className="flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-300">
						<div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-700 text-white flex items-center justify-center">
							<Bot className="w-4 h-4" />
						</div>
						<div className="bg-neutral-800 rounded-2xl rounded-bl-md px-4 py-3 border border-neutral-700">
							<div className="flex items-center space-x-2">
								<div className="flex space-x-1">
									<div className="w-2 h-2 bg-white rounded-full animate-bounce" />
									<div
										className="w-2 h-2 bg-white rounded-full animate-bounce"
										style={{ animationDelay: "0.1s" }}
									/>
									<div
										className="w-2 h-2 bg-white rounded-full animate-bounce"
										style={{ animationDelay: "0.2s" }}
									/>
								</div>
								<span className="text-xs text-neutral-300 ml-2">
									{selectedModel.name} is thinking...
								</span>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="p-6 border-t border-neutral-800 bg-neutral-900">
				<form onSubmit={handleSubmit} className="space-y-4">
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
							className="w-full bg-neutral-800 text-white placeholder-neutral-400 rounded-xl p-4 pr-16 pb-16 resize-none focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:bg-neutral-700 transition-all duration-200 border border-neutral-700 text-sm leading-relaxed"
							rows={3}
						/>
						<Button
							type="submit"
							size="sm"
							disabled={!message.trim() || isTyping}
							className="absolute right-3 bottom-3 bg-white hover:bg-neutral-100 text-neutral-900 disabled:bg-neutral-600 disabled:text-neutral-400 p-2 h-8 w-8 rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-opacity-50"
						>
							<Send className="w-4 h-4" />
						</Button>

						<div className="absolute bottom-3 left-3">
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										type="button"
										variant="ghost"
										size="sm"
										className="h-6 px-2 bg-neutral-700 hover:bg-neutral-600 border border-neutral-600 text-white text-xs rounded-md transition-all duration-200 focus:ring-2 focus:ring-white focus:ring-opacity-50"
									>
										<div className="flex items-center space-x-1.5">
											<div
												className={`w-1.5 h-1.5 rounded-full ${
													selectedModel.color
												} ${
													selectedModel.color ===
													"bg-white"
														? "border border-neutral-400"
														: ""
												}`}
											/>
											<span className="font-medium">
												{selectedModel.name}
											</span>
											<ChevronDown className="w-3 h-3 text-neutral-400" />
										</div>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									className="w-80 bg-neutral-800 border-neutral-700 shadow-xl rounded-xl p-2"
									align="start"
									side="top"
								>
									{models.map((model) => (
										<DropdownMenuItem
											key={model.id}
											onClick={() =>
												setSelectedModel(model)
											}
											className="flex flex-col items-start p-4 cursor-pointer rounded-lg hover:bg-neutral-700 transition-colors duration-200 border-0 focus:bg-neutral-700"
										>
											<div className="flex items-center justify-between w-full mb-2">
												<div className="flex items-center space-x-3">
													<div
														className={`w-2 h-2 rounded-full ${
															model.color
														} ${
															model.color ===
															"bg-white"
																? "border border-neutral-600"
																: ""
														}`}
													/>
													<span className="font-medium text-white">
														{model.name}
													</span>
												</div>
												<div className="flex items-center space-x-2">
													<Badge
														variant="secondary"
														className="bg-neutral-700 text-neutral-300 border-0 text-xs px-2 py-1"
													>
														{model.badge}
													</Badge>
													{selectedModel.id ===
														model.id && (
														<Badge className="bg-white text-neutral-900 border-0 text-xs px-2 py-1">
															Active
														</Badge>
													)}
												</div>
											</div>
											<span className="text-xs text-neutral-400 leading-relaxed">
												{model.description}
											</span>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>

					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled
						className="w-full bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700 text-sm py-2.5 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-white focus:ring-opacity-50"
					>
						<ImageIcon className="w-4 h-4 mr-2" />
						Upload Image
					</Button>
				</form>
			</div>

			<div
				className="absolute right-0 top-0 bottom-0 w-1 bg-transparent hover:bg-white/10 cursor-col-resize transition-colors duration-200 group"
				onMouseDown={handleMouseDown}
			>
				<div className="absolute inset-y-0 right-0 w-0.5 bg-neutral-700 group-hover:bg-white transition-colors duration-200" />
			</div>
		</div>
	);
}
