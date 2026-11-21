import "dotenv/config";
import { SolanaConnection } from "./SolanaConnection";
import { WalletManager } from "./WalletManager";
import { WalletExplorer } from "./WalletExplorer";

import {
  address,
  lamports,
  pipe,
  createTransactionMessage,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  appendTransactionMessageInstruction,
} from "@solana/kit";

// Import our SOL transfer instruction
import { getTransferSolInstruction } from "@solana-program/system";

// Read our wallet path from .env
const walletPath = process.env.WALLET_PATH ?? "./devnet-wallet.json";

// Create our class isntances
const connection = new SolanaConnection();
const walletManager = new WalletManager();
const walletExplorer = new WalletExplorer(connection);

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

  const formatted = await walletExplorer.formattedBalance(wallet.address);

  // Display our SOL balance.
  console.log("Wallet balance (SOL)", formatted);

  // Look up another wallet.
  const otherWalletAddress = address(
    "83astBRguLMdt2h5U1Tpdq5tjFoJ6noeGwaY3mDLVcri",
  );

  // Retrieve the other wallet's balance.
  const otherBalance = await walletExplorer.formattedBalance(
    otherWalletAddress,
    "Other Wallet",
  );

  // Display the other wallet's SOL balance.
  console.log("Other wallet balance (SOL): ", otherBalance);

  // Look up existing Solana account.
  const accountAddress = address("11111111111111111111111111111111");

  await walletExplorer.showAccountInfo(accountAddress);

  // Retrieve our transaction history
  await walletExplorer.showtransactionHistory(wallet.address);

  // Load or Create our recipient wallet.
  const recipientPath =
    process.env.RECIPIENT_WALLET_PATH ?? "./devnet-recipient.json";

  const recipientWallet = await walletManager.loadOrCreateWallet(recipientPath);
  console.log("Recipient Address: ", recipientWallet.address);

  if (wallet.address === recipientWallet.address) {
    throw new Error("Sneder and recipient connot be the same wallet");
  }
  const transferInstruction = getTransferSolInstruction({
    source: wallet,
    destination: recipientWallet.address,
    amount: lamports(1_000_000n),
  });

  // Retrieve the latest blockhash
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  // Prepare our transaction message
  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (message) => setTransactionMessageFeePayerSigner(wallet, message),
    (message) =>
      setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, message),
    (message) =>
      appendTransactionMessageInstruction(transferInstruction, message),
  );

  // Display our prepared transfer.
  console.log("Transfer amount: 0.001 SOL");
  console.log("From:", wallet.address);
  console.log("To:", recipientWallet.address);
  console.log(
    "Transaction instructions:",
    transactionMessage.instructions.length,
  );
  console.log("Transaction prepared. Nothing sent.");
}

// Execute our main function

main().catch((error) => {
  console.error("Connectiono failed:", error);
  process.exitCode = 1;
});
