import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { neon } from "@neondatabase/serverless";

export async function POST(req: NextRequest) {
  
  const reqData:object = await req.json();
  const user = await currentUser();
  
  interface card {
    "cardId": string,
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
    "userId": string,
    "categories": [{
      "categoryName": string,
      "sets": [{
          "setName": string,
          "description": string, 
          "dateCreated": Date,
          "privacySetting": boolean,
          "cards": [{
            "card": object[],
          }]
        }]
    }] 
  }
  

  const cards: object[] = []
  reqData.cardsArray.forEach((element:object) => {
    createIndvCardObject({
      "cardId": element.cardId,
      "front": {
        "title": element.frontTitle,
        "description": element.frontDescription,
      },
      "back": {
        "title": element.backTitle, 
        "description": element.backDescription,
      },
    })
  })
  
  function createIndvCardObject(indvCard: card) {
    cards.push(indvCard)
  }
  
  
  uploadFlashcardObject({ 
      "userId": user.id,  
      "categories": [{
        "categoryName": reqData.categoryName, 
        "sets": [{
          "setName": reqData.setName, 
          "description": reqData.description, 
          "dateCreated": reqData.dateCreate, 
          "privacySetting": reqData.privacySetting, 
          "cards":[{
            "card": cards
          }]
        }]
      }]
    
    })
  
  function uploadFlashcardObject(cardObject: flashcardObject) {
    const sql = neon(process.env.DATABASE_URL);
    
  }
  
  
  
  
  
  
  
}