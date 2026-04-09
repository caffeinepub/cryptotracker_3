import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createActor } from "../backend";
import type {
  AddHoldingRequest,
  HoldingView,
  UpdateHoldingRequest,
} from "../backend";
import type { CoinMarket, FearGreedData } from "../types";

function useBackend() {
  return useActor(createActor);
}

// ── Holdings ──────────────────────────────────────────────────────────────────

export function useHoldings() {
  const { actor, isFetching } = useBackend();
  return useQuery<HoldingView[]>({
    queryKey: ["holdings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getHoldings();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useAddHolding() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: AddHoldingRequest) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.addHolding(req);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["holdings"] }),
  });
}

export function useUpdateHolding() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (req: UpdateHoldingRequest) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.updateHolding(req);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["holdings"] }),
  });
}

export function useRemoveHolding() {
  const { actor } = useBackend();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (coinId: string) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.removeHolding(coinId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["holdings"] }),
  });
}

// ── Market Data ───────────────────────────────────────────────────────────────

export function useTopCoins() {
  const { actor, isFetching } = useBackend();
  return useQuery<CoinMarket[]>({
    queryKey: ["top-coins"],
    queryFn: async () => {
      if (!actor) return [];
      const raw = await actor.getTop100Coins();
      try {
        return JSON.parse(raw) as CoinMarket[];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useCurrentPrices(coinIds: string[]) {
  const { actor, isFetching } = useBackend();
  return useQuery<Record<string, { usd: number }>>({
    queryKey: ["prices", coinIds],
    queryFn: async () => {
      if (!actor || coinIds.length === 0) return {};
      const raw = await actor.getCurrentPrices(coinIds.join(","));
      try {
        return JSON.parse(raw) as Record<string, { usd: number }>;
      } catch {
        return {};
      }
    },
    enabled: !!actor && !isFetching && coinIds.length > 0,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
}

export function useFearGreedIndex() {
  const { actor, isFetching } = useBackend();
  return useQuery<FearGreedData | null>({
    queryKey: ["fear-greed"],
    queryFn: async () => {
      if (!actor) return null;
      const raw = await actor.getFearGreedIndex();
      try {
        const data = JSON.parse(raw);
        return data?.data?.[0] ?? null;
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
    staleTime: 300_000,
  });
}

export function useCoinPriceHistory(coinId: string) {
  const { actor, isFetching } = useBackend();
  return useQuery<number[][]>({
    queryKey: ["price-history", coinId],
    queryFn: async () => {
      if (!actor || !coinId) return [];
      const raw = await actor.getCoinPriceHistory(coinId);
      try {
        const data = JSON.parse(raw);
        return data?.prices ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!coinId,
    staleTime: 300_000,
  });
}
