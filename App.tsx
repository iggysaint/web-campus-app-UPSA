
import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ICONS, COLORS } from './constants';
import HomeView from './views/Home';
import ScheduleView from './views/Schedule';
import ClubsView from './views/Clubs';
import LibraryView from './views/Library';
import ProfileView from './views/Profile';
import HostelBookingView from './views/HostelBooking';
import PollsView from './views/Polls';
import EditProfileView from './views/EditProfile';
import HelpSupportView from './views/HelpSupport';
import AdminDashboardView from './views/AdminDashboard';
import LoginView from './views/Login';
import { db } from './services/db';
import { api } from './services/api';
import { logger } from './services/logger';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const hideNav = ['/login', '/profile/hostel', '/profile/edit', '/profile/help', '/admin'].some(p => currentPath === p || currentPath.startsWith(p));
  if (hideNav) return null;

  const tabs = [
    { path: '/', label: 'Home', Icon: ICONS.Home },
    { path: '/schedule', label: 'Schedule', Icon: ICONS.Schedule },
    { path: '/clubs', label: 'Clubs', Icon: ICONS.Clubs },
    { path: '/library', label: 'Library', Icon: ICONS.Library },
    { path: '/profile', label: 'Profile', Icon: ICONS.Profile },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 lg:sticky lg:top-0 lg:left-0 lg:h-screen lg:w-64 lg:flex-col lg:border-r lg:border-t-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 px-6 py-3 lg:py-10 flex lg:justify-start justify-between items-center lg:items-start z-50 shadow-[0_-2px_20px_rgba(0,0,0,0.04)] lg:shadow-none">
      <div className="hidden lg:flex flex-col mb-10 px-2">
        <h1 className="text-xl font-black text-[#0088CC] tracking-tighter">MERIX UPSA</h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Campus Portal</p>
      </div>
      <div className="flex lg:flex-col justify-between lg:justify-start items-center lg:items-start w-full gap-6 lg:gap-4">
        {tabs.map((tab) => {
          const isActive = currentPath === tab.path || (tab.path !== '/' && currentPath.startsWith(tab.path));
          return (
            <button
              key={tab.path}
              onClick={() => {
                navigate(tab.path);
                if (window.navigator.vibrate) window.navigator.vibrate(5);
              }}
              className={`flex lg:flex-row flex-col items-center lg:gap-4 gap-1 transition-all duration-300 lg:w-full lg:px-4 lg:py-3 lg:rounded-2xl ${isActive ? 'lg:bg-blue-50' : 'lg:hover:bg-slate-50'}`}
            >
              <tab.Icon
                size={24}
                color={isActive ? COLORS.primary : COLORS.muted}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] lg:text-sm font-black lg:font-bold uppercase lg:capitalize tracking-widest lg:tracking-normal ${
                  isActive ? 'text-[#0088CC]' : 'text-slate-400 lg:text-slate-600'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

const GlobalLoader = () => (
  <div className="fixed inset-0 bg-white/40 backdrop-blur-[2px] z-[200] flex items-center justify-center animate-fade-in">
    <div className="bg-white/80 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-[#0088CC]/10 border-t-[#0088CC] rounded-full animate-spin"></div>
      <p className="text-[10px] font-black text-[#0088CC] uppercase tracking-widest animate-pulse">Synchronizing</p>
    </div>
  </div>
);

const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[300] px-6 py-3 rounded-2xl shadow-xl border flex items-center gap-3 animate-fade-in ${
      type === 'success' ? 'bg-emerald-500 border-emerald-400 text-white' : 'bg-red-500 border-red-400 text-white'
    }`}>
      {type === 'success' ? <ICONS.CheckCircle2 size={18} /> : <ICONS.Shield size={18} />}
      <span className="text-xs font-bold">{message}</span>
    </div>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [polls, setPolls] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [libraryFiles, setLibraryFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const refreshAll = useCallback(async (silent = false) => {
    const currentUser = db.get('user');
    if (!currentUser) {
      setLoading(false);
      return;
    }

    if (!silent) setLoading(true);
    try {
      const [p, s, a, c, b, stu, lib] = await Promise.all([
        api.polls.getAll(),
        api.schedules.getAll(),
        api.announcements.getAll(),
        api.clubs.getAll(),
        api.bookings.getAll(),
        api.students.getAll(),
        api.library.getAll()
      ]);
      setUser(currentUser);
      setPolls(p);
      setSchedules(s);
      setAnnouncements(a);
      setClubs(c);
      setBookings(b);
      setStudents(stu);
      setLibraryFiles(lib);
    } catch (err: any) {
      logger.error("Failed to sync app state", err);
      setToast({ message: "Network sync failed", type: 'error' });
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    db.init();
    refreshAll();
  }, [refreshAll]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = () => {
    api.auth.logout();
    setUser(null);
  };

  if (loading && !user && db.get('user')) return <GlobalLoader />;

  return (
    <Router>
      <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 relative overflow-hidden">
        {loading && <GlobalLoader />}
        {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        
        <BottomNav />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 lg:px-8 py-6 lg:py-10 pb-24 lg:pb-10">
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/" /> : <LoginView onLogin={(u) => { setUser(u); refreshAll(); }} />} />
            
            <Route path="/" element={user ? <HomeView announcements={announcements} schedules={schedules} onRefresh={() => refreshAll(true)} /> : <Navigate to="/login" />} />
            <Route path="/schedule" element={user ? <ScheduleView schedules={schedules} /> : <Navigate to="/login" />} />
            <Route path="/clubs" element={user ? <ClubsView clubs={clubs} /> : <Navigate to="/login" />} />
            <Route path="/library" element={user ? <LibraryView libraryFiles={libraryFiles} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <ProfileView user={user} pollsCount={polls.filter(p => !p.hasVoted && p.status === 'open').length} onLogout={handleLogout} /> : <Navigate to="/login" />} />
            
            <Route path="/profile/edit" element={user ? <EditProfileView user={user} onUpdate={(u) => { db.save('user', u); setUser(u); showToast("Profile updated"); }} /> : <Navigate to="/login" />} />
            <Route path="/profile/help" element={user ? <HelpSupportView /> : <Navigate to="/login" />} />
            <Route path="/profile/hostel" element={user ? <HostelBookingView user={user} onBook={async (b) => { 
              try { 
                await api.bookings.create(b); 
                showToast("Booking request sent");
                await refreshAll(true); 
              } catch (e: any) { showToast(e.message, 'error'); }
            }} /> : <Navigate to="/login" />} />
            <Route path="/profile/polls" element={user ? <PollsView polls={polls} onVote={async (id, option) => { 
              try {
                await api.polls.vote(id, option); 
                showToast("Vote recorded");
                await refreshAll(true);
              } catch (e: any) { showToast(e.message, 'error'); }
            }} /> : <Navigate to="/login" />} />
            
            {/* Protected Admin Route */}
            <Route path="/admin" element={user?.role === 'admin' ? (
              <AdminDashboardView 
                  polls={polls} 
                  schedules={schedules}
                  announcements={announcements}
                  clubs={clubs}
                  bookings={bookings}
                  students={students}
                  libraryFiles={libraryFiles}
                  onUpdate={() => { refreshAll(true); showToast("Database updated"); }}
              />
            ) : <Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
