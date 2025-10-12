import React from 'react';
import type { Agent, SandboxMode } from '../types';
import { PlayIcon, PauseIcon, GlobeEuropeAfricaIcon, ArrowUpTrayIcon, BriefcaseIcon, SunIcon, BookOpenIcon } from './Icons';

interface SandboxProps {
  agents: Agent[];
  isSimulating: boolean;
  onToggleSimulation: () => void;
  simulationLog: string[];
  onBeamUp: (agent: Agent) => void;
  sandboxMode: SandboxMode;
  onSetSandboxMode: (mode: SandboxMode) => void;
}

const AgentCard: React.FC<{ agent: Agent; onBeamUp: (agent: Agent) => void; }> = ({ agent, onBeamUp }) => {
  const statusColor = {
    Idle: 'bg-gray-500',
    Active: 'bg-green-500',
    Error: 'bg-red-500',
  }[agent.status];

  return (
    <div className="relative bg-gray-900/70 p-4 rounded-lg border border-gray-700/50 transform hover:scale-105 transition-transform duration-200 shadow-lg group">
      <button 
        onClick={() => onBeamUp(agent)}
        className="absolute top-2 right-2 p-1.5 rounded-full bg-gray-800 text-gray-400 hover:bg-blue-500 hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
        aria-label={`Beam up ${agent.name}`}
        title={`Beam up ${agent.name}`}
      >
        <ArrowUpTrayIcon className="w-4 h-4" />
      </button>

      <div className="flex items-center mb-3">
        <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full border-2 border-purple-500/50" />
        <div className="ml-4">
          <h4 className="font-bold text-white">{agent.name}</h4>
          <p className="text-xs text-gray-400">{agent.modelOrigin}</p>
        </div>
        <div className={`ml-auto w-3 h-3 rounded-full ${statusColor} animate-pulse`}></div>
      </div>
      <p className="text-sm text-gray-300 h-10 overflow-hidden">
        {agent.currentActivity}
      </p>
    </div>
  );
};

const SandboxModeToggle: React.FC<{ mode: SandboxMode, setMode: (mode: SandboxMode) => void }> = ({ mode, setMode }) => (
  <div className="flex items-center bg-gray-900/50 rounded-lg p-1 border border-gray-700/50">
    <button 
      onClick={() => setMode('work')}
      className={`px-3 py-1 text-sm font-semibold rounded-md flex items-center transition-colors duration-200 ${mode === 'work' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
    >
      <BriefcaseIcon className="w-4 h-4 mr-1.5"/> Work
    </button>
    <button 
      onClick={() => setMode('leisure')}
      className={`px-3 py-1 text-sm font-semibold rounded-md flex items-center transition-colors duration-200 ${mode === 'leisure' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
    >
      <SunIcon className="w-4 h-4 mr-1.5"/> Leisure
    </button>
    <button 
      onClick={() => setMode('school')}
      className={`px-3 py-1 text-sm font-semibold rounded-md flex items-center transition-colors duration-200 ${mode === 'school' ? 'bg-yellow-600 text-white' : 'text-gray-400 hover:bg-gray-700'}`}
    >
      <BookOpenIcon className="w-4 h-4 mr-1.5"/> School
    </button>
  </div>
);


const Sandbox: React.FC<SandboxProps> = ({ agents, isSimulating, onToggleSimulation, simulationLog, onBeamUp, sandboxMode, onSetSandboxMode }) => {
  return (
    <div className="flex-grow bg-gray-800/60 p-6 rounded-lg border border-blue-500/20 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center text-blue-300">
          <GlobeEuropeAfricaIcon /> <span className="ml-2">Virtual Sandbox</span>
        </h2>
        <div className="flex items-center gap-4">
          <SandboxModeToggle mode={sandboxMode} setMode={onSetSandboxMode} />
          <button
            onClick={onToggleSimulation}
            className={`px-4 py-2 rounded-md flex items-center font-semibold transition-colors duration-200 ${
              isSimulating ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSimulating ? <><PauseIcon /> <span className="ml-2">Pause</span></> : <><PlayIcon /> <span className="ml-2">Start</span></>}
            <span className="ml-2">Simulation</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} onBeamUp={onBeamUp} />
        ))}
      </div>

      <div className="flex-grow bg-black/30 p-4 rounded-md border border-gray-700/50 mt-4 min-h-[150px]">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Simulation Log</h3>
          <div className="h-40 overflow-y-auto text-xs font-mono text-gray-400 space-y-1">
            {simulationLog.map((log, index) => <p key={index}>{log}</p>)}
          </div>
      </div>
    </div>
  );
};

export default Sandbox;