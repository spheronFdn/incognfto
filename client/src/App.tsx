import { FC, useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Contract, ethers } from "ethers";
import lit from "./lit";
import erc721Abi from "./abis/ERC721.json";
import { dummyNFTs } from "./assets/dummy-nfts";
import NFTCard from "./components/NFTCard";
import Navbar from "./components/Navbar";

const App: FC = () => {
  const [nfts, setNfts] = useState<any[]>([]);
  const [res, setRes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    loadNfts();
  }, []); // eslint-disable-line

  const getRandomUrls = (length: number) => {
    const randomUrls = [];
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * dummyNFTs.length);
      randomUrls.push(dummyNFTs[randomIndex]);
    }
    return randomUrls;
  };

  const loadNfts = async () => {
    try {
      setIsLoading(true);
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum
      );
      const erc721Contract = new Contract(
        process.env.REACT_APP_CONTRACT_ADDRESS,
        erc721Abi,
        provider
      );
      const res = await erc721Contract.getAllNfts();
      setRes(res.slice(4));
      const randomUrls = getRandomUrls(res.slice(4).length);
      setNfts(randomUrls);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Navbar lit={lit} />
      {isLoading ? (
        <div className="h-[50vh] flex flex-col items-center justify-center">
          <div
            className="h-10 w-10 mb-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-white"
            role="status"
          />
          <h3 className="text-white font-semibold text-center">Loading NFTs</h3>
        </div>
      ) : (
        <ResponsiveMasonry columnsCount={3}>
          <Masonry>
            {nfts.map((nft, i) => (
              <section key={i}>
                {nft && (
                  <div className="my-2 mx-4">
                    <NFTCard index={i} url={nft} res={res} lit={lit} />
                  </div>
                )}
              </section>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      )}
    </main>
  );
};

export default App;
