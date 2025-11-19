import { updateCardCount } from "@/lib/dbFunctions"
import { ArrowDown, Check } from "lucide-react"
import { BulkImportButton, MobileActionButtons, NewSetButton } from "./ActionButton"
import { setProp, useManagerNonPersistentStore } from "@/app/stores/managerStores";
import { useState } from "react";

interface SetSelectorProps {
    sets: setProp[];
    currentSet: setProp;
    setCurrentSet: (set: setProp) => void;
}

export default function SetSelector({sets, currentSet, setCurrentSet}: SetSelectorProps) {

    const {newSetUI, toggleNewSetUI} = useManagerNonPersistentStore();    
    const [importUI, setImportUI] = useState(false);
    const [mobileActionsDropDown, setMobileActionsDropDown] = useState(false);
    const [selectionDropDown, toggleSelectionDropDown] = useState(false);

    return (

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
                        onClick={() => toggleSelectionDropDown(!selectionDropDown)}
                    >

                        <div className="truncate text-[12px] md:text-[14px]">{currentSet.title == null ? "Select A Set" : currentSet.title}</div>
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
                                            
                                            onClick={async () => {
                                                setCurrentSet(set)
                                                await updateCardCount(set.id, set.card_cnt)
                                                toggleSelectionDropDown(false)
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

                <BulkImportButton 
                    toggleImportUI={() => setImportUI(!importUI)}
                />

                <NewSetButton
                    toggleNewSetUI={() => toggleNewSetUI(!newSetUI)}
                />

                <MobileActionButtons
                    toggleImportUI={() => setImportUI(!importUI)}
                    toggleNewSetUI={() => toggleNewSetUI(!newSetUI)}
                    toggleActionDropDown={() => setMobileActionsDropDown(!mobileActionsDropDown)}
                />
            </div>

            
        </div>
    )
}
