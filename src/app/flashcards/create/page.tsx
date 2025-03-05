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
                
                
                <div className="bg-[#D9D9D9] w-full h-full font-bold text-[20px] pl-3 pb-[3px] rounded-[7px]"><h1>Front</h1></div>
                <div className=" w-[300px] h-[40px] flex items-center font-semibold text-[20px] pb-[3px] rounded-[7px]">
                    <textarea 
                    className="flex min-h-[60px] w-[300px] bg-[#D9D9D9] rounded-md border border-input px-3 py-2 text-[20px] shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    placeholder="Enter Text..." 
                    value={front} 
                    onChange={changeInFront}>
                    </textarea>
                </div>


                <div className=" bg-[#D9D9D9] w-[300px] h-[40px] flex items-center font-bold text-[20px] pl-3 pb-[3px] rounded-[7px]"><h1>Back</h1></div>
                <div className=" bg-[#D9D9D9] w-[300px] h-[40px] flex items-center font-semibold text-[20px] pl-3 pb-[3px] rounded-[7px]">
                    <input placeholder="Enter Text..." value={back} onChange={changeInBack}></input>
                </div>

                {/* preview */}
                {!flipped && (
                    <div className=" bg-[#D9D9D9] cursor-pointer h-[400px] rounded-[7px] relative" onClick={() => setFlippedOnClick()}>
                        <h1 className="relative">Front Preview</h1>
                        <p className="w-full text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px]">{front === "" ? "This is where the text goes..." : front}</p>
                    </div>
                )}

                {flipped && (
                    <div className="bg-[#D9D9D9] cursor-pointer h-[400px] rounded-[7px] relative" onClick={() => setFlippedOnClick()}>
                        <h1>Back Preview</h1>
                        <p className="w-full text-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[18px]">{back === "" ? "This is where the text goes..." : back}</p>
                    </div>
                )}
                        
            </div>
        </div>
    )

        
}