import { neon } from "@neondatabase/serverless";


export async function deleteSetById(id: number) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);

    try {
        await sql('DELETE FROM flashcards WHERE "id"= $1', [id]);
    } catch (error) {
        console.log(error)
    }
    
}

export async function getSetById(id: number) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);

    try {
        return await sql('SELECT * FROM flashcards WHERE "id"= $1', [id]);
    } catch (error) {
        console.log(error)
    }
}

export async function getSetByTitle(user_id: string, title: string) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);

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
    cards: any[]
) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);

    try {
        return await sql(
            `INSERT INTO flashcards (cards, "user", is_private, description, date_created, title, card_cnt) 
            values ($1, $2, $3, $4, $5, $6, $7)`, 
            [JSON.stringify(cards), user_id, is_private, description, date_created, title, number_cards]
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
    qualityScore: number,
    easeFactor: number,
    repetition: number,
    interval: number,
    nextReview: Date
) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL)

    try {
        return await sql(
            `UPDATE flashcards
             SET cards = cards::jsonb || $1::jsonb
             WHERE id = $2`,
            [JSON.stringify([{ cardId, category, front, back, qualityScore, easeFactor, repetition, interval, nextReview }]), currentSetId]
        ); 
    } catch (error) {
        console.log(error);
    }
}

export async function updateCardCount(id: number, cardCnt: number) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL)

    try {
        return await sql(
            `UPDATE flashcards
            SET card_cnt = $1
            WHERE id = $2
            RETURNING *`,
            [cardCnt, id]
        )
    } catch (error) {
        console.log(error)
    }
} 