import { neon } from "@neondatabase/serverless";

export default async function MyFlashcards() {
    const responseCards = fetch("http://localhost:3000/api/my-sets", {
        method: "GET",
    });

    // TO DO 
    // Use .map to display all flashcard sets
    console.log(responseCards);

    return <input type="text" />;
}
