import { neon } from "@neondatabase/serverless";
import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";


export async function GET(req: NextRequest) {
    const sql = neon(process.env.DATABASE_URL);
    const user = await currentUser();

    const response = await sql('SELECT * FROM flashcards WHERE user_id=($1)', [user?.id])

    console.log(response);


}
