import React, { useState, useRef } from 'react';
import type { Team, Player } from './types';
import NameInput from './components/NameInput';
import TeamDisplay from './components/TeamDisplay';
import { AlertTriangle, CheckCircle } from './components/Icons';

const App: React.FC = () => {
  const [names, setNames] = useState<Player[]>([]);
  const [currentName, setCurrentName] = useState<string>('');
  const [currentSkill, setCurrentSkill] = useState<string>('50');
  const [teams, setTeams] = useState<Team[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(true);
  const [generationMethod, setGenerationMethod] = useState<'random' | 'skill'>('random');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleAddName = () => {
    clearMessages();
    const newName = currentName.trim();
    if (newName === '') return;

    const skillValue = parseInt(currentSkill, 10);
    if (isNaN(skillValue) || skillValue < 1 || skillValue > 100) {
      setError('Skill level must be a number between 1 and 100.');
      return;
    }

    if (removeDuplicates && names.some(p => p.name.toLowerCase() === newName.toLowerCase())) {
        // Silently ignore duplicate if option is checked
        setCurrentName('');
        return;
    }
    
    setNames([...names, { name: newName, skill: skillValue }]);
    setCurrentName('');
  };

  const handleRemoveName = (indexToRemove: number) => {
    setNames(names.filter((_, index) => index !== indexToRemove));
    clearMessages();
  };

  const handleRandomize = () => {
    clearMessages();
    const effectivePlayers = removeDuplicates 
        ? names.filter((player, index, self) => 
            index === self.findIndex((p) => p.name.toLowerCase() === player.name.toLowerCase())
          ) 
        : names;

    if (effectivePlayers.length < 2) {
      setError('Please enter at least two unique names.');
      return;
    }
    
    const numberOfTeams = 2;

    let newTeams: Team[] = [];

    if (generationMethod === 'skill') {
        const sortedPlayers = [...effectivePlayers].sort((a, b) => b.skill - a.skill);
        const team1: Player[] = [];
        const team2: Player[] = [];
        let team1Skill = 0;
        let team2Skill = 0;

        sortedPlayers.forEach(player => {
            if (team1Skill <= team2Skill) {
                team1.push(player);
                team1Skill += player.skill;
            } else {
                team2.push(player);
                team2Skill += player.skill;
            }
        });
        
        newTeams = [
            { name: 'Team 1', members: team1 },
            { name: 'Team 2', members: team2 }
        ];

    } else { // Random generation
        const shuffledPlayers = [...effectivePlayers];
        for (let i = shuffledPlayers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
        }

        newTeams = Array.from({ length: numberOfTeams }, (_, i) => ({
            name: `Team ${i + 1}`,
            members: [],
        }));

        shuffledPlayers.forEach((player, index) => {
            newTeams[index % numberOfTeams].members.push(player);
        });
    }

    setTeams(newTeams);
    setSuccess('Teams successfully generated!');
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    clearMessages();
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim() !== '');
      const header = lines.shift()?.toLowerCase().split(',').map(h => h.trim());
      
      if (!header || !header.includes('name') || !header.includes('rating')) {
          setError('Invalid CSV format. Header must include "Name" and "Rating".');
          return;
      }

      const nameIndex = header.indexOf('name');
      const ratingIndex = header.indexOf('rating');

      const newPlayers: Player[] = lines.map(line => {
          const values = line.split(',');
          const name = values[nameIndex]?.trim();
          const rating = parseInt(values[ratingIndex]?.trim(), 10);
          
          if (name && !isNaN(rating)) {
              return { name, skill: rating };
          }
          return null;
      }).filter((player): player is Player => player !== null);

      if (removeDuplicates) {
        const lowerCaseNames = names.map(p => p.name.toLowerCase());
        const uniqueImported = newPlayers.filter(p => !lowerCaseNames.includes(p.name.toLowerCase()));
        
        const uniquePlayers = uniqueImported.filter((player, index, self) =>
            index === self.findIndex((p) => p.name.toLowerCase() === player.name.toLowerCase())
        );

        setNames([...names, ...uniquePlayers]);
      } else {
        setNames([...names, ...newPlayers]);
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

  const handleExport = (teamToExport?: Team) => {
    clearMessages();
    const teamsToExport = teamToExport ? [teamToExport] : teams;
    const isSingleTeam = !!teamToExport;

    if (teamsToExport.length === 0) {
      setError('No teams to export. Please generate teams first.');
      return;
    }

    let csvContent = 'Team Name,Member Name,Skill\n';
    teamsToExport.forEach(team => {
      team.members.forEach(member => {
        const teamName = `"${team.name.replace(/"/g, '""')}"`;
        const memberName = `"${member.name.replace(/"/g, '""')}"`;
        csvContent += `${teamName},${memberName},${member.skill}\n`;
      });
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    const fileName = isSingleTeam && teamToExport ? `${teamToExport.name.replace(/[^a-zA-Z0-9_\-]/g, '_')}.csv` : 'teams.csv';
    link.setAttribute('download', fileName);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setSuccess(`Successfully exported ${fileName}.`);
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h3 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
            Last Pick
          </h3>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          <div className="bg-slate-800/50 p-6 rounded-lg shadow-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-sky-300 mb-4 border-b border-slate-600 pb-2">
              1. Setup
            </h2>

            <NameInput
              names={names}
              currentName={currentName}
              onCurrentNameChange={(e) => setCurrentName(e.target.value)}
              currentSkill={currentSkill}
              onCurrentSkillChange={(e) => setCurrentSkill(e.target.value)}
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
            
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Generation Method
                </label>
                <div className="flex w-full rounded-md bg-slate-900 border border-slate-600 p-1 space-x-1">
                    <button 
                        onClick={() => setGenerationMethod('random')}
                        className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors duration-200 ${generationMethod === 'random' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700'}`}
                        aria-pressed={generationMethod === 'random'}
                    >
                        Random
                    </button>
                    <button 
                        onClick={() => setGenerationMethod('skill')}
                        className={`w-1/2 p-2 rounded-md text-sm font-semibold transition-colors duration-200 ${generationMethod === 'skill' ? 'bg-sky-600 text-white shadow' : 'text-slate-300 hover:bg-slate-700'}`}
                        aria-pressed={generationMethod === 'skill'}
                    >
                        Skill-Based
                    </button>
                </div>
              </div>
              <button
                onClick={handleRandomize}
                className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-md shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-sky-500/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m8-8h2M4 12H2m15.364 6.364l1.414 1.414M4.222 4.222l1.414 1.414m12.728 0l-1.414 1.414M5.636 18.364l-1.414 1.414M12 16a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
                Generate Teams
              </button>
            </div>
            
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