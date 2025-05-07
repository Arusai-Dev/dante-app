/* eslint-disable @typescript-eslint/ban-ts-comment */

import CardButton from "@/components/PlayCardComponent";
import { getSetById } from "@/lib/dbFunctions"

export default async function PlaySet({ params }) {  
    
    const { id } = await params;
    
    //@ts-ignore
    const [set] = await getSetById(id)
    
    const jsonCards = set.cards;

    return (
        
        <CardButton jsonCards={await jsonCards} number_cards={await set.number_cards} />
    )




}