import { NextResponse } from "next/server";

import { env } from "@/env";

const CROSSMINT_API_BASE =
  "https://staging.crossmint.com/api/2025-06-09" as const;

type RouteContext = {
  params: {
    txId: string;
  };
};

export async function GET(request: Request, context: RouteContext) {
  try {
    const { txId } = context.params;
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress || !txId) {
      return NextResponse.json(
        { message: "walletAddress and txId are required" },
        { status: 400 }
      );
    }

    const url = `${CROSSMINT_API_BASE}/wallets/${encodeURIComponent(
      walletAddress
    )}/transactions/${encodeURIComponent(txId)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-API-KEY": env.CROSSMINT_SERVER_API_KEY,
      },
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

      return NextResponse.json(
        { message: `Crossmint API error: ${message}`, raw: json },
        { status: response.status }
      );
    }

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error in /api/transactions/[txId] GET:", error);
    return NextResponse.json(
      { message: "Internal error fetching Crossmint transaction" },
      { status: 500 }
    );
  }
}


