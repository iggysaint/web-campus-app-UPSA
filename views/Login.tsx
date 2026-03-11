
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS, COLORS } from '../constants';
import { api } from '../services/api';

interface LoginViewProps {
  onLogin: (user: any) => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await api.auth.login(email, password);
      onLogin(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-white flex flex-col p-8 animate-fade-in justify-center min-h-screen">
      <div className="flex flex-col items-center mb-12">
        <div className="w-20 h-20 bg-blue-50 rounded-[2.5rem] flex items-center justify-center text-[#0088CC] mb-6 shadow-xl shadow-blue-100">
            <ICONS.Shield size={40} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight text-center">UPSA MERIX</h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Campus Management System</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6 max-w-sm mx-auto w-full">
        {error && (
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-fade-in">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-red-500 shadow-sm">
                    <span className="font-black text-xs">!</span>
                </div>
                <p className="text-xs font-bold text-red-600">{error}</p>
            </div>
        )}

        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Academic Email</label>
            <div className="relative">
                <ICONS.Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="email" 
                    placeholder="e.g. name@upsa.edu.gh" 
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>
        </div>

        <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
                <ICONS.Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-100 transition-all"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />
            </div>
        </div>

        <button 
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg ${loading ? 'bg-slate-100 text-slate-400' : 'bg-[#0088CC] text-white shadow-blue-100 active:scale-95'}`}
        >
            {loading ? 'Authenticating...' : 'Sign In'}
        </button>

        <div className="pt-4 text-center">
            <p className="text-xs text-slate-400 font-medium">Use <b>admin@upsa.edu.gh</b> or <b>student@upsa.edu.gh</b> (Pass: password123) for testing</p>
        </div>
      </form>

      <div className="absolute bottom-8 left-0 right-0 text-center opacity-30">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by SRC Tech Hub</p>
      </div>
    </div>
  );
};

export default LoginView;
