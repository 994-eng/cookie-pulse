import { PublicKey } from "@solana/web3.js";

export const COOKIE_RPC_URL =
  process.env.NEXT_PUBLIC_COOKIE_RPC_URL ?? "https://rpc.cookiescan.io";

export const COOKIE_EXPLORER_URL = (
  process.env.NEXT_PUBLIC_COOKIE_EXPLORER_URL ?? "https://cookiescan.io"
).replace(/\/$/, "");

/** Verified via `getGenesisHash` against https://rpc.cookiescan.io */
export const COOKIE_GENESIS_HASH = "9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2";

/** Native COOK uses 9 decimals (same unit as Solana lamports). */
export const COOK_DECIMALS = 9;

/**
 * Solana Memo program, listed as a Cookie Chain genesis program in
 * https://docs.cookiechain.wtf/ecosystem
 */
export const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
);

export const COOKIE_DOCS_URL = "https://docs.cookiechain.wtf";
export const NIGHTLY_URL = "https://nightly.app/";
export const COOKIESCAN_API_URL = "https://api.cookiescan.io";

export const DEFAULT_PING_MEMO = "Cookie Pulse ping";
export const MAX_MEMO_CHARS = 200;
export const RECENT_SIGNATURE_LIMIT = 20;

export function explorerTxUrl(signature: string): string {
  return `${COOKIE_EXPLORER_URL}/tx/${signature}`;
}

export function explorerAddressUrl(address: string): string {
  return `${COOKIE_EXPLORER_URL}/address/${address}`;
}

export function shortenAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 1) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}
