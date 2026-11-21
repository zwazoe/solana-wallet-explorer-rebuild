import {
  lamportsToSol,
  formatDecimalFixedPoint,
  type Address,
} from "@solana/kit";

import { SolanaConnection } from "./SolanaConnection";

export class WalletExplorer {
  private readonly rpc;
  constructor(private readonly connection: SolanaConnection) {
    this.rpc = connection.connectWithSolanaRpc().rpc;
  }

  // Retrive and format a wallet balance.
  async formattedBalance(
    walletAddress: Address,
    walletName: string = "Wallet",
  ) {
    // Retrieve our wallet balance.
    const balance = await this.rpc.getBalance(walletAddress).send();

    // Display the balance in lamports.
    console.log(`${walletName} balance (lamports):`, balance.value);

    // Convert lamports into SOL.
    const solBalance = lamportsToSol(balance.value);

    // Create our number formatter.
    const formatter = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: solBalance.decimals,
    });

    // Format our SOL balance.
    const formatted = formatDecimalFixedPoint(formatter, solBalance);

    return formatted;
  }

  async showAccountInfo(accountAddress: Address) {
    // Retrieve account information.
    const accountInfo = await this.rpc.getAccountInfo(accountAddress).send();

    // Display the account information
    if (accountInfo.value !== null) {
      console.log("Account Address:", accountAddress);
      console.log("Account Owner:", accountInfo.value.owner);
      console.log("Executable:", accountInfo.value.executable);
      console.log("Lamports:", accountInfo.value.lamports);
    } else {
      console.log("Account not found on Devnet");
    }
  }

  async showtransactionHistory(walletAddress: Address) {
    // Retrieve our recent transactions.
    const transactions = await this.rpc
      .getSignaturesForAddress(walletAddress, {
        limit: 5,
        commitment: "confirmed",
      })
      .send();

    // Display the number of transactions.
    console.log("Transactions found: ", transactions.length);

    // Display each transaction.
    for (const t of transactions) {
      console.log("______________________________");
      console.log("Signature:", t.signature);

      if (t.err) {
        console.log("Error:", t.err);
        continue;
      }

      console.log("Slot:", t.slot);
      console.log("Confirmation:", t.confirmationStatus);
    }
  }
}
