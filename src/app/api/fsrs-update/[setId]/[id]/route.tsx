import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: { setId:string; id:string }}) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
    const { setId, id } = await params;
    const request = await req.json();


    const due = request.due;
    const stability = request.stability;
    const difficulty = request.difficulty;
    const elapsedDays = request.elapsed_days;
    const scheduledDays = request.scheduled_days;
    const reps = request.reps;
    const lapses = request.lapses;
    const state = request.state;
    const lastReview = request.last_review;

    const query = `
        UPDATE flashcards
        SET cards = (
            SELECT jsonb_agg(
                    CASE
                    WHEN card->>'indv_card_id' = $11 THEN
                        card || jsonb_build_object(
                        'due', $1::timestamp,
                        'stability', $2::float,
                        'difficulty', $3::float,
                        'elapsed_days', $4::int,
                        'scheduled_days', $5::int,
                        'reps', $6::int,
                        'lapses', $7::int,
                        'state', $8::int,
                        'last_review', $9::timestamp
                        )
                    ELSE
                        card
                    END
                )
            FROM jsonb_array_elements(cards::jsonb) AS card
        )
        WHERE id = $10
    `;

    const values = [
        due,
        stability,
        difficulty, 
        elapsedDays,
        scheduledDays,
        reps,
        lapses,
        state,
        lastReview,
        setId,
        id
    ];

    try {
        await sql(query, values);
        return NextResponse.json({message: "success"}, {status:200})

    } catch (error) {
        console.log(error);
        
        return NextResponse.json({error: error}, {status:500})
    }

}