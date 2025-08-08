import DanteSelect from "@/components/ui/DanteSelect";
import DanteToggle from "@/components/ui/DanteToggle";
import { Shield } from "lucide-react";
import { useState } from "react";


export default function Privacy() {

    const privacyOptions = ["Private", "Public", "Friends Only"] 
    const [privacy, setPrivacy] = useState<string>("Private")

    const [shareProgress, setShareProgress] = useState<boolean>(false)
    const [analytics, setAnalytics] = useState<boolean>(false)
    const [dataCollection, setDataCollection] = useState<boolean>(false)

    return (
        <section className=" md:min-w-[600px] flex flex-col gap-8 bg-[#D9D9D9]/3 border rounded-[4px] border-[#404040] h-fit p-5 ">
            <div className="flex flex-col">
                <div className="flex items-center gap-3">
                    <Shield className="h-6 w-6"/>
                    <span className="text-[24px] font-bold">Privacy & Security</span>
                </div>
                <span className="text-[14px] text-gray-400">Control your privacy and data sharing preferences</span>
            </div>

            <div className=" border border-[#404040]"></div>

            {/* <DanteSelect // TODO: Zustand for setting states
                variant={selectedTheme}
                value={selectedFontSize}
                options={fontSizeOptions}
                onChange={(value) => setSelectedFontSize(value)}
                label="Font Size"
            /> */}

            <DanteSelect
                variant="dark"
                value={privacy}
                options={privacyOptions}
                label="Profile Visibility"
                onChange={(value) => setPrivacy(value)}
            />

            <DanteToggle
                title="High Contrast"
                description="Increase contrast for better accessibility"
                value={shareProgress}
                onChange={(value) => setShareProgress(value)}
            />

            <DanteToggle
                title="Analytics"
                description="Help improve the app with anonymous usage data"
                value={analytics}
                onChange={(value) => setAnalytics(value)}
            />

            <DanteToggle
                title="Data Collection"
                description="Allow collection of usage data for personalization"
                value={dataCollection}
                onChange={(value) => setDataCollection(value)}
            />

        </section>
    )
}