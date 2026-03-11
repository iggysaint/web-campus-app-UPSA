
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { currentUser } from '../mockData';
import { ICONS, COLORS } from '../constants';
import { Announcement, ClassSchedule } from '../types';

interface HomeViewProps {
  announcements: Announcement[];
  schedules: ClassSchedule[];
  // Added onRefresh prop to match usage in App.tsx
  onRefresh: () => Promise<void>;
}

const HomeView: React.FC<HomeViewProps> = ({ announcements, schedules, onRefresh }) => {
  const navigate = useNavigate();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Use the onRefresh prop passed from App.tsx to update data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const quickActions = [
    { label: 'Schedule', Icon: ICONS.Schedule, color: 'bg-blue-50', iconColor: '#0088CC', path: '/schedule' },
    { label: 'Hostel', Icon: ICONS.Building, color: 'bg-emerald-50', iconColor: '#10B981', path: '/profile/hostel' },
    { label: 'Vote', Icon: ICONS.CheckCircle2, color: 'bg-purple-50', iconColor: '#8B5CF6', path: '/profile/polls' },
    { label: 'Library', Icon: ICONS.Library, color: 'bg-orange-50', iconColor: '#F59E0B', path: '/library' },
  ];

  return (
    <div className="flex-1 flex flex-col p-6 overflow-y-auto no-scrollbar animate-fade-in" onScroll={(e) => {
        if (e.currentTarget.scrollTop === 0) {
            // Simplified pull-to-refresh logic
        }
    }}>
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <p className="text-slate-500 text-sm mb-1">Welcome back,</p>
          <h1 className="text-2xl font-bold text-slate-900">{currentUser.name.split(' ')[0]}</h1>
        </div>
        <button onClick={handleRefresh} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 relative active:scale-95">
          <ICONS.Bell size={20} className="text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-14 h-14 ${action.color} rounded-2xl flex items-center justify-center transition-transform group-active:scale-90`}>
              <action.Icon color={action.iconColor} size={24} />
            </div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Today's Classes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Today's Classes</h2>
          <button onClick={() => navigate('/schedule')} className="text-[#0088CC] text-xs font-bold flex items-center gap-1 uppercase tracking-widest">
            All <ICONS.ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
          {schedules.length > 0 ? schedules.map((cls) => (
            <div key={cls.id} className="min-w-[280px] bg-[#0088CC] rounded-3xl p-5 text-white relative overflow-hidden shadow-lg shadow-blue-100">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
              <p className="text-[10px] opacity-80 font-bold mb-1 uppercase tracking-widest">{cls.start_time} - {cls.end_time}</p>
              <h3 className="text-lg font-bold mb-3">{cls.course_name}</h3>
              <div className="flex items-center gap-2 text-xs opacity-90">
                <div className="bg-white/20 px-3 py-1 rounded-lg font-bold">{cls.location}</div>
              </div>
            </div>
          )) : (
            <div className="w-full bg-slate-100 rounded-3xl p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                No classes scheduled for today
            </div>
          )}
        </div>
      </div>

      {/* Announcements */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-900">Campus News</h2>
          <span className="bg-blue-100 text-[#0088CC] px-2 py-0.5 rounded-full text-[10px] font-bold">{announcements.length} NEW</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {announcements.map((ann) => (
            <div key={ann.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 transition-all hover:shadow-md active:scale-[0.98]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${
                        ann.category === 'URGENT' ? 'bg-red-500' :
                        ann.category === 'ACADEMIC' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`}></span>
                    <span className={`text-[10px] font-black tracking-widest ${
                        ann.category === 'URGENT' ? 'text-red-500' :
                        ann.category === 'ACADEMIC' ? 'text-emerald-500' : 'text-blue-500'
                    }`}>{ann.category}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase">{ann.created_at}</span>
              </div>
              <h3 className="font-bold text-slate-900 mb-2 leading-tight">{ann.title}</h3>
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{ann.message}</p>
            </div>
          ))}
        </div>
      </div>

      {isRefreshing && (
        <div className="fixed inset-x-0 top-0 h-1 bg-blue-100 z-[100]">
          <div className="h-full bg-[#0088CC] animate-[loading_1s_ease-in-out_infinite] w-1/3"></div>
        </div>
      )}
    </div>
  );
};

export default HomeView;
