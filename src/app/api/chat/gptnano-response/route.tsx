import { NextRequest, NextResponse } from "next/server";
// import OpenAI from "openai";
import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai';


export async function POST(req: NextRequest){
    const reqData = await req.json();
    const { prompt }: {prompt: string} = reqData.message;



    // const openai = new OpenAI({
    // apiKey: process.env.OPENAI_API_KEY,
    // });



    // const response = await openai.responses.create({
    // model: "gpt-4.1-nano",
    // input: message,
    // instructions: "",
    // text: {
    //     "format": {
    //     "type": "text"
    //     }
    // },
    // reasoning: {},
    // tools: [],
    // temperature: 1,
    // max_output_tokens: 2048,
    // top_p: 1,
    // store: true,
    // stream: true
    // });



    const response = streamText({
        model: openai("gpt-4.1-nano"),
        system: "",
        prompt
    })

    return response.toDataStreamResponse();

    // return NextResponse.json({"response": "response.output_text"})


}