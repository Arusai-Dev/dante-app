"use client"

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from './functions/CropImageHelper' 
import * as Slider from "@radix-ui/react-slider";
import { useCreateStore } from '@/app/stores/createStores';

export default function ImageEditor() {
    const { 
        currentSelectedImage,
        setCurrentSelectedImage,
        imageCropUi,
        setImageCropUI,
        setFile,
    } = useCreateStore()

    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleCrop = async () => {
        const croppedImage = await getCroppedImg(currentSelectedImage, croppedAreaPixels)
        setImageCropUI(false)
        setFile(croppedImage)
        setCurrentSelectedImage(croppedImage)
    }

    return (
        <div>
            {imageCropUi && (
                <>
                    <div
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-0"
                        onClick={() => setImageCropUI(false)}
                    ></div>

                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="relative w-[300px] h-[300px] flex flex-col-reverse">
                            <Cropper
                                image={currentSelectedImage}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                                cropShape="rect"
                                showGrid={false}
                            />
                            <Slider.Root
                                className="relative flex h-5 touch-none select-none items-center"
                                value={[zoom * 100]}
                                min={100}
                                max={300}
                                step={1}
                                onValueChange={(value) => {
                                    let zoomValue = value[0] / 100
                                    if (zoomValue >= 1) {
                                        setZoom(zoomValue)
                                    } else {
                                        zoomValue = 1
                                        setZoom(zoomValue)
                                    }
                                }}
                            >
                                <Slider.Track className="relative h-[3px] grow rounded-full bg-blackA7">
                                    <Slider.Range className="absolute h-full rounded-full bg-white" />
                                </Slider.Track>
                                <Slider.Thumb
                                    className="block size-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-blackA4 hover:bg-violet3 focus:shadow-[0_0_0_5px] focus:shadow-blackA5 focus:outline-none"
                                    aria-label="Volume"
                                />
                            </Slider.Root>
                        </div>
                        <button onClick={handleCrop}>Crop</button>
                    </div>
                </>
            )}
        </div>
    )
}

async function urlToDataURL(url: string): Promise<string> {
  const res = await fetch(url, { mode: 'cors' });
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

