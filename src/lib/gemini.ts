import { Product, Customer, Order, Expense, Business, AIInsightItem } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

export interface GeminiContext {
  business: Business | null;
  products: Product[];
  customers: Customer[];
  orders: Order[];
  expenses: Expense[];
  financials: {
    revenue: number;
    costOfGoods: number;
    expenses: number;
    profit: number;
    margin: number;
  };
}

/**
 * Calls Gemini API or falls back to grounded context-aware intelligence
 */
export async function callGemini(prompt: string, systemInstruction: string, context?: GeminiContext): Promise<string> {
  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'placeholder_gemini_key') {
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nUser Question/Prompt: ${prompt}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000,
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.warn('Gemini API call failed, using intelligent business engine:', e);
    }
  }

  // Grounded fallback intelligence engine using real context
  return generateGroundedResponse(prompt, context);
}

/**
 * Intelligent context-aware AI Coach responder that analyzes real numbers
 */
function generateGroundedResponse(prompt: string, context?: GeminiContext): string {
  const query = prompt.toLowerCase();
  const bName = context?.business?.name || 'Your Business';
  const category = context?.business?.category || 'products';
  const currency = context?.business?.currency_symbol || '$';
  const products = context?.products || [];
  const customers = context?.customers || [];
  const orders = context?.orders || [];
  const fin = context?.financials || { revenue: 0, costOfGoods: 0, expenses: 0, profit: 0, margin: 0 };

  // 1. Business Health / Overview
  if (query.includes('how is my business') || query.includes('doing') || query.includes('overview') || query.includes('health') || query.includes('performance')) {
    if (orders.length === 0) {
      return `Welcome to SheLaunch! ✨ **${bName}** is currently at the setup stage.

**Current Status:**
- You have **${products.length} product(s)** cataloged.
- **0 sales recorded** yet.

**Your Next 3 Steps:**
1. Record your first sale as soon as a customer orders.
2. Share your top product (${products[0]?.name || 'your items'}) on social media or with 5 close friends.
3. Keep track of your packaging & material expenses to protect your profit margins!`;
    }

    const topProduct = [...products].sort((a, b) => b.units_sold - a.units_sold)[0];
    const lowStock = products.filter(p => p.stock_quantity <= p.low_stock_threshold);

    return `Here is the executive health report for **${bName}**: 🌸

- **Total Revenue**: ${currency}${fin.revenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} across ${orders.length} order(s)
- **Net Profit**: ${currency}${fin.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })} (**${fin.margin.toFixed(1)}% profit margin**)
- **Customer Base**: ${customers.length} client(s) registered
- **Best Seller**: ${topProduct ? `*${topProduct.name}* (${topProduct.units_sold} units sold)` : 'N/A'}

${lowStock.length > 0 ? `⚠️ **Inventory Note**: You have ${lowStock.length} product(s) running low on stock (${lowStock.map(p => p.name).slice(0, 2).join(', ')}). Consider restocking soon to avoid lost sales.` : '✅ All catalog items are adequately stocked.'}

**Next Step**: Focus on repeat client engagement. Your customer retention directly multiplies your net profit without additional ad spend!`;
  }

  // 2. What should I focus on / Next action
  if (query.includes('focus') || query.includes('today') || query.includes('what should i do') || query.includes('next action')) {
    const lowStock = products.filter(p => p.stock_quantity <= p.low_stock_threshold);
    if (lowStock.length > 0) {
      return `Here is your high-impact focus plan for today at **${bName}**: 🎯

1. ⚠️ **Immediate Restock**: *${lowStock[0].name}* has only **${lowStock[0].stock_quantity} left in stock** (threshold is ${lowStock[0].low_stock_threshold}). Restocking this ensures you don't lose sales momentum.
2. 💌 **Customer Reachout**: Reach out to your top buyers with a personalized thank you note or VIP preview.
3. 📸 **Marketing**: Generate a fresh Instagram caption in the **Marketing Studio** highlighting your highest margin product!`;
    }

    const bestProduct = [...products].sort((a, b) => b.units_sold - a.units_sold)[0];
    return `Today's strategic focus for **${bName}**: 🚀

1. 🌟 **Promote your champion**: *${bestProduct?.name || 'your signature product'}* is your leading earner. Post a behind-the-scenes video of how it's made or packaged.
2. 💡 **Review Margins**: Your current overall profit margin is **${fin.margin.toFixed(1)}%**. Test bundling complementary items in the Pricing Helper to increase average order value.
3. 🤝 **Community Building**: Ask 2 recent customers for a photo review to build social proof.`;
  }

  // 3. Which product should I promote
  if (query.includes('promote') || query.includes('which product') || query.includes('best product')) {
    if (products.length === 0) {
      return `You don't have any products in your catalog yet. Head over to the **Products** section to add your first product with its selling price and cost price!`;
    }
    const sortedByProfit = [...products].sort((a, b) => (b.selling_price - b.cost_price) - (a.selling_price - a.cost_price));
    const highestMargin = sortedByProfit[0];
    const topSeller = [...products].sort((a, b) => b.units_sold - a.units_sold)[0];

    return `Based on your real product telemetry for **${bName}**:

1. 💎 **Highest Profit Generator**: Promote **${highestMargin.name}**!
   - Selling Price: ${currency}${highestMargin.selling_price.toFixed(2)}
   - Cost: ${currency}${highestMargin.cost_price.toFixed(2)}
   - **Profit per Sale**: ${currency}${(highestMargin.selling_price - highestMargin.cost_price).toFixed(2)} (${(((highestMargin.selling_price - highestMargin.cost_price) / (highestMargin.selling_price || 1)) * 100).toFixed(0)}% margin)

2. 🔥 **Customer Favorite**: **${topSeller.name}** has sold **${topSeller.units_sold} units**. Pair it with ${highestMargin.name} as a limited-edition set in the **Marketing Studio**!`;
  }

  // 4. Restock advice
  if (query.includes('restock') || query.includes('stock') || query.includes('inventory')) {
    const lowStock = products.filter(p => p.stock_quantity <= p.low_stock_threshold);
    if (lowStock.length === 0) {
      return `Great news! 🎉 All **${products.length} products** in your catalog currently have healthy stock levels above their low-stock thresholds. Keep an eye on sales velocity in the **Inventory** tab.`;
    }
    return `⚠️ **Restock Alert for ${bName}**:

The following ${lowStock.length} item(s) are critically low:
${lowStock.map(p => `• **${p.name}**: Only ${p.stock_quantity} left in stock (Warning threshold: ${p.low_stock_threshold} units)`).join('\n')}

**Actionable Advice**: Re-order or manufacture new inventory for these items immediately, as stockouts directly hurt customer acquisition momentum.`;
  }

  // 5. Profit & Revenue explanation
  if (query.includes('profit') || query.includes('revenue') || query.includes('margin') || query.includes('why')) {
    return `Let's break down your financial health for **${bName}**: 📊

- **Total Revenue**: ${currency}${fin.revenue.toFixed(2)} (gross intake from sales)
- **Cost of Goods Sold (COGS)**: ${currency}${fin.costOfGoods.toFixed(2)} (direct product costs)
- **Operating Expenses**: ${currency}${fin.expenses.toFixed(2)} (tools, packaging, marketing)
- **Net Take-Home Profit**: ${currency}${fin.profit.toFixed(2)}
- **Net Margin**: **${fin.margin.toFixed(1)}%**

${fin.margin >= 50 ? '🌟 **Excellent**: A margin above 50% gives you fantastic breathing room to invest in paid growth and luxury packaging.' : '💡 **Opportunity**: Try lowering packaging or material costs slightly, or raise your retail price by 10-15% to lift margins above 50%.'}`;
  }

  // 6. First customer guide
  if (query.includes('first customer') || query.includes('get customers') || query.includes('sales')) {
    return `Getting your first 5-10 customers is all about high-touch intimacy: 🤝

1. **Direct Outreach**: Personally message 10 friends, family, or past colleagues who match your target audience: *"${context?.business?.target_audience || 'women who love artisanal goods'}"*.
2. **Founder Storytelling**: Share *why* you created ${bName}. People buy from people, especially passionate women founders!
3. **Launch Incentive**: Offer a small gift or complimentary luxury packaging for the first 10 buyers.
4. **Use Marketing Studio**: Head to **Marketing** and generate a "Launch Announcement" to post across your personal networks.`;
  }

  // Default helpful coach reply
  return `I am here as your dedicated business co-pilot for **${bName}**! ✨

Here are some specific questions you can ask me:
- *"How is my business doing this month?"*
- *"Which product should I promote for highest profit?"*
- *"What should I restock right now?"*
- *"Explain my profit margin and how to improve it."*
- *"How can I get more repeat buyers?"*

What would you like to explore together?`;
}

