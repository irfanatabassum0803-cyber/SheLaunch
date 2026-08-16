import React, { useState } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  Users, 
  Package, 
  Megaphone, 
  Heart, 
  Crown,
  Lightbulb,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LearningTopic } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';

const topics: LearningTopic[] = [
  {
    id: 'biz-basics',
    title: '1. Business Basics for Beginners',
    icon: '🌱',
    description: 'The core foundations: separating personal and business money, and staying organized.',
    duration: '4 min read',
    category: 'Beginner',
    content: {
      summary: 'Starting a business does not require complicated jargon. You simply need a product people love, a price that leaves you with profit, and a simple way to collect payment.',
      keyPoints: [
        'Open a dedicated bank account for your business income and expenses right away.',
        'Never sell at cost — every sale must contribute to your own living wage and brand growth.',
        'Keep records of every order and expense in SheLaunch so tax time is effortless.'
      ],
      actionStep: 'Define the one core problem your product solves for your ideal customer.',
      proTip: 'You don’t need an LLC or expensive legal filings on day one. Validate customer demand first!',
      example: 'Noor started making baroque pearl earrings at her kitchen table. She created an Instagram page and only bought materials as pre-orders came in.'
    }
  },
  {
    id: 'pricing',
    title: '2. Pricing Without Fear or Guilt',
    icon: '💎',
    description: 'How to calculate a selling price that covers materials, your time, and gives 50%+ profit margin.',
    duration: '5 min read',
    category: 'Pricing',
    content: {
      summary: 'Many women undercharge because they feel guilty asking for what their craftsmanship is truly worth. High prices signal luxury, quality, and respect for your labor.',
      keyPoints: [
        'Formula: (Raw Material Cost + Packaging + Labor) ÷ (1 - Desired Margin %).',
        'Aim for a minimum gross profit margin of 50% to 70% in artisanal and handmade goods.',
        'Customers don’t buy the cost of materials; they buy the emotion, transformation, and beauty.'
      ],
      actionStep: 'Open the SheLaunch Pricing Helper to calculate your true margin for your top item.',
      proTip: 'If nobody has ever complained that your prices are high, you are almost certainly underpricing.',
      example: 'If an earring pair costs $35 in pearls and silver, pricing at $135 allows you to offer free gift boxes, hire helpers, and make a sustainable $100 profit.'
    }
  },
  {
    id: 'profit',
    title: '3. Understanding Revenue vs. Profit',
    icon: '📊',
    description: 'Why revenue is vanity, profit is sanity, and cash flow is reality.',
    duration: '4 min read',
    category: 'Finance',
    content: {
      summary: 'Revenue is the total money that enters your register. Profit is what remains in your bank after paying for materials, packaging, software, and shipping.',
      keyPoints: [
        'Revenue - Cost of Goods Sold = Gross Profit.',
        'Gross Profit - Operating Expenses (marketing, software, booth fees) = Net Take-Home Profit.',
        'A business making $2,000 revenue with $1,500 profit is healthier than one making $10,000 revenue with $500 profit.'
      ],
      actionStep: 'Check your Finance tab to see your current net profit margin percentage.',
      proTip: 'Track small recurring subscriptions. $20/month software adds up quickly if unused.',
      example: 'Noor Jewels keeps a 70% profit margin by negotiating direct pearl farmer pricing.'
    }
  },
  {
    id: 'first-customers',
    title: '4. Finding Your First 10 Customers',
    icon: '🤝',
    description: 'How to get your first buyers through intimate, high-touch founder outreach.',
    duration: '5 min read',
    category: 'Marketing',
    content: {
      summary: 'Do not run expensive Facebook ads to find your first 10 buyers. Direct personal messages, warm community invitations, and genuine storytelling are 10x more effective.',
      keyPoints: [
        'Make a list of 20 friends, family, or past colleagues who fit your target audience.',
        'Send a personal voice memo or WhatsApp: "I just launched my collection and thought of your style!"',
        'Ask your first 5 buyers to take a picture wearing/using the product in return for a small gift.'
      ],
      actionStep: 'Send 3 personal messages today to friends sharing your founder launch story.',
      proTip: 'People love supporting a woman founder on a mission. Share your genuine excitement!',
      example: 'Elena bought from Noor after seeing a 15-second behind-the-scenes video showing how pearls are hand-selected.'
    }
  },
  {
    id: 'marketing-basics',
    title: '5. Marketing That Feels Warm, Not Salesy',
    icon: '🌸',
    description: 'How to create content that attracts your dream clients naturally.',
    duration: '4 min read',
    category: 'Marketing',
    content: {
      summary: 'Authentic marketing is just sharing your passion and process publicly. When you show the care behind what you make, customers feel emotionally connected to your brand.',
      keyPoints: [
        'Document, don’t just create: Film yourself packing orders, choosing supplies, or sketching ideas.',
        'Use the SheLaunch AI Marketing Studio to write captions that speak directly to one woman’s desires.',
        'Consistency beats perfection: Posting 3 thoughtful pieces of content weekly creates momentum.'
      ],
      actionStep: 'Generate an Instagram caption in the Marketing Studio for your newest piece.',
      proTip: 'Focus on how the customer feels wearing or displaying your item, not just technical specs.',
      example: 'Instead of saying "Pearl earrings in 18k gold", write "Timeless organic pearls designed to elevate your morning coffee ritual and evening candlelit dinners."'
    }
  },
  {
    id: 'inventory-ops',
    title: '6. Managing Inventory Without Stress',
    icon: '📦',
    description: 'How to prevent stockouts while avoiding tying up all your cash in unsold inventory.',
    duration: '4 min read',
    category: 'Operations',
    content: {
      summary: 'Inventory is tied-up cash. Managing low-stock warning thresholds ensures you re-order raw materials before you miss out on high-demand sales.',
      keyPoints: [
        'Set a Low Stock Warning Threshold of at least 5 units for popular products.',
        'Batch your production: Create 10-20 pieces in a single studio day rather than one-by-one.',
        'Record every sale through SheLaunch POS so stock numbers remain 100% accurate in real time.'
      ],
      actionStep: 'Review your Inventory tab and check if any items are near warning threshold.',
      proTip: 'Never let your hero best-seller stock out completely. It kills your sales momentum.',
      example: 'Noor sets a threshold of 6 for her Aura Earrings, giving her 7 days to order fresh pearls from Japan.'
    }
  },
  {
    id: 'selling-online',
    title: '7. Selling Online & Social Selling',
    icon: '🛍️',
    description: 'Converting Instagram DMs, pop-up visitors, and website traffic into completed orders.',
    duration: '5 min read',
    category: 'Marketing',
    content: {
      summary: 'Making it effortless for a customer to pay you is the #1 secret to higher conversion rates. Remove friction from the buying journey.',
      keyPoints: [
        'When someone asks "How much?" in your DMs, respond with the price, a link, and a warm compliment.',
        'Have a clean checkout ready via Card, Stripe, or instant invoice.',
        'Offer a 100% satisfaction guarantee to eliminate buyer hesitation.'
      ],
      actionStep: 'Add a direct link in bio or WhatsApp order number to your social profiles.',
      proTip: 'Answer DM purchase inquiries within 1 hour whenever possible. Buying excitement peaks quickly!',
      example: 'Noor closes 40% of Instagram DMs by offering priority velvet box packaging for same-day orders.'
    }
  },
  {
    id: 'branding',
    title: '8. Luxury Branding on a Budget',
    icon: '✨',
    description: 'Making your brand look editorial, premium, and trustworthy from day one.',
    duration: '4 min read',
    category: 'Beginner',
    content: {
      summary: 'High-end branding is created through consistency, generous whitespace, warm neutral colors, and thoughtful unboxing touches.',
      keyPoints: [
        'Stick to 2-3 signature brand colors (like rich burgundy, wine, and warm blush).',
        'Invest in simple custom stickers, ribbon, or tissue paper with a handwritten thank-you card.',
        'Natural diffused window lighting is the best tool for photographing handmade goods.'
      ],
      actionStep: 'Write a signature thank-you note template to include in every customer parcel.',
      proTip: 'The unboxing experience is your best free marketing. Customers love filming aesthetic unboxings for TikTok!',
      example: 'Noor wraps every order in wine tissue paper sealed with a gold wax stamp.'
    }
  },
  {
    id: 'retention',
    title: '9. Customer Retention & VIP Care',
    icon: '💌',
    description: 'Turning one-time buyers into lifelong brand champions who buy every new drop.',
    duration: '4 min read',
    category: 'Operations',
    content: {
      summary: 'It costs 5x more to find a brand new customer than to delight an existing one. Nurturing repeat buyers is the fastest path to sustainable six-figure revenue.',
      keyPoints: [
        'Tag repeat buyers as VIPs in your Customers CRM.',
        'Give past buyers a 24-hour private shopping window before public collection launches.',
        'Send an anniversary or holiday check-in message asking how their piece is holding up.'
      ],
      actionStep: 'Check your Customers tab and send a thank-you note to your highest-spending client.',
      proTip: 'A simple handwritten note inside the package creates a client for life.',
      example: 'Sophia Laurent has placed 4 separate orders with Noor Jewels because she receives early WhatsApp previews.'
    }
  }
];

