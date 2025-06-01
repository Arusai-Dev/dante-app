"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Album, PanelLeft, Target, MessageSquare, ImageIcon, ArrowUp, ArrowRight, ArrowLeft, Home, CheckCircle } from "lucide-react";
import { Toaster } from 'sonner'
import { fsrs, Card, Rating, State, createEmptyCard } from "ts-fsrs";
import ChatBubble from "./chatBubble";
import { Button } from "./ui/button";
import Link from "next/link";
import { getSetById } from "@/lib/dbFunctions";
import Image from 'next/image'

interface FlashCard extends Card {
    cardId: number;
    front: string;
    back: string;
    category: string;
    fileName: string;
}

type Message = {
    sender: "user" | "model";
    text: string;
}

export default function CardButton({ jsonCards, number_cards, setId, set }) {
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showFront, setShowFront] = useState(true);
    const [qualityScore, setQualityScore] = useState<Rating | null>(null);
    const [cards, setCards] = useState<FlashCard[]>([]);
    const [dueCards, setDueCards] = useState<FlashCard[]>([]);
    const [showSidebar, setShowSidebar] = useState(false);
    const [message, setMessage] = useState('');
    const [sidebarWidth, setSidebarWidth] = useState(320);
    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);
    const [studyComplete, setStudyComplete] = useState(false);
    const [allCardImages, setAllCardImages] = useState({})

    const f = fsrs();
    
    const isResizing = useRef(false);
    const sidebarRef = useRef(null);
    const startX = useRef(0);
    const startWidth = useRef(320);
    
    useEffect(() => {
        const initializeCards = () => {
            const initializedCards = jsonCards.map(card => {
                let fsrsCard: Card;
                
                if (card.state === 0 || !card.due || !card.last_review) {
                    fsrsCard = createEmptyCard();
                } else {
                    fsrsCard = {
                        due: new Date(card.due),
                        stability: card.stability || 0,
                        difficulty: card.difficulty || 0,
                        elapsed_days: card.elapsed_days || 0,
                        scheduled_days: card.scheduled_days || 0,
                        reps: card.reps || 0,
                        lapses: card.lapses || 0,
                        state: card.state || State.New,
                        last_review: card.last_review ? new Date(card.last_review) : undefined,
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
            const due = initializedCards.filter(card => {
                if (!card.due) return true; 
                return new Date(card.due) <= now;
            });
            
            setDueCards(due);
            setStudyComplete(due.length === 0);

            const retrieveCardImages = async () => {
                const res = await getSetById(setId)
                const currentSetCards = res[0]?.cards || []
                
                const imagePromises = currentSetCards.map(async (card) => {
                    const imageUrl = await fetchSignedImageUrl(setId, card.cardId, card.fileName)
                    return [
                        card.cardId,
                        imageUrl,
                    ]
                })
        
                const entries = await Promise.all(imagePromises)
                const cardImagesMap = Object.fromEntries(entries)
        
                setAllCardImages(cardImagesMap)
            }
        
            const fetchSignedImageUrl = async (setId: number, cardId: number, fileName: string) => {
                const res = await fetch(`/api/get-image?setId=${setId}&cardId=${cardId}&fileName=${fileName}`);
                const data = await res.json();
                return data.url;
            };

            retrieveCardImages()
        };
        
        initializeCards();
    }, [jsonCards]);
    
    console.log(allCardImages)

    const getCurrentCard = useCallback(() => {
        return dueCards[currentCardIndex];
    }, [dueCards, currentCardIndex]);

    const submitReview = async (rating: Rating) => {
        if (isSubmittingReview || dueCards.length === 0) return;
        
        setIsSubmittingReview(true);
        
        try {
            const card = getCurrentCard();
            
            const schedulingInfo = f.repeat(card, new Date());
            const updatedCard = schedulingInfo[rating].card;
            
            const response = await fetch(`/api/fsrs-update/${setId}/${card.cardId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    due: updatedCard.due.toISOString(),
                    stability: updatedCard.stability,
                    difficulty: updatedCard.difficulty,
                    elapsed_days: updatedCard.elapsed_days,
                    scheduled_days: updatedCard.scheduled_days,
                    reps: updatedCard.reps,
                    lapses: updatedCard.lapses,
                    state: updatedCard.state,
                    last_review: updatedCard.last_review?.toISOString() || new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                console.error('API Error:', response.status, errorData);
                throw new Error(`Failed to update card: ${response.status} - ${errorData.error || 'Unknown error'}`);
            }

 
            setCards(prevCards => 
                prevCards.map(c => 
                    c.cardId === card.cardId 
                        ? { ...c, ...updatedCard }
                        : c
                )
            );

       
            setDueCards(prevDueCards => {
                const newDueCards = prevDueCards.filter((_, index) => index !== currentCardIndex);
                
      
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
            setQualityScore(null);
            
        } catch (error) {
            console.error('Error submitting review:', error);
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const nextCard = () => {
        if (dueCards.length === 0) return;
        setCurrentCardIndex(prev => (prev + 1) % dueCards.length);
        setShowFront(true);
        setQualityScore(null);
    };

    const prevCard = () => {
        if (dueCards.length === 0) return;
        setCurrentCardIndex(prev => prev === 0 ? dueCards.length - 1 : prev - 1);
        setShowFront(true);
        setQualityScore(null);
    };

    const flipCard = () => {
        setShowFront(prev => !prev);
    };

    const handleQualityScoreClick = (rating: Rating) => {
        setQualityScore(rating);
        submitReview(rating);
    };
    
    useEffect(() => {
        const sessionId = crypto.randomUUID();
    }, 
    []);
    
    const handleSidebar = () => {
        setShowSidebar(prev => !prev);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (message.length > 0) {
            const userMessage: Message = {
                sender: "user",
                text: message
            };
            
            setAllMessages((prev) => [...prev, userMessage]);
            
            try {
                const res = await fetch("/api/chat", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        message: message,
                        sessionId: crypto.randomUUID() 
                    })
                });
                
                const data = await res.json();
                
                const modelMessage: Message = {
                    sender: "model",
                    text: data.response
                };
                
                setAllMessages((prev) => [...prev, modelMessage]);
            } catch (error) {
                console.error('Chat error:', error);
            }
            
            setMessage("");
        }        
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        isResizing.current = true;
        startX.current = e.clientX;
        startWidth.current = sidebarWidth;
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isResizing.current) return;
        
        const deltaX = e.clientX - startX.current;
        const newWidth = Math.max(280, Math.min(500, startWidth.current + deltaX));
        setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
        isResizing.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    if (cards.length === 0) {
        return <div>Loading cards...</div>;
    }

    if (studyComplete) {
        return (
            <>
                <Toaster />
                <div className="h-screen w-full flex items-center justify-center">
                    <div className="text-center p-8 bg-neutral rounded-xl shadow-lg max-w-md">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl font-bold text-white mb-2">Great job!</h1>
                        <p className="text-white mb-6">
                            You&apos;ve completed all your practice cards for today. Come back tomorrow for more practice!
                        </p>
                        <p className="text-white mb-6">
                            Want to practice more? <Link href={"#"} className="underline">Change your settings</Link>
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


    return (
        <>
            <Toaster />

            <div 
                ref={sidebarRef}
                className={`fixed left-0 top-0 h-full bg-neutral-900 shadow-2xl transition-all duration-300 ease-in-out z-50 flex flex-col ${
                    showSidebar ? 'translate-x-0' : '-translate-x-full'
                }`}
                style={{ width: showSidebar ? `${sidebarWidth}px` : '60px' }}
            >
                <div className="flex items-center justify-between p-4 border-b border-neutral-700 bg-neutral-800">
                    <div className="flex items-center space-x-2">
                        {showSidebar && (
                            <>
                                <MessageSquare className="w-5 h-5 text-white" />
                                
                            </>
                        )}
                    </div>
                    
                    <button 
                        onClick={handleSidebar}
                        className="p-2 rounded-lg hover:bg-neutral-600 transition-colors duration-200"
                    >
                        <PanelLeft className='w-5 h-5 text-white transition-transform' />
                    </button>
                </div>

                {showSidebar && (
                    <>
                        <div 
                            className="flex-1 overflow-y-auto p-4 space-y-2"
                            style={{ height: 'calc(100vh - 200px)' }}
                        >
                            {allMessages.map((msg, index) => (
                                <ChatBubble key={index} message={msg.text} sender={msg.sender} />
                            ))}
                        </div>

                        <div className="p-4 border-t border-neutral-700 bg-neutral-800">
                            <div className="space-y-3">
                                <textarea 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            handleSubmit(e);
                                        }
                                    }}
                                    placeholder="Type your message..."
                                    className="w-full bg-neutral-700 text-white placeholder-neutral-400 rounded-lg p-3 resize-none focus:outline-none focus:ring-2 focus:ring-neutral-300 transition-all duration-200 border border-neutral-600"
                                    rows={3}
                                />
                                <button
                                    onClick={handleSubmit}
                                    className="float-right ml-2 bg-white hover:bg-neutral-300 text-black font-medium py-2 px-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-600"
                                >
                                    <ArrowUp />
                                </button>
                                <button
                                    className="disabled:bg-neutral-400 float-right bg-white hover:bg-neutral-300 text-black font-medium py-2 px-2 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-neutral-600"
                                    disabled    
                                >
                                    <ImageIcon />
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {showSidebar && (
                    <div 
                        className="absolute right-0 top-0 bottom-0 w-1 bg-neutral-600 hover:bg-neutral-500 cursor-col-resize"
                        onMouseDown={handleMouseDown}
                    />
                )}
            </div>

            {!showSidebar && (
                <button
                    onClick={handleSidebar}
                    className="fixed top-4 left-4 z-40 p-3 bg-neutral-900 hover:bg-neutral-800 rounded-lg shadow-lg transition-all duration-200"
                >
                    <PanelLeft className="w-5 h-5 text-white" />
                </button>
            )}

            {showSidebar && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
                    onClick={handleSidebar}
                />
            )}
            
            <div 
                className="h-screen w-auto flex items-center justify-center transition-all duration-300 relative"
                style={{ 
                    marginLeft: showSidebar ? `${sidebarWidth}px` : '0px',
                    paddingLeft: showSidebar ? '0' : '80px'
                }}
            >
                <div className={`absolute w-1/2 h-1/2 transition-transform duration-200 flip-inner cursor-pointer ${!showFront ? 'flipped' : ''}`} onClick={flipCard}>
                    <div className="flip-face front absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/3 rounded-[10px] hover-animation">
                        <h2 className="pl-3 py-2">
                            <Album className="inline-block mr-1" /> {getCurrentCard()?.category}
                        </h2>
                        <div className="flex justify-center items-center h-[calc(100%-80px)] text-2xl">
                            {getCurrentCard()?.front}
                        </div>
                        <h2 className="absolute right-0 bottom-0 m-2">front</h2>
                    </div>

                    <div className="flip-face back absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/6 rounded-[10px] hover-animation">
                        <h2 className="pl-3 py-2">
                            <Album className="inline-block mr-1" /> {getCurrentCard()?.category}
                        </h2>
                        <div className="flex justify-center items-center h-[calc(100%-120px)] text-2xl">
                            {getCurrentCard()?.back}
                            {
                                allCardImages[getCurrentCard().cardId] ? (
                                    <Image
                                        src={allCardImages[getCurrentCard().cardId]}
                                        alt={getCurrentCard()?.fileName}
                                        width={200}
                                        height={200}
                                        className="w-full max-w-xs h-40 object-cover rounded border-1 border-[#8c8c8c]"
                                    />
                                ) : (
                                    ""
                                )

                            }
                        </div>

                        <div className="flex justify-center items-center gap-4 mb-4" onClick={(e) => e.stopPropagation()}>
                            {[
                                { rating: Rating.Again, label: "Again", color: "red" },
                                { rating: Rating.Hard, label: "Hard", color: "orange" },
                                { rating: Rating.Good, label: "Good", color: "green" },
                                { rating: Rating.Easy, label: "Easy", color: "blue" }
                            ].map(({ rating, label, color }) => (
                                <button
                                    key={rating}
                                    onClick={() => handleQualityScoreClick(rating)}
                                    disabled={isSubmittingReview}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50
                                        ${qualityScore === rating
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
                
                <div className="top-0 absolute lg:p-50 sm:p-10">
                    <Target className="inline-block mr-4 top-0" />
                    <h1 className="top-0 inline-block">Practice Mode - {currentCardIndex + 1}/{dueCards.length} due</h1>
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