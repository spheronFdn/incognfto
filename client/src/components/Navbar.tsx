import { FC } from "react";
import { FaSistrix } from "react-icons/fa";
import MintNft, { IMint } from "./MintNft";

const Navbar: FC<IMint> = ({ lit, address, setAddress }) => {
  return (
    <main className="flex justify-between items-center mt-4 mb-10">
      <h1 className="font-bold text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-600 py-4 ml-6">
        incog-nft-o
      </h1>
      <div className="flex flex-1 items-center border border-gray-300 hover:bg-gray-800 rounded-xl p-2 mx-10">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent focus:outline-none flex-grow px-2 text-gray-50"
        />
        <button
          type="button"
          className="text-white rounded-lg p-2 ml-2 bg-gray-500"
        >
          <FaSistrix />
        </button>
      </div>
      <MintNft lit={lit} address={address} setAddress={setAddress} />
    </main>
  );
};

export default Navbar;
