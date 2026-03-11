
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';
import { User } from '../types';

interface EditProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const EditProfileView: React.FC<EditProfileProps> = ({ user, onUpdate }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user.name,
    studentId: user.studentId || '',
    program: user.program || '',
  });

  const handleSave = () => {
    onUpdate({ ...user, ...formData });
    if (window.navigator.vibrate) window.navigator.vibrate(20);
    navigate('/profile');
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col animate-fade-in">
      <div className="p-6 bg-white flex items-center justify-between shadow-sm">
        <button onClick={() => navigate('/profile')} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
          <ICONS.ChevronRight size={24} className="rotate-180 text-slate-600" />
        </button>
        <h1 className="font-bold text-slate-900">Edit Profile</h1>
        <button onClick={handleSave} className="text-[#0088CC] font-bold text-sm">Save</button>
      </div>

      <div className="p-6 space-y-8 overflow-y-auto no-scrollbar">
        <div className="flex flex-col items-center">
            <div className="relative">
                <img src={user.profileImage} className="w-24 h-24 rounded-[3rem] object-cover shadow-lg border-4 border-white" />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#0088CC] rounded-full border-2 border-white flex items-center justify-center text-white shadow-md active:scale-90 transition-transform">
                    <ICONS.Search size={14} /> {/* Using Search as placeholder for camera icon if not present */}
                </button>
            </div>
            <p className="text-[10px] font-bold text-[#0088CC] uppercase tracking-widest mt-4">Change Photo</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
            </div>
            <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Student ID</label>
                <input 
                    type="text" 
                    value={formData.studentId}
                    onChange={e => setFormData({...formData, studentId: e.target.value})}
                    placeholder="e.g. STU2024001"
                    className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
            </div>
            <div className="space-y-1.5 lg:col-span-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Program of Study</label>
                <input 
                    type="text" 
                    value={formData.program}
                    onChange={e => setFormData({...formData, program: e.target.value})}
                    placeholder="e.g. Computer Science"
                    className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                />
            </div>
        </div>

        <div className="bg-blue-50/50 rounded-3xl p-5 border border-blue-100 flex gap-4">
            <ICONS.Info className="text-[#0088CC] shrink-0" size={18} />
            <p className="text-[11px] text-[#0088CC] font-medium leading-relaxed">
                Your name and student ID are used for official documentation and hostel booking verification. Please ensure they are accurate.
            </p>
        </div>
      </div>
    </div>
  );
};

export default EditProfileView;
