import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, X, ShieldCheck, Check, Layers } from 'lucide-react';
import { AGENTS } from './data/agents';
import { Agent, Category } from './types';
import { Navbar } from './components/Navbar';
import { AgentCard } from './components/AgentCard';
import { AgentModal } from './components/AgentModal';
import { TeamTray } from './components/TeamTray';
import { TeamModal } from './components/TeamModal';
import { SetupGuideModal } from './components/SetupGuideModal';
import { CostCalculatorModal } from './components/CostCalculatorModal';
import { getSmartTeamRecommendation } from './utils/recommender';
import { sanitizeOutput } from './utils/security';
import { synthesizeTeamClaudeMd } from './utils/team';

const STORAGE_KEY_TEAM = 'viberoster_team_roster_v1';
const STORAGE_KEY_THEME = 'viberoster_theme_mode';

const QUICK_PROMPT_CHIPS = [
  { label: '💰 Token Saver & Repomix', query: 'token' },
  { label: '🚀 Full-Stack SaaS', query: 'saas' },
  { label: '⚡ Next.js + Tailwind', query: 'next' },
  { label: '📱 Mobile (Flutter / Expo)', query: 'mobile' },
  { label: '🛠️ Clean Code & Refactor', query: 'clean' },
  { label: '🎮 3D Web & Game', query: 'game' },
  { label: '🤖 Local AI & RAG', query: 'ai' },
];

