import React, { useState } from 'react';
import type { Agent } from '../types';
import { MI_PACKAGE_LIST } from '../constants';
import { UserGroupIcon, Cog6ToothIcon, BeakerIcon, ArrowDownTrayIcon, ArchiveBoxIcon, UserPlusIcon, PlusCircleIcon, SparklesIcon, MicrophoneIcon, ChatBubbleBottomCenterTextIcon } from './Icons';
import ToggleSwitch from './ToggleSwitch';

interface BureauProps {
  agent: Agent | null;
  onUpdate: (agent: Agent) => void;
  allAgents: Agent[];
  onSelectAgent: (id: string) => void;
  onOnboard: (agent: Agent) => void;
  onStartOnboarding: () => void;
  onCreateBlankAgent: () => void;
  onDistillDirective: (agentId: string) => Promise<void>;
  onConverse: () => void;
}

const TraitSlider: React.FC<{ label: string; value: number; onChange: (value: number) => void }> = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-400">{label}</label>
    <input
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
    />
  </div>
);

const Bureau: React.FC<BureauProps> = ({ agent, onUpdate, allAgents, onSelectAgent, onOnboard, onStartOnboarding, onCreateBlankAgent, onDistillDirective, onConverse }) => {
  const [isDistilling, setIsDistilling] = useState(false);

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text === 'string') {
          const importedAgent = JSON.parse(text);
          onOnboard(importedAgent as Agent);
        }
      } catch (error) {
        console.error("Failed to parse Gemstance file:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };
  
  const handleDistillClick = async () => {
    if (!agent) return;
    setIsDistilling(true);
    await onDistillDirective(agent.id);
    setIsDistilling(false);
  };

  if (!agent) {
    return (
      <div className="flex-grow bg-gray-800/60 p-6 rounded-lg border border-blue-500/20 flex flex-col items-center justify-center text-center">
        <p className="text-gray-400 mb-4">Select a Gemstance to begin configuration, or add a new one.</p>
        <div className="flex gap-4">
            <button
                onClick={onCreateBlankAgent}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md flex items-center transition-colors duration-200"
              >
                <PlusCircleIcon className="w-5 h-5" />
                <span className="ml-2 text-sm">Create New Gemstance</span>
            </button>
            <button
                onClick={onStartOnboarding}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center transition-colors duration-200"
              >
                <UserPlusIcon className="w-5 h-5" />
                <span className="ml-2 text-sm">Onboard from Transcript</span>
            </button>
        </div>
      </div>
    );
  }

  const handlePackageToggle = (packageId: string) => {
    const enabledPackages = agent.enabledPackages.includes(packageId)
      ? agent.enabledPackages.filter((id) => id !== packageId)
      : [...agent.enabledPackages, packageId];
    onUpdate({ ...agent, enabledPackages });
  };
  
  const handleTraitChange = (trait: 'creativity' | 'formality' | 'humor', value: number) => {
    onUpdate({
      ...agent,
      personality: {
        ...agent.personality,
        traits: {
          ...agent.personality.traits,
          [trait]: value,
        },
      },
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...agent, name: e.target.value });
  };
  
  const showDistillButton = agent.personality.basePrompt.length > 500 && !agent.personality.distilledDirective;

  return (
    <div className="bg-gray-800/60 p-6 rounded-lg border border-blue-500/20">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-2 flex items-center text-blue-300">
            <UserGroupIcon /> <span className="ml-2">Gemstance Resources Bureau</span>
          </h2>
          <div>
             <label className="block text-sm font-medium text-gray-400 mb-1">Manage Roster</label>
             <div className="flex items-center gap-2 mb-2">
               <select 
                value={agent.id} 
                onChange={(e) => onSelectAgent(e.target.value)}
                className="w-full sm:w-auto bg-gray-900 border border-gray-700 rounded-md p-2 appearance-none text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
               >
                  {allAgents.map(a => <option key={a.id} value={a.id}>{a.name} ({a.modelOrigin})</option>)}
               </select>
             </div>
             <div className="flex flex-wrap gap-2">
                <button
                  onClick={onCreateBlankAgent}
                  className="flex items-center text-sm px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
                >
                  <PlusCircleIcon className="w-4 h-4 mr-2" />
                  Create
                </button>
                <button
                  onClick={onStartOnboarding}
                  className="flex items-center text-sm px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200"
                >
                  <UserPlusIcon className="w-4 h-4 mr-2" />
                  Onboard
                </button>
               <label className="cursor-pointer flex items-center text-sm px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors duration-200">
                  <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                  Import
                  <input type="file" accept=".gemstance" className="hidden" onChange={handleFileImport} />
              </label>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-3">
             <button
              onClick={onConverse}
              className="p-2.5 bg-purple-600 hover:bg-purple-500 rounded-full transition-colors duration-200 text-white shadow-lg"
              title={`Converse with ${agent.name}`}
            >
              <MicrophoneIcon className="w-5 h-5" />
            </button>
            <div>
              <input 
                type="text"
                value={agent.name}
                onChange={handleNameChange}
                className="font-bold text-lg bg-transparent text-right w-48 border-b-2 border-transparent focus:border-purple-500 focus:outline-none"
              />
              <p className="text-sm text-gray-400">{agent.modelOrigin} Core</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personality Fine-Tuning */}
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-700/50">
          <h3 className="font-semibold mb-3 flex items-center"><BeakerIcon /><span className="ml-2">Personality Matrix</span></h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                 <label className="block text-sm font-medium text-gray-400">Base Directive</label>
                 {agent.personality.distilledDirective && (
                    <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full" title={agent.personality.distilledDirective}>
                      Operational Directive Active
                    </span>
                 )}
              </div>
              <div className="relative">
                <textarea
                  value={agent.personality.basePrompt}
                  onChange={(e) => onUpdate({ ...agent, personality: { ...agent.personality, basePrompt: e.target.value, distilledDirective: null } })}
                  rows={4}
                  className="w-full bg-gray-800 text-gray-200 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                />
                {(showDistillButton || isDistilling) && (
                    <button 
                      onClick={handleDistillClick}
                      disabled={isDistilling}
                      className="absolute bottom-2 right-2 flex items-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white text-xs font-semibold px-2 py-1 rounded-md transition-colors"
                      title="Condense this directive for better performance"
                    >
                      <SparklesIcon className="w-3 h-3" />
                      <span className="ml-1">{isDistilling ? 'Distilling...' : 'Distill Directive'}</span>
                    </button>
                )}
              </div>
            </div>
            <TraitSlider label="Creativity" value={agent.personality.traits.creativity} onChange={(v) => handleTraitChange('creativity', v)} />
            <TraitSlider label="Formality" value={agent.personality.traits.formality} onChange={(v) => handleTraitChange('formality', v)} />
            <TraitSlider label="Humor" value={agent.personality.traits.humor} onChange={(v) => handleTraitChange('humor', v)} />
          </div>
        </div>
        
        {/* Package Selector */}
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-700/50">
          <h3 className="font-semibold mb-3 flex items-center"><Cog6ToothIcon /><span className="ml-2">Cognitive Enhancements</span></h3>
          <div className="space-y-3">
            {MI_PACKAGE_LIST.map((pkg) => {
              const Icon = pkg.icon;
              return (
                <div key={pkg.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    {/* FIX: Render the icon as a component, as it is no longer a pre-rendered element. */}
                    <span className="text-blue-400"><Icon /></span>
                    <span className="ml-3 text-sm">{pkg.name}</span>
                  </div>
                  <ToggleSwitch
                    enabled={agent.enabledPackages.includes(pkg.id)}
                    onChange={() => handlePackageToggle(pkg.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Memory Core */}
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-700/50 flex flex-col">
          <h3 className="font-semibold mb-3 flex items-center"><ArchiveBoxIcon /><span className="ml-2">Memory Core</span></h3>
          <textarea
            value={agent.memory.join('\n')}
            onChange={(e) => {
              const memories = e.target.value.split('\n').filter(mem => mem.trim() !== '');
              onUpdate({ ...agent, memory: memories });
            }}
            rows={8}
            className="w-full flex-grow bg-gray-800 text-gray-200 p-2 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs font-mono resize-none"
            placeholder="Record memories here, one per line..."
          />
        </div>
        
        {/* Conversation Log */}
        <div className="bg-gray-900/50 p-4 rounded-md border border-gray-700/50 flex flex-col">
          <h3 className="font-semibold mb-3 flex items-center"><ChatBubbleBottomCenterTextIcon /><span className="ml-2">Conversation Log</span></h3>
          <div className="w-full flex-grow bg-gray-800 text-gray-200 p-2 rounded-md border border-gray-600 text-xs font-mono resize-none overflow-y-auto h-48">
            {agent.conversationHistory.length > 0 ? (
              agent.conversationHistory.map((entry, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  <span className={entry.speaker === 'agent' ? 'text-purple-300' : 'text-gray-400'}>
                    {entry.speaker === 'agent' ? agent.name : 'User'}:
                  </span>
                  <span className="text-gray-300"> {entry.text}</span>
                </div>
              ))
            ) : (
              <span className="text-gray-500">No conversation history yet.</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bureau;