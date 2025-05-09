/* eslint-disable @typescript-eslint/ban-ts-comment */
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";


export async function GET() {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
    
    // TODO 
    // using this for testing, for production use [user?.id] && uncomment next line
    // const user = await currentUser();
    const userId = 'userid';
    const set = await sql('SELECT * FROM flashcards WHERE "user" = $1', [userId]);


    if (set.length > 0) {
        return NextResponse.json({ "Sets": set })
        
    } else {
        return NextResponse.json({ "Sets": "No Sets" })
    }


}
