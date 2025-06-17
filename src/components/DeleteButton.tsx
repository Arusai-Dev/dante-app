"use client"    
import { deleteSetById } from "@/lib/dbFunctions"
import { Trash } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"


export default function DeleteButton({ id }) {
    return (
        <Link href="/flashcards/my-sets">
            <Button variant="destructive" className="mr-5" onClick={() => deleteSetById(id) }>Delete Flashcard Set</Button>
        </Link>
    )

}