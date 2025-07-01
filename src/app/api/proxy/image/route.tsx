import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const url = searchParams.get('url')
    console.log("Proxy Fetch Url:", url)

    if (!url) return NextResponse.json({ error: "No URL provided." })

        
    try {
        const res = await fetch(url)
        if (!res.ok) {
            return NextResponse.json({ error: "Failed to fetch image."}, { status: res.status})
        }

        const contentType = res.headers.get("content-type") || "application/octect-stream"
        const body = await res.arrayBuffer()

        return new Response(body, {
            status: 200,
            headers: {
                "Content-Type": contentType,
                "Content-Lenght": body.byteLength.toString(),
                "Cache-Control": "public, max-age:86400",
                "Acess-Control-Allow-Origin": "*",
            }
        })
    } catch (err) {
        console.error("Proxy fetch failed:", err)
        return NextResponse.json({ error: "Proxy Error..."})
    }
}