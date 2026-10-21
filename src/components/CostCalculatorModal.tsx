import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CostCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CostCalculatorModal: React.FC<CostCalculatorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [projectCount, setProjectCount] = useState<number>(10);
  const [selectedModel, setSelectedModel] = useState<'haiku' | 'mini' | 'gemini'>('haiku');

  if (!isOpen) return null;

  const tokensPerProject = 55000;
  const totalTokens = projectCount * tokensPerProject;

  const costPerMillion = {
    haiku: 0.45,
    mini: 0.25,
    gemini: 0.12,
  }[selectedModel];

  const directApiMonthlyCost = Number(((totalTokens / 1_000_000) * costPerMillion).toFixed(2));
  const closedPlatformMonthlyCost = 20;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border bg-white dark:bg-[#121214] border-zinc-200/90 dark:border-white/[0.08] shadow-2xl overflow-hidden transition-all text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-zinc-900 dark:text-white tracking-tight">
              API Cost Estimator
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Direct token pricing compared to a fixed $20/month SaaS builder.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 -mr-1 -mt-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-4">
          
          {/* Slider */}
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-[#18181B] border border-zinc-200/70 dark:border-white/[0.06] space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-600 dark:text-zinc-400">Applications built per month:</span>
              <span className="font-semibold text-zinc-900 dark:text-white font-mono">
                {projectCount} {projectCount === 1 ? 'project' : 'projects'}
              </span>
            </div>

            <input
              type="range"
              min={1}
              max={30}
              value={projectCount}
              onChange={(e) => setProjectCount(Number(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-zinc-900 dark:accent-white"
            />

            <div className="flex justify-between text-[11px] text-zinc-400">
              <span>1</span>
              <span>15</span>
              <span>30</span>
            </div>
          </div>

          {/* Model Selection */}
          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2">Model rate comparison:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedModel('haiku')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  selectedModel === 'haiku'
                    ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-[#2C2C2E] text-zinc-900 dark:text-white'
                    : 'border-zinc-200/70 dark:border-white/[0.06] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <div className="font-medium text-xs">Claude Haiku</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">$0.45 / 1M tokens</div>
              </button>

              <button
                onClick={() => setSelectedModel('mini')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  selectedModel === 'mini'
                    ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-[#2C2C2E] text-zinc-900 dark:text-white'
                    : 'border-zinc-200/70 dark:border-white/[0.06] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <div className="font-medium text-xs">GPT-4o mini</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">$0.25 / 1M tokens</div>
              </button>

              <button
                onClick={() => setSelectedModel('gemini')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  selectedModel === 'gemini'
                    ? 'border-zinc-900 dark:border-white bg-zinc-100 dark:bg-[#2C2C2E] text-zinc-900 dark:text-white'
                    : 'border-zinc-200/70 dark:border-white/[0.06] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
                }`}
              >
                <div className="font-medium text-xs">Gemini Flash</div>
                <div className="text-[10px] text-zinc-400 mt-0.5">Free / $0.12</div>
              </button>
            </div>
          </div>

          {/* Comparison Cards */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl border border-zinc-200/70 dark:border-white/[0.06] bg-zinc-50/60 dark:bg-[#18181B]">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">SaaS Builder</span>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white mt-1">
                ${closedPlatformMonthlyCost}<span className="text-xs font-normal text-zinc-400">/mo</span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                Standard monthly subscription
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-zinc-200/70 dark:border-white/[0.06] bg-zinc-50/60 dark:bg-[#18181B]">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">Direct API</span>
              <div className="text-lg font-semibold text-zinc-900 dark:text-white mt-1">
                ${directApiMonthlyCost.toFixed(2)}<span className="text-xs font-normal text-zinc-400">/mo</span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">
                Pay only for tokens consumed
              </p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-[#121214] flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Existing Claude or ChatGPT plans cover this at $0 extra.
          </span>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
