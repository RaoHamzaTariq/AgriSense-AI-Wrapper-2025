import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { data } = await request.json();
        const apiUrl = process.env.FASTAPI_BACKEND_URL;
        if (!apiUrl) {
            return NextResponse.json({ error: "API URL is not set" }, { status: 500 });
        }

        const toTitle = (v?: string) => typeof v === 'string' && v.length
            ? v.charAt(0).toUpperCase() + v.slice(1).toLowerCase()
            : v;

        // Conform exactly to FastAPI schema (enums are Title-case)
        const payload = {
            location: data?.location,
            soil_type: toTitle(data?.soilType), // Loamy | Sandy | Clay
            season: toTitle(data?.season),      // Summer | Winter | Monsoon
            duration: typeof data?.duration === 'string' ? parseInt(data.duration, 10) : data?.duration,
        } as const;

        const response = await fetch(`${apiUrl}/plan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            let message = `Failed to fetch AI plan (${response.status})`;
            try {
                const err = await response.json();
                if (err?.detail && Array.isArray(err.detail)) {
                    message = err.detail.map((d: { loc?: string[]; msg?: string }) => `${d?.loc?.join('.')}: ${d?.msg}`).join('; ');
                } else if (err?.message || err?.error) {
                    message = err.message || err.error;
                }
            } catch {}
            return NextResponse.json({ error: message }, { status: 500 });
        }
        const result = await response.json();
        console.log("result", result);
        return NextResponse.json({ data: result }, { status: 200 });
    } catch (e: unknown) {
        console.error("error", e);
        return NextResponse.json({ error: (e as Error).message || 'Unexpected error' }, { status: 500 });
    }
}