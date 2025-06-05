import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY!
    }
});

export async function updateFileInS3(contentType: string, fileBuffer: Buffer, key: string) {
    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME!,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType
    };

    try {
        const command = new PutObjectCommand(params);
        await s3Client.send(command);
        return key;
    } catch (error) {
        console.error("S3 upload error:", error);
        throw new Error("Failed to upload file to S3");
    }
}
