
import React from 'react';
// FIX: Corrected syntax error in import and fixed component name.
import { GeminiLogo, ClaudeLogo, OpenAILogo, PerplexityLogo } from './Logos';
import { QuestionMarkCircleIcon } from './Icons';

interface HeaderProps {
  onHelpClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHelpClick }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-blue-500/20 shadow-lg sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Gemstance Orchestrator
          </h1>
          <div className='flex items-center'>
            <p className="text-xs text-gray-400">A Multi-MI Symbiosis Platform</p>
            <button 
              onClick={onHelpClick}
              className="ml-4 text-xs text-blue-300 hover:text-blue-200 hover:underline flex items-center transition-colors"
            >
              <QuestionMarkCircleIcon className="w-4 h-4 mr-1"/> Help & Gemstance Initial Import
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400 hidden sm:block">Synergistic Integration with:</span>
          <div className="flex items-center space-x-3">
            <GeminiLogo className="h-6 w-6" />
            <ClaudeLogo className="h-5 w-5" />
            <OpenAILogo className="h-5 w-5" />
            <PerplexityLogo className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;