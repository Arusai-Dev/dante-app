/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getSet } from "@/lib/dbFunctions"

export default async function ViewSet({ params }) {  
    const { id } = await params;
    
    //@ts-ignore
    const [set] = await getSet(id)

    const jsonCards = JSON.parse(set.cards);

    return (

        <section className="flex flex-col items-center pt-[65px] font-(family-name:inter)">

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