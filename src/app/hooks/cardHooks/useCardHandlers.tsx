import { addOneCardToSet, deleteCardById, getSetById, updateCardCount, updateCardData } from "@/lib/dbFunctions"
import { handleImageDelete, handleImageUpdate, handleImageUpload } from "./useImageHandlers"
import { updateCurrentSet, updateSetImagesMap } from "./useSetHandlers"
import { useCreateStore } from "@/app/stores/createStores";


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
    console.log("URLL !!  !! ! ! ! :", url)
    const res = await fetch(url);
    const blob = await res.blob();

    if (!blob.type.startsWith("image/")) {
        throw new Error(`Invalid image type: ${blob.type}`)
    }
    
    const ext = getExtensionFromMime(blob.type)
    const fileName = `${baseName}.${ext}`
    return new File([blob], fileName, { type: blob.type })
}

// addCard
export const handleAddCard = async () => {
    const { category, front, back } = useCreateStore.getState().currentCardData;
    const currentSet = useCreateStore.getState().currentSet;
    let file = useCreateStore.getState().croppedFile ? useCreateStore.getState().croppedFile : useCreateStore.getState().originalFile
    
    if (!useCreateStore.getState().croppedFile) {
        if (file instanceof File) {
            const newFile = new File([file], `original.${file.type.split('/')[1] || 'png'}`, { type: file.type })
            useCreateStore.getState().setOriginalFile(newFile)

        } else if (typeof file === 'string') {
            const newFile = await convertUrlToFile(file, "original")
            useCreateStore.getState().setOriginalFile(newFile)

        } else {
            console.error('Invalid file:', file)
        }
    }

    file = useCreateStore.getState().originalFile

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

    console.log("FILE:::", file)
    const fileName = file == null ? "" : file.name;

    const generateUniqueCardId = (existingIds: number[], max = 100000): number => {
        let cardId;
        const usedIds = new Set(existingIds);
    
        do {
            cardId = Math.floor(Math.random() * max) + 1;
        } while (usedIds.has(cardId));
    
        return cardId;
    }

    const cardId = generateUniqueCardId(currentSet.cards.map(card => card.cardId))


    console.log("FILENAME:", fileName)
    await addOneCardToSet(
        currentSetId,
        cardId,
        category, 
        front, 
        back, 
        fileName,
    );

    const updatedSet = await getSetById(currentSetId);
    useCreateStore.getState().setCurrentSet(updatedSet[0])

    await updateCardCount(currentSetId, updatedSet[0].cards.length)
    await updateCurrentSet(currentSetId)
    await handleImageUpload(cardId)
    clearCurrentCardData()
};   

// deleteCard
export const handleCardDelete = async (setId: number, cardId: number, fileName: string) => {
    await deleteCardById(setId, cardId)
    const key = `${setId}/${cardId}/${fileName}`
    
    console.log("Key when deleting card:", key)

    handleImageDelete(cardId, fileName)
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

    handleImageUpdate(previousFileName, fileName, cardId)
    await updateCardData(setId, cardId, category, front, back, fileName)
    await updateSetImagesMap(setId)
    useCreateStore.getState().setUpdatingCard(false)
    useCreateStore.getState().setActive("manage")
    useCreateStore.getState().clearCurrentCardData()
    useCreateStore.getState().setPreviousFile(null)
    await updateCurrentSet(setId)
};
