import { FC, useState } from "react";
import { decode as base64_decode } from "base-64";
import { FaLock, FaWallet } from "react-icons/fa";

interface INFTCard {
  index: number;
  url: string;
  res: any;
  lit: any;
}

const NFTCard: FC<INFTCard> = ({ index, url, res, lit }) => {
  const [isLocked, setIsLocked] = useState<boolean>(true);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [nftUrl, setNftUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<boolean>(false);

  const handleLock = async () => {
    setIsLoading(true);
    try {
      if (!nftUrl) {
        const parsedElement = JSON.parse(base64_decode(res[index].metadataURI));
        console.log(parsedElement);

        if (!parsedElement?.cid) {
          throw new Error("CID error");
        }

        setName(parsedElement?.name || "");
        setDescription(parsedElement?.description || "");

        const url = await handleDecrypt(parsedElement.cid);
        if (url) {
          setNftUrl(url);
          setIsLocked(!isLocked);
        }
      } else {
        setIsLocked(!isLocked);
      }
    } catch (error) {
      setErrorMessage(true);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrypt = async (cid: string) => {
    try {
      const fileBlob = await lit.decryptFile(cid);
      const blob = new Blob([fileBlob]);
      const url = URL.createObjectURL(blob);
      return url;
    } catch (error) {
      setErrorMessage(true);
      console.error(error, cid);
    }
  };

  return (
    <section
      className="w-full h-full p-4 border border-gray-400 rounded-2xl relative cursor-pointer"
      style={{
        background: `radial-gradient(circle, rgba(255, 255, 255, 0.05) 0%, #808080 0%, rgba(255, 255, 255, 0.05) 70%)`,
      }}
      onClick={handleLock}
    >
      {isLocked && (
        <>
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl backdrop-filter backdrop-blur-lg backdrop-brightness-50" />
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl backdrop-filter bg-white/20">
            {isLoading ? (
              <div className="flex flex-col items-center">
                <div
                  className="h-10 w-10 mb-4 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] text-white"
                  role="status"
                />
                <h3 className="text-white font-semibold text-center">
                  Unlocking NFT
                </h3>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <FaLock className="text-white text-5xl animate-pulse mb-4" />
                {errorMessage && (
                  <h3 className="text-white font-semibold text-center">
                    Unauthorized. <br />
                    Only the owner has access to this NFT.
                  </h3>
                )}
              </div>
            )}
            {res[index].encodedData && (
              <div className="absolute bottom-8 bg-white/80 rounded-md p-2 flex justify-between items-center">
                <FaWallet />{" "}
                <span className="ml-2 text-sm">{res[index].encodedData}</span>
              </div>
            )}
          </div>
        </>
      )}
      <img
        className="w-full rounded-xl"
        src={nftUrl ? nftUrl : url}
        alt={name}
      />
      <div className="flex flex-col mx-4 mt-4">
        <p className="text-white text-2xl font-bold">{name}</p>
        <p className="text-[#c6c2c6] text-base font-bold pt-1">{description}</p>
      </div>
    </section>
  );
};

export default NFTCard;
