import Map "mo:core/Map";
import Principal "mo:core/Principal";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import PortfolioLib "lib/portfolio";
import PortfolioApi "mixins/portfolio-api";
import MarketApi "mixins/market-api";

actor {
  // Authorization state (manages user roles via Internet Identity)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Per-user holdings: UserId -> CoinId -> Holding
  let holdingsStore : PortfolioLib.HoldingsStore = Map.empty<Principal, Map.Map<Text, {
    coinId : Text;
    quantity : Float;
    costBasis : Float;
    totalCost : Float;
    updatedAt : Int;
  }>>();

  // Portfolio CRUD API
  include PortfolioApi(accessControlState, holdingsStore);

  // Market data API (CoinGecko + Fear & Greed)
  include MarketApi();
};
