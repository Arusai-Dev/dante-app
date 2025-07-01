import { useCreateStore } from "@/app/stores/createStores";
import { updateSetImagesMap } from "./useSetHandlers"
import { convertUrlToFile } from "./useCardHandlers";


// TODO:
// 1. *When the user adds an image ie. fileChange: save that file to originalFile & originalFileUrl so we can store the original
// 2. *If the user decides to crop the image we have to save the croppedImageUrl and convert it to a file then save croppedFile  
// 3. When user presses addCard both cropped and original are uploaded to S3
// 4. The fileName that is given for addCard is croppedFile.name
// 5. On ImageRetrieval fetch both imgs
// 6. Show croppedImg on all img sections
// 7. When card is being edited and cropped button is pressed show originalImageUrl to allow re-cropping


// Upload
export const handleImageUpload = async (cardId: number) => {
    const originalFile = await useCreateStore.getState().originalFile
    const croppedFile = await useCreateStore.getState().croppedFile
    const setId = useCreateStore.getState().currentSet.id

    if (originalFile) {
        const formData = new FormData();
        formData.append("file", originalFile);

        try {
            const response = await fetch(`/api/S3/upload?setId=${setId}&cardId=${cardId}`, {
                method: "POST",
                body: formData,
            })

            const data = await response.json()
            console.log("Image Upload Data:", data)
        } catch(error) {
            console.log("Image Upload Error:", error)
        }

        updateSetImagesMap(setId)
        clearCurrentImage()
    }
    
    if (croppedFile) {
        const formData = new FormData();
        formData.append("file", croppedFile);

        try {
            const response = await fetch(`/api/S3/upload?setId=${setId}&cardId=${cardId}`, {
                method: "POST",
                body: formData,
            })

            const data = await response.json()
            console.log("Image Upload Data:", data)
        } catch(error) {
            console.log("Image Upload Error:", error)
        }

        updateSetImagesMap(setId)
        clearCurrentImage()
    }
}


// Delete
export const handleImageDelete = async (cardId: number, fileName: string) => {
    const setId = useCreateStore.getState().currentSet.id

    console.log("Deleting given image...")
    const key = `${setId}/${cardId}/${fileName}`;
    
    try {
        const response = await fetch(`/api/S3/delete?key=${key}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", "Access-Control-Allow-Methods": "*", "Access-Control-Allow-Origin": "*" }
        })
        
        const data = await response.json()
        console.log("Image Delete Data:", data)
    } catch(error) {
        console.log("Image Delete Error:", error)
    }
};


// Update
export const handleImageUpdate = async (
    previousOriginalFileName: string, 
    previousCroppedFileName: string, 
    cardId: number
) => {
    if (previousOriginalFileName)
        await handleImageDelete(cardId, previousOriginalFileName)

    if (previousCroppedFileName)
        await handleImageDelete(cardId, previousCroppedFileName)

    handleImageUpload(cardId)
}


export const handleImageUrlInput = async (e) => {
    const inputtedUrl = e.target.value;

    try {
        
        const fileFromUrl = await convertUrlToFile(inputtedUrl, "original")

        useCreateStore.getState().setOriginalFile(fileFromUrl)
        useCreateStore.getState().setOriginalImageUrl(inputtedUrl)
        useCreateStore.getState().setCurrentSelectedImageUrl(useCreateStore.getState().originalImageUrl);

    } catch(error) {
        console.log("Image Url Input Error:", error)
    }
};


// Save original file data to allow recropping in the future
export const handleFileChange = (e) => {
    const selectedImage = e.target.files[0]
    console.log(selectedImage)
    if (selectedImage) {
        useCreateStore.getState().setOriginalFile(selectedImage)
        const imageURL = URL.createObjectURL(selectedImage);
        console.log("imageURL:",imageURL)
        useCreateStore.getState().setCurrentSelectedImageUrl(imageURL)

        useCreateStore.getState().setCroppedFile(null);
        useCreateStore.getState().setCroppedImageUrl("");
        useCreateStore.getState().setOriginalImageUrl("");

    }
};


export const clearCurrentImage = () => {
    const currentCardData = useCreateStore.getState().currentCardData

    useCreateStore.getState().setCurrentSelectedImageUrl("");
    useCreateStore.getState().setOriginalFile(null);
    useCreateStore.getState().setCroppedFile(null);
    useCreateStore.getState().setCroppedImageUrl("");
    useCreateStore.getState().setOriginalImageUrl("");

    useCreateStore.getState().setCurrentSetImages(prevImages => {
        const updated = { ...prevImages };
        delete updated[currentCardData[1]];
        return updated;
    });
};