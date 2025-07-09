"use client"

import { useState } from "react"
import { Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { deleteSetById } from "@/lib/dbFunctions"

interface DeleteButtonProps {
  id: string
  title: string
}

export default function DeleteButton({ id, title }: DeleteButtonProps) {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  async function handleDelete() {
    setIsPending(true)
    await deleteSetById(parseInt(id)); 
    setIsPending(false);

    location.reload()
  }


  return (
    <>
      <Button
        size="sm"
        className="w-full flex items-center gap-2 bg-red-500 hover:bg-red-400"
        onClick={() => setOpen(true)}
        disabled={isPending}
      >
        <Trash className="w-4 h-4" />
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-neutral-900">
          <DialogHeader>
            <DialogTitle>Delete “{title}”?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-neutral-400 mt-2">
            This action cannot be undone. All cards in this set will be permanently removed.
          </p>
          <DialogFooter className="pt-6">
            <Button variant="outline" className="text-black hover:bg-gray-200" onClick={() => setOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button variant="destructive" 
              onClick={handleDelete} 
              disabled={isPending}>

                {isPending ? "Deleting…" : "Delete"}
            
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
