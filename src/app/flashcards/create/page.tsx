'use client'

import Image from "next/image"
import SetSelectionSection from "@/components/createPageComponents/SetSelectionSection"
import { useEffect, useState } from "react"
import { useCreateStore } from "@/app/stores/createStores"
import { addOneCardToSet } from "@/lib/dbFunctions"

export default function Create() {
    const { 
        active, 
        selectedSet, 
        sets,
        setActive, 
        setSets, 
        setDropDownIsOpen, 
    } = useCreateStore()

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch("http://localhost:3000/api/my-sets");
            const data = await res.json();
            setSets(data.Sets);
        }
    
        fetchData();
    }, [sets]);
    
    // Current Card Data
    const [currentCardData, setCurrentCardData] = useState(['Category', 'Front', 'Back', 0, 2.5, 0]);
    const updateCard = (index: number, value: string) => {
        const updatedCard = [...currentCardData]
        updatedCard[index] = value;
        setCurrentCardData(updatedCard);
    };

    const clearCurrentCardData = () => {
        const updatedCard = [...currentCardData]
        updatedCard[0] = 'Category';
        updatedCard[1] = 'Front';
        updatedCard[2] = 'Back';
        setCurrentCardData(updatedCard);
    }

    // Preview Card
    const [showFront, setShowFront] = useState(true);
    const flipCard = () => {
        setShowFront(!showFront);
    }

    // Closes any open UI
    const closeAnyUi = (e: MouseEvent) => {
        const target = e.target as HTMLElement; 
        if (!target.closest(".select-set-dd")) {setDropDownIsOpen(false)}
    }
    
    useEffect(() => {
        document.addEventListener('click', closeAnyUi);

        return () => {
            document.removeEventListener('click', closeAnyUi);
        };
    }, []);

    const handleAddCard = (data: [string, string, string, number, number, number]) => {
        const [category, front, back, qualityScore, easeFactor, repetition] = data;

        // FUTURE WORK: HANDLE ERROR WHEN NO SET IS SELECTED
        if (!selectedSet) {
            console.warn("No set selected.");
            return;
        }
        
        addOneCardToSet(selectedSet, category, front, back, qualityScore, easeFactor, repetition);
    };   

    return (

        <section className="flex flex-col items-center pt-[65px] pb-[65px] font-(family-name:inter)">

            {/* Title */}
            <div className="flex flex-col items-center pt-[30px] pb-9">
                <h1 className=" text-4xl font-bold ">Set Creator</h1>
                <p className=" text-[22px] pt-2">Create, organize, and manage your sets!</p>   
            </div>        


            <SetSelectionSection/>

            {/* Nav -> Create Card / Manage Cards */}
            <div className="flex gap-2 items-center p-2 mt-4 w-[1150px] h-[65px] bg-[#D9D9D9]/3 rounded-[10px]">
                {active == "create" && (
                    <>
                    <button 
                        className="flex justify-center cursor-pointer items-center w-full h-[50px] py-1 px-3 font-bold text-2xl bg-[#D9D9D9]/3 rounded-[5px] hover-animation"
                        onClick={() => setActive("create")}
                        >
                        {`Create Card`} 
                    </button>
                    
                    <button 
                        className="flex justify-center cursor-pointer items-center w-full h-[50px] py-1 px-3 font-bold text-2xl rounded-[5px] hover-animation"
                        onClick={() => setActive("manage")}
                        >
    
                        {`Manage Cards`} 
                    </button>
                    </>
                )}
                {active == "manage" && (
                    <>
                    <button 
                        className="flex justify-center items-center cursor-pointer w-full h-[50px] py-1 px-3 font-bold text-2xl rounded-[5px] hover-animation"
                        onClick={() => setActive("create")}
                        >
                        {`Create Card`} 
                    </button>
                    
                    <button 
                        className="flex justify-center items-center cursor-pointer w-full h-[50px] py-1 px-3 font-bold text-2xl bg-[#D9D9D9]/3 rounded-[5px] hover-animation"
                        onClick={() => setActive("manage")}
                        >
    
                        {`Manage Cards`} 
                    </button>
                    </>
                )}
            </div>            



            {/* Create Flashcard / Preview Section */}
            {active == "create" && (
                <div className="flex mt-4 w-[1150px]">
                    <div className="w-[565px] bg-[#D9D9D9]/3 rounded-[10px] py-3 px-4
                    ">
                        <h1 className="font-bold text-2xl pb-4">Create New Card</h1>


                        <h2 className="text-[16px] pb-2">Category (optional)</h2>
                        <input className="px-2 py-1 mb-6 w-full border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                            value={currentCardData[0] == "Category" ? '' : currentCardData[0]}
                            onChange={(e) => updateCard(0, e.target.value)}
                        ></input>

                        
                        <h2 className="text-[16px] pb-2">Front Side</h2>
                        <textarea className=" mb-6 px-2 py-1 w-full resize-y h-[150px] border-[1px] border-[#8c8c8c] rounded-[5px] transition-colors duration-200 hover:bg-[#323232]"
                            value={currentCardData[1] == "Front" ? '' : currentCardData[1]}
                            onChange={(e) => updateCard(1, e.target.value)}
                        ></textarea>

                        
                        <h2 className="text-[16px] pb-2">Back Side</h2>
                        <textarea className=" mb-6 px-2 py-1 w-full resize-y h-[150px] border-[1px] border-[#8c8c8c] rounded-[5px] transition-colors duration-200 hover:bg-[#323232]"
                            value={currentCardData[2] == "Back" ? '' : currentCardData[2]}
                            onChange={(e) => updateCard(2, e.target.value)}
                        ></textarea>
                        
                        <div className="flex gap-2 w-full max-w-[600px] mb-1">
                            <button 
                                className="flex justify-center cursor-pointer bg-[#D9D9D9] text-[#0F0F0F] items-center grow-[356] h-[45px] py-1 px-3 font-bold text-xl rounded-[5px] hover-animation-secondary"
                                onClick={() => handleAddCard(currentCardData)}
                                >
            
                                {`Add Card`} 
                            </button>

                            <button 
                                className="flex justify-center cursor-pointer items-center grow-[165] h-[45px] py-1 px-3 font-bold text-xl rounded-[5px] hover-animation border-1 border-[#8c8c8c]"
                                onClick={() => clearCurrentCardData()}
                                >
            
                                {`Clear`} 
                            </button>
                        </div>
                        
                    </div>

                    {/* Preview */}
                    <div className="w-[565px] h-[565px] pl-4">
                        <h1 className="font-bold text-2xl pb-3">Preview</h1>

                        <div className={`relative w-full h-[255px] transition-transform duration-500 flip-inner cursor-pointer ${!showFront ? 'flipped' : ''}`} onClick={flipCard}>
                            
                            {/* front */}
                            <div className="flip-face front absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/3 rounded-[10px] hover-animation">
                                <h2 className="pl-3 py-2">{currentCardData[0]}</h2>
                                <div className="flex justify-center items-center h-[calc(100%-80px)]">{currentCardData[1]}</div>
                            </div>

                            {/* back */}
                            <div className="flip-face back absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/6 rounded-[10px] hover-animation">
                                <h2 className="pl-3 py-2">{currentCardData[0]}</h2>
                                <div className="flex justify-center items-center h-[calc(100%-80px)]">{currentCardData[2]}</div>
                            </div>
                            
                        </div>

                        <div className="flex mt-1">
                            <h2>Click to rotate</h2>
                            <Image
                                src="/icons/arrow.svg"
                                alt="arrow icon"
                                width={24}
                                height={24}
                                className=" rotate-180"  
                            />
                        </div>
                    </div>
                </div>
            )}
            
            
            {/* Manage Cards Section */}
            {active == "manage" && (
                <div>
                    
                </div>
            )}

        </section>  
    )  
}