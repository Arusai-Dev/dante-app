import { useCreateStore } from "@/app/stores/createStores";
import { getSetById } from "@/lib/dbFunctions";
import { preloadImage, RetrieveSetImages } from "@/lib/image";


// Add Set

// Update Set Data
export const updateCurrentSet = async (id: number) => {
    const updatedSet = await getSetById(id)
    useCreateStore.getState().setCurrentSet(updatedSet[0])
}

// Update Set Images
export const updateSetImagesMap = async (id: number) => {
    const set = await getSetById(id)
    // console.log("HELP:",set[0]?.cards)
    const cardsWithImages = set[0]?.cards.filter((card: { fileName: string; }) => card.fileName && card.fileName.trim() !== "")
    if (!cardsWithImages) return
    
    if (cardsWithImages.length === 0) {
        useCreateStore.getState().setContainsImages(false)
        console.log("No images to fetch")
        return
    }
    useCreateStore.getState().setContainsImages(true)
    const map = await RetrieveSetImages(id)
    for (const [, imageUrl] of Object.entries(map)) {
        preloadImage(imageUrl)
    }
    useCreateStore.getState().setCurrentSetImages(map)

    console.log(useCreateStore.getState().currentSetImages)
};

// Delete Set
