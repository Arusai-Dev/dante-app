/* eslint-disable @next/next/no-img-element */
import { useState, useRef } from 'react'
import ReactCrop, { Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { useManagerPersistentStore } from '@/app/stores/managerStores'

export default function ImageCropper() {
    const { originalImageUrl, setOriginalImageUrl, currentCard, setCurrentCard } = useManagerPersistentStore()
    const [crop, setCrop] = useState<Crop>()
    const [isUploading, setIsUploading] = useState(false)
    const originalFileRef = useRef<File | null>(null)  // keep File in ref, not state
    const imageRef = useRef<HTMLImageElement>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        originalFileRef.current = file
        const url = URL.createObjectURL(file)
        setOriginalImageUrl(url)
        setCrop(undefined)
    }

    const getCroppedBlob = async (): Promise<Blob | null> => {
        if (!crop || !imageRef.current || !originalFileRef.current) return null

        const canvas = document.createElement('canvas')
        const image = imageRef.current
        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        canvas.width = crop.width * scaleX
        canvas.height = crop.height * scaleY
        const ctx = canvas.getContext('2d')

        if (!ctx) return null

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        )

        return new Promise((resolve) => {
            canvas.toBlob(resolve, 'image/jpeg', 0.9)
        })
    }

    const handleSaveCrop = async () => {
        const blob = await getCroppedBlob()
        if (!blob) return

        setIsUploading(true)
        
        const formData = new FormData()
        formData.append('image', blob, 'cropped.jpg')

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            
            const { url } = await res.json() 
            
            if (currentCard) {
                setCurrentCard({ ...currentCard, imageUrl: url })
            }
            
            // Clear local state
            URL.revokeObjectURL(originalImageUrl!)
            setOriginalImageUrl(null)
            originalFileRef.current = null
            
        } catch (err) {
            console.error('Upload failed:', err)
        } finally {
            setIsUploading(false)
        }
    }

    const handleRecrop = () => {
        setCrop(undefined)
    }

    return (
        <div>
            <input type="file" accept="image/*" onChange={handleFileSelect} />
            
            {originalImageUrl && (
                <>
                    <ReactCrop crop={crop} onChange={setCrop}>
                        <img 
                            ref={imageRef}
                            src={originalImageUrl} 
                            alt="Original"
                        />
                    </ReactCrop>
                    
                    <button onClick={handleSaveCrop} disabled={isUploading}>
                        {isUploading ? 'Uploading...' : 'Save Crop'}
                    </button>
                    <button onClick={handleRecrop}>Reset Crop</button>
                </>
            )}
            
            {currentCard?.imageUrl && (
                <div>
                    <p>Saved image:</p>
                    <img src={currentCard.imageUrl} alt="Saved" />
                </div>
            )}
        </div>
    )
}