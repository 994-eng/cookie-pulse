"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import type { ConfirmedSignatureInfo } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import { RECENT_SIGNATURE_LIMIT } from "@/lib/cookie-chain";

export function useWalletActivity() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balanceLamports, setBalanceLamports] = useState<number | null>(null);
  const [signatures, setSignatures] = useState<ConfirmedSignatureInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!publicKey) {
      setBalanceLamports(null);
      setSignatures([]);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const [balance, recent] = await Promise.all([
        connection.getBalance(publicKey, "confirmed"),
        connection.getSignaturesForAddress(publicKey, { limit: RECENT_SIGNATURE_LIMIT }),
      ]);
      setBalanceLamports(balance);
      setSignatures(recent);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not load wallet activity from Cookie Chain RPC.",
      );
    } finally {
      setLoading(false);
    }
  }, [connection, publicKey]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const lastActivity = signatures[0]?.blockTime ?? null;

  return {
    balanceLamports,
    signatures,
    recentTxCount: signatures.length,
    lastActivity,
    loading,
    error,
    refresh,
  };
}
