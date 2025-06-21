import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

type ResData = {
    url: string
}

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY
    }
})

export async function GET(request): Promise<ResData> {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get("key")
    
    try {
        const command = new GetObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
            Key: key,
        })

        const url = await getSignedUrl(s3Client, command, {expiresIn: 3600})

        return new NextResponse(url)
    } catch (err) {
        console.error('Error fetching image from S3:', err)
        return new NextResponse('Error fetching image from S3.')
    }

}