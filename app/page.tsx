'use client';

import { Header } from '@/components/layout/header';
import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { FloatingDots } from '@/components/ui/floating-dots';
import { usePolkadotWallet } from '@/hooks/use-polkadot-wallet';
import { useEffect } from 'react';

export default function Home() {
  const { initializeWallet } = usePolkadotWallet();

  useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 relative overflow-hidden">
      <FloatingDots />
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
    </div>
  );
}