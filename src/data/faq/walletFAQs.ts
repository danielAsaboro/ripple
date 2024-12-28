// File: /data/faq/walletFAQs.ts

import { FAQSection } from "./types";

export const walletFAQs: FAQSection = {
  title: "Wallet & Security",
  items: [
    {
      question: "What is a wallet, and why do I need one?",
      answer:
        "A wallet is a digital tool that allows you to store, send, and receive cryptocurrency. You need a wallet to make donations or start campaigns on this platform, as all transactions are conducted via blockchain.",
    },
    {
      question: "What wallets are supported on this platform?",
      answer:
        "We support major Solana wallets including Phantom, Solflare, and other Solana-compatible wallets.",
    },
    {
      question: "How do I connect my wallet to the platform?",
      answer:
        'Click the "Connect Wallet" button in the top right corner, select your preferred wallet, and follow the prompts to connect.',
    },
    {
      question: "What is a private key?",
      answer:
        "A private key is a secure code that gives you access to your cryptocurrency. Never share your private key with anyone - it's like the password to your wallet.",
    },
    {
      question: "How do I secure my private key?",
      answer:
        "Store your private key offline in a secure location, consider using a hardware wallet, and never share it with anyone. We recommend enabling two-factor authentication for additional security.",
    },
    {
      question: "What is a seed phrase, and why is it important?",
      answer:
        "A seed phrase is a series of words that can restore access to your wallet if you lose access. Keep it secure and offline - anyone with your seed phrase can access your wallet.",
    },
  ],
};
