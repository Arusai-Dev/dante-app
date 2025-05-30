import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY
    }
})


async function uploadFileToS3(file, fileName, setId, cardId) {
    const key = `${setId}/${cardId}/${fileName}`

    const fileBuffer = file;

    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: file.type
    }

    const command = new PutObjectCommand(params)
    await s3Client.send(command)
    return fileName;
}


export async function POST(request) {

    try {
        const formData = await request.formData();
        const file = formData.get("file")

        if (!file) {
            return NextResponse.json({ error: "File is required." }, { status: 400 })
        }

        const { searchParams } = new URL(request.url);
        const setId = searchParams.get("setID");
        const cardId = searchParams.get("cardID");

        if (!setId || !cardId) {
            return NextResponse.json({ error: "Missing setID or cardID" }, { status: 400 } )
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const s3Key = await uploadFileToS3(buffer, file.name, setId, cardId);

        return NextResponse.json({ success: true, key: s3Key })
    } catch(error) {
        console.error("Upload error:", error)
        return NextResponse.json({ error: "Error uploading file" })
    }
}