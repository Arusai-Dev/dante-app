"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function CardButton({ jsonCards, number_cards }) {
    let [currentCard, setCurrentCard] = useState(0);

    return (
        <>
            <div className="h-screen w-screen flex items-center justify-center">

                    <div className="content-center items-center text-center h-1/2 w-1/2 bg-neutral-900 rounded-2xl">
                        <h1 className="text-2xl">{jsonCards[currentCard].back}</h1>

                    </div>

                <div className="right-0 absolute lg:p-50 sm:p-10">

                    <Button className="rounded-4xl border border-white px-50"
                    onClick={() => {
                        
                        if (currentCard == number_cards-1) {
                            setCurrentCard(0);
                        } else {
                                setCurrentCard(i => i+1);
                            }
                        }}>

                        <ArrowRight />
                    </Button>

                </div>


                <div className="left-0 absolute lg:p-50 sm:p-10">

                    <Button className="rounded-4xl border border-white px-50"
                    onClick={() => {
                        
                        if (currentCard == 0) {
                            setCurrentCard(number_cards-1);
                        } else {
                                setCurrentCard(i => i-1);
                            }
                        }}>

                        <ArrowLeft />
                    </Button>

                </div>
            </div>

        </>
  );
}
