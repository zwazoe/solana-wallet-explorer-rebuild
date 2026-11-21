import "dotenv/config";
import {
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  generateKeyPairSigner,
  writeKeyPairSigner,
  createKeyPairSignerFromBytes,
} from "@solana/kit";

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

// Create our Solana RPC Client.

const rpc = createSolanaRpc(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

// Create our WebSocket subscription client.
const rpcSubscriptions = createSolanaRpcSubscriptions(
  process.env.SOLANA_WS_URL ?? "wss://api.devnet.solana.com",
);

// Read our wallet path from .env
const walletPath = process.env.WALLET_PATH ?? "./devnet-wallet.json";

console.log("Solana Wallet Explorer");

// Create our async main function.

async function main() {
  console.log("Connecting to Solana Devnet...");

  // Retrieve the curretnt slot.
  const slot = await rpc.getSlot().send();

  // Display the result
  console.log("Connected to Solana Devnet");
  console.log("Current Slot: ", slot);

  if (existsSync(walletPath)) {
    // Read our saved wallet.
    const savedWallet = await readFile(walletPath, "utf8");

    // Convert saved JSON into bytes.
    const bytes = new Uint8Array(JSON.parse(savedWallet));

    // Load our wallet from the saved bytes
    const wallet = await createKeyPairSignerFromBytes(bytes);
    console.log("Wallet loaded: ", wallet.address);
  } else {
    // Generate our first solana Wallet.
    const wallet = await generateKeyPairSigner(true);

    // Display the wallet's public address.
    console.log("Wallet Address:", wallet.address);

    // Save our wallet to a file
    await writeKeyPairSigner(wallet, walletPath);

    // Confirm the wallet was saved.
    console.log("Wallet saved to:", walletPath);
  }
}

// Execute our main function

main().catch((error) => {
  console.error("Connectiono failed:", error);
  process.exitCode = 1;
});
