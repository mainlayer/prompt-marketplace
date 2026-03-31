# prompt-marketplace
![CI](https://github.com/mainlayer/prompt-marketplace/actions/workflows/ci.yml/badge.svg) ![License](https://img.shields.io/badge/license-MIT-blue)

Marketplace for AI prompt templates — buy and sell prompts with payments via Mainlayer.

## Installation
```
npm install @mainlayer/sdk
```

## Quickstart
```ts
import { MainlayerClient } from '@mainlayer/sdk';

const ml = new MainlayerClient({ apiKey: process.env.MAINLAYER_API_KEY });

// Verify a buyer has paid for a prompt
const result = await ml.resources.verifyAccess('prompt-001', buyerToken);

if (result.granted) {
  // Return the full prompt content
  const promptContent = await getPromptContent('prompt-001');
  return { success: true, promptContent };
} else {
  // Direct buyer to checkout
  const checkoutUrl = await ml.checkout.create({ resourceId: 'prompt-001' });
  return { paymentRequired: true, checkoutUrl };
}
```

## Features
- Browse and search prompt templates by category and tags
- Purchase prompts with one-time payment via Mainlayer
- Vendor dashboard with revenue tracking and sales history
- Preview text shown before purchase; full content unlocked after payment

📚 Full docs at [mainlayer.fr](https://mainlayer.fr)
