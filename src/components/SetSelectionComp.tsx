'use client'

import { useEffect, useState } from "react";
import { ArrowDown, Check, PlusCircle, Import, FileTextIcon, Trash2, Menu } from "lucide-react";
import { addMultipleCardsToSet, updateCardCount } from "@/lib/dbFunctions";
import { generateUniqueCardId } from "@/lib/card/card";
import LineNumberedTextarea from "./TextAreaLineNumbers";
import { updateCurrentSet } from "@/app/hooks/managerHooks/useSetHandlers";
import NewSetModal from "./modals/NewSetModal";
import { useManagerNonPersistentStore, useManagerPersistentStore } from "@/app/stores/managerStores";
import BulkImportModal from "@/app/flashcards/manager/components/BulkImportModal";

export default function SetSelectionComp() {

    // Zustand States
    const {sets, currentSet, setCurrentSet} = useManagerPersistentStore()
    const {newSetUI, toggleNewSetUI} = useManagerNonPersistentStore()

    const [importUI, setImportUI] = useState(false);
    const [selectionDropDown, setSelectionDropDown] = useState(false);
    const [selectedDelimiterText, setSelectedDelimiterText] = useState("Pipe (|)");
    const [selectedDelimiter, setSelectedDelimiter] = useState("|");
    const [delimiterDropDown, setDelimiterDropDown] = useState(false);
    const [importedCardData, setImportedCardData] = useState();
    const [mobileActionsDropDown, setMobileActionsDropDown] = useState(false);
    const tempCardData = [
        {
            id: 1,
            front: "What is 2+2?",
            back: "4",
            category: "Math",
            due: 0,
            reps: 0,
            state: 0,
            lapses: 0,
            stability: 0,
            difficulty: 0,
            elapsed_day: 0,
            scheduled_days: 0,
            last_review: null,
        },
        {
            "id": 2,
            "front": "What is the capital of France?",
            "back": "Paris",
            "category": "Geography",
            due: 0,
            reps: 0,
            state: 0,
            lapses: 0,
            stability: 0,
            difficulty: 0,
            elapsed_day: 0,
            scheduled_days: 0,
            last_review: null,
        }
    ]

    const delimiters = ["Pipe (|)", "Comma (,)", "Semicolon (;)", "Tab"]


    const toggleSelectionDropDown = () => {
        if (selectionDropDown) setSelectionDropDown(false)
        else {
            setSelectionDropDown(true)
            setMobileActionsDropDown(false)
        }
    }

    const toggleActionDropDown = () => {
        if (mobileActionsDropDown) setMobileActionsDropDown(false)
        else {
            setMobileActionsDropDown(true)
            setSelectionDropDown(false)
        }
    }

    const closeAnyUi = (e: MouseEvent) => {
        const target = e.target as HTMLElement; 
        if (!target.closest(".select-set-dd")) {setSelectionDropDown(false)}
    }

    useEffect(() => {
        document.addEventListener('click', closeAnyUi);

        return () => {
            document.removeEventListener('click', closeAnyUi);
        };
    }, []);


    const toggleImportUI = () => {
        setImportUI(!importUI)
    }

    const handleDelimiterSelection = (e) => {
        const text = e.target.dataset.delimiter
        setSelectedDelimiterText(text)

        if (text == "Pipe (|)") setSelectedDelimiter("|")
        else if (text == "Comma (,)") setSelectedDelimiter(",")
        else if (text == "Semicolon (;)") setSelectedDelimiter(";")
        else if (text == "Tab") setSelectedDelimiter(" ")

        setDelimiterDropDown(!delimiterDropDown)
    }

    const handleImportDataChange = (e) => {
        const data = e.target.value

        const due = 0
        const reps = 0
        const state = 0
        const lapses = 0
        const stability = 0
        const difficulty = 0
        const elapsed_day = 0
        const scheduled_days = 0
        const last_review = null

        const cards = data
            .split("\n")
            .filter(line => line.trim())
            .map((line, index) => {
                const [front, back, category] = line.trim().split(selectedDelimiter)
                return {
                    cardId: generateUniqueCardId(currentSet.cards.map(card => card.cardId)),
                    front: front?.trim() || '',
                    back: back?.trim() || '',
                    category: category == "" ? category?.trim() || '' : "N/A",
                    originalFileName: "",
                    croppedFileName: "",
                    due: due,
                    reps: reps,
                    state: state,
                    lapses: lapses,
                    stability: stability,
                    difficulty: difficulty,
                    elapsed_day: elapsed_day,
                    scheduled_days: scheduled_days,
                    last_review: last_review,
                }
            })
        
        setImportedCardData(cards)
    }   

    const handleBulkImport = async () => {
        addMultipleCardsToSet(currentSet.id, importedCardData)
        setImportedCardData([])
        setImportUI(!importUI)
        await updateCurrentSet(currentSet.id)
    }

    return (
        <>
        {/* Set Selection / Description */}
        {/* Select Set Drop Down / New Set Button */} 
        <div className="w-[calc(100vw-20px)] max-w-[400px]   md:max-w-[1150px]">
            <div className="
                justify-start mb:my-5 flex 
                flex-col md:flex-row
                gap-[5px] md:gap-[11px]">

                {/* Select Set Drop Down */}
                <div className="select-set-dd">
                    <button 
                        className="
                            flex truncate cursor-pointer justify-between items-center whitespace-nowrap bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200
                            gap-[5px] md:gap-[11px]
                            w-full md:w-[300px]
                            px-2 py-1
                        "
                        onClick={toggleSelectionDropDown}
                    >

                        <div className="truncate text-[12px] md:text-[14px]">{currentSet?.title == null ? "Select A Set" : currentSet.title}</div>
                        <div className="flex items-center justify-center">
                            <ArrowDown className="h-[16px] w-[16px] lg:h-[20px] lg:w-[20px]"/>
                        </div>
                    </button>

                    {/* Drop Drown Content */} 
                    {selectionDropDown && (
                        <div className="absolute mt-1 flex flex-col gap-1 overflow-y-auto z-50 w-[calc(100vw-20px)] max-w-[400px] md:w-[300px] max-h-[300px] py-1 bg-[#202020] rounded-[5px] border-1 border-[#828282] ">
                            {/* TODO: Uncomment for prod */}
                            {/* {sets !== "No Sets" ? ( */}
                                <>
                                    {sets?.map((set, index:number) => (
                                        <div 
                                            key={index} 
                                            className="bg-[#202020] cursor-pointer flex rounded-[5px] py-[3px] md:pl-1 gap-x-1 mx-1 md:mr-2 hover-animation whitespace-nowrap "
                                            
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
                                                    <Check className="h-[16px] md:h-[20px] md:w-[20px] mx-1"/>
                                                )}
                                            </div>
                                            
                                            <div className="w-fit md:max-w-[250px] text-[12px] md:text-[14px] overflow-x-hidden truncate" title={set.title}>{set.title}</div>
                                        </div>
                                    ))}
                                </>
                            {/* TODO: Uncomment for prod */}
                            {/* ) : <span className="text-[14px] pl-2">No sets found</span>} */}
                        </div>
                    )}        
                </div>


                {/* Bulk Import */}
                <div className="hidden md:block">

                    <button
                        className="
                            flex cursor-pointer justify-between items-center whitespace-nowrap  bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200
                            text-[12px] md:text-[14px]
                            w-[110px] md:w-[130px] lg:w-[150px]
                            px-2 py-1 md:px-3
                        "
                        onClick={toggleImportUI}
                    >
                        <div className="flex items-center justify-center">
                            <Import className="h-[16px] w-[16px] lg:h-[20px] lg:w-[20px]"/>
                        </div>
                        <h1>Bulk Import</h1>
                    </button>
                </div>
                

                {/* New Set Button */}
                <div className="new-set-btn hidden md:block">
                    <button 
                        className="
                            flex cursor-pointer justify-between items-center whitespace-nowrap bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200
                            text-[12px] md:text-[14px] 
                            w-full md:w-[110px] lg:w-[130px] 
                            px-2 py-1 md:px-3
                        "
                        onClick={() => toggleNewSetUI(!newSetUI)}
                    >
                        <div className="flex items-center justify-center">
                            <PlusCircle className="h-[16px] w-[16px] lg:h-[20px] lg:w-[20px]"/>
                        </div>
                        New Set
                    </button>
                </div>

                <div className="md:hidden"
                    onClick={toggleActionDropDown}
                >
                    <button
                        className="
                            flex cursor-pointer justify-center items-center whitespace-nowrap bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200
                            gap-[5px] md:gap-[11px]
                            text-[12px] md:text-[14px]
                            w-full md:w-[110px] lg:w-[140px]
                            px-2 py-1 md:px-3
                        "
                    >   
                        <Menu className="h-[16px] w-[16px]"
                        />
                        Actions
                    </button>
                    
                    {mobileActionsDropDown && (
                        <div className="md:hidden absolute px-1 mt-1 flex flex-row gap-1 overflow-y-auto z-50 w-[calc(100vw-20px)] max-w-[400px] md:max-w-[1150px] md:w-[250px] max-h-[300px] py-1 bg-[#202020] rounded-[5px] border-1 border-[#828282] ">
                            {/* Bulk Import */}

                            <button
                                className="
                                    flex cursor-pointer justify-between items-center whitespace-nowrap  bg-[#1d1d1d] rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200
                                    gap-[5px]
                                    text-[12px]
                                    w-[120px]
                                    px-2 py-1
                                "
                                onClick={toggleImportUI}
                            >
                                <div className="flex items-center justify-center">
                                    <Import className="h-[16px] w-[16px]"/>
                                </div>
                                <h1>Bulk Import</h1>
                            </button>
                            

                            {/* New Set Button */}
                            <button 
                                className="
                                    flex cursor-pointer justify-between items-center whitespace-nowrap bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200
                                    text-[12px]
                                    w-full
                                    px-2 py-1
                                "
                                onClick={() => toggleNewSetUI(true)}
                            >
                                <div className="flex items-center justify-center">
                                    <PlusCircle className="h-[16px] w-[16px]"/>
                                </div>
                                New Set
                            </button>
                        </div>                      
                    )}

                </div>
            </div>
        </div>
        <div className="
            mt-3 relative bg-[#D9D9D9]/3 rounded-[10px] gap-2 w-[calc(100vw-20px)] flex
            flex-col-reverse md:flex-row md:justify-between
            max-w-[400px] md:max-w-[1150px]
            h-fit py-3 px-4
        ">
            <div className="flex flex-col justify-between h-full gap-3 md:gap-3">
                <div>
                    <h2 className="font-bold text-[14px] md:text-[18px] truncate">{currentSet?.title == null ? "No set selected..." : currentSet?.title}</h2>
                    <p className="text-[12px] md:text-[14px]">{currentSet?.title == "" ? '' : currentSet?.description}</p>
                </div>
                {currentSet?.description && (
                    <div>
                        <p className="text-[12px] md:text-[14px]">{currentSet?.card_cnt} Cards</p>
                    </div>
                )}
            </div>
        </div>
                
        <NewSetModal />

        <BulkImportModal currentSet={currentSet} importUI={importUI} toggleImportUI={toggleImportUI} />
        </>
    )
}