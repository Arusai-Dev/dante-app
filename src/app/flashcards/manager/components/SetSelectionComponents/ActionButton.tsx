import { Import, Menu, PlusCircle } from "lucide-react"


interface NewSetButtonProps {
    toggleNewSetUI: () => void
}

export function NewSetButton({toggleNewSetUI}: NewSetButtonProps) {

    return (
        <div className="new-set-btn hidden md:block">
            <button 
                className="
                    flex cursor-pointer justify-between items-center whitespace-nowrap bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200
                    text-[12px] md:text-[14px] 
                    w-full md:w-[110px] lg:w-[130px] 
                    px-2 py-1 md:px-3
                "
                onClick={toggleNewSetUI}
            >
                <div className="flex items-center justify-center">
                    <PlusCircle className="h-[16px] w-[16px] lg:h-[20px] lg:w-[20px]"/>
                </div>
                New Set
            </button>
        </div>
    )
}

interface BulkImportButtonProps {
    toggleImportUI: () => void
}

export function BulkImportButton({toggleImportUI}: BulkImportButtonProps) {

    return (

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
                
    )
}

interface MobileActionButtonsProps {
    toggleActionDropDown: () => void
    toggleNewSetUI: () => void
    toggleImportUI: () => void
}

export function MobileActionButtons({toggleActionDropDown, toggleNewSetUI, toggleImportUI}: MobileActionButtonsProps) {



    return (

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
            
            {toggleActionDropDown && (
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
                        onClick={toggleNewSetUI}
                    >
                        <div className="flex items-center justify-center">
                            <PlusCircle className="h-[16px] w-[16px]"/>
                        </div>
                        New Set
                    </button>
                </div>                      
            )}

        </div>
                
    )
}