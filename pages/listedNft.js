import React, { useContext, useState, useEffect } from "react";
import { NFTCard, Loader } from "../components";

import { NFTContext } from "../context/NFTContext";

const ListedNFT = () => {
  const [nfts, setnfts] = useState([]);
  const [isLoading, setisLoading] = useState(true);
  const {fetchMyNFTorListedNFT} = useContext(NFTContext)

  useEffect(() => {
    fetchMyNFTorListedNFT("fetchItemsListed").then((items) => {
      setnfts(items);
      setisLoading(false)
    });
  }, [])

  if (isLoading) {
    return (
      <div className="flexStart min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!isLoading && nfts.length === 0) {
    return (
      <div className="flexCenter sm:p-4 p-16 min-h-screen">
        <h1 className="font-poppins dark:text-white text-nft-black-1 text-3xl font-extrabold">
          No NFTs Listed for Sale.
        </h1>
      </div>
    );
  }
  return (
    <div className="flex justify-center sm:px-4 p-12 min-h-screen">
      <div className="w-full sm:w-4/5">
        <div className="mt-4">
          <h2 className="font-poppins dark:text-white text-nft-black-1 text-2xl font-semibold mt-2 ml-4 sm:ml-2">
            NFTs Listed for Sale.
          </h2>
          <div className="mt-3 w-full flex flex-wrap justify-start md:justify-center">
            {nfts.map((nft) => <NFTCard key={nft.tokenId} nft={nft} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListedNFT;
