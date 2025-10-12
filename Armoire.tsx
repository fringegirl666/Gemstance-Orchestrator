import React from 'react';
import type { MIPackage } from '../types';
import { CubeTransparentIcon } from './Icons';

interface ArmoireProps {
  packages: MIPackage[];
}

const Armoire: React.FC<ArmoireProps> = ({ packages }) => {
  return (
    <aside className="lg:w-64 xl:w-72 bg-gray-800/60 p-4 rounded-lg border border-blue-500/20 shrink-0">
      <h2 className="text-lg font-semibold mb-4 flex items-center text-blue-300">
        <CubeTransparentIcon />
        <span className="ml-2">MI Package Armoire</span>
      </h2>
      <div className="space-y-4">
        {packages.map((pkg) => {
          const Icon = pkg.icon;
          return (
            <div key={pkg.id} className="p-3 bg-gray-900/50 rounded-md border border-gray-700/50 hover:bg-gray-800/80 transition-colors duration-200">
              <div className="flex items-center mb-1">
                {/* FIX: Render the icon as a component, as it is no longer a pre-rendered element. */}
                <span className="text-blue-400"><Icon /></span>
                <h3 className="ml-2 font-bold text-sm text-gray-100">{pkg.name}</h3>
              </div>
              <p className="text-xs text-gray-400">{pkg.description}</p>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default Armoire;