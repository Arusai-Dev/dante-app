'use client'

import Image from "next/image"
import { useEffect, useState } from "react"

export default function Create() {

    // Info
    const [selectedSetName, setSelectedSetName] = useState("");
    const [selectedSetInfo, setSelectedSetInfo] = useState("");

    // Drop Down 
    const [dropDownIsOpen, setDropDownIsOpen] = useState(false);
    const toggleDropDown = () => {
        setDropDownIsOpen(!dropDownIsOpen);
    }

    // New Set
    const [newSetIsOpen, setNewSetIsOpen] = useState(false);
    const toggleNewSetUI = () => {
        setNewSetIsOpen(!newSetIsOpen);
    }

    // New Set Text Area 
    const [newSetTextArea, setNewSetTextArea] = useState("");

    // Create / Manage Nav
    const [active, setActive] = useState("create");

    // Current Card Data
    const [currentCard, setCurrentCard] = useState([]);

    // Preview Card
    const [showFront, setShowFront] = useState(true);
    const flipCard = () => {
        setShowFront(!showFront);
    }

    const userSets = {
        "Chinese Chapter 1": {
            "Description": "Chinese flashcards for lesson 1",
            "Cards": [
                {"category": "vocab", "front": "Hello", "back": "Ni hao"}, 
                {"category": "vocab", "front": "Why?", "back": "Wei shenme"},
                {"category": "grammar", "front": "what?", "back": "shenme?"}
            ] 
        },
        "German Chapter 34": {
            "Description": "German flashcards for lesson 6",
            "Cards": [
                {"category": "vocab", "front": "Hello", "back": "Hallo"}, 
                {"category": "vocab", "front": "Why?", "back": "warum?"},
                {"category": "grammar", "front": "what?", "back": "was?"}
            ]
        }
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

    return (

        <section className="flex flex-col items-center pt-[65px] pb-[65px] font-(family-name:inter)">

            {/* Title */}
            <div className="flex flex-col items-center pt-[30px] pb-9">
                <h1 className=" text-4xl font-bold ">Set Creator</h1>
                <p className=" text-[22px] pt-2">Create, organize, and manage your sets!</p>   
            </div>        



            {/* Set Selection / Description */}
            <div className="flex justify-between h-[150px] w-[1150px] bg-[#D9D9D9]/3 py-3 px-4 rounded-[10px]">
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <h2 className="font-bold text-2xl">{selectedSetName == "" ? 'No Set Selected' : selectedSetName}</h2>
                        <p>{selectedSetName == "" ? '' : selectedSetInfo.Description}</p>
                    </div>
                    {selectedSetInfo && selectedSetInfo.Cards && (
                        <div>
                            <p>{selectedSetInfo.Cards.length} Cards</p>
                        </div>
                    )}
                </div>

                {/* Select Set Drop Down / New Set Button */}
                <div className="flex gap-[11px]">


                    {/* Select Set Drop Down */}
                    <div className="select-set-dd">
                        <button 
                            className="flex justify-between cursor-pointer items-center w-[250px] h-[40px] py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover-animation"
                            onClick={toggleDropDown}
                            >

                            {`My Set Name`} 
                            <Image 
                                src="/icons/arrow.svg"
                                alt="arrow icon"
                                width={24}
                                height={24}  
                            />
                        </button>

                        {/* Drop Drown Content */}
                        {dropDownIsOpen && (
                            <div className="absolute mt-1 flex flex-col gap-2 overflow-y-auto w-[200px] max-h-[300px] py-2 bg-[#202020] rounded-[5px] border-1 border-[#828282] hidden-scrollbar">
                                {Object.entries(userSets).map(([key, value], index) => (
                                    <div 
                                        key={index} 
                                        className="bg-[#202020] cursor-pointer flex rounded-[5px] py-[3px] pl-1 gap-x-2 mx-2 hover-animation overflow-x-scroll whitespace-nowrap hide-scrollbar"
                                        onClick={() => {
                                            setSelectedSetName(key)
                                            setSelectedSetInfo(value)
                                        }}
                                    >
                                        {selectedSetName == key && (
                                            <Image src="/icons/checkmark.svg" alt="checkmark icon" width={24} height={24}/>
                                        )}
                                        <div className="overflow-x-auto max-w-[200px] hide-scrollbar">{key}</div>
                                    </div>
                                ))}
                            </div>
                        )}        
                    </div>
                    

                    
                    {/* New Set Button */}
                    <div className="new-set-btn">
                        <button 
                            className="flex cursor-pointer justify-between items-center w-[125px] h-[40px] py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200"
                            onClick={toggleNewSetUI}
                        >
                            <Image
                                src="/icons/add.svg"
                                alt="add icon"
                                width={20}
                                height={20}
                            />
                            New Set
                        </button>
                        
                        {newSetIsOpen && (
                            <>
                            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40" onClick={toggleNewSetUI}></div>

                            <div className="new-set-btn-pop-up z-50 px-7 py-6 flex flex-col gap-8 rounded-md fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] bg-[#1e1e1e] transition-all duration-[0.2s]">
                                
                                <div>
                                    <h1 className="text-2xl font-bold">Create New Set</h1>
                                    <p className="text-[#8c8c8c]">Create a new set to organize your flashcards.</p>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <h2>Set Name</h2>
                                    <input className="px-2 py-1 border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"></input>
                                </div>

                                <div>
                                    <h2 className="pb-2">Set Description (optional)</h2>
                                    <textarea 
                                        className="set-desc-text-area px-2 py-1 w-full resize-y h-[150px] border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                                        onChange={(e) => setNewSetTextArea(e.target.value)}
                                    ></textarea>
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button 
                                        className="flex justify-center cursor-pointer items-center w-[125px] h-[40px] py-1 bg-[#D9D9D9]/3 font-bold rounded-[5px] border-1 border-[#828282] hover-animation"
                                        onClick={() => {
                                            toggleNewSetUI();
                                            setNewSetTextArea("");
                                        }}
                                    
                                    >Cancel</button>

                                    <button 
                                        className="flex justify-center cursor-pointer items-center w-[125px] h-[40px] py-1 bg-[#D9D9D9] text-[#141414] font-bold rounded-[5px] border-1 border-[#828282] hover-animation-secondary"
                                        
                                    
                                    >Save</button>
                                </div>
                                
                            </div>
                            </>
                        )}
                    </div>
                </div>
            </div>



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
                        <input className="px-2 py-1 mb-6 w-full border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"></input>

                        
                        <h2 className="text-[16px] pb-2">Front Side</h2>
                        <input className="px-2 py-1 mb-6 w-full border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"></input>

                        
                        <h2 className="text-[16px] pb-2">Back Side</h2>
                        <textarea 
                            className="set-desc-text-area mb-6 px-2 py-1 w-full resize-y h-[150px] border-[1px] border-[#8c8c8c] rounded-[5px] transition-colors duration-200 hover:bg-[#323232]"
                        ></textarea>
                        
                        <div className="flex gap-2 w-full max-w-[600px]">
                            <button 
                                className="flex justify-center cursor-pointer bg-[#D9D9D9] text-[#0F0F0F] items-center grow-[356] h-[45px] py-1 px-3 font-bold text-xl rounded-[5px] hover-animation-secondary"
                                // onClick = {}
                                >
            
                                {`Add Card`} 
                            </button>

                            <button 
                                className="flex justify-center cursor-pointer items-center grow-[165] h-[45px] py-1 px-3 font-bold text-xl rounded-[5px] hover-animation border-1 border-[#8c8c8c]"
                                // onClick = {}
                                >
            
                                {`Clear`} 
                            </button>
                        </div>
                        
                    </div>


                    <div className="w-[565px] h-[565px] pl-4">
                        <h1 className="font-bold text-2xl pb-3">Preview</h1>

                        <div className={`relative w-full h-[255px] transition-transform duration-500 flip-inner ${!showFront ? 'flipped' : ''}`} onClick={flipCard}>
                            
                            {/* front */}
                            <div className="flip-face front absolute top-0 left-0 w-full h-full bg-[#D9D9D9]/3 rounded-[10px]">
                                <h2 className="pl-3 py-2">{`Category`}</h2>
                                <div className="flex justify-center items-center h-[calc(100%-80px)]">{`front`}</div>
                            </div>

                            {/* back */}
                            <div className="flip-face back absolute top-0 left-0 w-full h-full bg-[#A9A9A9]/3 rounded-[10px]">
                                <h2 className="pl-3 py-2">{`Category`}</h2>
                                <div className="flex justify-center items-center h-[calc(100%-80px)]">{`back`}</div>
                            </div>
                            
                        </div>

                        <div className="flex">
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


        </section>  
    )  
}