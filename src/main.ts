import "dotenv/config";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";
import { WalletManager } from "./WalletManager";
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

// Create our wallet manager.
const walletManager = new WalletManager();
console.log("Solana Wallet Explorer");

// Create our async main function.

async function main() {
  console.log("Connecting to Solana Devnet...");

  // Retrieve the curretnt slot.
  const slot = await rpc.getSlot().send();

  // Display the result
  console.log("Connected to Solana Devnet");
  console.log("Current Slot: ", slot);

  // Load or create our wallet
  const wallet = await walletManager.loadOrCreateWallet(walletPath);
}

// Execute our main function

main().catch((error) => {
  console.error("Connectiono failed:", error);
  process.exitCode = 1;
});
