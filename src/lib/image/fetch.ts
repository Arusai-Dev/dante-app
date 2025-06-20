import { getSetById } from "../dbFunctions"

export const RetrieveSetImages = async (setId: number) => {
    const set = await getSetById(setId)
    const currentSetCardsWithImages = set[0]?.cards.filter(card => card.fileName && card.fileName.trim() !== "")
    
    const imagePromises = currentSetCardsWithImages.map(async (card) => {
        console.log("setId:", setId, "cardId:", card.cardId, "fileName:", card.fileName)
        const imageUrl = await handleImageRetrieval(setId, card.cardId, card.fileName)
        console.log("imageUrl:", imageUrl)

        const exists = await checkImageExists(imageUrl)
        if (exists) {
            const isExternal = imageUrl.startsWith("https://") || imageUrl.startsWith("http://")
            const proxiedUrl = isExternal ? `/api/proxy/image?url=${encodeURIComponent(imageUrl)}` : imageUrl
            
            return [card.cardId, proxiedUrl]
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

export const handleImageRetrieval = async (setId: number, cardId: number, fileName: string) => {
    const key = `${setId}/${cardId}/${fileName}`;

    try {
        const res = await fetch(`/api/S3/retrieve?key=${key}`)
        if (!res.ok) {
            throw new Error('Failed to fetch image.')
        }

        const data = await res.text()
        return data
    } catch(err) {
        console.error("Error in fetching image from frontend:", err)
    }
}

const checkImageExists = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;

        img.onload = () => resolve(true);
        img.onerror = (err) => {
            console.warn("Image failed to load:", url, err);
            resolve(false);
        };
    });
};

export const preloadImage = (src: string) => {
    const img = new Image();
    img.src = src;
};
