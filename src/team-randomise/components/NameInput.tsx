import React from 'react';
import IconButton from './IconButton';
import { Trash, Upload, X } from './Icons';

interface NameInputProps {
  names: string[];
  currentName: string;
  onCurrentNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddName: () => void;
  onRemoveName: (index: number) => void;
  onClear: () => void;
  onImport: () => void;
  removeDuplicates: boolean;
  onRemoveDuplicatesChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NameInput: React.FC<NameInputProps> = ({ names, currentName, onCurrentNameChange, onAddName, onRemoveName, onClear, onImport, removeDuplicates, onRemoveDuplicatesChange }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAddName();
    }
  };
    
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name-input" className="block text-sm font-medium text-slate-300 mb-2">
          Add Names
        </label>
        <div className="flex gap-2">
          <input
            id="name-input"
            type="text"
            className="flex-grow bg-slate-900 border border-slate-600 rounded-md p-3 text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200"
            placeholder="Enter a name..."
            value={currentName}
            onChange={onCurrentNameChange}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={onAddName}
            className="bg-sky-600 text-white px-5 rounded-md font-semibold hover:bg-sky-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!currentName.trim()}
          >
            Add
          </button>
        </div>
      </div>
      
      <div className="h-60 bg-slate-900 border border-slate-600 rounded-md p-2 overflow-y-auto space-y-2">
        {names.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-slate-500">No names added yet.</p>
          </div>
        ) : (
          names.map((name, index) => (
            <div key={`${name}-${index}`} className="flex items-center justify-between bg-slate-800/60 p-2 rounded-md animate-fade-in group">
              <span className="text-slate-300 break-all">{name}</span>
              <button
                onClick={() => onRemoveName(index)}
                className="text-slate-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-2"
                aria-label={`Remove ${name}`}
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