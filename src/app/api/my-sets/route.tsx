/* eslint-disable @typescript-eslint/ban-ts-comment */
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";


export async function GET() {
    //@ts-ignore
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
    const user = await currentUser();

    const [rows] = await sql('SELECT * FROM flashcards WHERE user_id=($1)', [user?.id])
    //@ts-ignore
    const [row] = rows;

    if (row.length > 0) {
    
        // @ts-expect-error - Typescript expects next line to be an iterator but there is no need  
        const response = "hello";
        return NextResponse.json({ "Cards": response })
        
    } else {

        return NextResponse.json({ "Cards": "No flashcard sets to display." })
    }


}
