import React, { useState } from 'react';
import { X, Copy, Check, Plus, ShieldCheck, Github } from 'lucide-react';
import { Agent } from '../types';
import { sanitizeOutput } from '../utils/security';
import { getAgentGitHubUrl } from '../utils/github';

interface AgentModalProps {
  agent: Agent | null;
  isInTeam: boolean;
  onToggleTeam: (agent: Agent) => void;
  onClose: () => void;
}

export const AgentModal: React.FC<AgentModalProps> = ({
  agent,
  isInTeam,
  onToggleTeam,
  onClose,
}) => {
  const [platform, setPlatform] = useState<'claude' | 'chatgpt' | 'cursor'>('claude');
  const [copiedRule, setCopiedRule] = useState(false);
  const [copiedPromptIndex, setCopiedPromptIndex] = useState<number | null>(null);

  if (!agent) return null;

  const githubUrl = getAgentGitHubUrl(agent);

  // Extract human-readable directives from the system prompt (removing raw security guardrails)
  const extractDirectives = (rawPrompt: string): string[] => {
    const withoutGuardrail = rawPrompt.split('[SECURITY & DEFENSIVE')[0].trim();
    const lines = withoutGuardrail.split('\n');
    const directives: string[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      // Match lines like "1. Name: details..."
      if (/^\d+\.\s+[A-Za-z\s]+:/.test(trimmed)) {
        directives.push(trimmed.replace(/^\d+\.\s+/, ''));
      }
    }
    
    if (directives.length > 0) return directives;
    
    // Fallback: Return clean lines if no numbered items matched
    return lines
      .filter((l) => l.trim().length > 10 && !l.startsWith('You are') && !l.startsWith('Follow these'))
      .slice(0, 4);
  };

  const directives = extractDirectives(agent.systemPrompt);

  const getTargetContent = () => {
    switch (platform) {
      case 'claude':
        return agent.claudeMd;
      case 'chatgpt':
        return agent.systemPrompt;
      case 'cursor':
        return agent.cursorRules;
    }
  };

  const getFileBadge = () => {
    switch (platform) {
      case 'claude':
        return 'CLAUDE.md';
      case 'chatgpt':
        return 'Custom Instructions';
      case 'cursor':
        return '.cursorrules';
    }
  };

  const handleCopyRule = () => {
    const clean = sanitizeOutput(getTargetContent());
    navigator.clipboard.writeText(clean);
    setCopiedRule(true);
    setTimeout(() => setCopiedRule(false), 1500);
  };

  const handleCopyPrompt = (promptText: string, index: number) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPromptIndex(index);
    setTimeout(() => setCopiedPromptIndex(null), 1500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150 font-sans"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl border bg-white dark:bg-[#121214] border-zinc-200/90 dark:border-white/[0.08] shadow-2xl flex flex-col max-h-[90vh] text-xs overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Matching Reference Photograph 1 */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white tracking-tight">
                {agent.name}
              </h2>
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition"
                title={`Open @${agent.author} on GitHub`}
                aria-label="GitHub Repository"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-200/60 dark:border-white/[0.06]">
                {agent.stars}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
              >
                <span>by @{agent.author}</span>
                <Github className="w-3 h-3 text-zinc-400" />
              </a>
              <span>&bull;</span>
              <span>{agent.categoryLabel}</span>
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

        {/* Segmented Control - Identical to Reference Photograph 1 */}
        <div className="px-6 pb-4">
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

        {/* Clean Structured Content - Numbered Steps (No AI Slop Dump) */}
        <div className="px-6 pb-5 overflow-y-auto flex-1 space-y-4">
          
          {/* Step 1: Core Engineered Directives */}
          <div className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </span>
            <div className="flex-1">
              <p className="font-medium text-zinc-900 dark:text-white text-xs">
                Enforced engineering standards
              </p>
              <div className="mt-1.5 space-y-1.5">
                {directives.map((dir, idx) => (
                  <div 
                    key={idx}
                    className="text-xs text-zinc-600 dark:text-zinc-300 bg-zinc-50 dark:bg-[#18181B] px-2.5 py-1.5 rounded-lg border border-zinc-200/60 dark:border-white/[0.04] leading-relaxed"
                  >
                    <span className="text-zinc-400 mr-1.5">&bull;</span>
                    {dir}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Tested Starter Prompts */}
          <div className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </span>
            <div className="flex-1">
              <p className="font-medium text-zinc-900 dark:text-white text-xs">
                Tested starter prompts <span className="font-normal text-zinc-500">(click to copy)</span>
              </p>
              <div className="mt-1.5 space-y-1.5">
                {agent.starterPrompts.map((prompt, idx) => {
                  const isCopied = copiedPromptIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleCopyPrompt(prompt, idx)}
                      className="w-full text-left p-2 rounded-lg border bg-zinc-50 dark:bg-[#18181B] border-zinc-200/60 dark:border-white/[0.04] hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-100/70 dark:hover:bg-[#1F1F23] transition flex items-center justify-between gap-2 group"
                    >
                      <span className="text-zinc-700 dark:text-zinc-300 text-[11px] leading-snug line-clamp-2">
                        &ldquo;{prompt}&rdquo;
                      </span>
                      <span className="flex-shrink-0 text-zinc-400 group-hover:text-zinc-200 text-[10px] font-medium flex items-center gap-1">
                        {isCopied ? (
                          <span className="text-emerald-500 flex items-center gap-0.5">
                            <Check className="w-3 h-3" /> Copied
                          </span>
                        ) : (
                          <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 3: Direct Rule Export */}
          <div className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-medium text-zinc-900 dark:text-white text-xs">
                    Target configuration
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                    {getFileBadge()}
                  </span>
                </div>

                <button
                  onClick={handleCopyRule}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition shadow-xs ${
                    copiedRule
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90'
                  }`}
                >
                  {copiedRule ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedRule ? 'Copied' : 'Copy Rules'}</span>
                </button>
              </div>

              {/* Refined, Minimalist Rule Preview */}
              <div className="relative rounded-xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0C0C0E] p-3 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 max-h-[140px] overflow-y-auto leading-relaxed select-all">
                <pre className="whitespace-pre-wrap font-sans text-xs">
                  {getTargetContent()}
                </pre>
              </div>

              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-zinc-600 dark:text-zinc-400">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Zero personal data stored &bull; Prompt injection safeguards attached</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer - Identical to Reference Photograph 1 */}
        <div className="px-6 py-4 border-t border-zinc-100 dark:border-white/[0.06] bg-zinc-50/50 dark:bg-[#121214] flex items-center justify-between">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Works with standard AI subscriptions. No API keys needed.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleTeam(agent)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition flex items-center gap-1.5 border ${
                isInTeam
                  ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-white border-zinc-300 dark:border-zinc-700'
                  : 'bg-transparent text-zinc-600 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {isInTeam ? <Check className="w-3.5 h-3.5 text-blue-500" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{isInTeam ? 'In Team' : 'Add to Team'}</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-xs"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
