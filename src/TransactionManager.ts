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
  type KeyPairSigner,
} from "@solana/kit";

// Import our SOL transfer instruction
import { getTransferSolInstruction } from "@solana-program/system";

export class TransactionManager {
  constructor(
    private readonly connection: SolanaConnection,
    private readonly walletManager: WalletManager,
    private readonly walletExplorer: WalletExplorer,
  ) {}

  async send(wallet: KeyPairSigner) {
    const { rpc, rpcSubscriptions } = this.connection.connectWithSolanaRpc();
    // Load or Create our recipient wallet.
    const recipientPath =
      process.env.RECIPIENT_WALLET_PATH ?? "./devnet-recipient.json";

    const recipientWallet =
      await this.walletManager.loadOrCreateWallet(recipientPath);
    console.log("Recipient Address: ", recipientWallet.address);

    if (wallet.address === recipientWallet.address) {
      throw new Error("Sender and recipient connot be the same wallet");
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
}
