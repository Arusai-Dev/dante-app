import { neon } from "@neondatabase/serverless";
import { NextRequest } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  
  const reqData:object = await req.json();
  const user = await currentUser();
  let cards: object[];
  
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
            "card":card[],
          }]
        }]
    }] 
  }
  
  
  reqData.cardsArray.forEach((element, index, array) => {
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
      "userId": user?.id,  
      "categories": [{
        "categoryName": reqData.categoryName, 
        "sets": [{
          "setName": reqData.setName, 
          "description": reqData.description, 
          "dateCreated": reqData.dateCreate, 
          "privacySetting": reqData.privacySetting, 
          "cards":[{
            cards
          }]
        }]
      }]
    
    })
  
  function uploadFlashcardObject(cardObject: flashcardObject) {
    const sql = neon(process.env.DATABASE_URL);
    
  }
  
  
  
  
  
  
  
}