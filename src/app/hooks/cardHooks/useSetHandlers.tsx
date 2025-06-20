import { useCreateStore } from "@/app/stores/createStores";
import { getSetById } from "@/lib/dbFunctions";
import { preloadImage, RetrieveCardImages } from "@/lib/image";


// Add Set

// Update Set Data
export const updateCurrentSet = async (id: number) => {
    const updatedSet = await getSetById(id)
    useCreateStore.getState().setCurrentSet(updatedSet[0])
}

// Update Set Images
export const updateSetImagesMap = async (id: number) => {
    const set = await getSetById(id);
    if (!set[0]) return

    const cardsWithImages = set[0]?.cards.filter(card => card.fileName && card.fileName.trim() !== "");
    console.log(cardsWithImages)
    if (cardsWithImages.length === 0) {
        useCreateStore.getState().setContainsImages(false);
        console.log("No images to fetch");
        return;
    }

    useCreateStore.getState().setContainsImages(true);
    const map = await RetrieveCardImages(id);
    for (const [, imageUrl] of Object.entries(map)) {
        preloadImage(imageUrl);
        console.log(imageUrl, "Loaded");
    }
    useCreateStore.getState().setCurrentSetImages(map);
};

// Delete Set
