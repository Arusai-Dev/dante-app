import {
    DeleteObjectCommand, 
    S3Client, 
} from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY
    }
})

export async function DELETE(request) {
    const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")

    try {
        await s3Client.send(
            new DeleteObjectCommand({
                Bucket: bucketName,
                Key: key,
            }),
        )

        return NextResponse.json({"status:": 200})
    } catch(error) {
        console.error('error: ', error)
        return NextResponse.json({"status:": 500})
    }
}