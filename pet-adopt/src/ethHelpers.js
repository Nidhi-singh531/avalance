// frontend/ethHelpers.js
import { ethers } from "ethers";

// update with your deployed contract address & ABI (after compiling)
export const CONTRACT_ADDRESS = "0x567E78dd771283A44DF7e65211f3766Bb879d5e2";

export const CONTRACT_ABI = 
[{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"string","name":"petId","type":"string"}],"name":"NFTRevoked","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"petId","type":"string"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"address","name":"owner","type":"address"}],"name":"PetAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"petId","type":"string"},{"indexed":false,"internalType":"address","name":"adopter","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"donation","type":"uint256"}],"name":"PetAdopted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"petId","type":"string"}],"name":"PetRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"petId","type":"string"},{"indexed":false,"internalType":"string","name":"name","type":"string"}],"name":"PetUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"}],"name":"UserBanned","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"string","name":"role","type":"string"},{"indexed":false,"internalType":"uint256","name":"expiry","type":"uint256"},{"indexed":false,"internalType":"string","name":"digitalId","type":"string"}],"name":"UserRegistered","type":"event"},{"inputs":[{"internalType":"string","name":"_petId","type":"string"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_breed","type":"string"},{"internalType":"uint256","name":"_age","type":"uint256"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"string","name":"_image","type":"string"}],"name":"addPet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_petId","type":"string"}],"name":"adoptPet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"adoptionFeePercent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"banUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"digitalIdToAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_digitalId","type":"string"}],"name":"getAddressByDigitalId","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAllPets","outputs":[{"internalType":"string[]","name":"","type":"string[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_petId","type":"string"}],"name":"getPet","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"address","name":"","type":"address"},{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"nftToPetId","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"petIds","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"pets","outputs":[{"internalType":"string","name":"petId","type":"string"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"breed","type":"string"},{"internalType":"uint256","name":"age","type":"uint256"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"image","type":"string"},{"internalType":"address","name":"petOwner","type":"address"},{"internalType":"bool","name":"available","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_digitalId","type":"string"},{"internalType":"string","name":"_role","type":"string"}],"name":"registerUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_petId","type":"string"}],"name":"removePet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"revokeNFT","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"siteOwner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_petId","type":"string"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_breed","type":"string"},{"internalType":"uint256","name":"_age","type":"uint256"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"string","name":"_image","type":"string"}],"name":"updatePet","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"users","outputs":[{"internalType":"address","name":"userAddress","type":"address"},{"internalType":"string","name":"role","type":"string"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"bool","name":"verified","type":"bool"},{"internalType":"bool","name":"banned","type":"bool"},{"internalType":"string","name":"digitalId","type":"string"}],"stateMutability":"view","type":"function"}]
;

export async function connectWallet() {
  if (!window.ethereum) throw new Error("MetaMask not installed");
  await window.ethereum.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  return { provider, signer, address };
}

export function getContractWithSigner(signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
}

export function getReadOnlyContract() {
  const provider = new ethers.BrowserProvider(window.ethereum || window.fetch ? window.ethereum : null);
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
}

// frontend calls this after backend returns digitalId
export async function registerUserOnChain(signer, digitalId, role) {
  // signer = obtained from connectWallet().signer
  const contract = getContractWithSigner(signer);
  const tx = await contract.registerUser(digitalId, role);
  await tx.wait();
  return tx.hash;
}

export async function addPetOnChain(signer, pet) {
  // pet = { petId, name, breed, age, description, image }
  const contract = getContractWithSigner(signer);
  const tx = await contract.addPet(pet.petId, pet.name, pet.breed, pet.age, pet.description, pet.image);
  await tx.wait();
  return tx.hash;
}

export async function adoptPetOnChain(signer, petId, donationEth) {
  // donationEth is a string like "0.01"
  const contract = getContractWithSigner(signer);
  const tx = await contract.adoptPet(petId, { value: ethers.parseEther(donationEth) });
  await tx.wait();
  return tx.hash;
}

export async function updatePetOnChain(signer, pet) {
  const contract = getContractWithSigner(signer);
  const tx = await contract.updatePet(pet.petId, pet.name, pet.breed, pet.age, pet.description, pet.image);
  await tx.wait();
  return tx.hash;
}

export async function removePetOnChain(signer, petId) {
  const contract = getContractWithSigner(signer);
  const tx = await contract.removePet(petId);
  await tx.wait();
  return tx.hash;
}

export async function fetchAllPetIds() {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = getReadOnlyContract();
  const petIds = await contract.getAllPets();
  return petIds;
}

export async function fetchPetDetails(petId) {
  const provider = new ethers.BrowserProvider(window.ethereum);
  const contract = getReadOnlyContract();
  const pet = await contract.getPet(petId);
  // returns tuple: [name, breed, age, description, image, owner, available]
  return pet;
}