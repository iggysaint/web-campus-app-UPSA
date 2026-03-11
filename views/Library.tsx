
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { FileType, LibraryFile } from '../types';

interface LibraryViewProps {
  libraryFiles: LibraryFile[];
}

const LibraryView: React.FC<LibraryViewProps> = ({ libraryFiles }) => {
  const [activeTab, setActiveTab] = useState<FileType | 'all'>('all');
  const [search, setSearch] = useState('');

  const tabs: { label: string; value: FileType | 'all'; Icon: any }[] = [
    { label: 'All Files', value: 'all', Icon: ICONS.FileText },
    { label: 'Slides', value: 'slides', Icon: ICONS.Info },
    { label: 'Past Questions', value: 'past_questions', Icon: ICONS.HelpCircle },
    { label: 'Books', value: 'books', Icon: ICONS.Library },
  ];

  const filteredFiles = libraryFiles.filter(f => {
    const matchesTab = activeTab === 'all' || f.type === activeTab;
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) || f.course.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="flex-1 p-6 animate-fade-in overflow-y-auto no-scrollbar">
      <div className="mb-6">
        <p className="text-slate-400 text-sm font-medium">Campus</p>
        <h1 className="text-2xl font-bold text-slate-900">Library</h1>
      </div>

      <div className="relative mb-8">
        <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search files, courses..."
          className="w-full bg-white border border-slate-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-8 -mx-6 px-6">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap flex items-center gap-2 transition-all ${
              activeTab === tab.value
                ? 'bg-[#0088CC] text-white shadow-lg shadow-blue-100'
                : 'bg-white text-slate-400 border border-slate-100'
            }`}
          >
            <tab.Icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-6">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{filteredFiles.length} FILES AVAILABLE</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-4">
        {filteredFiles.map((file) => (
          <div key={file.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md active:scale-[0.98] transition-all">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <ICONS.FileText className="text-slate-400 group-hover:text-[#0088CC]" size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-900 text-sm truncate mb-1">{file.name}</h3>
              <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                <span className="bg-blue-50 text-[#0088CC] px-2 py-0.5 rounded uppercase">{file.course}</span>
                <span>{file.size}</span>
                <span>{file.date}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                  <ICONS.Download size={10} className="text-slate-300" />
                  <span className="text-[10px] font-medium text-slate-300">{file.downloads} downloads</span>
              </div>
            </div>
            <button className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0088CC] active:scale-90 transition-transform">
              <ICONS.Download size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LibraryView;
