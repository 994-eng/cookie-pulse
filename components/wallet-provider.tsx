"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { NightlyWalletAdapter } from "@solana/wallet-adapter-nightly";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";
import { useEffect, useMemo, type ReactNode } from "react";
import { COOKIE_RPC_URL } from "@/lib/cookie-chain";

import "@solana/wallet-adapter-react-ui/styles.css";

function CookieChainModalCopy() {
  useEffect(() => {
    const rewrite = () => {
      document.querySelectorAll(".wallet-adapter-modal-title").forEach((el) => {
        if (el.textContent?.includes("Solana")) {
          el.textContent = "Connect a wallet on Cookie Chain";
        }
      });
    };
    rewrite();
    const observer = new MutationObserver(rewrite);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);
  return null;
}

export function CookieWalletProvider({ children }: { children: ReactNode }) {
  const endpoint = COOKIE_RPC_URL;
  const wallets = useMemo(() => {
    if (typeof window === "undefined") return [];
    return [
      new NightlyWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
    ];
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: "confirmed" }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <CookieChainModalCopy />
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
