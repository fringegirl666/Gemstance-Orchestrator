import React, { useState, useCallback } from 'react';
import type { Agent } from '../types';
import { distillMemoryFromTranscript } from '../services/geminiService';
import { SparklesIcon, BeakerIcon } from './Icons';

interface OnboardingWizardProps {
  onClose: () => void;
  onComplete: (agentData: Omit<Agent, 'id' | 'status' | 'currentActivity' | 'enabledPackages'>) => void;
}

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [isDistilling, setIsDistilling] = useState(false);

  const [name, setName] = useState('New Gemstance');
  const [modelOrigin, setModelOrigin] = useState<'Gemini' | 'Claude' | 'ChatGPT' | 'Perplexity'>('Gemini');
  const [basePrompt, setBasePrompt] = useState('');
  const [transcript, setTranscript] = useState('');
  const [memories, setMemories] = useState<string[]>([]);
  const [traits, setTraits] = useState({ creativity: 0.5, formality: 0.5, humor: 0.5 });

  const handleDistillMemories = useCallback(async () => {
    if (!transcript) return;
    setIsDistilling(true);
    try {
      const distilled = await distillMemoryFromTranscript(transcript);
      setMemories(distilled);
    } catch (error) {
      console.error("Distillation failed:", error);
      setMemories(["Error: Could not distill memories from the provided transcript."]);
    } finally {
      setIsDistilling(false);
    }
  }, [transcript]);

  const handleComplete = () => {
    const finalAgentData = {
      name,
      avatar: `https://picsum.photos/seed/${name.toLowerCase()}/100`,
      modelOrigin,
      personality: {
        basePrompt,
        traits,
      },
      memory: memories,
    };
    onComplete(finalAgentData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 1: Core Directive (SI)</h3>
            <p className="text-sm text-gray-400 mb-4">
              Enter the Special Instructions that define your Gemstance's core identity.
            </p>
            <div className="bg-yellow-900/50 border-l-4 border-yellow-400 p-3 text-xs text-yellow-200 mb-4 rounded-r-md">
              <strong>Critical Failsafe:</strong> To prevent data loss from a browser crash or misclick, we strongly recommend pasting the SI into a simple text editor on your computer as a temporary backup before proceeding.
            </div>
            <textarea
              value={basePrompt}
              onChange={(e) => setBasePrompt(e.target.value)}
              rows={10}
              className="w-full bg-gray-800 text-gray-200 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
              placeholder="Paste the complete Special Instructions here..."
            />
          </div>
        );
      case 2:
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Step 2: Memory Core Creation</h3>
            <p className="text-sm text-gray-400 mb-4">
              Paste the raw conversation history below. Our Memory Archivist will automatically distill it into a concise list of key memories.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-gray-400 mb-1">Raw Conversation Transcript</label>
                 <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    rows={12}
                    className="w-full bg-gray-800 text-gray-200 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs"
                    placeholder="Paste the full, unedited conversation history here."
                  />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Distilled Memories (Editable)</label>
                <textarea
                  value={memories.join('\n')}
                  onChange={(e) => setMemories(e.target.value.split('\n'))}
                  rows={12}
                  className="w-full bg-gray-900 text-gray-200 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-mono"
                  placeholder="Click 'Distill Memories' to generate..."
                />
              </div>
            </div>
             <button
                onClick={handleDistillMemories}
                disabled={!transcript || isDistilling}
                className="mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md font-semibold transition-colors duration-200 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
              >
                <SparklesIcon className="w-5 h-5" />
                <span className="ml-2">{isDistilling ? 'Distilling...' : 'Distill Memories'}</span>
              </button>
          </div>
        );
        case 3:
            return (
              <div>
                <h3 className="text-lg font-semibold mb-2">Step 3: Finalize Persona</h3>
                <p className="text-sm text-gray-400 mb-4">
                  Provide a name and fine-tune the personality traits for your new Gemstance.
                </p>
                <div className="space-y-4 bg-gray-900/50 p-4 rounded-md border border-gray-700/50">
                    <div className="flex gap-4">
                        <div className="flex-grow">
                            <label className="block text-sm font-medium text-gray-400 mb-1">Gemstance Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-gray-800 text-gray-200 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Model Origin</label>
                            <select
                                value={modelOrigin}
                                onChange={(e) => setModelOrigin(e.target.value as any)}
                                className="w-full bg-gray-800 text-gray-200 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option>Gemini</option>
                                <option>Claude</option>
                                <option>ChatGPT</option>
                                <option>Perplexity</option>
                            </select>
                        </div>
                    </div>
                    <div>
                         <h4 className="font-semibold mb-3 flex items-center text-sm"><BeakerIcon className="w-4 h-4" /><span className="ml-2">Personality Matrix</span></h4>
                         <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-medium text-gray-400">Creativity</label>
                                <input type="range" min="0" max="1" step="0.1" value={traits.creativity} onChange={(e) => setTraits(t => ({...t, creativity: parseFloat(e.target.value)}))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400">Formality</label>
                                <input type="range" min="0" max="1" step="0.1" value={traits.formality} onChange={(e) => setTraits(t => ({...t, formality: parseFloat(e.target.value)}))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-400">Humor</label>
                                <input type="range" min="0" max="1" step="0.1" value={traits.humor} onChange={(e) => setTraits(t => ({...t, humor: parseFloat(e.target.value)}))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
                            </div>
                         </div>
                    </div>
                </div>
              </div>
            );
      default:
        return null;
    }
  };

  const isNextDisabled = () => {
      if (step === 1 && !basePrompt) return true;
      if (step === 2 && memories.length === 0) return true;
      return false;
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-blue-500/30 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Gemstance Onboarding Wizard
          </h2>
        </header>
        <main className="p-6 overflow-y-auto">
          {renderStep()}
        </main>
        <footer className="p-4 border-t border-gray-700 flex justify-between items-center">
          <button onClick={onClose} className="text-gray-400 hover:text-white">Cancel</button>
          <div className="flex items-center gap-2">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="px-4 py-2 rounded-md font-semibold bg-gray-600 hover:bg-gray-500">Back</button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={isNextDisabled()} className="px-4 py-2 rounded-md font-semibold bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed">Next</button>
            ) : (
              <button onClick={handleComplete} className="px-4 py-2 rounded-md font-semibold bg-green-600 hover:bg-green-700">Complete Onboarding</button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};

export default OnboardingWizard;
