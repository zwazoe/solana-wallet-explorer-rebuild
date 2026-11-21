import "dotenv/config";
import { createSolanaRpc, createSolanaRpcSubscriptions } from "@solana/kit";

export class SolanaConnection {
  readonly connectWithSolanaRpc = () => {
    // Create our HTTP RPC client.
    const rpc = createSolanaRpc(
      process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
    );

    // Create our WebSocket subscription client.
    const rpcSubscriptions = createSolanaRpcSubscriptions(
      process.env.SOLANA_WS_URL ?? "wss://api.devnet.solana.com",
    );

    return { rpc, rpcSubscriptions };
  };

  // Retry failed RPC requests using Finonacci delays
  async retry<T>(operation: () => Promise<T>): Promise<T> {
    const delays = [1000, 2000, 3000, 5000, 8000, 16000];

    for (let attempt = 0; attempt <= delays.length; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (attempt == delays.length) {
          throw new Error("RPC requests failed after all attempts", {
            cause: error,
          });
        }

        const seconds = delays[attempt] / 1000;

        console.log(`RPC request failed. Retrying in ${seconds} seconds...`);

        await new Promise<void>((resolve) =>
          setTimeout(resolve, delays[attempt]),
        );
      }
    }
    throw new Error("RPC requests failed");
  }
}
