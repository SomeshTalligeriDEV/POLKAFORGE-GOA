'use client';

import { useState } from 'react';
import { Search, MessageSquare, Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WalletConnect from '@/components/wallet/WalletConnect';
import { usePolkadotWallet } from '@/hooks/usePolkadotWallet';

export function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { account } = usePolkadotWallet();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg shadow-md">
              <div className="text-white font-bold text-xl">{'</>'}</div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              PolkaForge
            </span>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-6">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              Explore
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Jobs
            </Button>
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Chat
            </Button>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-300 focus:ring-purple-200 transition-all duration-200 w-full"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* New Project Button */}
            <Button
              className={`bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-md transition-all duration-200 ${
                !account ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg'
              }`}
              disabled={!account}
              title={!account ? 'Connect wallet to create new projects' : 'Create new project'}
            >
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>

            {/* Wallet Connect */}
            <WalletConnect />
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-300 focus:ring-purple-200 transition-all duration-200 w-full"
            />
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden mt-3 flex items-center space-x-2 overflow-x-auto">
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            Explore
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            <Briefcase className="w-4 h-4 mr-1" />
            Jobs
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors whitespace-nowrap"
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            AI Chat
          </Button>
        </nav>
      </div>

      {/* Connection Status Indicator */}
      {account && (
        <div className="bg-green-50 border-b border-green-200 px-4 py-1">
          <div className="container mx-auto">
            <p className="text-xs text-green-700 text-center">
              Connected to {account.meta.source} • {account.meta.name}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}