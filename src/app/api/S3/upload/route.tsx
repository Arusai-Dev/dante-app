// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY
    }
})

const MAX_FILE_SIZE = 10 * 1024 * 1024  // 10MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get("file") as File
        const setId = formData.get("setId") as string
        const cardId = formData.get("cardId") as string

        if (!file || !setId || !cardId) {
            return NextResponse.json(
                { error: "Missing required fields" }, 
                { status: 400 }
            )
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File too large (max 10MB)" }, 
                { status: 400 }
            )
        }

        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type" }, 
                { status: 400 }
            )
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const timestamp = Date.now()
        const key = `${setId}/${cardId}/${timestamp}-${file.name}`

        await s3Client.send(new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: key,
            Body: buffer,
            ContentType: file.type
        }))

        const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${key}`

        return NextResponse.json({ url, key })

    } catch (error) {
        console.error("S3 upload failed:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Upload failed" }, 
            { status: 500 }
        )
    }
}