
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { Club } from '../types';

interface ClubsViewProps {
  clubs: Club[];
}

const ClubsView: React.FC<ClubsViewProps> = ({ clubs }) => {
  const [activeTab, setActiveTab] = useState('All');
  const tabs = ['All', 'Technology', 'Academic', 'Arts', 'Sports', 'Business'];

  const filteredClubs = activeTab === 'All' ? clubs : clubs.filter(c => c.category === activeTab);

  return (
    <div className="flex-1 p-6 animate-fade-in overflow-y-auto no-scrollbar">
      <div className="mb-6">
        <p className="text-slate-400 text-sm font-medium">Campus</p>
        <h1 className="text-2xl font-bold text-slate-900">Clubs & Groups</h1>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 -mx-6 px-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === tab
                ? 'bg-[#0088CC] text-white shadow-lg shadow-blue-100'
                : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredClubs.length} CLUBS AVAILABLE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-4">
        {filteredClubs.map((club) => (
          <div key={club.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100 flex flex-col group transition-all hover:shadow-md active:scale-[0.98]">
            <div className="h-32 overflow-hidden relative">
              <img src={club.image} alt={club.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                  <span className="text-[10px] font-bold text-[#0088CC] uppercase tracking-wider">{club.category}</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-slate-900 text-lg mb-2">{club.name}</h3>
              <p className="text-slate-500 text-xs mb-5 leading-relaxed line-clamp-2">{club.description}</p>
              
              <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <ICONS.Clubs size={16} />
                  <span className="text-xs font-bold">{club.members} members</span>
                </div>
                <a
                  href={club.whatsapp_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 text-white px-5 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-100 active:scale-95 transition-transform"
                >
                  <div className="w-4 h-4 rounded-full border border-white/30 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                  Join
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClubsView;
