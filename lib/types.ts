// Global type declarations for wallet extensions
declare global {
  interface Window {
    injectedWeb3?: {
      'polkadot-js'?: any;
      'talisman'?: any;
      'subwallet-js'?: any;
    };
  }
}

export {};