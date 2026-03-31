import { MainlayerClient } from '@mainlayer/sdk';

if (!process.env.MAINLAYER_API_KEY) {
  throw new Error('MAINLAYER_API_KEY environment variable is required');
}

const ml = new MainlayerClient({ apiKey: process.env.MAINLAYER_API_KEY });

export interface PurchaseAccessResult {
  granted: boolean;
  accessToken?: string;
  error?: string;
}

export interface ResourceMetadata {
  vendorId: string;
  vendorName: string;
  category: string;
  tags: string[];
}

/**
 * Verifies that a buyer has paid for access to a prompt resource.
 * @param resourceId The prompt resource ID
 * @param buyerToken The buyer's payment token from Mainlayer checkout
 * @returns Access verification result
 * @throws Error if API communication fails
 */
export async function verifyPurchaseAccess(
  resourceId: string,
  buyerToken: string
): Promise<PurchaseAccessResult> {
  try {
    const result = await ml.resources.verifyAccess(resourceId, buyerToken);
    return {
      granted: result.granted,
      accessToken: result.accessToken,
    };
  } catch (error) {
    console.error(`Failed to verify access for resource ${resourceId}:`, error);
    throw new Error(`Payment verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Registers a new prompt as a Mainlayer resource for payment processing.
 * @param promptId Unique prompt identifier
 * @param price Price in cents (USD)
 * @param metadata Additional resource metadata for discovery
 * @returns Created resource details
 */
export async function createPromptResource(
  promptId: string,
  price: number,
  metadata?: ResourceMetadata
) {
  if (price < 0) {
    throw new Error('Price must be non-negative');
  }
  if (!promptId || promptId.trim().length === 0) {
    throw new Error('Prompt ID is required');
  }

  try {
    return await ml.resources.create({
      id: promptId,
      price,
      name: `Prompt: ${promptId}`,
      metadata: metadata ? {
        vendorId: metadata.vendorId,
        vendorName: metadata.vendorName,
        category: metadata.category,
        tags: metadata.tags,
      } : undefined,
    });
  } catch (error) {
    console.error(`Failed to create resource for prompt ${promptId}:`, error);
    throw new Error(`Resource creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Initiates payment checkout flow for a prompt.
 * @param promptId The prompt resource ID
 * @param returnUrl URL to return to after checkout
 * @returns Checkout session details with payment URL
 */
export async function initiateCheckout(promptId: string, returnUrl: string) {
  if (!promptId || !returnUrl) {
    throw new Error('Prompt ID and return URL are required');
  }

  try {
    const session = await ml.checkout.create({
      resourceId: promptId,
      returnUrl,
      metadata: { type: 'prompt_purchase' },
    });
    return session;
  } catch (error) {
    console.error(`Checkout creation failed for prompt ${promptId}:`, error);
    throw new Error(`Checkout initiation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Retrieves vendor account balance and revenue summary.
 * @param vendorId The vendor's Mainlayer account ID
 * @returns Vendor balance and statistics
 */
export async function getVendorBalance(vendorId: string) {
  if (!vendorId) {
    throw new Error('Vendor ID is required');
  }

  try {
    return await ml.vendors.getBalance(vendorId);
  } catch (error) {
    console.error(`Failed to retrieve balance for vendor ${vendorId}:`, error);
    throw new Error(`Balance retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Lists all transactions (purchases) for a specific resource.
 * @param promptId The prompt resource ID
 * @param limit Maximum results to return
 * @returns Transaction history
 */
export async function getResourceTransactions(promptId: string, limit = 50) {
  if (!promptId) {
    throw new Error('Prompt ID is required');
  }
  if (limit < 1 || limit > 1000) {
    throw new Error('Limit must be between 1 and 1000');
  }

  try {
    return await ml.resources.getTransactions(promptId, { limit });
  } catch (error) {
    console.error(`Failed to retrieve transactions for resource ${promptId}:`, error);
    throw new Error(`Transaction retrieval failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default ml;
