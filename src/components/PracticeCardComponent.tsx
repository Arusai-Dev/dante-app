"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Album, ArrowLeft, ArrowRight, Target } from "lucide-react";
import { Toaster } from 'sonner'
import Sm2PatchAction, { FsrsPatchAction } from "@/actions/patchAction";
import { getSetById } from "@/lib/dbFunctions";

export default function CardButton({ jsonCards, number_cards, setId }) {
    const [currentCard, setCurrentCard] = useState(0);
    const [showFront, setShowFront] = useState(true);
    const [qualityScore, setQualityScore] = useState('');

    let result = jsonCards.sort((a, b) => new Date(a.due_date) - new Date(b.due_date))

    const [dueCards, setDueCards] = useState(result);

    const flipCard = () => {
        setShowFront(!showFront);
    }

    const nextCard = async () => {

        // await Sm2PatchAction(parseInt(qualityScore), dueCards[currentCard].ease_factor, dueCards[currentCard].repetition, dueCards[currentCard].indv_card_id, setId, dueCards[currentCard].interval)
        await FsrsPatchAction(jsonCards[currentCard], qualityScore, setId);

        result = jsonCards.sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
        setDueCards(result)


        if (currentCard == dueCards.length-1) {
            setCurrentCard(0)
        } 
        else { setCurrentCard(i => i+1) } 

        setQualityScore('')
    }

    const prevCard = () => {
        if (currentCard == 0) { setCurrentCard(number_cards-1) } 
        else { setCurrentCard(i => i-1) }
    }

    const handleQualityScoreClick = (e) => {
        setQualityScore(e.target.value);

    }

    return (

            <div className="h-screen w-screen flex items-center justify-center">
                <Toaster />

                <div className={`absolute w-1/2 h-1/2 transition-transform duration-500 flip-inner cursor-pointer ${!showFront ? 'flipped' : ''}`} onClick={flipCard} >

                    <div className="flip-face front absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/3 rounded-[10px] hover-animation">
                        <h2 className="pl-3 py-2"><Album className="inline-block mr-1" /> {dueCards[currentCard].category}</h2>
                        <div className="flex justify-center items-center h-[calc(100%-80px)] text-2xl">{dueCards[currentCard].front}</div>
                        <h2 className="absolute right-0 bottom-0 m-2">front</h2>
                    </div>

                        
                    <div className="flip-face back absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/6 rounded-[10px] hover-animation">
                        <h2 className="pl-3 py-2"><Album className="inline-block mr-1" /> {dueCards[currentCard].category}</h2>
                        <div className="flex justify-center items-center h-[calc(100%-80px)] text-2xl">{dueCards[currentCard].back}</div>

                        <div className="flex justify-center items-center gap-6">
                            {/* <input onChange={handleQualityScoreClick} checked={qualityScore == "0"} className="w-7 h-7 border-2 rounded-full" type="radio" id="0" name="quality_score" value="0" /> */}
                            <input onChange={handleQualityScoreClick} checked={qualityScore == "1"} className="w-7 h-7 border-2 rounded-full" type="radio" id="1" name="quality_score" value="1" />
                            <input onChange={handleQualityScoreClick} checked={qualityScore == "2"} className="w-7 h-7 border-2 rounded-full" type="radio" id="2" name="quality_score" value="2" />
                            <input onChange={handleQualityScoreClick} checked={qualityScore == "3"} className="w-7 h-7 border-2 rounded-full" type="radio" id="3" name="quality_score" value="3" />
                            <input onChange={handleQualityScoreClick} checked={qualityScore == "4"} className="w-7 h-7 border-2 rounded-full" type="radio" id="4" name="quality_score" value="4" />
                            {/* <input onChange={handleQualityScoreClick} checked={qualityScore == "5"} className="w-7 h-7 border-2 rounded-full" type="radio" id="5" name="quality_score" value="5" /> */}

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
    );
}
