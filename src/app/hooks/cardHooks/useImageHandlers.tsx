import { useCreateStore } from "@/app/stores/createStores";
import { updateSetImagesMap } from "./useSetHandlers"


function generateUniqueFilename() {
    const timestamp = Date.now().toString(16);
    const randomHex = Math.floor(Math.random() * 0xffff).toString(16).padStart(4, '0');
    return `img_${timestamp}_${randomHex}.png`;
}

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
export const handleImageUpdate = async (previousFileName: string, fileName: string, cardId: number) => {
    const originalFile = useCreateStore.getState().originalFile

    if (originalFile && previousFileName) {
        await handleImageDelete(cardId, fileName);
        
        const formData = new FormData();
        formData.append("file", originalFile);
        
        await handleImageUpload(cardId)
    }
}


export const handleImageUrlInput = async (e) => {
    const currentCardData = useCreateStore.getState().currentCardData

    const inputtedUrl = e.target.value;
    const uniqueName = generateUniqueFilename()

    try {
        const res = await fetch(inputtedUrl, { mode: 'cors' });
        const blob = await res.blob();

        if (!blob.type.startsWith('image/')) {
            throw new Error(`Invalid image type: ${blob.type}`);
        }
        
        const fileFromUrl = new File([blob], uniqueName, { type: blob.type })

        useCreateStore.getState().setOriginalFile(fileFromUrl)
        useCreateStore.getState().setCurrentSelectedImage(URL.createObjectURL(blob));
        console.log(uniqueName)
        useCreateStore.getState().setCurrentCardData({
            ...currentCardData,
            fileName: uniqueName,
        });

    } catch(error) {
        console.log("Image Url Input Error:", error)
    }
};


export const handleFileChange = (e) => {
    const currentCardData = useCreateStore.getState().currentCardData
    
    const selectedImage = e.target.files[0]
    if (selectedImage) {
        useCreateStore.getState().setOriginalFile(selectedImage)
        const imageURL = URL.createObjectURL(selectedImage);
        useCreateStore.getState().setOriginalImageUrl(imageURL)
        useCreateStore.getState().setCurrentSelectedImage(imageURL)
        useCreateStore.getState().setCurrentCardData({
            ...currentCardData,
            fileName: selectedImage.name,
        });
    }
};


export const clearCurrentImage = () => {
    const currentCardData = useCreateStore.getState().currentCardData

    useCreateStore.getState().setCurrentSelectedImage(null);
    useCreateStore.getState().setOriginalFile(null);
    useCreateStore.getState().setCroppedFile(null);

    useCreateStore.getState().setCurrentSetImages(prevImages => {
        const updated = { ...prevImages };
        delete updated[currentCardData[1]];
        return updated;
    });
};