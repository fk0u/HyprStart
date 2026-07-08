import { NextRequest, NextResponse } from "next/server";

/**
 * Proxies Google Suggest (autocomplete) queries.
 * This avoids CORS issues that would block the browser from calling
 * Google's suggest endpoint directly.
 *
 * Usage: GET /api/suggest?q=your+query
 * Returns: string[] of suggestions
 */
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return NextResponse.json([]);
  }

  try {
    const googleUrl = `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}`;

    const res = await fetch(googleUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
      next: { revalidate: 0 }, // no caching
    });

    if (!res.ok) {
      return NextResponse.json([]);
    }

    // Google's response for client=firefox is: ["query", ["suggestion1", "suggestion2", ...]]
    const data = await res.json();
    const suggestions: string[] = Array.isArray(data[1]) ? data[1].slice(0, 8) : [];

    return NextResponse.json(suggestions);
  } catch {
    return NextResponse.json([]);
  }
}
