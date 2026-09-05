"use client";

import { useConnection } from "@solana/wallet-adapter-react";
import { useCallback, useEffect, useState } from "react";
import { COOKIE_GENESIS_HASH } from "@/lib/cookie-chain";
import type { NetworkStats } from "@/lib/types";

const EMPTY: NetworkStats = {
  health: "unknown",
  epoch: null,
  slot: null,
  blockHeight: null,
  transactionCount: null,
  genesisHash: COOKIE_GENESIS_HASH,
};

export function useNetworkStats(refreshMs = 20_000) {
  const { connection } = useConnection();
  const [stats, setStats] = useState<NetworkStats>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const [epochInfo, genesisHash] = await Promise.all([
        connection.getEpochInfo("confirmed"),
        connection.getGenesisHash().catch(() => COOKIE_GENESIS_HASH),
      ]);

      setStats({
        health: "ok",
        epoch: epochInfo.epoch,
        slot: epochInfo.absoluteSlot,
        blockHeight: epochInfo.blockHeight ?? null,
        transactionCount: epochInfo.transactionCount ?? null,
        genesisHash,
      });
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load Cookie Chain status.");
      setStats((current) => ({ ...current, health: "unreachable" }));
    } finally {
      setLoading(false);
    }
  }, [connection]);

  useEffect(() => {
    void refresh();
    const id = window.setInterval(() => {
      void refresh();
    }, refreshMs);
    return () => window.clearInterval(id);
  }, [refresh, refreshMs]);

  return { stats, loading, error, refresh };
}
