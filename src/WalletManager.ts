import "dotenv/config";
import {
  generateKeyPairSigner,
  writeKeyPairSigner,
  createKeyPairSignerFromBytes,
} from "@solana/kit";

import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";

export class WalletManager {
  async loadOrCreateWallet(walletPath: string) {
    if (existsSync(walletPath)) {
      // Read our saved wallet.
      const savedWallet = await readFile(walletPath, "utf8");

      // Convert saved JSON into bytes.
      const bytes = new Uint8Array(JSON.parse(savedWallet));

      // Load our wallet from the saved bytes
      const wallet = await createKeyPairSignerFromBytes(bytes);
      console.log("Wallet loaded: ", wallet.address);
      return wallet;
    }
    // Generate our first solana Wallet.
    const wallet = await generateKeyPairSigner(true);

    // Display the wallet's public address.
    console.log("Wallet Address:", wallet.address);

    // Save our wallet to a file
    await writeKeyPairSigner(wallet, walletPath);

    // Confirm the wallet was saved.
    console.log("Wallet saved to:", walletPath);
    return wallet;
  }
}
