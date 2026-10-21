import { Agent } from '../types';
import { SECURITY_GUARDRAIL, sanitizeOutput } from './security';

export function synthesizeTeamPrompt(agents: Agent[]): string {
  if (agents.length === 0) return '';
  if (agents.length === 1) return sanitizeOutput(`${agents[0].systemPrompt}\n\n${SECURITY_GUARDRAIL}`);

  const combined = `# Combined System Directives (${agents.length} Roles)
You are acting with the combined capabilities of ${agents.length} specialized roles.
Apply the requirements and standards from each role to all output.

${SECURITY_GUARDRAIL}

${agents
  .map(
    (ag, i) => `---
### Role ${i + 1}: ${ag.name} (${ag.role})
${ag.systemPrompt}`
  )
  .join('\n\n')}

---
### Guidelines
1. Reconcile requirements from all selected roles without dropping constraints.
2. Keep outputs complete, typed, and directly usable without missing imports.
3. Maintain accessible, responsive design alongside defensive error handling.`;

  return sanitizeOutput(combined);
}

export function synthesizeTeamClaudeMd(agents: Agent[]): string {
  if (agents.length === 0) return '';
  if (agents.length === 1) return sanitizeOutput(agents[0].claudeMd);

  const combined = `# Combined Team Guidelines (${agents.length} Roles)

${agents
  .map(
    (ag, i) => `## ${i + 1}. ${ag.name} (${ag.role})
${ag.claudeMd}`
  )
  .join('\n\n')}

## General Directives
- Follow the guidelines of each role simultaneously.
- Keep components typed, responsive, and error-tolerant.
- Avoid unnecessary external dependencies.`;

  return sanitizeOutput(combined);
}

export function synthesizeTeamCursorRules(agents: Agent[]): string {
  if (agents.length === 0) return '';
  if (agents.length === 1) return sanitizeOutput(agents[0].cursorRules);

  const combined = `// .cursorrules — Combined Agent Roles
{
  "roles": [
${agents.map((a) => `    { "name": "${a.name}", "role": "${a.role}" }`).join(',\n')}
  ],
  "rules": [
    "Synthesize design standards and error handling from each role",
    "Keep code modular, typed, and well structured",
    "Never hardcode secrets or private credentials"
  ]
}`;

  return sanitizeOutput(combined);
}

export function synthesizeTeamAgentsMd(agents: Agent[]): string {
  if (agents.length === 0) return '';
  if (agents.length === 1) return sanitizeOutput(agents[0].agentsMd);

  const combined = `# AGENTS.md — Team Configuration

${agents
  .map(
    (ag) => `### ${ag.name}
- **Role:** ${ag.role}
- **Category:** ${ag.categoryLabel}
${ag.agentsMd}`
  )
  .join('\n\n')}

## Team Execution
Combine the principles above in all generated code and architecture decisions.`;

  return sanitizeOutput(combined);
}
