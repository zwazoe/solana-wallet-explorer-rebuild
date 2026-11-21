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
}
