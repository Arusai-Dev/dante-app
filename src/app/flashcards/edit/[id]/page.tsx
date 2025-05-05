/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getSet } from "@/lib/dbFunctions"
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function EditSet({ params }) {  

    
    const { id } = await params;
    
    //@ts-ignore
    const [set] = await getSet(id)

    const user = await currentUser();

    // TODO
    // use commented line for production, using "userid" as the user.id for development purposes.
    // if (set.user != user?.id) {
    
    if (set.user != "userid") {
        redirect("/flashcards/my-sets");
    }

    const jsonCards = JSON.parse(set.cards);

}