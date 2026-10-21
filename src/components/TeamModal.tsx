import React, { useState } from 'react';
import { X, Copy, Check, Trash2, ShieldCheck } from 'lucide-react';
import { Agent } from '../types';
import { 
  synthesizeTeamPrompt, 
  synthesizeTeamClaudeMd, 
  synthesizeTeamCursorRules 
} from '../utils/team';
import { sanitizeOutput } from '../utils/security';
import { AgentIcon } from './AgentIcon';

interface TeamModalProps {
  isOpen: boolean;
  team: Agent[];
  onRemoveFromTeam: (agentId: string) => void;
  onClearTeam: () => void;
  onClose: () => void;
}

export const TeamModal: React.FC<TeamModalProps> = ({
  isOpen,
  team,
  onRemoveFromTeam,
  onClearTeam,
  onClose,
}) => {
  const [platform, setPlatform] = useState<'claude' | 'chatgpt' | 'cursor'>('claude');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getCombinedText = () => {
    switch (platform) {
      case 'claude':
        return synthesizeTeamClaudeMd(team);
      case 'chatgpt':
        return synthesizeTeamPrompt(team);
      case 'cursor':
        return synthesizeTeamCursorRules(team);
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

  const handleCopy = () => {
    const clean = sanitizeOutput(getCombinedText());
    navigator.clipboard.writeText(clean);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
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
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-white tracking-tight">
                Combined Team Rules
              </h2>
              <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 px-2 py-0.5 rounded-md border border-zinc-200/60 dark:border-white/[0.06]">
                {team.length} {team.length === 1 ? 'agent' : 'agents'}
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Merged system instructions for your selected agent stack.
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

        {/* Content */}
        <div className="px-6 pb-5 overflow-y-auto flex-1 space-y-4">
          
          {/* Step 1: Active Agents Roster */}
          <div className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium text-zinc-900 dark:text-white text-xs">
                  Active team roster
                </p>
                {team.length > 0 && (
                  <button
                    onClick={onClearTeam}
                    className="text-[11px] text-zinc-400 hover:text-red-500 flex items-center gap-1 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear all</span>
                  </button>
                )}
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                {team.length === 0 ? (
                  <p className="text-zinc-500 italic text-[11px]">
                    No agents in team. Add agents from the catalog to synthesize combined rules.
                  </p>
                ) : (
                  team.map((ag) => (
                    <span
                      key={ag.id}
                      className="inline-flex items-center gap-1.5 pl-2.5 pr-1.5 py-1 rounded-full bg-zinc-100 dark:bg-[#18181B] border border-zinc-200/60 dark:border-white/[0.06] text-zinc-700 dark:text-zinc-300 text-[11px]"
                    >
                      <AgentIcon name={ag.icon} className="w-3 h-3 text-zinc-400" />
                      <span>{ag.name}</span>
                      <button
                        onClick={() => onRemoveFromTeam(ag.id)}
                        className="p-0.5 hover:text-red-500 text-zinc-400 rounded-full transition ml-0.5"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Step 2: Merged Rule Export */}
          <div className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[11px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
              2
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
                  onClick={handleCopy}
                  disabled={team.length === 0}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium transition shadow-xs ${
                    team.length === 0
                      ? 'opacity-40 cursor-not-allowed bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                      : copied
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90'
                  }`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy Rules'}</span>
                </button>
              </div>

              {/* Clean Preview Box */}
              <div className="relative rounded-xl border border-zinc-200 dark:border-white/[0.06] bg-zinc-50 dark:bg-[#0C0C0E] p-3 text-[11px] font-mono text-zinc-700 dark:text-zinc-300 max-h-[160px] overflow-y-auto leading-relaxed select-all">
                <pre className="whitespace-pre-wrap font-sans text-xs">
                  {team.length === 0 
                    ? 'Add agents to your team to generate combined multi-agent rules.' 
                    : getCombinedText()}
                </pre>
              </div>

              <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-zinc-600 dark:text-zinc-400">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span>Zero personal data stored &bull; Prompt injection safeguards attached</span>
              </div>
            </div>
          </div>

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
