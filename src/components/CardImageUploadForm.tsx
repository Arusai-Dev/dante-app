"use client"

import { useState } from "react";

export default function CardImageUploadForm() {
    const [file, setFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setFile(e.target.files[0])
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return;

        setIsUploading(true)
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("api/s3-upload", {
                method: "POST",
                body: formData,
            })

            const data = await response.json()
            console.log(data.status)
            setIsUploading(false)
        } catch(error) {
            console.log(error)
            setIsUploading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="pb-4 ">
            <label htmlFor="imageFile" className="text-sm text-[#d8c5a5] cursor-pointer block mb-2">
                <input
                    id="imageFile"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="cursor-pointer"
                />
            </label>

            <button
                type="submit"
                disabled={!file || isUploading}
                className={`w-full text-white text-sm font-medium h-10 rounded-md px-4 bg-[#D9D9D9]/3`}
            >
                {isUploading ? "Uploading..." : "Upload Image"}
            </button>
        </form>
    )
}