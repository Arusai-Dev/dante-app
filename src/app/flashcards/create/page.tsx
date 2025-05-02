'use client'

import Image from "next/image"
import { useEffect, useState } from "react"

export default function Create() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropDown = () => {
        setIsOpen(!isOpen);
    }

    const closeDropDown = (e: MouseEvent) => {

        const target = e.target as HTMLElement; 

        if (!target.closest(".select-set-dd")) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', closeDropDown);

        return () => {
            document.removeEventListener('click', closeDropDown);
        };
    }, []);

    const [selectedKey, setSelectedKey] = useState("");
    const [selectedDict, setSelectedDict] = useState("");

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

    return (

        <section className="flex flex-col items-center pt-[65px] font-(family-name:inter)">

            {/* Title */}
            <div className="flex flex-col items-center pt-[30px] pb-9">
                <h1 className=" text-4xl font-bold ">Set Creator</h1>
                <p className=" text-[22px] pt-2">Create, organize, and manage your sets!</p>   
            </div>        


            {/* Set Selection / Description */}
            <div className="flex justify-between h-[150px] w-[1150px] bg-[#D9D9D9]/3 py-3 px-4 rounded-[10px]">
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <h2 className="font-bold text-2xl">{selectedKey == "" ? 'No Set Selected' : selectedKey}</h2>
                        <p>{selectedKey == "" ? '' : selectedDict.Description}</p>
                    </div>
                    {selectedDict && selectedDict.Cards && (
                        <div>
                            <p>{selectedDict.Cards.length} Cards</p>
                        </div>
                    )}
                </div>

                {/* Select Set Drop Down */}
                <div className="flex gap-[11px]">
                    <div className="select-set-dd">
                        <button 
                            className="flex justify-between items-center w-[250px] h-[40px] py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover-animation"
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
                        {isOpen && (
                            <div className="absolute mt-1 flex flex-col gap-2 overflow-y-auto w-[200px] max-h-[300px] py-2 bg-[#202020] rounded-[5px] border-1 border-[#828282] hidden-scrollbar">
                                {Object.entries(userSets).map(([key, value], index) => (
                                    <div 
                                        key={index} 
                                        className="bg-[#202020] flex rounded-[5px] py-[3px] pl-1 gap-x-2 mx-2 hover-animation overflow-x-scroll whitespace-nowrap hide-scrollbar"
                                        onClick={() => {
                                            setSelectedKey(key)
                                            setSelectedDict(value)
                                        }}
                                    >
                                        {selectedKey == key && (
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
                            className="flex justify-between items-center w-[125px] h-[40px] py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200"
                            onClick={}
                        >
                            <Image
                                src="/icons/add.svg"
                                alt="add icon"
                                width={20}
                                height={20}
                            />
                            New Set
                        </button>
                    </div>
                </div>
            </div>



            {/* Nav -> Create Card / Manage Cards */}




            {/* Create Flashcard / Preview Section */}




        </section>
        
    )  
}