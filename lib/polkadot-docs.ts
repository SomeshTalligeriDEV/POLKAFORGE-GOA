export interface PolkadotDoc {
  id: string
  title: string
  category: string
  description: string
  content: string
  tags: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  lastUpdated: string
  readTime: number
  author: string
  examples?: {
    title: string
    code: string
    language: string
  }[]
}

export const polkadotDocs: PolkadotDoc[] = [
  {
    id: "polkadot-intro",
    title: "Introduction to Polkadot",
    category: "Getting Started",
    description: "Learn the fundamentals of Polkadot's multi-chain architecture and how it enables interoperability.",
    content: `# Introduction to Polkadot

Polkadot is a next-generation blockchain protocol that enables multiple specialized blockchains to operate together in a unified network. It's designed to solve the scalability, interoperability, and governance challenges facing blockchain technology today.

## Key Concepts

### Relay Chain
The heart of Polkadot, providing shared security and consensus for the entire network.

### Parachains
Independent blockchains that run in parallel, each optimized for specific use cases.

### Bridges
Connections to external networks like Bitcoin and Ethereum.

### Nominated Proof-of-Stake (NPoS)
Polkadot's consensus mechanism that ensures security and decentralization.

## Why Polkadot?

1. **Interoperability**: Seamless communication between different blockchains
2. **Scalability**: Parallel processing through parachains
3. **Shared Security**: All parachains benefit from the Relay Chain's security
4. **Governance**: On-chain governance for protocol upgrades
5. **Customization**: Build application-specific blockchains`,
    tags: ["polkadot", "blockchain", "interoperability", "parachains"],
    difficulty: "beginner",
    lastUpdated: "2024-01-15",
    readTime: 8,
    author: "Polkadot Foundation",
  },
  {
    id: "substrate-framework",
    title: "Substrate Framework",
    category: "Development",
    description: "Build custom blockchains with Substrate, the framework powering Polkadot.",
    content: `# Substrate Framework

Substrate is a modular framework for building blockchains. It's the technology that powers Polkadot and enables developers to create custom blockchains quickly and efficiently.

## Core Components

### Runtime
The state transition function that defines your blockchain's logic.

### Node
The outer part that handles networking, consensus, and RPC.

### Pallets
Modular components that provide specific functionality.

## Key Features

- **Modular Architecture**: Mix and match components
- **Upgradeable Runtime**: Forkless upgrades
- **Consensus Agnostic**: Choose your consensus mechanism
- **WebAssembly**: Runtime compiled to WASM for performance

## Getting Started

1. Install Rust and required dependencies
2. Clone the Substrate Node Template
3. Customize your runtime with pallets
4. Build and run your blockchain`,
    tags: ["substrate", "framework", "development", "rust"],
    difficulty: "intermediate",
    lastUpdated: "2024-01-14",
    readTime: 12,
    author: "Parity Technologies",
    examples: [
      {
        title: "Basic Pallet Structure",
        language: "rust",
        code: `#[frame_support::pallet]
pub mod pallet {
    use frame_support::pallet_prelude::*;
    use frame_system::pallet_prelude::*;

    #[pallet::pallet]
    #[pallet::generate_store(pub(super) trait Store)]
    pub struct Pallet<T>(_);

    #[pallet::config]
    pub trait Config: frame_system::Config {
        type RuntimeEvent: From<Event<Self>> + IsType<<Self as frame_system::Config>::RuntimeEvent>;
    }

    #[pallet::storage]
    #[pallet::getter(fn something)]
    pub type Something<T> = StorageValue<_, u32>;

    #[pallet::event]
    #[pallet::generate_deposit(pub(super) fn deposit_event)]
    pub enum Event<T: Config> {
        SomethingStored(u32, T::AccountId),
    }

    #[pallet::call]
    impl<T: Config> Pallet<T> {
        #[pallet::weight(10_000)]
        pub fn do_something(origin: OriginFor<T>, something: u32) -> DispatchResult {
            let who = ensure_signed(origin)?;
            Something::<T>::put(&something);
            Self::deposit_event(Event::SomethingStored(something, who));
            Ok(())
        }
    }
}`,
      },
    ],
  },
  {
    id: "polkadot-js-api",
    title: "Polkadot.js API",
    category: "Development",
    description: "Connect to Polkadot networks and interact with parachains using JavaScript/TypeScript.",
    content: `# Polkadot.js API

The Polkadot.js API is a JavaScript library that provides a comprehensive interface for interacting with Polkadot and Substrate-based chains.

## Installation

\`\`\`bash
npm install @polkadot/api
\`\`\`

## Basic Usage

### Connecting to a Node

\`\`\`javascript
import { ApiPromise, WsProvider } from '@polkadot/api';

const wsProvider = new WsProvider('wss://rpc.polkadot.io');
const api = await ApiPromise.create({ provider: wsProvider });
\`\`\`

### Querying Chain State

\`\`\`javascript
// Get the latest block
const lastHeader = await api.rpc.chain.getHeader();
console.log('Latest block:', lastHeader.number.toNumber());

// Get account balance
const balance = await api.query.system.account('5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY');
console.log('Balance:', balance.data.free.toHuman());
\`\`\`

### Submitting Transactions

\`\`\`javascript
// Transfer tokens
const transfer = api.tx.balances.transfer(dest, amount);
const hash = await transfer.signAndSend(sender);
console.log('Transaction hash:', hash.toHex());
\`\`\`

## Advanced Features

- **Metadata**: Automatic type generation from chain metadata
- **Events**: Subscribe to chain events and state changes
- **Batch Transactions**: Execute multiple transactions atomically
- **Multi-signature**: Support for multi-sig accounts`,
    tags: ["polkadot-js", "api", "javascript", "typescript"],
    difficulty: "intermediate",
    lastUpdated: "2024-01-13",
    readTime: 15,
    author: "Polkadot.js Team",
    examples: [
      {
        title: "Complete API Connection",
        language: "javascript",
        code: `import { ApiPromise, WsProvider } from '@polkadot/api';
import { Keyring } from '@polkadot/keyring';

async function main() {
  // Create provider and API
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });

  // Create keyring
  const keyring = new Keyring({ type: 'sr25519' });
  const alice = keyring.addFromUri('//Alice');

  // Get chain info
  const chain = await api.rpc.system.chain();
  const version = await api.rpc.system.version();
  console.log(\`Connected to \${chain} v\${version}\`);

  // Subscribe to new blocks
  const unsubscribe = await api.rpc.chain.subscribeNewHeads((header) => {
    console.log(\`New block #\${header.number} with hash \${header.hash}\`);
  });

  // Transfer example
  const transfer = api.tx.balances.transfer(
    '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty',
    12345
  );

  const hash = await transfer.signAndSend(alice);
  console.log('Transfer sent with hash', hash.toHex());
}

main().catch(console.error);`,
      },
    ],
  },
  {
    id: "ink-smart-contracts",
    title: "ink! Smart Contracts",
    category: "Smart Contracts",
    description: "Build WebAssembly smart contracts for Polkadot using the ink! framework.",
    content: `# ink! Smart Contracts

ink! is a Rust-based embedded domain specific language (eDSL) for writing WebAssembly smart contracts specifically for blockchains built on Substrate.

## Why ink!?

- **Rust**: Leverage Rust's safety and performance
- **WebAssembly**: Compile to WASM for near-native performance
- **Substrate Integration**: Built specifically for Substrate chains
- **Small Binary Size**: Optimized for blockchain deployment

## Getting Started

### Installation

\`\`\`bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Install ink! CLI
cargo install cargo-contract --force
\`\`\`

### Create a New Contract

\`\`\`bash
cargo contract new flipper
cd flipper
\`\`\`

## Contract Structure

Every ink! contract has:
- **Storage**: Contract state
- **Constructor**: Initialization logic
- **Messages**: Public functions
- **Events**: Emitted notifications

## Testing

ink! provides comprehensive testing capabilities:
- **Unit Tests**: Test individual functions
- **Integration Tests**: Test contract interactions
- **End-to-End Tests**: Test full deployment scenarios`,
    tags: ["ink", "smart-contracts", "rust", "wasm"],
    difficulty: "advanced",
    lastUpdated: "2024-01-12",
    readTime: 20,
    author: "Parity Technologies",
    examples: [
      {
        title: "Simple Flipper Contract",
        language: "rust",
        code: `#![cfg_attr(not(feature = "std"), no_std)]

use ink_lang as ink;

#[ink::contract]
mod flipper {
    #[ink(storage)]
    pub struct Flipper {
        value: bool,
    }

    impl Flipper {
        #[ink(constructor)]
        pub fn new(init_value: bool) -> Self {
            Self { value: init_value }
        }

        #[ink(constructor)]
        pub fn default() -> Self {
            Self::new(Default::default())
        }

        #[ink(message)]
        pub fn flip(&mut self) {
            self.value = !self.value;
        }

        #[ink(message)]
        pub fn get(&self) -> bool {
            self.value
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn default_works() {
            let flipper = Flipper::default();
            assert_eq!(flipper.get(), false);
        }

        #[ink::test]
        fn it_works() {
            let mut flipper = Flipper::new(false);
            assert_eq!(flipper.get(), false);
            flipper.flip();
            assert_eq!(flipper.get(), true);
        }
    }
}`,
      },
    ],
  },
  {
    id: "xcm-cross-chain",
    title: "XCM Cross-Chain Messaging",
    category: "Interoperability",
    description: "Enable cross-chain communication between parachains using XCM (Cross-Consensus Messaging).",
    content: `# XCM Cross-Chain Messaging

XCM (Cross-Consensus Messaging) is Polkadot's language for communication between different consensus systems, enabling true interoperability.

## What is XCM?

XCM is a messaging format and language used to communicate intentions between chains in the Polkadot ecosystem. It's designed to be:

- **Extensible**: New instructions can be added
- **General**: Works across different consensus systems
- **Efficient**: Minimal overhead for common operations
- **Safe**: Built-in safety mechanisms

## Core Concepts

### MultiLocation
Identifies locations in the consensus universe:
\`\`\`
MultiLocation {
    parents: 1,
    interior: X2(Parachain(1000), AccountId32 { ... })
}
\`\`\`

### MultiAsset
Represents assets that can be transferred:
\`\`\`
MultiAsset {
    id: Concrete(MultiLocation { ... }),
    fun: Fungible(1000000000000) // 1 DOT
}
\`\`\`

### Instructions
XCM programs consist of instructions like:
- **WithdrawAsset**: Remove assets from holding
- **BuyExecution**: Pay for execution
- **DepositAsset**: Place assets in an account
- **Transact**: Execute encoded call data

## Common Use Cases

1. **Cross-chain transfers**: Move tokens between parachains
2. **Remote execution**: Execute calls on other chains
3. **Cross-chain governance**: Participate in governance from other chains
4. **Liquidity provision**: Provide liquidity across multiple chains`,
    tags: ["xcm", "cross-chain", "interoperability", "parachains"],
    difficulty: "advanced",
    lastUpdated: "2024-01-11",
    readTime: 18,
    author: "Polkadot Foundation",
    examples: [
      {
        title: "Basic XCM Transfer",
        language: "rust",
        code: `use xcm::latest::{prelude::*, Weight};

// Create an XCM message to transfer assets
let message = Xcm(vec![
    WithdrawAsset((Here, 1_000_000_000_000u128).into()),
    BuyExecution {
        fees: (Here, 1_000_000_000u128).into(),
        weight_limit: Limited(Weight::from_parts(1_000_000_000, 64 * 1024)),
    },
    DepositAsset {
        assets: Wild(AllCounted(1)),
        beneficiary: MultiLocation {
            parents: 0,
            interior: X1(AccountId32 {
                network: None,
                id: [0u8; 32], // destination account
            }),
        },
    },
]);

// Send the message
let destination = MultiLocation {
    parents: 1,
    interior: X1(Parachain(2000)),
};

pallet_xcm::Pallet::<T>::send_xcm(Here, destination, message)?;`,
      },
    ],
  },
  {
    id: "polkadot-governance",
    title: "Polkadot Governance",
    category: "Governance",
    description: "Participate in Polkadot's on-chain governance system and help shape the network's future.",
    content: `# Polkadot Governance

Polkadot features a sophisticated on-chain governance system that allows DOT holders to participate in the network's decision-making process.

## Governance Bodies

### Council
- Elected representatives of DOT holders
- Propose referenda and control treasury spending
- Can fast-track emergency proposals

### Technical Committee
- Composed of technical experts
- Can fast-track technical upgrades
- Provides technical guidance on proposals

### Treasury
- Funds collected from transaction fees and slashing
- Used to fund development and ecosystem growth
- Controlled by governance decisions

## Proposal Process

1. **Proposal Submission**: Anyone can submit a proposal
2. **Council Review**: Council can endorse or reject
3. **Public Referendum**: DOT holders vote
4. **Enactment**: Successful proposals are automatically executed

## Voting Mechanisms

### Conviction Voting
- Lock tokens for longer periods to increase voting power
- 1x to 6x multiplier based on lock duration
- Demonstrates long-term commitment

### Delegation
- Delegate voting power to trusted experts
- Can be done per track (different proposal types)
- Maintains democratic participation

## OpenGov (Governance v2)

The new governance system features:
- **Multiple Tracks**: Different proposal types with different parameters
- **Shorter Voting Periods**: Faster decision making
- **More Participation**: Lower barriers to entry
- **Specialized Voting**: Vote on areas of expertise`,
    tags: ["governance", "democracy", "voting", "treasury"],
    difficulty: "intermediate",
    lastUpdated: "2024-01-10",
    readTime: 14,
    author: "Polkadot Foundation",
  },
  {
    id: "polkadot-staking",
    title: "Staking on Polkadot",
    category: "Staking",
    description: "Learn how to stake DOT tokens and participate in network security while earning rewards.",
    content: `# Staking on Polkadot

Staking is the process of locking up DOT tokens to help secure the Polkadot network and earn rewards in return.

## How Staking Works

Polkadot uses Nominated Proof-of-Stake (NPoS), where:
- **Validators** run nodes and validate transactions
- **Nominators** back validators with their stake
- **Rewards** are distributed based on stake and performance

## Roles in Staking

### Validators
- Run validator nodes
- Validate parachain blocks
- Participate in consensus
- Require technical expertise and 24/7 uptime

### Nominators
- Select up to 16 validators to support
- Share in validator rewards
- Risk slashing if validators misbehave
- Minimum stake: 250 DOT (dynamic)

## Staking Rewards

Rewards come from:
- **Inflation**: New DOT tokens created
- **Transaction Fees**: Fees from network usage
- **Tips**: Optional tips from users

Annual rewards typically range from 10-15% APY.

## Risks

### Slashing
Validators can be slashed for:
- **Equivocation**: Signing conflicting blocks
- **Unavailability**: Being offline too long
- **Invalid Behavior**: Other protocol violations

Nominators share in slashing penalties.

## Getting Started

1. **Get DOT**: Acquire DOT tokens
2. **Choose Validators**: Research and select validators
3. **Bond Tokens**: Lock tokens for staking
4. **Nominate**: Select your chosen validators
5. **Monitor**: Track performance and rewards`,
    tags: ["staking", "validators", "nominators", "rewards"],
    difficulty: "beginner",
    lastUpdated: "2024-01-09",
    readTime: 12,
    author: "Polkadot Foundation",
  },
  {
    id: "parachain-development",
    title: "Parachain Development",
    category: "Development",
    description: "Build and deploy your own parachain on the Polkadot network.",
    content: `# Parachain Development

Parachains are independent blockchains that run in parallel within the Polkadot ecosystem, each optimized for specific use cases.

## What are Parachains?

Parachains are:
- **Parallel**: Process transactions simultaneously
- **Specialized**: Optimized for specific applications
- **Interoperable**: Can communicate with other parachains
- **Secure**: Protected by Polkadot's shared security

## Development Process

### 1. Design Your Chain
- Define your use case and requirements
- Choose consensus mechanism and features
- Plan tokenomics and governance

### 2. Build with Substrate
- Use Substrate framework for development
- Customize runtime with pallets
- Implement custom business logic

### 3. Test Thoroughly
- Local testing with Substrate node
- Rococo testnet deployment
- Security audits and optimization

### 4. Secure a Parachain Slot
- Participate in parachain auctions
- Crowdloan campaigns for funding
- Alternative: Deploy as parathread

## Parachain vs Parathread

### Parachains
- Dedicated block production slot
- Continuous block production
- Higher cost but guaranteed throughput

### Parathreads
- Pay-per-block model
- Suitable for lower throughput needs
- More cost-effective for some use cases

## Common Parachain Types

- **DeFi Chains**: Specialized for financial applications
- **Gaming Chains**: Optimized for gaming and NFTs
- **Privacy Chains**: Focus on privacy and confidentiality
- **Bridge Chains**: Connect to external networks`,
    tags: ["parachains", "substrate", "development", "auctions"],
    difficulty: "advanced",
    lastUpdated: "2024-01-08",
    readTime: 16,
    author: "Parity Technologies",
  },
  {
    id: "polkadot-wallets",
    title: "Polkadot Wallets & Extensions",
    category: "Tools",
    description: "Overview of wallets and browser extensions for interacting with the Polkadot ecosystem.",
    content: `# Polkadot Wallets & Extensions

Wallets are essential tools for interacting with the Polkadot ecosystem, allowing you to manage accounts, sign transactions, and interact with dApps.

## Browser Extensions

### Polkadot.js Extension
- **Official**: Developed by Parity Technologies
- **Features**: Account management, transaction signing
- **Compatibility**: Works with most Polkadot dApps
- **Security**: Local key storage, never shares private keys

### Talisman
- **Multi-chain**: Supports Polkadot and Ethereum
- **User-friendly**: Intuitive interface
- **Portfolio**: Track assets across chains
- **DeFi Integration**: Built-in DeFi features

### SubWallet
- **Comprehensive**: Full-featured Polkadot wallet
- **Mobile**: Available on mobile devices
- **Staking**: Built-in staking interface
- **NFT Support**: Manage and view NFTs

## Hardware Wallets

### Ledger
- **Security**: Private keys stored on hardware
- **Polkadot App**: Dedicated Polkadot application
- **Staking**: Support for staking operations
- **Integration**: Works with Polkadot.js Apps

### Polkadot Vault (formerly Parity Signer)
- **Air-gapped**: Completely offline signing
- **Mobile**: iOS and Android apps
- **QR Codes**: Transaction signing via QR codes
- **Maximum Security**: Never connects to internet

## Mobile Wallets

### Nova Wallet
- **Native**: Built specifically for Polkadot
- **Staking**: Full staking functionality
- **Governance**: Participate in governance
- **DeFi**: Access to DeFi protocols

### Fearless Wallet
- **User-friendly**: Simple and intuitive
- **Multi-asset**: Support for multiple tokens
- **Staking**: Easy staking interface
- **Cross-platform**: iOS and Android

## Security Best Practices

1. **Backup**: Always backup your seed phrase
2. **Hardware**: Use hardware wallets for large amounts
3. **Verification**: Verify addresses before sending
4. **Updates**: Keep wallets updated
5. **Phishing**: Be aware of phishing attempts`,
    tags: ["wallets", "extensions", "security", "tools"],
    difficulty: "beginner",
    lastUpdated: "2024-01-07",
    readTime: 10,
    author: "Polkadot Community",
  },
]

export const docCategories = [
  "Getting Started",
  "Development",
  "Smart Contracts",
  "Interoperability",
  "Governance",
  "Staking",
  "Tools",
]

export function getDocsByCategory(category: string): PolkadotDoc[] {
  return polkadotDocs.filter((doc) => doc.category === category)
}

export function searchDocs(query: string): PolkadotDoc[] {
  const lowercaseQuery = query.toLowerCase()
  return polkadotDocs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(lowercaseQuery) ||
      doc.description.toLowerCase().includes(lowercaseQuery) ||
      doc.content.toLowerCase().includes(lowercaseQuery) ||
      doc.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export function getDocById(id: string): PolkadotDoc | undefined {
  return polkadotDocs.find((doc) => doc.id === id)
}
