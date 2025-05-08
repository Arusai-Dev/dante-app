import { NextApiRequest } from "next";
import { neon } from "@neondatabase/serverless";
import { NextResponse } from "next/server";


export async function PATCH(req: NextApiRequest, { params }: { params: { setId:string; id:string }}) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
    
    const { setId, id } = await params;
    
    return NextResponse.json({message: "hello"}, {status:200})
}