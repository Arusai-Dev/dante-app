"use client"

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from './functions/getCroppedImage' 
import { urlToDataURL } from './functions/UrlToDataUrl'
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
        const croppedImage = await getCroppedImg(currentSelectedImage, croppedAreaPixels);

        setImageCropUI(false);
        setCurrentSelectedImage(croppedImage);

        const res = await fetch(croppedImage);
        const blob = await res.blob();
        const file = new File([blob], "cropped.jpg", { type: "image/jpeg" });
        setFile(file);
    };

    return (
        <div>
            {imageCropUi && (
                <>
                    <div
                        className="absolute bg-black/3 backdrop-blur-sm z-40"
                        onClick={() => setImageCropUI(!imageCropUi)}
                    ></div>

                    <div className="fixed inset-0 flex items-center justify-center z-40">
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
                        <button className=' cursor-pointer hover-animation' onClick={handleCrop}>Crop</button>
                    </div>
                </>
            )}
        </div>
    )
}