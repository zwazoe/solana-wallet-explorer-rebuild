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
}
