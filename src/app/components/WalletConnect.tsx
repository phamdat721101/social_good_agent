'use client';

import { useState, useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { createWeb3Modal } from '@web3modal/wagmi';
import { useAccount, useNetwork, useSwitchNetwork, configureChains, createConfig } from 'wagmi';
import { useWallet as useAptosWallet } from '@aptos-labs/wallet-adapter-react';
import { useWallet } from '../providers';
import { EthereumClient, w3mConnectors, w3mProvider } from '@web3modal/ethereum';
import { base, baseSepolia } from 'wagmi/chains';

// Replace with your WalletConnect Project ID
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID';

// Configure chains and provider
const { chains, publicClient } = configureChains(
  [base, baseSepolia],
  [w3mProvider({ projectId })]
);

// Create the wagmi config
const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, chains }),
  publicClient,
});

// Initialize Ethereum client
const ethereumClient = new EthereumClient(wagmiConfig, chains);

// <-- IMPORTANT: Call createWeb3Modal at module initialization -->
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
});

export default function WalletConnect() {
  const { chains: availableChains, switchNetwork } = useSwitchNetwork();
  const { open } = useWeb3Modal();
  const { address: evmWalletAddress, isConnected: isEvmConnected } = useAccount();
  const { chain } = useNetwork();

  const { 
    connect: connectAptos, 
    account: aptosAccount, 
    connected: isAptosConnected, 
    disconnect: disconnectAptos,
    wallets: aptosWallets
  } = useAptosWallet();

  const { 
    activeChain, 
    setActiveChain, 
    setEvmAddress, 
    setAptosAddress 
  } = useWallet();

  const [isBaseNetwork, setIsBaseNetwork] = useState(false);

  useEffect(() => {
    if (isEvmConnected && evmWalletAddress) {
      setEvmAddress(evmWalletAddress);
      setActiveChain('evm');
      setIsBaseNetwork(chain?.id === 8453 || chain?.id === 84532);

      if (chain && chain.id !== 8453 && chain.id !== 84532) {
        const baseChain = availableChains.find(c => c.id === 8453) || availableChains.find(c => c.id === 84532);
        if (baseChain && switchNetwork) {
          switchNetwork(baseChain.id);
        }
      }
    } else {
      setEvmAddress(null);
      if (activeChain === 'evm') {
        setActiveChain(null);
      }
    }
  }, [isEvmConnected, evmWalletAddress, chain, setEvmAddress, setActiveChain, activeChain, availableChains, switchNetwork]);

  useEffect(() => {
    if (isAptosConnected && aptosAccount?.address) {
      setAptosAddress(aptosAccount.address);
      setActiveChain('aptos');
    } else {
      setAptosAddress(null);
      if (activeChain === 'aptos') {
        setActiveChain(null);
      }
    }
  }, [isAptosConnected, aptosAccount, setAptosAddress, setActiveChain, activeChain]);

  const connectEvm = async () => {
    await open();
  };

  const connectPetra = async () => {
    const petraWallet = aptosWallets.find(wallet => wallet.name === 'Petra');
    if (petraWallet) {
      await connectAptos(petraWallet.name);
    }
  };

  const disconnectWallet = async () => {
    if (activeChain === 'aptos' && isAptosConnected) {
      await disconnectAptos();
    }
    // For EVM, disconnection is managed by Web3Modal
  };

  const getWalletDisplay = () => {
    if (activeChain === 'evm' && evmWalletAddress) {
      return `${evmWalletAddress.slice(0, 6)}...${evmWalletAddress.slice(-4)}`;
    } else if (activeChain === 'aptos' && aptosAccount?.address) {
      return `${aptosAccount.address.slice(0, 6)}...${aptosAccount.address.slice(-4)}`;
    }
    return null;
  };

  const walletDisplay = getWalletDisplay();

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {!activeChain && (
        <>
          <button onClick={connectEvm} className="ai-button ai-button-primary">
            Connect MetaMask
          </button>
          <button onClick={connectPetra} className="ai-button bg-blue-600 text-white hover:bg-blue-700">
            Connect Petra
          </button>
        </>
      )}

      {activeChain && walletDisplay && (
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <div className={`w-2 h-2 rounded-full mr-2 ${activeChain === 'evm' ? (isBaseNetwork ? 'bg-blue-500' : 'bg-yellow-500') : 'bg-blue-500'}`}></div>
            <span className="text-sm font-medium">
              {activeChain === 'evm' ? (isBaseNetwork ? 'Base' : 'Ethereum') : 'Aptos'}
            </span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-sm font-mono">{walletDisplay}</span>
          </div>
          <button onClick={disconnectWallet} className="ai-button bg-gray-200 text-gray-700 hover:bg-gray-300">
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
