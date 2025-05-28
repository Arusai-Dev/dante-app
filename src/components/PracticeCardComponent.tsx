"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Album,  PanelLeft, Target, MessageSquare, Image, ArrowUp, ArrowRight, ArrowLeft, Home } from "lucide-react";
import { Toaster } from 'sonner'
import { Sm2PatchAction, FsrsPatchAction } from "@/actions/patchAction";
import { getSetById } from "@/lib/dbFunctions";
import { fsrs } from "ts-fsrs";
import ChatBubble from "./chatBubble";
import { Button } from "./ui/button";
import Link from "next/link";

export default function CardButton({ jsonCards, number_cards, setId, set }) {
    const [currentCard, setCurrentCard] = useState(0);
    const [showFront, setShowFront] = useState(true);
    const [qualityScore, setQualityScore] = useState('');
    const [reviewQueue, setReviewQueue] = useState(fsrs());
    const [showSidebar, setShowSidebar] = useState(false);
    const [message, setMessage] = useState('');
    const [sidebarWidth, setSidebarWidth] = useState(320);
    
    type Message = {
        sender: "user" | "model";
        text: string 
    }
    
    const [allMessages, setAllMessages] = useState<Message[]>([]);

    const isResizing = useRef(false);
    const sidebarRef = useRef(null);
    const startX = useRef(0);
    const startWidth = useRef(320);
    
    const nextCard = async () => {
        // if (!reviewQueue.length || !qualityScore) return;
    
        // const current = reviewQueue[currentCard];
        // const updatedCard = await FsrsPatchAction(current, qualityScore, setId);
    
        // const now = new Date();
        // const dueCards = updatedQueue.filter(card => card.stability && new Date(card.due) <= now);
        // const newCards = updatedQueue.filter(card => !card.stability);
    
        // const sortedQueue = [...dueCards, ...newCards];
        // setReviewQueue(sortedQueue);
    
        // if (currentCard == dueCards.length-1) {
        //     setCurrentCard(0)
        // } 
        // else { setCurrentCard(i => i+1) } 
    
        // setShowFront(true);
        // setQualityScore('');
    
    };

    const flipCard = () => {
        setShowFront(prev => !prev);
    };

    const prevCard = () => {
        if (currentCard == 0) { setCurrentCard(number_cards-1) } 
        else { setCurrentCard(i => i-1) }
    }

    const handleQualityScoreClick = (e) => {
        setQualityScore(e.target.value);
    }
    
    useEffect(() => {
        if (!localStorage.getItem("chat_session_id")) {
            localStorage.setItem("chat_session_id", crypto.randomUUID())
        }
    }, []);
    
    const handleSidebar = () => {
        setShowSidebar(prev => !prev);
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (message.length > 0) {
            const userMessage: Message = {
                sender: "user",
                text: message
            } 
            
            setAllMessages((prev) => [...prev, userMessage]);
            
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    message: message,
                    sessionId: localStorage.getItem("chat_session_id")
                })
            })
            
            const data = await res.json();
            
            const modelMessage: Message = {
                sender: "model",
                text: await data.response
            }
            
            setAllMessages((prev) => [...prev, modelMessage])
            
            setMessage("")
        }        
    }

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
                        <PanelLeft 
                            className='w-5 h-5 text-white transition-transform'
                        />
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
                                    <Image />

                                </button>
                            </div>
                        </div>
                    </>
                )}

                {showSidebar && (
                    <div 
                        className="absolute right-0 top-0 bottom-0 w-1 bg-neutral-600 hover:bg-neutral-500 cursor-col-resize "
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


                <div className={`absolute w-1/2 h-1/2 transition-transform duration-500 flip-inner cursor-pointer ${!showFront ? 'flipped' : ''}`} onClick={flipCard} >

                    <div className="flip-face front absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/3 rounded-[10px] hover-animation">
                        <h2 className="pl-3 py-2"><Album className="inline-block mr-1" /> {jsonCards[currentCard].category}</h2>
                        <div className="flex justify-center items-center h-[calc(100%-80px)] text-2xl">{jsonCards[currentCard].front}</div>
                        <h2 className="absolute right-0 bottom-0 m-2">front</h2>
                    </div>

                        
                    <div className="flip-face back absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/6 rounded-[10px] hover-animation">
                    
                        <h2 className="pl-3 py-2"><Album className="inline-block mr-1" /> {jsonCards[currentCard].category}</h2>
                        <div className="flex justify-center items-center h-[calc(100%-80px)] text-2xl">{jsonCards[currentCard].back}</div>

                        <div className="flex justify-center items-center gap-4 mb-4" onClick={(e) => e.stopPropagation()}>
                            <label className="flex items-center cursor-pointer group">
                                <input 
                                    onChange={handleQualityScoreClick} 
                                    checked={qualityScore == "1"} 
                                    className="sr-only" 
                                    type="radio" 
                                    id="1" 
                                    name="quality_score" 
                                    value="1" 
                                />
                                <div className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                                    ${qualityScore == "1" 
                                        ? 'border-blue-500 bg-blue-500 shadow-lg' 
                                        : 'border-gray-400 hover:border-blue-400 hover:shadow-md'
                                    }`}>
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700">1</span>
                            </label>
                            
                            <label className="flex items-center cursor-pointer group">
                                <input 
                                    onChange={handleQualityScoreClick} 
                                    checked={qualityScore == "2"} 
                                    className="sr-only" 
                                    type="radio" 
                                    id="2" 
                                    name="quality_score" 
                                    value="2" 
                                />
                                <div className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                                    ${qualityScore == "2" 
                                        ? 'border-green-500 bg-green-500 shadow-lg' 
                                        : 'border-gray-400 hover:border-green-400 hover:shadow-md'
                                    }`}>
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700">2</span>
                            </label>
                            
                            <label className="flex items-center cursor-pointer group">
                                <input 
                                    onChange={handleQualityScoreClick} 
                                    checked={qualityScore == "3"} 
                                    className="sr-only" 
                                    type="radio" 
                                    id="3" 
                                    name="quality_score" 
                                    value="3" 
                                />
                                <div className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                                    ${qualityScore == "3" 
                                        ? 'border-yellow-500 bg-yellow-500 shadow-lg' 
                                        : 'border-gray-400 hover:border-yellow-400 hover:shadow-md'
                                    }`}>
                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700">3</span>
                            </label>
                            
                            <label className="flex items-center cursor-pointer group">
                                <input 
                                    onChange={handleQualityScoreClick} 
                                    checked={qualityScore == "4"} 
                                    className="sr-only" 
                                    type="radio" 
                                    id="4" 
                                    name="quality_score" 
                                    value="4" 
                                />
                                <div className={`w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center
                                    ${qualityScore == "4" 
                                        ? 'border-red-500 bg-red-500 shadow-lg' 
                                        : 'border-gray-400 hover:border-red-400 hover:shadow-md'
                                    }`}>

                                </div>
                                <span className="ml-2 text-sm font-medium text-gray-700">4</span>
                            </label>
                        </div>
                        

                        <h2 className="absolute right-0 bottom-0 m-2">back</h2>

                    </div>
                </div>
                
                <div className="top-0 absolute lg:p-50 sm:p-10 ">
                    <Target className="inline-block mr-4 top-0" /><h1 className="top-0 inline-block">Practice Mode.</h1>
                    
                </div>

                
                <Link href="/flashcards/my-sets">
                    <Button className="rounded-full right-0 top-5 absolute bg-white hover:bg-gray-300">
                        <Home className="text-black" />
                    </Button>          
                
                </Link>
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
                
            </div>
        </>
    );
}