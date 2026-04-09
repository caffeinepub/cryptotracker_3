import OutCall "mo:caffeineai-http-outcalls/outcall";
import Types "../types/market";

module {
  let COINGECKO_BASE = "https://api.coingecko.com/api/v3";

  // Fetch top 100 coins by market cap from CoinGecko (returns raw JSON)
  public func fetchTop100Coins(transform : OutCall.Transform) : async Types.RawJson {
    let url = COINGECKO_BASE # "/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true&price_change_percentage=24h";
    await OutCall.httpGetRequest(url, [], transform);
  };

  // Fetch coin metadata for a given coin (returns raw JSON)
  public func fetchCoinMetadata(coinId : Text, transform : OutCall.Transform) : async Types.RawJson {
    let url = COINGECKO_BASE # "/coins/" # coinId # "?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false";
    await OutCall.httpGetRequest(url, [], transform);
  };

  // Fetch 7-day price history for a coin (returns raw JSON)
  public func fetchPriceHistory(coinId : Text, transform : OutCall.Transform) : async Types.RawJson {
    let url = COINGECKO_BASE # "/coins/" # coinId # "/market_chart?vs_currency=usd&days=7&interval=daily";
    await OutCall.httpGetRequest(url, [], transform);
  };

  // Fetch current prices for a list of coin IDs (comma-separated) (returns raw JSON)
  public func fetchCurrentPrices(coinIds : Text, transform : OutCall.Transform) : async Types.RawJson {
    let url = COINGECKO_BASE # "/simple/price?ids=" # coinIds # "&vs_currencies=usd&include_24hr_change=true";
    await OutCall.httpGetRequest(url, [], transform);
  };

  // Fetch Fear & Greed Index from alternative.me (returns raw JSON)
  public func fetchFearGreedIndex(transform : OutCall.Transform) : async Types.RawJson {
    await OutCall.httpGetRequest("https://api.alternative.me/fng/?limit=1", [], transform);
  };
};
