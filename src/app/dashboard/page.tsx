import { VendorDashboardData } from '@/types';

async function getVendorData(): Promise<VendorDashboardData> {
  return {
    vendor: {
      id: 'vendor-001',
      name: 'CodeCraft AI',
      walletAddress: '0xabc...def',
      totalRevenue: 34158,
      promptCount: 8,
      joinedAt: '2024-01-01T00:00:00Z',
    },
    prompts: [
      {
        id: 'prompt-001',
        title: 'Expert Code Reviewer',
        description: 'Comprehensive code review prompt.',
        category: 'Development',
        price: 999,
        vendorId: 'vendor-001',
        vendorName: 'CodeCraft AI',
        tags: ['code-review'],
        previewText: 'You are an expert...',
        rating: 4.8,
        salesCount: 342,
        createdAt: '2024-01-15T00:00:00Z',
      },
    ],
    recentSales: [
      {
        id: 'sale-001',
        promptId: 'prompt-001',
        promptTitle: 'Expert Code Reviewer',
        amount: 999,
        buyerId: 'buyer-xyz',
        createdAt: '2024-03-15T10:23:00Z',
      },
      {
        id: 'sale-002',
        promptId: 'prompt-001',
        promptTitle: 'Expert Code Reviewer',
        amount: 999,
        buyerId: 'buyer-abc',
        createdAt: '2024-03-15T09:15:00Z',
      },
    ],
  };
}

export default async function DashboardPage() {
  const data = await getVendorData();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">Vendor Dashboard</h1>
          <p className="text-gray-600 text-sm">{data.vendor.name}</p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-gray-900">
              ${(data.vendor.totalRevenue / 100).toFixed(2)}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Prompts Listed</div>
            <div className="text-3xl font-bold text-gray-900">{data.vendor.promptCount}</div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-sm text-gray-500 mb-1">Total Sales</div>
            <div className="text-3xl font-bold text-gray-900">
              {data.prompts.reduce((sum, p) => sum + p.salesCount, 0)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Prompts</h2>
            <div className="space-y-3">
              {data.prompts.map((prompt) => (
                <div key={prompt.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{prompt.title}</h3>
                      <p className="text-sm text-gray-500">{prompt.salesCount} sales · ★ {prompt.rating}</p>
                    </div>
                    <span className="font-semibold text-gray-900">
                      ${(prompt.price / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Sales</h2>
            <div className="space-y-3">
              {data.recentSales.map((sale) => (
                <div key={sale.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">{sale.promptTitle}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(sale.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-semibold text-green-600">
                      +${(sale.amount / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
