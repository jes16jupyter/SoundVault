import { ethers } from "ethers";
import addressjson from '../config/contracts/ganache-MusicVaultAddress.json';
import artifact from '../config/contracts/ganache-MusicVault.json'

const address = addressjson.contract;
const abi = artifact.abi;
const getMusicVault = function(provider){
    return new ethers.Contract(address,abi,provider);
}
export default getMusicVault;