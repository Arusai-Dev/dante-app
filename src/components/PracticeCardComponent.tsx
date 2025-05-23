"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Album, ArrowLeft, ArrowRight, PanelLeft, Target } from "lucide-react";
import { Toaster } from 'sonner'
import { Sm2PatchAction, FsrsPatchAction } from "@/actions/patchAction";
import { getSetById } from "@/lib/dbFunctions";
import { fsrs } from "ts-fsrs";
import ChatBubble from "./chatBubble";

export default function CardButton({ jsonCards, number_cards, setId, set }) {
    const [currentCard, setCurrentCard] = useState(0);
    const [showFront, setShowFront] = useState(true);
    const [qualityScore, setQualityScore] = useState('');
    const [reviewQueue, setReviewQueue] = useState(fsrs());
    const [showSidebar, setShowSidebar] = useState(false);
    const [message, setMessage] = useState('');
    
    type Message = {
        sender: "user" | "model";
        text: string 
    }
    
    const [allMessages, setAllMessages] = useState<Message[]>([]);

    
    useEffect(() => {
        if (!localStorage.getItem("chat_session_id")) {
            localStorage.setItem("chat_session_id", crypto.randomUUID())
        }
    }, []);
    
    
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

    const handleSidebar = () => {
        if (showSidebar == false) {
            setShowSidebar(true);

        } else {
            setShowSidebar(false)
        }
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
    
    return (
        <>
        <Toaster />

            <div className={`float-left h-screen mt-13 mr-3  bg-neutral-900 ${showSidebar ? 'w-96' : 'w-auto'}`}>
                <button onClick={handleSidebar}><PanelLeft className={`size-6 ${!showSidebar ? '' : 'top-0 right-0' }`}/></button>
                {
                    showSidebar ? (
                        <form onSubmit={handleSubmit}>
                            <div className="h-screen resize p-4 space-y-2">
                                {
                                    allMessages.map((msg, index:number) => (
                                        <ChatBubble key={index} message={msg.text} sender={msg.sender} />
                                    ))
                                }
                                
                                <input type="submit" hidden></input>
                                
                                <textarea 
                                    value={message} 
                                    onChange={(e) => setMessage(e.target.value)} 
                                    onKeyDown={(e) => {
                                        if (e.key == 'Enter' && !e.shiftKey) {
                                            handleSubmit(e);
                                        }
                                    }}  
                                    className="bg-neutral-800 w-85 h-20 focus:border-white bottom-5 absolute" 
                                    id="">
                                        
                                </textarea>
                                
                            </div>
                        </form>
                    ): (
                        <h1></h1>
                    )
                }


            </div>

            <div className="h-screen w-auto flex items-center justify-center">
                <div className={`absolute w-1/2 h-1/2 transition-transform duration-500 flip-inner cursor-pointer ${!showFront ? 'flipped' : ''}`} onClick={flipCard} >

                    <div className="flip-face front absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/3 rounded-[10px] hover-animation">
                        <h2 className="pl-3 py-2"><Album className="inline-block mr-1" /> {jsonCards[currentCard].category}</h2>
                        <div className="flex justify-center items-center h-[calc(100%-80px)] text-2xl">{jsonCards[currentCard].front}</div>
                        <h2 className="absolute right-0 bottom-0 m-2">front</h2>
                    </div>

                        
                    <div className="flip-face back absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/6 rounded-[10px] hover-animation">
                        <h2 className="pl-3 py-2"><Album className="inline-block mr-1" /> {jsonCards[currentCard].category}</h2>
                        <div className="flex justify-center items-center h-[calc(100%-80px)] text-2xl">{jsonCards[currentCard].back}</div>

                        <div className="flex justify-center items-center gap-6">
                            <input onChange={handleQualityScoreClick} checked={qualityScore == "1"} className="w-7 h-7 border-2 rounded-full" type="radio" id="1" name="quality_score" value="1" />
                            <input onChange={handleQualityScoreClick} checked={qualityScore == "2"} className="w-7 h-7 border-2 rounded-full" type="radio" id="2" name="quality_score" value="2" />
                            <input onChange={handleQualityScoreClick} checked={qualityScore == "3"} className="w-7 h-7 border-2 rounded-full" type="radio" id="3" name="quality_score" value="3" />
                            <input onChange={handleQualityScoreClick} checked={qualityScore == "4"} className="w-7 h-7 border-2 rounded-full" type="radio" id="4" name="quality_score" value="4" />
                        </div>

                        <h2 className="absolute right-0 bottom-0 m-2">back</h2>

                    </div>
                </div>
                
                <div className="top-0 absolute lg:p-50 sm:p-10 ">
                    <Target className="inline-block mr-4 top-0" /><h1 className="top-0 inline-block">Practice Mode.</h1>
                </div>



            </div>

            <Button className="rounded-4xl border absolute border-white  hover-animation" onClick={nextCard}>
                <ArrowRight />
            </Button>


            <Button className="rounded-4xl border absolute border-white hover-animation" onClick={prevCard}>
                <ArrowLeft />
            </Button>



        </>
    );
}
