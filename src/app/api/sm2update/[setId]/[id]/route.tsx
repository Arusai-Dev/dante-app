import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: { setId:string; id:string }}) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
    const { setId, id } = await params;
    const request = await req.json();

    const repetition = request.repetition;
    const easeFactor = request.easeFactor;
    const interval = request.interval;
    const nextReview = request.next_review;

    console.log(repetition, easeFactor, interval, nextReview)
    
    const response = await sql(
        'UPDATE flashcards SET "repetition"=$1, "ease_factor"=$2, "interval"=$3, "next_review"=$4 WHERE "id"=$5 AND "indv_card_id"=$6', [repetition, easeFactor, interval, nextReview, setId, id]
    );

    console.log(response)

    return NextResponse.json({message: "hello"}, {status:200})
}