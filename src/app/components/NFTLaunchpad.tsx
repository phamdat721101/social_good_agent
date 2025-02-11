'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Image from 'next/image';

const contractABI = [
  "function mintNFT(address recipient, string memory prompt, string memory model, string memory twitterInteraction) public returns (uint256)",
  "function getAIParameters(uint256 tokenId) public view returns (string memory prompt, string memory model, uint256 timestamp, string memory twitterInteraction)"
];

const contractAddress = "0x1234567890123456789012345678901234567890"; // Mock contract address

export default function NFTLaunchpad() {
  const [twitterHandle, setTwitterHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [previewStep, setPreviewStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [mintedNFT, setMintedNFT] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (isAnalyzing) {
      setLoading(true);
      setShowPreview(true);
      setMintedNFT(null);
      setPreviewStep(1);

      timeoutId = setTimeout(() => {
        setPreviewStep(2);
        timeoutId = setTimeout(() => {
          setPreviewStep(3);
          setLoading(false);
          setIsAnalyzing(false);
        }, 1000);
      }, 1000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAnalyzing]);

  const handleAnalyze = () => {
    if (!twitterHandle) return;
    setIsAnalyzing(true);
  };

  const handleMint = async () => {
    try {
      setLoading(true);
      setStatus('⚡ Charging up...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStatus('⚡ Pika Pi...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockTx = {
        hash: '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join(''),
        wait: async () => ({ status: 1 })
      };
      
      setStatus('⚡ Thunder Strike!');
      await mockTx.wait();
      
      const mockNFT = {
        tokenId: Math.floor(Math.random() * 1000) + 1,
        transactionHash: mockTx.hash,
        openseaLink: `https://opensea.io/assets/ethereum/${contractAddress}/${Math.floor(Math.random() * 1000) + 1}`,
        twitterHandle: twitterHandle
      };
      
      setMintedNFT(mockNFT);
      setStatus('⚡ Pika Pika! NFT caught successfully!');
    } catch (error) {
      console.error('Minting error:', error);
      setStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-[#2C2C54] rounded-xl shadow-xl p-8 pixel-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-[#FFD700] pixel-font text-sm mb-2">
                TRAINER ID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-[#FFD700]">
                  @
                </span>
                <input
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  className="pl-8 w-full px-4 py-2 bg-[#3B3B7A] border-2 border-[#FFD700] rounded-lg text-[#FFD700] focus:ring-2 focus:ring-[#FFA500] focus:border-transparent pixel-border"
                  placeholder="username"
                  disabled={loading}
                />
              </div>
            </div>
            
            <button
              onClick={handleAnalyze}
              disabled={loading || !twitterHandle}
              className="w-full pikachu-gradient text-black pixel-font py-3 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 pixel-button"
            >
              {loading ? '⚡ CHARGING...' : '⚡ ANALYZE TRAINER'}
            </button>
          </div>

          <div className="bg-[#3B3B7A] rounded-lg p-6 pixel-border">
            {!showPreview ? (
              <div className="h-full flex items-center justify-center text-[#FFD700] pixel-font text-center">
                Enter Trainer ID to catch your NFT!
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden pixel-border">
                  <Image
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif"
                    alt="Pikachu NFT Preview"
                    width={400}
                    height={400}
                    className={`rounded-lg ${loading ? 'loading-pixel' : ''}`}
                    priority
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${previewStep >= 1 ? 'bg-[#FFD700]' : 'bg-gray-600'} loading-pixel`} />
                    <span className={`pixel-font text-xs ${previewStep >= 1 ? 'text-[#FFD700]' : 'text-gray-500'}`}>CHARGING...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${previewStep >= 2 ? 'bg-[#FFD700]' : 'bg-gray-600'} loading-pixel`} />
                    <span className={`pixel-font text-xs ${previewStep >= 2 ? 'text-[#FFD700]' : 'text-gray-500'}`}>PIKA PI...</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${previewStep >= 3 ? 'bg-[#FFD700]' : 'bg-gray-600'} loading-pixel`} />
                    <span className={`pixel-font text-xs ${previewStep >= 3 ? 'text-[#FFD700]' : 'text-gray-500'}`}>READY!</span>
                  </div>
                </div>
                {previewStep === 3 && !mintedNFT && (
                  <button
                    onClick={handleMint}
                    disabled={loading}
                    className="w-full pikachu-gradient text-black pixel-font py-2 px-4 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 pixel-button electric-flash"
                  >
                    {loading ? '⚡ CATCHING...' : '⚡ CATCH NFT'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-lg pixel-border ${status.includes('Error') ? 'bg-red-900 text-red-200' : 'bg-[#3B3B7A] text-[#FFD700]'}`}>
          <p className="text-center pixel-font text-sm">{status}</p>
        </div>
      )}

      {mintedNFT && (
        <div className="bg-[#2C2C54] rounded-xl shadow-xl p-8 space-y-4 pixel-border">
          <h2 className="text-2xl pixel-font text-center text-[#FFD700]">PIKA PIKA! NFT CAUGHT! ⚡</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-[#FFD700]">
              <span className="pixel-font text-[#FFD700]">POKEMON ID:</span>
              <span className="text-[#FFD700]">#{mintedNFT.tokenId}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#FFD700]">
              <span className="pixel-font text-[#FFD700]">CATCH HASH:</span>
              <a 
                href={`https://etherscan.io/tx/${mintedNFT.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFA500] hover:text-[#FFD700] truncate ml-2"
              >
                {`${mintedNFT.transactionHash.slice(0, 6)}...${mintedNFT.transactionHash.slice(-4)}`}
              </a>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#FFD700]">
              <span className="pixel-font text-[#FFD700]">TRAINER:</span>
              <a 
                href={`https://twitter.com/${mintedNFT.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFA500] hover:text-[#FFD700]"
              >
                @{mintedNFT.twitterHandle}
              </a>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="pixel-font text-[#FFD700]">POKEDEX:</span>
              <a 
                href={mintedNFT.openseaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFA500] hover:text-[#FFD700]"
              >
                VIEW NFT
              </a>
            </div>
          </div>
          <div className="mt-6">
            <a
              href={`https://twitter.com/intent/tweet?text=⚡ Pika Pika! Just caught my Pokemon NFT! Check it out: ${encodeURIComponent(mintedNFT.openseaLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center pikachu-gradient text-black pixel-font py-3 px-6 rounded-lg hover:opacity-90 transition-all pixel-button"
            >
              SHARE WITH TRAINERS
            </a>
          </div>
        </div>
      )}
    </div>
  );
}