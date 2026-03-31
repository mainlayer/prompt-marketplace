import { notFound } from 'next/navigation';
import { Prompt } from '@/types';

interface Props {
  params: { id: string };
}

async function getPrompt(id: string): Promise<Prompt | null> {
  const prompts: Record<string, Prompt> = {
    'prompt-001': {
      id: 'prompt-001',
      title: 'Expert Code Reviewer',
      description: 'A comprehensive prompt for in-depth code review covering security, performance, and readability. Used by 300+ engineering teams.',
      category: 'Development',
      price: 999,
      vendorId: 'vendor-001',
      vendorName: 'CodeCraft AI',
      tags: ['code-review', 'security', 'typescript'],
      previewText: 'You are an expert software engineer with 15+ years of experience...',
      rating: 4.8,
      salesCount: 342,
      createdAt: '2024-01-15T00:00:00Z',
    },
    'prompt-002': {
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
  };
  return prompts[id] ?? null;
}

export default async function PromptDetailPage({ params }: Props) {
  const prompt = await getPrompt(params.id);
  if (!prompt) notFound();

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mb-3">
                  {prompt.category}
                </span>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{prompt.title}</h1>
                <p className="text-gray-600">by {prompt.vendorName}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  ${(prompt.price / 100).toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">one-time purchase</div>
              </div>
            </div>

            <p className="text-gray-700 mb-6">{prompt.description}</p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
              <p className="text-sm text-gray-600 font-mono">{prompt.previewText}</p>
              <p className="text-xs text-gray-400 mt-2">Full prompt unlocked after purchase</p>
            </div>

            <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
              <span>★ {prompt.rating} rating</span>
              <span>·</span>
              <span>{prompt.salesCount} purchases</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {prompt.tags.map((tag) => (
                <span key={tag} className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>

            <form action="/api/purchase" method="POST">
              <input type="hidden" name="promptId" value={prompt.id} />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
              >
                Purchase for ${(prompt.price / 100).toFixed(2)}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
