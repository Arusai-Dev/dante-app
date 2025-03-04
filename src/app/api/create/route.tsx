import { neon } from "@neondatabase/serverless";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  
  const text = formData.get("text");
  
  const sql = neon(process.env.DATABASE_URL);
  await sql("INSERT INTO flashcards (text) VALUES ($1)", [text]);
  
}