import dynamic from 'next/dynamic';

const NFTLaunchpad = dynamic(() => import('./components/NFTLaunchpad'), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-[#2A0E61] bg-[linear-gradient(45deg,#FFD700,#FFA500)] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center pixel-font">
          ⚡ Pika NFT Minter v1.0 ⚡
        </h1>
        <div className="mx-auto">
          <NFTLaunchpad />
        </div>
      </div>
    </main>
  );
}