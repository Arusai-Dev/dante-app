'use client'

import { useState } from "react"; 
import Display from "./components/Display";
import Alerts from "./components/Alerts";
// import Profile from "./components/Profile"; // TODO: custom page to replace userProfile for Clerk


export default function Settings() {
    // const categories = ["Profile", "Display", "Alerts", "Privacy", "Data"]
    const categories = ["Display", "Alerts", "Privacy", "Data"]
    const [selectedCategory, setSelectedCategory] = useState<string>("Display")

    return (
        <div className="pt-16 w-screen">

            {/* Title */}
            <div className="border-b border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-8 py-6 md:py-8">
                    <div className="space-y-1 md:space-y-2">
                        <h1 className="text-[25px] md:text-[30px] font-bold leading-tight">Settings</h1>
                        <p className="text-base sm:text-xl md:text-lg text-neutral-400 leading-relaxed">
                            Manage your account, preferences, and application settings
                        </p>
                    </div>
                </div>
            </div>



            <div className="sm:mx-0 lg:mx-40 mt-8 md:mt-10 flex flex-col md:gap-6 justify-center md:justify-start w-fit">
                {/* Navigation */}
                <div className="grid w-fit gap-3 grid-cols-2 md:grid-cols-4 h-auto p-2 bg-[#D9D9D9]/3 rounded-[5px]">
                    {categories.map((category, index) => (
                        <div
                            key={index}
                            className={`bg-[#D9D9D9]/3 px-10 font-semibold py-2 cursor-pointer hover-animation text-center rounded-[5px] text-white data-[state=active]:text-neutral-900 text-xs sm:text-sm ${selectedCategory == category ? `bg-white/30` : 'bg-[#D9D9D9]/3'}`}
                            onClick={() => setSelectedCategory(category)}   
                        >   
                            {category}
                        </div>
                    ))}
                </div>



                {/* Sub Pages */}
                <div className="w-fit">

                    {/* TODO: custom page to replace userProfile for Clerk */}
                    {/* {(selectedCategory == "Profile") && (
                        <Profile />
                    )} */}



                    {(selectedCategory == "Display") && (
                        <Display/>
                    )}
    


                    {(selectedCategory == "Alerts") && (
                        <Alerts/>
                    )}
    


                    {(selectedCategory == "Privacy") && (
                        <div>
                            
                        </div>
                    )}
    


                    {(selectedCategory == "Data") && (
                        <div>
                            
                        </div>
                    )}
    
    
                </div>
            </div>



        </div>
    )
}