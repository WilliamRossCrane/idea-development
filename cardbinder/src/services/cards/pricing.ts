import type { AudPriceQuote, CardPriceQuote } from "./types";

interface FxResponse {
  ok: boolean;
  json(): Promise<{ date?: string; rates?: Record<string, number> }>;
}

export async function addAudEstimates(
  quotes: CardPriceQuote[],
): Promise<AudPriceQuote[]> {
  const currencies = [
    ...new Set(
      quotes
        .map((quote) => quote.currency)
        .filter((currency) => currency !== "AUD"),
    ),
  ];
  const rates = new Map<string, { rate: number; date: string }>();

  await Promise.all(
    currencies.map(async (currency) => {
      try {
        const response: FxResponse = await fetch(
          `https://api.frankfurter.dev/v1/latest?base=${encodeURIComponent(currency)}&symbols=AUD`,
          { next: { revalidate: 86400 } },
        );
        if (!response.ok) return;
        const data = await response.json();
        const rate = data.rates?.AUD;
        if (
          typeof rate === "number" &&
          Number.isFinite(rate) &&
          rate > 0 &&
          data.date
        )
          rates.set(currency, { rate, date: data.date });
      } catch {
        // Keep the original quote when the public FX service is unavailable.
      }
    }),
  );

  return quotes.map((quote) => {
    if (quote.currency === "AUD")
      return { ...quote, audEstimate: quote.amount };
    const fx = rates.get(quote.currency);
    return fx
      ? {
          ...quote,
          audEstimate: quote.amount * fx.rate,
          exchangeRate: fx.rate,
          exchangeRateDate: fx.date,
        }
      : quote;
  });
}
