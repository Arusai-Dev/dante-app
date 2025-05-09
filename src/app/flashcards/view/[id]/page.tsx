/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getSetById } from "@/lib/dbFunctions"
import { CircleHelp, Play, Share, Target } from "lucide-react";
import Link from "next/link";

export default async function ViewSet({ params }) {  
    const { id } = await params;
    
    //@ts-ignore
    const [set] = await getSetById(id)
    const jsonCards = set.cards;
    
    return (

        <section className="flex flex-col items-center pt-[65px] font-(family-name:inter)">

            <div className="flex flex-col items-center pt-[30px] pb-9">
                <h1 className=" text-4xl font-bold ">{set.title}</h1>
                <p className=" text-[22px] pt-2">{set.description}</p>   

                <div className="flex gap-3 p-4"> 

                    <Link href={`/flashcards/play/${set.id}`}>
                        <button className="flex items-center  py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200">
                            <Play className="size-5 mr-3"/> 
                            <h1>Play</h1>
                        </button>
                    </Link>

                    <Link href={`/flashcards/practice/${set.id}`}>

                        <button className="flex items-center py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200"> 

                            <Target className="mr-3 inline-block"/>
                            <h1 className="inline-block">Practice Mode </h1> 

                            <div className="tooltip ml-3" data-tip="Practice mode implements specialized algorithms to optimize your learning.">
                                <CircleHelp className="size-4"/>
                            </div>

                        </button>

                    </Link>

                    <button className="flex items-center py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200">
                        <Share className="size-5 mr-3"/>
                        <h1>Share</h1>
                    </button>
                </div>


            </div>        

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-8 h-full 2xl:grid-cols-3">

                { jsonCards.map((card, index:number) => (
                        <div key={index} className="w-[512px]">

                            <h1 className="relative font-bold text-2xl">
                                {card.front}
                            </h1>

                            <div className="flex relative content-center items-center text-center h-64 w-full bg-neutral-900 rounded-2xl">
                                {card.back}
                            </div>

                        </div>
                ))}

            </div>

        </section>

    ) 
}