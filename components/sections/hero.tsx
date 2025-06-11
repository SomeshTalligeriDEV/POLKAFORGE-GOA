'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Code,
  Globe,
  Award,
  DollarSign,
  Plus,
  GitBranch,
  Wallet, // ✅ FIXED: Import added
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePolkadotWallet } from '@/hooks/use-polkadot-wallet';

export function Hero() {
  const { account, isInitialized } = usePolkadotWallet();

  const features = [
    {
      icon: Code,
      label: 'Polkadot Asset Hub',
      color: 'bg-purple-100 text-purple-700 border-purple-200',
    },
    {
      icon: Globe,
      label: 'IPFS Storage',
      color: 'bg-orange-100 text-orange-700 border-orange-200',
    },
    {
      icon: Award,
      label: 'NFT Authorship',
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    },
    {
      icon: DollarSign,
      label: 'DOT Payments',
      color: 'bg-green-100 text-green-700 border-green-200',
    },
  ];

  const handleCreateRepository = () => {
    if (!account) {
      document
        .querySelector('[data-wallet-connect]')
        ?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    window.location.href = '/create';
  };

  const handleExploreProjects = () => {
    window.location.href = '/explore';
  };

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <div className="text-white font-bold text-2xl">{'</>'}</div>
            </div>
          </div>

          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
          >
            PolkaForge
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-gray-600 mb-8"
          >
            Decentralized GitHub on Polkadot
          </motion.p>
        </motion.div>

        {/* Sub Description */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-2xl md:text-3xl text-gray-800 font-medium max-w-4xl mx-auto mb-12 leading-relaxed"
        >
          Code, Collaborate, Earn — All on Polkadot Chain with automatic{' '}
          <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent font-semibold">
            NFT authorship proof
          </span>{' '}
          and{' '}
          <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent font-semibold">
            IPFS storage
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
        >
          <Button
            size="lg"
            onClick={handleCreateRepository}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!account && isInitialized}
          >
            {account ? (
              <>
                <Plus className="w-5 h-5 mr-2" />
                Create Repository
              </>
            ) : (
              <>
                <Code className="w-5 h-5 mr-2" />
                Connect Wallet to Start
              </>
            )}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleExploreProjects}
            className="px-8 py-6 text-lg font-semibold rounded-full border-2 border-gray-300 hover:border-gray-400 transition-all duration-300"
          >
            <GitBranch className="w-5 h-5 mr-2" />
            Explore Projects
          </Button>
        </motion.div>

        {/* Feature Badges */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
            >
              <Badge
                className={`px-4 py-2 text-sm font-medium border ${feature.color} hover:scale-105 transition-transform duration-200`}
              >
                <feature.icon className="w-4 h-4 mr-2" />
                {feature.label}
              </Badge>
            </motion.div>
          ))}
        </motion.div>

        {/* Wallet Connection Notice */}
        {isInitialized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-8"
          >
            {!account ? (
              <div
                className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto"
                data-wallet-connect
              >
                <div className="flex items-center justify-center mb-2">
                  <Wallet className="w-5 h-5 text-yellow-600 mr-2" />
                  <p className="text-yellow-800 text-sm font-medium">
                    Connect your Polkadot wallet to get started
                  </p>
                </div>
                <p className="text-yellow-700 text-xs">
                  Create repositories, earn NFT certificates, and participate in bounties
                </p>
              </div>
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg max-w-md mx-auto">
                <div className="flex items-center justify-center mb-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <p className="text-green-800 text-sm font-medium">
                    Wallet connected successfully!
                  </p>
                </div>
                <p className="text-green-700 text-xs">
                  You're ready to start building on PolkaForge
                </p>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}
