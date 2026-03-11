
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import { Poll } from '../types';

interface PollsViewProps {
  polls: Poll[];
  onVote: (pollId: string, option: string) => void;
}

const PollsView: React.FC<PollsViewProps> = ({ polls, onVote }) => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-6 animate-fade-in no-scrollbar overflow-y-auto">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/profile')} className="p-2 -ml-2 bg-white rounded-full border border-slate-100 shadow-sm">
          <ICONS.ChevronRight size={20} className="rotate-180" />
        </button>
        <h1 className="text-2xl font-bold text-slate-900">Voting</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pb-4">
        {polls.length > 0 ? polls.map((poll) => (
          <div key={poll.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${poll.hasVoted ? 'bg-emerald-50 text-emerald-500' : 'bg-indigo-50 text-indigo-500'}`}>
                        {poll.hasVoted ? 'VOTED' : 'ONGOING'}
                    </span>
                    {poll.status === 'closed' && (
                        <span className="text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider bg-red-50 text-red-500">
                            CLOSED
                        </span>
                    )}
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">ENDS: {poll.endDate}</span>
            </div>
            
            <h2 className="text-xl font-bold text-slate-900 mb-8 leading-snug">{poll.question}</h2>

            <div className="space-y-4 mb-8">
              {poll.options.map((option) => {
                const percentage = poll.totalVotes > 0 ? Math.round(((poll.votes[option] || 0) / poll.totalVotes) * 100) : 0;
                const isInteractionDisabled = poll.hasVoted || poll.status === 'closed';
                
                return (
                  <button
                    key={option}
                    disabled={isInteractionDisabled}
                    onClick={() => onVote(poll.id, option)}
                    className={`w-full relative h-14 group transition-transform ${isInteractionDisabled ? '' : 'active:scale-[0.98]'}`}
                  >
                    <div className={`absolute inset-0 rounded-2xl border transition-all ${
                        isInteractionDisabled ? 'bg-slate-50 border-transparent' : 'bg-white border-slate-100 group-hover:border-[#0088CC]'
                    }`}>
                        {isInteractionDisabled && (
                            <div 
                                className={`h-full ${poll.status === 'closed' ? 'bg-slate-200/50' : 'bg-[#0088CC]/10'} rounded-2xl transition-all duration-1000 ease-out`} 
                                style={{ width: `${percentage}%` }}
                            ></div>
                        )}
                    </div>
                    <div className="absolute inset-0 px-5 flex items-center justify-between">
                      <span className={`text-sm font-bold ${isInteractionDisabled ? 'text-slate-900' : 'text-slate-600'}`}>{option}</span>
                      {isInteractionDisabled && <span className="text-sm font-black text-[#0088CC]">{percentage}%</span>}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-2 pt-4 border-t border-slate-50">
                <ICONS.Vote size={16} className="text-slate-300" />
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{poll.totalVotes} TOTAL PARTICIPANTS</span>
            </div>
          </div>
        )) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                <ICONS.Vote size={64} strokeWidth={1} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">No active polls</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default PollsView;
