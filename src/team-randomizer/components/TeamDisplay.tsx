
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
          <p className="mt-1 text-sm text-slate-400">Complete the setup and click "Generate Teams" to see the results here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams.map((team, index) => {
            const totalSkill = team.members.reduce((sum, member) => sum + member.skill, 0);
            return (
              <div key={index} className="bg-slate-900/70 border border-slate-700 rounded-lg shadow-md p-4 flex flex-col animate-fade-in">
                <h3 className="text-lg font-bold text-sky-400 mb-3 border-b border-slate-600 pb-2 flex items-baseline justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    <span>{team.name}</span>
                  </div>
                  <span className="text-sm font-normal text-slate-400" title="Total Team Skill">
                    Skill: {totalSkill}
                  </span>
                </h3>
                <ul className="space-y-3 flex-grow">
                  {team.members.map((member, memberIndex) => (
                    <li key={memberIndex} className="text-slate-300 bg-slate-800/60 p-2 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="break-all">{member.name}</span>
                        <span className="text-xs font-mono text-slate-400 ml-2">{member.skill}</span>
                      </div>
                      <div className="mt-1 w-full bg-slate-700 rounded-full h-1.5" title={`Skill: ${member.skill}`}>
                        <div className="bg-sky-500 h-1.5 rounded-full" style={{ width: `${member.skill}%` }}></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      )}
    </div>
  );
};

export default TeamDisplay;
