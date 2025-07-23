import { getSetById } from "../dbFunctions"

export const RetrieveSetImages = async (setId: number) => {
    try {
        const set = await getSetById(setId);
        const currentSetCardsWithImages = set[0]?.cards.filter(card => 
            card.fileName && card.fileName.trim() !== ""
        );
        
        if (!currentSetCardsWithImages || currentSetCardsWithImages.length === 0) {
            return {};
        }

        const imagePromises = currentSetCardsWithImages.map(async (card) => {
            const imageEntries: [string, string | null][] = [];
            
            try {
                if (card.fileName) {
                    const originalImageURL = await handleImageRetrieval(setId, card.cardId, "original", card.fileName);
                    const originalImageExists = await checkImageExists(originalImageURL);
                    
                    if (originalImageExists) {
                        console.log(`Found original image for card ${card.cardId}`);
                        const isExternal = originalImageURL.startsWith("https://") || originalImageURL.startsWith("http://");
                        const proxiedOriginal = isExternal 
                            ? `/api/proxy/image?url=${encodeURIComponent(originalImageURL)}` 
                            : originalImageURL;
                        imageEntries.push([`${card.cardId}-original`, proxiedOriginal]);
                    }
                }

                const croppedImageUrl = await handleImageRetrieval(setId, card.cardId, "cropped", card.fileName);
                const croppedImageExists = await checkImageExists(croppedImageUrl);
                
                if (croppedImageExists) {
                    console.log(`Found cropped image for card ${card.cardId}`);
                    const isExternal = croppedImageUrl.startsWith("https://") || croppedImageUrl.startsWith("http://");
                    const proxiedCropped = isExternal 
                        ? `/api/proxy/image?url=${encodeURIComponent(croppedImageUrl)}` 
                        : croppedImageUrl;
                    imageEntries.push([`${card.cardId}-cropped`, proxiedCropped]);
                }
            } catch (error) {
                console.error(`Error processing images for card ${card.cardId}:`, error);
            }
            
            return imageEntries;
        });

        const nestedResults = await Promise.all(imagePromises);
        const flatEntries = nestedResults.flat();
        
        const validEntries = flatEntries.filter(([, url]) => !!url);
        validEntries.forEach(([, url]) => preloadImage(url!));
        
        const imageMap = Object.fromEntries(flatEntries);
        console.log(`Retrieved ${Object.keys(imageMap).length} images for set ${setId}`);
        
        return imageMap;
        
    } catch (error) {
        console.error(`Error retrieving images for set ${setId}:`, error);
        return {};
    }
};


export const handleImageRetrieval = async (setId: number, cardId: number, fileType: string, fileName: string) => {
    const key = `${setId}/${cardId}/${fileType}/${fileName}`;
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

export const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
    });
};

