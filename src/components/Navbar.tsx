import React from 'react';
import { Users, Github, HelpCircle, Calculator, Sun, Moon, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  teamCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenTeamModal: () => void;
  onOpenGuideModal: () => void;
  onOpenCalcModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  teamCount,
  isDark,
  onToggleTheme,
  onOpenTeamModal,
  onOpenGuideModal,
  onOpenCalcModal,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 dark:border-white/[0.06] bg-[#FBFBFD]/90 dark:bg-[#09090B]/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 font-sans">
        
        {/* Brand: Logo badge (Black with white letters like tab favicon) + VibeRoster */}
        <div className="flex items-center gap-3 sm:gap-3.5">
          {/* Black square with white VR monogram */}
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#111113] text-white border border-white/10 shadow-sm flex items-center justify-center font-bold text-sm sm:text-[15px] tracking-tight flex-shrink-0 select-none">
            VR
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 leading-none">
              <span className="font-bold text-zinc-900 dark:text-white text-base sm:text-[17px] tracking-tight">
                VibeRoster
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-[#1C1C1E] text-zinc-500 dark:text-zinc-400 border border-zinc-200/60 dark:border-white/[0.06]">
                v2.0
              </span>
            </div>
            <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium italic tracking-tight mt-1">
              Curated AI Rules
            </span>
          </div>
        </div>

        {/* Center / Security Pill */}
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 px-3 py-1 rounded-full bg-zinc-100/70 dark:bg-[#141416] border border-zinc-200/60 dark:border-white/[0.06]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Zero PII &bull; Prompt Injection Shielded</span>
        </div>

        {/* Actions Toolbar - Enhanced Sizing */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Guide Button */}
          <button
            onClick={onOpenGuideModal}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#18181B] transition text-xs sm:text-[13px] font-medium"
            title="Setup Guide"
          >
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            <span className="hidden sm:inline">Guide</span>
          </button>

          {/* Calculator Button */}
          <button
            onClick={onOpenCalcModal}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#18181B] transition text-xs sm:text-[13px] font-medium"
            title="Cost Calculator"
          >
            <Calculator className="w-4 h-4 text-zinc-400" />
            <span className="hidden md:inline">Calculator</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#18181B] transition"
            title={isDark ? "Light mode" : "Dark mode"}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1"></div>

          {/* Team / Roster Pill */}
          <button
            onClick={onOpenTeamModal}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-[13px] font-medium transition shadow-xs ${
              teamCount > 0
                ? 'bg-zinc-900 dark:bg-white text-white dark:text-black hover:opacity-90'
                : 'bg-white dark:bg-[#121214] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-[#18181B] border border-zinc-200/80 dark:border-white/[0.08]'
            }`}
            title="Active Agent Roster"
          >
            <Users className="w-4 h-4" />
            <span>Roster ({teamCount})</span>
          </button>

          {/* GitHub Star Link */}
          <a
            href="https://github.com/emirhan-create/viberoster"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-[#18181B] transition"
            title="View on GitHub"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>

      </div>
    </header>
  );
};
