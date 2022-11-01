import React, { useContext, useState, useEffect } from "react";
import { NFTCard, Loader, Banner } from "../components";
import Image from "next/image";

import { NFTContext } from "../context/NFTContext";

import images from "../assets"


const MyNFT = () => {
  const [nfts, setnfts] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const { fetchMyNFTorListedNFT, currentAccount } = useContext(NFTContext);

   if (isLoading) {
     return (
       <div className="flexStart min-h-screen">
         <Loader />
       </div>
     );
   }
  return (
    <div className="w-full flex justify-start items-center flex-col min-h-screen">
      <div className="w-full flexCenter flex-col">
        <Banner
          name="Your NFTs"
          childStyles="text-center text-white mb-4"
          parentStyles="h-80 justify-center"
        />
        <div className="flexCenter flex-col -mt-20 z-0">
          <div className="flexCenter w-40 h-40 sm:w-36 p-1 bg-nft-black-2 rounded-full">
            <Image
              src={images.creator1}
              className="rounded-full object-cover"
              objectFit="cover"
            />
          </div>
          <p className="font-poppins dark:text-white text-nft-black-1 font-semibold text-2xl mt-6">
            {currentAccount}
          </p>
        </div>
      </div>
      {!isLoading && !nfts.length ? (
        <div className="flexCenter sm:p-4 p-16">
          <h1 className="font-poppins dark:text-white text-nft-black-1 font-extrabold text-3xl">
            No NFTs Owned.
          </h1>
        </div>
      ) : (
        <div className="sm:px-4 p-12 w-full minmd:w-4/5 flexCenter flex-col">
          <div className="flex-1 w-full flex flex-row sm:flex-col px-4 sx:px-0 minlg:px-8">searchBar</div>
          <div className="mt-3 w-full flex flex-wrap">
            {nfts.map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNFT;
