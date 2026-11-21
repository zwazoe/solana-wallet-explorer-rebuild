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
}
