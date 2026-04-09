import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import PortfolioLib "../lib/portfolio";
import Types "../types/portfolio";
import CommonTypes "../types/common";

mixin (
  accessControlState : AccessControl.AccessControlState,
  holdingsStore : PortfolioLib.HoldingsStore,
) {
  // Returns all holdings for the authenticated user
  public query ({ caller }) func getHoldings() : async [Types.HoldingView] {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    PortfolioLib.getHoldings(holdingsStore, caller);
  };

  // Returns a single holding for the authenticated user
  public query ({ caller }) func getHolding(coinId : CommonTypes.CoinId) : async ?Types.HoldingView {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    PortfolioLib.getHolding(holdingsStore, caller, coinId);
  };

  // Adds/merges a trade into the user's holdings with weighted average cost basis
  public shared ({ caller }) func addHolding(req : Types.AddHoldingRequest) : async () {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    PortfolioLib.addHolding(holdingsStore, caller, req);
  };

  // Fully replaces a holding (manual override)
  public shared ({ caller }) func updateHolding(req : Types.UpdateHoldingRequest) : async () {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    PortfolioLib.updateHolding(holdingsStore, caller, req);
  };

  // Removes a holding entirely
  public shared ({ caller }) func removeHolding(coinId : CommonTypes.CoinId) : async () {
    if (caller.isAnonymous()) Runtime.trap("Not authenticated");
    PortfolioLib.removeHolding(holdingsStore, caller, coinId);
  };
};
