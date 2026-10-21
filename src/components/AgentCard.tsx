import React, { useState } from 'react';
import { Copy, Check, Plus, ArrowUpRight, Github } from 'lucide-react';
import { Agent } from '../types';
import { sanitizeOutput } from '../utils/security';
import { getAgentGitHubUrl } from '../utils/github';
import { AgentIcon } from './AgentIcon';

interface AgentCardProps {
  agent: Agent;
  isInTeam: boolean;
  onToggleTeam: (agent: Agent) => void;
  onOpenModal: (agent: Agent) => void;
}

export const AgentCard: React.FC<AgentCardProps> = ({
  agent,
  isInTeam,
  onToggleTeam,
  onOpenModal,
}) => {
  const [copied, setCopied] = useState(false);
  const githubUrl = getAgentGitHubUrl(agent);

  const handleCopyPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sanitizeOutput(agent.systemPrompt));
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div
      onClick={() => onOpenModal(agent)}
      className={`rounded-2xl p-4 flex flex-col justify-between border cursor-pointer transition-all duration-150 font-sans ${
        isInTeam
          ? 'bg-zinc-100/70 dark:bg-[#18181B] border-zinc-900/40 dark:border-white/30 ring-1 ring-zinc-900/10 dark:ring-white/10 shadow-xs'
          : 'bg-white dark:bg-[#121214] border-zinc-200/80 dark:border-white/[0.08] hover:border-zinc-300 dark:hover:border-white/[0.16] hover:shadow-xs'
      }`}
    >
      <div>
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-[#1C1C1E] flex items-center justify-center flex-shrink-0 border border-zinc-200/60 dark:border-white/[0.06]">
              <AgentIcon name={agent.icon} className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-[13.5px] text-zinc-900 dark:text-white truncate tracking-tight">
                {agent.name}
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate flex items-center gap-1.5">
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition"
                  title={`Open GitHub repo (@${agent.author})`}
                >
                  <span>by @{agent.author}</span>
                  <Github className="w-3 h-3 text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                </a>
                <span>&bull;</span>
                <span>{agent.categoryLabel}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1 rounded-md text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1C1C1E] transition"
              title={`View GitHub repo`}
              aria-label="GitHub Repository"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <span className="text-[11px] font-mono text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-[#1C1C1E] px-2 py-0.5 rounded-md border border-zinc-200/60 dark:border-white/[0.06]">
              {agent.stars}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2 my-2">
          {agent.description}
        </p>
      </div>

      {/* Action Bar */}
      <div 
        className="pt-3 border-t border-zinc-100 dark:border-white/[0.06] flex items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleCopyPrompt}
          className={`flex-1 h-8 px-2.5 rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5 ${
            copied
              ? 'bg-emerald-600 text-white'
              : 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90'
          }`}
          title="Copy rules"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Rules'}</span>
        </button>

        <button
          onClick={() => onToggleTeam(agent)}
          className={`h-8 px-2.5 rounded-lg text-xs font-medium border transition flex items-center justify-center gap-1 ${
            isInTeam
              ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white'
              : 'bg-zinc-100 dark:bg-[#1C1C1E] border-zinc-200/80 dark:border-white/[0.06] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-[#2C2C2E]'
          }`}
          title={isInTeam ? 'Remove from active team' : 'Add to active team'}
        >
          {isInTeam ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>Team</span>
        </button>

        <button
          onClick={() => onOpenModal(agent)}
          className="h-8 w-8 rounded-lg border border-zinc-200/80 dark:border-white/[0.06] flex items-center justify-center text-zinc-400 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#1C1C1E] transition flex-shrink-0"
          title="View full agent details"
        >
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
