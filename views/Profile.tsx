
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS, COLORS } from '../constants';
import { User } from '../types';

interface ProfileProps {
  user: User;
  pollsCount: number;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileProps> = ({ user, pollsCount, onLogout }) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const sections = [
    {
      title: 'CAMPUS SERVICES',
      items: [
        { label: 'Hostel Booking', sub: 'Room allocation system', Icon: ICONS.Building, path: '/profile/hostel', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
        { label: 'Polls & Voting', sub: 'Student elections & feedback', Icon: ICONS.Vote, path: '/profile/polls', iconBg: 'bg-indigo-50', iconColor: 'text-indigo-500', badge: pollsCount.toString() },
      ]
    },
    {
      title: 'APP SETTINGS',
      items: [
        { label: 'Appearance', sub: isDarkMode ? 'Dark Mode' : 'Light Mode', Icon: ICONS.Search, path: 'appearance', iconBg: 'bg-purple-50', iconColor: 'text-purple-500', isToggle: true },
        { label: 'Notifications & Sounds', Icon: ICONS.Bell, path: '#', iconBg: 'bg-orange-50', iconColor: 'text-orange-500' },
        { label: 'Privacy & Security', Icon: ICONS.Shield, path: '#', iconBg: 'bg-blue-50', iconColor: 'text-blue-500' },
      ]
    },
    {
      title: 'SUPPORT',
      items: [
        { label: 'Help & Support', Icon: ICONS.HelpCircle, path: '/profile/help', iconBg: 'bg-slate-100', iconColor: 'text-slate-500' },
      ]
    }
  ];

  if (user.role === 'admin') {
    sections.unshift({
      title: 'ADMINISTRATION',
      items: [
        { label: 'Admin Dashboard', sub: 'Manage campus data', Icon: ICONS.Shield, path: '/admin', iconBg: 'bg-red-50', iconColor: 'text-red-500' },
      ]
    });
  }

  const handleAction = (item: any) => {
    if (item.isToggle) {
        setIsDarkMode(!isDarkMode);
        if (window.navigator.vibrate) window.navigator.vibrate(10);
        return;
    }
    if (item.path !== '#') navigate(item.path);
  };

  return (
    <div className={`flex-1 p-6 animate-fade-in overflow-y-auto no-scrollbar transition-colors duration-500 ${isDarkMode ? 'bg-slate-900 text-white' : ''}`}>
      {/* Header Profile */}
      <div className="flex items-center gap-5 mb-8">
        <div className="relative group cursor-pointer" onClick={() => navigate('/profile/edit')}>
            <img src={user.profileImage || `https://ui-avatars.com/api/?name=${user.name}&background=0088CC&color=fff`} className="w-20 h-20 rounded-[2.5rem] object-cover ring-4 ring-white shadow-xl shadow-slate-200 transition-transform group-active:scale-95" />
            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0088CC] rounded-full border-4 border-white flex items-center justify-center text-white">
                <ICONS.Search size={12} />
            </div>
        </div>
        <div className="flex-1">
          <h1 className={`text-xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h1>
          <p className="text-slate-400 text-sm mb-2">{user.email}</p>
          <span className="bg-blue-100 text-[#0088CC] px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em]">{user.role}</span>
        </div>
      </div>

      {/* Menu Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
        {sections.map((section) => (
          <div key={section.title} className="flex flex-col">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 px-1">{section.title}</h2>
            <div className="space-y-3 flex-1">
              {section.items.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleAction(item)}
                  className={`w-full ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-3xl p-4 shadow-sm border flex items-center gap-4 group active:scale-[0.98] transition-all`}
                >
                  <div className={`w-12 h-12 ${item.iconBg} rounded-2xl flex items-center justify-center ${item.iconColor}`}>
                    <item.Icon size={20} />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className={`font-bold text-sm leading-none mb-1.5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.label}</h3>
                    {item.sub && <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{item.sub}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && <span className="bg-[#0088CC] text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-black">{item.badge}</span>}
                    {item.isToggle ? (
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isDarkMode ? 'bg-[#0088CC]' : 'bg-slate-200'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${isDarkMode ? 'translate-x-4' : ''}`}></div>
                        </div>
                    ) : (
                        <ICONS.ChevronRight size={18} className="text-slate-300 group-hover:text-[#0088CC] transition-colors" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="lg:col-span-full xl:col-span-1">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 px-1 invisible">LOGOUT</h2>
          <button 
            onClick={onLogout}
            className={`w-full ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} rounded-3xl p-5 border flex items-center gap-4 hover:shadow-md active:scale-[0.98] transition-all mb-8`}
          >
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-500">
              <ICONS.LogOut size={20} />
            </div>
            <span className="font-bold text-red-500">Log Out</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center pb-8 opacity-50">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Merix Campus v1.0.0</p>
        </div>
      </div>
  );
};

export default ProfileView;
