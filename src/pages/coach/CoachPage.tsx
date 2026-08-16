import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Lightbulb, 
  HelpCircle, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Crown,
  CornerDownLeft,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBusiness } from '../../context/BusinessContext';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { AIOrientedLoader } from '../../components/ui/AIOrientedLoader';

const quickPrompts = [
  'How is my business doing this month?',
  'What should I focus on today?',
  'Which product should I promote for highest profit?',
  'What should I restock right now?',
  'Explain my profit and margins',
  'How can I get my first 10 customers?',
];

export const CoachPage: React.FC = () => {
  const { currentBusiness, aiMessages, sendCoachMessage, products, orders, financials } = useBusiness();
  const { user, isDemoUser } = useAuth();

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || loading) return;

    setInputMessage('');
    setLoading(true);

    try {
      await sendCoachMessage(query);
    } catch (e) {
      console.error('Failed to send coach message:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-cream-50">
              SheLaunch AI Business Coach
            </h2>
            <Badge variant="gold" size="sm" icon={<Sparkles className="w-3 h-3 text-gold-400" />}>
              Grounded Gemini AI
            </Badge>
          </div>
          <p className="text-xs text-blush-200/70">
            Your 24/7 strategic advisor connected to your real products, sales volume, and financial margins
          </p>
        </div>

        {/* Live Context Indicator */}
        <div className="flex items-center gap-2 p-2 px-3 rounded-xl bg-wine-950/70 border border-wine-800/50 text-[11px] text-blush-200/80 shadow-md">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400" />
          <span>Connected to {currentBusiness?.name || 'Workspace'} ({products.length} products, {orders.length} orders)</span>
        </div>
      </div>

      {/* Main Chat Box Container */}
      <Card variant="highlight" className="p-0 overflow-hidden flex flex-col h-[650px] border-blush-400/25 shadow-2xl">
        {/* Chat Messages Log */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {aiMessages.map((msg) => {
              const isUser = msg.role === 'user';

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`flex gap-3.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <motion.div 
                      whileHover={{ rotate: 10, scale: 1.1 }}
                      className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-burgundy-700 via-wine-600 to-blush-500 flex items-center justify-center text-white shrink-0 shadow-md border border-blush-300/30 mt-1"
                    >
                      <Bot className="w-4 h-4" />
                    </motion.div>
                  )}

                  <div
                    className={`max-w-2xl rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? 'bg-gradient-to-r from-burgundy-800 to-wine-700 text-white font-medium shadow-md border border-blush-400/30'
                        : 'bg-[#18040B]/90 text-cream-100 border border-wine-800/50 shadow-xl'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {isUser && (
                    <div className="w-9 h-9 rounded-2xl bg-wine-800/80 flex items-center justify-center text-white font-bold text-xs shrink-0 border border-wine-700/50 mt-1">
                      {user?.full_name?.charAt(0) || 'F'}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Dedicated Bespoke AI Orbital Thinking Animation */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-4"
            >
              <AIOrientedLoader
                label="AI Coach is diagnosing your business records..."
                sublabel="Cross-referencing margin health, stock levels, and revenue trajectory"
              />
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips with Hover Bounce */}
        <div className="px-6 py-3 bg-[#140308]/90 border-t border-wine-900/40 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blush-300/50 shrink-0">
            Suggested:
          </span>
          {quickPrompts.map((prompt) => (
            <motion.button
              key={prompt}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleSend(prompt)}
              disabled={loading}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-wine-950/60 hover:bg-wine-900/80 border border-wine-800/50 text-blush-200 hover:text-white whitespace-nowrap transition-colors shadow-sm"
            >
              {prompt}
            </motion.button>
          ))}
        </div>

        {/* Input Textarea & Send */}
        <div className="p-4 bg-[#18040B] border-t border-wine-800/40">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              placeholder="Ask anything about your business metrics, pricing, restock, or growth..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={loading}
              className="flex-1 bg-[#120207] border border-burgundy-700/60 rounded-xl py-3 px-4 text-sm text-cream-50 placeholder:text-zinc-500 focus:outline-none focus:border-blush-400 focus:ring-2 focus:ring-blush-400/20 transition-all"
            />

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              disabled={!inputMessage.trim() || loading}
              icon={<Send className="w-4 h-4" />}
            >
              Ask Coach
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};
