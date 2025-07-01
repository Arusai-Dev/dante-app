'use client'

import { useEffect, useState } from "react";
import { ArrowDown, Check, PlusCircle, Eye, EyeOff, Import, FileTextIcon } from "lucide-react";
import { createNewSet, getSetByTitle, updateCardCount } from "@/lib/dbFunctions";
import { useCreateStore } from "@/app/stores/createStores";
import { toast } from "sonner";

export default function SetSelectionComp() {

    // zustand
    const { 
        sets,
        currentSet,
        setCurrentSet,
    } = useCreateStore()
    const [newSetUI, setNewSetUI] = useState(false);
    const [importUI, setImportUI] = useState(false);
    const [dropDownIsOpen, setDropDownIsOpen] = useState(false);
    const [selectedDelimiterText, setSelectedDelimiterText] = useState("Pipe (|)");
    const [selectedDelimiter, setSelectedDelimiter] = useState("|");
    const [delimiterDropDown, setDelimiterDropDown] = useState(false);

    const delimiters = ["Pipe (|)", "Comma (,)", "Semicolon (;)", "Tab"]


    const toggleDropDown = () => {
        setDropDownIsOpen(!dropDownIsOpen);
    }

    const toggleNewSetUI = () => {
        setNewSetUI(!newSetUI);
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
    const tags = []
    const category = ""
    const study_count = 0
    const rating = 0
    const review_count = 0

    const onNewSetSubmit = async () => {
        await createNewSet(
            newSetTitle, 
            newSetDescription, 
            isPrivate, 
            date_created, 
            number_cards, 
            newSetUserId, 
            cards,
            tags,
            category,
            study_count,
            rating,
            review_count
        );
        console.log(date_created)
        const result = await getSetByTitle(newSetUserId, newSetTitle)
        setCurrentSet(result?.[0])
        toggleNewSetUI();
        clearNewSetForm();
    }

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

    }


    return (
        <>
        {/* Set Selection / Description */}
        <div className="mt-10 flex flex-col-reverse relative md:flex-row w-[calc(100vw-20px)] max-w-[400px] md:max-w-[1150px] md:justify-between h-[100px] md:h-[150px] bg-[#D9D9D9]/3 py-2 px-2 md:px-3 rounded-[10px] gap-2">
            <div className="flex flex-col justify-between h-full">
                <div>
                    <h2 className="font-bold text-[14px] pb-1 md:text-xl lg:text-2xl truncate">{currentSet.title == null ? "No set selected..." : currentSet.title}</h2>
                    <p className="text-[12px] md:text-lg lg:text-xl truncate">{currentSet.title == "" ? '' : currentSet.description}</p>
                </div>
                {currentSet.description && (
                    <div>
                        <p className="text-[12px] md:text-xl">{currentSet.card_cnt} Cards</p>
                    </div>
                )}
            </div>

            {/* Select Set Drop Down / New Set Button */} 
            {/* mobile/desktop tailwind */}￼

            <div className="
                absolute md:static 
                left-1/2 md:left-auto 
                top-[-35px] md:top-auto 
                -translate-x-1/2 md:translate-x-0
                w-[calc(100vw-20px)] md:w-fit 
                max-w-[400px] md:max-w-[1150px] 
                justify-center md:justify-between
                md:flex md:flex-col md:items-end
            ">
                <div className="flex gap-[5px] md:gap-[11px]">
                    {/* Select Set Drop Down */}
                    <div className="select-set-dd basis-[70%] max-w-[68%] grow">
                        <button 
                            className="flex justify-between cursor-pointer items-center w-full gap-[3px] md:gap-2 h-[25px] lg:w-[230px] md:w-[150px] lg:h-[40px] whitespace-nowrap sm:pr-[2px] py-1 pl-[8px] pr-[4px] md:px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover-animation"
                            onClick={toggleDropDown}
                            >

                            <div className="truncate font-semibold text-[12px] lg:text-[18px] md:text-[14px]">{currentSet.title == null ? "Select A Set" : currentSet.title}</div>
                            <div className="flex items-center justify-center">
                                <ArrowDown className="h-[16px] w-[16px] lg:h-[20px] lg:w-[20px]"/>
                            </div>
                        </button>

                        {/* Drop Drown Content */} 
                        {dropDownIsOpen && (
                            <div className="absolute mt-1 flex flex-col gap-1 overflow-y-auto z-50 w-[calc(100vw-20px)] max-w-[400px] md:max-w-[1150px] md:w-[250px] max-h-[300px] py-1 bg-[#202020] rounded-[5px] border-1 border-[#828282] ">
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
                                        
                                        <div className="w-fit md:max-w-[250px] text-[12px] md:text-lg overflow-x-hidden truncate" title={set.title}>{set.title}</div>
                                    </div>
                                ))}
                            </div>
                        )}        
                    </div>
                    

                    {/* New Set Button */}
                    <div className="new-set-btn basis-[30%]">
                        <button 
                            className="flex cursor-pointer justify-between items-center font-semibold text-[12px] md:text-[14px] lg:text-[18px] w-full md:w-[110px] lg:w-[130px] h-[25px] lg:h-[40px] md:text-lg whitespace-nowrap py-1 pb-[5px] lg:pr-[8px] lg:pl-[8px] pr-[7px] pl-[5px] sm:pr-[8px] bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200"
                            onClick={toggleNewSetUI}
                        >
                            <div className="flex items-center justify-center">
                                <PlusCircle className="h-[16px] w-[16px] lg:h-[20px] lg:w-[20px]"/>
                            </div>
                            New Set
                        </button>
                    </div>
                </div>
                <div>        
                    <div className="">
                        <button 
                            className="flex cursor-pointer justify-between items-center font-semibold text-[12px] md:text-[14px] lg:text-[18px] w-full md:w-[110px] lg:w-[130px] h-[25px] lg:h-[40px] md:text-lg whitespace-nowrap py-1 pb-[5px] lg:pr-[8px] lg:pl-[8px] pr-[7px] pl-[5px] sm:pr-[8px] bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200"
                            onClick={toggleImportUI}
                        >
                            <div className="flex items-center justify-center">
                                <Import className="h-[16px] w-[16px] lg:h-[20px] lg:w-[20px]"/>
                            </div>
                            Bulk Import
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        {/* TODO: The design for this component needs to be re-done... */}
        {newSetUI && (
            <>
            <div className="fixed inset-0 bg-black/3 backdrop-blur-sm z-30" onClick={toggleNewSetUI}></div>

            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                <div className="new-set-btn-pop-up z-50 flex flex-col gap-8 rounded-sm md:rounded-md w-[calc(100vw-10%)] md:w-[555px] h-[calc(100vh-20%)] md:h-fit bg-[#1e1e1e] transition-all duration-[0.2s]">
                    <div className="px-7 pt-6 flex flex-col gap-4 md:gap-8">
                        <div>
                            <h1 className="text-lg lg:text-2xl font-bold">Create New Set</h1>
                            <p className="text-[#8c8c8c] text-md lg:text-xl">Create a new set to organize your flashcards.</p>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h2 className="text-sm lg:text-2xl">Set Title</h2>
                            <input 
                                className="px-2 py-1 border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                                onChange={(e) => setNewSetTitle(e.target.value)}
                            ></input>
                        </div>

                        <div>
                            <h2 className="pb-2 text-sm lg:text-2xl">Set Description (optional)</h2>
                            <textarea 
                                className="set-desc-text-area px-2 py-1 w-full resize-y h-[150px] border-[1px] border-[#8c8c8c] rounded-[5px] hover-animation"
                                value={newSetDescription}
                                onChange={(e) => {
                                    setNewSetDescription(e.target.value)
                                }}
                            ></textarea>
                        </div>
                    </div>

                    
                    <div className="flex gap-3 justify-between w-full px-5 items-center pb-6">
                        <div className="flex items-center">
                            <h1 className="font-semibold pr-2 text-sm lg:text-xl">Visibility:</h1>
                            <button 
                                className="flex justify-center cursor-pointer items-center w-[50] md:w-[50px] h-[35px] md:h-[40px] py-1 bg-[#D9D9D9] text-[#141414] font-bold rounded-[5px] border-1 border-[#828282] hover-animation-secondary"
                                onClick={() => {setIsPrivate(!isPrivate); toast(`Set is now ${isPrivate ? "private" : "public"}`)}}
                            >
                                {isPrivate ? 
                                    <div className="flex items-center justify-center">
                                        <Eye className="h-[16px] w-[16px] md:h-[20px] md:w-[20px]"/>
                                    </div> 
                                    : 
                                    <div className="flex items-center justify-center">
                                        <EyeOff className="h-[16px] w-[16px] md:h-[20px] md:w-[20px]"/>
                                    </div>
                                }
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <button 
                                className="flex justify-center cursor-pointer items-center w-[95px] md:w-[125px] h-[35px] md:h-[40px] py-1 bg-[#D9D9D9]/3 font-bold rounded-[5px] border-1 border-[#828282] hover-animation"
                                onClick={() => {
                                    toggleNewSetUI();
                                    clearNewSetForm();
                                }}
                            >Cancel</button>

                            <button 
                                className="flex justify-center cursor-pointer items-center w-[95px] md:w-[125px] h-[35px] md:h-[40px] py-1 bg-[#D9D9D9] text-[#141414] font-bold rounded-[5px] border-1 border-[#828282] hover-animation-secondary"
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

        {importUI && (
            <>
            <div className="fixed inset-0 bg-black/3 backdrop-blur-sm z-30" onClick={toggleImportUI}></div>

            <div className="
                fixed 
                right-[5px]
                left-[5px] md:left-1/2
                top-[55px] md:top-1/2
                translate-x-0 md:-translate-x-1/2
                translate-y-0 md:-translate-y-1/2
                md:transform 
                overflow-y-scroll
                z-40
            "
            >
                <div className="max-w-[875px] bg-[#1e1e1e] p-2 md:p-7 flex flex-col gap-4 md:gap-5 rounded-[5px] md:rounded-[10px] border-2 border-[#cfcfcf]">
                    <div>
                        <h1 className="font-bold text-[14px] md:text-[20px]">Bulk Import Cards</h1>
                        <h3 className="text-[11px] md:text-[16px]">
                            Import multiple flashcards at once. 
                            Each line should contain front, back, 
                            and optionally category separated by 
                            your chosen delimiter.
                        </h3>
                    </div>

                    <div>
                        <h2 className="pb-1 text-[11px] md:text-[16px] md:text-md font-semibold">Delimiter</h2>
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

                    <div>
                        <h2 className="pb-1 text-[11px] md:text-[16px] font-semibold">Card Data</h2>

                        <textarea className="text-[11px] md:text-[16px] mb-3 px-2 py-1 w-full resize-y h-[155px] border-[1px] border-[#8c8c8c] rounded-[5px] transition-colors duration-200 hover:bg-[#323232]"
                            placeholder={
                                `Enter your cards, one per line. Format:\nFront${selectedDelimiter}Back${selectedDelimiter}Category\n\nExample:\nWhat is 2+2?${selectedDelimiter}4${selectedDelimiter}Math\nCapital of France${selectedDelimiter}Paris${selectedDelimiter}Geography`
                            }
                        ></textarea>
                    </div>

                    <div className="bg-[#D9D9D9]/3 p-3 rounded-[10px]">
                        <div className="flex gap-2">
                            <FileTextIcon className="w-[18px]"/>
                            <p className="font-semibold text-[14px]">Format Guidelines:</p>
                        </div>
                        <ul className="list-disc pl-7 list-inside space-y-[2px] text-sm">
                            <li>One card per line</li>
                            <li>Use your chosen delimiter to separate front, back, and category</li>
                            <li>Category is optional</li>
                            <li>Empty lines will be ignored</li>
                        </ul>
                    </div>
                </div>
            </div>
            </>
        )}
        </>
    )
}