/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
	Album,
	PanelLeft,
	ArrowRight,
	ArrowLeft,
	Home,
	CheckCircle,
	Keyboard,
	SquareChevronLeft,
	SquareChevronRight,
	Space,
} from "lucide-react";
import { Toaster } from "sonner";
import { fsrs, type Card, Rating, State, createEmptyCard } from "ts-fsrs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getSetById } from "@/lib/dbFunctions";
import Sidebar from "@/components/Sidebar";

interface FlashCard extends Card {
	cardId: number;
	front: string;
	back: string;
	category: string;
	fileName: string;
}

export default function PracticeSet({ params }) {
	const [flashcardSet, setFlashcardSet] = useState([]);
	const [currentCardIndex, setCurrentCardIndex] = useState(0);
	const [showFront, setShowFront] = useState(true);
	const [qualityScore, setQualityScore] = useState<Rating | "Easy">("Easy");
	const [cards, setCards] = useState<FlashCard[]>([]);
	const [dueCards, setDueCards] = useState<FlashCard[]>([]);
	const [isSubmittingReview, setIsSubmittingReview] = useState(false);
	const [studyComplete, setStudyComplete] = useState(false);
	const [allCardImages, setAllCardImages] = useState({});
	const [paramId, setParamId] = useState();
	const [localCardScores, setLocalCardScores] = useState([]);
	const [showSidebar, setShowSidebar] = useState(false);
	const [sidebarWidth, setSidebarWidth] = useState(430);
	const [keyboardShortcutsMenu, setKeyboardShortcutsMenu] = useState(false)

	const intervalRef = useRef(null);
	const localCardScoresRef = useRef([]);

	useEffect(() => {
		localCardScoresRef.current = localCardScores;
	}, [localCardScores]);

	useEffect(() => {
		async function getParamId() {
			const { id } = await params;
			setParamId(id);
		}
		getParamId();
	}, [params]);

	useEffect(() => {
		async function getInfo() {
			if (!paramId) return;
			try {
				const [set] = await getSetById(paramId);
				setFlashcardSet([set]);
			} catch (error) {
				console.error("Error fetching flashcard set:", error);
			}
		}
		getInfo();
	}, [paramId]);

	const set = flashcardSet[0];
	const jsonCards = set?.cards;
	const setId = set?.id;
	const f = fsrs();

	const submitReview = useCallback(async () => {
		if (isSubmittingReview || localCardScores.length === 0) return;

		setIsSubmittingReview(true);
		const scoresToSubmit = [...localCardScores];

		try {
			const response = await fetch(`/api/fsrs-update/${setId}`, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					localCardScores: scoresToSubmit,
				}),
			});

			if (!response.ok) {
				const errorData = await response
					.json()
					.catch(() => ({ error: "Unknown error" }));
				console.error("API Error:", response.status, errorData);
				throw new Error(
					`Failed to update cards: ${response.status} - ${
						errorData.error || "Unknown error"
					}`
				);
			}

			const result = await response.json();

			setLocalCardScores([]);
		} catch (error) {
			console.error("Error submitting review:", error);
		} finally {
			setIsSubmittingReview(false);
		}
	}, [isSubmittingReview, localCardScores, setId]);

	useEffect(() => {
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		intervalRef.current = setInterval(() => {
			if (localCardScoresRef.current.length > 0) {
				submitReview();
			}
		}, 120000); // 2 minutes

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [setId, submitReview]);

	const handleSidebar = () => {
		setShowSidebar((prev) => !prev);
	};

	useEffect(() => {
		if (!jsonCards) return;

		const initializeCards = () => {
			const initializedCards = jsonCards.map((card) => {
				let fsrsCard: Card;

				if (
					card.state === undefined ||
					card.state === 0 ||
					!card.due ||
					!card.last_review
				) {
					fsrsCard = createEmptyCard();
				} else {
					fsrsCard = {
						due: new Date(card.due),
						stability: parseFloat(card.stability) || 0,
						difficulty: parseFloat(card.difficulty) || 0,
						elapsed_days:
							parseInt(card.elapsed_days) ||
							parseInt(card.elapsed_day) ||
							0,
						scheduled_days: parseInt(card.scheduled_days) || 0,
						reps: parseInt(card.reps) || 0,
						lapses: parseInt(card.lapses) || 0,
						state: parseInt(card.state) || State.New,
						last_review: card.last_review
							? new Date(card.last_review)
							: undefined,
					};
				}

				return {
					...fsrsCard,
					cardId: card.cardId,
					front: card.front,
					back: card.back,
					category: card.category,
					fileName: card.fileName,
				} as FlashCard;
			});

			setCards(initializedCards);

			const now = new Date();
			const due = initializedCards.filter((card) => {
				if (!card.due) return true;
				return new Date(card.due) <= now;
			});

			setDueCards(due);
			setStudyComplete(due.length === 0);
		};

		initializeCards();
	}, [jsonCards]);

	const getCurrentCard = useCallback(() => {
		return dueCards[currentCardIndex];
	}, [dueCards, currentCardIndex]);

	const nextCard = () => {
		if (dueCards.length === 0) return;
		setCurrentCardIndex((prev) => (prev + 1) % dueCards.length);
		setShowFront(true);
		setQualityScore(null);
	};

	const prevCard = () => {
		if (dueCards.length === 0) return;
		setCurrentCardIndex((prev) =>
			prev === 0 ? dueCards.length - 1 : prev - 1
		);
		setShowFront(true);
		setQualityScore(null);
	};

	const flipCard = () => {
		setShowFront((prev) => !prev);
	};

	const handleWidthChange = useCallback((newWidth) => {
		setSidebarWidth(newWidth);
	}, []);

	const handleQualityScoreClick = (rating: Rating) => {
		if (isSubmittingReview || dueCards.length === 0) return;

		const card = getCurrentCard();
		if (!card) return;

		try {
			const schedulingInfo = f.repeat(card, new Date());
			const updatedCard = schedulingInfo[rating].card;

			const newScore = {
				id: card.cardId,
				due: updatedCard.due.toISOString(),
				stability: updatedCard.stability,
				difficulty: updatedCard.difficulty,
				elapsed_days: updatedCard.elapsed_days,
				scheduled_days: updatedCard.scheduled_days,
				reps: updatedCard.reps,
				lapses: updatedCard.lapses,
				state: updatedCard.state,
				last_review:
					updatedCard.last_review?.toISOString() ||
					new Date().toISOString(),
			};

			setLocalCardScores((prev) => [...prev, newScore]);

			setCards((prevCards) =>
				prevCards.map((c) =>
					c.cardId === card.cardId ? { ...c, ...updatedCard } : c
				)
			);

			setDueCards((prevDueCards) => {
				const newDueCards = prevDueCards.filter(
					(_, index) => index !== currentCardIndex
				);

				if (newDueCards.length === 0) {
					setStudyComplete(true);
				} else {
					if (currentCardIndex >= newDueCards.length) {
						setCurrentCardIndex(0);
					}
				}
				return newDueCards;
			});

			setShowFront(true);
			setQualityScore("Easy");
		} catch (error) {
			console.error("Error processing card rating:", error);
		}
	};

	useEffect(() => {
		if (studyComplete && localCardScores.length > 0) {
			submitReview();
		}
	}, [studyComplete, localCardScores, submitReview]);

	useEffect(() => {
		const handleKeyUp = (e) => {
			switch (e.key) {
				case "ArrowRight":
					e.preventDefault();
					nextCard();
					break;
				
				case "ArrowLeft":
					e.preventDefault();
					prevCard();
					break;
				case " ":
					e.preventDefault();
					flipCard();
					break;
				
				case "a":
					e.preventDefault();
					handleQualityScoreClick(Rating.Again);
					break;
				case "h":
					e.preventDefault();
					handleQualityScoreClick(Rating.Hard);
					break;

				case "g":
					e.preventDefault();
					handleQualityScoreClick(Rating.Good);
					break;

				case "e":
					e.preventDefault();
					handleQualityScoreClick(Rating.Easy);
					break;

				case "Escape":
					e.preventDefault();
					setKeyboardShortcutsMenu(false);
					break;

				
			}
		};

		document.addEventListener('keyup', handleKeyUp)

		return () => {
			document.removeEventListener('keyup', handleKeyUp)
		}

	}, [handleQualityScoreClick, nextCard, prevCard])

	if (!set || cards.length === 0) {
		return (
			<div className="h-screen w-full flex items-center justify-center">
				<div className="text-xl">Loading cards...</div>
			</div>
		);
	}

	if (studyComplete) {
		return (
			<>
				<Toaster />
				<div className="h-screen w-full flex items-center justify-center">
					<div className="text-center p-8 bg-neutral rounded-xl shadow-lg max-w-md">
						<CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
						<h1 className="text-2xl font-bold text-white mb-2">
							Great job!
						</h1>
						<p className="text-white mb-6">
							You&apos;ve completed all your practice cards for
							today. Come back tomorrow for more practice!
						</p>
						<p className="text-white mb-6">
							Want to practice more?{" "}
							<Link href={"#"} className="underline">
								Change your settings
							</Link>
						</p>
						<div className="space-y-3">
							<Link href="/flashcards/my-sets">
								<Button className="w-full bg-gray-200 hover:bg-gray-300 text-neutral-900">
									<Home className="w-4 h-4 mr-2" />
									Back to My Sets
								</Button>
							</Link>

							
						</div>
					</div>
				</div>
			</>
		);
	}

	const currentCard = getCurrentCard();
	if (!currentCard) {
		return (
			<div className="h-screen w-full flex items-center justify-center">
				<div className="text-xl">No cards available</div>
			</div>
		);
	}



	return (
		<>
			<Toaster />

			<div
				className={`fixed left-0 top-0 h-full bg-neutral-900/95 backdrop-blur-md shadow-2xl z-50 flex flex-col border-r border-neutral-700 ${
					showSidebar ? "translate-x-0" : "-translate-x-full"
				}`}
				style={{ width: showSidebar ? `${sidebarWidth}px` : "60px" }}
			>
				<div className="flex items-center justify-between p-4 border-b border-neutral-700">
					<div className="flex items-center space-x-3"></div>

					<Button
						onClick={handleSidebar}
						variant="ghost"
						size="sm"
						className="p-2 hover:bg-neutral-800 text-neutral-400 hover:text-white"
					>
						<PanelLeft className="w-4 h-4" />
					</Button>

				</div>
				
				
				{showSidebar && <Sidebar onWidthChange={handleWidthChange} />}
			</div>



			{!showSidebar && (
				<>
					<Button
						onClick={handleSidebar}
						className="fixed top-4 left-4 z-40 p-3 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg transition-all duration-200 backdrop-blur-sm"
					>
						<PanelLeft className="w-5 h-5 text-neutral-300" />
					</Button>


					<Button
						onClick={() => setKeyboardShortcutsMenu(!keyboardShortcutsMenu)}
						className="fixed top-4 left-18 z-40 p-3 bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg transition-all duration-200 backdrop-blur-sm"
					>
						<Keyboard className="w-5 h-5 text-neutral-300" />
					</Button>

					{keyboardShortcutsMenu && (
						<div className="fixed top-18 left-20 z-40 bg-neutral-800 p-4 rounded-2xl ">
							<h1 className="text-md">Shortcuts Menu</h1>
							
							<p className="inline-block text-sm">Right & Left Arrows <SquareChevronLeft className="inline-block size-4"/> <SquareChevronRight className="inline-block size-4"/> - Previous/Next Card</p>

							<br />
							<p className="inline-block text-sm">Space Bar <Space className="inline-block size-4"/> - Flip Card</p>

							<br />
							<p className="inline-block text-sm">a, h, g, e - Rate Card (Again, Hard, Good, Easy)</p>

						</div>

					)

					}
				</>
			)}

			{showSidebar && (
				<div
					className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
					onClick={handleSidebar}
				/>
			)}

			<div
				className="h-screen w-auto flex items-center justify-center transition-all duration-300 relative"
				style={{
					marginLeft: showSidebar ? `${sidebarWidth}px` : "0px",
					paddingLeft: showSidebar ? "0" : "80px",
				}}
			>
				<div
					className={`absolute w-1/2 h-1/2 transition-transform duration-200 flip-inner cursor-pointer ${
						!showFront ? "flipped" : ""
					}`}
					onClick={flipCard}
				>
					<div className="flip-face front absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/3 rounded-[10px] hover-animation">
						<h2 className="pl-3 py-2">
							<Album className="inline-block mr-1" />{" "}
							{currentCard.category}
						</h2>
						<div className="flex justify-center items-center h-[calc(100%-80px)] text-2xl p-4">
							{currentCard.front}
						</div>
						<h2 className="absolute right-0 bottom-0 m-2">front</h2>
					</div>

					<div className="flip-face back absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/6 rounded-[10px] hover-animation">
						<h2 className="pl-3 py-2">
							<Album className="inline-block mr-1" />{" "}
							{currentCard.category}
						</h2>
						<div className="flex justify-center items-center h-[calc(100%-120px)] text-2xl p-4">
							{showFront ? <h1></h1> : currentCard.back}
						</div>

						<div
							className="flex justify-center items-center gap-4 mb-4"
							onClick={(e) => e.stopPropagation()}
						>
							{[
								{
									rating: Rating.Again,
									label: "Again",
									color: "red",
								},
								{
									rating: Rating.Hard,
									label: "Hard",
									color: "orange",
								},
								{
									rating: Rating.Good,
									label: "Good",
									color: "green",
								},
								{
									rating: Rating.Easy,
									label: "Easy",
									color: "blue",
								},
							].map(({ rating, label, color }) => (
								<button
									key={rating}
									onClick={() =>
										handleQualityScoreClick(rating)
									}
									disabled={isSubmittingReview}
									className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 ${
										qualityScore === rating
											? `bg-${color}-500 text-white shadow-lg`
											: `border border-${color}-400 text-${color}-600 hover:bg-${color}-50 hover:shadow-md`
									}`}
								>
									{label}
								</button>
							))}
						</div>
						<h2 className="absolute right-0 bottom-0 m-2">back</h2>
					</div>
				</div>

				<div className="bottom-10 right-5 absolute">
					<h1 className="text-lg">{dueCards.length}</h1>
				</div>

				<Link href="/flashcards/my-sets">
					<Button className="rounded-full right-0 top-5 absolute bg-white hover:bg-gray-300">
						<Home className="text-black" />
					</Button>
				</Link>

				{dueCards.length > 1 && (
					<>
						<Button
							className="absolute right-8 top-1/2 transform -translate-y-1/2 rounded-full border border-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 p-3 shadow-lg hover:shadow-xl"
							onClick={nextCard}
						>
							<ArrowRight className="w-6 h-6 text-white" />
						</Button>
						<Button
							className="absolute left-8 top-1/2 transform -translate-y-1/2 rounded-full border border-white bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-200 p-3 shadow-lg hover:shadow-xl"
							onClick={prevCard}
						>
							<ArrowLeft className="w-6 h-6 text-white" />
						</Button>
					</>
				)}
			</div>
		</>
	);
}
