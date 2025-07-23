import { useManagerPersistentStore } from "@/app/stores/managerStores";
import { getSetById } from "@/lib/dbFunctions";
import { preloadImage, RetrieveSetImages } from "@/lib/image";


// Add Set

// Update Set Data
export const updateCurrentSet = async (id: number) => {
    const updatedSet = await getSetById(id)
    useManagerPersistentStore.getState().setCurrentSet(updatedSet[0])
}

export const updateSetImagesMap = async (id: number) => {
    try {
        const set = await getSetById(id);
        
        if (!set || !set[0] || !set[0].cards) {
            console.log("No set or cards found");
            // useManagerPersistentStore.getState().setContainsImages(false);
            return;
        }

        const cardsWithImages = set[0].cards.filter((card: { 
            originalFileName: string; 
            croppedFileName: string; 
        }) => {
            const hasOriginal = card.originalFileName && card.originalFileName.trim() !== "";
            const hasCropped = card.croppedFileName && card.croppedFileName.trim() !== "";
            return hasOriginal || hasCropped;
        });

        if (cardsWithImages.length === 0) {
            // useManagerPersistentStore.getState().setContainsImages(false);
            console.log("No images to fetch");
            return;
        }

        // useManagerPersistentStore.getState().setContainsImages(true);
        console.log(`Found ${cardsWithImages.length} cards with images`);

        const map = await RetrieveSetImages(id);
        
        const preloadPromises = Object.values(map).map(async (imageUrl) => {
            try {
                const result = preloadImage(imageUrl as string);
                if (result && typeof result.then === 'function') {
                    await result;
                } else {
                    console.warn("preloadImage did not return a Promise for:", imageUrl);
                }
            } catch (error) {
                console.warn("Failed to preload image:", imageUrl, error);
            }
        })
        
        await Promise.allSettled(preloadPromises);
        
        useManagerPersistentStore.getState().setCurrentSetImages(map);
        console.log("Updated set images:", useManagerPersistentStore.getState().currentSetImages);

    } catch (error) {
        console.error("Error updating set images map:", error);
        useManagerPersistentStore.getState().setContainsImages(false);
    }
};

// Delete Set
