// File: /data/faq/accountFAQs.ts

import { FAQSection } from './types';

export const accountFAQs: FAQSection = {
  title: 'Account Management',
  items: [
    {
      question: 'What should I do if my account is locked?',
      answer: 'If your account is locked, contact our support team with your registered email address to verify your identity and unlock your account.'
    },
    {
      question: 'How do I add or update my wallet address?',
      answer: 'Go to Account Settings, select "Wallet Management," and follow the prompts to add or update your wallet information.'
    },
    {
      question: 'How secure is my account information?',
      answer: 'We use industry-standard encryption and security measures to protect your data. Enable two-factor authentication for additional security.'
    },
    {
      question: 'How do I manage email notifications?',
      answer: 'Navigate to Account Settings > Notifications to customize your email preferences and notification settings.'
    },
    {
      question: "Will I receive updates about campaigns I've donated to?",
      answer: 'Yes, you\'ll receive updates based on your notification preferences. Manage these in your account settings.'
    },
    {
      question: 'Is my donation history private?',
      answer: 'Your donation history is private by default. You can choose to make it public in your account settings.'
    }
  ]
};