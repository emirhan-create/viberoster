import { Agent } from '../types';

export interface SmartTeamRecommendation {
  title: string;
  description: string;
  agents: Agent[];
  reason: string;
}

/**
 * Intelligent Agent Team Recommendation Engine
 * Analyzes the user's project intent and returns the optimal multi-agent synergy.
 */
export function getSmartTeamRecommendation(
  query: string,
  allAgents: Agent[]
): SmartTeamRecommendation | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;

  const findAgent = (idPrefix: string): Agent | undefined =>
    allAgents.find((a) => a.id.toLowerCase().includes(idPrefix.toLowerCase()));

  // 0. Token Optimization & Context Compression (Claude Token Saver)
  if (
    q.includes('token') ||
    q.includes('cost') ||
    q.includes('save') ||
    q.includes('compress') ||
    q.includes('context') ||
    q.includes('repomix') ||
    q.includes('repopack') ||
    q.includes('gitingest') ||
    q.includes('caching') ||
    q.includes('az harca') ||
    q.includes('tasarruf')
  ) {
    const claudeSaver = findAgent('claude-token-saver') || allAgents[0];
    const repomix = findAgent('repomix-codebase') || allAgents[1];
    const caching = findAgent('claude-prompt-caching') || allAgents[2];
    return {
      title: 'Token Optimization & Context Saver Stack',
      description: 'Cuts Claude & Cursor token consumption by 50-90% with concise diffs, Repomix codebase packing, and Anthropic prompt caching.',
      agents: [claudeSaver, repomix, caching].filter(Boolean),
      reason: 'Stops Claude from burning context on filler words, eliminates full-file reprints, and triggers 90% cache discounts.',
    };
  }

  // 1. Full-Stack SaaS & Startup
  if (
    q.includes('saas') ||
    q.includes('startup') ||
    q.includes('billing') ||
    q.includes('stripe') ||
    q.includes('fullstack') ||
    q.includes('full-stack')
  ) {
    const next = findAgent('nextjs-app-router') || allAgents[0];
    const supa = findAgent('supabase-postgres') || allAgents[2];
    const stripe = findAgent('stripe-subscriptions') || allAgents[5];
    return {
      title: 'Full-Stack SaaS & Billing Architecture',
      description: 'Production-ready stack with Server Components, Supabase auth/data, and Stripe webhooks.',
      agents: [next, supa, stripe].filter(Boolean),
      reason: 'Perfect pairing for rapid MVP deployment with rock-solid database tenancy and payments.',
    };
  }

  // 2. Modern Frontend & Design System
  if (
    q.includes('next') ||
    q.includes('web') ||
    q.includes('react') ||
    q.includes('tailwind') ||
    q.includes('landing') ||
    q.includes('ui') ||
    q.includes('front')
  ) {
    const react = findAgent('react-architecture') || allAgents[0];
    const tailwind = findAgent('tailwind-v4') || allAgents[1];
    const shadcn = findAgent('shadcn-ui') || allAgents[3];
    return {
      title: 'Next-Gen Frontend & UI Architecture',
      description: 'Zero-CLS layout system, accessible components, and modern atomic utility styling.',
      agents: [react, tailwind, shadcn].filter(Boolean),
      reason: 'Ensures fluid 60fps rendering, strict accessibility, and clean design tokens.',
    };
  }

  // 3. High Performance Backend & API
  if (
    q.includes('back') ||
    q.includes('api') ||
    q.includes('fastapi') ||
    q.includes('python') ||
    q.includes('data') ||
    q.includes('sql') ||
    q.includes('database')
  ) {
    const fastapi = findAgent('fastapi-backend') || allAgents[2];
    const docker = findAgent('docker-container') || allAgents[4];
    const redis = findAgent('redis-caching') || allAgents[6];
    return {
      title: 'High-Concurrency Backend & DevOps',
      description: 'Asynchronous Python endpoints, automated containerization, and sub-millisecond cache.',
      agents: [fastapi, docker, redis].filter(Boolean),
      reason: 'Guarantees sub-10ms response times, container reproducibility, and memory-safe caching.',
    };
  }

  // 4. Code Quality, Testing & Bug Elimination
  if (
    q.includes('bug') ||
    q.includes('fix') ||
    q.includes('test') ||
    q.includes('clean') ||
    q.includes('refactor') ||
    q.includes('typescript')
  ) {
    const ts = findAgent('typescript-strict') || allAgents[1];
    const clean = findAgent('clean-code-refactorer') || allAgents[2];
    const test = findAgent('playwright-e2e') || allAgents[5];
    return {
      title: 'Zero-Defect Refactoring & Testing Suite',
      description: 'Strict TypeScript compilation, cognitive complexity reduction, and end-to-end regression tests.',
      agents: [ts, clean, test].filter(Boolean),
      reason: 'Eliminates runtime exceptions, breaks down bloated code, and locks in test coverage.',
    };
  }

  // 5. Mobile & Native Apps
  if (
    q.includes('mobile') ||
    q.includes('flutter') ||
    q.includes('ios') ||
    q.includes('android') ||
    q.includes('react native') ||
    q.includes('expo')
  ) {
    const flutter = findAgent('flutter-cross-platform') || allAgents[1];
    const expo = findAgent('react-native-expo') || allAgents[3];
    return {
      title: 'Cross-Platform Mobile Application Stack',
      description: 'Native gesture handling, offline state synchronization, and App Store packaging.',
      agents: [flutter, expo].filter(Boolean),
      reason: 'Builds responsive iOS and Android apps with 60fps animations and native APIs.',
    };
  }

  // 6. Game Development & 3D Interactive
  if (
    q.includes('game') ||
    q.includes('3d') ||
    q.includes('webgl') ||
    q.includes('three') ||
    q.includes('canvas') ||
    q.includes('godot')
  ) {
    const three = findAgent('threejs-webgl') || allAgents[2];
    const godot = findAgent('godot-engine') || allAgents[3];
    const audio = findAgent('howler-web') || allAgents[7];
    return {
      title: 'Interactive 3D & Web Game Engine',
      description: 'Hardware-accelerated WebGL rendering, physics pipelines, and spatial audio.',
      agents: [three, godot, audio].filter(Boolean),
      reason: 'Delivers immersive 3D scene graphs with zero GC pauses and cross-browser sound.',
    };
  }

  // 7. AI, Local LLM & Prompt Tools
  if (
    q.includes('ai') ||
    q.includes('llm') ||
    q.includes('ollama') ||
    q.includes('cursor') ||
    q.includes('claude') ||
    q.includes('rag') ||
    q.includes('prompt')
  ) {
    const hf = findAgent('huggingface-transformers') || allAgents[1];
    const ollama = findAgent('ollama-local') || allAgents[2];
    const lang = findAgent('langchain-agent') || allAgents[3];
    return {
      title: 'Autonomous AI & Local Inference Pipeline',
      description: 'Private offline model serving, quantized inference, and chained tool execution.',
      agents: [hf, ollama, lang].filter(Boolean),
      reason: 'Runs local intelligence without recurring API fees or data leakage risks.',
    };
  }

  // Fallback: If generic query matches some agents
  const matched = allAgents.filter(
    (a) =>
      a.name.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q)
  );

  if (matched.length >= 2) {
    return {
      title: `Curated Stack for "${query}"`,
      description: `Matched ${matched.length} specialized agents for your requirements.`,
      agents: matched.slice(0, 3),
      reason: 'Directly aligned with your keywords.',
    };
  }

  return null;
}
