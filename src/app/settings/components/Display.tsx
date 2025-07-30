import DanteButton from "@/components/ui/DanteButton";
import DanteSelect, { type DanteSelectProps } from "@/components/ui/DanteSelect";
import { Monitor, Moon, Palette, Sun } from "lucide-react";
import { useState } from "react";
import { Toaster } from "sonner";


export default function Display() {
    const themeOptions = ["dark", "light", "system"]
    const [selectedTheme, setSelectedTheme] = useState<string>("dark")

    const fontSizeOptions = ["small", "medium", "large"]
    const [selectedFontSize, setSelectedFontSize] = useState<string>("medium")

    const [compact, setCompact] = useState<boolean>(false)
    const [animations, setAnimations] = useState<boolean>(false)
    const [highContrast, setHighContrast] = useState<boolean>(false)
    
    return (
        <section className=" md:min-w-[600px] flex flex-col gap-6 mb-20">
            <Toaster/>
            
            <div className="flex flex-col gap-8 bg-[#D9D9D9]/3 border rounded-[4px] border-[#404040] h-fit p-5 ">

                <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                        <Palette className="h-6 w-6"/>
                        <span className="text-[24px] font-bold">Display Preferences</span>
                    </div>
                    <span className="text-[14px] text-gray-400">Customize how the app looks and feels</span>
                </div>

                <div className="flex flex-col">
                    <span className="text-[14px] font-semibold">Theme</span>

                    <div className="flex gap-2 mt-2">
                        {themeOptions.map((theme, index) => (
                            <DanteButton 
                                className={`${theme === selectedTheme ? `bg-white text-gray-800 hover-animation-light` : ``}`}
                                label={theme}
                                key={index}
                                variant="dark"
                                icon={
                                    theme === 'dark' ? <Moon className="h-4 w-4"/> :
                                    theme === 'light' ? <Sun className="h-4 w-4"/> :
                                    theme === 'system' ? <Monitor className="h-4 w-4"/> :
                                    undefined
                                }
                                onClick={() => setSelectedTheme(theme)}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <DanteSelect
                        variant={selectedTheme}
                        value={selectedFontSize}
                        options={fontSizeOptions}
                        onChange={(value) => setSelectedFontSize(value)}
                        label="Font Size"
                    />
                </div>

                <div className="flex justify-between">
                    <div>
                        <label className="block text-sm font-medium mb-1">Compact Mode</label>
                        <label className="block text-[12px] text-[#838383]">Reduce spacing and padding for more content</label>
                    </div>

                    <DanteButton 
                        label={`${compact ? 'On' : 'Off'}`}
                        variant={`${compact ? 'light' : 'dark'}`}
                        onClick={() => setCompact(!compact)}
                    />
                </div>

                <div className="flex justify-between">
                    <div>
                        <label className="block text-sm font-medium mb-1">Animations</label>
                        <label className="block text-[12px] text-[#838383]">Enable smooth transitions and animations</label>
                    </div>

                    <DanteButton 
                        label={`${animations ? 'On' : 'Off'}`}
                        variant={`${animations ? 'light' : 'dark'}`}
                        onClick={() => setAnimations(!animations)}
                    />
                </div>

                <div className="flex justify-between">
                    <div>
                        <label className="block text-sm font-medium mb-1">High Contrast</label>
                        <label className="block text-[12px] text-[#838383]">Increase contrast for better accessibility</label>
                    </div>

                    <DanteButton 
                        label={`${highContrast ? 'On' : 'Off'}`}
                        variant={`${highContrast ? 'light' : 'dark'}`}
                        onClick={() => setHighContrast(!highContrast)}
                    />
                </div>

                    
            </div>
        </section>
    )
}