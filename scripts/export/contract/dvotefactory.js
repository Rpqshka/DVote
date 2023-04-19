import { ethers } from "ethers";
import DVoteFactory from '../../../artifacts/contracts/DVoteFactory.sol/DVoteFactory.json';
import provider  from "../web3";

const abi = DVoteFactory.abi;
const address = "0x792D2a2cEa2710A2813Ef45A02aEF9F3f8b58258";
const dVoteFactory = new ethers.Contract(address, abi, provider);

export default dVoteFactory;