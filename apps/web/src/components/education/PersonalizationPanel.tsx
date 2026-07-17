import React from 'react';
import { UserCircle, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

export function PersonalizationPanel() {
  const atRiskStudents = [
    { id: '1042', name: 'Student #1042', reason: 'Asked about mid-term syllabus 6 times in 2 days', level: 'High' },
    { id: '2981', name: 'Student #2981', reason: 'Missed fee deadline & asked for extensions twice', level: 'High' },
    { id: '4450', name: 'Student #4450', reason: 'Irregular attendance queries', level: 'Medium' }
  ];

  return (
    <div className="bg-surface border border-outline-variant/30 rounded-xl p-4 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">✨</span>
        <h2 className="text-label-lg font-semibold text-on-surface">AI Personalization Engine</h2>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-on-surface-variant mb-1">
            <Sparkles size={14} className="text-amber-500" />
            <span className="text-[10px] font-medium uppercase">Personalized Responses</span>
          </div>
          <p className="text-headline-sm font-bold text-on-surface">67</p>
          <p className="text-[10px] text-green-500 font-medium mt-1">↑ 12% today</p>
        </div>
        
        <div className="bg-surface-container-lowest border border-outline-variant/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-on-surface-variant mb-1">
            <TrendingUp size={14} className="text-amber-500" />
            <span className="text-[10px] font-medium uppercase">Avg Relevance Score</span>
          </div>
          <p className="text-headline-sm font-bold text-on-surface">94%</p>
          <p className="text-[10px] text-on-surface-variant mt-1">Based on feedback</p>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-label-sm font-semibold text-on-surface flex items-center gap-2">
            <AlertCircle size={14} className="text-red-500" />
            At-Risk Students Detected
          </h3>
        </div>

        <div className="space-y-3">
          {atRiskStudents.map(student => (
            <div key={student.id} className="p-3 rounded-lg border border-outline-variant/30 bg-surface-container-lowest flex items-start justify-between group hover:border-outline-variant/50 transition">
              <div className="flex gap-3">
                <div className="mt-0.5">
                  <UserCircle size={24} className="text-on-surface-variant" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-label-sm font-semibold text-on-surface">{student.name}</p>
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      student.level === 'High' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {student.level} Risk
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant mt-1">{student.reason}</p>
                </div>
              </div>
              <button className="text-[10px] font-medium border border-outline-variant/50 rounded px-2 py-1 text-on-surface hover:bg-surface-container transition whitespace-nowrap opacity-0 group-hover:opacity-100">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
