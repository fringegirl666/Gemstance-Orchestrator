// FIX: Add import for React to use React.ReactNode type.
import React from 'react';

export type SandboxMode = 'work' | 'leisure' | 'school';

export interface ConversationEntry {
  speaker: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export interface Agent {
  id: string;
  name: string;
  avatar: string;
  modelOrigin: 'Gemini' | 'Claude' | 'ChatGPT' | 'Perplexity';
  status: 'Idle' | 'Active' | 'Error';
  currentActivity: string;
  personality: {
    basePrompt: string;
    distilledDirective: string | null;
    traits: {
      creativity: number;
      formality: number;
      humor: number;
    };
  };
  enabledPackages: string[];
  memory: string[];
  conversationHistory: ConversationEntry[];
}

export interface MIPackage {
  id: string;
  name: string;
  description: string;
  // FIX: Changed type from React.ReactNode to a React component type to avoid using JSX in a .ts file.
  icon: React.FC<{ className?: string }>;
}