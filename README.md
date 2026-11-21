# Solana Wallet Explorer — Recap & Rebuild

**Solana Development with TypeScript and Rust**

**Lesson 18 | Project 1 | 20-Step Rebuild**

## About This Project

Welcome to the Solana Wallet Explorer Recap & Rebuild project.

This project is designed to help students reinforce everything they learned while building their first Solana application.

Instead of starting with an empty folder and configuring a new project, students begin with a prepared development environment and focus entirely on rebuilding the application.

The goal is to understand and reproduce the code, not simply copy the completed solution.

## What's Included?

The starter project includes:

- Node.js project configuration and dependencies.
- TypeScript configuration.
- Jest and Vitest configuration.
- Environment variable template.
- A starting `src/main.ts` file.
- Prepared folders for application code and tests.
- Git ignore rules for local files and private wallet keys.

**The completed Solana Wallet Explorer application is intentionally not included.** Students will rebuild it during the lesson.

## Getting Started

### 1. Clone the Starter Project

Clone the repository using the `starter` branch:

`git clone --branch starter https://github.com/YOUR-USERNAME/solana-wallet-explorer-rebuild.git`

Then open the project:

`cd solana-wallet-explorer-rebuild`

Replace `YOUR-USERNAME` with the repository owner's GitHub username.

### 2. Install Dependencies

`npm ci`

All required development dependencies have already been defined in the project.

### 3. Prepare Environment Variables

`cp .env.example .env`

The starter uses Solana Devnet for development.

### 4. Verify the Project

Run:

`npx tsx src/main.ts`

Expected output:

`Solana Wallet Explorer — Ready to Rebuild`

Check TypeScript:

`npx tsc --noEmit`

If these commands complete successfully, you're ready to begin.

## What You'll Rebuild

Throughout the lesson, you'll reconstruct the following functionality:

1. Connecting to Solana Devnet.
2. Creating and saving wallets.
3. Loading existing wallets.
4. Retrieving and formatting SOL balances.
5. Looking up account information.
6. Displaying transaction history.
7. Preparing, signing, and sending SOL transactions.
8. Organizing the application into reusable classes.
9. Handling RPC connection failures.
10. Running the existing Jest and Vitest testing approaches.

Each part builds on concepts introduced in earlier lessons.

## Our Learning Method

Every step follows the same process:

**Known → Rebuild → Verify**

- **Known:** Recall the code and concepts from previous lessons.
- **Rebuild:** Reconstruct a small part of the application.
- **Verify:** Run the code and confirm that it works.

You should complete each checkpoint before moving to the next step.

## Repository Branches

**`starter`** — The original project setup. Use this branch to begin the rebuild.

**`lesson-18-rebuild`** — The working branch containing our progress as we reconstruct the application.

The starter branch remains unchanged throughout the lessons.

## Security

This project uses Solana Devnet for educational purposes.

Never commit `.env`, wallet private keys, or generated wallet JSON files to GitHub.

Keep transaction sending disabled until the relevant lesson explicitly requires it.

---

**Happy building!**
