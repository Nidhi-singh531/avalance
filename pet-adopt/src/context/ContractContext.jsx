// src/context/ContractContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import PetAdoptionABI from "../abis/PetAdoption.json"; // Path to your ABI JSON

const ContractContext = createContext();

export const ContractProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);

  const contractAddress = "0x567E78dd771283A44DF7e65211f3766Bb879d5e2"; // replace with your deployed contract

  useEffect(() => {
    const load = async () => {
      if (window.ethereum) {
        try {
          const tempProvider = new BrowserProvider(window.ethereum);
          setProvider(tempProvider);

          // Request accounts
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          setAccount(accounts[0]);

          const tempSigner = await tempProvider.getSigner();
          setSigner(tempSigner);

          const tempContract = new Contract(
            contractAddress,
            PetAdoptionABI.abi, // ✅ must use .abi inside JSON
            tempSigner
          );
          setContract(tempContract);

          // Handle account changes
          window.ethereum.on("accountsChanged", (accounts) => {
            setAccount(accounts[0]);
          });
        } catch (err) {
          console.error("Error loading contract:", err);
        }
      } else {
        console.log("Install MetaMask!");
      }
    };

    load();
  }, []);

  return (
    <ContractContext.Provider value={{ provider, signer, contract, account }}>
      {children}
    </ContractContext.Provider>
  );
};

export const useContract = () => useContext(ContractContext);
