import React from 'react';
import { 
  Layout, 
  Gamepad2, 
  ShoppingBag, 
  User, 
  BarChart3, 
  Sparkles, 
  Bug, 
  Layers,
  Database,
  Server,
  Terminal,
  Cpu,
  Smartphone,
  Shield,
  Code2,
  Boxes,
  Zap,
  Globe,
  Box,
  Volume2,
  Wrench,
  MessageSquare,
  Monitor,
  Flame,
  FileCode2,
  TestTube2
} from 'lucide-react';

interface AgentIconProps {
  name: string;
  className?: string;
}

export const AgentIcon: React.FC<AgentIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'layout':
      return <Layout className={className} />;
    case 'gamepad':
      return <Gamepad2 className={className} />;
    case 'shopping-bag':
      return <ShoppingBag className={className} />;
    case 'user':
      return <User className={className} />;
    case 'bar-chart':
      return <BarChart3 className={className} />;
    case 'palette':
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'bug':
      return <Bug className={className} />;
    case 'layers':
      return <Layers className={className} />;
    case 'database':
      return <Database className={className} />;
    case 'server':
      return <Server className={className} />;
    case 'terminal':
      return <Terminal className={className} />;
    case 'cpu':
      return <Cpu className={className} />;
    case 'smartphone':
      return <Smartphone className={className} />;
    case 'shield':
      return <Shield className={className} />;
    case 'code':
      return <Code2 className={className} />;
    case 'boxes':
      return <Boxes className={className} />;
    case 'zap':
      return <Zap className={className} />;
    case 'globe':
      return <Globe className={className} />;
    case 'box':
      return <Box className={className} />;
    case 'volume':
      return <Volume2 className={className} />;
    case 'wrench':
      return <Wrench className={className} />;
    case 'message':
      return <MessageSquare className={className} />;
    case 'monitor':
      return <Monitor className={className} />;
    case 'flame':
      return <Flame className={className} />;
    case 'file':
      return <FileCode2 className={className} />;
    case 'test':
      return <TestTube2 className={className} />;
    default:
      return <Code2 className={className} />;
  }
};
