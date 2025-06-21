import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')

    if (!url) return NextResponse.json({ error: "No URL provided." })

    const res = await fetch(url)
    const buffer = await res.arrayBuffer()

    return new Response(buffer, {
        status: 200,
        headers: {
            'Content-Type': res.headers.get('content-type') || 'image/jpeg',
            'Access-Control-Allow-Origin': '*',
        }
    })
}