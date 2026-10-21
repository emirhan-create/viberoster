import { Agent } from '../types';
import { tokensAgents } from './agents/tokens';
import { webAgents } from './agents/web';
import { backendAgents } from './agents/backend';
import { debugAgents } from './agents/debug';
import { toolsAgents } from './agents/tools';
import { gameAgents } from './agents/game';

// Aggregate 120 curated agents (20 per category), strictly sorted descending by GitHub Stars
export const AGENTS: Agent[] = [
  ...tokensAgents,
  ...webAgents,
  ...backendAgents,
  ...debugAgents,
  ...toolsAgents,
  ...gameAgents,
].sort((a, b) => b.starCount - a.starCount);
