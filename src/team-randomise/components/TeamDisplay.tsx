
import React from 'react';
import type { Team } from '../types';
import IconButton from './IconButton';
import { Download, Users } from './Icons';

interface TeamDisplayProps {
  teams: Team[];
  onExport: () => void;
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({ teams, onExport }) => {
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center mb-4 border-b border-slate-600 pb-2">
        <h2 className="text-2xl font-semibold text-sky-300">
          2. Results
        </h2>
        {teams.length > 0 && (
          <IconButton onClick={onExport} icon={<Download className="h-5 w-5"/>} text="Export to CSV" />
        )}
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-16 px-6 bg-slate-900/50 rounded-lg border-2 border-dashed border-slate-700">
          <Users className="mx-auto h-12 w-12 text-slate-500" />
          <h3 className="mt-2 text-lg font-medium text-slate-300">No teams generated yet</h3>
          <p className="mt-1 text-sm text-slate-400">Complete the setup and click "Randomize Teams" to see the results here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams.map((team, index) => (
            <div key={index} className="bg-slate-900/70 border border-slate-700 rounded-lg shadow-md p-4 flex flex-col">
              <h3 className="text-lg font-bold text-sky-400 mb-3 border-b border-slate-600 pb-2 flex items-center gap-2">
                <Users className="h-5 w-5" />
                {team.name}
              </h3>
              <ul className="space-y-2 flex-grow">
                {team.members.map((member, memberIndex) => (
                  <li key={memberIndex} className="text-slate-300 bg-slate-800/60 p-2 rounded-md">
                    {member}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamDisplay;
