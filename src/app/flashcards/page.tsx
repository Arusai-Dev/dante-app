import { Button } from "@/components/ui/button";
import { SquarePlus } from "lucide-react";
import Link from "next/link";

export default function Flashcards() {
  return (
    <>
      <div>
        Create a flashcard set 
      </div>
      
      <Button>
        <Link href={"/flashcards/create"}>
          Create 
        </Link>
          <SquarePlus />
      </Button>
    </>
  )
}