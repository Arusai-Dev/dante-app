/* eslint-disable @typescript-eslint/ban-ts-comment */
import { getSetById } from "@/lib/dbFunctions"
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";


export default async function EditSet({ params }) {  

    
    const { id } = await params;
    
    //@ts-ignore
    const [set] = await getSetById(id)

    const user = await currentUser();

    // TODO
    // use commented line for production, using "userid" as the user.id for development purposes.
    // if (set.user != user?.id) {
    
    if (set.user != "userid") {
        redirect("/flashcards/my-sets");
    }

    const jsonCards = set.cards;

    
}