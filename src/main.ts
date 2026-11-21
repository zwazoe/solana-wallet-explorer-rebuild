import "dotenv/config";
import { SolanaConnection } from "./SolanaConnection";
import { WalletManager } from "./WalletManager";
import { lamportsToSol, formatDecimalFixedPoint } from "@solana/kit";

// Read our wallet path from .env
const walletPath = process.env.WALLET_PATH ?? "./devnet-wallet.json";

// Create our class isntances
const connection = new SolanaConnection();
const walletManager = new WalletManager();

console.log("Solana Wallet Explorer");

// Create our async main function.
async function main() {
  console.log("Connecting to Solana Devnet...");

  // Retrieve our RPC clients from SolanaConnection.
  const { rpc } = connection.connectWithSolanaRpc();

  // Retrieve the curretnt slot.
  const slot = await rpc.getSlot().send();

  // Display the result
  console.log("Connected to Solana Devnet");
  console.log("Current Slot: ", slot);

  // Load or create our wallet
  const wallet = await walletManager.loadOrCreateWallet(walletPath);

  // Retrieve our wallet balance.
  const balance = await rpc.getBalance(wallet.address).send();

  // Display the balance in lamports.
  console.log("Wallet balance (lamports):", balance.value);

  // Convert lamports into SOL.
  const solBalance = lamportsToSol(balance.value);

  // Create our number formatter.
  const formatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: solBalance.decimals,
  });

  // Format our SOL balance.
  const formatted = formatDecimalFixedPoint(formatter, solBalance);

  // Display our SOL balance.
  console.log("Wallet balance (SOL)", formatted);
}

// Execute our main function

main().catch((error) => {
  console.error("Connectiono failed:", error);
  process.exitCode = 1;
});
