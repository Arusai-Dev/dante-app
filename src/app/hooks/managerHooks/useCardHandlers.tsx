import { addOneCardToSet, deleteCardById, getSetById, updateCardCount, updateCardData } from "@/lib/dbFunctions"
import { handleImageDelete, handleImageUpdate, handleImageUpload } from "./useImageHandlers"
import { updateCurrentSet, updateSetImagesMap } from "./useSetHandlers"
import { useCreateStore } from "@/app/stores/createStores";
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


// addCard
export const handleAddCard = async () => {
    const { category, front, back } = useCreateStore.getState().currentCardData;

    const currentSet = useCreateStore.getState().currentSet;

    console.log("CroppedImageUrl:", useCreateStore.getState().croppedImageUrl)
    useCreateStore.getState().setCroppedFile(await convertUrlToFile(useCreateStore.getState().croppedImageUrl, "cropped"))

    const originalFileName = useCreateStore.getState().originalFile.name
    const croppedFileName = useCreateStore.getState().croppedFile.name

    console.log("originalFileName:", originalFileName)
    console.log("croppedFileName:", croppedFileName)

    const currentSetId = currentSet?.id
    if (!currentSetId) {
        console.warn("No set selected.");
        return;
    }
    
    await updateCurrentSet(currentSetId)        


    const cardId = generateUniqueCardId(currentSet.cards.map(card => card.cardId))

    fetchAllData()
    await addOneCardToSet(
        currentSetId,
        cardId,
        category, 
        front, 
        back, 
        originalFileName,
        croppedFileName,
    );

    const updatedSet = await getSetById(currentSetId);
    useCreateStore.getState().setCurrentSet(updatedSet[0])

    await updateCardCount(currentSetId, updatedSet[0].cards.length)
    await updateCurrentSet(currentSetId)
    await handleImageUpload(cardId)
    useCreateStore.getState().clearCurrentCardData()
    useCreateStore.getState().setCurrentSelectedImageUrl("")
};   

// deleteCard
export const handleCardDelete = async (setId: number, cardId: number, fileName: string) => {
    await deleteCardById(setId, cardId)
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

    useCreateStore.getState().setUpdatingCard(false);
    useCreateStore.getState().setActive("manage");
    useCreateStore.getState().clearCurrentCardData();
    useCreateStore.getState().setPreviousFile(null);
};
