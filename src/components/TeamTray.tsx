import React, { useState } from 'react';
import { Users, X, Copy, Check, Layers } from 'lucide-react';
import { Agent } from '../types';
import { synthesizeTeamPrompt } from '../utils/team';
import { sanitizeOutput } from '../utils/security';
import { AgentIcon } from './AgentIcon';

interface TeamTrayProps {
  team: Agent[];
  onRemoveFromTeam: (agentId: string) => void;
  onClearTeam: () => void;
  onOpenTeamModal: () => void;
}

export const TeamTray: React.FC<TeamTrayProps> = ({
  team,
  onRemoveFromTeam,
  onClearTeam,
  onOpenTeamModal,
}) => {
  const [copied, setCopied] = useState(false);

  if (team.length === 0) return null;

  const handleQuickCopyTeamPrompt = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(sanitizeOutput(synthesizeTeamPrompt(team)));
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <aside aria-label="Active Multi-Agent Team Tray" className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 w-[94%] max-w-xl animate-in slide-in-from-bottom-3 duration-200">
      <div className="rounded-full border bg-zinc-900/95 dark:bg-[#121214]/95 text-white border-zinc-700/80 dark:border-white/[0.12] shadow-2xl backdrop-blur-md px-3.5 py-1.5 flex items-center justify-between gap-3 text-xs">
        
        {/* Left: Team Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar min-w-0">
          <span className="text-[11px] text-zinc-400 whitespace-nowrap font-medium flex items-center gap-1.5 pl-1">
            <Users className="w-3.5 h-3.5 text-zinc-300" />
            <span>Team ({team.length}):</span>
          </span>

          <div className="flex items-center gap-1.5">
            {team.map((ag) => (
              <span
                key={ag.id}
                className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-0.5 rounded-full bg-zinc-800 dark:bg-[#1C1C1E] border border-zinc-700 dark:border-white/[0.08] text-[11px] whitespace-nowrap"
              >
                <AgentIcon name={ag.icon} className="w-3 h-3 text-zinc-400" />
                <span className="font-medium max-w-[110px] truncate">{ag.name}</span>
                <button
                  onClick={() => onRemoveFromTeam(ag.id)}
                  className="p-0.5 hover:text-red-400 text-zinc-400 transition rounded-full"
                  title="Remove agent from team"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0 pr-0.5">
          <button
            onClick={onClearTeam}
            className="text-[11px] text-zinc-400 hover:text-white px-2 py-1 transition"
            title="Clear team roster"
          >
            Clear
          </button>

          <button
            onClick={handleQuickCopyTeamPrompt}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition shadow-xs ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-white text-black hover:bg-zinc-200'
            }`}
            title="Copy synthesized multi-agent rules"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Team'}</span>
          </button>

          <button
            onClick={onOpenTeamModal}
            className="p-1.5 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
            title="View combined CLAUDE.md & .cursorrules"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </aside>
  );
};
