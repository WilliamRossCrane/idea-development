import { NextResponse } from "next/server";
import { getProvider } from "@/services/cards/providers";
import { ProviderError } from "@/services/cards/normalise";
import { addAudEstimates } from "@/services/cards/pricing";
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
    const details = await getProvider(game).getCard(
      decodeURIComponent(id),
      req.signal,
      language,
    );
    return details
      ? NextResponse.json(
          { card: details.card, prices: await addAudEstimates(details.prices) },
          {
            headers: { "Cache-Control": "public, s-maxage=86400" },
          },
        )
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
