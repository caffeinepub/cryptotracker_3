import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export interface UpdateHoldingRequest {
    quantity: number;
    costBasis: number;
    coinId: CoinId;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type RawJson = string;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface HoldingView {
    totalCost: number;
    updatedAt: Timestamp;
    quantity: number;
    costBasis: number;
    coinId: CoinId;
}
export type CoinId = string;
export interface AddHoldingRequest {
    quantity: number;
    priceAtTrade: number;
    coinId: CoinId;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addHolding(req: AddHoldingRequest): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserRole(): Promise<UserRole>;
    getCoinMetadata(coinId: string): Promise<RawJson>;
    getCoinPriceHistory(coinId: string): Promise<RawJson>;
    getCurrentPrices(coinIds: string): Promise<RawJson>;
    getFearGreedIndex(): Promise<RawJson>;
    getHolding(coinId: CoinId): Promise<HoldingView | null>;
    getHoldings(): Promise<Array<HoldingView>>;
    getTop100Coins(): Promise<RawJson>;
    isCallerAdmin(): Promise<boolean>;
    removeHolding(coinId: CoinId): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateHolding(req: UpdateHoldingRequest): Promise<void>;
}
