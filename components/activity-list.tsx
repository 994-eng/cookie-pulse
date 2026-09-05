"use client";

import type { ConfirmedSignatureInfo } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { explorerTxUrl, shortenAddress } from "@/lib/cookie-chain";
import { formatAbsoluteTime, formatRelativeTime } from "@/lib/format";

export function ActivityList({
  signatures,
  loading,
  error,
  onRefresh,
}: {
  signatures: ConfirmedSignatureInfo[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}) {
  const { connected } = useWallet();

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-200/60">Recent activity</p>
          <h2 className="mt-1 font-display text-3xl text-amber-50">Wallet signatures</h2>
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-amber-50 hover:border-amber-200/40"
        >
          Refresh
        </button>
      </div>

      {!connected && (
        <p className="mt-5 text-sm text-amber-100/60">
          Connect a wallet to load real signatures from Cookie Chain. This list never invents
          activity.
        </p>
      )}

      {connected && error && (
        <p className="mt-5 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      )}

      {connected && loading && signatures.length === 0 && (
        <p className="mt-5 text-sm text-amber-100/60">Loading recent signatures…</p>
      )}

      {connected && !loading && signatures.length === 0 && !error && (
        <p className="mt-5 text-sm text-amber-100/60">
          No signatures yet. Send a Pulse ping to create the first one.
        </p>
      )}

      {signatures.length > 0 && (
        <ul className="mt-5 divide-y divide-white/8">
          {signatures.map((item) => {
            const failed = Boolean(item.err);
            return (
              <li key={item.signature} className="py-3 first:pt-0">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <a
                      href={explorerTxUrl(item.signature)}
                      target="_blank"
                      rel="noreferrer"
                      className="font-mono text-sm text-amber-100 hover:text-amber-50"
                    >
                      {shortenAddress(item.signature, 8)}
                    </a>
                    <p className="mt-1 text-xs text-amber-100/50">
                      {item.memo ? item.memo.replace(/^\[\d+\]\s*/, "") : "No memo"}
                      {" · "}
                      <span title={formatAbsoluteTime(item.blockTime)}>
                        {formatRelativeTime(item.blockTime)}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`w-fit rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] ${
                      failed
                        ? "bg-rose-400/15 text-rose-100"
                        : "bg-emerald-400/15 text-emerald-100"
                    }`}
                  >
                    {failed ? "Failed" : "Confirmed"}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
