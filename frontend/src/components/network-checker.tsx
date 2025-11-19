'use client'

import { useEffect } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { scrollSepolia } from 'wagmi/chains'

export function NetworkChecker() {
  const { switchChain } = useSwitchChain()
  const { isConnected, chainId } = useAccount()

  useEffect(() => {
    if (isConnected && chainId && chainId !== scrollSepolia.id) {
      switchChain({ chainId: scrollSepolia.id })
    }
  }, [chainId, isConnected, switchChain])

  return null
}

