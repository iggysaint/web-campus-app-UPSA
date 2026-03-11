
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../constants';

const HelpSupportView: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (window.navigator.vibrate) window.navigator.vibrate(10);
  };

  if (submitted) {
    return (
        <div className="flex-1 bg-white flex flex-col items-center justify-center p-10 text-center animate-fade-in">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mb-6">
                <ICONS.CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Ticket Received</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
                Our support team will review your message and get back to you within 24 hours.
            </p>
            <button 
                onClick={() => navigate('/profile')}
                className="bg-[#0088CC] text-white px-8 py-3 rounded-2xl font-bold active:scale-95 transition-transform"
            >
                Back to Profile
            </button>
        </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 flex flex-col animate-fade-in">
      <div className="p-6 bg-white flex items-center justify-between shadow-sm">
        <button onClick={() => navigate('/profile')} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors">
          <ICONS.ChevronRight size={24} className="rotate-180 text-slate-600" />
        </button>
        <h1 className="font-bold text-slate-900">Help & Support</h1>
        <div className="w-10"></div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 overflow-y-auto no-scrollbar">
        <div className="space-y-8">
            <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Need assistance?</h2>
                <p className="text-sm text-slate-500">Submit a support ticket and we'll help you resolve any campus app issues.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Subject</label>
                    <div className="relative">
                        <select className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all appearance-none">
                            <option>Technical Issue</option>
                            <option>Hostel Booking Problem</option>
                            <option>Account Access</option>
                            <option>General Inquiry</option>
                        </select>
                        <ICONS.ChevronRight size={18} className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                    <textarea 
                        rows={6}
                        required
                        placeholder="Describe your issue in detail..."
                        className="w-full bg-white border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-[#0088CC] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-[0.98] transition-all mt-4 hover:shadow-xl"
                >
                    Send Message
                </button>
            </form>
        </div>

        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2 invisible lg:visible">Quick Support</h2>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-blue-50 text-[#0088CC] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ICONS.HelpCircle size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">FAQs</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Common questions</p>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <ICONS.User size={24} />
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Contact</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Talk to SRC</p>
                </div>
            </div>

            <div className="hidden lg:block bg-blue-50 p-6 rounded-3xl border border-blue-100">
                <h4 className="font-bold text-[#0088CC] mb-2">Support Hours</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                    Our team is available Monday to Friday, 8:00 AM - 5:00 PM. 
                    Urgent tickets are prioritized.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HelpSupportView;
