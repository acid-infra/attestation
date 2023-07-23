import { useState, useEffect } from "react";
import { ethers, Contract } from "ethers";
import { InputFacet } from "./abis/InputFacet";
import { createAttestation } from "./acid_eas";
import { createOffchainAttestation } from "./acid_checkpoint";
import logo from "./logo.svg";
import "./App.css";

function App() {
  let ethProvider = new ethers.BrowserProvider(window.ethereum);

  let count = 1;

  const getInput = async () => {
    try {
      console.log("getting...");
      let signer = await ethProvider.getSigner();

      const contract = new Contract(
        "0xF8C694fd58360De278d5fF2276B7130Bfdc0192A",
        InputFacet,
        signer
      );
      console.log({ contract });

      const tx = await contract.getInput(1);
      await tx.wait();
      return tx;
    } catch (error) {
      console.log("[ERROR !!] ", error);
    }
  };

  useEffect(() => {
    setInterval(() => {
      const result = getInput();
      if (result) {
        createAttestation(
          "0x95222290DD7278Aa3Ddd389Cc1E1d165CC4BAfe5",
          count + 1
        );
      }
    }, 3000);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
      </header>
    </div>
  );
}

export default App;
