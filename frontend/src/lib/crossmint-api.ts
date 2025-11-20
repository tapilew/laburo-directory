import type { Abi } from "viem";

type CreateTransactionParams = {
  walletAddress: `0x${string}`;
  contractAddress: `0x${string}`;
  abi: Abi;
  functionName: string;
  args: unknown[];
  value: bigint;
};

type PollTransactionParams = {
  walletAddress: `0x${string}`;
  txId: string;
  timeoutMs?: number;
  pollIntervalMs?: number;
};

async function handleJsonResponse(response: Response) {
  const text = await response.text();
  let json: any;

  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = {};
  }

  if (!response.ok) {
    const message =
      json?.message ||
      json?.error?.message ||
      `${response.status} ${response.statusText}`;
    throw new Error(`Crossmint API error: ${message}`);
  }

  return json;
}

export async function createTransaction({
  walletAddress,
  contractAddress,
  abi,
  functionName,
  args,
  value,
}: CreateTransactionParams): Promise<{ txId: string }> {
  const body = {
    walletAddress,
    contractAddress,
    abi,
    functionName,
    args,
    // API route expects value as a string in wei.
    value: value.toString(),
  };

  const response = await fetch("/api/transactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const json = await handleJsonResponse(response);

  const txId: string | undefined =
    json?.id || json?.transactionId || json?.txId;

  if (!txId) {
    throw new Error("Crossmint createTransaction: no transaction id returned");
  }

  return { txId };
}

export async function pollTransactionStatus({
  walletAddress,
  txId,
  timeoutMs = 60_000,
  pollIntervalMs = 2_000,
}: PollTransactionParams): Promise<string> {
  const start = Date.now();

  // Simple polling loop; fine for short-lived user actions.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const url = `/api/transactions/${encodeURIComponent(
      txId
    )}?walletAddress=${encodeURIComponent(walletAddress)}`;

    const response = await fetch(url, {
      method: "GET",
    });

    const json: any = await handleJsonResponse(response);

    const status: string | undefined =
      json?.status || json?.state || json?.transactionStatus;

    if (status === "success" || status === "confirmed") {
      const hash: string | undefined =
        json?.onChain?.txId ||
        json?.onChain?.transactionHash ||
        json?.txId ||
        json?.hash;

      if (!hash) {
        throw new Error(
          "Crossmint transaction succeeded but no on-chain hash was returned"
        );
      }

      return hash;
    }

    if (status === "failed" || status === "error") {
      const message: string =
        json?.error?.message || json?.message || "Unknown Crossmint error";
      throw new Error(`Crossmint transaction failed: ${message}`);
    }

    if (Date.now() - start > timeoutMs) {
      throw new Error("Timed out waiting for Crossmint transaction");
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
}


