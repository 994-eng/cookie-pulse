"use client";

import { useWalletActivity } from "@/hooks/use-wallet-activity";
import { useNetworkStats } from "@/hooks/use-network-stats";
import { ActivityList } from "@/components/activity-list";
import { NightlyNetworkCard } from "@/components/nightly-network-card";
import { PingConsole } from "@/components/ping-console";
import { StatsGrid } from "@/components/stats-grid";
import { WalletIdentity } from "@/components/wallet-identity";
import { COOKIE_RPC_URL, COOKIESCAN_API_URL } from "@/lib/cookie-chain";

export function Dashboard() {
  const activity = useWalletActivity();
  const { stats } = useNetworkStats();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-5 px-4 py-8 sm:px-6 sm:py-10">
      <section className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-amber-200/55">
            Superteam Earn · Cookie Chain cApp
          </p>
          <h1 className="mt-3 max-w-xl font-display text-4xl leading-tight text-amber-50 sm:text-5xl">
            Watch the chain. Pulse a memo. Stay on Cookie.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-amber-100/70 sm:text-base">
            Cookie Pulse is a compact activity console for Cookie Chain. Connect Nightly, read
            your native COOK balance and recent signatures, then send a real Memo program
            transaction with pending → confirmed/failed handling.
          </p>
        </div>
        <aside className="rounded-3xl border border-white/10 bg-black/20 p-5 text-sm text-amber-100/70">
          <p className="text-xs uppercase tracking-[0.18em] text-amber-200/55">Live RPC</p>
          <p className="mt-2 break-all font-mono text-amber-100">{COOKIE_RPC_URL}</p>
          <p className="mt-3 text-xs leading-5">
            Health: {stats.health}
            {stats.transactionCount != null ? ` · ${stats.transactionCount.toLocaleString()} txs` : ""}
          </p>
          <a
            href={COOKIESCAN_API_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-block text-xs underline decoration-amber-200/30 underline-offset-4"
          >
            Cookiescan API
          </a>
        </aside>
      </section>

      <NightlyNetworkCard />
      <WalletIdentity />
      <StatsGrid
        balanceLamports={activity.balanceLamports}
        recentTxCount={activity.recentTxCount}
        lastActivity={activity.lastActivity}
        loading={activity.loading}
        network={stats}
      />
      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <PingConsole onConfirmed={() => void activity.refresh()} />
        <ActivityList
          signatures={activity.signatures}
          loading={activity.loading}
          error={activity.error}
          onRefresh={() => void activity.refresh()}
        />
      </div>
    </main>
  );
}
