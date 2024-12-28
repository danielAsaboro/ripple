// File: /data/faq/index.ts

export * from "./types";
export * from "./walletFAQs";
export * from "./donationsFAQs";
export * from "./supportFAQs";
export * from "./transparencyFAQs";
export * from "./accountFAQs";

import { FAQData } from "./types";
import { walletFAQs } from "./walletFAQs";
import { donationsFAQs } from "./donationsFAQs";
import { supportFAQs } from "./supportFAQs";
import { transparencyFAQs } from "./transparencyFAQs";
import { accountFAQs } from "./accountFAQs";

export const faqData: FAQData = {
  wallet: walletFAQs,
  donations: donationsFAQs,
  support: supportFAQs,
  transparency: transparencyFAQs,
  account: accountFAQs,
};
