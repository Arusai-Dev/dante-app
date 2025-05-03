"use client"    
import { Pencil } from "lucide-react"
import Link from "next/link"


export default function EditButton({ id }) {
    return (
         <Link href={`/flashcards/edit/${id}`}>
            <button><Pencil className="inline-block m-1 hover:text-orange-300"/></button>
        </Link>
    )

}