import { cookieStorage, createConfig, createStorage, http } from "wagmi";
import { scrollSepolia } from "wagmi/chains";

export function getConfig() {
  return createConfig({
    chains: [scrollSepolia],
    connectors: [],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [scrollSepolia.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}
