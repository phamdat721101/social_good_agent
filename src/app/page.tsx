"use client"

import dynamic from 'next/dynamic';

const NFTLaunchpad = dynamic(() => import('./components/NFTLaunchpad'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">
          <span className="ai-text-gradient">AI-Powered NFT Generator</span>
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Connect your wallet, analyze a Twitter profile, and mint a unique AI-generated NFT on Base or Aptos
        </p>
        <div className="mx-auto">
          <NFTLaunchpad />
        </div>
      </div>
    </main>
  );
}