import { NextResponse } from "next/server";
import { getProvider } from "@/services/cards/providers";
import { ProviderError } from "@/services/cards/normalise";
import { POKEMON_LANGUAGES } from "@/services/cards/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ game: string; id: string }> },
) {
  const { game, id } = await params;
  if (game !== "pokemon" && game !== "one-piece" && game !== "sports")
    return NextResponse.json({ error: "Unknown game." }, { status: 400 });
  const language = new URL(req.url).searchParams.get("language") ?? "en";
  if (game === "pokemon" && !POKEMON_LANGUAGES.some((x) => x.code === language))
    return NextResponse.json(
      { error: "Unsupported Pokémon language." },
      { status: 400 },
    );
  try {
    const card = await getProvider(game).getCard(
      decodeURIComponent(id),
      req.signal,
      language,
    );
    return card
      ? NextResponse.json(card, {
          headers: { "Cache-Control": "public, s-maxage=86400" },
        })
      : NextResponse.json({ error: "Card not found." }, { status: 404 });
  } catch (e) {
    if ((e as Error).name === "AbortError")
      return new NextResponse(null, { status: 499 });
    return NextResponse.json(
      {
        error: "We couldn't load that card right now.",
        code: e instanceof ProviderError ? e.code : "unavailable",
      },
      { status: 503 },
    );
  }
}
