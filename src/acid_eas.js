import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { ethers } from "ethers";

export const EASContractAddress = "0xC2679fBD37d54388Ce493F1DB75320D236e1815e"; // mainnet v0.26

// Initialize the sdk with the address of the EAS Schema contract address
const eas = new EAS(EASContractAddress);

// Gets a default provider (in production use something else like infura/alchemy)
const provider = ethers.providers.getDefaultProvider(
  "https://smart-still-county.quiknode.pro/1e9cd4d09a863c271e1535ac0b39e51a14057de7/"
);

// Connects an ethers style provider/signingProvider to perform read/write functions.
// MUST be a signer to do write operations!
eas.connect(provider);

// Initialize SchemaEncoder with the schema string
const schemaEncoder = new SchemaEncoder(
  "address validator,uint24 num_block_validated,bytes signature,bytes signed_data"
);

const schemaUID =
  "0x67674663c30da384fbd7b7ddbce26f2a434076a0b4c67bd1f10c199247ab7fdc";

// genesis attestation: https://easscan.org/attestation/view/0x56931362a56a93c21aa650e9ea43346ec4ecbc44e86495cc449f323564bd7bb4
export const createAttestation = async (
  validator,
  block_num,
  signature,
  signed_data
) => {
  const encodedData = schemaEncoder.encodeData([
    { name: "validator", value: validator, type: "address" },
    { name: "num_block_validated", value: block_num, type: "uint24" },
    { name: "signature", value: signature, type: "bytes" },
    { name: "signed_data", value: signed_data, type: "bytes" },
  ]);

  const tx = await eas.attest({
    schema: schemaUID,
    data: {
      recipient: "0x2a725870cF241eb50A4013eA9e28323E0c6398D4",
      expirationTime: 0,
      revocable: true,
      data: encodedData,
    },
  });

  const newAttestationUID = await tx.wait();

  console.log("New attestation UID:", newAttestationUID);
  return newAttestationUID;
};

export const getAttestation = async (uid) => {
  const attestation = await eas.getAttestation(uid);

  console.log(attestation);
};
