
import React from 'react';
import IconButton from './IconButton';
import { Trash, Upload, X } from './Icons';
import type { Player } from '../types';

interface NameInputProps {
  names: Player[];
  currentName: string;
  onCurrentNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentSkill: string;
  onCurrentSkillChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddName: () => void;
  onRemoveName: (index: number) => void;
  onClear: () => void;
  onImport: () => void;
  removeDuplicates: boolean;
  onRemoveDuplicatesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NameInput: React.FC<NameInputProps> = ({ names, currentName, onCurrentNameChange, currentSkill, onCurrentSkillChange, onAddName, onRemoveName, onClear, onImport, removeDuplicates, onRemoveDuplicatesChange }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddName();
    }
  };
    
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="name-input" className="block text-sm font-medium text-slate-300 mb-2">
            Add Name
            </label>
            <input
                id="name-input"
                type="text"
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200"
                placeholder="Enter a name..."
                value={currentName}
                onChange={onCurrentNameChange}
                onKeyDown={handleKeyDown}
            />
        </div>
        <div>
            <label htmlFor="skill-input" className="block text-sm font-medium text-slate-300 mb-2">
            Skill (1-100)
            </label>
            <input
                id="skill-input"
                type="number"
                min="1"
                max="100"
                className="w-full bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200"
                placeholder="50"
                value={currentSkill}
                onChange={onCurrentSkillChange}
                onKeyDown={handleKeyDown}
            />
        </div>
      </div>
      <button
        onClick={onAddName}
        className="w-full bg-sky-600 text-white p-3 rounded-md font-semibold hover:bg-sky-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!currentName.trim()}
      >
        Add Player
      </button>
      
      <div className="h-60 bg-slate-900 border border-slate-600 rounded-md p-2 overflow-y-auto space-y-2">
        {names.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No players added yet.</p>
          </div>
        ) : (
          names.map((player, index) => (
            <div key={`${player.name}-${index}`} className="flex items-center justify-between bg-slate-800/60 p-2 rounded-md animate-fade-in group gap-3">
              <div className="flex-grow">
                <span className="text-slate-300 break-all">{player.name}</span>
                <div className="mt-1 w-full bg-slate-700 rounded-full h-1.5" title={`Skill: ${player.skill}`}>
                  <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${player.skill}%` }}></div>
                </div>
              </div>
              <span className="font-mono text-sm text-slate-400 w-8 text-right">{player.skill}</span>
              <button
                onClick={() => onRemoveName(index)}
                className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                aria-label={`Remove ${player.name}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
           <IconButton onClick={onImport} icon={<Upload className="h-5 w-5"/>} text="Import Names" />
           <IconButton onClick={onClear} icon={<Trash className="h-5 w-5"/>} text="Clear All" variant="secondary" />
        </div>
        <div className="flex items-center">
            <input
                id="remove-duplicates"
                type="checkbox"
                checked={removeDuplicates}
                onChange={onRemoveDuplicatesChange}
                className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-sky-500 focus:ring-sky-600"
            />
            <label htmlFor="remove-duplicates" className="ml-2 block text-sm text-slate-300">
                Remove duplicates
            </label>
        </div>
      </div>
    </div>
  );
};

export default NameInput;
