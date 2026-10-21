import React, { useState } from 'react';
import { X } from 'lucide-react';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuideModal: React.FC<SetupGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [platform, setPlatform] = useState<'claude' | 'chatgpt' | 'cursor'>('claude');

  if (!isOpen) return null;

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
              How to use these agents
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Add rules to your AI assistant once, then prompt normally.
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

        {/* Segmented Control */}
        <div className="px-6 pb-5">
          <div className="p-1 rounded-xl bg-zinc-100 dark:bg-[#1C1C1E] grid grid-cols-3 gap-1">
            <button
              onClick={() => setPlatform('claude')}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium transition ${
                platform === 'claude'
                  ? 'bg-white dark:bg-[#2C2C2E] text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              Claude
            </button>
            <button
              onClick={() => setPlatform('chatgpt')}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium transition ${
                platform === 'chatgpt'
                  ? 'bg-white dark:bg-[#2C2C2E] text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              ChatGPT
            </button>
            <button
              onClick={() => setPlatform('cursor')}
              className={`py-1.5 px-3 rounded-lg text-xs font-medium transition ${
                platform === 'cursor'
                  ? 'bg-white dark:bg-[#2C2C2E] text-zinc-900 dark:text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-200'
              }`}
            >
              Cursor / IDE
            </button>
          </div>
        </div>

        {/* Steps Content */}
        <div className="px-6 pb-6 space-y-4">
          {platform === 'claude' && (
            <div className="space-y-3.5">
              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Copy the rules</p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Click <strong>Copy Rules</strong> on any card, or open it to copy the dedicated <code className="font-mono text-zinc-800 dark:text-zinc-300">CLAUDE.md</code> format.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Paste in Claude Project</p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    In Claude.ai, open a <strong>Project</strong> in the left sidebar and paste the rules into <strong>Project Instructions</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Prompt naturally</p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Claude will automatically follow the styling, layout, and reliability constraints for every prompt.
                  </p>
                </div>
              </div>
            </div>
          )}

          {platform === 'chatgpt' && (
            <div className="space-y-3.5">
              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Copy the system prompt</p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Click <strong>Copy Rules</strong> on any agent card to copy the clean system prompt to your clipboard.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Open Custom Instructions</p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    In ChatGPT, click your avatar &rarr; <strong>Settings</strong> &rarr; <strong>Personalization</strong> &rarr; <strong>Custom Instructions</strong>.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Save and use</p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Paste into <em>"How would you like ChatGPT to respond?"</em> and click <strong>Save</strong>.
                  </p>
                </div>
              </div>
            </div>
          )}

          {platform === 'cursor' && (
            <div className="space-y-3.5">
              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Copy the .cursorrules format</p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Click the card to open it, select the <code className="font-mono text-zinc-800 dark:text-zinc-300">.cursorrules</code> tab, and copy.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Create the file</p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    In your project root directory, create a file named <code className="font-mono text-zinc-800 dark:text-zinc-300">.cursorrules</code> and paste the text.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <p className="font-medium text-zinc-900 dark:text-white">Automatic enforcement</p>
                  <p className="text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    Cursor Composer and inline completions will automatically adhere to the rules.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-[#121214] flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Works with standard AI subscriptions. No API keys needed.
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
