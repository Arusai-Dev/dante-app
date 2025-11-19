import { addOneCardToSet, deleteCardById, getSetById, updateCardCount, updateCardData } from "@/lib/dbFunctions"
import { updateCurrentSet } from "./useSetHandlers"
import { useManagerNonPersistentStore, useManagerPersistentStore } from "@/app/stores/managerStores";
import { generateUniqueCardId } from "@/lib/card/card";
import { fetchAllData } from "@/app/flashcards/manager/page";

export const handleAddCard = async () => {
    const state = useManagerPersistentStore.getState();
    const { category, front, back } = state.currentCardData;
    const currentSet = state.currentSet;
    const currentSetId = currentSet?.id;

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
        );


        const updatedSet = await getSetById(currentSetId);
        state.setCurrentSet(updatedSet[0]);

        await updateCardCount(currentSetId, updatedSet[0].cards.length);

        await fetchAllData();
        await updateCurrentSet(currentSetId);

        state.clearCurrentCardData();

        console.log("Card added successfully with ID:", cardId);

    } catch (error) {
        console.error("Error adding card:", error);
    }
};

// deleteCard
export const handleCardDelete = async (setId: number, cardId: number) => {
    console.log("setId:", setId, "cardId:",  cardId)
    await deleteCardById(setId, cardId)

    await updateCurrentSet(setId)
}

export const handleUpdateCard = async (currentCardData: {setId: number, cardId: number, category: string, front: string, back: string}) => {
    const { setId, cardId, category, front, back } = currentCardData;
    
    await updateCardData(setId, cardId, category, front, back);
    await updateCurrentSet(setId);
    useManagerPersistentStore.getState().setUpdatingCard(false);
    useManagerNonPersistentStore.getState().setActive("manage");
    useManagerPersistentStore.getState().clearCurrentCardData();
};