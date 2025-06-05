/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers2, Globe, LockKeyhole, BookOpenIcon } from "lucide-react"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyFlashcards() {

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [cardsData, setCardsData] = useState([]);

    useEffect(() => {

        async function getSets() {
            
            const res = await fetch("http://localhost:3000/api/my-sets", {
                method: "GET", 
            });
            
            const data = await res.json();
            setCardsData(data.Sets);
        }

        getSets();

    }, [])


  
    const categories = [
        "All",
        "Language",
        "Science",
        "Technology",
        "History",
        "Medicine",
        "Arts",
    ];


    const filteredSets = cardsData.filter((set) => {
        const matchesSearch = 
            set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            set.description.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesCategory = selectedCategory === "All" || set.category === selectedCategory

        return matchesSearch && matchesCategory
    } )



    return (

        <section className="flex flex-col items-center pt-[40px] font-(family-name:inter) h-screen w-screen">

            <div className="flex flex-col pt-[30px] pb-9 border-b border-gray-500 w-full">
                <h1 className=" text-4xl font-bold text-left ml-20">My Sets</h1>
                <p className=" text-[22px] pt-2 ml-20">Add, remove, edit or organize your sets.</p>   


            </div>   

            <div className="flex flex-row ">
                <div className="flex-1 mr-3 relative">
                    <Input className="my-10 w-200" placeholder="Search flashcard sets..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></Input>
                </div>

                <span className="mt-10">
                    <select id="category-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="flex-1 rounded-md bg-neutral-800 p-2">
                        {categories.map((category) => (
                            <option className="bg-neutral-800 text-white" key={category} value={category}>{category}</option>
                        ))}
                    </select>   
                </span>



            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-8 h-full 2xl:grid-cols-3">

                {filteredSets.length != 0 ? (
                    //@ts-ignore
                    filteredSets.map((set, index:number) => (
                            <div key={index} className="w-[512px]">

                                <div className="h-80 w-[80%] bg-neutral-900 rounded-2xl">

                                    <div className="">
                                        <h1 className="inline-block text-left px-5 pt-5 font-bold text-2xl">{set.title}</h1>
                                    </div>

                                    <h1 className="text-left m-auto px-5 pt-2 text-gray-400">{set.description}</h1>

                                    <div className="grid grid-cols-2 gap-50 mx-5 mt-2">
                                        <p className="inline-block m-1 text-gray-300">{set.card_cnt} Cards</p>
                                        <Badge variant="secondary" className="rounded-xl top-0 left-0">{set.category}</Badge>

                                    </div>

                                    <div className="inline-block">
                                        <p className="inline-block mx-5 mt-3 text-left">New: 10</p>
                                        <p className="inline-block mx-5 mt-3 text-left">Due: 0</p>
                                    </div>
                                    



                                    <div className="flex mt-20  items-center justify-center">
                                        
                                        <Button variant="secondary" className="mr-2 w-1/2">
                                            Start Studying
                                        </Button>
                                        <Button className="bg-neutral-800">
                                            Review
                                        </Button>

                                    </div>




                                </div>
                            </div>
                    ))
                    ) : (
                        <div>
                            No cards to display.
                        </div>
                    )}

            </div>

        </section>
        
    )
}
