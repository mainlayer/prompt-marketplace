import { NextRequest, NextResponse } from 'next/server';
import { verifyPurchaseAccess } from '@/lib/mainlayer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { promptId, buyerToken } = body;

    if (!promptId || !buyerToken) {
      return NextResponse.json(
        { error: 'promptId and buyerToken are required' },
        { status: 400 }
      );
    }

    const result = await verifyPurchaseAccess(promptId, buyerToken);

    if (!result.granted) {
      return NextResponse.json(
        { error: 'Payment verification failed. Please complete checkout.' },
        { status: 402 }
      );
    }

    // Fetch full prompt content after payment is verified
    const promptContent = await getPromptContent(promptId);

    return NextResponse.json({
      success: true,
      accessToken: result.accessToken,
      promptContent,
    });
  } catch (error) {
    console.error('Purchase error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getPromptContent(promptId: string): Promise<string> {
  const contents: Record<string, string> = {
    'prompt-001': `You are an expert software engineer with 15+ years of experience in code review.
When reviewing code, systematically analyze:
1. Security vulnerabilities (injection, XSS, CSRF, auth flaws)
2. Performance bottlenecks and complexity
3. Code readability and maintainability
4. Test coverage gaps
5. Architecture and design pattern adherence

For each issue found, provide: severity (critical/high/medium/low), location, explanation, and a concrete fix.
Format your review as structured JSON with an executive summary.`,
    'prompt-002': `You are a world-class copywriter specializing in SaaS products with proven conversion rates.
Create compelling copy that: addresses pain points directly, uses social proof, has a clear value proposition,
includes a strong CTA, and maintains brand voice. Structure: Hook → Problem → Solution → Benefits → Proof → CTA.`,
  };
  return contents[promptId] ?? 'Prompt content not found.';
}
