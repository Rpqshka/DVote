import { ethers } from "ethers";
import Vote from '../../../artifacts/contracts/Vote.sol/Vote.json';
import provider from "../web3";

const abi = Vote.abi;
const address = "0xe17a75b3d0beFDf5C2f9f23334fd18b57BAF763d";
const vote = new ethers.Contract(address, abi, provider);

export default vote;

