import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';

// Polkadot connection configuration
const POLKADOT_WS_ENDPOINT = process.env.NEXT_PUBLIC_POLKADOT_WS_ENDPOINT || 'wss://rpc.polkadot.io';

let api: ApiPromise | null = null;

export async function getPolkadotApi(): Promise<ApiPromise> {
  if (!api) {
    const provider = new WsProvider(POLKADOT_WS_ENDPOINT);
    api = await ApiPromise.create({ provider });
  }
  return api;
}

export async function disconnectPolkadot() {
  if (api) {
    await api.disconnect();
    api = null;
  }
}

// Smart contract interaction utilities
export class PolkaForgeContract {
  private contract: ContractPromise;
  private api: ApiPromise;

  constructor(api: ApiPromise, contractAddress: string, abi: any) {
    this.api = api;
    this.contract = new ContractPromise(api, abi, contractAddress);
  }

  // Repository management functions
  async createRepository(
    signer: any,
    name: string,
    description: string,
    isPrivate: boolean,
    ipfsHash: string
  ) {
    const gasLimit = this.api.registry.createType('WeightV2', {
      refTime: 10000000000,
      proofSize: 125952,
    });

    const { result, output } = await this.contract.query.createRepository(
      signer.address,
      { gasLimit },
      name,
      description,
      isPrivate,
      ipfsHash
    );

    if (result.isOk) {
      const tx = this.contract.tx.createRepository(
        { gasLimit },
        name,
        description,
        isPrivate,
        ipfsHash
      );
      
      return await tx.signAndSend(signer);
    }
    
    throw new Error('Failed to create repository');
  }

  async mintContributionNFT(
    signer: any,
    repositoryId: number,
    contributor: string,
    contributionType: string,
    ipfsMetadata: string
  ) {
    const gasLimit = this.api.registry.createType('WeightV2', {
      refTime: 10000000000,
      proofSize: 125952,
    });

    const tx = this.contract.tx.mintContributionNft(
      { gasLimit },
      repositoryId,
      contributor,
      contributionType,
      ipfsMetadata
    );

    return await tx.signAndSend(signer);
  }

  async createBounty(
    signer: any,
    repositoryId: number,
    title: string,
    description: string,
    reward: string,
    deadline: number
  ) {
    const gasLimit = this.api.registry.createType('WeightV2', {
      refTime: 10000000000,
      proofSize: 125952,
    });

    const tx = this.contract.tx.createBounty(
      { gasLimit },
      repositoryId,
      title,
      description,
      reward,
      deadline
    );

    return await tx.signAndSend(signer);
  }
}