import React, { useState, useRef } from 'react';
import type { Team } from './types';
import NameInput from './components/NameInput';
import TeamConfig from './components/TeamConfig';
import TeamDisplay from './components/TeamDisplay';
import { AlertTriangle, CheckCircle } from './components/Icons';

const App: React.FC = () => {
  const [names, setNames] = useState<string[]>([]);
  const [currentName, setCurrentName] = useState<string>('');
  const [numTeams, setNumTeams] = useState<string>('2');
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleAddName = () => {
    const newName = currentName.trim();
    if (newName === '') return;

    if (removeDuplicates && names.map(n => n.toLowerCase()).includes(newName.toLowerCase())) {
        // Silently ignore duplicate if option is checked
        setCurrentName('');
        return;
    }
    
    setNames([...names, newName]);
    setCurrentName('');
    clearMessages();
  };

  const handleRemoveName = (indexToRemove: number) => {
    setNames(names.filter((_, index) => index !== indexToRemove));
    clearMessages();
  };

  const handleRandomize = () => {
    clearMessages();
    const effectiveNames = removeDuplicates ? [...new Set(names)] : names;

    if (effectiveNames.length < 2) {
      setError('Please enter at least two unique names.');
      return;
    }
    const numberOfTeams = parseInt(numTeams, 10);
    if (isNaN(numberOfTeams) || numberOfTeams < 2) {
      setError('Number of teams must be at least 2.');
      return;
    }
    if (numberOfTeams > effectiveNames.length) {
      setError('The number of teams cannot exceed the number of names.');
      return;
    }

    // Fisher-Yates shuffle algorithm
    const shuffledNames = [...effectiveNames];
    for (let i = shuffledNames.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
    }

    const newTeams: Team[] = Array.from({ length: numberOfTeams }, (_, i) => ({
      name: `Team ${i + 1}`,
      members: [],
    }));

    shuffledNames.forEach((name, index) => {
      newTeams[index % numberOfTeams].members.push(name);
    });

    setTeams(newTeams);
    setSuccess('Teams successfully randomized!');
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearMessages();
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      let importedNames = text.split(/[\n,]/).map(name => name.trim()).filter(Boolean);
      if (removeDuplicates) {
        const lowerCaseNames = names.map(n => n.toLowerCase());
        const uniqueImported = [...new Set(importedNames)];
        const newNames = uniqueImported.filter(n => !lowerCaseNames.includes(n.toLowerCase()));
        setNames([...names, ...newNames]);
      } else {
        setNames([...names, ...importedNames]);
      }
      setSuccess('Names imported successfully.');
    };
    reader.onerror = () => {
        setError('Failed to read the file.');
    }
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
  };
  
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleExport = () => {
    clearMessages();
    if (teams.length === 0) {
      setError('No teams to export. Please randomize first.');
      return;
    }

    let csvContent = 'Team Name,Member Name\n';
    teams.forEach(team => {
      team.members.forEach(member => {
        const teamName = `"${team.name.replace(/"/g, '""')}"`;
        const memberName = `"${member.replace(/"/g, '""')}"`;
        csvContent += `${teamName},${memberName}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'teams.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccess('Teams exported successfully.');
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
            Team Randomiser
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Effortlessly create 'fair' and random teams.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
            <h2 className="text-2xl font-semibold text-sky-300 mb-4 border-b border-slate-600 pb-2">
              1. Setup
            </h2>

            <NameInput
              names={names}
              currentName={currentName}
              onCurrentNameChange={(e) => setCurrentName(e.target.value)}
              onAddName={handleAddName}
              onRemoveName={handleRemoveName}
              onClear={() => { setNames([]); setTeams([]); clearMessages(); }}
              onImport={triggerFileInput}
              removeDuplicates={removeDuplicates}
              onRemoveDuplicatesChange={(e) => setRemoveDuplicates(e.target.checked)}
            />
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              className="hidden"
              accept=".txt,.csv"
            />
            
            <TeamConfig
              numTeams={numTeams}
              onNumTeamsChange={(e) => { setNumTeams(e.target.value); clearMessages(); }}
              onRandomize={handleRandomize}
            />
            
            {error && (
              <div className="mt-4 p-3 rounded-md bg-red-900/50 text-red-300 border border-red-700 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
            
            {success && (
              <div className="mt-4 p-3 rounded-md bg-green-900/50 text-green-300 border border-green-700 flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <span>{success}</span>
              </div>
            )}

          </div>

          <div className="mt-8 lg:mt-0 bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
             <TeamDisplay teams={teams} onExport={handleExport} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;