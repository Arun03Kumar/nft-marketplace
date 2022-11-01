import { useContext } from "react";
import Image from "next/image";

import images from "../assets";
import { NFTContext } from "../context/NFTContext";

const CreatorCard = ({ rank, creatorImage, creatorName, creatorsETH }) => {
  const { nftCurrency } = useContext(NFTContext)
  return (
    <div className="min-w-190 minlg:min-w-240 bg-white dark:bg-nft-black-3 border-nft-gray-1 dark:border-nft-black-1 rounded-3xl border-2 flex flex-col p-4 m-4">
      <div className="w-8 h-8 minlg:w-10 minlg:h-10 bg-[#2c5364] flexCenter rounded-full">
        <p className="font-poppins text-white font-semibold text-base minlg:text-lg">
          {rank}
        </p>
      </div>
      <div className="my-2 flex justify-center">
        <div className="relative w-20 h-20 minlg:w-28 minlg:h-28">
          <Image
            src={creatorImage}
            layout="fill"
            objectFit="cover"
            alt="creator"
            className="rounded-full"
          />
          <div className="absolute w-4 h-4 minlg:w-7 minlg:h-7 bottom-2 -right-0">
            <Image
              src={images.tick}
              layout="fill"
              objectFit="contain"
              alt="tick"
            />
          </div>
        </div>
      </div>
      <div className="flexCenter text-center flex-col mt-3 minlg:mt-7">
        <p className="font-poppins font-semibold text-base">{creatorName}</p>
        <p className="font-poppins font-semibold text-base mt-1">
          {creatorsETH.toFixed(2)}{" "}
          <span className="font-normal">{nftCurrency}</span>
        </p>
      </div>
    </div>
  );
};

export default CreatorCard;
