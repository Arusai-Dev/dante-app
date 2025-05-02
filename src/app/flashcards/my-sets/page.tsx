import { Trash, Pencil, Layers2 } from "lucide-react"

export default async function MyFlashcards() {
    return (

        <section className="items-center pt-[65px] font-(family-name:inter)">

            <div className="items-center pt-[30px] pb-9">
                <h1 className=" text-4xl font-bold ">My Sets.</h1>
                <p className=" text-[22px] pt-2">add, remove, edit or organize your cards.</p>   
            </div>        

            <div className="grid grid-cols-3 gap-2">

                <div>

                    <h1 className="relative font-bold text-2xl">Title</h1>

                    <div className="absolute flex content-center items-center text-center h-64 w-lg bg-neutral-900 rounded-2xl">

                        <div className="absolute top-0 right-0 m-2">
                            <Pencil className="inline-block m-1"/> 
                            <Trash className="inline-block m-1" />
                        </div>

                        <div className="absolute bottom-0 right-0 m-2">
                            <p className="inline-block m-1">25</p>
                            <Layers2 className="inline-block m-1"/>

                        </div>

                        {/* TODO put a 50 word limit on description */}
                        <h1 className="text-center m-auto">Description</h1>

                    </div>

                </div>

            </div>

        </section>
        
    )
}
