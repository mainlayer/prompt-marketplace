import Link from 'next/link';
import { Prompt } from '@/types';

async function getPrompts(): Promise<Prompt[]> {
  // In production, fetch from your database
  return [
    {
      id: 'prompt-001',
      title: 'Expert Code Reviewer',
      description: 'A comprehensive prompt for in-depth code review covering security, performance, and readability.',
      category: 'Development',
      price: 999,
      vendorId: 'vendor-001',
      vendorName: 'CodeCraft AI',
      tags: ['code-review', 'security', 'typescript'],
      previewText: 'You are an expert software engineer. Review the following code for...',
      rating: 4.8,
      salesCount: 342,
      createdAt: '2024-01-15T00:00:00Z',
    },
    {
      id: 'prompt-002',
      title: 'Marketing Copy Generator',
      description: 'Generate compelling marketing copy for SaaS products, landing pages, and email campaigns.',
      category: 'Marketing',
      price: 1499,
      vendorId: 'vendor-002',
      vendorName: 'CopyAI Studio',
      tags: ['marketing', 'copywriting', 'saas'],
      previewText: 'You are a world-class copywriter specializing in SaaS products...',
      rating: 4.6,
      salesCount: 218,
      createdAt: '2024-02-01T00:00:00Z',
    },
    {
      id: 'prompt-003',
      title: 'Data Analysis Assistant',
      description: 'Transform raw data descriptions into actionable insights and visualizations recommendations.',
      category: 'Analytics',
      price: 799,
      vendorId: 'vendor-003',
      vendorName: 'DataLab',
      tags: ['data', 'analytics', 'insights'],
      previewText: 'You are a senior data analyst with expertise in statistical analysis...',
      rating: 4.7,
      salesCount: 156,
      createdAt: '2024-02-10T00:00:00Z',
    },
  ];
}

export default async function HomePage() {
  const prompts = await getPrompts();

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Prompt Marketplace</h1>
          <nav className="flex gap-4">
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">
              Vendor Dashboard
            </Link>
          </nav>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Browse AI Prompts</h2>
          <p className="text-gray-600">Discover and purchase premium prompt templates from expert creators.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {prompts.map((prompt) => (
            <Link key={prompt.id} href={`/prompts/${prompt.id}`}>
              <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    {prompt.category}
                  </span>
                  <span className="text-lg font-bold text-gray-900">
                    ${(prompt.price / 100).toFixed(2)}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{prompt.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{prompt.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>by {prompt.vendorName}</span>
                  <div className="flex items-center gap-2">
                    <span>★ {prompt.rating}</span>
                    <span>·</span>
                    <span>{prompt.salesCount} sales</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {prompt.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
