import { neon } from "@neondatabase/serverless";


export async function deleteSet(id: number) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);

    try {
        await sql('DELETE FROM flashcards WHERE "id"= $1', [id]);
    } catch (error) {
        console.log(error)
    }
}