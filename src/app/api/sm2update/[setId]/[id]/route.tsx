import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";


export async function PATCH(req: NextRequest, { params }: { params: { setId:string; id:string }}) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
    const { setId, id } = await params;
    const request = await req.json();

    const repetition = request.repetition;
    const easeFactor = request.easeFactor;
    const interval = request.interval;
    const dueDate = request.due_date;

    const query = `
        UPDATE flashcards
        SET cards = (
            SELECT jsonb_agg(
                    CASE
                    WHEN card->>'indv_card_id' = $6 THEN
                        card || jsonb_build_object(
                        'repetition', $1::int,
                        'ease_factor', $2::float,
                        'interval', $3::int,
                        'due_date', $4::timestamp
                        )
                    ELSE
                        card
                    END
                )
            FROM jsonb_array_elements(cards::jsonb) AS card
        )
        WHERE id = $5
    `;

    const values = [
        repetition,     
        easeFactor,     
        interval,       
        dueDate, 
        setId,    
        id      
    ];

    try {
        await sql(query, values);
        return NextResponse.json({message: "success"}, {status:200})

    } catch (error) {
        return NextResponse.json({error: error}, {status:500})
    }

}