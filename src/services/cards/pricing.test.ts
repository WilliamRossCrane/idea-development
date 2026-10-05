import { afterEach, describe, expect, it, vi } from "vitest";
import { addAudEstimates } from "./pricing";

afterEach(() => vi.unstubAllGlobals());

describe("AUD price estimates", () => {
  it("converts foreign quotes and preserves the FX date and source quote", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(() =>
        Promise.resolve(
          new Response(
            JSON.stringify({ date: "2026-10-02", rates: { AUD: 1.5 } }),
          ),
        ),
      );
    vi.stubGlobal("fetch", fetchMock);
    const quotes = await addAudEstimates([
      { source: "TCGplayer", currency: "USD", printing: "normal", amount: 2 },
      { source: "Cardmarket", currency: "EUR", printing: "holo", amount: 3 },
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(quotes).toMatchObject([
      {
        source: "TCGplayer",
        currency: "USD",
        amount: 2,
        audEstimate: 3,
        exchangeRate: 1.5,
        exchangeRateDate: "2026-10-02",
      },
      {
        source: "Cardmarket",
        currency: "EUR",
        amount: 3,
        audEstimate: 4.5,
        exchangeRate: 1.5,
        exchangeRateDate: "2026-10-02",
      },
    ]);
  });

  it("keeps a native AUD quote without an FX request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const quotes = await addAudEstimates([
      {
        source: "Australian market",
        currency: "AUD",
        printing: "normal",
        amount: 12,
      },
    ]);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(quotes[0].audEstimate).toBe(12);
  });

  it("retains the source quote when FX lookup fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("", { status: 503 })),
    );
    const quotes = await addAudEstimates([
      { source: "TCGplayer", currency: "USD", printing: "normal", amount: 2 },
    ]);
    expect(quotes[0]).toMatchObject({
      source: "TCGplayer",
      currency: "USD",
      amount: 2,
    });
    expect(quotes[0].audEstimate).toBeUndefined();
  });
});
