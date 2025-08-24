
import React from 'react';

interface TeamConfigProps {
  numTeams: string;
  onNumTeamsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRandomize: () => void;
  generationMethod: 'random' | 'skill';
  onGenerationMethodChange: (method: 'random' | 'skill') => void;
}

const TeamConfig: React.FC<TeamConfigProps> = ({ numTeams, onNumTeamsChange, onRandomize, generationMethod, onGenerationMethodChange }) => {
  return (
    <div className="mt-6 space-y-4">
       <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
            Generation Method
        </label>
        <div className="flex w-full rounded-md bg-slate-900 border border-slate-600 p-1 space-x-1">
            <button 
                onClick={() => onGenerationMethodChange('random')} 
                className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors duration-200 ${generationMethod === 'random' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700'}`}
                aria-pressed={generationMethod === 'random'}
            >
                Random
            </button>
            <button 
                onClick={() => onGenerationMethodChange('skill')} 
                className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors duration-200 ${generationMethod === 'skill' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700'}`}
                aria-pressed={generationMethod === 'skill'}
            >
                Skill-Based
            </button>
        </div>
      </div>
      <div>
        <label htmlFor="numTeams" className="block text-sm font-medium text-slate-300 mb-2">
          Number of Teams
        </label>
        <input
          type="number"
          id="numTeams"
          min="2"
          className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200 disabled:bg-slate-800 disabled:cursor-not-allowed disabled:text-slate-500"
          value={numTeams}
          onChange={onNumTeamsChange}
          disabled={generationMethod === 'skill'}
          aria-disabled={generationMethod === 'skill'}
        />
      </div>
      <button
        onClick={onRandomize}
        className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-500/50"
      >
        <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m8-8h2M4 12H2m15.364 6.364l1.414 1.414M4.222 4.222l1.414 1.414m12.728 0l-1.414 1.414M5.636 18.364l-1.414 1.414M12 16a4 4 0 110-8 4 4 0 010 8z" />
        </svg>
        Generate Teams
      </button>
    </div>
  );
};

export default TeamConfig;
