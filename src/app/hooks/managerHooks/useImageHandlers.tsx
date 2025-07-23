import { useManagerPersistentStore } from "@/app/stores/managerStores";
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


export const handleImageUpload = async (cardId: number) => {
    const state = useManagerPersistentStore.getState();
    const originalFile = state.originalFile;
    const croppedFile = state.croppedFile;
    const setId = state.currentSet.id;

    if (!originalFile && !croppedFile) {
        console.warn("No files to upload");
        return;
    }

    const uploadFile = async (file: File, fileType: string) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileType", fileType);
        formData.append("originalFileName", originalFile.name);

        try {
            const response = await fetch(`/api/S3/upload?setId=${setId}&cardId=${cardId}`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log(`${fileType} Upload Data:`, data);
            return data;
        } catch (error) {
            console.error(`${fileType} Upload Error:`, error);
            throw error; 
        }
    };

    try {
        const uploadPromises = [];

        if (originalFile) {
            console.log(originalFile)
            uploadPromises.push(uploadFile(originalFile, "original"));
        }

        if (croppedFile) {
            uploadPromises.push(uploadFile(croppedFile, "cropped"));
        }

        const results = await Promise.all(uploadPromises);
        console.log("All uploads completed:", results);

        updateSetImagesMap(setId);
        clearCurrentImage();

    } catch (error) {
        console.error("Upload process failed:", error);
    }
};


// Delete
export const handleImageDelete = async (cardId: number, fileName: string) => {
    const setId = useManagerPersistentStore.getState().currentSet.id

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

    await handleImageUpload(cardId)
}


export const handleImageUrlInput = async (e) => {
    const inputtedUrl = e.target.value;

    if (!inputtedUrl || !inputtedUrl.trim()) {
        return; 
    }

    try {
        new URL(inputtedUrl);
    } catch {
        console.log("Invalid URL format");
        return;
    }

    try {
        const fileFromUrl = await convertUrlToFile(inputtedUrl, "original");
        const objectUrl = URL.createObjectURL(fileFromUrl);

        useManagerPersistentStore.getState().setOriginalFile(fileFromUrl);
        useManagerPersistentStore.getState().setOriginalImageUrl(objectUrl);
        useManagerPersistentStore.getState().setCurrentSelectedImageUrl(objectUrl);
        
        useManagerPersistentStore.getState().setCroppedFile(null);
        useManagerPersistentStore.getState().setCroppedImageUrl("");

    } catch(error) {
        console.log("Image Url Input Error:", error);
    }
};

export const handleFileChange = (e) => {
    const selectedImage = e.target.files[0];
    console.log("selectedImage:", selectedImage);
    
    if (selectedImage) {
        const imageURL = URL.createObjectURL(selectedImage);
        console.log("imageURL:", imageURL);
        
        useManagerPersistentStore.getState().setOriginalFile(selectedImage);
        useManagerPersistentStore.getState().setOriginalImageUrl(imageURL); 
        useManagerPersistentStore.getState().setCurrentSelectedImageUrl(imageURL);
        
        useManagerPersistentStore.getState().setCroppedFile(null);
        useManagerPersistentStore.getState().setCroppedImageUrl("");
    }
};


export const clearCurrentImage = () => {
    const state = useManagerPersistentStore.getState();
    const currentCardData = state.currentCardData;
    if (!currentCardData || !currentCardData[1]) {
        console.warn("No current card data to clear image from");
        return;
    }

    
    if (state.currentSelectedImageUrl && state.currentSelectedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.currentSelectedImageUrl);
    }
    if (state.originalImageUrl && state.originalImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.originalImageUrl);
    }
    if (state.croppedImageUrl && state.croppedImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(state.croppedImageUrl);
    }

    state.setCurrentSelectedImageUrl("");
    state.setOriginalFile(null);
    state.setCroppedFile(null);
    state.setCroppedImageUrl("");
    state.setOriginalImageUrl("");

    state.setCurrentSetImages(prevImages => {
        const updated = { ...prevImages };
        delete updated[currentCardData[1]];
        return updated;
    });
};