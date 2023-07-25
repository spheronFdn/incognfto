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
5. Create a `.env` file in the client directory and Add the following:
  ```
  REACT_APP_CONTRACT_ADDRESS=xxxx
  REACT_APP_BACKEND_ADDRESS=xxxx
  # for local setup use http://localhost:8111/
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
5. Create a `.env` file in the server directory and Add the following:
  ```
  SPHERON_TOKEN=xxxx
  ```
6. Start the server
  ```sh
  yarn start
  ```
> Learn how to create an access token [here.](https://docs.spheron.network/rest-api/#creating-an-access-token)

## How it Works

Incognfto follows a straightforward workflow to ensure privacy and secure access to NFTs. Here's a high-level overview:

### 1. Encryption: Safeguarding NFT Content
At the heart of Incognfto's privacy measures lies a robust encryption process. Before storing NFTs on their platform, Incognfto employs the Lit Protocol for encryption, ensuring that the content remains confidential and shielded from unauthorized access. Let's take a practical look at how this encryption process works. 

```js
async encryptFile(id: string, file: any, configuration: any) {
   if (!this.litNodeClient) await this.connect();
   const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
   const uploadRes = encryptUpload({
     authSig,
     accessControlConditions: createAccessControlCondition(id),
     chain,
     file,
     litNodeClient: this.litNodeClient,
     configuration,
   });
   return uploadRes;
 }
```

The `encryptFile` function plays a key role in this process. By utilizing the encryptUpload function from the Spheron Browser SDK, NFT files are encrypted before being uploaded to IPFS (InterPlanetary File System). Here's a breakdown of the steps involved:

1. **Connect to Lit Node:**
Before encrypting the file, the function checks if the Lit Node client is connected. If not, it establishes the connection using the connect method.

2. **Authentication:**
The function obtains an authentication signature (authSig) using the LitJsSdk's checkAndSignAuthMessage method. This signature helps authenticate the user and validate their access rights during the encryption process.

3. **Access Control Conditions:**
The createAccessControlCondition function, as discussed earlier, is used to define the access control conditions for the encryption process. These conditions determine who can decrypt and access the locked data.

4. **Encryption:**
The encryptUpload function is called, passing the necessary parameters:
    - **authSig:** The authentication signature obtained earlier.
    - **accessControlConditions:** The access control conditions defining the authorised users.
    - **chain:** The blockchain network where the NFT contract resides.
    - **file:** The NFT file to be encrypted.
    - **litNodeClient:** The Lit Node client instance used for the encryption process.
    - **configuration:** Additional configuration parameters, specific to the encryption process.

5. **Return Result:**
The encryptFile function returns the result of the encryption process, which may include information about the encrypted file, such as its location or identifier.

By leveraging the encryptFile function, Incognfto ensures that NFT files are encrypted before being uploaded to IPFS. This encryption process adds a layer of security, ensuring that the NFT content remains confidential and protected. Only users with the appropriate access control conditions and decryption capabilities can unlock and view the NFTs within the private gallery.

### 2. Minting and Ownership: Creating Unique NFT Tokens 
Once an NFT is encrypted on Incognfto, the platform mints it on the blockchain, creating a unique token that represents ownership of the NFT. This ownership token is associated with the owner's wallet address, granting them the exclusive ability to decrypt and view the NFT's content securely. To achieve this controlled access, Incognfto leverages the powerful access controls provided by the Lit Protocol. Let's explore how we integrate access controls into our application using a code snippet:

```js
const client = new LitJsSdk.LitNodeClient({});
const chain = "mumbai";


const createAccessControlCondition = (id: string) => {
 return [
   {
     contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS,
     standardContractType: "ERC721",
     chain,
     method: "ownerOf",
     parameters: [id],
     returnValueTest: {
       comparator: "=",
       value: ":userAddress",
     },
   },
 ];
};
```

The `createAccessControlCondition` function accepts an id parameter representing the unique identifier of an NFT. It constructs an access control condition using the Lit Protocol's access control condition schema.

Let's break down the components of the access control condition:

1. **contractAddress:** Specifies the address of the contract associated with the NFT. In this example, we utilise the REACT_APP_CONTRACT_ADDRESS environment variable for flexibility.

2. **standardContractType:** Indicates the type of contract, in this case, "ERC721" for non-fungible tokens. The Lit Protocol supports various contract types, enabling flexible access control conditions.

3. **chain:** Specifies the blockchain network where the NFT contract resides. In this example, we set it to "mumbai," but it can be adjusted based on the desired blockchain.

4. **method:** Specifies the contract method to be called for the access control condition. In this case, we utilise the "ownerOf" method to check if the user's address matches the owner of the NFT.

5. **parameters:** Contains any required parameters for the contract method. Here, we pass the id parameter to the "ownerOf" method to verify ownership.

6. **returnValueTest:** Defines the conditions that need to be satisfied for the access control to be granted. In this example, we use the comparator as "=" and value as ":userAddress" to compare the user's address with the owner's address returned by the contract.

By implementing and leveraging access control conditions, simplified in the provided code snippet,  Incognfto can ensure that only the rightful owner of an NFT can access and decrypt the locked data associated with their NFT. This adds an extra layer of security and privacy to the gallery, empowering NFT owners to have full control over their digital assets.

### 3. Unlocking NFTs: 
For authorized users, unlocking an NFT is a seamless experience. Incognfto verifies their access rights before allowing decryption. The access control conditions defined by the Lit Protocol play a pivotal role in determining who can decrypt and access the locked NFT data.
Now, let's take a practical look at how decryption work.

```js
async decryptFile(ipfsCid: string) {
   if (!this.litNodeClient) await this.connect();
   const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
   const decryptedFile = await decryptUpload({
     authSig,
     ipfsCid,
     litNodeClient: this.litNodeClient,
   });
   return decryptedFile;
 }
```

The `decryptFile` function handles the decryption process. Using the decryptUpload function from the Spheron Browser SDK and the provided IPFS CID, the NFT file is decrypted. Here's how it works:

1. **Connect to Lit Node:**
To kick off the NFT decryption process, our app ensures a secure connection with the Lit Node client. If the connection is not established yet, we quickly set it up using the connect method.

2. **Authentication:**
To verify the user's access rights, our app obtains an authentication signature (authSig) through the LitJsSdk's checkAndSignAuthMessage method. This signature acts as a passcode, ensuring only authorized users can proceed with decryption.

3. **Decryption:**
Armed with the authentication signature and the encrypted NFT's IPFS CID (Content Identifier), our app employs the decryptUpload function. This decrypts the NFT file, revealing its hidden content, exclusively for the authorized user.

4. **Return Result:**
With the NFT content decrypted, the decryptFile function presents the unlocked file to the authorized user. Now, they can fully enjoy their NFT within the private gallery, knowing they have complete ownership and control.

By utilizing the decryptFile function, Incognfto enables authorized users to decrypt their NFT files and view them within the private gallery. The authentication signature and the Lit Node client ensure that only the rightful owners can decrypt and access their NFTs.
