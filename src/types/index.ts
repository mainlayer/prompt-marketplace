export interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number; // in cents
  vendorId: string;
  vendorName: string;
  tags: string[];
  previewText: string;
  rating: number;
  salesCount: number;
  createdAt: string;
}

export interface Vendor {
  id: string;
  name: string;
  walletAddress: string;
  totalRevenue: number;
  promptCount: number;
  joinedAt: string;
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
}

export interface VendorDashboardData {
  vendor: Vendor;
  prompts: Prompt[];
  recentSales: Sale[];
}

export interface Sale {
  id: string;
  promptId: string;
  promptTitle: string;
  amount: number;
  buyerId: string;
  createdAt: string;
}
