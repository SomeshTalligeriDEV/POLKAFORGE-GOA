#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod polkaforge {
    use ink::storage::Mapping;
    use ink::prelude::vec::Vec;
    use ink::prelude::string::String;

    /// Repository structure
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct Repository {
        pub id: u32,
        pub name: String,
        pub description: String,
        pub owner: AccountId,
        pub is_private: bool,
        pub ipfs_hash: String,
        pub created_at: u64,
        pub collaborators: Vec<AccountId>,
        pub stars: u32,
        pub forks: u32,
    }

    /// Bounty structure
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct Bounty {
        pub id: u32,
        pub repository_id: u32,
        pub title: String,
        pub description: String,
        pub reward: Balance,
        pub creator: AccountId,
        pub assignee: Option<AccountId>,
        pub status: BountyStatus,
        pub deadline: u64,
        pub created_at: u64,
    }

    /// Bounty status enumeration
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum BountyStatus {
        Open,
        Assigned,
        Completed,
        Cancelled,
    }

    /// NFT Certificate structure
    #[derive(Debug, Clone, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub struct NFTCertificate {
        pub id: u32,
        pub owner: AccountId,
        pub repository_id: u32,
        pub contribution_type: String,
        pub ipfs_metadata: String,
        pub issued_at: u64,
        pub is_soulbound: bool,
    }

    /// Main contract storage
    #[ink(storage)]
    pub struct PolkaForge {
        /// Repository counter
        next_repo_id: u32,
        /// Bounty counter
        next_bounty_id: u32,
        /// NFT counter
        next_nft_id: u32,
        /// Repository storage
        repositories: Mapping<u32, Repository>,
        /// User repositories mapping
        user_repositories: Mapping<AccountId, Vec<u32>>,
        /// Bounty storage
        bounties: Mapping<u32, Bounty>,
        /// Repository bounties
        repo_bounties: Mapping<u32, Vec<u32>>,
        /// NFT certificates
        nft_certificates: Mapping<u32, NFTCertificate>,
        /// User NFTs
        user_nfts: Mapping<AccountId, Vec<u32>>,
        /// Contract owner
        owner: AccountId,
    }

    /// Contract events
    #[ink(event)]
    pub struct RepositoryCreated {
        #[ink(topic)]
        repo_id: u32,
        #[ink(topic)]
        owner: AccountId,
        name: String,
    }

    #[ink(event)]
    pub struct BountyCreated {
        #[ink(topic)]
        bounty_id: u32,
        #[ink(topic)]
        repository_id: u32,
        #[ink(topic)]
        creator: AccountId,
        reward: Balance,
    }

    #[ink(event)]
    pub struct NFTMinted {
        #[ink(topic)]
        nft_id: u32,
        #[ink(topic)]
        owner: AccountId,
        #[ink(topic)]
        repository_id: u32,
    }

    /// Contract errors
    #[derive(Debug, PartialEq, Eq)]
    #[ink::scale_derive(Encode, Decode, TypeInfo)]
    pub enum Error {
        NotOwner,
        RepositoryNotFound,
        BountyNotFound,
        NotAuthorized,
        InvalidParameters,
        InsufficientFunds,
        AlreadyExists,
    }

    pub type Result<T> = core::result::Result<T, Error>;

    impl PolkaForge {
        /// Constructor
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                next_repo_id: 1,
                next_bounty_id: 1,
                next_nft_id: 1,
                repositories: Mapping::default(),
                user_repositories: Mapping::default(),
                bounties: Mapping::default(),
                repo_bounties: Mapping::default(),
                nft_certificates: Mapping::default(),
                user_nfts: Mapping::default(),
                owner: Self::env().caller(),
            }
        }

        /// Create a new repository
        #[ink(message)]
        pub fn create_repository(
            &mut self,
            name: String,
            description: String,
            is_private: bool,
            ipfs_hash: String,
        ) -> Result<u32> {
            let caller = self.env().caller();
            let repo_id = self.next_repo_id;
            let timestamp = self.env().block_timestamp();

            let repository = Repository {
                id: repo_id,
                name: name.clone(),
                description,
                owner: caller,
                is_private,
                ipfs_hash,
                created_at: timestamp,
                collaborators: Vec::new(),
                stars: 0,
                forks: 0,
            };

            self.repositories.insert(repo_id, &repository);
            
            // Update user repositories
            let mut user_repos = self.user_repositories.get(caller).unwrap_or_default();
            user_repos.push(repo_id);
            self.user_repositories.insert(caller, &user_repos);

            self.next_repo_id += 1;

            self.env().emit_event(RepositoryCreated {
                repo_id,
                owner: caller,
                name,
            });

            Ok(repo_id)
        }

        /// Add collaborator to repository
        #[ink(message)]
        pub fn add_collaborator(
            &mut self,
            repo_id: u32,
            collaborator: AccountId,
        ) -> Result<()> {
            let caller = self.env().caller();
            let mut repository = self.repositories.get(repo_id).ok_or(Error::RepositoryNotFound)?;

            if repository.owner != caller {
                return Err(Error::NotAuthorized);
            }

            if !repository.collaborators.contains(&collaborator) {
                repository.collaborators.push(collaborator);
                self.repositories.insert(repo_id, &repository);
            }

            Ok(())
        }

        /// Create a bounty
        #[ink(message, payable)]
        pub fn create_bounty(
            &mut self,
            repository_id: u32,
            title: String,
            description: String,
            deadline: u64,
        ) -> Result<u32> {
            let caller = self.env().caller();
            let reward = self.env().transferred_value();
            let bounty_id = self.next_bounty_id;
            let timestamp = self.env().block_timestamp();

            // Verify repository exists and caller has permission
            let repository = self.repositories.get(repository_id).ok_or(Error::RepositoryNotFound)?;
            
            if repository.owner != caller && !repository.collaborators.contains(&caller) {
                return Err(Error::NotAuthorized);
            }

            let bounty = Bounty {
                id: bounty_id,
                repository_id,
                title,
                description,
                reward,
                creator: caller,
                assignee: None,
                status: BountyStatus::Open,
                deadline,
                created_at: timestamp,
            };

            self.bounties.insert(bounty_id, &bounty);

            // Update repository bounties
            let mut repo_bounties = self.repo_bounties.get(repository_id).unwrap_or_default();
            repo_bounties.push(bounty_id);
            self.repo_bounties.insert(repository_id, &repo_bounties);

            self.next_bounty_id += 1;

            self.env().emit_event(BountyCreated {
                bounty_id,
                repository_id,
                creator: caller,
                reward,
            });

            Ok(bounty_id)
        }

        /// Assign bounty to a contributor
        #[ink(message)]
        pub fn assign_bounty(
            &mut self,
            bounty_id: u32,
            assignee: AccountId,
        ) -> Result<()> {
            let caller = self.env().caller();
            let mut bounty = self.bounties.get(bounty_id).ok_or(Error::BountyNotFound)?;

            if bounty.creator != caller {
                return Err(Error::NotAuthorized);
            }

            if bounty.status != BountyStatus::Open {
                return Err(Error::InvalidParameters);
            }

            bounty.assignee = Some(assignee);
            bounty.status = BountyStatus::Assigned;
            self.bounties.insert(bounty_id, &bounty);

            Ok(())
        }

        /// Complete bounty and pay reward
        #[ink(message)]
        pub fn complete_bounty(&mut self, bounty_id: u32) -> Result<()> {
            let caller = self.env().caller();
            let mut bounty = self.bounties.get(bounty_id).ok_or(Error::BountyNotFound)?;

            if bounty.creator != caller {
                return Err(Error::NotAuthorized);
            }

            if bounty.status != BountyStatus::Assigned {
                return Err(Error::InvalidParameters);
            }

            let assignee = bounty.assignee.ok_or(Error::InvalidParameters)?;

            // Transfer reward to assignee
            if self.env().transfer(assignee, bounty.reward).is_err() {
                return Err(Error::InsufficientFunds);
            }

            bounty.status = BountyStatus::Completed;
            self.bounties.insert(bounty_id, &bounty);

            Ok(())
        }

        /// Mint NFT certificate for contribution
        #[ink(message)]
        pub fn mint_contribution_nft(
            &mut self,
            repository_id: u32,
            contributor: AccountId,
            contribution_type: String,
            ipfs_metadata: String,
        ) -> Result<u32> {
            let caller = self.env().caller();
            let nft_id = self.next_nft_id;
            let timestamp = self.env().block_timestamp();

            // Verify repository exists and caller has permission
            let repository = self.repositories.get(repository_id).ok_or(Error::RepositoryNotFound)?;
            
            if repository.owner != caller && !repository.collaborators.contains(&caller) {
                return Err(Error::NotAuthorized);
            }

            let nft = NFTCertificate {
                id: nft_id,
                owner: contributor,
                repository_id,
                contribution_type,
                ipfs_metadata,
                issued_at: timestamp,
                is_soulbound: true, // SoulBound NFTs cannot be transferred
            };

            self.nft_certificates.insert(nft_id, &nft);

            // Update user NFTs
            let mut user_nfts = self.user_nfts.get(contributor).unwrap_or_default();
            user_nfts.push(nft_id);
            self.user_nfts.insert(contributor, &user_nfts);

            self.next_nft_id += 1;

            self.env().emit_event(NFTMinted {
                nft_id,
                owner: contributor,
                repository_id,
            });

            Ok(nft_id)
        }

        /// Get repository details
        #[ink(message)]
        pub fn get_repository(&self, repo_id: u32) -> Option<Repository> {
            self.repositories.get(repo_id)
        }

        /// Get user repositories
        #[ink(message)]
        pub fn get_user_repositories(&self, user: AccountId) -> Vec<u32> {
            self.user_repositories.get(user).unwrap_or_default()
        }

        /// Get bounty details
        #[ink(message)]
        pub fn get_bounty(&self, bounty_id: u32) -> Option<Bounty> {
            self.bounties.get(bounty_id)
        }

        /// Get repository bounties
        #[ink(message)]
        pub fn get_repository_bounties(&self, repo_id: u32) -> Vec<u32> {
            self.repo_bounties.get(repo_id).unwrap_or_default()
        }

        /// Get NFT certificate
        #[ink(message)]
        pub fn get_nft_certificate(&self, nft_id: u32) -> Option<NFTCertificate> {
            self.nft_certificates.get(nft_id)
        }

        /// Get user NFTs
        #[ink(message)]
        pub fn get_user_nfts(&self, user: AccountId) -> Vec<u32> {
            self.user_nfts.get(user).unwrap_or_default()
        }

        /// Star a repository
        #[ink(message)]
        pub fn star_repository(&mut self, repo_id: u32) -> Result<()> {
            let mut repository = self.repositories.get(repo_id).ok_or(Error::RepositoryNotFound)?;
            repository.stars += 1;
            self.repositories.insert(repo_id, &repository);
            Ok(())
        }

        /// Fork a repository
        #[ink(message)]
        pub fn fork_repository(&mut self, repo_id: u32) -> Result<()> {
            let mut repository = self.repositories.get(repo_id).ok_or(Error::RepositoryNotFound)?;
            repository.forks += 1;
            self.repositories.insert(repo_id, &repository);
            Ok(())
        }
    }

    /// Unit tests
    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn create_repository_works() {
            let mut contract = PolkaForge::new();
            let result = contract.create_repository(
                "test-repo".to_string(),
                "Test repository".to_string(),
                false,
                "QmTest123".to_string(),
            );
            assert!(result.is_ok());
            assert_eq!(result.unwrap(), 1);
        }

        #[ink::test]
        fn create_bounty_works() {
            let mut contract = PolkaForge::new();
            
            // First create a repository
            let repo_id = contract.create_repository(
                "test-repo".to_string(),
                "Test repository".to_string(),
                false,
                "QmTest123".to_string(),
            ).unwrap();

            // Then create a bounty
            let result = contract.create_bounty(
                repo_id,
                "Fix bug".to_string(),
                "Fix the critical bug".to_string(),
                1000000000000, // deadline
            );
            assert!(result.is_ok());
        }

        #[ink::test]
        fn mint_nft_works() {
            let mut contract = PolkaForge::new();
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            
            // Create repository
            let repo_id = contract.create_repository(
                "test-repo".to_string(),
                "Test repository".to_string(),
                false,
                "QmTest123".to_string(),
            ).unwrap();

            // Mint NFT
            let result = contract.mint_contribution_nft(
                repo_id,
                accounts.alice,
                "Code Contribution".to_string(),
                "QmNFTMetadata".to_string(),
            );
            assert!(result.is_ok());
        }
    }
}