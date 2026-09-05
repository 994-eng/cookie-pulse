export function getWalletErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return mapKnownError(error.message);
  }

  if (typeof error === "string") {
    return mapKnownError(error);
  }

  if (error && typeof error === "object") {
    const maybe = error as { message?: string; error?: { message?: string } };
    if (maybe.message) return mapKnownError(maybe.message);
    if (maybe.error?.message) return mapKnownError(maybe.error.message);
  }

  return "The transaction failed. Check your wallet, COOK balance, and Cookie Chain RPC, then try again.";
}

function mapKnownError(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("user rejected") ||
    lower.includes("rejected the request") ||
    lower.includes("user denied") ||
    lower.includes("cancelled") ||
    lower.includes("canceled")
  ) {
    return "Wallet request was rejected. No transaction was sent.";
  }

  if (
    lower.includes("insufficient") ||
    lower.includes("0x1") ||
    lower.includes("attempt to debit") ||
    lower.includes("not enough")
  ) {
    return "Not enough COOK to cover the network fee. Bridge COOK to Cookie Chain, then retry.";
  }

  if (lower.includes("blockhash not found") || lower.includes("block height exceeded")) {
    return "The transaction expired before confirmation. Please send the ping again.";
  }

  if (lower.includes("wallet not connected") || lower.includes("not connected")) {
    return "Connect a wallet first, then send the ping.";
  }

  if (lower.includes("failed to fetch") || lower.includes("network") || lower.includes("timeout")) {
    return "Could not reach Cookie Chain RPC. Check your connection and try again.";
  }

  return message;
}
