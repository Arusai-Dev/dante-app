'use client'

import Image from "next/image"
import { useEffect, useState } from "react"

export default function Create() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropDown = () => {
        setIsOpen(!isOpen);
    }

    const closeDropDown = (e: MouseEvent) => {

        const target = e.target as HTMLElement; 

        if (!target.closest(".select-set-dd")) {
            setIsOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener('click', closeDropDown);

        return () => {
            document.removeEventListener('click', closeDropDown);
        };
    }, []);

    const [selectedIndex, setSelectedIndex] = useState(null);
    const sets = [
        'Set 1',
        'Set 2',
        'Set 3',
        'Set 4',
        'Set 5',
        'Set 6',
        'Set 7',
        'Set 8',
        'Set 9',
    ];

    const handleSelect = (index) => {
        setSelectedIndex(index);
      };

    return (

        <section className="flex flex-col items-center pt-[65px] font-(family-name:inter)">

            {/* Title */}
            <div className="flex flex-col items-center pt-[30px] pb-9">
                <h1 className=" text-4xl font-bold ">Set Creator</h1>
                <p className=" text-[22px] pt-2">Create, organize, and manage your sets!</p>   
            </div>        


            {/* Set Selection / Description */}
            <div className="flex justify-between h-[150px] w-[1150px] bg-[#D9D9D9]/3 py-3 px-4 rounded-[5px]">
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <h2 className="font-bold text-2xl">{sets[selectedIndex]}</h2>
                        <p>{`My Set Description`}</p>
                    </div>

                    <div>
                        <p>{`0`} Cards</p>
                    </div>
                </div>

                <div className="flex gap-[11px]">
                    <div className="select-set-dd">
                        <button 
                            className="flex justify-between items-center w-[200px] h-[40px] py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282]"
                            onClick={toggleDropDown}
                            >

                            {`My Set Name`} 
                            <Image 
                                src="/icons/arrow.svg"
                                alt="arrow icon"
                                width={24}
                                height={24}  
                            />

                        </button>

                        {isOpen && (
                            <div className="absolute mt-1 flex flex-col gap-2 overflow-y-auto w-[200px] max-h-[300px] py-2 bg-[#202020] rounded-[5px] border-1 border-[#828282] hidden-scrollbar">
                                {sets.map((set, index) => (
                                    <div 
                                        key={index} 
                                        className="bg-[#202020] hover:bg-[#323232] flex rounded-[5px] py-[3px] pl-2 gap-x-4 mx-2"
                                        onClick={() => handleSelect(index)}
                                        >
                                        {selectedIndex == index && (
                                            <Image src="/icons/checkmark.svg" alt="checkmark icon" width={24} height={24}/>
                                        )}
                                        {set}
                                    </div>
                                ))}
                            </div>
                        )}        

                    </div>

                    <div className="new-set-btn">
                        <button className="flex justify-between items-center w-[125px] h-[40px] py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] ">
                            <Image
                                src="/icons/add.svg"
                                alt="add icon"
                                width={20}
                                height={20}
                            />
                            {`New Set`}
                        </button>
                    </div>
                </div>
            </div>



            {/* Nav -> Create Card / Manage Cards */}




            {/* Create Flashcard / Preview Section */}




        </section>
        
    )  
}