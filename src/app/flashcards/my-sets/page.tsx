/* eslint-disable @typescript-eslint/ban-ts-comment */
import DeleteButton from "@/components/DeleteButton";
import EditButton from "@/components/EditButton";
import { Layers2, Globe, LockKeyhole } from "lucide-react"
import Link from "next/link";

export default async function MyFlashcards() {

    const res = await fetch("http://localhost:3000/api/my-sets", {
        method: "GET", 
    });

    const data = await res.json();
    const setData = data.Sets;
    return (

        <section className="flex flex-col items-center pt-[65px] font-(family-name:inter) h-screen w-screen">

            <div className="flex flex-col items-center pt-[30px] pb-9">
                <h1 className=" text-4xl font-bold ">My Sets</h1>
                <p className=" text-[22px] pt-2">Add, remove, edit or organize your sets.</p>   
            </div>        

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 gap-8 h-full 2xl:grid-cols-3">

                {setData != "No Sets" ? (
                    //@ts-ignore
                    setData.map(async (set, index:number) => (
                    
                    <Link key={index} href={`/flashcards/view/${set.id}`} >
                        <div key={index} className="w-[512px]">


                            <h1 className="relative font-bold text-2xl">{set.title}</h1>

                            <div className="flex relative content-center items-center text-center h-64 w-full bg-neutral-900 rounded-2xl">

                                <div className="absolute top-0 right-0 m-2">
                                    <EditButton id={set.id}
                                        
                                    />
                                    <DeleteButton id={set.id}/>
                                    {set.is_private ? ( <LockKeyhole className="inline-block m-1"/> ) : (<Globe className="inline-block m-1"/>) }
                                </div>

                                <div className="absolute bottom-0 right-0 m-2">
                                    <p className="inline-block m-1">{set.card_cnt}</p>
                                    <Layers2 className="inline-block m-1"/>

                                </div>

                                {/* TODO put a 50 word limit on description */}
                                <h1 className="text-center m-auto">{set.description}</h1>

                            </div>

                        </div>
                    </Link>

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
