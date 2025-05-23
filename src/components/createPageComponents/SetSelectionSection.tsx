'use client'

import { useState } from "react";
import { ArrowDown, Check, PlusCircle, Eye, EyeOff } from "lucide-react";
import { createNewSet, getSetByTitle, updateCardCount } from "@/lib/dbFunctions";
import { useCreateStore } from "@/app/stores/createStores";
import { toast, Toaster } from "sonner";
import Tooltip from "../Tooltip";

export default function SetSelectionSection() {

    // zustand
    const { 
        sets,
        dropDownIsOpen, 
        currentSet,
        setCurrentSet,
        setDropDownIsOpen, 
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
        setCurrentSet(result?.[0])
        toggleNewSetUI();
        clearNewSetForm();
    }


    return (
        <>
        {/* Set Selection / Description */}
        <Toaster />
        <div className="flex flex-col-reverse md:flex-row w-[calc(100vw-20px)] max-w-[400px] md:max-w-[1150px] md:justify-between h-[100px] md:h-[150px] bg-[#D9D9D9]/3 py-2 px-2 md:px-3 rounded-[10px] gap-2">
            <div className="flex flex-col justify-between h-full">
                <div>
                    <h2 className="font-bold text-[14px] pb-1 md:text-xl lg:text-2xl truncate">{currentSet.title == "" ? 'No Set Selected' : currentSet.title}</h2>
                    <p className="text-[12px] md:text-lg lg:text-xl truncate">{currentSet.title == "" ? '' : currentSet.description}</p>
                </div>
                {currentSet.description && (
                    <div>
                        <p className="text-[12px] md:text-xl">{currentSet.card_cnt} Cards</p>
                    </div>
                )}
            </div>

            {/* Select Set Drop Down / New Set Button */} 
            {/* mobile/desktop tailwind */}
            <div className="
                flex
                gap-[5px] md:gap-[11px] 
                w-[calc(100vw-20px)] md:w-fit 
                max-w-[400px] md:max-w-[1150px] 
                relative md:static 
                left-1/2 md:left-auto 
                top-[145px] sm:top-[10px]
                -translate-x-1/2 md:translate-x-0 
                justify-center md:justify-between
            ">

                {/* Select Set Drop Down */}
                <div className="select-set-dd basis-[70%] max-w-[68%] grow">
                    <button 
                        className="flex justify-between cursor-pointer items-center w-full gap-[3px] md:gap-2 h-[25px] md:w-[250px] md:h-[40px] whitespace-nowrap sm:pr-[2px] sm:pl-[4px] py-1 pl-[8px] pr-[4px] md:px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover-animation"
                        onClick={toggleDropDown}
                        >

                        <div className="truncate font-semibold text-[12px] md:text-[16px]">{currentSet.title ? currentSet.title : "Select A Set"} </div>
                        <div className="flex items-center justify-center">
                            <ArrowDown className="h-[16px] md:h-[20px] md:w-[20px]"/>
                        </div>
                    </button>

                    {/* Drop Drown Content */} 
                    {dropDownIsOpen && (
                        <div className="absolute mt-1 flex flex-col gap-1 overflow-y-auto z-50 w-[calc(100vw-20px)] max-w-[400px] md:max-w-[1150px] md:w-[250px] max-h-[300px] py-1 bg-[#202020] rounded-[5px] border-1 border-[#828282] ">
                            {sets.map((set, index:number) => (
                                <div 
                                    key={index} 
                                    className="bg-[#202020] cursor-pointer flex rounded-[5px] py-[3px] md:pl-1 gap-x-1 mx-1 md:mx-2 hover-animation whitespace-nowrap "
                                    
                                    onClick={() => {
                                        setCurrentSet(set)
                                        const updateCtn = async () => {
                                            await updateCardCount(currentSet.id, currentSet.card_cnt)
                                        }
                                        updateCtn()
                                    }}
                                >
                                    <div className="flex items-center justify-center">
                                        {currentSet.title == set.title && (
                                            <Check className="h-[16px] md:h-[20px] md:w-[36px]"/>
                                        )}
                                    </div>
                                    
                                    <div className="w-fit md:max-w-[250px] text-[12px] md:text-lg overflow-x-hidden truncate" title={set.title}>{set.title}</div>
                                </div>
                            ))}
                        </div>
                    )}        
                </div>
                

                {/* New Set Button */}
                <div className="new-set-btn basis-[30%]">
                    <button 
                        className="flex cursor-pointer justify-between items-center font-semibold md:text-[16px] w-full gap-1 md:w-[130px] h-[25px] md:h-[40px] text-[12px] md:text-lg whitespace-nowrap py-1 pr-[8px] pl-[4px] md:px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200"
                        onClick={toggleNewSetUI}
                    >
                        <div className="flex items-center justify-center">
                            <PlusCircle className="h-[16px] md:h-[20px] md:w-[20px]"/>
                        </div>
                        New Set
                    </button>
                    

                </div>
            </div>
        </div>


        {newSetIsOpen && (
            <>
            <div className="absolute bg-black/3 backdrop-blur-sm z-40" onClick={toggleNewSetUI}></div>

            <div className="fixed inset-0 z-40 flex items-center justify-center">
                <div className="new-set-btn-pop-up z-50 px-7 py-6 flex flex-col gap-8 rounded-md md:w-fit bg-[#1e1e1e] transition-all duration-[0.2s]">
                    
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
                            >
                                {isPrivate ? 
                                    <div className="flex items-center justify-center">
                                        <Eye className="h-[16px] md:h-[20px] md:w-[20px]"/>
                                    </div> 
                                    : 
                                    <div className="flex items-center justify-center">
                                        <EyeOff className="h-[16px] md:h-[20px] md:w-[20px]"/>
                                    </div>
                                }
                            </button>
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
                                onClick={() => {

                                    if (newSetTitle == "") {
                                        toast('Please enter a Title')
                                    } 


                                    else { 
                                        onNewSetSubmit()
                                    }


                                }}
                            >Save</button>
                        </div>
                    </div>
                </div>
            </div>
            </>
        )}
        </>
    )
}