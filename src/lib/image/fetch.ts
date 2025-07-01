import { useCreateStore } from "@/app/stores/createStores"
import { getSetById } from "../dbFunctions"

export const RetrieveSetImages = async (setId: number) => {
    const set = await getSetById(setId)
    const currentSetCardsWithImages = set[0]?.cards.filter(card => card.originalFileName && card.originalFileName.trim() !== "")
    if (!currentSetCardsWithImages) return
    const imagePromises = currentSetCardsWithImages.map(async (card) => {
        const imageEntries: [string, string | null][] = [];

        const originalImageUrl = await handleImageRetrieval(setId, card.cardId, card.originalFileName)
        const originalImageExists = await checkImageExists(originalImageUrl)
        if (originalImageExists) {
            console.log("Found original image...")
            const isExternal = originalImageUrl.startsWith("https://") || originalImageUrl.startsWith("http://")
            const proxiedOriginal = isExternal ? `/api/proxy/image?url=${encodeURIComponent(originalImageUrl)}` : originalImageUrl   
            
            imageEntries.push([`${card.cardId}-original`, proxiedOriginal]);
        }

        if (card.croppedFileName != "") {
            const croppedImageUrl = await handleImageRetrieval(setId, card.cardId, card.croppedFileName)
            const croppedImageExists = await checkImageExists(croppedImageUrl)
            if (croppedImageExists) {
                console.log("Found cropped image...")
                const isExternal = croppedImageUrl.startsWith("https://") || croppedImageUrl.startsWith("http://")
                const proxiedCropped = isExternal ? `/api/proxy/image?url=${encodeURIComponent(croppedImageUrl)}` : croppedImageUrl   
                
                imageEntries.push([`${card.cardId}-cropped`, proxiedCropped]);
            }
        }

        return imageEntries
    })

    const nestedResults = await Promise.all(imagePromises);
    const flatEntries = nestedResults.flat()

    flatEntries
        .filter(([, url]) => !!url)
        .forEach(([, url]) => preloadImage(url!))

    return Object.fromEntries(flatEntries);
}

export const handleImageRetrieval = async (setId: number, cardId: number, fileName: string) => {
    const key = `${setId}/${cardId}/${fileName}`;
    console.log("S3 key:", key);

    try {
        const res = await fetch(`/api/S3/retrieve?key=${key}`)
        if (!res.ok) {
            throw new Error('Failed to fetch image.')
        }

        const data = await res.text()
        console.log("Image URL from backend:", data);

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


