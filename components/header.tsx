"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import Link from "next/link";
import { useNetworkStats } from "@/hooks/use-network-stats";
import { COOKIE_DOCS_URL, COOKIE_EXPLORER_URL, NIGHTLY_URL } from "@/lib/cookie-chain";
import { formatSlot } from "@/lib/format";
import { WalletButton } from "@/components/wallet-button";

export function Header() {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const { stats } = useNetworkStats();

  return (
    <header className="sticky top-0 z-30 border-b border-amber-200/10 bg-[#120c08]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group flex items-center gap-3">
            <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-700 shadow-[0_0_24px_rgba(232,165,75,0.35)]">
              <span className="absolute inset-0 animate-ping rounded-2xl bg-amber-400/20" />
              <svg viewBox="0 0 32 32" className="relative h-6 w-6" aria-hidden>
                <circle cx="16" cy="16" r="10" fill="#3A2114" />
                <circle cx="12" cy="13" r="1.6" fill="#C47A2C" />
                <circle cx="19" cy="12" r="1.2" fill="#C47A2C" />
                <circle cx="16" cy="19" r="1.5" fill="#C47A2C" />
              </svg>
            </span>
            <span>
              <span className="block font-display text-lg leading-none text-amber-50">
                Cookie Pulse
              </span>
              <span className="mt-1 block text-[11px] uppercase tracking-[0.18em] text-amber-200/60">
                Cookie Chain console
              </span>
            </span>
          </Link>
          <div className="sm:hidden">
            <WalletButton onOpen={() => setVisible(true)} />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-amber-100/70">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 font-medium text-emerald-200">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                stats.health === "ok" ? "bg-emerald-300" : "bg-rose-300"
              }`}
            />
            Cookie Chain
          </span>
          {stats.slot != null && (
            <span className="hidden rounded-full border border-white/10 bg-white/5 px-3 py-1 sm:inline">
              Slot {formatSlot(stats.slot)}
            </span>
          )}
          {stats.epoch != null && (
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Epoch {stats.epoch}
            </span>
          )}
          <a
            href={COOKIE_EXPLORER_URL}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/10 px-3 py-1 hover:border-amber-200/40 hover:text-amber-100"
          >
            Explorer
          </a>
          <a
            href={COOKIE_DOCS_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-white/10 px-3 py-1 hover:border-amber-200/40 hover:text-amber-100 sm:inline"
          >
            Docs
          </a>
          <a
            href={NIGHTLY_URL}
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-white/10 px-3 py-1 hover:border-amber-200/40 hover:text-amber-100 md:inline"
          >
            Nightly
          </a>
          <div className="hidden sm:block">
            <WalletButton onOpen={() => setVisible(true)} connectedHint={connected} />
          </div>
        </div>
      </div>
    </header>
  );
}
