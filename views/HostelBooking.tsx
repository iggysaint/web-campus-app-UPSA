
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { hostels } from '../mockData';
import { ICONS } from '../constants';
import { Gender, Hostel, User, HostelBooking } from '../types';

interface HostelBookingProps {
  user: User;
  onBook: (booking: HostelBooking) => void;
}

const HostelBookingView: React.FC<HostelBookingProps> = ({ user, onBook }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedGender, setSelectedGender] = useState<Gender>(user.gender);
  const [selectedHostel, setSelectedHostel] = useState<Hostel | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

  const floors = useMemo(() => {
    if (!selectedHostel) return [];
    const arr = [];
    for (let i = 0; i < selectedHostel.total_floors; i++) {
      const isMaleFloor = i === 0 || i % 2 === 0;
      const floorGender = isMaleFloor ? 'male' : 'female';
      if (floorGender === selectedGender) {
        arr.push({ number: i });
      }
    }
    return arr;
  }, [selectedHostel, selectedGender]);

  const roomsOnFloor = useMemo(() => {
    if (selectedFloor === null) return [];
    const arr = [];
    const base = selectedFloor * 100;
    for (let i = 1; i <= 50; i++) {
        const roomNum = base + i;
        const lastTwo = roomNum % 100;
        const type = (lastTwo === 15 || lastTwo === 44) ? '2-bed' : '4-bed';
        arr.push({ number: roomNum, type });
    }
    return arr;
  }, [selectedFloor]);

  const currentPrice = useMemo(() => {
    if (!selectedRoom) return 0;
    const lastTwo = selectedRoom % 100;
    return (lastTwo === 15 || lastTwo === 44) ? 3850 : 2650;
  }, [selectedRoom]);

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step === 1) navigate('/profile');
    else setStep(step - 1);
  };

  const handleConfirm = () => {
    const newBooking: HostelBooking = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      hostelId: selectedHostel!.id,
      hostelName: selectedHostel!.name,
      roomNumber: selectedRoom!,
      price: currentPrice,
      status: 'pending',
      date: new Date().toISOString().split('T')[0]
    };
    onBook(newBooking);
    if (window.navigator.vibrate) window.navigator.vibrate(20);
    navigate('/profile');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900">Verify Gender</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              {(['male', 'female'] as Gender[]).map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGender(g)}
                  className={`w-full p-6 rounded-3xl border-2 flex items-center justify-between transition-all hover:shadow-md ${
                    selectedGender === g ? 'border-[#0088CC] bg-blue-50/50' : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${g === 'male' ? 'bg-blue-100 text-[#0088CC]' : 'bg-pink-100 text-pink-500'}`}>
                      <ICONS.User size={24} />
                    </div>
                    <p className="font-bold text-slate-900 capitalize">{g}</p>
                  </div>
                  {selectedGender === g && <ICONS.CheckCircle2 className="text-[#0088CC]" />}
                </button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900">Choose Hostel</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {hostels.map((h) => (
                <button
                  key={h.id}
                  onClick={() => { setSelectedHostel(h); setSelectedFloor(null); setSelectedRoom(null); }}
                  className={`w-full p-5 rounded-3xl border-2 flex items-center gap-4 transition-all hover:shadow-md ${
                    selectedHostel?.id === h.id ? 'border-[#0088CC] bg-blue-50/50' : 'border-slate-100 bg-white'
                  }`}
                >
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
                    <ICONS.Building size={28} />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold text-slate-900">{h.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{h.total_floors} floors</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900">Select Floor</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {floors.map((f) => (
                <button
                  key={f.number}
                  onClick={() => { setSelectedFloor(f.number); setSelectedRoom(null); }}
                  className={`w-full p-5 rounded-3xl border-2 flex flex-col items-center justify-center transition-all hover:shadow-md ${
                    selectedFloor === f.number ? 'border-[#0088CC] bg-blue-50/50' : 'border-slate-100 bg-white'
                  }`}
                >
                  <span className="text-2xl font-black text-slate-900">{f.number}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Floor</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-slate-900">Room Number</h2>
            <div className="grid grid-cols-4 lg:grid-cols-8 gap-3 max-h-[400px] overflow-y-auto no-scrollbar pb-4 pr-1">
              {roomsOnFloor.map((r) => (
                <button
                  key={r.number}
                  onClick={() => setSelectedRoom(r.number)}
                  className={`py-3 rounded-2xl border flex flex-col items-center justify-center transition-all ${
                    selectedRoom === r.number 
                        ? 'bg-[#0088CC] border-[#0088CC] text-white shadow-lg' 
                        : r.type === '2-bed' 
                            ? 'bg-amber-50 border-amber-200' 
                            : 'bg-white border-slate-100 text-slate-900'
                  }`}
                >
                  <span className="text-sm font-bold">{r.number}</span>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${selectedRoom === r.number ? 'text-white/80' : 'text-slate-400'}`}>{r.type}</span>
                </button>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="flex flex-col gap-8">
            <h2 className="text-xl font-bold text-slate-900">Confirm Booking</h2>
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
                <div className="divide-y divide-slate-50">
                    <div className="flex justify-between p-6"><span className="text-slate-400">Hostel</span><span className="font-bold">{selectedHostel?.name}</span></div>
                    <div className="flex justify-between p-6"><span className="text-slate-400">Room</span><span className="font-bold">Floor {selectedFloor}, #{selectedRoom}</span></div>
                    <div className="flex justify-between p-6 bg-blue-50/30"><span className="text-slate-400 font-medium">Price</span><span className="font-black text-2xl text-[#0088CC]">GHS {currentPrice.toLocaleString()}</span></div>
                </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col animate-fade-in relative h-full">
      <div className="p-6 pb-2 bg-white flex items-center justify-between">
        <button onClick={handleBack} className="p-2 -ml-2 hover:bg-slate-50 rounded-full transition-colors"><ICONS.ChevronRight size={24} className="rotate-180 text-slate-600" /></button>
        <h1 className="font-bold text-slate-900">Hostel Booking</h1>
        <div className="w-10"></div>
      </div>
      <div className="px-10 py-6 bg-white flex items-center justify-between">
        {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step >= s ? 'bg-[#0088CC] text-white shadow-lg shadow-blue-100' : 'bg-slate-100 text-slate-400'}`}>{step > s ? <ICONS.CheckCircle2 size={16} /> : s}</div>
        ))}
      </div>
      <div className="flex-1 p-6 overflow-y-auto no-scrollbar">{renderStep()}</div>
      <div className="p-6 bg-white border-t border-slate-100">
        <button
          onClick={step === 5 ? handleConfirm : handleNext}
          className={`w-full py-4 rounded-2xl font-bold text-white transition-all bg-[#0088CC] shadow-lg shadow-blue-100 active:scale-95`}
        >
          {step === 5 ? 'Confirm & Book' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default HostelBookingView;