export function App() {
  // Theme state (default dark, stored in localStorage)
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) || localStorage.getItem('viberules_theme_mode') || localStorage.getItem('vibehub_theme_mode');
      if (saved) return saved === 'dark';
    } catch (e) {}
    return true;
  });

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(STORAGE_KEY_THEME, next ? 'dark' : 'light');
      } catch (e) {}
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Team state - initialized from localStorage (Zero PII, client-only)
  const [team, setTeam] = useState<Agent[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_TEAM) || localStorage.getItem('viberules_team_roster_v1') || localStorage.getItem('vibehub_team_roster_v4');
      if (stored) {
        const parsedIds: string[] = JSON.parse(stored);
        const matched = AGENTS.filter((a) => parsedIds.includes(a.id));
        if (matched.length > 0) return matched;
      }
    } catch (e) {}
    return [AGENTS[0], AGENTS[1]];
  });

  // Modals state
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [calcModalOpen, setCalcModalOpen] = useState(false);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [copiedRecommended, setCopiedRecommended] = useState(false);

  // Team mutation handlers
  const handleToggleTeamAgent = (agent: Agent) => {
    setTeam((prev) => {
      const exists = prev.some((a) => a.id === agent.id);
      const updated = exists ? prev.filter((a) => a.id !== agent.id) : [...prev, agent];
      try {
        localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(updated.map((a) => a.id)));
      } catch (e) {}
      return updated;
    });
  };

  const handleRemoveFromTeam = (agentId: string) => {
    setTeam((prev) => {
      const updated = prev.filter((a) => a.id !== agentId);
      try {
        localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(updated.map((a) => a.id)));
      } catch (e) {}
      return updated;
    });
  };

  const handleClearTeam = () => {
    setTeam([]);
    try {
      localStorage.removeItem(STORAGE_KEY_TEAM);
    } catch (e) {}
  };

  const handleAddMultipleToTeam = (agentsToAdd: Agent[]) => {
    setTeam((prev) => {
      const ids = new Set(prev.map((a) => a.id));
      const additions = agentsToAdd.filter((a) => !ids.has(a.id));
      const updated = [...prev, ...additions];
      try {
        localStorage.setItem(STORAGE_KEY_TEAM, JSON.stringify(updated.map((a) => a.id)));
      } catch (e) {}
      return updated;
    });
  };

  // Keyboard shortcut (⌘K or Ctrl+K to search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search-agents')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Category counts across 120 agents
  const categoryCounts = useMemo(() => {
    const counts: Record<Category, number> = {
      all: AGENTS.length,
      tokens: 0,
      web: 0,
      backend: 0,
      debug: 0,
      tools: 0,
      game: 0,
    };
    for (const a of AGENTS) {
      if (counts[a.category] !== undefined) {
        counts[a.category]++;
      }
    }
    return counts;
  }, []);

  const categories: { id: Category; label: string; count: number }[] = [
    { id: 'all', label: 'All', count: categoryCounts.all },
    { id: 'tokens', label: 'Token & Cost Savers', count: categoryCounts.tokens },
    { id: 'web', label: 'Web & UI', count: categoryCounts.web },
    { id: 'backend', label: 'Full-Stack & Backend', count: categoryCounts.backend },
    { id: 'debug', label: 'Bug Fixing & Refactor', count: categoryCounts.debug },
    { id: 'tools', label: 'AI & Vibe Tools', count: categoryCounts.tools },
    { id: 'game', label: 'Game & Mobile', count: categoryCounts.game },
  ];

  // Smart Team Recommendation Engine (Hero Wizard)
  const recommendation = useMemo(() => {
    return getSmartTeamRecommendation(searchQuery, AGENTS);
  }, [searchQuery]);

  // Filtering + Default Descending Sort by GitHub Stars
  const filteredAgents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const matched = AGENTS.filter((agent) => {
      const matchesCategory = selectedCategory === 'all' || agent.category === selectedCategory;
      const matchesSearch =
        !q ||
        agent.name.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.role.toLowerCase().includes(q) ||
        agent.author.toLowerCase().includes(q) ||
        agent.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });

    // Strictly sort descending by GitHub starCount
    return matched.sort((a, b) => b.starCount - a.starCount);
  }, [selectedCategory, searchQuery]);

  const handleCopyRecommendationRules = () => {
    if (!recommendation) return;
    const rules = synthesizeTeamClaudeMd(recommendation.agents);
    navigator.clipboard.writeText(sanitizeOutput(rules));
    setCopiedRecommended(true);
    setTimeout(() => setCopiedRecommended(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#FBFBFD] dark:bg-[#09090B] text-zinc-900 dark:text-[#F4F4F5] flex flex-col font-sans transition-colors duration-150 pb-24">
      
      {/* Clean Apple Minimalist Header */}
      <Navbar
        teamCount={team.length}
        isDark={isDark}
        onToggleTheme={handleToggleTheme}
        onOpenTeamModal={() => setTeamModalOpen(true)}
        onOpenGuideModal={() => setGuideModalOpen(true)}
        onOpenCalcModal={() => setCalcModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full space-y-6">
        
        {/* Hero Section & Smart Agent Recommender Wizard */}
        <section className="pt-2 pb-4 border-b border-zinc-200/80 dark:border-white/[0.06]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-zinc-100 dark:bg-[#18181B] text-zinc-600 dark:text-zinc-300 border border-zinc-200/80 dark:border-white/[0.06] mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero PII &bull; Prompt Injection Shield &bull; 120 GitHub Ranked Agents</span>
            </div>

            <div className="flex items-center gap-2.5 mb-1 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-900 dark:text-white">
                VibeRoster
              </h1>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-[#1C1C1E] text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-white/[0.08]">
                120 Curated Agents
              </span>
            </div>

            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
              The curated agent roster and system instructions for Claude, Cursor, and ChatGPT. Select, combine, and copy 120 production-tested AI rules with zero API keys.
            </p>
          </div>

          {/* Interactive Search Bar & Smart Wizard */}
          <div className="mt-4 max-w-3xl space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="search-agents"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="What do you want to build? (e.g. Claude token saver, Next.js SaaS, Repomix packer, 3D game...)"
                className="w-full h-11 pl-10 pr-9 rounded-xl bg-white dark:bg-[#121214] border border-zinc-200/90 dark:border-white/[0.08] focus:border-zinc-400 dark:focus:border-white/20 focus:outline-none text-xs sm:text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 shadow-xs transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Prompt Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
              <span className="text-[11px] text-zinc-400 whitespace-nowrap mr-1">Popular stacks:</span>
              {QUICK_PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(chip.query)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition whitespace-nowrap border ${
                    searchQuery === chip.query
                      ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white'
                      : 'bg-white dark:bg-[#121214] border-zinc-200/80 dark:border-white/[0.06] text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-white/20'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Smart Team Recommendation Card (Wizard Result) */}
          {recommendation && (
            <div className="mt-4 max-w-3xl p-3.5 rounded-2xl border border-zinc-300 dark:border-white/20 bg-white dark:bg-[#121214] shadow-sm animate-in fade-in duration-150">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Smart Team Recommendation</span>
                    </span>
                    <span className="text-zinc-300 dark:text-zinc-700">&bull;</span>
                    <span className="text-xs font-medium text-zinc-900 dark:text-white">
                      {recommendation.title}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {recommendation.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={handleCopyRecommendationRules}
                    className="px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/[0.08] hover:bg-zinc-100 dark:hover:bg-[#1C1C1E] text-xs font-medium text-zinc-700 dark:text-zinc-300 transition flex items-center gap-1"
                  >
                    {copiedRecommended ? <Check className="w-3 h-3 text-emerald-500" /> : <Layers className="w-3 h-3" />}
                    <span>{copiedRecommended ? 'Copied' : 'Copy Rules'}</span>
                  </button>

                  <button
                    onClick={() => handleAddMultipleToTeam(recommendation.agents)}
                    className="px-3.5 py-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-medium hover:opacity-90 transition shadow-xs flex items-center gap-1"
                  >
                    <span>Add Team to Roster</span>
                  </button>
                </div>
              </div>

              {/* Recommended Roster Chips */}
              <div className="mt-2.5 pt-2.5 border-t border-zinc-100 dark:border-white/[0.04] flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-zinc-400">Suggested Agents:</span>
                {recommendation.agents.map((ag) => (
                  <span
                    key={ag.id}
                    onClick={() => setSelectedAgent(ag)}
                    className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-[#1C1C1E] text-[11px] text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-white/[0.04] cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-600 transition"
                  >
                    <span className="font-medium">{ag.name}</span>
                    <span className="text-[10px] text-zinc-500 font-mono">{ag.stars}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Category Filter Pills & Results Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition whitespace-nowrap flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black shadow-xs'
                    : 'bg-white dark:bg-[#121214] text-zinc-600 dark:text-zinc-400 border border-zinc-200/80 dark:border-white/[0.08] hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                  selectedCategory === cat.id
                    ? 'bg-zinc-700 dark:bg-zinc-200 text-white dark:text-black'
                    : 'bg-zinc-100 dark:bg-[#1C1C1E] text-zinc-500'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 self-end sm:self-center flex-shrink-0">
            <span>Ranked by: <strong className="font-medium text-zinc-800 dark:text-zinc-200">GitHub Stars (Descending)</strong></span>
          </div>
        </div>

        {/* Clean Agent Cards Grid */}
        <div className="pt-1">
          {filteredAgents.length === 0 ? (
            <div className="text-center py-12 border rounded-2xl border-zinc-200/80 dark:border-white/[0.08] bg-white dark:bg-[#121214]">
              <p className="text-zinc-500 text-xs">No matching agents found.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs text-zinc-900 dark:text-white hover:underline font-medium"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {filteredAgents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isInTeam={team.some((t) => t.id === agent.id)}
                  onToggleTeam={handleToggleTeamAgent}
                  onOpenModal={(ag) => setSelectedAgent(ag)}
                />
              ))}
            </div>
          )}
        </div>

      </main>

      {/* Floating Multi-Agent Team Cart Tray */}
      <TeamTray
        team={team}
        onRemoveFromTeam={handleRemoveFromTeam}
        onClearTeam={handleClearTeam}
        onOpenTeamModal={() => setTeamModalOpen(true)}
      />

      {/* Apple Minimalist Footer */}
      <footer className="border-t border-zinc-200/80 dark:border-white/[0.06] py-5 bg-[#FBFBFD] dark:bg-[#09090B] text-xs text-zinc-500 dark:text-zinc-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-900 dark:text-white">VibeRoster</span>
            <span>&bull;</span>
            <span>Agent Roster</span>
            <span>&bull;</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Zero PII Guaranteed
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setCalcModalOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-white transition"
            >
              Cost Calculator
            </button>
            <button
              onClick={() => setGuideModalOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-white transition"
            >
              Setup Guide
            </button>
            <button
              onClick={() => setTeamModalOpen(true)}
              className="hover:text-zinc-900 dark:hover:text-white transition"
            >
              Active Roster ({team.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AgentModal
        agent={selectedAgent}
        isInTeam={selectedAgent ? team.some((t) => t.id === selectedAgent.id) : false}
        onToggleTeam={handleToggleTeamAgent}
        onClose={() => setSelectedAgent(null)}
      />

      <TeamModal
        isOpen={teamModalOpen}
        team={team}
        onRemoveFromTeam={handleRemoveFromTeam}
        onClearTeam={handleClearTeam}
        onClose={() => setTeamModalOpen(false)}
      />

      <SetupGuideModal
        isOpen={guideModalOpen}
        onClose={() => setGuideModalOpen(false)}
      />

      <CostCalculatorModal
        isOpen={calcModalOpen}
        onClose={() => setCalcModalOpen(false)}
      />

    </div>
  );
}

export default App;
