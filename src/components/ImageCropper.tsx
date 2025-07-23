"use client"

import { useState, useCallback, useEffect } from 'react'
import Cropper from 'react-easy-crop'
import * as Slider from "@radix-ui/react-slider";
import { useManagerPersistentStore } from '@/app/stores/managerStores';
import { getCroppedImg } from '@/lib/image';
import { convertUrlToFile } from '@/app/hooks/managerHooks/useCardHandlers';

export default function ImageEditor() {
    const { 
        currentSelectedImageUrl,
        setCurrentSelectedImageUrl,
        imageCropUi,
        setImageCropUI,
        originalFile,
        originalImageUrl,
        setOriginalImageUrl,
        setCroppedImageUrl,
        setCroppedFile,
        setOriginalFile,
    } = useManagerPersistentStore()

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((_: unknown, croppedAreaPixels: unknown) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleCrop = async () => {
        try {
            const sourceImageUrl = originalImageUrl || currentSelectedImageUrl;
            const croppedImageUrl = await getCroppedImg(sourceImageUrl, croppedAreaPixels);
            
            if (croppedImageUrl) {
                const originalFileName = originalFile?.name;
                const baseName = originalFileName;

                const croppedFile = await convertUrlToFile(croppedImageUrl, baseName);

                setCroppedImageUrl(croppedImageUrl);
                setCroppedFile(croppedFile);
                setCurrentSelectedImageUrl(croppedImageUrl);
                
                if (!originalFile && originalFile) {
                    setOriginalFile(originalFile);
                }
                
                if (!originalImageUrl) {
                    setOriginalImageUrl(currentSelectedImageUrl);
                }
                
                setImageCropUI(false);
            } else {
                console.error('Failed to generate cropped image');
                return;                
            }
        } catch (error) {
            console.error('Error during crop operation:', error);
        }
    };

    return (
        <div>
            {imageCropUi && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
                        onClick={() => setImageCropUI(false)}
                    />

                    <div className="fixed top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-8">
                        <div 
                            className="relative min-w-[300px] min-h-[300px] flex flex-col-reverse"
                            onClick={(e) => e.stopPropagation()} 
                        >
                            <div>
                                <Cropper
                                    image={originalImageUrl ? originalImageUrl : currentSelectedImageUrl}
                                    crop={crop}
                                    zoom={zoom}
                                    maxZoom={10}
                                    aspect={1}
                                    onCropChange={setCrop}
                                    onZoomChange={setZoom}
                                    onCropComplete={onCropComplete}
                                    cropShape="rect"
                                    // cropSize={{ width: 300, height: 300 }}
                                    showGrid={false}
                                    style={{
                                        containerStyle: {
                                            borderRadius: '10px',
                                            boxShadow: '0 0 20px rgba(0, 0, 0, 0.2)',
                                            backgroundColor: '#000', 
                                        },
                                        cropAreaStyle: {
                                            borderRadius: '10px',
                                            border: '2px solid white',
                                        },
                                        mediaStyle: {
                                            filter: 'brightness(0.9)',
                                            objectFit: 'cover',
                                        }
                                    }}
                                />
                            </div>
                            <div>
                                <Slider.Root
                                    className="relative top-5 bg-white flex h-6 w-full touch-none select-none items-center"
                                    value={[zoom * 100]}
                                    min={100}
                                    max={1000}
                                    step={1}
                                    onValueChange={(value) => {
                                        const zoomValue = Math.max(value[0] / 100, 1);
                                        setZoom(zoomValue);
                                    }}
                                >
                                    <Slider.Track className="relative h-[4px] w-full rounded-full bg-neutral-300 dark:bg-neutral-700">
                                        <Slider.Range className="absolute h-full rounded-full bg-black dark:bg-white transition-colors duration-200" />
                                    </Slider.Track>
                                    <Slider.Thumb
                                        className="block size-3 rounded-full bg-white dark:bg-neutral-100 border border-neutral-400 dark:border-neutral-600 shadow hover:scale-150 focus:ring-black transition-transform duration-150"
                                        aria-label="Zoom"
                                    />
                                </Slider.Root>
                            </div>
                        </div>
                        <button 
                            className="gap-2 justify-center cursor-pointer bg-[#D9D9D9] text-[#0F0F0F] items-center  h-[33px] md:h-[45px] py-1 px-3 font-bold text-[14px] md:text-xl rounded-[5px] hover-animation-secondary" 
                            onClick={handleCrop}
                        >Crop</button>
                    </div>
                </>
            )}
        </div>
    )
}