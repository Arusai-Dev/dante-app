"use client"    
import { deleteSetById } from "@/lib/dbFunctions"
import { Trash } from "lucide-react"
import Link from "next/link"


export default function DeleteButton({ id }) {
    return (
        <Link href="/flashcards/my-sets">
            <button onClick={() => deleteSetById(id) }><Trash className="inline-block m-1 hover:text-red-400 " /></button>
        </Link>
    )

}