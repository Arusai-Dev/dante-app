'use client'

import { useEffect, useState } from "react";
import { ArrowDown, Check, PlusCircle, Eye, EyeOff } from "lucide-react";
import { createNewSet, getSetById, getSetByTitle } from "@/lib/dbFunctions";
import { useCreateStore } from "@/app/stores/createStores";
import { toast, Toaster } from "sonner";

export default function SetSelectionSection() {

    // zustand
    const { 
        sets,
        dropDownIsOpen, 
        selectedSetTitle, 
        selectedSetDescription, 
        selectedSetCardCnt, 
        setSelectedSet, 
        setCurrentSet,
        setDropDownIsOpen, 
        setSelectedSetTitle,
        setSelectedSetDescription,
        setSelectedSetCardCnt,
    } = useCreateStore()

    const toggleDropDown = () => {
        setDropDownIsOpen(!dropDownIsOpen);
    }

    // New Set
    const [newSetIsOpen, setNewSetIsOpen] = useState(false);
    const toggleNewSetUI = () => {
        setNewSetIsOpen(!newSetIsOpen);
    }

    const clearNewSetForm = () => {
        setNewSetTitle("");
        setNewSetDescription("");
        setIsPrivate(false);
    }

    const [newSetTitle, setNewSetTitle] = useState("");
    const [newSetDescription, setNewSetDescription] = useState("");
    const [isPrivate, setIsPrivate] = useState(false);
    const newSetUserId = "userid"; // testing purposes only later will get current user
    const cards = [];
    const date_created = new Date();
    const number_cards = 0;

    const onNewSetSubmit = async () => {
        await createNewSet(newSetTitle, newSetDescription, isPrivate, date_created, number_cards, newSetUserId, cards);
        console.log(date_created)
        const result = await getSetByTitle(newSetUserId, newSetTitle)
        const id = result?.[0]?.id;
        if (id) setSelectedSet(id);
        setCurrentSet(result?.[0])
        setSelectedSetTitle(result?.[0]?.title)
        setSelectedSetDescription(result?.[0]?.description)
        setSelectedSetCardCnt(result?.[0]?.number_cards)
        toggleNewSetUI();
        clearNewSetForm();
    }

    return (
        <>
        {/* Set Selection / Description */}
        <Toaster />
        <div className="flex justify-between h-[150px] w-[1150px] bg-[#D9D9D9]/3 py-3 px-4 rounded-[10px]">
            <div className="flex flex-col justify-between h-full">
                <div>
                    <h2 className="font-bold text-2xl">{selectedSetTitle == "" ? 'No Set Selected' : selectedSetTitle}</h2>
                    <p>{selectedSetTitle == "" ? '' : selectedSetDescription}</p>
                </div>
                {selectedSetDescription && (
                    <div>
                        <p>{selectedSetCardCnt} Cards</p>
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

                        {selectedSetTitle ? selectedSetTitle : "Select A Set"} 
                        <ArrowDown/>
                    </button>

                    {/* Drop Drown Content */}
                    {dropDownIsOpen && (
                        <div className="absolute mt-1 flex flex-col gap-2 overflow-y-auto z-50 w-[200px] max-h-[300px] py-2 bg-[#202020] rounded-[5px] border-1 border-[#828282] hidden-scrollbar">
                            {sets.map((set, index:number) => (
                                <div 
                                    key={index} 
                                    className="bg-[#202020] cursor-pointer flex rounded-[5px] py-[3px] pl-1 gap-x-2 mx-2 hover-animation whitespace-nowrap hide-scrollbar"
                                    onClick={() => {
                                        setCurrentSet(set)
                                        setSelectedSetTitle(set.title)
                                        setSelectedSetDescription(set.description)
                                        setSelectedSet(set.id)
                                        setSelectedSetCardCnt(set.cards.length)
                                    }}
                                >
                                    {selectedSetTitle == set.title && (
                                        <Check/>
                                    )}
                                    <div className="overflow-x-auto max-w-[200px] hide-scrollbar">{set.title}</div>
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
                        <PlusCircle/>
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
                                <h2>Set Title</h2>
                                <input 
                                    className="px-2 py-1 border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                                    onChange={(e) => setNewSetTitle(e.target.value)}
                                ></input>
                            </div>

                            <div>
                                <h2 className="pb-2">Set Description (optional)</h2>
                                <textarea 
                                    className="set-desc-text-area px-2 py-1 w-full resize-y h-[150px] border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                                    value={newSetDescription}
                                    onChange={(e) => {
                                        setNewSetDescription(e.target.value)
                                    }}
                                ></textarea>
                            </div>

                            <div className="flex gap-3 justify-between items-center">
                                <div className="flex items-center">
                                    <h1 className="font-semibold pr-2">Visibility:</h1>
                                    <button 
                                        className="flex justify-center cursor-pointer items-center w-[50px] h-[40px] py-1 bg-[#D9D9D9] text-[#141414] font-bold rounded-[5px] border-1 border-[#828282] hover-animation-secondary"
                                        onClick={() => {setIsPrivate(!isPrivate); toast(`Set is now ${isPrivate ? "private" : "public"}`)}}
                                    >{isPrivate ? <Eye/> : <EyeOff/>}</button>
                                </div>

                                <div className="flex gap-3">
                                    <button 
                                        className="flex justify-center cursor-pointer items-center w-[125px] h-[40px] py-1 bg-[#D9D9D9]/3 font-bold rounded-[5px] border-1 border-[#828282] hover-animation"
                                        onClick={() => {
                                            toggleNewSetUI();
                                            clearNewSetForm();
                                        }}
                                    >Cancel</button>

                                    <button 
                                        className="flex justify-center cursor-pointer items-center w-[125px] h-[40px] py-1 bg-[#D9D9D9] text-[#141414] font-bold rounded-[5px] border-1 border-[#828282] hover-animation-secondary"
                                        onClick={onNewSetSubmit}
                                    >Save</button>
                                </div>
                            </div>
                        </div>
                        </>
                    )}
                </div>
            </div>
        </div>
        </>
    )
}