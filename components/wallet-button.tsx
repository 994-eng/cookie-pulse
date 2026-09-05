"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { explorerAddressUrl, shortenAddress } from "@/lib/cookie-chain";

export function WalletButton({
  onOpen,
}: {
  onOpen: () => void;
  connectedHint?: boolean;
}) {
  const { connected, publicKey, disconnect, wallet, connecting } = useWallet();

  if (connected && publicKey) {
    return (
      <div className="flex items-center gap-2">
        <a
          href={explorerAddressUrl(publicKey.toBase58())}
          target="_blank"
          rel="noreferrer"
          className="hidden rounded-full border border-amber-200/20 bg-amber-100/5 px-3 py-1.5 font-mono text-xs text-amber-100 hover:border-amber-200/50 md:inline"
          title={publicKey.toBase58()}
        >
          {wallet?.adapter.name ?? "Wallet"} · {shortenAddress(publicKey.toBase58())}
        </a>
        <button
          type="button"
          onClick={() => void disconnect()}
          className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-amber-50 hover:border-rose-300/40 hover:bg-rose-400/10"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onOpen}
      disabled={connecting}
      className="rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-4 py-1.5 text-xs font-semibold text-stone-950 shadow-[0_8px_24px_rgba(232,165,75,0.28)] hover:from-amber-200 hover:to-orange-300 disabled:opacity-60"
    >
      {connecting ? "Connecting…" : "Connect wallet"}
    </button>
  );
}
