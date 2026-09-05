"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import { explorerAddressUrl, shortenAddress } from "@/lib/cookie-chain";

export function WalletIdentity() {
  const { connected, publicKey, wallet, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const [copied, setCopied] = useState(false);

  if (!connected || !publicKey) {
    return (
      <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-200/60">Wallet</p>
        <h2 className="mt-2 font-display text-3xl text-amber-50">Connect to see your pulse</h2>
        <p className="mt-3 max-w-xl text-sm leading-6 text-amber-100/70">
          Nightly is required. Phantom and Solflare also appear in the standard wallet adapter
          list when installed. After you connect, Cookie Pulse reads your COOK balance and recent
          signatures from the Cookie Chain RPC — no fake data.
        </p>
        <button
          type="button"
          onClick={() => setVisible(true)}
          className="mt-5 rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-2.5 text-sm font-semibold text-stone-950"
        >
          Connect Nightly / wallet
        </button>
      </section>
    );
  }

  const address = publicKey.toBase58();

  async function copy() {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-200/60">Connected wallet</p>
      <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm text-amber-100/70">{wallet?.adapter.name ?? "Wallet"}</p>
          <p className="mt-1 break-all font-mono text-lg text-amber-50 sm:text-xl" title={address}>
            {address}
          </p>
          <p className="mt-1 text-xs text-amber-100/50 sm:hidden">{shortenAddress(address, 6)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => void copy()}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-amber-50 hover:border-amber-200/40"
          >
            {copied ? "Copied" : "Copy address"}
          </button>
          <a
            href={explorerAddressUrl(address)}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-amber-50 hover:border-amber-200/40"
          >
            View on Cookiescan
          </a>
          <button
            type="button"
            onClick={() => void disconnect()}
            className="rounded-full border border-white/15 px-4 py-2 text-sm text-amber-50 hover:border-rose-300/40"
          >
            Disconnect
          </button>
        </div>
      </div>
    </section>
  );
}
