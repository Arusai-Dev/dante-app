import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";


export async function POST(req: NextRequest, { params } ){
    const reqData = await req.json();
    
    const history = reqData.history;

    const { model } = await params


    const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    });



    const response = await openai.responses.create({
    model: model,
    input: history,
    instructions: "",
    text: {
        "format": {
        "type": "text"
        }
    },
    reasoning: {},
    tools: [],
    temperature: 1,
    max_output_tokens: 2048,
    top_p: 1,
    store: true,
    });

    return NextResponse.json({"response": response.output_text})


}