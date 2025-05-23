import { generateText } from "ai"
import { openai } from "@ai-sdk/openai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    // const reqData = await req.json();
    // const message:string = reqData.get("message");
    // const sessionId = reqData.get("sessionId");
    
    // TODO
    // Database call to fetch chat history if user has option enabled.
    
    // const { modelResponse } = await generateText({
    //     model: openai("gpt-4.1-nano"),
    //     prompt: message
    // })
    
    const modelResponse = "hello";
    return NextResponse.json({"response": modelResponse})
}