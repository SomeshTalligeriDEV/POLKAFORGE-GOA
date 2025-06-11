'use client';

import { useState, useEffect, useCallback } from 'react';

export function usePolkadotWallet() {
  const [state, setState] = useState({
    api: null,
    account: null,
    balance: '0.00',
    isConnecting: false,
    availableWallets: [],
    isInitialized: false,
    error: null
  });

  const detectWallets = useCallback(() => {
    if (typeof window === 'undefined') return [];

    const wallets = [
      {
        name: 'talisman',
        title: 'Talisman',
        logo: '🔮',
        installed: !!(window.injectedWeb3 && window.injectedWeb3.talisman)
      },
      {
        name: 'polkadot-js',
        title: 'Polkadot{.js}',
        logo: '🟣',
        installed: !!(window.injectedWeb3 && window.injectedWeb3['polkadot-js'])
      },
      {
        name: 'subwallet-js',
        title: 'SubWallet',
        logo: '💎',
        installed: !!(window.injectedWeb3 && window.injectedWeb3['subwallet-js'])
      }
    ];

    return wallets;
  }, []);

  const initializeApi = useCallback(async () => {
    try {
      // For real implementation, use:
      // const { ApiPromise, WsProvider } = await import('@polkadot/api');
      // const provider = new WsProvider('wss://rpc.polkadot.io');
      // const api = await ApiPromise.create({ provider });
      
      // Mock API for demo
      const mockApi = {
        query: {
          system: {
            account: async (address) => ({
              data: { free: '1000000000000' }
            })
          }
        },
        disconnect: () => {}
      };

      setState(prev => ({ ...prev, api: mockApi }));
      return mockApi;
    } catch (error) {
      console.error('Failed to initialize API:', error);
      setState(prev => ({ ...prev, error: 'Failed to connect to Polkadot network' }));
      return null;
    }
  }, []);

  const updateBalance = useCallback(async (address) => {
    if (!state.api || !address) return;

    try {
      const accountData = await state.api.query.system.account(address);
      // For real implementation, use formatBalance from @polkadot/util
      const balance = (parseFloat(accountData.data.free) / 1e10).toFixed(2);
      
      setState(prev => ({ ...prev, balance }));
    } catch (error) {
      console.error('Failed to fetch balance:', error);
      setState(prev => ({ ...prev, balance: '0.00' }));
    }
  }, [state.api]);

  const connectWallet = useCallback(async (walletName) => {
    setState(prev => ({ ...prev, isConnecting: true, error: null }));

    try {
      // Check if wallet is available
      if (!window.injectedWeb3?.[walletName]) {
        throw new Error(`${walletName} wallet not found. Please install the extension.`);
      }

      const injector = window.injectedWeb3[walletName];
      
      // Enable the extension
      if (injector.enable) {
        await injector.enable('PolkaForge');
      }
      
      // Get accounts
      let accounts = [];
      if (injector.accounts && injector.accounts.get) {
        accounts = await injector.accounts.get();
      } else {
        // Fallback for different wallet APIs
        const { web3Accounts } = await import('@polkadot/extension-dapp');
        const allAccounts = await web3Accounts();
        accounts = allAccounts.filter(acc => acc.meta.source === walletName);
      }
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please create an account in your wallet.');
      }

      const account = {
        address: accounts[0].address,
        meta: {
          name: accounts[0].name || accounts[0].meta?.name || 'Account 1',
          source: walletName
        }
      };

      setState(prev => ({
        ...prev,
        account,
        isConnecting: false
      }));

      // Update balance
      await updateBalance(account.address);
      
      return account;
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setState(prev => ({
        ...prev,
        isConnecting: false,
        error: error.message
      }));
      throw error;
    }
  }, [updateBalance]);

  const disconnectWallet = useCallback(() => {
    setState(prev => ({
      ...prev,
      account: null,
      balance: '0.00',
      error: null
    }));
  }, []);

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      const wallets = detectWallets();
      await initializeApi();
      
      setState(prev => ({
        ...prev,
        availableWallets: wallets,
        isInitialized: true
      }));
    };

    initialize();
  }, [detectWallets, initializeApi]);

  // Cleanup API connection
  useEffect(() => {
    return () => {
      if (state.api && state.api.disconnect) {
        state.api.disconnect();
      }
    };
  }, [state.api]);

  return {
    ...state,
    connectWallet,
    disconnectWallet,
    updateBalance
  };
}