"use client";

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

  return (
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
  );
}
