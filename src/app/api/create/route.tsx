import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: NextRequest) {
  const sql = neon(process.env.DATABASE_URL);
  
  const reqData = await req.json();
  const user = await currentUser();
  const userId = user?.id;
  
  const isPrivate = reqData.get("isPrivate");
  const description = reqData.get("description");
  const dateCreated = new Date();
  const cards = reqData.get("cards");


  await sql("INSERT INTO flashcards (cards, user, is_private, description, date_created) VALUES ($1, $2, $3, $4, $5)", [cards, userId, isPrivate, description, dateCreated])

  
  
  
}