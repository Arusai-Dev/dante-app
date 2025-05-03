"use client"    
import { deleteSet } from "@/lib/dbFunctions"
import { Trash } from "lucide-react"


export default function DeleteButton({ id }) {
    return (
        <button onClick={() => deleteSet(id) }><Trash className="inline-block m-1 hover:text-red-400 " /></button>
    )

}