'use client'

import { useState } from "react";
import { useManagerPersistentStore } from "@/app/stores/managerStores";
import SetSelector from "./SetSelector";
// import SetDescription from "./SetDescription";
import BulkImportModal from "./BulkImportModal";
import SetDescription from "./SetDescription";
import NewSetModal from "@/components/modals/NewSetModal";

export default function SetSelectionComponent() {
    const {sets, currentSet, setCurrentSet} = useManagerPersistentStore();
    
    const [importUI, setImportUI] = useState(false);


    console.log(currentSet)
    return (
        <>
            <div className="w-[calc(100vw-20px)] max-w-[400px] md:max-w-[1150px]">
                <div className="justify-start mb:my-5 flex flex-col md:flex-row gap-[5px] md:gap-[11px]">
                    <SetSelector 
                        sets={sets}
                        currentSet={currentSet}
                        setCurrentSet={setCurrentSet}
                    />
                    

                </div>
            </div>

            <SetDescription currentSet={currentSet} />
            
            <NewSetModal />
            
            <BulkImportModal
                currentSet={currentSet}
                importUI={importUI}
                toggleImportUI={() => setImportUI(!importUI)}
            />
        </>
    );
}
