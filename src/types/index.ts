/**
 * Prompt marketplace - Domain models for buyers and sellers.
 */

export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number; // in cents (USD)
  vendorId: string;
  vendorName: string;
  tags: string[];
  previewText: string;
  rating: number;
  salesCount: number;
  createdAt: string;
  updatedAt?: string;
  featured?: boolean;
  downloads?: number;
}

export interface Vendor {
  id: string;
  name: string;
  email?: string;
  description?: string;
  totalRevenue: number; // in cents
  promptCount: number;
  totalSales: number;
  averageRating: number;
  joinedAt: string;
  verified: boolean;
}

export interface PurchaseRequest {
  promptId: string;
  buyerToken: string;
}

export interface PurchaseResult {
  success: boolean;
  accessToken?: string;
  promptContent?: string;
  error?: string;
  paymentRequired?: boolean;
  checkoutUrl?: string;
}

export interface CheckoutSession {
  id: string;
  resourceId: string;
  checkoutUrl: string;
  expiresAt: string;
  status: 'pending' | 'completed' | 'expired';
}

export interface VendorDashboardData {
  vendor: Vendor;
  prompts: Prompt[];
  recentSales: Sale[];
  earnings: EarningsSummary;
}

export interface EarningsSummary {
  totalEarnings: number; // in cents
  thisMonth: number; // in cents
  thisWeek: number; // in cents
  pendingBalance: number; // in cents
}

export interface Sale {
  id: string;
  promptId: string;
  promptTitle: string;
  amount: number; // in cents
  buyerId: string;
  createdAt: string;
  status: 'completed' | 'refunded' | 'pending';
}

export interface PromptListingInput {
  title: string;
  description: string;
  category: string;
  price: number; // in cents
  tags: string[];
  previewText: string;
  fullContent: string;
}

export interface DiscoveryFilters {
  category?: string;
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'popular' | 'newest' | 'trending' | 'highest-rated';
  page?: number;
  limit?: number;
}
