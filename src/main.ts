import "dotenv/config";
import { createSolanaRpc } from "@solana/kit";

// Create our Solana RPC Client.

const rpc = createSolanaRpc(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

console.log("Solana Wallet Explorer");

// Create our async main function.

async function main() {
  console.log("Connecting to Solana Devnet...");

  // Retrieve the curretnt slot.
  const slot = await rpc.getSlot().send();

  // Display the result
  console.log("Connected to Solana Devnet");
  console.log("Current Slot: ", slot);
}

// Execute our main function

main().catch((error) => {
  console.error("Connectiono failed:", error);
  process.exitCode = 1;
});
