import { NextApiRequest } from "next";
import { neon } from "@neondatabase/serverless";


export default function PATCH(req: NextApiRequest, { params }: { params: { setId:string; id:string }}) {
    const sql = neon(process.env.NEXT_PUBLIC_DATABASE_URL);
    
    const { setId, id } = params;
    
    console.log(setId)
}