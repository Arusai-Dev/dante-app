import { addOneCardToSet, deleteCardById, getSetById, updateCardCount, updateCardData } from "@/lib/dbFunctions"
import { handleImageDelete, handleImageUpdate, handleImageUpload } from "./useImageHandlers"
import { updateCurrentSet, updateSetImagesMap } from "./useSetHandlers"
import { useManagerStore } from "@/app/stores/managerStores";
import { generateUniqueCardId } from "@/lib/card/card";
import { fetchAllData } from "@/app/flashcards/manager/page";


function getExtensionFromMime(mime: string): string {
    const map: Record<string, string> = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
        'image/gif': 'gif',
        'image/svg+xml': 'svg',
        'image/bmp': 'bmp',
    };
    return map[mime] || 'bin';
}


export const convertUrlToFile = async (url: string, baseName: string) => {
    console.log("Url to be converted:", url)
    const res = await fetch(url);
    const blob = await res.blob();

    if (!blob.type.startsWith("image/")) {
        throw new Error(`Invalid image type: ${blob.type}`)
    }
    
    const ext = getExtensionFromMime(blob.type)
    const fileName = `${baseName}.${ext}`
    const newFile = new File([blob], fileName, { type: blob.type })
    console.log("Converted Url To File:", newFile)
    return newFile
}


export const handleAddCard = async () => {
    const state = useManagerStore.getState();
    const { category, front, back } = state.currentCardData;
    const currentSet = state.currentSet;
    const currentSetId = currentSet?.id;
    const croppedFileName = state.croppedFile?.name;

    if (!currentSetId) {
        console.warn("No set selected.");
        return;
    }

    try {
        let originalFileName = "";

        if (state.originalFile) {
            originalFileName = state.originalFile.name;
        }

        // if (state.croppedImageUrl && state.croppedImageUrl.trim() !== "") {
        //     if (!state.croppedFile) {
        //         const croppedFile = await convertUrlToFile(state.croppedImageUrl, "cropped");
        //         state.setCroppedFile(croppedFile);
        //     }
        //     croppedFileName = "cropped_" + state.croppedFile.name;
        // }

        console.log("originalFileName:", originalFileName);
        console.log("croppedFileName:", croppedFileName);

        const existingCardIds = currentSet?.cards?.map(card => card.cardId) || [];
        const cardId = generateUniqueCardId(existingCardIds);
        
        await addOneCardToSet(
            currentSetId,
            cardId,
            category, 
            front, 
            back, 
            originalFileName,
            croppedFileName,
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
    useManagerStore.getState().setLoading(true)
    console.log("setId:", setId, "cardId:",  cardId)
    await deleteCardById(setId, cardId)

    if (fileName == "") return

    const key = `${setId}/${cardId}/${fileName}`
    console.log("Key when deleting card:", key)
    handleImageDelete(cardId, fileName)
    await updateCurrentSet(setId)
}

export const handleUpdateCard = async ({
    setId,
    cardId,
    category,
    front,
    back,
    originalFileName,
    croppedFileName,
    previousOriginalFileName,
    previousCroppedFileName,
}: {
    setId: number,
    cardId: number,
    category: string,
    front: string,
    back: string,
    originalFileName: string,
    croppedFileName: string,
    previousOriginalFileName: string,
    previousCroppedFileName: string,
}) => {
    await handleImageUpdate(previousOriginalFileName, previousCroppedFileName, cardId);

    await updateCardData(setId, cardId, category, front, back, originalFileName, croppedFileName);

    await updateSetImagesMap(setId);
    await updateCurrentSet(setId);

    useManagerStore.getState().setUpdatingCard(false);
    useManagerStore.getState().setActive("manage");
    useManagerStore.getState().clearCurrentCardData();
    useManagerStore.getState().setPreviousFile(null);
};
