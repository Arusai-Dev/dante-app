import { addOneCardToSet, deleteCardById, getSetById, updateCardCount, updateCardData } from "@/lib/dbFunctions"
import { handleImageDelete, handleImageUpdate, handleImageUpload } from "./useImageHandlers"
import { updateCurrentSet, updateSetImagesMap } from "./useSetHandlers"
import { useManagerNonPersistentStore, useManagerPersistentStore } from "@/app/stores/managerStores";
import { generateUniqueCardId } from "@/lib/card/card";
import { fetchAllData } from "@/app/flashcards/manager/page";

export const convertUrlToFile = async (url: string, baseName: string) => {
    console.log("Url to be converted:", url)
    const res = await fetch(url);
    const blob = await res.blob();
    
    if (!blob.type.startsWith("image/")) {
        throw new Error(`Invalid image type: ${blob.type}`)
    }
    
    const newFile = new File([blob], baseName, { type: blob.type });
    
    console.log("Converted Url To File:", newFile);
    return newFile;
}


export const handleAddCard = async () => {
    const state = useManagerPersistentStore.getState();
    const { category, front, back } = state.currentCardData;
    const currentSet = state.currentSet;
    const currentSetId = currentSet?.id;
    const fileName = state.originalFile.name

    if (!currentSetId) {
        console.warn("No set selected.");
        return;
    }

    try {
        const existingCardIds = currentSet?.cards?.map(card => card.cardId) || [];
        const cardId = generateUniqueCardId(existingCardIds);
        
        await addOneCardToSet(
            currentSetId,
            cardId,
            category, 
            front, 
            back, 
            fileName,
        );

        await handleImageUpload(cardId);

        const updatedSet = await getSetById(currentSetId);
        state.setCurrentSet(updatedSet[0]);

        await updateCardCount(currentSetId, updatedSet[0].cards.length);

        await fetchAllData();
        await updateCurrentSet(currentSetId);

        state.clearCurrentCardData();
        state.setCurrentSelectedImageUrl("");

        console.log("Card added successfully with ID:", cardId);

    } catch (error) {
        console.error("Error adding card:", error);
    }
};

// deleteCard
export const handleCardDelete = async (setId: number, cardId: number, fileName: string) => {
    useManagerNonPersistentStore.getState().setLoading(true)
    console.log("setId:", setId, "cardId:",  cardId)
    await deleteCardById(setId, cardId)

    if (fileName == "") return

    await handleImageDelete(cardId, fileName, "original")
    await handleImageDelete(cardId, fileName, "cropped")
    await updateCurrentSet(setId)
}

export const handleUpdateCard = async (currentCardData: {setId: number, cardId: number, category: string, front: string, back: string, fileName: string}, previousFileName: string) => {
    const { setId, cardId, category, front, back, fileName } = currentCardData;
    
    await handleImageUpdate(previousFileName, cardId);
    await updateCardData(setId, cardId, category, front, back, fileName);
    await updateSetImagesMap(setId);
    await updateCurrentSet(setId);
    useManagerPersistentStore.getState().setUpdatingCard(false);
    useManagerNonPersistentStore.getState().setActive("manage");
    useManagerPersistentStore.getState().clearCurrentCardData();
    useManagerPersistentStore.getState().setPreviousFile(null);
};