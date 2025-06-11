'use client';

import React, { useState } from 'react';
import { Wallet, ChevronDown, Copy, ExternalLink } from 'lucide-react';
import { usePolkadotWallet } from '@/hooks/usePolkadotWallet';
import { Button } from '@/components/ui/button';

type WalletType = {
  name: 'talisman' | 'polkadot-js' | 'subwallet-js';
  title: string;
  logo: React.ReactNode;
  installed: boolean;
};

export default function WalletConnect() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const {
    account,
    availableWallets,
    isConnecting,
    connectWallet,
    disconnectWallet,
    balance,
    error,
  } = usePolkadotWallet();

  const handleConnect = async (walletName: WalletType['name']) => {
    try {
      await connectWallet(walletName);
      setIsDropdownOpen(false);
    } catch (error) {
      // Error is already handled in the hook
      console.error('Connection failed:', error);
    }
  };

  const copyAddress = async () => {
    if (account?.address) {
      try {
        await navigator.clipboard.writeText(account.address);
        // You can add a toast notification here
        console.log('Address copied to clipboard');
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
  };

  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  const openInExplorer = () => {
    if (account?.address) {
      const explorerUrl = `https://polkadot.subscan.io/account/${account.address}`;
      window.open(explorerUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Connected wallet dropdown
  if (account) {
    return (
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="min-w-[200px] justify-between"
        >
          <div className="flex items-center">
            <Wallet className="w-4 h-4 mr-2" />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{formatAddress(account.address)}</span>
              <span className="text-xs text-gray-500">{balance} DOT</span>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>

        {isDropdownOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsDropdownOpen(false)}
            />

            {/* Dropdown */}
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Connected Wallet</span>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full capitalize">
                    {account.meta.source}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Account Name</label>
                    <p className="text-sm font-medium">{account.meta.name}</p>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Address</label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 text-sm font-mono bg-gray-50 px-2 py-1 rounded border">
                        {formatAddress(account.address)}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={copyAddress}
                        className="p-1 h-8 w-8"
                        title="Copy address"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Balance</label>
                    <p className="text-sm font-medium">{balance} DOT</p>
                  </div>
                </div>

                <div className="flex space-x-2 mt-4 pt-3 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={openInExplorer}
                    className="flex-1 text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Explorer
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={disconnectWallet}
                    className="flex-1 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }

  // Connect wallet dropdown
  return (
    <div className="relative">
      <Button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        disabled={isConnecting}
        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>

      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Connect a Wallet</h3>

              {error && (
                <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-700 text-xs">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                {availableWallets.map((wallet: WalletType) => (
                  <button
                    key={wallet.name}
                    onClick={() => wallet.installed && handleConnect(wallet.name)}
                    disabled={!wallet.installed || isConnecting}
                    className={`w-full flex items-center justify-between p-3 border rounded-lg transition-all duration-200 ${
                      wallet.installed
                        ? 'border-gray-200 hover:bg-gray-50 hover:border-gray-300 cursor-pointer'
                        : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{wallet.logo}</span>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">{wallet.title}</p>
                        <p className="text-xs text-gray-500">
                          {wallet.installed ? 'Ready to connect' : 'Not installed'}
                        </p>
                      </div>
                    </div>
                    {!wallet.installed && (
                      <span
                        className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          const installUrls: Record<WalletType['name'], string> = {
                            talisman: 'https://talisman.xyz/',
                            'polkadot-js': 'https://polkadot.js.org/extension/',
                            'subwallet-js': 'https://subwallet.app/',
                          };
                          window.open(installUrls[wallet.name], '_blank', 'noopener,noreferrer');
                        }}
                      >
                        Install
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {availableWallets.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-2">No wallets detected</p>
                  <p className="text-xs text-gray-400">Please install a Polkadot wallet extension</p>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 text-center">
                  New to Polkadot wallets?{' '}
                  <a
                    href="https://polkadot.network/ecosystem/wallets/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline"
                  >
                    Learn more
                  </a>
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
