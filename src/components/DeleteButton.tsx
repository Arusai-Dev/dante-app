"use client"    
import { deleteSetById } from "@/lib/dbFunctions"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DeleteButton({ id, title }) {
    return (
        <AlertDialog>
            <AlertDialogTrigger className="bg-red-500 py-1 px-5 mr-2 rounded-md " >Delete Flashcard Set</AlertDialogTrigger>
            <AlertDialogContent className="bg-neutral-800">
                <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                    This action cannot be undone. This will permanently delete the flashcard set <strong>{title}</strong> from your account.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel className="bg-neutral-800 cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => { deleteSetById(id);  location.reload()} } className="hover:bg-neutral-950">
                    Confirm
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
        
 
    )

}