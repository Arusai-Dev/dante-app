/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Layers2, Globe, LockKeyhole, BookOpenIcon } from "lucide-react"
import Link from "next/link";

export default async function MyFlashcards() {

    const res = await fetch("http://localhost:3000/api/my-sets", {
        method: "GET", 
    });

    const categories = [
        "All",
        "Languages",
        "Science",
        "Technology",
        "History",
        "Medicine",
        "Arts",
    ];

    const data = await res.json();
    const setData = data.Sets;
    return (

        <section className="flex flex-col items-center pt-[40px] font-(family-name:inter) h-screen w-screen">

            <div className="flex flex-col pt-[30px] pb-9 border-b border-gray-500 w-full">
                <h1 className=" text-4xl font-bold text-left ml-20">My Sets</h1>
                <p className=" text-[22px] pt-2 ml-20">Add, remove, edit or organize your sets.</p>   


            </div>   

            <div className="flex flex-col gap-4">
                <div className="relative flex-1">
                    <Input className="my-10 " placeholder="Search flashcard sets..."></Input>
                </div>


                <select id="category-select" className="rounded-md bg-neutral-800 p-2">
                    {categories.map((category) => (
                        <option className="bg-neutral-800 text-white" key={category}>{category}</option>
                    ))}
                </select>   



            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-8 h-full 2xl:grid-cols-3">

                {setData != "No Sets" ? (
                    //@ts-ignore
                    setData.map(async (set, index:number) => (
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
