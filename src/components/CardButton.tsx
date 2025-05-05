"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function CardButton({ jsonCards, number_cards }) {
    let [currentCard, setCurrentCard] = useState(0);

    return (
        <div>
            <div className="flex items-center justify-center h-screen bg-neutral-900">
                {jsonCards[currentCard].back}

                <Button
                    onClick={() => {

                        if (currentCard == number_cards-1) {
                            setCurrentCard(0);
                        } else {
                            setCurrentCard(i => i+1);
                        }
                    }}>

                    Next
                </Button>

            </div>
        </div>
  );
}
