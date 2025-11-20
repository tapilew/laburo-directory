import { NextResponse } from "next/server";

import { env } from "@/env";

// Uses server-side Crossmint API key (CROSSMINT_SERVER_API_KEY).
// Do not expose this key to the client; all calls must go through this route.

const CROSSMINT_API_BASE =
  "https://staging.crossmint.com/api/2025-06-09" as const;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      walletAddress?: string;
      contractAddress?: string;
      abi?: unknown;
      functionName?: string;
      args?: unknown[];
      value?: string;
    };

    const {
      walletAddress,
      contractAddress,
      abi,
      functionName,
      args,
      value,
    } = body ?? {};

    if (
      !walletAddress ||
      !contractAddress ||
      !abi ||
      !functionName ||
      !Array.isArray(args) ||
      typeof value !== "string"
    ) {
      return NextResponse.json(
        { message: "Invalid request body for Crossmint transaction" },
        { status: 400 }
      );
    }

    const url = `${CROSSMINT_API_BASE}/wallets/${encodeURIComponent(
      walletAddress
    )}/transactions`;

    const payload = {
      params: {
        chain: "scroll-sepolia",
        calls: [
          {
            address: contractAddress,
            abi,
            functionName,
            args,
            value,
          },
        ],
      },
    };

    console.log("Sending to Crossmint:", JSON.stringify(payload, null, 2));

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": env.CROSSMINT_SERVER_API_KEY,
      },
      body: JSON.stringify(payload),
    });

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

      console.error(
        "Crossmint API error:",
        response.status,
        response.statusText,
        JSON.stringify(json, null, 2)
      );

      return NextResponse.json(
        { message: `Crossmint API error: ${message}`, raw: json },
        { status: response.status }
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error in /api/transactions POST:", error);
    return NextResponse.json(
      { message: "Internal error creating Crossmint transaction" },
      { status: 500 }
    );
  }
}


