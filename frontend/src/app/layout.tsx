import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { headers } from "next/headers";
import { type ReactNode } from "react";
import { cookieToInitialState } from "wagmi";

import { getConfig } from "../wagmi";
import { Providers } from "./providers";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Laburo Directory | Staked Talent Marketplace",
  description: "Hire staked, verified talent on Scroll. Professionals lock ETH as skin in the game. You unlock warm, high-intent leads with a simple on-chain payment.",
  keywords: ["talent", "web3", "scroll", "ethereum", "staking", "hiring", "freelance"],
  authors: [{ name: "Laburo" }],
  openGraph: {
    title: "Laburo Directory | Staked Talent Marketplace",
    description: "Hire staked, verified talent on Scroll. Professionals lock ETH as skin in the game.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Laburo Directory | Staked Talent Marketplace",
    description: "Hire staked, verified talent on Scroll. Professionals lock ETH as skin in the game.",
  },
};

export default async function RootLayout(props: { children: ReactNode }) {
  const initialState = cookieToInitialState(
    getConfig(),
    (await headers()).get("cookie")
  );
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${ibmPlexMono.variable}`}>
      <body className="font-mono antialiased">
        <Providers initialState={initialState}>{props.children}</Providers>
      </body>
    </html>
  );
}
