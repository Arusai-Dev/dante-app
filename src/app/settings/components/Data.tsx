import DanteButton from "@/components/ui/DanteButton";
import DanteSelect from "@/components/ui/DanteSelect";
import DanteToggle from "@/components/ui/DanteToggle";
import { Database } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export default function Data() {

    const [autoDataBackUp, setAutoDataBackUp] = useState<boolean>(true)
    const [backUpFrequency, setBackUpFrequency] = useState<string>("Weekly")
    const [exportFormat, setExportFormat] = useState<string>("JSON")
    const [storageLocation, setStorageLocation] = useState<string>("Local")
    

    const backUpFrequencyOptions = ["Daily", "Weekly", "Monthly"]
    const exportFormatOptions = ["JSON", "CSV", "PDF"]
    const storageLocationOptions = ["Local", "Cloud"]
    
    const exportAllData = () => {
        // TODO: Add feature
    }

    const importData = () => {
        // TODO: Add feature
    }

    return (

        <section className=" md:min-w-[600px] flex flex-col gap-8 bg-[#D9D9D9]/3 border rounded-[4px] border-[#404040] h-fit p-5 ">
            <div className="flex flex-col">
                <div className="flex items-center gap-3">
                    <Database className="h-6 w-6"/>
                    <span className="text-[24px] font-bold">Dante Management</span>
                </div>
                <span className="text-[14px] text-gray-400">Manage your data backup, export, and storage preferences</span>
            </div>

            <div className=" border border-[#404040]"></div>
        
            <DanteToggle
                title="Auto Backup"
                description="Automatically backup your flashcards"
                value={autoDataBackUp}
                variant="dark"
                onChange={(value) => setAutoDataBackUp(value)}
            />

            <DanteSelect
                label="Backup Frequency" 
                options={backUpFrequencyOptions}
                onChange={(backUpFrequency) => setBackUpFrequency(backUpFrequency)}
                value={backUpFrequency}
                variant="dark"
            />

            <DanteSelect
                label="Export Format" 
                options={exportFormatOptions}
                onChange={(exportFormat) => setExportFormat(exportFormat)}
                value={exportFormat}
                variant="dark"
            />

            <DanteSelect
                label="Storage Location" 
                options={storageLocationOptions}
                onChange={(storageLocation) => setStorageLocation(storageLocation)}
                value={storageLocation}
                variant="dark"
            />

            <div className=" border border-[#404040]"></div>

            <div className="flex flex-col gap-2">
                <label>Data Actions</label>
                <div className="flex gap-2">
                    <DanteButton
                        label="Export All Data"
                        variant="dark"
                        onClick={() => toast("Feature not available")}
                    />

                    <DanteButton
                        label="Import Data"
                        variant="dark"
                        onClick={() => toast("Feature not available")}
                    />
                </div>

            </div>



        </section>
    )
}