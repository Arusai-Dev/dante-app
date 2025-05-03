/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getSet } from "@/lib/dbFunctions"


export default async function EditSet({ params }) {  
    const { id } = await params;
    
    //@ts-ignore
    const [set] = await getSet(id)

    return (

        <div className="flex items-center justify-center">
            <p className="test-center">{set.title}</p>
        </div>

    ) 
}