import { NextRequest, NextResponse } from "next/server";
import { getProvider } from "@/services/cards/providers";
import { tcgapiOnePiece } from "@/services/cards/providers/tcgapi";
import { ProviderError } from "@/services/cards/normalise";
import { POKEMON_LANGUAGES } from "@/services/cards/types";

const GAMES = ["pokemon", "one-piece", "sports"] as const;

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams,
    game = sp.get("game"),
    language = sp.get("language") ?? "en";
  if (!GAMES.includes(game as (typeof GAMES)[number]))
    return NextResponse.json({ error: "Unknown game." }, { status: 400 });
  if (game === "pokemon" && !POKEMON_LANGUAGES.some((x) => x.code === language))
    return NextResponse.json(
      { error: "Unsupported Pokémon language." },
      { status: 400 },
    );
  try {
    const provider = game === "one-piece" ? tcgapiOnePiece : getProvider(game as (typeof GAMES)[number]);
    const sets = await provider.getSets(language, req.signal);
    return NextResponse.json(
      { sets },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=86400, stale-while-revalidate=604800",
        },
      },
    );
  } catch (e) {
    if ((e as Error).name === "AbortError")
      return new NextResponse(null, { status: 499 });
    const code = e instanceof ProviderError ? e.code : "unavailable";
    return NextResponse.json(
      { error: "We couldn't load sets right now. Please try again.", code },
      { status: code === "malformed" ? 502 : 503 },
    );
  }
}
