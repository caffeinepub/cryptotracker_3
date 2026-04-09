import Map "mo:core/Map";
import Time "mo:core/Time";
import Types "../types/portfolio";
import CommonTypes "../types/common";

module {
  public type HoldingsStore = Map.Map<CommonTypes.UserId, Map.Map<CommonTypes.CoinId, Types.Holding>>;

  func toView(h : Types.Holding) : Types.HoldingView {
    { coinId = h.coinId; quantity = h.quantity; costBasis = h.costBasis; totalCost = h.totalCost; updatedAt = h.updatedAt }
  };

  func getOrCreateUserMap(store : HoldingsStore, user : CommonTypes.UserId) : Map.Map<CommonTypes.CoinId, Types.Holding> {
    switch (store.get(user)) {
      case (?m) m;
      case null {
        let m = Map.empty<CommonTypes.CoinId, Types.Holding>();
        store.add(user, m);
        m;
      };
    };
  };

  // Retrieve all holdings for a user
  public func getHoldings(
    store : HoldingsStore,
    user : CommonTypes.UserId,
  ) : [Types.HoldingView] {
    switch (store.get(user)) {
      case null [];
      case (?userMap) {
        userMap.entries().map<(CommonTypes.CoinId, Types.Holding), Types.HoldingView>(
          func((_, h)) = toView(h)
        ).toArray();
      };
    };
  };

  // Get a single holding for a user by coinId
  public func getHolding(
    store : HoldingsStore,
    user : CommonTypes.UserId,
    coinId : CommonTypes.CoinId,
  ) : ?Types.HoldingView {
    switch (store.get(user)) {
      case null null;
      case (?userMap) {
        switch (userMap.get(coinId)) {
          case null null;
          case (?h) ?toView(h);
        };
      };
    };
  };

  // Add to (or create) a holding using weighted average cost basis
  public func addHolding(
    store : HoldingsStore,
    user : CommonTypes.UserId,
    req : Types.AddHoldingRequest,
  ) {
    let userMap = getOrCreateUserMap(store, user);
    let now = Time.now();

    let newHolding : Types.Holding = switch (userMap.get(req.coinId)) {
      case null {
        {
          coinId = req.coinId;
          quantity = req.quantity;
          costBasis = req.priceAtTrade;
          totalCost = req.priceAtTrade * req.quantity;
          updatedAt = now;
        };
      };
      case (?existing) {
        let newTotalCost = existing.totalCost + (req.priceAtTrade * req.quantity);
        let newQuantity = existing.quantity + req.quantity;
        let newCostBasis = if (newQuantity == 0.0) 0.0 else newTotalCost / newQuantity;
        {
          coinId = req.coinId;
          quantity = newQuantity;
          costBasis = newCostBasis;
          totalCost = newTotalCost;
          updatedAt = now;
        };
      };
    };

    userMap.add(req.coinId, newHolding);
  };

  // Update a holding (used for sell flows and manual edits).
  // On sell: preserves proportional totalCost by subtracting the cost of sold
  // units (soldQty × existing avgCostBasis) rather than recomputing from
  // costBasis × newQty, which would lose accumulated weighted-average cost.
  public func updateHolding(
    store : HoldingsStore,
    user : CommonTypes.UserId,
    req : Types.UpdateHoldingRequest,
  ) {
    let userMap = getOrCreateUserMap(store, user);
    let now = Time.now();
    let newTotalCost : Float = switch (userMap.get(req.coinId)) {
      case null { req.costBasis * req.quantity };
      case (?existing) {
        let soldQty = existing.quantity - req.quantity;
        if (soldQty > 0.0) {
          // Sell: subtract the cost of sold units at existing avg cost basis
          let remaining = existing.totalCost - (soldQty * existing.costBasis);
          if (remaining < 0.0) 0.0 else remaining;
        } else {
          // Manual increase or unchanged: recompute from provided costBasis
          req.costBasis * req.quantity;
        };
      };
    };
    userMap.add(req.coinId, {
      coinId = req.coinId;
      quantity = req.quantity;
      costBasis = req.costBasis;
      totalCost = newTotalCost;
      updatedAt = now;
    });
  };

  // Remove a holding entirely
  public func removeHolding(
    store : HoldingsStore,
    user : CommonTypes.UserId,
    coinId : CommonTypes.CoinId,
  ) {
    switch (store.get(user)) {
      case null ();
      case (?userMap) userMap.remove(coinId);
    };
  };
};
