/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getSet } from "@/lib/dbFunctions"

export default async function PracticeSet({ params }) {  
    const { id } = await params;
    
    //@ts-ignore
    const [set] = await getSet(id)

    const jsonCards = JSON.parse(set.cards);

    return (
        <h1></h1>
    )




}