import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY
    }
})

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "File is required." }, { status: 400 });
        }

        const { searchParams } = new URL(request.url);
        const setId = searchParams.get("setId");
        const cardId = searchParams.get("cardId");
        const fileType = searchParams.get("fileType");

        if (!setId || !cardId) {
            return NextResponse.json({ error: "Missing setId or cardId" }, { status: 400 });
        }

        const fileBuffer = Buffer.from(await file.arrayBuffer());

        const fileName = file.name

        const key = `${setId}/${cardId}/${fileType}/${fileName}`;

        console.log("KEY WHEN UPLOADING:", key);

        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
            Key: key,
            Body: fileBuffer,
            ContentType: file.type
        };

        const command = new PutObjectCommand(params);
        await s3Client.send(command);

        return NextResponse.json({ 
            success: true, 
            key: key, 
            fileType: fileType,
            fileName: fileName
        });

    } catch(error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Error uploading file" }, { status: 500 });
    }
}