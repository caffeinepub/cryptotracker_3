module {
  // Raw JSON from CoinGecko tunnelled to frontend for parsing
  public type RawJson = Text;

  // Fear & Greed index result
  public type FearGreedResult = {
    raw : RawJson; // raw JSON from alternative.me
  };
};
