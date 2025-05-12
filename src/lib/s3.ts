import { deleteImageFromDatabase } from "@/app/lib/databaseFunction";
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, Type } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME
const bucketRegion = process.env.NEXT_PUBLIC_BUCKET_REGION
const accessKeyId = process.env.NEXT_PUBLIC_ACCESS_KEY
const secretAccessKey = process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY

const client = new S3Client({
    region: bucketRegion,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
});


export async function s3Upload(fileBuffer: any, fileName: any, fileType: any) {
    const uploadParams = {
      Bucket: bucketName, 
      Body: fileBuffer,
      Key: fileName,
      ContentType: fileType
    };

    return client.send(new PutObjectCommand(uploadParams))
};

export async function getUrl(fileName: any) {

    const url = getSignedUrl({
        url: fileName,
        dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
        privateKey: process.env.NEXT_PUBLIC_CLOUDFRONT_PRIVATE_KEY,
        keyPairId: process.env.NEXT_PUBLIC_CLOUDFRONT_KEY_PAR_ID
    })

    return url
}
