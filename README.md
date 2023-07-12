# Incognfto
Incognfto is a private NFT gallery where only the owner can view their NFTs. 
The owner's name is displayed on each NFT, and users have the ability to unlock their own NFTs. 
Incognfto leverages the Lit Protocol for encrypting and decrypting NFTs, providing a secure and private environment for NFT owners.

## Features
- **Private NFT Gallery:** Incognfto ensures that NFTs are accessible only to their respective owners, maintaining privacy and ownership control.
- **Encrypted NFTs:** NFTs in Incognfto are encrypted using the Lit Protocol, adding an additional layer of security to protect the content from unauthorized access.
- **User-Friendly Experience:** Incognfto aims to provide a seamless and intuitive user experience, allowing users to easily upload, mint, and unlock their NFTs within the gallery.
- **Open Source:** Incognfto is an open-source project, fostering transparency, collaboration, and community contributions.

## Installation
To run Incognfto, follow the steps below:

### Client
You can follow these steps to setup the client:
1. Install `Node 16.x` either manually or using a tool like nvm (recommended)
2. Clone this repo: https://github.com/spheronFdn/incognfto.git
3. Go inside the `client` directory
4. Run `yarn` to install dependencies
5. Create a .env file in the builder directory and Add the following:
  ```
  REACT_APP_CONTRACT_ADDRESS=xxxx
  REACT_APP_BACKEND_ADDRESS=xxxx
  ```
6. Start the client
  ```sh
  yarn start
  ```

### Server
You can follow these steps to setup the server:

1. Install `Node 16.x` either manually or using a tool like nvm (recommended)
2. Clone this repo: https://github.com/spheronFdn/incognfto.git
3. Go inside the `server` directory
4. Run `yarn` to install dependencies
5. Create a .env file in the server directory and Add the following:
  ```
  SPHERON_TOKEN=xxxx
  ```
7. Start the server
  ```sh
  yarn start
  ```

## How it Works
Incognfto follows a straightforward workflow to ensure privacy and secure access to NFTs. Here's a high-level overview:

1. **Encryption:** NFTs are encrypted using the Lit Protocol before being stored in Incognfto. This process ensures that the content remains confidential and protected.

2. **Minting and Ownership:** Encrypted NFTs are minted within Incognfto, with the owner's name being associated with each NFT. This establishes clear ownership and attribution for the NFTs.

3. **Unlocking NFTs:** When an authorized user attempts to unlock an NFT, Incognfto verifies their access rights. If authorized, the NFT is decrypted, allowing the user to view their NFT within the gallery. The `access control conditions` (ACCs) defined by the Lit Protocol play a crucial role in determining who can decrypt and access the locked NFT data.

## Technical Details
Incognfto utilizes the Lit Protocol for encryption and decryption of NFTs. 
The Lit Protocol serves as a decentralized access control layer, enabling the encryption of content for private and permissioned storage on the open web. 
The Spheron Browser SDK integrates with the Lit Protocol and provides the `encrypt upload` and `decrypt upload` functions. 
These functions leverage an already connected instance of `LitNodeClient` for encryption and decryption operations.

