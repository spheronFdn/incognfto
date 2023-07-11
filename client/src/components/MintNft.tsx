import React, { FC, useRef, useState } from "react";
import { Contract, ethers } from "ethers";
import { encode as base64_encode } from "base-64";
import { FaRegCheckCircle } from "react-icons/fa";
import erc721Abi from "../abis/ERC721.json";

export interface IMint {
  lit: any;
}

const MintNft: FC<IMint> = ({ lit }) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [address, setAddress] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [nftDetails, setNftDetails] = useState({
    cid: "",
    name: "",
    description: "",
    filename: "",
  });
  const [showModal, setShowModal] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [minting, setMinting] = useState<boolean>(false);

  const connectWallet = async () => {
    try {
      const { ethereum } = window as any;
      if (!ethereum) {
        return {
          error: true,
          errorMessage: "MetaMask not installed, please install!",
          account: "",
        };
      }
      const provider = new ethers.providers.Web3Provider(ethereum, "any");
      await provider.send("eth_requestAccounts", []); // requesting access to accounts
      const signer = provider.getSigner();
      const walletAddress = await signer.getAddress();
      setAddress(walletAddress);
      await switchNetwork();
    } catch (error) {
      console.error("Error while connecting wallet!", error);
    }
  };

  const switchNetwork = async () => {
    // NOTE: polygon mumbai testnet by default
    const currentNetwork = {
      chainId: `0x${Number(80001).toString(16)}`,
      chainName: "Mumbai",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      rpcUrls: [
        "https://polygon-mumbai.g.alchemy.com/v2/i0JIYxK_EGtBX5aGG1apX4KuoH7j_7dq",
      ],
      blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    };

    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: currentNetwork.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [currentNetwork],
          });
          return { error: false, errorMessage: "" };
        } catch (error) {
          console.error("Error while connecting wallet!", error);
        }
      }
      console.error("Error while connecting wallet!", switchError);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleSelectFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getTokenId = async () => {
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );

    const signer = provider.getSigner();
    const erc721Contract = new Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      erc721Abi,
      signer
    );

    const res = await erc721Contract.getAllNfts();
    return String(res.length + 1);
  };

  const handleUpload = async () => {
    if (!file || !nftDetails.name || !nftDetails.description) {
      alert("Please provide all the details!");
      return;
    }

    try {
      setUploading(true);
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_ADDRESS}/initiate-upload`
      );
      const responseJson = await response.json();
      const id = await getTokenId();
      const uploadResult = await lit.encryptFile(id, file, {
        token: responseJson.uploadToken,
      });
      setNftDetails({
        ...nftDetails,
        cid: uploadResult.cid,
        filename: file.name,
      });
      setUploading(false);
      await handleMint(uploadResult.cid, file.name);
    } catch (err) {
      alert(err);
      setUploading(false);
    }
  };

  const handleMint = async (cid: string, filename: string) => {
    setMinting(true);
    const provider = new ethers.providers.Web3Provider(
      (window as any).ethereum
    );

    const signer = provider.getSigner();
    const erc721Contract = new Contract(
      process.env.REACT_APP_CONTRACT_ADDRESS,
      erc721Abi,
      signer
    );
    const details = {
      cid,
      name: nftDetails.name,
      description: nftDetails.description,
      filename,
    };
    const stringifiedDetails = JSON.stringify(details);
    const uri = base64_encode(stringifiedDetails);
    const tx = await erc721Contract.mintNft(uri, address);
    const receipt = await tx.wait();
    console.log(receipt);
    // setTransactionHash(receipt.transactionHash);
    setMinting(false);
    setNftDetails({
      cid: "",
      name: "",
      description: "",
      filename: "",
    });
    setFile(null);
    setShowModal(false);
  };

  const truncateString = (input: string) =>
    input.length > 5
      ? `${input.substring(0, 5)}...${input.substr(input.length - 5)}`
      : input;

  return (
    <main>
      <button
        type="button"
        className="mr-4 border border-gray-300 text-gray-50 hover:bg-gray-700 focus:outline-none rounded-xl px-8 py-3 text-center font-semibold"
        onClick={connectWallet}
      >
        {address ? truncateString(address) : "Connect Wallet"}
      </button>
      {address && (
        <>
          <button
            type="button"
            className="mr-4 border border-gray-300 text-gray-50 hover:bg-gray-700 focus:outline-none rounded-xl px-8 py-3 text-center font-semibold"
            onClick={() => setShowModal(true)}
          >
            Mint NFT
          </button>

          {/* Main modal */}
          {showModal && (
            <div className="fixed flex justify-center items-center z-50 w-full p-4 md:inset-0 h-screen backdrop-filter backdrop-blur backdrop-brightness-50">
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-white opacity-50 w-full h-full"
                onClick={() => setShowModal(false)}
              />
              <div className="relative w-full max-w-lg max-h-full">
                {/* Modal content */}
                <div className="relative bg-gray-800 rounded-lg shadow">
                  <button
                    type="button"
                    className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    onClick={() => setShowModal(false)}
                  >
                    <svg
                      className="w-3 h-3"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 14 14"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                      />
                    </svg>
                    <span className="sr-only">Close modal</span>
                  </button>
                  <div className="px-6 py-6 lg:px-8">
                    <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">
                      Mint NFT
                    </h3>
                    <section className="space-y-6">
                      <div>
                        <label
                          htmlFor="file"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          File
                        </label>
                        <div className="flex gap-32">
                          <div className="cursor-pointer">
                            <div className="" onClick={handleSelectFile}>
                              <input
                                id="file"
                                name="file"
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="w-full h-full"
                                style={{ display: "none" }}
                              />
                              <div className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white">
                                {file ? file?.name : "No file selected"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <label
                          htmlFor="name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Name
                        </label>
                        <input
                          name="name"
                          id="name"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          placeholder="name"
                          required
                          value={nftDetails.name}
                          onChange={(e) =>
                            setNftDetails({
                              ...nftDetails,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="description"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Description
                        </label>
                        <input
                          name="description"
                          id="description"
                          placeholder="description"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          required
                          value={nftDetails.description}
                          onChange={(e) =>
                            setNftDetails({
                              ...nftDetails,
                              description: e.target.value,
                            })
                          }
                        />
                      </div>
                      <button
                        className="w-full text-white focus:outline-none font-semibold rounded-lg text-md px-5 py-2.5 text-center bg-gradient-to-r from-yellow-600 to-pink-700 hover:opacity-80"
                        onClick={handleUpload}
                      >
                        {nftDetails.cid ? (
                          minting ? (
                            <div className="flex justify-center items-center">
                              <div
                                className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-white"
                                role="status"
                              />{" "}
                              Minting in progress...
                            </div>
                          ) : (
                            <div className="flex justify-center items-center">
                              Minted <FaRegCheckCircle className="ml-2" />
                            </div>
                          )
                        ) : uploading ? (
                          <div className="flex justify-center items-center">
                            <div
                              className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-white"
                              role="status"
                            />{" "}
                            Upload in progress...
                          </div>
                        ) : (
                          "Upload"
                        )}
                      </button>
                    </section>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </main>
  );
};

export default MintNft;
