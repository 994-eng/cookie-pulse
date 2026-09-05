import { COOK_DECIMALS } from "@/lib/cookie-chain";

export function lamportsToCook(lamports: number | bigint): number {
  const value = typeof lamports === "bigint" ? Number(lamports) : lamports;
  return value / 10 ** COOK_DECIMALS;
}

export function formatCook(lamports: number | bigint, maximumFractionDigits = 6): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits,
  }).format(lamportsToCook(lamports));
}

export function formatSlot(slot: number): string {
  return new Intl.NumberFormat("en-US").format(slot);
}

export function formatRelativeTime(unixSeconds: number | null | undefined): string {
  if (!unixSeconds) return "Unknown time";
  const deltaMs = Date.now() - unixSeconds * 1000;
  const abs = Math.abs(deltaMs);
  const minutes = Math.round(abs / 60_000);
  const hours = Math.round(abs / 3_600_000);
  const days = Math.round(abs / 86_400_000);

  if (abs < 45_000) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 14) return `${days}d ago`;
  return new Date(unixSeconds * 1000).toLocaleString();
}

export function formatAbsoluteTime(unixSeconds: number | null | undefined): string {
  if (!unixSeconds) return "—";
  return new Date(unixSeconds * 1000).toLocaleString();
}
