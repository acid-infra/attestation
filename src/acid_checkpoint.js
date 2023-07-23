import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

export const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // mainnet v0.26

// Initialize the sdk with the address of the EAS Schema contract address
const eas = new EAS(EASContractAddress);
const offchain = await eas.getOffchain();

const schemaEncoder = new SchemaEncoder("string tx_id");

// https://easscan.org/schema/view/0xc07c6b7206c345c518609954ee52594c31a64bc5ba994038c1e7f3a8e7c89f96
const schemaUID =
  "0xc07c6b7206c345c518609954ee52594c31a64bc5ba994038c1e7f3a8e7c89f96";

export const createOffchainAttestation = async (tx_id) => {
  const encodedData = schemaEncoder.encodeData([
    { name: "tx_id", value: tx_id, type: "string" },
  ]);

  const signer = new ethers.Wallet(
    process.env.privateKey,
    ethers.getDefaultProvider(
      "https://smart-still-county.quiknode.pro/1e9cd4d09a863c271e1535ac0b39e51a14057de7/"
    )
  );

  const offchainAttestation = await offchain.signOffchainAttestation(
    {
      recipient: "0x2a725870cF241eb50A4013eA9e28323E0c6398D4",
      // Unix timestamp of when attestation expires. (0 for no expiration)
      expirationTime: 0,
      // Unix timestamp of current time
      time: Date.now(),
      revocable: false,
      version: 1,
      nonce: 0,
      schema: schemaUID,
      // "0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995",
      refUID:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      data: encodedData,
    },
    signer
  );

  return offchainAttestation;
};
