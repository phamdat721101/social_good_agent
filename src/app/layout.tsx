import './globals.css'

export const metadata = {
  title: 'AI NFT Launchpad',
  description: 'Mint NFTs based on Twitter interactions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}