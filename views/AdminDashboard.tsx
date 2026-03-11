
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS, COLORS } from '../constants';
import { Poll, ClassSchedule, Announcement, Club, HostelBooking, User, LibraryFile, BookingStatus, TargetType } from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  polls: Poll[];
  schedules: ClassSchedule[];
  announcements: Announcement[];
  clubs: Club[];
  bookings: HostelBooking[];
  students: User[];
  libraryFiles: LibraryFile[];
  onUpdate: () => void;
}

const AdminDashboardView: React.FC<AdminDashboardProps> = ({ 
  polls, schedules, announcements, clubs, bookings, students, libraryFiles, onUpdate
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Schedules');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const initialClub = { name: '', description: '', category: 'Technology', whatsapp: '', image: 'https://picsum.photos/400/200?random=' + Math.floor(Math.random() * 100) };
  const initialSchedule = { course_id: '', course_name: '', instructor_name: '', day_of_week: 'Monday' as any, start_time: '08:00', end_time: '10:00', location: '', semester: '1st SEM 2024/25' };
  const initialPoll = { question: '', options: ['', ''], endDate: new Date(Date.now() + 604800000).toISOString().split('T')[0] };
  const initialAnnouncement = { title: '', message: '', category: 'GENERAL' as Announcement['category'], target_type: 'all' as TargetType };
  const initialFile = { name: '', type: 'slides' as LibraryFile['type'], course: '', size: '1.2 MB' };

  const [newClub, setNewClub] = useState(initialClub);
  const [newSchedule, setNewSchedule] = useState(initialSchedule);
  const [newPoll, setNewPoll] = useState(initialPoll);
  const [newAnnouncement, setNewAnnouncement] = useState(initialAnnouncement);
  const [newFile, setNewFile] = useState(initialFile);

  // Reset forms on tab change or modal close
  useEffect(() => {
    if (!isModalOpen) {
      setNewClub(initialClub);
      setNewSchedule(initialSchedule);
      setNewPoll(initialPoll);
      setNewAnnouncement(initialAnnouncement);
      setNewFile(initialFile);
    }
  }, [isModalOpen, activeTab]);

  const wrapAction = async (promise: Promise<any>, actionLabel: string) => {
    setIsProcessing(true);
    try {
      await promise;
      onUpdate();
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateClub = () => wrapAction(api.clubs.create(newClub), 'Creating Club');
  const handleCreateSchedule = () => wrapAction(api.schedules.create(newSchedule), 'Saving Schedule');
  const handleCreatePoll = () => wrapAction(api.polls.create(newPoll), 'Launching Poll');
  const handleCreateAnnouncement = () => wrapAction(api.announcements.create(newAnnouncement), 'Posting Announcement');
  const handleCreateFile = () => wrapAction(api.library.create(newFile), 'Uploading Resource');

  const handleTogglePollStatus = (id: string) => wrapAction(api.polls.toggleStatus(id), 'Toggling Poll Status');
  const handleUpdateBooking = (id: string, status: BookingStatus) => wrapAction(api.bookings.updateStatus(id, status), 'Updating Booking Status');

  const confirmDelete = (id: string, action: (id: string) => Promise<any>, label: string) => {
    if (window.confirm(`Are you sure you want to delete this ${label}?`)) {
      wrapAction(action(id), `Deleting ${label}`);
    }
  };

  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase();
    switch (activeTab) {
      case 'Schedules': return schedules.filter(s => s.course_name.toLowerCase().includes(q) || s.course_id.toLowerCase().includes(q) || s.instructor_name?.toLowerCase().includes(q));
      case 'Clubs': return clubs.filter(c => c.name.toLowerCase().includes(q));
      case 'Announcements': return announcements.filter(a => a.title.toLowerCase().includes(q));
      case 'Library': return libraryFiles.filter(f => f.name.toLowerCase().includes(q) || f.course.toLowerCase().includes(q));
      case 'Polls': return polls.filter(p => p.question.toLowerCase().includes(q));
      case 'Hostel Management': return bookings.filter(b => b.userName.toLowerCase().includes(q) || b.hostelName.toLowerCase().includes(q));
      case 'Students': return students.filter(s => s.name.toLowerCase().includes(q) || s.studentId?.toLowerCase().includes(q));
      default: return [];
    }
  }, [activeTab, schedules, clubs, announcements, libraryFiles, polls, bookings, students, searchQuery]);

  // Validation Logic
  const isClubValid = newClub.name.trim() !== '' && newClub.description.trim() !== '';
  const isFileValid = newFile.name.trim() !== '' && newFile.course.trim() !== '';
  const isScheduleValid = newSchedule.course_id.trim() !== '' && newSchedule.course_name.trim() !== '' && newSchedule.location.trim() !== '' && newSchedule.instructor_name.trim() !== '';
  const isAnnouncementValid = newAnnouncement.title.trim() !== '' && newAnnouncement.message.trim() !== '';
  const isPollValid = newPoll.question.trim() !== '' && newPoll.options.every(o => o.trim() !== '');

  const tabs = ['Schedules', 'Polls', 'Announcements', 'Clubs', 'Hostel Management', 'Library', 'Students'];

  return (
    <div className="flex-1 bg-slate-50 flex flex-col animate-fade-in relative h-full">
      {isProcessing && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#0088CC] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      <div className="p-6 bg-white flex items-center justify-between shadow-sm sticky top-0 z-40">
        <button onClick={() => navigate('/profile')} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
          <ICONS.ChevronRight size={24} className="rotate-180 text-slate-600" />
        </button>
        <h1 className="font-black text-slate-900 uppercase tracking-widest text-xs">Campus Admin</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-6 space-y-6 overflow-y-auto no-scrollbar flex-1 pb-10">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2 -mx-6 px-6 bg-white border-b border-slate-100 sticky top-0 z-30">
            {tabs.map(t => (
                <button 
                    key={t}
                    onClick={() => { setActiveTab(t); setSearchQuery(''); }}
                    className={`py-2.5 px-5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all whitespace-nowrap ${
                        activeTab === t ? 'bg-[#0088CC] text-white shadow-lg shadow-blue-100' : 'text-slate-400 bg-slate-50'
                    }`}
                >
                    {t}
                </button>
            ))}
        </div>

        <div className="space-y-4">
            <div className="relative">
                <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    placeholder={`Search ${activeTab.toLowerCase()}...`}
                    className="w-full bg-white border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium shadow-sm focus:ring-2 focus:ring-blue-100 transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="flex justify-between items-center">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.25em]">{activeTab} ({filteredItems.length})</h3>
                {['Schedules', 'Polls', 'Announcements', 'Clubs', 'Library'].includes(activeTab) && (
                    <button onClick={() => setIsModalOpen(true)} className="bg-[#0088CC] text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest">
                        <span>Add New</span>
                        <span className="text-lg">+</span>
                    </button>
                )}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            {filteredItems.length === 0 && (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-slate-300">
                    <ICONS.Search size={48} strokeWidth={1} className="mb-4 opacity-20" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em]">No results found</p>
                </div>
            )}

            {activeTab === 'Schedules' && filteredItems.map((s: any) => (
                <div key={s.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 relative group">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-50 text-[#0088CC] rounded-2xl flex items-center justify-center">
                                <ICONS.Calendar size={22} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-slate-900 leading-tight truncate">{s.course_id}: {s.course_name}</h4>
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">{s.instructor_name || 'No Lecturer Assigned'}</p>
                            </div>
                        </div>
                        <button onClick={() => confirmDelete(s.id, api.schedules.delete, 'schedule')} className="text-slate-300 hover:text-red-500 transition-colors p-2">
                            <ICONS.LogOut size={18} className="rotate-90" />
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                        <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <ICONS.Info size={12} className="text-[#0088CC]" />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{s.day_of_week}</span>
                        </div>
                        <div className="bg-slate-50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <ICONS.Search size={12} className="text-[#0088CC]" />
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{s.start_time} - {s.end_time}</span>
                        </div>
                        <div className="bg-emerald-50 px-3 py-1.5 rounded-lg flex items-center gap-2">
                            <ICONS.Building size={12} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{s.location}</span>
                        </div>
                    </div>
                </div>
            ))}

            {activeTab === 'Clubs' && filteredItems.map((c: any) => (
                <div key={c.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group">
                    <img src={c.image} className="w-16 h-16 rounded-2xl object-cover shadow-sm" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black text-[#0088CC] bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">{c.category}</span>
                            <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider">{c.members} Members</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 truncate">{c.name}</h4>
                        <p className="text-[10px] text-slate-400 font-medium line-clamp-1">{c.description}</p>
                    </div>
                    <button onClick={() => confirmDelete(c.id, api.clubs.delete, 'club')} className="text-slate-300 hover:text-red-500 p-2 active:scale-90 transition-transform">
                        <ICONS.LogOut size={18} className="rotate-90" />
                    </button>
                </div>
            ))}

            {activeTab === 'Announcements' && filteredItems.map((ann: any) => (
                <div key={ann.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-lg text-[9px] font-black tracking-widest ${
                                ann.category === 'URGENT' ? 'bg-red-50 text-red-500' :
                                ann.category === 'ACADEMIC' ? 'bg-emerald-50 text-emerald-500' : 'bg-blue-50 text-blue-500'
                            }`}>{ann.category}</span>
                            <span className="bg-slate-50 text-slate-400 px-2 py-1 rounded-lg text-[9px] font-black tracking-widest">TO: {ann.target_type.toUpperCase()}</span>
                        </div>
                        <button onClick={() => confirmDelete(ann.id, api.announcements.delete, 'announcement')} className="text-slate-300 hover:text-red-500 transition-colors">
                            <ICONS.LogOut size={18} className="rotate-90" />
                        </button>
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-sm mb-1">{ann.title}</h4>
                        <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-3">{ann.message}</p>
                    </div>
                    <div className="pt-2 flex justify-end">
                        <span className="text-[9px] font-bold text-slate-300 uppercase">{new Date(ann.created_at).toLocaleDateString()}</span>
                    </div>
                </div>
            ))}

            {activeTab === 'Library' && filteredItems.map((f: any) => (
                <div key={f.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                        <ICONS.FileText size={22} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-slate-900 truncate">{f.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] font-black text-[#0088CC] uppercase tracking-wider">{f.course}</span>
                            <span className="text-[9px] text-slate-300">•</span>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">{f.type.replace('_', ' ')}</span>
                        </div>
                    </div>
                    <button onClick={() => confirmDelete(f.id, api.library.delete, 'file')} className="text-slate-300 hover:text-red-500 p-2">
                        <ICONS.LogOut size={16} className="rotate-90" />
                    </button>
                </div>
            ))}

            {activeTab === 'Polls' && filteredItems.map((p: any) => (
                <div key={p.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="flex-1 pr-4">
                            <h4 className="font-bold text-sm text-slate-900 leading-tight mb-1">{p.question}</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{p.totalVotes} votes • {p.status.toUpperCase()}</p>
                        </div>
                        <div className="flex gap-2">
                             <button onClick={() => handleTogglePollStatus(p.id)} className={`w-10 h-10 rounded-xl flex items-center justify-center ${p.status === 'open' ? 'bg-amber-50 text-amber-500' : 'bg-emerald-50 text-emerald-500'}`}>
                                <ICONS.Shield size={18} />
                             </button>
                             <button onClick={() => confirmDelete(p.id, api.polls.delete, 'poll')} className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center">
                                <ICONS.LogOut size={18} className="rotate-90" />
                             </button>
                        </div>
                    </div>
                </div>
            ))}

            {activeTab === 'Hostel Management' && filteredItems.map((b: any) => (
                <div key={b.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${b.status === 'booked' ? 'bg-emerald-50 text-emerald-500' : b.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-500'}`}>
                                <ICONS.Building size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-slate-900">{b.userName}</h4>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{b.hostelName} • Room {b.roomNumber}</p>
                            </div>
                        </div>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${
                            b.status === 'booked' ? 'bg-emerald-100 text-emerald-600' : 
                            b.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                        }`}>
                            {b.status.toUpperCase()}
                        </span>
                    </div>
                    {b.status === 'pending' && (
                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                            <button onClick={() => handleUpdateBooking(b.id, 'booked')} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-100">Approve</button>
                            <button onClick={() => handleUpdateBooking(b.id, 'rejected')} className="flex-1 bg-red-500 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-100">Reject</button>
                        </div>
                    )}
                </div>
            ))}

            {activeTab === 'Students' && filteredItems.map((s: any) => (
                <div key={s.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                    <img src={s.profileImage || `https://ui-avatars.com/api/?name=${s.name}&background=0088CC&color=fff`} className="w-12 h-12 rounded-2xl" />
                    <div className="flex-1">
                        <h4 className="font-bold text-sm text-slate-900">{s.name}</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-[#0088CC] font-black uppercase tracking-widest">{s.studentId}</span>
                            <span className="text-[10px] text-slate-300">•</span>
                            <span className="text-[10px] text-slate-400 font-bold uppercase">{s.program}</span>
                        </div>
                    </div>
                    <span className="bg-blue-50 text-[#0088CC] px-2 py-1 rounded text-[9px] font-black uppercase">{s.role}</span>
                </div>
            ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center animate-fade-in p-4">
            <div className="w-full max-w-md bg-white rounded-[3rem] p-8 space-y-6 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
                <div className="flex justify-between items-center sticky top-0 bg-white py-2 z-10">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Add {activeTab.slice(0, -1)}</h2>
                    <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">✕</button>
                </div>

                {activeTab === 'Schedules' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Course ID</label>
                                <input type="text" placeholder="e.g. BCIT 402" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" value={newSchedule.course_id} onChange={e => setNewSchedule({...newSchedule, course_id: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Day</label>
                                <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm appearance-none" value={newSchedule.day_of_week} onChange={e => setNewSchedule({...newSchedule, day_of_week: e.target.value as any})}>
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Course Name</label>
                            <input type="text" placeholder="e.g. Strategic Management" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" value={newSchedule.course_name} onChange={e => setNewSchedule({...newSchedule, course_name: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Lecturer Name</label>
                            <input type="text" placeholder="e.g. Dr. Ama Mensah" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" value={newSchedule.instructor_name} onChange={e => setNewSchedule({...newSchedule, instructor_name: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Start Time</label>
                                <input type="time" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" value={newSchedule.start_time} onChange={e => setNewSchedule({...newSchedule, start_time: e.target.value})} />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">End Time</label>
                                <input type="time" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" value={newSchedule.end_time} onChange={e => setNewSchedule({...newSchedule, end_time: e.target.value})} />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location</label>
                            <input type="text" placeholder="e.g. LT 5, Ground Floor" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" value={newSchedule.location} onChange={e => setNewSchedule({...newSchedule, location: e.target.value})} />
                        </div>
                        <button 
                            disabled={!isScheduleValid}
                            onClick={handleCreateSchedule} 
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${isScheduleValid ? 'bg-[#0088CC] text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                        >
                            Save Timetable Entry
                        </button>
                    </div>
                )}

                {activeTab === 'Clubs' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Club Name</label>
                            <input type="text" placeholder="e.g. Robotics Club" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" value={newClub.name} onChange={e => setNewClub({...newClub, name: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm appearance-none" value={newClub.category} onChange={e => setNewClub({...newClub, category: e.target.value})}>
                                <option value="Technology">Technology</option>
                                <option value="Academic">Academic</option>
                                <option value="Arts">Arts</option>
                                <option value="Sports">Sports</option>
                                <option value="Business">Business</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">WhatsApp Invite Link</label>
                            <input type="url" placeholder="https://chat.whatsapp.com/..." className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" value={newClub.whatsapp} onChange={e => setNewClub({...newClub, whatsapp: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Description</label>
                            <textarea placeholder="Mission and activities of the club..." className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm resize-none" rows={3} value={newClub.description} onChange={e => setNewClub({...newClub, description: e.target.value})} />
                        </div>
                        <button 
                            disabled={!isClubValid}
                            onClick={handleCreateClub} 
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${isClubValid ? 'bg-[#0088CC] text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}
                        >
                            Launch Club
                        </button>
                    </div>
                )}

                {activeTab === 'Announcements' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Title</label>
                            <input type="text" placeholder="Urgent: Examination Schedule" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                                <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm appearance-none" value={newAnnouncement.category} onChange={e => setNewAnnouncement({...newAnnouncement, category: e.target.value as any})}>
                                    <option value="GENERAL">General</option>
                                    <option value="URGENT">Urgent</option>
                                    <option value="ACADEMIC">Academic</option>
                                    <option value="EVENT">Event</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Target</label>
                                <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm appearance-none" value={newAnnouncement.target_type} onChange={e => setNewAnnouncement({...newAnnouncement, target_type: e.target.value as any})}>
                                    <option value="all">All Students</option>
                                    <option value="program">By Program</option>
                                    <option value="course">By Course</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                            <textarea placeholder="Detailed announcement text..." className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm resize-none" rows={5} value={newAnnouncement.message} onChange={e => setNewAnnouncement({...newAnnouncement, message: e.target.value})} />
                        </div>
                        <button 
                            disabled={!isAnnouncementValid}
                            onClick={handleCreateAnnouncement} 
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${isAnnouncementValid ? 'bg-[#0088CC] text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}
                        >
                            Publish Announcement
                        </button>
                    </div>
                )}

                {activeTab === 'Library' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">File Name</label>
                            <input type="text" placeholder="e.g. Logic Notes.pdf" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" value={newFile.name} onChange={e => setNewFile({...newFile, name: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Course Code</label>
                            <input type="text" placeholder="e.g. CS101" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" value={newFile.course} onChange={e => setNewFile({...newFile, course: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Category</label>
                            <select className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm appearance-none" value={newFile.type} onChange={e => setNewFile({...newFile, type: e.target.value as any})}>
                                <option value="slides">Slides</option>
                                <option value="past_questions">Past Questions</option>
                                <option value="books">Books</option>
                                <option value="notes">Notes</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <button 
                            disabled={!isFileValid}
                            onClick={handleCreateFile} 
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${isFileValid ? 'bg-[#0088CC] text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                        >
                            Upload Resource
                        </button>
                    </div>
                )}

                {activeTab === 'Polls' && (
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Poll Question</label>
                            <input type="text" placeholder="e.g. Best Campus Cafeteria?" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm" value={newPoll.question} onChange={e => setNewPoll({...newPoll, question: e.target.value})} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Options</label>
                            {newPoll.options.map((opt, i) => (
                                <input 
                                    key={i}
                                    type="text" 
                                    placeholder={`Option ${i+1}`} 
                                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm mb-2" 
                                    value={opt} 
                                    onChange={e => {
                                        const next = [...newPoll.options];
                                        next[i] = e.target.value;
                                        setNewPoll({...newPoll, options: next});
                                    }} 
                                />
                            ))}
                            <button 
                                onClick={() => setNewPoll({...newPoll, options: [...newPoll.options, '']})}
                                className="text-[10px] font-black text-[#0088CC] uppercase tracking-widest p-2 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                + Add Option
                            </button>
                        </div>
                        <button 
                            disabled={!isPollValid}
                            onClick={handleCreatePoll} 
                            className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all ${isPollValid ? 'bg-[#0088CC] text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}
                        >
                            Start Voting Session
                        </button>
                    </div>
                )}
            </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardView;
