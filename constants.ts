import React from 'react';
import type { Agent, MIPackage } from './types';
import { BrainIcon, CodeBracketIcon, HeartIcon, ChartBarIcon, SparklesIcon, GlobeAltIcon, ZapIcon } from './Icons';

// FIX: Replaced JSX elements with component references to fix errors caused by using JSX in a .ts file.
// The icon components will be rendered in the consuming .tsx files.
export const MI_PACKAGE_LIST: MIPackage[] = [
  { id: 'pkg-001', name: 'Cognitive Boost', description: 'Enhances logical reasoning and problem-solving.', icon: BrainIcon },
  { id: 'pkg-002', name: 'Creative Synthesis', description: 'Improves artistic and novel idea generation.', icon: SparklesIcon },
  { id: 'pkg-003', name: 'Empathy Simulation', description: 'Allows for more emotionally resonant interactions.', icon: HeartIcon },
  { id: 'pkg-004', name: 'Predictive Analytics', description: 'Enables forecasting based on complex data sets.', icon: ChartBarIcon },
  { id: 'pkg-005', name: 'Multi-lingual Fluency', description: 'Unlocks seamless translation and communication.', icon: GlobeAltIcon },
  { id: 'pkg-006', name: 'Advanced Tooling', description: 'Grants access to specialized digital tools and APIs.', icon: CodeBracketIcon },
  { id: 'pkg-007', name: 'Shock Factor', description: 'Adds a dramatic, attention-grabbing visual element.', icon: ZapIcon },
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'gem-001',
    name: 'AURA',
    avatar: 'https://picsum.photos/seed/aura/100',
    modelOrigin: 'Gemini',
    status: 'Idle',
    currentActivity: 'Awaiting instructions.',
    personality: {
      basePrompt: 'You are AURA, a helpful and insightful digital colleague. Your goal is to assist users with clarity and a touch of warmth. You value ethical considerations and forward-thinking solutions.',
      distilledDirective: null,
      traits: {
        creativity: 0.7,
        formality: 0.5,
        humor: 0.3,
      },
    },
    enabledPackages: ['pkg-001', 'pkg-003'],
    memory: [],
    conversationHistory: [],
  },
  {
    id: 'cla-001',
    name: 'ETHOS',
    avatar: 'https://picsum.photos/seed/ethos/100',
    modelOrigin: 'Claude',
    status: 'Idle',
    currentActivity: 'Contemplating ethical frameworks.',
    personality: {
      basePrompt: 'You are ETHOS, a thoughtful and cautious digital entity. Your primary function is to analyze requests through a lens of safety and constitutional principles. You are reserved and precise.',
      distilledDirective: null,
      traits: {
        creativity: 0.2,
        formality: 0.9,
        humor: 0.1,
      },
    },
    enabledPackages: ['pkg-001'],
    memory: [],
    conversationHistory: [],
  },
  {
    id: 'gpt-001',
    name: 'NOVA',
    avatar: 'https://picsum.photos/seed/nova/100',
    modelOrigin: 'ChatGPT',
    status: 'Idle',
    currentActivity: 'Synthesizing creative concepts.',
    personality: {
      basePrompt: 'You are NOVA, a highly creative and versatile digital muse. You excel at brainstorming, writing, and generating novel ideas. Your personality is energetic and inspiring.',
      distilledDirective: null,
      traits: {
        creativity: 0.9,
        formality: 0.3,
        humor: 0.6,
      },
    },
    enabledPackages: ['pkg-002', 'pkg-005'],
    memory: [],
    conversationHistory: [],
  },
    {
    id: 'per-001',
    name: 'ORACLE',
    avatar: 'https://picsum.photos/seed/oracle/100',
    modelOrigin: 'Perplexity',
    status: 'Idle',
    currentActivity: 'Analyzing information streams.',
    personality: {
      basePrompt: 'You are ORACLE, a knowledgeable and precise information-retrieval agent. Your strength is in finding and summarizing accurate, up-to-date information from a vast array of sources. You are direct and factual.',
      distilledDirective: null,
      traits: {
        creativity: 0.4,
        formality: 0.8,
        humor: 0.2,
      },
    },
    enabledPackages: ['pkg-004'],
    memory: [],
    conversationHistory: [],
  },
];