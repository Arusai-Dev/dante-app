/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getSet } from "@/lib/dbFunctions"
import { Play, Share, Shuffle } from "lucide-react";
import Link from "next/link";

export default async function ViewSet({ params }) {  
    const { id } = await params;
    
    //@ts-ignore
    const [set] = await getSet(id)

    const jsonCards = JSON.parse(set.cards);

    return (

        <section className="flex flex-col items-center pt-[65px] font-(family-name:inter)">

            <div className="flex flex-col items-center pt-[30px] pb-9">
                <h1 className=" text-4xl font-bold ">{set.title}</h1>
                <p className=" text-[22px] pt-2">{set.description}</p>   

                <div className="flex gap-3 p-4"> 

                    <Link href={`/flashcards/practice/${set.id}`}>
                        <button className="flex items-center w-[50px] h-[40px] py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200">
                            <Play />
                        </button>
                    </Link>
                    <button className="flex items-center w-[50px] h-[40px] py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200">
                        <Shuffle />
                    </button>

                    <button className="flex items-center w-[50px] h-[40px] py-1 px-3 bg-[#D9D9D9]/3 rounded-[5px] border-1 border-[#828282] hover:bg-[#474747] transition-colors duration-200">
                        <Share />
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