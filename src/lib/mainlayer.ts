import { MainlayerClient } from '@mainlayer/sdk';

const ml = new MainlayerClient({ apiKey: process.env.MAINLAYER_API_KEY! });

export async function verifyPurchaseAccess(
  resourceId: string,
  buyerToken: string
): Promise<{ granted: boolean; accessToken?: string }> {
  const result = await ml.resources.verifyAccess(resourceId, buyerToken);
  return {
    granted: result.granted,
    accessToken: result.accessToken,
  };
}

export async function createPromptResource(promptId: string, price: number) {
  return await ml.resources.create({
    id: promptId,
    price,
    name: `Prompt: ${promptId}`,
  });
}

export async function getVendorBalance(vendorId: string) {
  return await ml.vendors.getBalance(vendorId);
}

export default ml;
