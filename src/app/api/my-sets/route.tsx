import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";


export async function GET(req: NextRequest) {
    const sql = neon(process.env.DATABASE_URL);
    const user = await currentUser();

    const [rows] = await sql('SELECT * FROM flashcards WHERE user_id=($1)', [user?.id])
    
    if (rows.length > 0) {
    
        //@ts-ignore
        const [response] = rows;
        return NextResponse.json({ "Cards": response })
        
    } else {
        return NextResponse.json({ "Cards": "No flashcard sets to display." })
    }
    
     
    console.log(response);


}
