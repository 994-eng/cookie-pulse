"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const CookieWalletProvider = dynamic(
  () => import("@/components/wallet-provider").then((mod) => mod.CookieWalletProvider),
  { ssr: false },
);

export function Providers({ children }: { children: ReactNode }) {
  return <CookieWalletProvider>{children}</CookieWalletProvider>;
}
