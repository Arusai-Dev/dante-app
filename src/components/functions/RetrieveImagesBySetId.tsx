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
    const set = await getSetById(setId)
    const currentSetCardsWithImages = set[0]?.cards.filter(card => card.fileName && card.fileName.trim() !== "")
    
    const imagePromises = currentSetCardsWithImages.map(async (card) => {
        const imageUrl = await fetchSignedImageUrl(setId, card.cardId, card.fileName)

        const exists = await checkImageExists(imageUrl)
        console.log(exists)
        if (exists) {
            const isExternal = imageUrl.startsWith("https://") || imageUrl.startsWith("http://")
            const proxiedUrl = isExternal ? `/api/proxy/image?url=${encodeURIComponent(imageUrl)}` : imageUrl

            return [card.cardId,proxiedUrl,]
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

