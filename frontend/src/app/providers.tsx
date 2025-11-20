"use client";

import { env } from "@/env";
import {
  CrossmintProvider,
  CrossmintAuthProvider,
  CrossmintWalletProvider,
} from "@crossmint/client-sdk-react-ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State } from "wagmi";

import { WagmiWrapper } from "@/components/wagmi-wrapper";
import { NetworkChecker } from "@/components/network-checker";

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [queryClient] = useState(() => new QueryClient());

  const apiKey = env.NEXT_PUBLIC_CROSSMINT_CLIENT_API_KEY;

  return (
    <CrossmintProvider apiKey={apiKey}>
      <CrossmintAuthProvider>
        <CrossmintWalletProvider
          createOnLogin={{
            chain: "scroll-sepolia",
            type: "evm-mpc-wallet",
            signer: {
              type: "email",
            },
          }}
        >
          <WagmiWrapper queryClient={queryClient}>
            <NetworkChecker />
            {props.children}
          </WagmiWrapper>
        </CrossmintWalletProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  );
}
