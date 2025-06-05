import { getSetById } from "@/lib/dbFunctions";

const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image()
        img.src = url
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
    })
}  

const fetchSignedImageUrl = async (setId: number, cardId: number, fileName: string) => {
    const res = await fetch(`/api/S3/retrieve?setId=${setId}&cardId=${cardId}&fileName=${fileName}`)
    const data = await res.json()
    return data.url
}

const RetrieveCardImages = async (setId: number) => {
    const res = await getSetById(setId)
    const currentSetCards = res[0]?.cards || []
    
    const imagePromises = currentSetCards.map(async (card) => {
        const imageUrl = await fetchSignedImageUrl(setId, card.cardId, card.fileName)

        const exists = await checkImageExists(imageUrl)
        console.log(exists)
        if (exists) {
            return [card.cardId,imageUrl,]
        } else {
            console.warn(`Image not found or not accessible:`, card.fileName)
            return [card.cardId, null]
        }
    })

    const entries = await Promise.all(imagePromises)

    const filteredEntries = entries.filter(Boolean);
    filteredEntries
        .sort((a, b) => a[0] - b[0])
        .forEach(([, url]) => {
            if (url) preloadImage(url);
        });

    return Object.fromEntries(filteredEntries);
}

const preloadImage = (src: string) => {
    const img = new Image();
    img.src = src;
};

export default RetrieveCardImages

