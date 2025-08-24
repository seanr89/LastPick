
import React, { useState, useRef } from 'react';
import type { Team, Player } from './types';
import NameInput from './components/NameInput';
import TeamConfig from './components/TeamConfig';
import TeamDisplay from './components/TeamDisplay';
import { AlertTriangle, CheckCircle } from './components/Icons';

const App: React.FC = () => {
  const [names, setNames] = useState<Player[]>([]);
  const [currentName, setCurrentName] = useState<string>('');
  const [currentSkill, setCurrentSkill] = useState<string>('50');
  const [numTeams, setNumTeams] = useState<string>('2');
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
    
    const numberOfTeams = parseInt(numTeams, 10);
    if (isNaN(numberOfTeams) || numberOfTeams < 2) {
      setError('Number of teams must be at least 2.');
      return;
    }
    if (numberOfTeams > effectivePlayers.length) {
      setError('The number of teams cannot exceed the number of names.');
      return;
    }

    let newTeams: Team[] = [];

    if (generationMethod === 'skill') {
        if (numberOfTeams !== 2) {
            setError('Skill-based generation only works for exactly 2 teams.');
            return;
        }
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
      let importedNames = text.split(/[\n,]/).map(name => name.trim()).filter(Boolean);
      
      const newPlayers: Player[] = importedNames.map(name => ({ name, skill: 50 }));

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

  const handleExport = () => {
    clearMessages();
    if (teams.length === 0) {
      setError('No teams to export. Please generate teams first.');
      return;
    }

    let csvContent = 'Team Name,Member Name,Skill\n';
    teams.forEach(team => {
      team.members.forEach(member => {
        const teamName = `"${team.name.replace(/"/g, '""')}"`;
        const memberName = `"${member.name.replace(/"/g, '""')}"`;
        csvContent += `${teamName},${memberName},${member.skill}\n`;
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

  const handleGenerationMethodChange = (method: 'random' | 'skill') => {
    setGenerationMethod(method);
    if (method === 'skill') {
      setNumTeams('2');
    }
    clearMessages();
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
            Team Randomizer Pro
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Effortlessly create fair and random teams.
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
            
            <TeamConfig
              numTeams={numTeams}
              onNumTeamsChange={(e) => { setNumTeams(e.target.value); clearMessages(); }}
              onRandomize={handleRandomize}
              generationMethod={generationMethod}
              onGenerationMethodChange={handleGenerationMethodChange}
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
