import { NextResponse } from "next/server";
import { getProvider } from "@/services/cards/providers";
import { ProviderError } from "@/services/cards/normalise";

export async function GET(req: Request, { params }: { params: Promise<{ game: string; id: string }> }) {
  const { game, id } = await params;
  if (game !== "pokemon" && game !== "one-piece" && game !== "sports") return NextResponse.json({ error: "Unknown game." }, { status: 400 });
  try {
    const card = await getProvider(game).getCard(decodeURIComponent(id), req.signal);
    return card ? NextResponse.json(card, { headers: { "Cache-Control": "public, s-maxage=86400" } }) : NextResponse.json({ error: "Card not found." }, { status: 404 });
  } catch (e) {
    if ((e as Error).name === "AbortError") return new NextResponse(null, { status: 499 });
    return NextResponse.json({ error: "We couldn't load that card right now.", code: e instanceof ProviderError ? e.code : "unavailable" }, { status: 503 });
  }
}
