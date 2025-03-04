import { neon } from '@neondatabase/serverless';

export default async function MyFlashcards() {
  const sql = neon(process.env.DATABASE_URL);
  await sql`CREATE TABLE IF NOT EXISTS flashcards (testvalue TEXT)`;
  
  return (
    <input type="text" />
  );
}