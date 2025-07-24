import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";


export async function POST(req: NextRequest) {
    const reqData = await req.json();
    const prompt  = reqData.prompt;

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
    model: "gpt-4.1-nano",
    input: prompt,
    instructions: "",
    text: {
        "format": {
            "type": "json_object"
        }
    },
    reasoning: {},
    tools: [],
    temperature: 1,
    max_output_tokens: 2048,
    top_p: 1,
    store: true
    });


    return NextResponse.json({"model_response": JSON.parse(response.output_text)})

} 