import { jest } from '@jest/globals';

// Mock @mainlayer/sdk before importing anything that uses it
jest.mock('@mainlayer/sdk', () => {
  return {
    MainlayerClient: jest.fn().mockImplementation(() => ({
      resources: {
        verifyAccess: jest.fn(),
        create: jest.fn(),
        list: jest.fn(),
      },
      vendors: {
        getBalance: jest.fn(),
      },
      checkout: {
        create: jest.fn(),
      },
    })),
  };
});

import { MainlayerClient } from '@mainlayer/sdk';

describe('Prompt Purchase Flow', () => {
  let mlClient: ReturnType<typeof MainlayerClient.prototype.constructor>;

  beforeEach(() => {
    jest.clearAllMocks();
    mlClient = new (MainlayerClient as jest.MockedClass<typeof MainlayerClient>)({
      apiKey: 'test-key',
    });
  });

  describe('verifyAccess', () => {
    it('grants access when payment is verified', async () => {
      (mlClient.resources.verifyAccess as jest.Mock).mockResolvedValue({
        granted: true,
        accessToken: 'access-token-abc123',
      });

      const result = await mlClient.resources.verifyAccess('prompt-001', 'buyer-token-xyz');

      expect(result.granted).toBe(true);
      expect(result.accessToken).toBe('access-token-abc123');
      expect(mlClient.resources.verifyAccess).toHaveBeenCalledWith('prompt-001', 'buyer-token-xyz');
    });

    it('denies access when payment is not verified', async () => {
      (mlClient.resources.verifyAccess as jest.Mock).mockResolvedValue({
        granted: false,
        accessToken: undefined,
      });

      const result = await mlClient.resources.verifyAccess('prompt-001', 'invalid-token');

      expect(result.granted).toBe(false);
      expect(result.accessToken).toBeUndefined();
    });

    it('throws on network error', async () => {
      (mlClient.resources.verifyAccess as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      await expect(
        mlClient.resources.verifyAccess('prompt-001', 'buyer-token')
      ).rejects.toThrow('Network error');
    });
  });

  describe('resources.create', () => {
    it('creates a prompt resource with correct price', async () => {
      const mockResource = {
        id: 'prompt-001',
        name: 'Expert Code Reviewer',
        price: 999,
        createdAt: new Date().toISOString(),
      };

      (mlClient.resources.create as jest.Mock).mockResolvedValue(mockResource);

      const resource = await mlClient.resources.create({
        id: 'prompt-001',
        name: 'Expert Code Reviewer',
        price: 999,
      });

      expect(resource.id).toBe('prompt-001');
      expect(resource.price).toBe(999);
    });
  });

  describe('vendors.getBalance', () => {
    it('returns vendor balance', async () => {
      (mlClient.vendors.getBalance as jest.Mock).mockResolvedValue({
        available: 5000,
        pending: 1000,
        totalEarned: 6000,
      });

      const balance = await mlClient.vendors.getBalance('vendor-001');

      expect(balance.available).toBe(5000);
      expect(balance.pending).toBe(1000);
    });
  });

  describe('Purchase API route logic', () => {
    it('returns 402 when access is denied', async () => {
      (mlClient.resources.verifyAccess as jest.Mock).mockResolvedValue({
        granted: false,
      });

      const result = await mlClient.resources.verifyAccess('prompt-001', 'bad-token');

      // Simulate API route behavior
      const statusCode = result.granted ? 200 : 402;
      expect(statusCode).toBe(402);
    });

    it('returns 200 with content when access is granted', async () => {
      (mlClient.resources.verifyAccess as jest.Mock).mockResolvedValue({
        granted: true,
        accessToken: 'valid-token',
      });

      const result = await mlClient.resources.verifyAccess('prompt-001', 'buyer-token');

      const statusCode = result.granted ? 200 : 402;
      expect(statusCode).toBe(200);
      expect(result.accessToken).toBe('valid-token');
    });
  });
});
