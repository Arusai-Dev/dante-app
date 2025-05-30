import { S3Client, GetObjectCommand, S3 } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { imageConfigDefault } from "next/dist/shared/lib/image-config";

const s3Client = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_S3_SECRET_ACCESS_KEY
    }
})

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const setId = searchParams.get("setId")
    const cardId = searchParams.get("cardID")
    const imageName = searchParams.get("imageName")

    const key = `${setId}/${cardId}/${imageName}`

    const command = new GetObjectCommand({
        Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
        Key: key
    })

    const signedUrl = await getSignedUrl(s3Client, command, {expiresIn: 60})
    return Response.json({ url: signedUrl })
}