export const LearnPage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', 'Beginner', 'Pricing', 'Marketing', 'Finance', 'Operations'];

  const filteredTopics = activeCategory === 'All' 
    ? topics 
    : topics.filter(t => t.category === activeCategory);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
            Beginner Learning Hub
          </h2>
          <Badge variant="wine" size="sm" icon={<BookOpen className="w-3 h-3" />}>
            9 Masterclasses
          </Badge>
        </div>
        <p className="text-xs text-blush-200/70">
          Practical, jargon-free business wisdom tailored specifically for women founders
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              activeCategory === cat
                ? 'bg-wine-700 text-white border border-blush-400/40 shadow-md'
                : 'bg-wine-950/40 text-blush-200/70 hover:bg-wine-900/60'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* Topics Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredTopics.map((topic) => (
          <motion.div key={topic.id} variants={cardVariants}>
            <Card
              variant="interactive"
              onClick={() => setSelectedTopic(topic)}
              className="p-6 flex flex-col justify-between space-y-4 group h-full hover:border-blush-400/50"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <motion.span 
                    whileHover={{ scale: 1.3, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className="text-2xl inline-block"
                  >
                    {topic.icon}
                  </motion.span>
                  <Badge variant="wine" size="sm">{topic.duration}</Badge>
                </div>

                <h3 className="font-serif font-bold text-base text-cream-50 group-hover:text-blush-200 transition-colors">
                  {topic.title}
                </h3>

                <p className="text-xs text-blush-200/70 leading-relaxed line-clamp-2">
                  {topic.description}
                </p>
              </div>

              <div className="pt-3 border-t border-wine-800/40 flex items-center justify-between text-xs text-blush-300 font-semibold group-hover:text-white transition-colors">
                <span>Read Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Full Lesson Modal */}
      <Modal
        isOpen={Boolean(selectedTopic)}
        onClose={() => setSelectedTopic(null)}
        title={selectedTopic?.title}
        subtitle={`${selectedTopic?.duration} • ${selectedTopic?.category} Foundation`}
        maxWidth="2xl"
      >
        {selectedTopic && (
          <div className="space-y-6 text-xs sm:text-sm text-blush-100 leading-relaxed">
            {/* Summary */}
            <div className="p-4 rounded-2xl bg-burgundy-950/70 border border-blush-400/20 text-cream-50 font-medium shadow-md">
              {selectedTopic.content.summary}
            </div>

            {/* Key Principles */}
            <div className="space-y-2.5">
              <h4 className="font-serif font-bold text-base text-cream-50">Key Principles:</h4>
              <ul className="space-y-2">
                {selectedTopic.content.keyPoints.map((pt, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Real World Example */}
            <div className="p-4 rounded-xl bg-wine-950/80 border border-wine-800/50 space-y-1">
              <span className="font-bold text-gold-300 flex items-center gap-1.5 text-xs">
                <Sparkles className="w-3.5 h-3.5" /> Real World Founder Story:
              </span>
              <p className="text-xs text-blush-200/80 italic">
                &ldquo;{selectedTopic.content.example}&rdquo;
              </p>
            </div>

            {/* Action Step & Pro Tip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                <span className="font-bold text-emerald-300">🎯 Action Step Today:</span>
                <p className="text-emerald-200/80">{selectedTopic.content.actionStep}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-wine-950/60 border border-blush-400/20 space-y-1">
                <span className="font-bold text-blush-300">💡 Founder Pro-Tip:</span>
                <p className="text-blush-200/80">{selectedTopic.content.proTip}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button
                size="md"
                variant="primary"
                onClick={() => setSelectedTopic(null)}
              >
                Mark as Completed & Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
