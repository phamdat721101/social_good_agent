'use client';

import { ReactNode, createContext, useContext, useState } from 'react';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';

// Aptos wallets
const wallets = [new PetraWallet()];

// EVM configuration
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';
const { chains, publicClient } = configureChains(
  [base, baseSepolia],
  [w3mProvider({ projectId })]
);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

// Wallet context
type WalletContextType = {
  activeChain: 'evm' | 'aptos' | null;
  setActiveChain: (chain: 'evm' | 'aptos' | null) => void;
  evmAddress: string | null;
  setEvmAddress: (address: string | null) => void;
  aptosAddress: string | null;
  setAptosAddress: (address: string | null) => void;
};

const WalletContext = createContext<WalletContextType>({
  activeChain: null,
  setActiveChain: () => {},
  evmAddress: null,
  setEvmAddress: () => {},
  aptosAddress: null,
  setAptosAddress: () => {},
});

export const useWallet = () => useContext(WalletContext);

export function Providers({ children }: { children: ReactNode }) {
  const [activeChain, setActiveChain] = useState<'evm' | 'aptos' | null>(null);
  const [evmAddress, setEvmAddress] = useState<string | null>(null);
  const [aptosAddress, setAptosAddress] = useState<string | null>(null);

  return (
    <>
      <WalletContext.Provider
        value={{
          activeChain,
          setActiveChain,
          evmAddress,
          setEvmAddress,
          aptosAddress,
          setAptosAddress,
        }}
      >
        <WagmiConfig config={wagmiConfig}>
          <AptosWalletAdapterProvider plugins={wallets} autoConnect={false}>
            {children}
          </AptosWalletAdapterProvider>
        </WagmiConfig>
      </WalletContext.Provider>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}