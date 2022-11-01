// const fs = require("fs-extra")
import { ethers } from "ethers";
import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import axios from "axios";
// import FormData from "form-data";
const FormData = require("form-data");
require("dotenv").config();
const fs = require("fs");

import { create as ipfshttpClient } from "ipfs-http-client";

import { marketAddress, marketAbi } from "./constants";
const fetchContract = (signerOrProvider) => new ethers.Contract(marketAddress, marketAbi, signerOrProvider);


const client = ipfshttpClient("https://ipfs.infura.io:5001/api/v0");

export const NFTContext = React.createContext();

export const NFTProvider = ({ children }) => {
  const nftCurrency = "ETH";
  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    if (!window.ethereum) return alert("install metamask");
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      setCurrentAccount(accounts[0]);
    } else {
      console.log("n accounts found");
    }
  };

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("install metamask");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAccount(accounts[0]);
    // window.location.reload()
  };

  const uploadToIpfs = async (file, setFileUrl) => {
    try {
      //   let f = 0
      // var data = new FormData();
      // data.append("file", file)
      // // data.append(
      // //   "file", fs.createReadStream("/home/arun/Desktop/task2_nft/metadata2.json")),
      // data.append("pinataOptions", '{"cidVersion": 1}'),
      // data.append(
      //   "pinataMetadata",
      //   `{"name": file${f++}, "keyvalues": {"company": "Pinata"}}`
      // );

      // var config = {
      //   method: "post",
      //   url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
      //   headers: {
      //     pinata_api_key: process.env.PINATA_API,
      //     pinata_secret_api_key: process.env.PINATA_SERET_KEY,
      //     ...data.getHeaders(),
      //   },
      //   data: data,
      // };
      var data = new FormData();
      data.append("file", file);
      data.append("pinataOptions", '{"cidVersion": 1}');
      data.append(
        "pinataMetadata",
        '{"name": "metadata2", "keyvalues": {"company": "Pinata"}}'
      );

      var config = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjZDliMzE2Zi0zNGI4LTRiMjYtYmU0ZS04MzZiNzc2ODVjOWEiLCJlbWFpbCI6IjBhcnVua3VtYXIxNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZmU5NDU0ZmEwY2QxMjBkZjQ3ZTgiLCJzY29wZWRLZXlTZWNyZXQiOiJjM2VlNzU5MWQzZDBiM2E2MDg1NWRmOWIyZGU3Y2FiNzZiMzdjYWM4ZjQwZDUxYmZjMmE0NmI0Yzc3NGZlMDNiIiwiaWF0IjoxNjY1NjU2NDEzfQ.SuWy7q35knw6YL_jZ93_7upRbf2aR6eCLuj80VbD9Z8",
          // pinata_api_key: process.env.PINATA_API,
          // pinata_secret_api_key: process.env.PINATA_SERET_KEY,
          ...data.getHeaders,
        },
        data: data,
      };
      // const added = await client.add({ content: file });
      // const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      const added = await axios(config);
      const url = `https://gateway.pinata.cloud/ipfs/${added.data.IpfsHash}`;
      return url;
    } catch (error) {
      console.log("error uploading file to IPFS", error);
    }
  };

  const createNFT = async (formInput, fileUrl, router) => {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const mdata = { name, description, image: fileUrl };
    try {
      var data = JSON.stringify({
        pinataOptions: {
          cidVersion: 1,
        },
        pinataMetadata: {
          name: "testing",
          keyvalues: {
            customKey: "customValue",
            customKey2: "customValue2",
          },
        },
        pinataContent: {
          mdata,
        },
      });
      var config = {
        method: "post",
        url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJjZDliMzE2Zi0zNGI4LTRiMjYtYmU0ZS04MzZiNzc2ODVjOWEiLCJlbWFpbCI6IjBhcnVua3VtYXIxNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZmU5NDU0ZmEwY2QxMjBkZjQ3ZTgiLCJzY29wZWRLZXlTZWNyZXQiOiJjM2VlNzU5MWQzZDBiM2E2MDg1NWRmOWIyZGU3Y2FiNzZiMzdjYWM4ZjQwZDUxYmZjMmE0NmI0Yzc3NGZlMDNiIiwiaWF0IjoxNjY1NjU2NDEzfQ.SuWy7q35knw6YL_jZ93_7upRbf2aR6eCLuj80VbD9Z8",
          // pinata_api_key: process.env.PINATA_API,
          // pinata_secret_api_key: process.env.PINATA_SERET_KEY,
        },
        data: data,
      };
        const added = await axios(config);
        const url = `https://gateway.pinata.cloud/ipfs/${added.data.IpfsHash}`;
        await createSale(url, price)
        router.push("/")
    } catch (e) {
      console.log("metadata upload failed", e);
    }
  };

  const createSale = async (url, formInputPrice, isReselling, id) => {
    const web3modal = new Web3Modal()
    const connection = await web3modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    const price = ethers.utils.parseUnits(formInputPrice, "ether")
    const contract = fetchContract(signer)
    const listingPrice = contract.getListingPrice()
    const transaction = await contract.createToken(url, price, {value: listingPrice})
    await transaction.wait()
  }

  const fetchNFTs = async () => {
    const provider = new ethers.providers.JsonRpcProvider()
    const contract = fetchContract(provider)
    const dataItem = await contract.fetchMarketItems();
    console.log(dataItem)
    const items = await Promise.all(dataItem.map(async ({tokenId, seller, owner, price: unformattedPrice}) => {
      const tokenUri = await contract.tokenURI(tokenId)
      // const {data: {image, name, description}} = await axios.get(tokenUri)
      // console.log(tokenUri.slice(34))
      // var config = {
      //   method: "get",
      //   url: `https://api.pinata.cloud/data/pinList?hashContains=${tokenUri.slice(34)}`,
      //   headers: {
      //     Authorization: "Bearer PINATA JWT",
      //   },
      // };
      const data = await axios.get(tokenUri);
      const price = ethers.utils.formatUnits(unformattedPrice.toString(), "ether");
      console.log(data.data.mdata)
      return {
        price,
        tokenId: tokenId.toNumber(),
        seller,
        owner,
        image: data.data.mdata.image,
        name: data.data.mdata.name,
        description: data.data.mdata.description,
        tokenUri,
      };
    }))
    console.log("items", items)
    return items
  }

  const fetchMyNFTorListedNFT = async (type) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    const dataItem =
      type === "fetchItemsListed"
        ? await contract.fetchItemsListed()
        : await contract.fetchMyNFTs();

    const items = await Promise.all(
      dataItem.map(
        async ({ tokenId, seller, owner, price: unformattedPrice }) => {
          const tokenUri = await contract.tokenURI(tokenId);
          const data = await axios.get(tokenUri);
          const price = ethers.utils.formatUnits(
            unformattedPrice.toString(),
            "ether"
          );
          // console.log(data.data.mdata);
          return {
            price,
            tokenId: tokenId.toNumber(),
            seller,
            owner,
            image: data.data.mdata.image,
            name: data.data.mdata.name,
            description: data.data.mdata.description,
            tokenUri,
          };
        }
      )
    );
    return items
  }

  return (
    <NFTContext.Provider
      value={{
        nftCurrency,
        connectWallet,
        currentAccount,
        uploadToIpfs,
        createNFT,
        fetchNFTs,
        fetchMyNFTorListedNFT,
      }}
    >
      {children}
    </NFTContext.Provider>
  );
};
