"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { DEFAULT_PING_MEMO, MAX_MEMO_CHARS, explorerTxUrl } from "@/lib/cookie-chain";
import { usePingTransaction } from "@/hooks/use-ping-transaction";

const STEPS = ["signing", "pending", "confirmed"] as const;

export function PingConsole({ onConfirmed }: { onConfirmed?: () => void }) {
  const { connected } = useWallet();
  const { setVisible } = useWalletModal();
  const ping = usePingTransaction(onConfirmed);

  const disabled = ping.phase === "signing" || ping.phase === "pending";

  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-200/60">On-chain write</p>
          <h2 className="mt-1 font-display text-3xl text-amber-50">Send a Pulse ping</h2>
        </div>
        <p className="text-xs text-amber-100/50">Memo program · real Cookie Chain tx</p>
      </div>

      <p className="mt-3 max-w-2xl text-sm leading-6 text-amber-100/70">
        This builds a legacy Solana transaction with one Memo instruction, asks your wallet to
        sign it, submits it to <span className="font-mono text-amber-100/90">rpc.cookiescan.io</span>,
        then waits for confirmation. Failed or rejected requests surface the wallet or RPC error.
      </p>

      <label className="mt-5 block text-sm text-amber-100/80" htmlFor="pulse-memo">
        Memo message
      </label>
      <textarea
        id="pulse-memo"
        value={ping.memo}
        maxLength={MAX_MEMO_CHARS}
        onChange={(event) => ping.setMemo(event.target.value)}
        disabled={disabled}
        className="mt-2 min-h-24 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-amber-50 outline-none ring-amber-300/40 placeholder:text-amber-100/30 focus:ring-2"
        placeholder={DEFAULT_PING_MEMO}
      />
      <p className="mt-1 text-right text-xs text-amber-100/40">
        {ping.memo.length}/{MAX_MEMO_CHARS}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {connected ? (
          <button
            type="button"
            onClick={() => void ping.sendPing()}
            disabled={disabled}
            className="rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-2.5 text-sm font-semibold text-stone-950 disabled:opacity-60"
          >
            {ping.phase === "signing"
              ? "Waiting for wallet…"
              : ping.phase === "pending"
                ? "Confirming…"
                : "Send ping transaction"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setVisible(true)}
            className="rounded-full bg-gradient-to-r from-amber-300 to-orange-400 px-5 py-2.5 text-sm font-semibold text-stone-950"
          >
            Connect wallet to ping
          </button>
        )}
        {ping.phase !== "idle" && (
          <button
            type="button"
            onClick={ping.reset}
            className="text-sm text-amber-100/70 underline decoration-amber-200/30 underline-offset-4"
          >
            Reset status
          </button>
        )}
      </div>

      <ol className="mt-6 grid gap-2 sm:grid-cols-3">
        {STEPS.map((step) => {
          const active =
            ping.phase === step ||
            (step === "signing" && (ping.phase === "pending" || ping.phase === "confirmed")) ||
            (step === "pending" && ping.phase === "confirmed");
          const current = ping.phase === step;
          return (
            <li
              key={step}
              className={`rounded-2xl border px-4 py-3 text-sm capitalize ${
                ping.phase === "failed" && step !== "confirmed"
                  ? "border-rose-400/30 bg-rose-400/10 text-rose-100"
                  : active
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                    : "border-white/10 text-amber-100/50"
              }`}
            >
              <span className="block text-[11px] uppercase tracking-[0.16em] opacity-70">
                {current ? "Now" : active ? "Done" : "Next"}
              </span>
              {step === "signing" ? "Sign in wallet" : step === "pending" ? "Confirm on-chain" : "Confirmed"}
            </li>
          );
        })}
      </ol>

      {ping.signature && (
        <p className="mt-4 text-sm text-amber-100/80">
          Signature{" "}
          <a
            href={explorerTxUrl(ping.signature)}
            target="_blank"
            rel="noreferrer"
            className="break-all font-mono text-amber-200 underline decoration-amber-200/30 underline-offset-4"
          >
            {ping.signature}
          </a>
        </p>
      )}

      {ping.phase === "confirmed" && (
        <p className="mt-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
          Confirmed on Cookie Chain. Open the explorer link to inspect the memo instruction.
        </p>
      )}

      {ping.phase === "failed" && ping.error && (
        <p className="mt-3 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {ping.error}
        </p>
      )}
    </section>
  );
}
