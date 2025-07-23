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
                
                    console.log(`Found original image for card ${card.cardId}`);
                    imageEntries.push([`${card.cardId}-original`, originalImageURL]);
                }

                const croppedImageUrl = await handleImageRetrieval(setId, card.cardId, "cropped", card.fileName);
                
                console.log(`Found cropped image for card ${card.cardId}`);
                imageEntries.push([`${card.cardId}-cropped`, croppedImageUrl]);
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
        const res = await fetch(`/api/S3/retrieve?key=${key}`);
        if (!res.ok) {
            throw new Error('Failed to fetch image.');
        }
        const cloudFrontUrl = await res.text();
        console.log("CloudFront URL from backend:", cloudFrontUrl);
        return cloudFrontUrl;
    } catch(err) {
        console.error("Error in fetching image from frontend:", err);
        return null;
    }
};

export const preloadImage = (url: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = url;
    });
};

