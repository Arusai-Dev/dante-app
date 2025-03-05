'use client'

import { SetStateAction, useEffect, useState } from "react"

export default function Create() {
    const [front, setFront] = useState("")
    const [back, setBack] = useState("")
    const [flipped, setFlipped] = useState(false)

    const changeInFront = (event: { target: { value: SetStateAction<string> } }) => {
        setFront(event.target.value)
    }

    const changeInBack = (event: { target: { value: SetStateAction<string> } }) => {
        setBack(event.target.value)
    }
    const setFlippedOnClick = () => {
        setFlipped(prev => !prev)
    };
    

    return (

        <div className="h-screen w-[6000px] overflow-x-scroll">

            {/* card_input */}
            <div className="absolute flex flex-col gap-[7px] justify-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#141414]">
                
                
                <div className=" bg-[#D9D9D9] w-[300px] h-[40px] flex items-center font-bold text-[20px] pl-3 pb-[3px] rounded-[7px]"><h1>Front</h1></div>
                <div className=" bg-[#D9D9D9] w-[300px] h-[40px] flex items-center font-semibold text-[20px] pl-3 pb-[3px] rounded-[7px]">
                    <input placeholder="Enter Text..." value={front} onChange={changeInFront}></input>
                </div>


                <div className=" bg-[#D9D9D9] w-[300px] h-[40px] flex items-center font-bold text-[20px] pl-3 pb-[3px] rounded-[7px]"><h1>Back</h1></div>
                <div className=" bg-[#D9D9D9] w-[300px] h-[40px] flex items-center font-semibold text-[20px] pl-3 pb-[3px] rounded-[7px]">
                    <input placeholder="Enter Text..." value={back} onChange={changeInBack}></input>
                </div>

                {/* preview */}
                {!flipped && (
                    <div className=" bg-[#D9D9D9] cursor-pointer h-[400px] rounded-[7px]" onClick={() => setFlippedOnClick()}>
                        <h1 className="relative">Front Preview</h1>
                        <p className="flex justify-center items-center">{front === "" ? "This is where the text goes..." : front}</p>
                    </div>
                )}

                {flipped && (
                    <div className="bg-[#D9D9D9] cursor-pointer h-[400px] rounded-[7px] relative" onClick={() => setFlippedOnClick()}>
                        <h1>Back Preview</h1>
                        <p className="w-full text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px] overflow-hidden whitespace-nowrap max-h-[260px]">{back === "" ? "This is where the text goes..." : back}</p>
                    </div>
                )}
                        
            </div>
        </div>
    )

        
}