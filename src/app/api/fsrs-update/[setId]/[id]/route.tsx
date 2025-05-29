import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"; 


const FSRSUpdateSchema = z.object({
    due: z.string().datetime(),
    stability: z.number().min(0),
    difficulty: z.number().min(0).max(10),
    elapsed_days: z.number().int().min(0),
    scheduled_days: z.number().int().min(0),
    reps: z.number().int().min(0),
    lapses: z.number().int().min(0),
    state: z.number().int().min(0).max(3), 
    last_review: z.string().datetime(),
});

export async function PATCH(
    req: NextRequest, 
    { params }: { params: Promise<{ setId: string; id: string }> }
) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!); 
    
    try {
        const { setId, id } = await params;
        
        const requestBody = await req.json();
        
        const validatedData = FSRSUpdateSchema.parse(requestBody);
        
        const {
            due,
            stability,
            difficulty,
            elapsed_days,
            scheduled_days,
            reps,
            lapses,
            state,
            last_review
        } = validatedData;

        const checkQuery = `
            SELECT id, cards 
            FROM flashcards 
            WHERE id = $1
        `;
        
        
        const existingData = await sql(checkQuery, [setId]);
        
        if (existingData.length === 0) {
            return NextResponse.json(
                { error: "Flashcard set not found" }, 
                { status: 404 }
            );
        }

        const cards = existingData[0].cards;
        const cardExists = cards.some((card: any) => card.cardId === parseInt(id));
        
        if (!cardExists) {
            return NextResponse.json(
                { error: "Card not found in set" }, 
                { status: 404 }
            );
        }


        const updateQuery = `
            UPDATE flashcards
            SET 
                cards = (
                    SELECT jsonb_agg(
                        CASE
                            WHEN (card->>'cardId')::integer = $11 THEN
                                card || jsonb_build_object(
                                    'due', $1::timestamptz,
                                    'stability', $2::numeric,
                                    'difficulty', $3::numeric,
                                    'elapsed_days', $4::integer,
                                    'scheduled_days', $5::integer,
                                    'reps', $6::integer,
                                    'lapses', $7::integer,
                                    'state', $8::integer,
                                    'last_review', $9::timestamptz
                                )
                            ELSE
                                card
                        END
                    )
                    FROM jsonb_array_elements(cards::jsonb) AS card
                ),
                updated_at = NOW()
            WHERE id = $10
            RETURNING id, updated_at
        `;

        const values = [
            due,
            stability,
            difficulty,
            elapsed_days,
            scheduled_days,
            reps,
            lapses,
            state,
            last_review,
            setId,       
            parseInt(id)
        ];


        const result = await sql(updateQuery, values);
        
        
        if (result.length === 0) {
            return NextResponse.json(
                { error: "Failed to update card" }, 
                { status: 500 }
            );
        }


        return NextResponse.json({
            message: "Card updated successfully",
            updated_at: result[0].updated_at,
            card_id: id,
            set_id: setId
        }, { status: 200 });

    } catch (error) {
        console.error("FSRS Update Error:", error);
        
        if (error instanceof z.ZodError) {
            console.error("Validation error details:", error.errors);
            return NextResponse.json({
                error: "Invalid request data",
                details: error.errors
            }, { status: 400 });
        }
        
        if (error.code) {
            console.error("Database error code:", error.code);
            return NextResponse.json({
                error: "Database error",
                code: error.code,
                message: error.message
            }, { status: 500 });
        }
        
        console.error("Generic error:", error.message);
        return NextResponse.json({
            error: "Internal server error",
            message: error.message
        }, { status: 500 });
    }
}

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ setId: string; id: string }> }
) {
    const sql = neon(process.env.DATABASE_URL!);
    
    try {
        const { setId, id } = await params;
        
        const query = `
            SELECT 
                card.*
            FROM flashcards f,
                 jsonb_array_elements(f.cards) AS card
            WHERE f.id = $1 
              AND (card->>'cardId')::integer = $2
        `;
        
        const result = await sql(query, [setId, parseInt(id)]);
        
        if (result.length === 0) {
            return NextResponse.json(
                { error: "Card not found" }, 
                { status: 404 }
            );
        }
        
        return NextResponse.json({
            card: result[0].card
        }, { status: 200 });
        
    } catch (error) {
        console.error("Get card error:", error);
        return NextResponse.json({
            error: "Internal server error"
        }, { status: 500 });
    }
}