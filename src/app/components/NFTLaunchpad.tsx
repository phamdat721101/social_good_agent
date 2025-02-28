'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NFTLaunchpad() {
  // Registration state
  const [email, setEmail] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationStatus, setRegistrationStatus] = useState('');

  // Simulation state for NFT minting
  const [twitterHandle, setTwitterHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [previewStep, setPreviewStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [mintedNFT, setMintedNFT] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulate the preview steps
  useEffect(() => {
    let timeoutId: any;
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

  // Register the user's email and wallet address, then store it to Supabase along with a generated user ID
  const handleRegister = async () => {
    if (!email || !walletAddress) {
      setRegistrationStatus('Please enter both your email address and wallet address.');
      return;
    }
    setLoading(true);
    setRegistrationStatus('Registering your information...');
    try {
      const userId = crypto.randomUUID();
      const { error } = await supabase
        .from('users')
        .insert([{ id: userId, email, wallet_address: walletAddress }]);
      if (error) {
        setRegistrationStatus(`Error: ${error.message}`);
      } else {
        setRegistrationStatus('Success! Your information has been registered.');
        setIsRegistered(true);
      }
    } catch (error: any) {
      console.log('Register error: ', error);
      setRegistrationStatus(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Begin analyzing the Twitter handle
  const handleAnalyze = () => {
    if (!twitterHandle) return;
    setIsAnalyzing(true);
  };

  // Simulate minting an NFT (now that registration is complete)
  const handleMint = async () => {
    if (!isRegistered) {
      setStatus('Please register your email and wallet address first.');
      return;
    }
    try {
      setLoading(true);
      setStatus('Analyzing profile data...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('Generating AI parameters...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      setStatus('Minting your unique NFT...');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate NFT details
      const mockNFT = {
        tokenId: Math.floor(Math.random() * 1000) + 1,
        transactionHash:
          '0x' +
          Array(64)
            .fill(0)
            .map(() => Math.floor(Math.random() * 16).toString(16))
            .join(''),
        openseaLink: `https://opensea.io/assets/dummy/${Math.floor(Math.random() * 1000) + 1}`,
        twitterHandle,
        network: 'Simulated'
      };
      setMintedNFT(mockNFT);
      setStatus('Success! Your AI-generated NFT has been minted.');
    } catch (error: any) {
      console.error('Minting error:', error);
      setStatus(`Error: ${error.message || 'Failed to mint NFT'}`);
    } finally {
      setLoading(false);
    }
  };

  // Show registration form until the user is registered
  if (!isRegistered) {
    return (
      <div className="max-w-md mx-auto p-6 space-y-4">
        <h1 className="text-xl font-bold text-center">Register for NFT Minting</h1>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="you@example.com"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">
            Wallet Address
          </label>
          <input
            id="wallet"
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            placeholder="0x..."
            disabled={loading}
          />
        </div>
        <button
          onClick={handleRegister}
          disabled={loading || !email || !walletAddress}
          className={`w-full p-2 rounded-md text-white ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Processing...' : 'Register'}
        </button>
        {registrationStatus && (
          <div
            className={`p-2 rounded-md text-center ${
              registrationStatus.includes('Error')
                ? 'bg-red-100 text-red-700'
                : 'bg-green-100 text-green-700'
            }`}
          >
            {registrationStatus}
          </div>
        )}
      </div>
    );
  }

  // Once registered, show the simulation for NFT launchpad
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="ai-card p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="twitter-handle" className="ai-label">
                Twitter Profile
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">@</span>
                <input
                  id="twitter-handle"
                  type="text"
                  value={twitterHandle}
                  onChange={(e) => setTwitterHandle(e.target.value)}
                  className="ai-input pl-8"
                  placeholder="username"
                  disabled={loading}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">
                Enter a Twitter handle to analyze and generate a unique AI NFT
              </p>
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading || !twitterHandle}
              className={`ai-button ai-button-primary w-full ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Analyzing Profile
                </span>
              ) : (
                'Analyze Profile'
              )}
            </button>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            {!showPreview ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-center">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 mx-auto text-gray-400 mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m0 16v1m-8-8h1m16 0h1M5.05 5.05l.707.707M18.243 5.757l-.707.707M5.05 18.95l.707-.707M18.243 18.243l-.707-.707"
                    />
                  </svg>
                  <p>Enter a Twitter handle to generate your AI NFT preview</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif"
                    alt="AI NFT Preview"
                    width={400}
                    height={400}
                    className={`rounded-lg ${loading ? 'ai-loading' : ''}`}
                    priority
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <div className={`ai-status-indicator ${previewStep >= 1 ? 'ai-status-success' : 'bg-gray-300'}`}></div>
                    <span className={`text-xs ${previewStep >= 1 ? 'text-gray-700' : 'text-gray-400'}`}>Profile Analysis</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`ai-status-indicator ${previewStep >= 2 ? 'ai-status-success' : 'bg-gray-300'}`}></div>
                    <span className={`text-xs ${previewStep >= 2 ? 'text-gray-700' : 'text-gray-400'}`}>AI Parameter Generation</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`ai-status-indicator ${previewStep >= 3 ? 'ai-status-success' : 'bg-gray-300'}`}></div>
                    <span className={`text-xs ${previewStep >= 3 ? 'text-gray-700' : 'text-gray-400'}`}>NFT Ready</span>
                  </div>
                </div>
                {previewStep === 3 && (
                  <button
                    onClick={handleMint}
                    disabled={loading}
                    className={`ai-button ai-button-secondary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Processing...' : 'Mint NFT'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {status && (
        <div className={`p-4 rounded-lg ${status.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
          <p className="text-center text-sm">{status}</p>
        </div>
      )}

      {mintedNFT && (
        <div className="ai-card p-6 md:p-8 space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-800">NFT Successfully Minted</h2>
          <div className="ai-divider"></div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">Token ID:</span>
              <span className="text-gray-900 font-mono">#{mintedNFT.tokenId}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">Network:</span>
              <span className="text-gray-900">{mintedNFT.network}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">Transaction:</span>
              <a
                href={`https://opensea.io/assets/dummy/${mintedNFT.tokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 ai-truncate ml-2 font-mono"
              >
                {`${mintedNFT.transactionHash.slice(0, 6)}...${mintedNFT.transactionHash.slice(-4)}`}
              </a>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">Twitter Profile:</span>
              <a
                href={`https://twitter.com/${mintedNFT.twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                @{mintedNFT.twitterHandle}
              </a>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="font-medium text-gray-700">View NFT:</span>
              <a
                href={mintedNFT.openseaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                View NFT
              </a>
            </div>
          </div>
          <div className="mt-6">
            <a
              href={`https://twitter.com/intent/tweet?text=I just minted an AI-generated NFT! Check it out: ${encodeURIComponent(mintedNFT.openseaLink)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ai-button ai-button-primary w-full flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Share on Twitter
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
