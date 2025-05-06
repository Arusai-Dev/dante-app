import { neon } from "@neondatabase/serverless";


export async function deleteSet(id: number) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);

    try {
        await sql('DELETE FROM flashcards WHERE "id"= $1', [id]);
    } catch (error) {
        console.log(error)
    }
}

export async function getSet(id: number) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);

    try {
        return await sql('SELECT * FROM flashcards WHERE "id"= $1', [id]);
    } catch (error) {
        console.log(error)
    }
}

export async function createNewSet(
    title: string, 
    description: string, 
    is_private: boolean, 
    date_created: string, 
    number_cards: number, 
    user_id: string,
    cards: Array<null>
) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);

    try {
        return await sql(
            `INSERT INTO flashcards (user, is_private, description, data_created, title, number_cards) 
            values ($1, $2, $3, $4, $5, $6, $7)`, 
            [user_id, is_private, description, date_created, title, number_cards, cards]
        );
    } catch (error) {
        console.log(error);
    }

}