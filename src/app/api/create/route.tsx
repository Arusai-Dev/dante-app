import { neon } from "@neondatabase/serverless";
import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  
  const requestData:object = await req.json();
  
  let cards:card = {}
  
  interface card {
    "card_id": string,
    "front": {
      "title": string,
      "description": string
    },
    "back": {
      "title": string, 
      "description": string
    }
  }
  
  interface flashcardObject {
    "user_id": string,
    "categories": [{
      "category_name": string,
      "sets": [{
          "set_name": string,
          "description": string, 
          "date_created": Date,
          "privacy_setting": boolean,
          "cards": [{
            "card":card[],
          }]
        }]
    }] 
  }
  
  
  
  
  const sql = neon(process.env.DATABASE_URL);
  
  
  
}