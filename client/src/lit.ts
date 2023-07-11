import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { encryptUpload, decryptUpload } from "@spheron/browser-upload";

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

class Lit {
  litNodeClient: any;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

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
}
const lit = new Lit();

export default lit;
