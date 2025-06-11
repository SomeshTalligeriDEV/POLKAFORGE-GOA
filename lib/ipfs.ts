import axios from 'axios';

const PINATA_API_KEY = process.env.NEXT_PUBLIC_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY;
const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export class IPFSManager {
  private baseURL = 'https://api.pinata.cloud';

  async uploadFile(file: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const metadata = JSON.stringify({
        name: file.name,
        keyvalues: {
          uploadedBy: 'PolkaForge',
          timestamp: new Date().toISOString()
        }
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', options);

      const response = await axios.post(
        `${this.baseURL}/pinning/pinFileToIPFS`,
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            'Content-Type': `multipart/form-data`,
            'Authorization': `Bearer ${PINATA_JWT}`,
          }
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw new Error('Failed to upload file to IPFS');
    }
  }

  async uploadJSON(jsonData: any): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseURL}/pinning/pinJSONToIPFS`,
        jsonData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${PINATA_JWT}`,
          }
        }
      );

      return response.data.IpfsHash;
    } catch (error) {
      console.error('Error uploading JSON to IPFS:', error);
      throw new Error('Failed to upload JSON to IPFS');
    }
  }

  async getFile(ipfsHash: string): Promise<any> {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      return response.data;
    } catch (error) {
      console.error('Error retrieving file from IPFS:', error);
      throw new Error('Failed to retrieve file from IPFS');
    }
  }

  async uploadRepository(files: File[]): Promise<string> {
    try {
      // Create a repository structure
      const repoData = {
        files: [],
        metadata: {
          name: 'PolkaForge Repository',
          uploadedAt: new Date().toISOString(),
          fileCount: files.length
        }
      };

      // Upload each file and collect hashes
      const filePromises = files.map(async (file) => {
        const hash = await this.uploadFile(file);
        return {
          name: file.name,
          size: file.size,
          type: file.type,
          ipfsHash: hash
        };
      });

      repoData.files = await Promise.all(filePromises);

      // Upload the repository metadata
      return await this.uploadJSON(repoData);
    } catch (error) {
      console.error('Error uploading repository:', error);
      throw new Error('Failed to upload repository');
    }
  }
}

export const ipfsManager = new IPFSManager();