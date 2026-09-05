"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { COOKIE_GENESIS_HASH, COOKIE_RPC_URL, NIGHTLY_URL } from "@/lib/cookie-chain";
import { getNightlySolana, isNightlyWalletName, switchNightlyToCookieChain } from "@/lib/nightly";

export function NightlyNetworkCard() {
  const { wallet, connected } = useWallet();
  const { connection } = useConnection();
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const nightlySelected = isNightlyWalletName(wallet?.adapter.name);
  const nightlyInjected = Boolean(getNightlySolana());

  if (connected && !nightlySelected && !nightlyInjected) {
    return null;
  }

  async function onSwitch() {
    setBusy(true);
    setStatus(null);
    try {
      const genesisHash = await connection.getGenesisHash().catch(() => COOKIE_GENESIS_HASH);
      await switchNightlyToCookieChain(genesisHash, COOKIE_RPC_URL);
      setStatus("Nightly was asked to switch to Cookie Chain. Confirm the popup if it appears.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not request a Nightly network switch.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-3xl border border-amber-200/15 bg-[linear-gradient(160deg,rgba(243,197,107,0.08),rgba(18,12,8,0.4))] p-5">
      <p className="text-xs uppercase tracking-[0.2em] text-amber-200/60">Required wallet</p>
      <h2 className="mt-1 font-display text-2xl text-amber-50">Nightly on Cookie Chain</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-amber-100/70">
        Cookie Chain is a Solana-compatible SVM. Nightly is the required wallet for this bounty.
        After connecting, switch Nightly to Cookie Chain using the community RPC.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => void onSwitch()}
          disabled={busy}
          className="rounded-full bg-amber-200 px-4 py-2 text-sm font-semibold text-stone-950 hover:bg-amber-100 disabled:opacity-60"
        >
          {busy ? "Requesting…" : "Switch Nightly to Cookie Chain"}
        </button>
        <a
          href={NIGHTLY_URL}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-amber-100/80 underline decoration-amber-200/30 underline-offset-4 hover:text-amber-50"
        >
          Get Nightly
        </a>
      </div>
      {status && <p className="mt-3 text-sm text-amber-100/80">{status}</p>}
    </section>
  );
}
