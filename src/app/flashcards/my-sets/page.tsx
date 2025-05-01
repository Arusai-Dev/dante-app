

export default async function MyFlashcards() {
    return (

        <section className="flex flex-col items-center pt-[65px] font-(family-name:inter)">

            <div className="flex flex-col items-center pt-[30px] pb-9">
                <h1 className=" text-4xl font-bold ">My Sets.</h1>
                <p className=" text-[22px] pt-2">add, remove, edit or organize your cards.</p>   
            </div>        


            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
                
                <h1>Title</h1>
                <div className="relative w-full h-64 bg-neutral-900">
                    <h1>Description</h1>
                </div>
            </div>

        </section>

    )
}
