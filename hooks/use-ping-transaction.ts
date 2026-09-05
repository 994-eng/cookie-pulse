"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { Buffer } from "buffer";
import { useCallback, useState } from "react";
import {
  DEFAULT_PING_MEMO,
  MAX_MEMO_CHARS,
  MEMO_PROGRAM_ID,
} from "@/lib/cookie-chain";
import { getWalletErrorMessage } from "@/lib/tx-errors";
import type { PingState } from "@/lib/types";

const INITIAL: PingState = {
  phase: "idle",
  signature: null,
  error: null,
  memo: DEFAULT_PING_MEMO,
};

export function usePingTransaction(onConfirmed?: () => void) {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const [state, setState] = useState<PingState>(INITIAL);

  const setMemo = useCallback((memo: string) => {
    setState((current) => ({
      ...current,
      memo: memo.slice(0, MAX_MEMO_CHARS),
    }));
  }, []);

  const reset = useCallback(() => {
    setState((current) => ({
      ...INITIAL,
      memo: current.memo || DEFAULT_PING_MEMO,
    }));
  }, []);

  const sendPing = useCallback(async () => {
    if (!connected || !publicKey) {
      setState((current) => ({
        ...current,
        phase: "failed",
        error: "Connect a wallet first, then send the ping.",
      }));
      return;
    }

    const memo = state.memo.trim() || DEFAULT_PING_MEMO;

    setState((current) => ({
      ...current,
      phase: "signing",
      signature: null,
      error: null,
      memo,
    }));

    try {
      const latest = await connection.getLatestBlockhash("confirmed");
      const instruction = new TransactionInstruction({
        keys: [{ pubkey: publicKey, isSigner: true, isWritable: false }],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(memo, "utf8"),
      });

      const transaction = new Transaction({
        feePayer: publicKey,
        blockhash: latest.blockhash,
        lastValidBlockHeight: latest.lastValidBlockHeight,
      }).add(instruction);

      const signature = await sendTransaction(transaction, connection, {
        skipPreflight: false,
        preflightCommitment: "confirmed",
        maxRetries: 3,
      });

      setState((current) => ({
        ...current,
        phase: "pending",
        signature,
        error: null,
      }));

      const confirmation = await connection.confirmTransaction(
        {
          signature,
          blockhash: latest.blockhash,
          lastValidBlockHeight: latest.lastValidBlockHeight,
        },
        "confirmed",
      );

      if (confirmation.value.err) {
        throw new Error(
          `On-chain program error: ${JSON.stringify(confirmation.value.err)}`,
        );
      }

      setState((current) => ({
        ...current,
        phase: "confirmed",
        signature,
        error: null,
      }));
      onConfirmed?.();
    } catch (error) {
      setState((current) => ({
        ...current,
        phase: "failed",
        error: getWalletErrorMessage(error),
      }));
    }
  }, [connected, connection, onConfirmed, publicKey, sendTransaction, state.memo]);

  return { ...state, setMemo, sendPing, reset, publicKey: publicKey as PublicKey | null };
}
