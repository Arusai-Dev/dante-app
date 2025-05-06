"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Album, ArrowLeft, ArrowRight, BookCheck, Shuffle, Swords, Target } from "lucide-react";
import { toast, Toaster } from 'sonner'

export default function CardButton({ jsonCards, number_cards }) {
    const [currentCard, setCurrentCard] = useState(0);
    const [showFront, setShowFront] = useState(true);
    const [isShuffle, setIsShuffle] = useState(false);

    const flipCard = () => {
        setShowFront(!showFront);
    }

    const nextCard = () => {
        if (isShuffle == false) {

            if (currentCard == number_cards-1) {setCurrentCard(0)} 
            else { setCurrentCard(i => i+1) } 
        } else {
            let random_int = Math.floor(Math.random() * (number_cards))
            while (random_int == currentCard) {
                random_int = Math.floor(Math.random() * (number_cards))
            }
            setCurrentCard(random_int)
        }
    }

    const prevCard = () => {
        if (currentCard == 0) { setCurrentCard(number_cards-1) } 
        else { setCurrentCard(i => i-1) }
    }

    const markChallenging = ():void => {
        if (jsonCards[currentCard].markedEasy == "true") {
            toast("Cannot mark question as both easy and challenging.")
        } else {
            if (jsonCards[currentCard].markedChallenging == "true") {

                jsonCards[currentCard].markedChallenging = "false";
                toast("No longer marked as challenging"); 
                nextCard();

            } else {
                jsonCards[currentCard].markedChallenging = "true";
                toast("Marked as challenging"); 
                nextCard();
            }
        }
    }

    const markEasy = ():void => {
        if (jsonCards[currentCard].markedChallenging == "true") {
            toast("Cannot mark question as both easy and challenging.")
        } else {
            if (jsonCards[currentCard].markedEasy == "true") {

                jsonCards[currentCard].markedEasy = "false";
                toast("No longer marked as easy"); 
                nextCard();

            } else {
                jsonCards[currentCard].markedEasy = "true";
                toast("Marked as easy"); 
                nextCard();
            }
        }
    }

    const checkEasy = ():boolean => {
        return jsonCards[currentCard].markedEasy == "true"
    }

    const checkChallenging = ():boolean => {
        return jsonCards[currentCard].markedChallenging == "true"
    }

    const setShuffle = () => {
        if (isShuffle == false) { setIsShuffle(true) }
        else { setIsShuffle(false) }
    }


    return (
        <>
            <div className="h-screen w-screen flex items-center justify-center">
                    <Toaster 
                        toastOptions={{

                        }}
                    />

                    <div className={`absolute w-1/2 h-1/2 transition-transform duration-500 flip-inner cursor-pointer ${!showFront ? 'flipped' : ''}`} onClick={flipCard}>

                        <div className="flip-face front absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/3 rounded-[10px] hover-animation">
                            <h2 className="pl-3 py-2"><Album className="inline-block mr-1" /> {jsonCards[currentCard].category}</h2>
                            <div className="flex justify-center items-center h-[calc(100%-80px)] text-2xl">{jsonCards[currentCard].front}</div>
                            <h2 className="absolute right-0 bottom-0 m-2">front</h2>
                        </div>

                        <div className="flip-face back absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/6 rounded-[10px] hover-animation">
                            <h2 className="pl-3 py-2"><Album className="inline-block mr-1" /> {jsonCards[currentCard].category}</h2>
                            <div className="flex justify-center items-center h-[calc(100%-80px)] text-2xl">{jsonCards[currentCard].back}</div>

                            <div className="absolute top-0 right-0">


                                <button onClick={() => markChallenging() } className="relative group inline-block">
                                    <Swords className={`inline-block m-2 hover:text-red-500 ${checkChallenging() ? 'text-red-300' : ''}`} />
                                    <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
                                        Challenging
                                    </span>

                                </button>

                                <button onClick={() => markEasy() } className="relative group inline-block">

                                    <BookCheck className={`inline-block m-2 hover:text-green-400 ${checkEasy() ? 'text-green-300' : ''}`} />
                                    <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
                                        Easy 
                                   </span>
                                   
                                </button>



                            </div>
                            <h2 className="absolute right-0 bottom-0 m-2">back</h2>

                        </div>

                    </div>

                    <div className="right-0 absolute lg:p-50 sm:p-10">
                        <Button className="rounded-4xl border border-white px-50 hover-animation" onClick={nextCard}>
                            <ArrowRight />
                        </Button>

                    </div>


                <div className="left-0 absolute lg:p-50 sm:p-10">
                    <Button className="rounded-4xl border border-white px-50 hover-animation" onClick={prevCard}>
                        <ArrowLeft />
                    </Button>
                </div>


                <div className="top-0 absolute lg:p-50 sm:p-10 ">
                    <Target className="inline-block mr-4 top-0" /><h1 className="top-0 inline-block">Practice Mode.</h1>
                </div>
                        
            </div>

        </>
  );
}
