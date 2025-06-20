import { addOneCardToSet, deleteCardById, getSetById, updateCardCount, updateCardData } from "@/lib/dbFunctions"
import { handleImageDelete, handleImageUpdate, handleImageUpload } from "./useImageHandlers"
import { updateCurrentSet, updateSetImagesMap } from "./useSetHandlers"
import { useCreateStore } from "@/app/stores/createStores";



// addCard
export const handleAddCard = async () => {
    const { category, front, back } = useCreateStore.getState().currentCardData;
    const currentSet = useCreateStore.getState().currentSet;
    const file = useCreateStore.getState().file;
    
    const clearCurrentCardData = () => {
        useCreateStore.getState().clearCurrentCardData()
        useCreateStore.getState().setCurrentSelectedImage("")
    }

    const currentSetId = currentSet?.id
    if (!currentSetId) {
        console.warn("No set selected.");
        return;
    }
    await updateCurrentSet(currentSetId)        
    console.log("Current Set Id:", currentSetId)

    const fileName = file == null ? "" : file.name;
    console.log("Current File:", file)
    
    const generateUniqueCardId = (existingIds: number[], max = 100000): number => {
        let cardId;
        const usedIds = new Set(existingIds);
    
        do {
            cardId = Math.floor(Math.random() * max) + 1;
        } while (usedIds.has(cardId));
    
        return cardId;
    }

    const cardId = generateUniqueCardId(currentSet.cards.map(card => card.cardId))

    clearCurrentCardData()

    const temp = await addOneCardToSet(
        currentSetId,
        cardId,
        category, 
        front, 
        back, 
        fileName,
    );

    console.log("SQL RETURN: ", temp)
    
    const updatedSet = await getSetById(currentSetId);
    useCreateStore.getState().setCurrentSet(updatedSet[0])

    await updateCardCount(currentSetId, updatedSet[0].cards.length)
    await updateCurrentSet(currentSetId)
    await handleImageUpload({cardId, fileName})
};   

// deleteCard
export const handleCardDelete = async (setId: number, cardId: number, fileName: string) => {
    await deleteCardById(setId, cardId)
    const key = `${setId}/${cardId}/${fileName}`
    
    console.log("KEY WHEN DELETING FULL CARD:", key)

    handleImageDelete({cardId, fileName})
    await updateCurrentSet(setId)
}

type handleUpdateCardProps = {
    setId: number,
    cardId: number,
    category: string,
    front: string,
    back: string,
    fileName: string,
    previousFileName: string,
}

// updateCard
export const handleUpdateCard = async ({
    setId,
    cardId,
    category,
    front,
    back,
    fileName,
    previousFileName
}: handleUpdateCardProps) => {

    handleImageUpdate({previousFileName, fileName, cardId})
    await updateCardData(setId, cardId, category, front, back, fileName)
    await updateSetImagesMap(setId)
    useCreateStore.getState().setUpdatingCard(false)
    useCreateStore.getState().setActive("manage")
    useCreateStore.getState().clearCurrentCardData()
    useCreateStore.getState().setPreviousFile(null)
    await updateCurrentSet(setId)
};
