export type Category = 
  | 'all' 
  | 'tokens'
  | 'web' 
  | 'backend' 
  | 'debug' 
  | 'tools' 
  | 'game';

export interface Agent {
  id: string;
  name: string;
  role: string;
  category: Category;
  categoryLabel: string;
  stars: string;
  starCount: number;
  author: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon: string;
  description: string;
  starterPrompts: string[];
  systemPrompt: string;
  claudeMd: string;
  cursorRules: string;
  agentsMd: string;
}
