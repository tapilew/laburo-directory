"use client";

import { QueryClient } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { type State } from "wagmi";

import { WagmiWrapper } from "@/components/wagmi-wrapper";
import { NetworkChecker } from "@/components/network-checker";

export function Providers(props: {
  children: ReactNode;
  initialState?: State;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiWrapper queryClient={queryClient}>
      <NetworkChecker />
      {props.children}
    </WagmiWrapper>
  );
}
