import React, { useState, useCallback, useEffect, useRef } from 'react';
// FIX: 'Agent' is a type and should be imported from './types'.
import type { Agent, SandboxMode, ConversationEntry } from './types';
import { MI_PACKAGE_LIST, INITIAL_AGENTS } from './constants';
import { updateAgentActivity, distillDirective } from './geminiService';
import Header from './Header';
import Armoire from './Armoire';
import Bureau from './Bureau';
import Sandbox from './Sandbox';
import OnboardingWizard from './OnboardingWizard';
import HelpModal from './HelpModal';
import ConverseModal from './ConverseModal';

const App: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(() => {
    try {
      const savedAgents = localStorage.getItem('gemstance-agents');
      if (savedAgents) {
        // Basic validation to ensure it's an array
        const parsed = JSON.parse(savedAgents);
        if (Array.isArray(parsed)) {
          // Ensure loaded agents have the memory property
          return parsed.map(agent => ({ 
            ...agent, 
            memory: agent.memory || [],
            conversationHistory: agent.conversationHistory || [],
            personality: {
              ...agent.personality,
              distilledDirective: agent.personality.distilledDirective || null
            }
          }));
        }
      }
    } catch (error) {
      console.error("Failed to parse agents from localStorage", error);
      // If parsing fails, fall back to initial agents
    }
    return INITIAL_AGENTS;
  });
  
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>('gem-001');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [sandboxMode, setSandboxMode] = useState<SandboxMode>('work');
  const [simulationLog, setSimulationLog] = useState<string[]>(() => {
    try {
      const savedLog = localStorage.getItem('gemstance-simulation-log');
      if (savedLog) {
        const parsed = JSON.parse(savedLog);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (error) {
      console.error("Failed to parse simulation log from localStorage", error);
    }
    return [];
  });
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showConverseModal, setShowConverseModal] = useState(false);


  const simulationIntervalRef = useRef<number | null>(null);

  const selectedAgent = agents.find(agent => agent.id === selectedAgentId) || null;

  // Save agent state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('gemstance-agents', JSON.stringify(agents));
    } catch (error) {
      console.error("Failed to save agents to localStorage", error);
    }
  }, [agents]);

  // Save simulation log to localStorage whenever it changes
  useEffect(() => {
    try {
      // Limit saved log to prevent excessive localStorage usage
      localStorage.setItem('gemstance-simulation-log', JSON.stringify(simulationLog.slice(0, 100)));
    } catch (error) {
      console.error("Failed to save simulation log to localStorage", error);
    }
  }, [simulationLog]);

  const handleAgentUpdate = useCallback((updatedAgent: Agent) => {
    setAgents(prevAgents =>
      prevAgents.map(agent => (agent.id === updatedAgent.id ? updatedAgent : agent))
    );
  }, []);

  const handleConversationHistoryUpdate = useCallback((history: ConversationEntry[]) => {
    if (!selectedAgentId) return;
    setAgents(prev => 
      prev.map(agent => 
        agent.id === selectedAgentId ? { ...agent, conversationHistory: history } : agent
      )
    );
  }, [selectedAgentId]);

  const handleStartOnboarding = () => setShowOnboardingWizard(true);
  const handleCancelOnboarding = () => setShowOnboardingWizard(false);

  const handleCreateBlankAgent = useCallback(() => {
    const newAgent: Agent = {
      id: `gem-${Date.now()}`,
      name: 'Untitled Gemstance',
      avatar: `https://picsum.photos/seed/untitled${Date.now()}/100`,
      modelOrigin: 'Gemini',
      status: 'Idle',
      currentActivity: 'Awaiting configuration.',
      personality: {
        basePrompt: '',
        distilledDirective: null,
        traits: { creativity: 0.5, formality: 0.5, humor: 0.5 },
      },
      enabledPackages: [],
      memory: [],
      conversationHistory: [],
    };
    setAgents(prev => [...prev, newAgent]);
    setSelectedAgentId(newAgent.id);
    log(`Created new blank Gemstance: ${newAgent.name}`);
  }, []);

  const handleCompleteOnboarding = useCallback((newAgentData: Omit<Agent, 'id' | 'status' | 'currentActivity' | 'enabledPackages' | 'conversationHistory'>) => {
    const newAgent: Agent = {
      ...(newAgentData as Omit<Agent, 'id' | 'status' | 'currentActivity' | 'enabledPackages' | 'conversationHistory' | 'memory'> & { memory: string[] }), // type assertion to satisfy TS
      id: `gem-${Date.now()}`,
      status: 'Idle',
      currentActivity: 'Awaiting initial simulation.',
      enabledPackages: [],
      conversationHistory: [],
      personality: {
        ...(newAgentData as any).personality, // Hack to get around complex type omit
        distilledDirective: null,
      }
    };
    setAgents(prev => [...prev, newAgent]);
    setSelectedAgentId(newAgent.id);
    setShowOnboardingWizard(false);
    log(`Successfully onboarded new Gemstance: ${newAgent.name}`);
  }, []);

  const log = useCallback((message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setSimulationLog(prev => [`[${timestamp}] ${message}`, ...prev.slice(0, 100)]);
  }, []);

  const handleBeamUpAgent = useCallback((agentToBeam: Agent) => {
    try {
      const agentJson = JSON.stringify(agentToBeam, null, 2);
      const blob = new Blob([agentJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${agentToBeam.name.toLowerCase().replace(/\s/g, '_')}.gemstance`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      log(`Beamed up ${agentToBeam.name}. Manifest created.`);
    } catch (error) {
      console.error("Failed to beam up agent:", error);
      log(`Error beaming up ${agentToBeam.name}.`);
    }
  }, [log]);

  const handleOnboardAgent = useCallback((onboardedAgent: Agent) => {
    if (!onboardedAgent.id || !onboardedAgent.name || !onboardedAgent.personality) {
      log(`Onboarding failed: Invalid Gemstance file.`);
      return;
    }
    
    const agentWithDefaults = {
      ...onboardedAgent,
      memory: onboardedAgent.memory || [],
      conversationHistory: onboardedAgent.conversationHistory || [],
    };
    
    setAgents(prevAgents => {
      const existingAgentIndex = prevAgents.findIndex(a => a.id === onboardedAgent.id);
      if (existingAgentIndex !== -1) {
        log(`Gemstance ${onboardedAgent.name} has returned, updating records.`);
        const newAgents = [...prevAgents];
        newAgents[existingAgentIndex] = agentWithDefaults;
        return newAgents;
      } else {
        log(`New Gemstance ${onboardedAgent.name} onboarded.`);
        return [...prevAgents, agentWithDefaults];
      }
    });
    setSelectedAgentId(onboardedAgent.id);
  }, [log]);


 const handleDistillDirective = useCallback(async (agentId: string) => {
    const agentToDistill = agents.find(a => a.id === agentId);
    if (!agentToDistill) return;

    log(`Distilling directive for ${agentToDistill.name}...`);
    try {
      const distilled = await distillDirective(agentToDistill.personality.basePrompt);
      setAgents(prev => prev.map(a => 
        a.id === agentId 
          ? { ...a, personality: { ...a.personality, distilledDirective: distilled } }
          : a
      ));
      log(`Successfully created Operational Directive for ${agentToDistill.name}.`);
    } catch (error) {
      console.error("Failed to distill directive:", error);
      log(`Error distilling directive for ${agentToDistill.name}.`);
    }
  }, [agents, log]);

  const runSimulationTick = useCallback(async () => {
    log(`Running ${sandboxMode} simulation tick...`);
    // Create a stable copy of agents for the async operations
    const currentAgents = [...agents];
    for (const agent of currentAgents) {
      if (Math.random() > 0.5) { // Randomly update agents to make it feel more organic
        try {
          const newActivity = await updateAgentActivity(agent, sandboxMode);
          setAgents(prev => prev.map(a => a.id === agent.id ? { 
              ...a, 
              status: 'Active', 
              currentActivity: newActivity,
              memory: [...a.memory, newActivity].slice(-20) // Add to memory, keep last 20
            } : a));
          log(`Updated activity for ${agent.name}: ${newActivity}`);
        } catch (error) {
          console.error(`Failed to update activity for ${agent.name}:`, error);
          log(`Error updating ${agent.name}.`);
          setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, status: 'Error' } : a));
        }
      }
    }
  }, [agents, log, sandboxMode]);

  useEffect(() => {
    if (isSimulating) {
      log(`Starting virtual sandbox simulation in ${sandboxMode} mode.`);
      runSimulationTick(); // run once immediately
      simulationIntervalRef.current = window.setInterval(runSimulationTick, 10000);
    } else {
      if (simulationIntervalRef.current) {
        log('Pausing virtual sandbox simulation.');
        clearInterval(simulationIntervalRef.current);
        simulationIntervalRef.current = null;
      }
    }

    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSimulating, runSimulationTick]); // Added runSimulationTick to dependency array
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header onHelpClick={() => setShowHelpModal(true)} />
      <main className="flex flex-col lg:flex-row p-4 gap-4">
        <Armoire packages={MI_PACKAGE_LIST} />
        <div className="flex-grow flex flex-col gap-4">
          <Bureau
            agent={selectedAgent}
            onUpdate={handleAgentUpdate}
            allAgents={agents}
            onSelectAgent={setSelectedAgentId}
            onOnboard={handleOnboardAgent}
            onStartOnboarding={handleStartOnboarding}
            onCreateBlankAgent={handleCreateBlankAgent}
            onDistillDirective={handleDistillDirective}
            onConverse={() => setShowConverseModal(true)}
          />
          <Sandbox
            agents={agents}
            isSimulating={isSimulating}
            onToggleSimulation={() => setIsSimulating(prev => !prev)}
            simulationLog={simulationLog}
            onBeamUp={handleBeamUpAgent}
            sandboxMode={sandboxMode}
            onSetSandboxMode={setSandboxMode}
            showShockFactor={selectedAgent?.enabledPackages.includes('pkg-007')}
          />
        </div>
      </main>
      {showOnboardingWizard && (
        <OnboardingWizard
          onClose={handleCancelOnboarding}
          onComplete={handleCompleteOnboarding}
        />
      )}
      {showHelpModal && <HelpModal onClose={() => setShowHelpModal(false)} />}
      {showConverseModal && selectedAgent && (
        <ConverseModal 
          agent={selectedAgent}
          onClose={() => setShowConverseModal(false)}
          onUpdateHistory={handleConversationHistoryUpdate}
        />
      )}
    </div>
  );
};

export default App;