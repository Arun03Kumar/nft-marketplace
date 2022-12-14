import { useState, useRef, useEffect, useContext } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";

import Image from "next/image";
// const fs = require("fs-extra");
import { NFTContext } from "../context/NFTContext";

import { Banner, CreatorCard, NFTCard } from "../components";
import { makeId } from "../utils/makeId";

import images from "../assets";

const Home = () => {
  const { theme } = useTheme();
  const parentRef = useRef(null);
  const scrollRef = useRef(null);
  const [hideButton, sethideButton] = useState(false);
  const { fetchNFTs } = useContext(NFTContext);
  const [nfts, setnfts] = useState([]);
  const router = useRouter();


  useEffect(() => {
    console.log("fetch nt")
    fetchNFTs().then((items) => {
      setnfts(items);
      console.log("itme", items);
    }).catch(e => console.log("errorr", e));
  }, [router.isReady]);

  const handleScroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = window.innerWidth > 1800 ? 270 : 210;
    if (direction === "right") {
      current.scrollLeft += scrollAmount;
    } else {
      current.scrollLeft -= scrollAmount;
    }
  };

  const isScrollabe = () => {
    const { current } = scrollRef;
    const { current: parent } = parentRef;
    if (current?.scrollWidth >= parent?.offsetWidth) {
      sethideButton(false);
    } else {
      sethideButton(true);
    }
  };

  useEffect(() => {
    isScrollabe();
    window.addEventListener("resize", isScrollabe);
    return () => {
      window.removeEventListener("resize", isScrollabe);
    };
  });

  return (
    <div className="flex justify-center sm:px-4 p-12">
      <div className="w-full minmd:w-4/5">
        <div className="mx-28">
          <Banner
            name="Discover, Collect and Sell Extraordinary NFT's"
            childStyles="md:text-4xl text-white sm:text-2xl xs:text-xl text-left"
            parentStyles="justify-start mb-6 h-72 sm:h-60 p-12 xs:p-4 xs:h-44 rounded-3xl"
          />
        </div>
        <div className="mt-20">
          <h1 className="font-poppins text-2xl minlg:text-4xl font-semibold ml-28 xs:ml-0">
            Best Creators
          </h1>
          <div
            className="relative flex-1 max-w-full flex mt-3 flexCenter flex-col"
            ref={parentRef}
          >
            <div
              className="flex flex-row w-max overflow-x-scroll no-scrollbar select-none"
              ref={scrollRef}
            >
              {[6, 7, 8, 9, 10].map((i) => (
                <CreatorCard
                  key={`creator-${i}`}
                  rank={i}
                  creatorImage={images[`creator${i}`]}
                  creatorName={`0x${makeId(3)}...${makeId(4)}`}
                  creatorsETH={10 - i * 0.5}
                />
              ))}
              {!hideButton && (
                <>
                  <div
                    onClick={() => handleScroll("left")}
                    className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer left-0"
                  >
                    <Image
                      src={images.left}
                      layout="fill"
                      objectFit="contain"
                      alt="left-arrow"
                      className={theme === "light" && "filter invert"}
                    />
                  </div>
                  <div
                    onClick={() => handleScroll("right")}
                    className="absolute w-8 h-8 minlg:w-12 minlg:h-12 top-45 cursor-pointer right-0"
                  >
                    <Image
                      src={images.right}
                      layout="fill"
                      objectFit="contain"
                      alt="right-arrow"
                      className={theme === "light" && "filter invert"}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-10 ">
          <div className="flexBetween mx-28 xs:ms-0 minlg:mx-8 sm:flex-col sm:items-start">
            <h1 className="flex-1 font-poppins text-2xl minlg:text-4xl font-semibold sm:mb-4">
              Top NFTs
            </h1>
            <div>Search bar </div>
          </div>
          <div className="mt-3 w-full flex flex-wrap justify-center md:justify-center">
            {nfts.map((nft) => (
              <NFTCard key={nft.tokenId} nft={nft} />
            ))}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <NFTCard
                key={`nft-${i}`}
                nft={{ 
                  i,
                  name: `Nifty NFT ${i}`,
                  price: (10 - i * 0.325).toFixed(2),
                  seller: `0x${makeId(3)}...${makeId(4)}`,
                  owner: `0x${makeId(3)}...${makeId(4)}`,
                  description: "Cool NFT on sale",
                  image: images[`nft${i}`],
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
