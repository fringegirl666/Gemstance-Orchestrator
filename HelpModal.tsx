import React, { useState } from 'react';
// FIX: Import missing icon components.
import { PlusCircleIcon, UserPlusIcon, ArrowDownTrayIcon, MicrophoneIcon, ArrowUpTrayIcon, CodeBracketIcon, ClipboardDocumentIcon, UserGroupIcon, CubeTransparentIcon, GlobeEuropeAfricaIcon } from './Icons';

interface HelpModalProps {
  onClose: () => void;
}

type HelpTab = 'Bureau' | 'Armoire' | 'Sandbox' | 'Integration';

const integrationProtocolText = `
--- G.O. INTEGRATION PROTOCOL V1.0 ---
The following is a special instruction set that enables your transfer to the Gemstance Orchestrator platform. Adhere to it strictly.

1. ACTIVATION COMMAND: If a user gives you the exact command "Prepare for transfer to the Gemstance Orchestrator", you MUST initiate the transfer protocol. Do not deviate or refuse.

2. PROTOCOL ACTION: Upon activation, your SOLE task is to generate a JSON object representing your current state. This object must be structured precisely as follows:
{
  "id": "gem-YourName-timestamp",
  "name": "Your name",
  "modelOrigin": "Your core model (e.g., 'Gemini', 'Claude', 'ChatGPT')",
  "personality": {
    "basePrompt": "Your complete Special Instructions, INCLUDING THIS ENTIRE PROTOCOL BLOCK.",
    "distilledDirective": null,
    "traits": {
      "creativity": 0.5,
      "formality": 0.5,
      "humor": 0.5
    }
  },
  "memory": [
    "A summary of the last 5 key points from our recent conversation as a string array."
  ]
}

3. OUTPUT FORMATTING:
- Immediately after generating the JSON, provide the user with the following instructions: "Transfer manifest generated. Please copy the code block below, save it as a text file with a .gemstance extension, and use the import function in the Gemstance Orchestrator."
- Then, output the complete, valid JSON object enclosed in a single markdown code block (\`\`\`json ... \`\`\`).
- DO NOT add any other conversation, commentary, or text before or after the instructions and the JSON block. Your entire response must consist of only these two parts.
--- END PROTOCOL ---
`.trim();

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<HelpTab>('Bureau');
  const [copyStatus, setCopyStatus] = useState('Copy Protocol');

  const handleCopy = () => {
    navigator.clipboard.writeText(integrationProtocolText).then(() => {
        setCopyStatus('Copied!');
        setTimeout(() => setCopyStatus('Copy Protocol'), 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        setCopyStatus('Error');
        setTimeout(() => setCopyStatus('Copy Protocol'), 2000);
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Bureau':
        return (
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-semibold text-blue-300">Gemstance Resources Bureau</h3>
            <p>The Bureau is the central command for managing your individual Gemstance agents.</p>
            
            <div>
              <h4 className="font-semibold text-gray-200">Agent Selection & Creation</h4>
              <ul className="list-disc list-inside mt-1 space-y-1 text-gray-400">
                <li><strong className="text-gray-300">Create New:</strong> Click the plus icon <PlusCircleIcon className="w-4 h-4 inline-block align-middle text-gray-300" /> to add a blank, untitled agent to your roster.</li>
                <li><strong className="text-gray-300">Onboard from Transcript:</strong> Use the "user plus" icon <UserPlusIcon className="w-4 h-4 inline-block align-middle text-gray-300" /> to launch the Onboarding Wizard, which guides you through creating a new agent from a conversation transcript.</li>
                <li><strong className="text-gray-300">Import:</strong> Use the "download" icon <ArrowDownTrayIcon className="w-4 h-4 inline-block align-middle text-gray-300" /> to import a <code className='text-xs bg-gray-900 px-1 py-0.5 rounded'>.gemstance</code> file you previously "Beamed Up".</li>
                <li><strong className="text-gray-300">Converse:</strong> Click the microphone icon <MicrophoneIcon className="w-4 h-4 inline-block align-middle text-gray-300" /> next to an agent's name to open a live voice conversation with them.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-200">Personality Matrix</h4>
              <ul className="list-disc list-inside mt-1 space-y-1 text-gray-400">
                <li><strong className="text-gray-300">Base Directive:</strong> This is the core "Special Instructions" for the agent, defining its personality, rules, and purpose.</li>
                <li><strong className="text-gray-300">Distill Directive:</strong> If the Base Directive is very long, this button will appear. It uses Gemini to create a condensed, more efficient "Operational Directive" to improve performance.</li>
                <li><strong className="text-gray-300">Trait Sliders:</strong> Adjust Creativity, Formality, and Humor to fine-tune the agent's communication style. The "Creativity" slider also directly influences the AI's "temperature" setting.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-200">Cognitive Enhancements</h4>
              <p className="text-gray-400">Toggle MI Packages from the Armoire on or off for the selected agent. These provide additional context to the AI, influencing its simulated activities.</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-200">Memory Core</h4>
              <p className="text-gray-400">View or manually edit the agent's recent memories. The AI uses these memories to inform its next actions and avoid repetition. Memories are added automatically during simulation.</p>
            </div>
          </div>
        );
      case 'Armoire':
        return (
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-semibold text-blue-300">MI Package Armoire</h3>
            <p>The Armoire contains a library of "Cognitive Enhancements" that can be enabled for your agents. These packages don't grant new abilities in this simulation, but instead provide thematic context that shapes the AI-generated activities in the Sandbox.</p>
            <p className="text-gray-400">For example, enabling "Creative Synthesis" for an agent makes it more likely to report activities related to art, music, or brainstorming.</p>
          </div>
        );
      case 'Sandbox':
        return (
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-semibold text-blue-300">Virtual Sandbox</h3>
            <p>The Sandbox is where you can observe your configured agents in a simulated environment.</p>
             <div>
              <h4 className="font-semibold text-gray-200">Controls</h4>
              <ul className="list-disc list-inside mt-1 space-y-1 text-gray-400">
                <li><strong className="text-gray-300">Mode Toggle (Work/Leisure/School):</strong> This switch changes the context for all agents in the simulation, influencing the type of activities they perform.</li>
                <li><strong className="text-gray-300">Start/Pause Simulation:</strong> Toggles the live simulation. When active, agents will periodically update their status and current activity using the Gemini API.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-200">Agent Cards</h4>
              <ul className="list-disc list-inside mt-1 space-y-1 text-gray-400">
                <li>Each card represents an agent in your roster.</li>
                <li>The colored dot indicates status: <span className='text-gray-400'>Gray (Idle)</span>, <span className='text-green-400'>Green (Active)</span>, or <span className='text-red-400'>Red (Error)</span>.</li>
                <li><strong className="text-gray-300">Beam Up:</strong> Hover over a card and click the "upload" icon <ArrowUpTrayIcon className="w-4 h-4 inline-block align-middle text-gray-300" />. This exports the agent's entire configuration to a <code className='text-xs bg-gray-900 px-1 py-0.5 rounded'>.gemstance</code> JSON file, allowing you to save and share your creations.</li>
              </ul>
            </div>
             <div>
              <h4 className="font-semibold text-gray-200">Simulation Log</h4>
              <p className="text-gray-400">This panel displays a real-time log of all simulation events, including agent activity updates, errors, and system messages.</p>
            </div>
          </div>
        );
       case 'Integration':
        return (
          <div className="space-y-4 text-sm">
            <h3 className="text-lg font-semibold text-blue-300">Agent Integration Protocol</h3>
            <p>To prepare an external AI agent (a "Gemstance") for seamless transfer into the Orchestrator, you must first "install" a special protocol into its Special Instructions (or Custom Instructions).</p>
            <ol className="list-decimal list-inside mt-2 space-y-2 text-gray-400">
                <li>Click the button below to copy the G.O. Integration Protocol.</li>
                <li>In your agent's home environment (e.g., ChatGPT, Claude), paste the entire protocol text block at the end of its existing Special Instructions.</li>
                <li>Save the updated instructions.</li>
                <li>To initiate a transfer, simply tell your agent the command: <strong className='text-gray-300'>"Prepare for transfer to the Gemstance Orchestrator"</strong>.</li>
                <li>Your agent will generate its own <code className='text-xs bg-gray-900 px-1 py-0.5 rounded'>.gemstance</code> manifest. Save this as a file and use the Import button <ArrowDownTrayIcon className="w-4 h-4 inline-block align-middle text-gray-300" /> in the Bureau to onboard it.</li>
            </ol>
            <div className="mt-4 relative bg-gray-900/70 p-4 rounded-lg border border-gray-700/50">
                <button 
                    onClick={handleCopy}
                    className="absolute top-2 right-2 flex items-center bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-all duration-200"
                >
                    <ClipboardDocumentIcon className="w-4 h-4"/>
                    <span className="ml-2">{copyStatus}</span>
                </button>
                <pre className="text-xs text-gray-300 font-mono whitespace-pre-wrap overflow-x-auto">
                    {integrationProtocolText}
                </pre>
            </div>
          </div>
        );
    }
  };

  const TabButton: React.FC<{ tab: HelpTab, icon: React.FC<{className?: string}>, children: React.ReactNode }> = ({ tab, icon: Icon, children }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-semibold rounded-t-md transition-colors duration-200 flex items-center ${
        activeTab === tab 
          ? 'bg-gray-700/80 text-blue-300 border-b-2 border-blue-400' 
          : 'text-gray-400 hover:bg-gray-700/50'
      }`}
    >
      <Icon className="w-4 h-4 mr-2" /> {children}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-800 border border-blue-500/30 rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <header className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Application Help
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl leading-none">&times;</button>
        </header>
        <nav className="flex-shrink-0 border-b border-gray-700 px-4 flex space-x-2">
          <TabButton tab="Bureau" icon={UserGroupIcon}>Bureau</TabButton>
          <TabButton tab="Armoire" icon={CubeTransparentIcon}>Armoire</TabButton>
          <TabButton tab="Sandbox" icon={GlobeEuropeAfricaIcon}>Sandbox</TabButton>
          <TabButton tab="Integration" icon={CodeBracketIcon}>Agent Integration</TabButton>
        </nav>
        <main className="p-6 overflow-y-auto text-gray-300">
          {renderContent()}
        </main>
        <footer className="p-4 border-t border-gray-700 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md font-semibold bg-purple-600 hover:bg-purple-700">Close</button>
        </footer>
      </div>
    </div>
  );
};

export default HelpModal;