const EXCHANGE_RATE_URL = "https://api.exchangerate.host/latest?base=USD&symbols=COP";

export const DEFAULT_USD_TO_COP_RATE = 4000;

const exchangeRateService = {
  getUsdToCopRate: async () => {
    const response = await fetch(EXCHANGE_RATE_URL, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Exchange rate request failed with status ${response.status}`);
    }

    const data = await response.json();
    const rate = Number(data?.rates?.COP);

    if (!Number.isFinite(rate) || rate <= 0) {
      throw new Error("Invalid USD to COP exchange rate response");
    }

    return {
      usdToCopRate: rate,
      fetchedAt: data?.date ?? new Date().toISOString(),
    };
  },
};

export default exchangeRateService;
