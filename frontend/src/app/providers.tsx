"use client";

import { env } from "@/env";
import {
  CrossmintProvider,
  CrossmintAuthProvider,
  CrossmintWalletProvider,
} from "@crossmint/client-sdk-react-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State, WagmiProvider } from "wagmi";

import { getConfig } from "@/wagmi";
import { NetworkChecker } from "@/components/network-checker";

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [config] = useState(() => getConfig());
  const [queryClient] = useState(() => new QueryClient());

  const apiKey = env.NEXT_PUBLIC_CROSSMINT_CLIENT_API_KEY;

  return (
    <CrossmintProvider apiKey={apiKey}>
      <CrossmintAuthProvider>
        <WagmiProvider
          config={config}
          reconnectOnMount={true}
          initialState={props.initialState}
        >
          <QueryClientProvider client={queryClient}>
            <NetworkChecker />
            {props.children}
          </QueryClientProvider>
        </WagmiProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}
