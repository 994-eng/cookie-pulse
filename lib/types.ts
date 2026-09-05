export type PingPhase = "idle" | "signing" | "pending" | "confirmed" | "failed";

export interface PingState {
  phase: PingPhase;
  signature: string | null;
  error: string | null;
  memo: string;
}

export interface NetworkStats {
  health: string;
  epoch: number | null;
  slot: number | null;
  blockHeight: number | null;
  transactionCount: number | null;
  genesisHash: string | null;
}
