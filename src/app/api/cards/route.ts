import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/services/cards/providers";
import { ProviderError } from "@/services/cards/normalise";
import { POKEMON_LANGUAGES } from "@/services/cards/types";

const GAMES = ["pokemon", "one-piece", "sports"] as const;

// GET /api/cards?game=pokemon&q=pika&rarity=Rare&setId=swsh3&page=1&pageSize=24
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams,
    game = sp.get("game");
  if (!GAMES.includes(game as any))
    return NextResponse.json({ error: "Unknown game." }, { status: 400 });
  const language = sp.get("language") ?? "en";
  if (game === "pokemon" && !POKEMON_LANGUAGES.some((x) => x.code === language))
    return NextResponse.json(
      { error: "Unsupported Pokémon language." },
      { status: 400 },
    );
  try {
    const result = await getProvider(
      game as (typeof GAMES)[number],
    ).searchCards(
      {
        q: sp.get("q") ?? undefined,
        setId: sp.get("setId") ?? undefined,
        rarity: sp.get("rarity") ?? undefined,
        language,
        page: Math.max(1, Number(sp.get("page")) || 1),
        pageSize: Math.min(60, Number(sp.get("pageSize")) || 24),
      },
      req.signal,
    );
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (e) {
    if ((e as Error).name === "AbortError")
      return new NextResponse(null, { status: 499 });
    const code = e instanceof ProviderError ? e.code : "unavailable";
    // Friendly message only; details stay server-side.
    return NextResponse.json(
      { error: "We couldn't load cards right now. Please try again.", code },
      { status: code === "malformed" ? 502 : 503 },
    );
  }
}
