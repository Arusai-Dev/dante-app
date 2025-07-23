import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";

const CLOUDFRONT_DOMAIN = process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");
  
  if (!key) {
    return new NextResponse('Missing key parameter', { status: 400 });
  }

  try {
    const cloudFrontUrl = `${CLOUDFRONT_DOMAIN}/${key}`;
    
    console.log("CloudFront URL:", cloudFrontUrl);
    return new NextResponse(cloudFrontUrl);
  } catch (err) {
    console.error('Error building CloudFront URL:', err);
    return new NextResponse('Error building image URL.', { status: 500 });
  }
}