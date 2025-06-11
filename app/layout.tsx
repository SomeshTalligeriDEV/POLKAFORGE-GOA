import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PolkaForge - Decentralized GitHub on Polkadot',
  description: 'Code, Collaborate, Earn — All on Polkadot Chain with automatic NFT authorship proof and IPFS storage',
  keywords: ['polkadot', 'blockchain', 'github', 'decentralized', 'ipfs', 'nft'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}