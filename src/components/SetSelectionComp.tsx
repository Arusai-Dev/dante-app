'use client'

import { useEffect, useState } from "react";
import { ArrowDown, Check, PlusCircle, Import, FileTextIcon, Trash2, Menu } from "lucide-react";
import { addMultipleCardsToSet, updateCardCount } from "@/lib/dbFunctions";
import { generateUniqueCardId } from "@/lib/card/card";
import LineNumberedTextarea from "./TextAreaLineNumbers";
import { updateCurrentSet } from "@/app/hooks/managerHooks/useSetHandlers";
import NewSetModal from "./modals/NewSetModal";
import { useManagerNonPersistentStore, useManagerPersistentStore } from "@/app/stores/managerStores";

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
        <div className="w-[calc(100vw-20px)] max-w-[400px] md:max-w-[1150px]">
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

                        <div className="truncate text-[12px] md:text-[14px]">{currentSet.title == null ? "Select A Set" : currentSet.title}</div>
                        <div className="flex items-center justify-center">
                            <ArrowDown className="h-[16px] w-[16px] lg:h-[20px] lg:w-[20px]"/>
                        </div>
                    </button>

                    {/* Drop Drown Content */} 
                    {selectionDropDown && (
                        <div className="absolute mt-1 flex flex-col gap-1 overflow-y-auto z-50 w-[calc(100vw-20px)] max-w-[400px] md:w-[300px] max-h-[300px] py-1 bg-[#202020] rounded-[5px] border-1 border-[#828282] ">
                            {sets.map((set, index:number) => (
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
                    <h2 className="font-bold text-[14px] md:text-[18px] truncate">{currentSet.title == null ? "No set selected..." : currentSet.title}</h2>
                    <p className="text-[12px] md:text-[14px]">{currentSet.title == "" ? '' : currentSet.description}</p>
                </div>
                {currentSet.description && (
                    <div>
                        <p className="text-[12px] md:text-[14px]">{currentSet.card_cnt} Cards</p>
                    </div>
                )}
            </div>
        </div>
                
        <NewSetModal />

        {importUI && (
            <>
            <div className="fixed inset-0 bg-black/3 backdrop-blur-sm z-30" onClick={toggleImportUI}></div>

            <div className="fixed z-40">
                <div 
                    className="
                        max-w-[875px] flex flex-col lg:border-1 lg:border-[#cfcfcf] bg-[#1e1e1e] 
                        lg:mt-5
                        p-4 lg:p-7 
                        gap-4 lg:gap-5 
                        h-[calc(100vh-40px)] md:h-[calc(100vh-80px)]
                        hidden-scrollbar
                        "
                    >
                    {/* Header */}
                    <div>
                        <h1 className="font-bold text-[14px] md:text-[20px]">Bulk Import Cards</h1>
                        <h3 className="text-[11px] md:text-[16px]">
                            Import multiple flashcards at once. 
                            Each line should contain front, back, 
                            and optionally category separated by 
                            your chosen delimiter.
                        </h3>
                    </div>
                    {/* Delimiter selection */}
                    <div>
                        <h2 className="pb-1 text-[13px] md:text-[16px] font-semibold">Delimiter</h2>
                        <button 
                            className="flex justify-between cursor-pointer items-center w-full gap-[3px] md:gap-2 h-[25px] lg:w-[230px] md:w-[150px] lg:h-[40px] whitespace-nowrap sm:pr-[2px] py-1 pl-[8px] pr-[4px] md:px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover-animation"
                            onClick={() => setDelimiterDropDown(!delimiterDropDown)}
                            >

                            <div className="truncate text-[10px] md:text-[16px]">{selectedDelimiterText}</div>
                            <div className="flex items-center justify-center">
                                <ArrowDown className="h-[16px] w-[16px] lg:h-[20px] lg:w-[20px]"/>
                            </div>
                        </button>

                        {delimiterDropDown && (
                            <div className="absolute mt-1 flex flex-col gap-1 py-2 overflow-y-auto z-50 w-[calc(100vw-30px)] max-w-[400px] md:max-w-[1150px] md:w-[250px] max-h-[300px] bg-[#202020] rounded-[5px] border-1 border-[#828282] ">
                                {delimiters.map((delimiter, index:number) => (
                                    <div
                                        key={index}
                                        onClick={handleDelimiterSelection}
                                        data-delimiter={delimiter}
                                        className="bg-[#202020] text-[10px] md:text-sm cursor-pointer flex rounded-[5px] py-[3px] md:pl-1 gap-x-1 mx-1 md:mr-2 hover-animation whitespace-nowrap "
                                    >
                                        <div className="flex items-center justify-center">
                                            {selectedDelimiterText == delimiter && (
                                                <Check className="h-[14px] md:h-[20px] md:w-[20px] mx-[2px] md:mx-1"/>
                                            )}
                                        </div>
                                        {delimiter}
                                    </div>
                                ))}
                            </div>
                        )}  
                    </div>
                    {/* Card data text area */}
                    <div>
                        <h2 className="pb-1 text-[13px] md:text-[16px] font-semibold">Card Data</h2>
                        <LineNumberedTextarea
                            onChange={handleImportDataChange}
                            placeholder={
                                `Enter your cards, one per line. Format:\nFront${selectedDelimiter}Back${selectedDelimiter}Category\n\nExample:\nWhat is 2+2?${selectedDelimiter}4${selectedDelimiter}Math\nCapital of France${selectedDelimiter}Paris${selectedDelimiter}Geography`
                            }
                        />
                    </div>
                    {/* Guidelines for importing data */}
                    <div className="bg-[#D9D9D9]/3 p-3 rounded-[10px]">
                        <div className="flex gap-2">
                            <FileTextIcon className="w-[18px]"/>
                            <p className="font-semibold text-[13px] md:text-[16px] pt-1">Format Guidelines:</p>
                        </div>
                        <ul className="list-disc pl-10 space-y-[2px] text-sm list-outside text-[11px] md:text-[16px]">
                            <li>One card per line</li>
                            <li>Use your chosen delimiter to separate front, back, and category</li>
                            <li>Category is optional</li>
                            <li>Empty lines will be ignored</li>
                        </ul>
                    </div>
                    {/* Display imported cards */}    
                    <div className=" font-semibold">   
                        <h1 className="text-[13px] md:text-[16px]">Card Data:</h1>
                        <div className="overflow-y-auto p-3 border-1 border-[#8f8f8f] rounded md:rounded-[5px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5 py-2 h-fit">  
                            {importedCardData ? 
                                importedCardData.map((card, key) => (
                                    <div
                                        key={key}
                                        className="w-full h-fit bg-[#D9D9D9]/3 rounded md:rounded-[5px] flex flex-col"
                                    >   
                                        <div className="flex justify-between pt-2 px-2">
                                            <div className="flex gap-2">
                                                <h1 className="text-[8px] md:text-[12px] bg-amber-50 text-[#141414] px-3 py-[2px] font-semibold rounded-2xl ">
                                                    {key + 1}
                                                </h1>
                                                <h1 className="text-[8px] md:text-[12px] bg-amber-50 text-[#141414] px-3 py-[2px] font-semibold rounded-2xl ">
                                                    {card?.category == "Category" ? "N/A": card?.category}
                                                </h1>
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                <div className="flex items-center justify-center ">
                                                    <Trash2 
                                                        className="h-[16px] md:h-[20px] md:w-[20px] hover:text-purple-400 transition-colors duration-200"
                                                        onClick={() => {
                                                            console.log("Deleted Card")
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-full flex pt-[20px] md:pt-[20px] px-2">
                                            <h1 className="text-[13px] md:text-[16px]">{card?.front}</h1>
                                        </div>
                                        <div className="w-full py-1 flex text-left bg-[#dddddd] rounded-b-[5px] px-2">
                                            <h1 className="text-[12px] md:text-[16px] text-[#272727] ">{card?.back}</h1>
                                        </div>
                                    </div>
                                ))
                                : 
                                tempCardData.map((card, key) => (
                                   <div
                                        key={key}
                                        className="w-full h-fit bg-[#D9D9D9]/3 rounded md:rounded-[5px] flex flex-col pb-3"
                                    >   
                                        <div className="flex justify-between pt-2 px-2">
                                            <div className="flex gap-2">
                                                <h1 className="text-[8px] md:text-[12px] bg-amber-50 text-[#141414] px-3 py-[2px] font-semibold rounded-2xl ">
                                                    {key + 1}
                                                </h1>
                                                <h1 className="text-[8px] md:text-[12px] bg-amber-50 text-[#141414] px-3 py-[2px] font-semibold rounded-2xl ">
                                                    {card?.category == "Category" ? "N/A": card?.category}
                                                </h1>
                                            </div>
                                            <div className="flex gap-1 items-center">
                                                <div className="flex items-center justify-center ">
                                                    <Trash2 
                                                        className="h-[16px] md:h-[20px] md:w-[20px] hover:text-purple-400 transition-colors duration-200"
                                                        onClick={() => {
                                                            console.log("Deleted Card")
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="h-full flex pt-[20px] md:pt-[20px] px-2">
                                            <h1 className="text-[13px] md:text-[16px]">{card?.front}</h1>
                                        </div>
                                        <div className="w-full py-1 flex text-left bg-[#dddddd] rounded-b-[5px] px-2">
                                            <h1 className="text-[12px] md:text-[16px] text-[#272727] ">{card?.back}</h1>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                    {/* Import Cards Button */}
                    <div className="w-full flex gap-2">
                        <button 
                            className="flex gap-2 justify-center cursor-pointer bg-[#D9D9D9] text-[#0F0F0F] items-center grow-[356] h-[33px] md:h-[45px] py-1 px-3 font-bold text-[14px] md:text-xl rounded-[5px] hover-animation-secondary"
                            onClick={handleBulkImport}
                            >
                            {"Import Cards"}
                        </button>
                        <button 
                            className="flex gap-2 justify-center cursor-pointer bg-[#252525] text-[#d3d3d3] items-center grow-[356] h-[33px] md:h-[45px] py-1 px-3 font-bold text-[14px] md:text-xl rounded-[5px] hover-animation-secondary"
                            onClick={() => setImportUI(!importUI)}
                            >
                            {"Cancel"}
                        </button>
                    </div>
                </div>
            </div>
            </>
        )}
        </>
    )
}