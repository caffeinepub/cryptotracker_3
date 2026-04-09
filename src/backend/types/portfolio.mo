import CommonTypes "common";

module {
  public type UserId = CommonTypes.UserId;
  public type CoinId = CommonTypes.CoinId;
  public type Timestamp = CommonTypes.Timestamp;

  // A single holding entry per coin per user
  public type Holding = {
    coinId : CoinId;
    quantity : Float;        // total quantity owned
    costBasis : Float;       // weighted average cost per unit (USD)
    totalCost : Float;       // sum of (price_i * qty_i) — needed to recompute avg on add
    updatedAt : Timestamp;
  };

  // Sent by the frontend when adding/buying
  public type AddHoldingRequest = {
    coinId : CoinId;
    quantity : Float;        // quantity purchased
    priceAtTrade : Float;    // price per unit at time of trade (USD)
  };

  // Sent by the frontend when updating (replace full position)
  public type UpdateHoldingRequest = {
    coinId : CoinId;
    quantity : Float;
    costBasis : Float;
  };

  // Public API surface (immutable, shared-type safe)
  public type HoldingView = {
    coinId : CoinId;
    quantity : Float;
    costBasis : Float;
    totalCost : Float;
    updatedAt : Timestamp;
  };
};
