import { useEffect, useState } from "react";
import { ethers } from "ethers";

import TxInfo from "./components/TxInfo";
import ConnectWallet from "./components/ConnectWallet";
import WalletNotDetected from "./components/WalletNotDetected";
import TxError from "./components/TxError";
import Navbar from "./components/Navbar";
import PetItem from "./components/PetItem";

import { contractAddress } from "./address";
import PetAdoptionArtifact from "./contracts/PetAdoption.json";

const HARDHAT_NETWORK_ID = Number(process.env.REACT_APP_NETWORK_ID);

function Dapp() {
  const [pets, setPets] = useState([]);
  const [adoptedPets, setAdoptedPets] = useState([]);
  const [ownedPets, setOwnedPets] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [txError, setTxErrors] = useState(undefined);
  const [txInfo, setTxInfo] = useState(undefined);
  const [view, setView] = useState("home");

  useEffect(() => {
    async function fetchPets() {
      const res = await fetch("/pets.json");
      const data = await res.json();
      setPets(data);
    }

    fetchPets();
  }, []);

  const connectWallet = async () => {
    try {
      const [address] = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      await checkNetwork();
      initializeDapp(address);

      window.ethereum.on("accountsChanged", ([newAddress]) => {
        if (!newAddress) {
          setAdoptedPets([]);
          setOwnedPets([]);
          setContract(undefined);
          setSelectedAddress(undefined);
          setTxErrors(undefined);
          setTxInfo(undefined);
          setView("home");
          return;
        }
        initializeDapp(newAddress);
      });
    } catch (e) {
      console.error(e.message);
    }
  };

  const initializeDapp = async (address) => {
    setSelectedAddress(address);

    const contract = await initContract();
    await getAllAdoptedPets(contract);
  };

  const initContract = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(0);

    const contract = new ethers.Contract(
      contractAddress.PetAdoption,
      PetAdoptionArtifact.abi,
      signer,
    );

    setContract(contract);
    return contract;
  };

  const getAllAdoptedPets = async (contract) => {
    try {
      const adoptedPets = await contract.getAllAdoptedPets();
      const ownedPets = await contract.getAllAdoptedPetsByOwner();

      if (adoptedPets.length > 0) {
        setAdoptedPets(adoptedPets.map((petIdx) => Number(petIdx)));
      } else {
        setAdoptedPets([]);
      }

      if (ownedPets.length > 0) {
        setOwnedPets(ownedPets.map((petIdx) => Number(petIdx)));
      } else {
        setOwnedPets([]);
      }
    } catch (e) {
      console.error(e.message);
    }
  };

  const adoptPet = async (petId) => {
    setTxErrors(undefined);
    try {
      const tx = await contract.adoptPet(petId);
      setTxInfo(tx.hash);

      const received = await tx.wait();

      if (received.status === 0) {
        throw new Error("Transaction failed");
      }

      setAdoptedPets([...adoptedPets, petId]);
      setOwnedPets([...ownedPets, petId]);
    } catch (e) {
      setTxErrors(e?.reason || e.message);
    } finally {
      setTxInfo(undefined);
    }
  };

  const switchNetwork = async () => {
    const chainIdHex = `0x${HARDHAT_NETWORK_ID.toString(16)}`;
    return await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }],
    });
  };

  const checkNetwork = async () => {
    if (window.ethereum.networkVersion !== HARDHAT_NETWORK_ID.toString()) {
      return switchNetwork();
    }

    return null;
  };

  if (!window.ethereum) {
    return <WalletNotDetected />;
  }

  if (!selectedAddress) {
    return <ConnectWallet onConnect={connectWallet} />;
  }

  return (
    <div className="container">
      {txInfo && <TxInfo message={txInfo} />}

      {txError && (
        <TxError message={txError} onDismiss={() => setTxErrors(undefined)} />
      )}

      <br />

      <Navbar address={selectedAddress} onChangeView={setView} />

      <div className="items">
        {view === "home"
          ? pets.map((pet) => (
              <PetItem
                key={pet.id}
                item={pet}
                inProgress={!!txInfo}
                disabled={adoptedPets.includes(pet.id)}
                onAdoptPet={() => adoptPet(pet.id)}
              />
            ))
          : pets
              .filter((pet) => ownedPets.includes(pet.id))
              .map((pet) => (
                <PetItem
                  key={pet.id}
                  item={pet}
                  inProgress={!!txInfo}
                  disabled={adoptedPets.includes(pet.id)}
                  onAdoptPet={() => adoptPet(pet.id)}
                />
              ))}
      </div>
    </div>
  );
}

export default Dapp;
