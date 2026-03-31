import { NextRequest, NextResponse } from 'next/server';
import { verifyPurchaseAccess, initiateCheckout } from '@/lib/mainlayer';
import { PurchaseResult } from '@/types';

/**
 * POST /api/purchase
 * Verify payment and return purchased prompt content.
 *
 * Body:
 *   - promptId (string): Resource ID of the prompt
 *   - buyerToken (string): Payment token from Mainlayer checkout
 *
 * Response (200): { success: true, accessToken, promptContent }
 * Response (402): Payment required - return checkout URL
 * Response (400): Missing/invalid parameters
 * Response (500): Server error
 */
export async function POST(request: NextRequest): Promise<NextResponse<PurchaseResult>> {
  try {
    const body = await request.json();
    const { promptId, buyerToken } = body as { promptId?: string; buyerToken?: string };

    // Validate input
    if (!promptId || typeof promptId !== 'string' || promptId.trim().length === 0) {
      return NextResponse.json<PurchaseResult>(
        { success: false, error: 'Valid promptId is required' },
        { status: 400 }
      );
    }

    if (!buyerToken || typeof buyerToken !== 'string' || buyerToken.trim().length === 0) {
      return NextResponse.json<PurchaseResult>(
        { success: false, error: 'Valid buyerToken is required' },
        { status: 400 }
      );
    }

    // Verify payment
    const result = await verifyPurchaseAccess(promptId, buyerToken);

    if (!result.granted) {
      // Payment not verified - return checkout URL
      try {
        const checkout = await initiateCheckout(
          promptId,
          `${request.headers.get('origin')}/prompts/${promptId}?checkout=true`
        );
        return NextResponse.json<PurchaseResult>(
          {
            success: false,
            error: 'Payment verification failed. Please complete checkout.',
            paymentRequired: true,
            checkoutUrl: checkout.checkoutUrl,
          },
          { status: 402 }
        );
      } catch (checkoutError) {
        console.error('Checkout creation failed:', checkoutError);
        return NextResponse.json<PurchaseResult>(
          { success: false, error: 'Payment verification and checkout initiation failed' },
          { status: 402 }
        );
      }
    }

    // Payment verified - fetch and return full prompt content
    const promptContent = await getPromptContent(promptId);

    return NextResponse.json<PurchaseResult>({
      success: true,
      accessToken: result.accessToken,
      promptContent,
    });
  } catch (error) {
    console.error('Purchase endpoint error:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return NextResponse.json<PurchaseResult>(
      { success: false, error: `Purchase processing failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

/**
 * Retrieves the full content of a purchased prompt.
 * In production, this would fetch from a secure database.
 */
async function getPromptContent(promptId: string): Promise<string> {
  const contents: Record<string, string> = {
    'prompt-001': `You are an expert software engineer with 15+ years of experience in code review and architecture.

OBJECTIVE:
Conduct comprehensive code reviews that catch security issues, performance problems, and maintainability concerns.

ANALYSIS FRAMEWORK:
1. **Security Analysis**
   - Input validation and injection vulnerabilities (SQL, XSS, Command)
   - Authentication/Authorization flaws
   - Cryptographic weaknesses
   - CSRF, CORS, and trust boundary issues

2. **Performance Review**
   - Algorithmic complexity analysis (Big O notation)
   - Database query optimization
   - Memory leaks and resource management
   - Caching opportunities

3. **Code Quality**
   - Readability and naming conventions
   - SOLID principles adherence
   - DRY violations and duplication
   - Error handling and logging

4. **Architecture**
   - Design pattern usage
   - Separation of concerns
   - Scalability considerations
   - Test coverage assessment

OUTPUT FORMAT:
Provide a structured JSON review with:
- Executive summary (1-2 sentences)
- Critical issues (if any)
- High-priority improvements
- Nice-to-have suggestions
- Overall rating (1-5 stars)
- Estimated remediation effort

Always be constructive and provide concrete, actionable solutions.`,

    'prompt-002': `You are a world-class copywriter specializing in SaaS marketing with a proven track record of increasing conversion rates by 30%+ for B2B and B2C products.

YOUR COPYWRITING FRAMEWORK:
1. **Hook** (Grab attention in 5 words)
   - Lead with the biggest benefit or surprising insight
   - Address the target audience directly

2. **Problem Statement** (Acknowledge their pain)
   - Validate their frustration
   - Show you understand their specific challenges
   - Use specificity over generalization

3. **Solution Introduction** (Present your offer)
   - How your product/service solves the problem
   - What makes it different (unique angle)
   - Why timing matters

4. **Benefits & Social Proof** (Build credibility)
   - Quantifiable results: "Used by 5,000+ teams"
   - Testimonials with specific metrics
   - Industry recognition or awards
   - Case studies showing ROI

5. **Call-to-Action** (Clear next step)
   - Single, compelling CTA
   - Create urgency without being pushy
   - Lower friction to action
   - Multiple variants for A/B testing

TONE GUIDE:
- Professional yet approachable
- Confident without being arrogant
- Benefit-focused, not feature-dumping
- Conversational language
- Industry-specific terminology where appropriate

OPTIMIZATION TIPS:
- Lead with benefit (not feature)
- Use power words: "Effortlessly", "Instantly", "Guaranteed"
- Numbers and specificity outperform vague claims
- Short paragraphs and sentences (mobile-first)
- White space and visual hierarchy matter`,
  };

  return contents[promptId] ?? 'Prompt content not available. Please contact support.';
}
