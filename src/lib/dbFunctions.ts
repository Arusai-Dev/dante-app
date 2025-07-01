import { useCreateStore } from "@/app/stores/createStores";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);

export async function deleteSetById(id: number) {
    try {
        await sql('DELETE FROM flashcards WHERE "id"= $1', [id]);
    } catch (error) {
        console.log(error)
    }
}

export async function deleteCardById(setId: number, cardId: number) {

    console.log("setId: ", setId, "cardId: ", cardId)

    try {

        const result = await sql<{ cards: any[] }>(
            'SELECT cards FROM flashcards WHERE id = $1',
            [setId]
        )

        const currentCards = result[0]?.cards

        if (!currentCards) {
            console.error("No cards found");
            return;
        }

        const updateCards = currentCards.filter((card) => card.cardId !== cardId);
        console.log(updateCards)
        updateCardCount(setId, updateCards.length)


        await sql('UPDATE flashcards SET cards = $2 WHERE "id" = $1', [setId, JSON.stringify(updateCards)])
    } catch (error) {
        console.log(error)
    }
}

export async function getSetById(id: number) {
    try {
        return await sql('SELECT * FROM flashcards WHERE "id"= $1', [id]);
    } catch (error) {
        console.log(error)
    }
}



export async function getSetByTitle(user_id: string, title: string) {
    try {
        return await sql('SELECT * FROM flashcards WHERE "user"= $1 AND "title"=$2 LIMIT 1', [user_id, title]);
    } catch (error) {
        console.log(error)
    }
}

export async function createNewSet(
    title: string, 
    description: string, 
    is_private: boolean, 
    date_created: Date, 
    number_cards: number, 
    user_id: string,
    cards: any[],
    tags: any[],
    category: string,
    study_count: number,
    rating: number,
    review_count: number,
) {
    try {
        return await sql(
            `INSERT INTO flashcards (cards, "user", is_private, description, date_created, title, card_cnt, tags, category, study_count, rating, review_count) 
            values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, 
            [JSON.stringify(cards), user_id, is_private, description, date_created, title, number_cards, tags, category, study_count, rating, review_count]
        );
    } catch (error) {
        console.log(error);
    }
}

export async function addOneCardToSet(
    currentSetId: number,
    cardId: number,
    category: string,
    front: string,
    back: string,
    originalFileName: string,
    croppedFileName: string,
) {
    try {
        const due = 0
        const reps = 0
        const state = 0
        const lapses = 0
        const stability = 0
        const difficulty = 0
        const elapsed_day = 0
        const scheduled_days = 0
        const last_review = null

        return await sql(
            `UPDATE flashcards
             SET cards = cards::jsonb || $1::jsonb
             WHERE id = $2`,
            [JSON.stringify([{ 
                cardId, 
                category, 
                front, 
                back, 
                originalFileName,
                croppedFileName,
                due,
                reps,
                state,
                lapses,
                stability,
                difficulty,
                elapsed_day,
                scheduled_days,
                last_review,
            }]), currentSetId]
        ); 
    } catch (error) {
        console.log(error);
    }
}

export async function updateCardCount(id: number, cardCnt: number) {

    try {
        const update = await sql(
            `UPDATE flashcards
            SET "card_cnt" = $2
            WHERE id = $1`,
            [id, cardCnt]
        )
        console.log(update)
    } catch (error) {
        console.log(error)
    }
}

export async function updateCardData(
    setId: number,
    cardId: number,
    category: string,
    front: string,
    back: string,
    originalFileName: string,
    croppedFileName: string,
) {
    try {
        const result = await sql<{ cards: any[] }>(
            'SELECT cards FROM flashcards WHERE id = $1',
            [setId]
        );

        const currentCards = result[0]?.cards;
        console.log(currentCards)

        const updatedCards = currentCards.map((card) => {
            if (card.cardId === cardId) {
                return { ...card, category, front, back, originalFileName, croppedFileName };
            }
            return card;
        });

        await sql(
            'UPDATE flashcards SET cards = $2 WHERE id = $1',
            [setId, JSON.stringify(updatedCards)]
        );

    } catch (error) {
        console.error("Failed to update card data:", error);
    }
}

export async function getPublicCards() {
    try {
        const result = await sql('SELECT * FROM flashcards where "is_private" = false');
        return result;
    } catch (error) {
        console.error("Failed to fetch all public cards", error)
    }

}

export async function uploadConversationHistory(conversationHistory, id) {
    await sql('UPDATE flashcards SET "conversation_history"=$1 WHERE id=$2', [conversationHistory, id])
        
}