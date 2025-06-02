import { getSetById } from "@/lib/dbFunctions";

const RetrieveCardImages = async (setId: number) => {
    const res = await getSetById(setId)
    const currentSetCards = res[0]?.cards || []
    
    const imagePromises = currentSetCards.map(async (card) => {
        const imageUrl = await fetchSignedImageUrl(setId, card.cardId, card.fileName)
        return [card.cardId,imageUrl,]
    })

    const entries = await Promise.all(imagePromises)
    const cardImagesMap = Object.fromEntries(entries)
    
    return {cardImagesMap}
}

const fetchSignedImageUrl = async (setId: number, cardId: number, fileName: string) => {
    const res = await fetch(`/api/get-image?setId=${setId}&cardId=${cardId}&fileName=${fileName}`);
    const data = await res.json();
    return data.url;
};

export default RetrieveCardImages

