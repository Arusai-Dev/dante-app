import { neon } from "@neondatabase/serverless";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const FSRSUpdateSchema = z.object({
	id: z.number().int().positive(), 
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

const RequestSchema = z.object({
	localCardScores: z.array(FSRSUpdateSchema)
});

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ setId: string }> }
) {
	const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL!);

	try {
		const { setId } = await params;

		const requestData = await req.json();
		console.log("Raw request data:", requestData);

		let cardsToUpdate;
		if (Array.isArray(requestData)) {
			cardsToUpdate = requestData;
		} else if (requestData && requestData.localCardScores) {
			const validatedRequest = RequestSchema.parse(requestData);
			cardsToUpdate = validatedRequest.localCardScores;
		} else {
			return NextResponse.json(
				{ error: "Invalid request format. Expected array or {localCardScores: array}" },
				{ status: 400 }
			);
		}

		if (cardsToUpdate.length === 0) {
			return NextResponse.json(
				{ message: "No cards to update" },
				{ status: 200 }
			);
		}

		console.log(`Processing ${cardsToUpdate.length} card updates for set ${setId}`);

		const validatedCards = cardsToUpdate.map(card => FSRSUpdateSchema.parse(card));

		const checkQuery = `SELECT cards FROM flashcards WHERE id = $1`;
		const existingData = await sql(checkQuery, [setId]);

		if (existingData.length === 0) {
			return NextResponse.json(
				{ error: "Flashcard set not found" },
				{ status: 404 }
			);
		}

		let cards = existingData[0].cards;
		const results = [];

		for (const cardUpdate of validatedCards) {
			const {
				id: cardId,
				due,
				stability,
				difficulty,
				elapsed_days,
				scheduled_days,
				reps,
				lapses,
				state,
				last_review,
			} = cardUpdate;

			console.log(`Updating card ${cardId}`);

			let cardFound = false;
			cards = cards.map(card => {
				if (card.cardId === cardId) {
					cardFound = true;
					return {
						...card,
						due,
						stability: parseFloat(stability.toString()),
						difficulty: parseFloat(difficulty.toString()),
						elapsed_days,
						scheduled_days,
						reps,
						lapses,
						state,
						last_review,
						elapsed_day: elapsed_days
					};
				}
				return card;
			});

			if (cardFound) {
				results.push({
					cardId,
					status: 'success'
				});
			} else {
				console.warn(`Card ${cardId} not found in set ${setId}`);
				results.push({
					cardId,
					status: 'not_found',
					error: 'Card not found in set'
				});
			}
		}

		const updateQuery = `
			UPDATE flashcards 
			SET 
				cards = $1::jsonb,
				updated_at = NOW()
			WHERE id = $2
			RETURNING updated_at
		`;

		try {
			const updateResult = await sql(updateQuery, [JSON.stringify(cards), setId]);
			
			if (updateResult.length > 0) {
				console.log(`Successfully updated ${results.filter(r => r.status === 'success').length} cards`);
				
				return NextResponse.json({
					message: "Cards processed successfully",
					results,
					set_id: setId,
					processed_count: results.filter(r => r.status === 'success').length,
					updated_at: updateResult[0].updated_at
				}, { status: 200 });
			} else {
				throw new Error("No rows updated");
			}

		} catch (updateError) {
			console.error("Database update error:", updateError);
			return NextResponse.json({
				error: "Failed to update database",
				message: updateError.message
			}, { status: 500 });
		}

	} catch (error) {
		console.error("PATCH error:", error);
		
		if (error instanceof z.ZodError) {
			return NextResponse.json({
				error: "Invalid request data",
				details: error.errors
			}, { status: 400 });
		}

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
		const cardId = parseInt(id);

		const query = `SELECT cards FROM flashcards WHERE id = $1`;
		const result = await sql(query, [setId]);

		if (result.length === 0) {
			return NextResponse.json(
				{ error: "Flashcard set not found" },
				{ status: 404 }
			);
		}

		const cards = result[0].cards;
		const card = cards.find(c => c.cardId === cardId);

		if (!card) {
			return NextResponse.json(
				{ error: "Card not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json({
			card: card,
		}, { status: 200 });
		
	} catch (error) {
		console.error("Get card error:", error);
		return NextResponse.json({
			error: "Internal server error",
		}, { status: 500 });
	}
}