/**
 * Marketing Studio generator
 */
export async function generateMarketingContent(
  type: string,
  productName: string,
  targetAudience: string,
  tone: string,
  keyFeatures: string,
  context?: GeminiContext
): Promise<string> {
  const bName = context?.business?.name || 'SheLaunch Boutique';
  const category = context?.business?.category || 'Luxury Goods';

  const prompt = `Generate a ${type} for business "${bName}" (${category}).
Product/Topic: ${productName || 'Signature Collection'}
Target Audience: ${targetAudience || 'Modern women and luxury lovers'}
Tone: ${tone || 'Warm, elegant, confident, premium'}
Key Features & Details: ${keyFeatures || 'Handcrafted with care, sustainable quality, timeless aesthetic'}`;

  const systemInstruction = `You are a world-class luxury brand copywriter and marketing director specializing in women-owned businesses. Write captivating, high-converting, elegant copy tailored to the request. Include formatted linebreaks and relevant emojis where fitting.`;

  if (GEMINI_API_KEY && GEMINI_API_KEY !== 'placeholder_gemini_key') {
    return callGemini(prompt, systemInstruction, context);
  }

  // High quality templates
  if (type === 'instagram_caption') {
    return `Slow-crafted perfection for the discerning woman. ✨

Introducing **${productName || 'our signature piece'}** from ${bName}. 

Designed specifically for ${targetAudience || 'women who love understated elegance'}, every detail is crafted with intention. ${keyFeatures || 'Combining ethical luxury with heirloom quality.'}

🌸 Why you'll fall in love:
• Timeless silhouette that elevates every outfit
• Artisan crafted with uncompromising attention to detail
• Hand-packaged in our signature keepsake gift box

Limited quantities available in our current studio drop.

👉 Tap the link in bio to secure yours before they sell out.

#${bName.replace(/\s+/g, '')} #ArtisanCrafted #SlowLuxury #WomenInBusiness #HeirloomQuality #ModernElegance`;
  }

  if (type === 'whatsapp_copy') {
    return `Hello lovely! 🌸

We hope your week is off to a beautiful start. 

We have some exciting news from the ${bName} atelier: our highly anticipated **${productName || 'Collection'}** is officially live!

Because each piece is crafted in small, careful batches, we wanted to give our close community first priority before we announce publicly on Instagram.

${keyFeatures ? `✨ Key Highlights:\n${keyFeatures}\n` : ''}
Would you like us to reserve one for you with complimentary priority packaging? Just reply to this message and we'll take care of the rest! 🎁

With warm regards,
The ${bName} Team ✨`;
  }

  if (type === 'product_description') {
    return `**${productName || 'Artisan Heirloom Piece'}** — *Crafted for Everyday Grace*

**The Story:**
Elevate your everyday ritual with this exquisite creation from ${bName}. Designed for ${targetAudience || 'those who appreciate fine craftsmanship'}, this piece merges modern functionality with timeless romance.

**Details & Craftsmanship:**
• ${keyFeatures || 'Crafted from premium ethical materials designed for lifelong wear.'}
• Hypoallergenic, sustainably finished, and hand-inspected in our studio.
• Arrives enclosed in a velvet-lined debossed gift box with certificate of authenticity.

**Care Guide:**
Gently polish with a soft microfiber cloth. Store in your ${bName} velvet pouch when not in wear to maintain its radiant luster.`;
  }

  if (type === 'campaign_pitch') {
    return `**Campaign Concept: "The Art of Self-Gifting" by ${bName}** 🌟

**Campaign Objective:**
Position **${productName || 'our hero product'}** not just as an accessory, but as an intentional milestone marker and everyday luxury for women celebrating their own achievements.

**Target Demographic:**
${targetAudience || 'Ambitious professionals, self-starters, and modern tastemakers aged 24–48.'}

**Key Messaging Angles:**
1. *"You don't need a reason to treat yourself to something extraordinary."*
2. *"Crafted slowly to last a lifetime: ${keyFeatures || 'Ethical, sustainable, heirloom quality.'}"*

**Distribution Strategy:**
• **TikTok & Reels**: 7-second aesthetic ASMR unboxing videos showing the tactile velvet packaging and natural light reflection.
• **Email & WhatsApp VIP Broadcast**: 48-hour early access window with complimentary engraved monogramming.
• **Collaboration**: Partner with 3 micro-influencers whose aesthetic aligns with quiet luxury.`;
  }

  return `✨ **Announcing: The New Era of ${bName}** ✨\n\nWe are thrilled to unveil **${productName || 'our newest launch'}**!\n\n${keyFeatures || 'Created with passion, premium materials, and heartfelt design.'}\n\nExplore the full collection online today.`;
}

