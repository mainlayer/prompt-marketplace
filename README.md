# Prompt Marketplace

![CI](https://github.com/mainlayer/prompt-marketplace/actions/workflows/ci.yml/badge.svg) ![License](https://img.shields.io/badge/license-MIT-blue)

Production-ready marketplace for buying and selling AI prompt templates. Built with Next.js, TypeScript, and Mainlayer payment infrastructure.

## Features

**For Buyers**
- Browse curated AI prompts by category, tags, and search
- Preview prompts before purchase
- One-click checkout with Mainlayer payment
- Instant access to full prompt content after payment
- View ratings and purchase counts

**For Sellers**
- List prompts with pricing, categories, and tags
- Real-time earnings dashboard
- Sales history and customer analytics
- Revenue tracking (daily/weekly/monthly)
- Pending balance management

## Quick Start

### Prerequisites
- Node.js 18+
- Mainlayer account and API key from https://docs.mainlayer.fr

### Setup

```bash
npm install
export MAINLAYER_API_KEY="your-api-key"
npm run dev
```

Open http://localhost:3000 to browse prompts.

## Architecture

```
prompt-marketplace/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Prompt discovery/browsing
│   │   ├── prompts/[id]/      # Prompt detail page
│   │   ├── dashboard/         # Vendor dashboard
│   │   └── api/purchase/      # Payment verification
│   ├── lib/
│   │   └── mainlayer.ts       # Mainlayer SDK integration
│   └── types/
│       └── index.ts           # Domain models
├── tests/                      # Test suite
├── examples/                   # Implementation examples
└── package.json
```

## Usage

### For Buyers: Purchase a Prompt

```typescript
import { initiateCheckout } from '@/lib/mainlayer';

// 1. Initiate checkout
const checkout = await initiateCheckout('prompt-001', 'https://myapp.com/return');

// 2. Redirect to: checkout.checkoutUrl
window.location.href = checkout.checkoutUrl;

// 3. After payment, verify access
const { granted, accessToken } = await verifyPurchaseAccess('prompt-001', buyerToken);

if (granted) {
  // Fetch full prompt content from /api/purchase
  const response = await fetch('/api/purchase', {
    method: 'POST',
    body: JSON.stringify({ promptId: 'prompt-001', buyerToken })
  });
  const { promptContent } = await response.json();
}
```

### For Sellers: List a Prompt

```typescript
import { createPromptResource } from '@/lib/mainlayer';

// Register prompt as a payable resource
const resource = await createPromptResource(
  'my-prompt-001',
  2999, // $29.99 in cents
  {
    vendorId: 'vendor-123',
    vendorName: 'Your Company',
    category: 'Development',
    tags: ['typescript', 'testing', 'best-practices']
  }
);

// Prompt is now purchasable via marketplace
```

### Verify Revenue

```typescript
import { getVendorBalance } from '@/lib/mainlayer';

const balance = await getVendorBalance('vendor-123');
console.log(`Total earnings: $${balance.total / 100}`);
console.log(`Pending balance: $${balance.pending / 100}`);
```

## Database Setup (Production)

Replace mock data in:
- `src/app/page.tsx` - Implement `getPrompts()` to fetch from database
- `src/app/dashboard/page.tsx` - Query vendor data with auth
- `src/app/prompts/[id]/page.tsx` - Fetch individual prompts

Example with Prisma:

```typescript
// src/app/page.tsx
async function getPrompts(filters?: DiscoveryFilters): Promise<Prompt[]> {
  return await prisma.prompt.findMany({
    where: {
      category: filters?.category,
      tags: { hasSome: filters?.tags },
    },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    take: filters?.limit ?? 12,
    skip: ((filters?.page ?? 1) - 1) * (filters?.limit ?? 12),
  });
}
```

## API Reference

### POST /api/purchase
Verify payment and retrieve prompt content.

**Request**
```json
{
  "promptId": "prompt-001",
  "buyerToken": "tok_xxx"
}
```

**Response (200)**
```json
{
  "success": true,
  "accessToken": "access_xxx",
  "promptContent": "You are an expert..."
}
```

**Response (402 - Payment Required)**
```json
{
  "success": false,
  "paymentRequired": true,
  "checkoutUrl": "https://checkout.mainlayer.fr/..."
}
```

## Testing

```bash
npm test                       # Run all tests
npm run test -- --watch      # Watch mode
npm run build && npm start   # Production build
```

## Environment Variables

```env
MAINLAYER_API_KEY="your-mainlayer-api-key"
# Optional:
MAINLAYER_BASE_URL="https://api.mainlayer.fr"
NODE_ENV="production"
```

## Cost Structure

- **Mainlayer transaction fee**: 2.5% per sale
- **Processing**: Instant settlement via Mainlayer
- **Withdrawals**: Available in vendor dashboard

## Security

- All API keys stored server-side only
- Payment verification via Mainlayer SDK
- Input validation on all endpoints
- CORS configured appropriately
- No sensitive data in browser

## Support & Docs

- **Mainlayer API Docs**: https://docs.mainlayer.fr
- **GitHub Issues**: https://github.com/mainlayer/prompt-marketplace/issues
- **Examples**: See `/examples` directory

## License

MIT
