"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { RECENT_SIGNATURE_LIMIT } from "@/lib/cookie-chain";
import { formatAbsoluteTime, formatCook, formatRelativeTime, formatSlot } from "@/lib/format";
import type { NetworkStats } from "@/lib/types";

export function StatsGrid({
  balanceLamports,
  recentTxCount,
  lastActivity,
  loading,
  network,
}: {
  balanceLamports: number | null;
  recentTxCount: number;
  lastActivity: number | null;
  loading: boolean;
  network: NetworkStats;
}) {
  const { connected } = useWallet();

  const cards = [
    {
      label: "COOK balance",
      value: !connected ? "—" : loading && balanceLamports == null ? "…" : `${formatCook(balanceLamports ?? 0)} COOK`,
      hint: "Native Cookie Chain balance from RPC",
    },
    {
      label: "Recent signatures",
      value: !connected ? "—" : loading ? "…" : String(recentTxCount),
      hint: `Count in the last ${RECENT_SIGNATURE_LIMIT} fetched txs`,
    },
    {
      label: "Last activity",
      value: !connected ? "—" : lastActivity ? formatRelativeTime(lastActivity) : "None yet",
      hint: lastActivity ? formatAbsoluteTime(lastActivity) : "No confirmed signatures yet",
    },
    {
      label: "Chain slot",
      value: network.slot != null ? formatSlot(network.slot) : "…",
      hint: network.epoch != null ? `Epoch ${network.epoch}` : "Cookie Chain",
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-amber-200/55">{card.label}</p>
          <p className="mt-3 font-display text-2xl text-amber-50">{card.value}</p>
          <p className="mt-2 text-xs leading-5 text-amber-100/50">{card.hint}</p>
        </article>
      ))}
    </div>
  );
}
