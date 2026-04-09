import type { backendInterface, UserRole } from "../backend";

const sampleHoldings = [
  {
    coinId: "bitcoin",
    quantity: 0.5,
    costBasis: 42000,
    totalCost: 21000,
    updatedAt: BigInt(Date.now() * 1_000_000),
  },
  {
    coinId: "ethereum",
    quantity: 3.2,
    costBasis: 2200,
    totalCost: 7040,
    updatedAt: BigInt(Date.now() * 1_000_000),
  },
  {
    coinId: "solana",
    quantity: 50,
    costBasis: 95,
    totalCost: 4750,
    updatedAt: BigInt(Date.now() * 1_000_000),
  },
];

const top100CoinsJson = JSON.stringify(
  Array.from({ length: 20 }, (_, i) => {
    const coins = [
      { id: "bitcoin", symbol: "btc", name: "Bitcoin", current_price: 67420, market_cap: 1_320_000_000_000, price_change_percentage_24h: 2.45 },
      { id: "ethereum", symbol: "eth", name: "Ethereum", current_price: 3540, market_cap: 425_000_000_000, price_change_percentage_24h: -1.12 },
      { id: "solana", symbol: "sol", name: "Solana", current_price: 178, market_cap: 82_000_000_000, price_change_percentage_24h: 5.33 },
      { id: "binancecoin", symbol: "bnb", name: "BNB", current_price: 420, market_cap: 63_000_000_000, price_change_percentage_24h: 0.87 },
      { id: "ripple", symbol: "xrp", name: "XRP", current_price: 0.62, market_cap: 35_000_000_000, price_change_percentage_24h: -0.45 },
      { id: "cardano", symbol: "ada", name: "Cardano", current_price: 0.51, market_cap: 18_000_000_000, price_change_percentage_24h: -2.1 },
      { id: "avalanche-2", symbol: "avax", name: "Avalanche", current_price: 38, market_cap: 15_500_000_000, price_change_percentage_24h: 3.78 },
      { id: "dogecoin", symbol: "doge", name: "Dogecoin", current_price: 0.165, market_cap: 23_000_000_000, price_change_percentage_24h: 1.22 },
      { id: "polkadot", symbol: "dot", name: "Polkadot", current_price: 8.5, market_cap: 11_000_000_000, price_change_percentage_24h: -0.88 },
      { id: "chainlink", symbol: "link", name: "Chainlink", current_price: 15.2, market_cap: 9_000_000_000, price_change_percentage_24h: 4.12 },
    ];
    return { ...coins[i % coins.length], market_cap_rank: i + 1 };
  })
);

const priceHistoryJson = JSON.stringify({
  prices: Array.from({ length: 30 }, (_, i) => [
    Date.now() - (29 - i) * 86400000,
    45000 + Math.sin(i * 0.4) * 5000 + i * 800,
  ]),
});

const fearGreedJson = JSON.stringify({
  data: [{ value: "72", value_classification: "Greed", timestamp: String(Math.floor(Date.now() / 1000)) }],
});

const currentPricesJson = JSON.stringify({
  bitcoin: { usd: 67420, usd_24h_change: 2.45 },
  ethereum: { usd: 3540, usd_24h_change: -1.12 },
  solana: { usd: 178, usd_24h_change: 5.33 },
});

const coinMetadataJson = JSON.stringify({
  id: "bitcoin",
  symbol: "btc",
  name: "Bitcoin",
  image: { thumb: "https://assets.coingecko.com/coins/images/1/thumb/bitcoin.png" },
});

export const mockBackend: backendInterface = {
  _initializeAccessControl: async () => undefined,
  addHolding: async () => undefined,
  assignCallerUserRole: async () => undefined,
  getCallerUserRole: async () => "user" as unknown as UserRole,
  getCoinMetadata: async () => coinMetadataJson,
  getCoinPriceHistory: async () => priceHistoryJson,
  getCurrentPrices: async () => currentPricesJson,
  getFearGreedIndex: async () => fearGreedJson,
  getHolding: async () => sampleHoldings[0],
  getHoldings: async () => sampleHoldings,
  getTop100Coins: async () => top100CoinsJson,
  isCallerAdmin: async () => false,
  removeHolding: async () => undefined,
  transform: async (input) => ({
    status: BigInt(200),
    body: input.response.body,
    headers: input.response.headers,
  }),
  updateHolding: async () => undefined,
};
