import { COOKIE_GENESIS_HASH, COOKIE_RPC_URL } from "@/lib/cookie-chain";

export interface NightlySolanaNetwork {
  genesisHash: string;
  url?: string;
}

export interface NightlySolanaProvider {
  genesisHash?: string;
  changeNetwork?: (network: NightlySolanaNetwork) => Promise<unknown>;
}

export function getNightlySolana(): NightlySolanaProvider | null {
  if (typeof window === "undefined") return null;
  return window.nightly?.solana ?? null;
}

export function isNightlyWalletName(name: string | undefined | null): boolean {
  return (name ?? "").toLowerCase().includes("nightly");
}

export async function switchNightlyToCookieChain(
  genesisHash = COOKIE_GENESIS_HASH,
  rpcUrl = COOKIE_RPC_URL,
): Promise<void> {
  const nightly = getNightlySolana();
  if (!nightly?.changeNetwork) {
    throw new Error(
      "Nightly is not injected in this browser. Install it from nightly.app and reload.",
    );
  }

  await nightly.changeNetwork({
    genesisHash,
    url: rpcUrl,
  });
}

declare global {
  interface Window {
    nightly?: {
      solana?: NightlySolanaProvider;
    };
  }
}
