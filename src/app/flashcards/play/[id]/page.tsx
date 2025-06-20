"use client"

import { Button } from "@/components/ui/button";
import { getSetById } from "@/lib/dbFunctions"
import { Album, ArrowLeft, ArrowRight, Shuffle } from "lucide-react";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export default function PlaySet({ params }) {  
    const [paramId, setParamId] = useState();
    const [flashcardSet, setFlashcardSet] = useState([]);
    const [currentCard, setCurrentCard] = useState(0);
    const [showFront, setShowFront] = useState(true);
    const [isShuffle, setIsShuffle] = useState(false);
    
    
    useEffect(() => {
        async function getParamId() {
            const { id } = await params;
            setParamId(id);
        }

        getParamId()
    }, [params])


    useEffect(() => {
        async function getInfo() {
            const [set] = await getSetById(paramId)
            
            setFlashcardSet([set])

        }
        getInfo()
    }, [paramId])

    const jsonCards = flashcardSet[0]?.cards;
    const number_cards = flashcardSet[0]?.card_cnt;

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

    const setShuffle = () => {
        if (isShuffle == false) { setIsShuffle(true) }
        else { setIsShuffle(false) }
    }


    if (!flashcardSet[0]) return;


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


                <div className="bottom-0 absolute lg:p-50 sm:p-10">
                    <Button className={`rounded-4xl border border-white px-50 hover-animation ${isShuffle ? 'bg-neutral-600' : '' }`} onClick={setShuffle}>
                        <Shuffle />
                    </Button>
                </div>

            </div>
        </>
  );
}


