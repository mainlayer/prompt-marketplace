import { MainlayerClient } from '@mainlayer/sdk';

const ml = new MainlayerClient({ apiKey: process.env.MAINLAYER_API_KEY! });

/**
 * Example: List available prompts and their pricing from Mainlayer resources
 */
async function listPrompts() {
  console.log('Fetching available prompts from Mainlayer...\n');

  const resources = await ml.resources.list({ type: 'prompt' });

  for (const resource of resources) {
    console.log(`ID: ${resource.id}`);
    console.log(`Name: ${resource.name}`);
    console.log(`Price: $${(resource.price / 100).toFixed(2)}`);
    console.log('---');
  }

  console.log(`\nTotal prompts: ${resources.length}`);
}

/**
 * Example: Purchase a prompt using a buyer token
 */
async function purchasePrompt(promptId: string, buyerToken: string) {
  console.log(`Purchasing prompt ${promptId}...`);

  const result = await ml.resources.verifyAccess(promptId, buyerToken);

  if (result.granted) {
    console.log('Purchase successful!');
    console.log(`Access token: ${result.accessToken}`);
    return result.accessToken;
  } else {
    console.log('Payment required. Redirecting to checkout...');
    const checkoutUrl = await ml.checkout.create({ resourceId: promptId });
    console.log(`Checkout URL: ${checkoutUrl}`);
    return null;
  }
}

/**
 * Example: Vendor registers a new prompt for sale
 */
async function sellPrompt(promptContent: string, price: number) {
  const promptId = `prompt-${Date.now()}`;

  const resource = await ml.resources.create({
    id: promptId,
    name: 'My Custom Prompt',
    price,
    metadata: {
      type: 'prompt',
      previewText: promptContent.substring(0, 100),
    },
  });

  console.log(`Prompt registered for sale: ${resource.id}`);
  console.log(`Price: $${(price / 100).toFixed(2)}`);
  return resource;
}

// Run examples
listPrompts().catch(console.error);
