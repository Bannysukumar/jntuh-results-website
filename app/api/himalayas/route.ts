import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '20';
    const offset = searchParams.get('offset') || '0';

    try {
        const res = await fetch(`https://himalayas.app/jobs/api?limit=${limit}&offset=${offset}`, {
            headers: {
                'Accept': 'application/json',
            },
            next: { revalidate: 3600 } // Cache for 1 hour to prevent rate limiting
        });

        if (!res.ok) {
            return NextResponse.json({ error: 'Failed to fetch from Himalayas API' }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Error proxying Himalayas API:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
