import OutCall "mo:caffeineai-http-outcalls/outcall";
import MarketLib "../lib/market";
import Types "../types/market";

mixin () {
  // IC HTTP outcall transform — required by the platform for consensus
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Returns raw JSON of top 100 coins by market cap (CoinGecko)
  public func getTop100Coins() : async Types.RawJson {
    await MarketLib.fetchTop100Coins(transform);
  };

  // Returns raw JSON of coin metadata for a given coinId (CoinGecko)
  public func getCoinMetadata(coinId : Text) : async Types.RawJson {
    await MarketLib.fetchCoinMetadata(coinId, transform);
  };

  // Returns raw JSON of 7-day price history for a coin (CoinGecko)
  public func getCoinPriceHistory(coinId : Text) : async Types.RawJson {
    await MarketLib.fetchPriceHistory(coinId, transform);
  };

  // Returns raw JSON of current prices for a comma-separated list of coin IDs (CoinGecko)
  public func getCurrentPrices(coinIds : Text) : async Types.RawJson {
    await MarketLib.fetchCurrentPrices(coinIds, transform);
  };

  // Returns raw JSON of the Fear & Greed Index (alternative.me)
  public func getFearGreedIndex() : async Types.RawJson {
    await MarketLib.fetchFearGreedIndex(transform);
  };
};