/**
 * Diagnostic AI Insights generator from real database state
 */
export function generateAIInsights(context: GeminiContext): AIInsightItem[] {
  const insights: AIInsightItem[] = [];
  const { products, customers, orders, financials } = context;

  // 1. Best Selling Product Insight
  if (products.length > 0) {
    const topProduct = [...products].sort((a, b) => b.units_sold - a.units_sold)[0];
    if (topProduct && topProduct.units_sold > 0) {
      insights.push({
        id: 'ins-top-product',
        type: 'success',
        title: `Best Seller: ${topProduct.name}`,
        description: `This product is leading your catalog with ${topProduct.units_sold} units sold. It represents your strongest product-market fit.`,
        metric: `${topProduct.units_sold} Units Sold`,
        action_label: 'View Product',
        action_route: '/products'
      });
    }
  }

  // 2. Low Stock Alerts
  const lowStock = products.filter(p => p.stock_quantity <= p.low_stock_threshold);
  if (lowStock.length > 0) {
    insights.push({
      id: 'ins-low-stock',
      type: 'warning',
      title: `${lowStock.length} Product(s) Low on Stock`,
      description: `${lowStock.map(p => p.name).slice(0, 2).join(', ')} ${lowStock.length > 2 ? `and ${lowStock.length - 2} more` : ''} are below minimum inventory threshold. Restock now to prevent stockouts.`,
      metric: `${lowStock[0].stock_quantity} remaining`,
      action_label: 'Restock Inventory',
      action_route: '/inventory'
    });
  }

  // 3. Profit Margin Insight
  if (financials.revenue > 0) {
    if (financials.margin >= 55) {
      insights.push({
        id: 'ins-margin-healthy',
        type: 'success',
        title: 'Outstanding Profit Margin',
        description: `Your net profit margin is sitting at ${financials.margin.toFixed(1)}%. You are pricing with healthy gross margins that support sustainable growth.`,
        metric: `${financials.margin.toFixed(1)}% Margin`,
        action_label: 'View P&L',
        action_route: '/finance'
      });
    } else {
      insights.push({
        id: 'ins-margin-optimize',
        type: 'opportunity',
        title: 'Margin Optimization Opportunity',
        description: `Your current net profit margin is ${financials.margin.toFixed(1)}%. Check your packaging and material expenses or use the Pricing Helper to calibrate pricing.`,
        metric: `${financials.margin.toFixed(1)}% Margin`,
        action_label: 'Open Pricing Helper',
        action_route: '/pricing-helper'
      });
    }
  }

  // 4. VIP Repeat Customer Insight
  const repeatCustomers = customers.filter(c => c.total_orders > 1);
  if (repeatCustomers.length > 0) {
    insights.push({
      id: 'ins-repeat-buyers',
      type: 'opportunity',
      title: `${repeatCustomers.length} Loyal Repeat Client(s)`,
      description: `Repeat buyers generate the highest lifetime profit. Send a VIP loyalty note to nurture repeat sales.`,
      metric: `${repeatCustomers.length} Repeat VIPs`,
      action_label: 'View Customers',
      action_route: '/customers'
    });
  }

  // 5. Beginner next action if early stage
  if (orders.length === 0) {
    insights.push({
      id: 'ins-first-sale',
      type: 'action',
      title: 'Ready for Your First Sale!',
      description: 'Your business catalog is ready. Share your launch announcement or record your first sale when an order arrives.',
      metric: 'Stage 1',
      action_label: 'Record a Sale',
      action_route: '/sales'
    });
  }

  return insights;
}
