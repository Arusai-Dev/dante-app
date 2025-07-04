"use client"    
import { useCreateStore } from "@/app/stores/managerStores"
import { getSetById } from "@/lib/dbFunctions"
import { Pencil } from "lucide-react"
import Link from "next/link"



export default function EditButton({ id }) {
    const { 
        setActive, 
        setCurrentSet,
        currentSet,
    } = useCreateStore()

    const changePage = async () => {
        const res = await getSetById(id)
        setCurrentSet(res[0])
        setActive("manage")
        console.log(currentSet)
    }

    return (
        <Link href={`/flashcards/manager`}
            onClick={() => {
                changePage();
            }}   
        >
            <Pencil className="inline-block m-1 hover:text-orange-300"/>
        </Link>
    )
}