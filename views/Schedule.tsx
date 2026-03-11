
import React, { useState } from 'react';
import { ICONS } from '../constants';
import { ClassSchedule } from '../types';

interface ScheduleViewProps {
  schedules: ClassSchedule[];
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ schedules }) => {
  const [selectedDay, setSelectedDay] = useState(2); // Wednesday

  const days = [
    { name: 'Mon', date: 19 },
    { name: 'Tue', date: 20 },
    { name: 'Wed', date: 21 },
    { name: 'Thu', date: 22 },
    { name: 'Fri', date: 23 },
    { name: 'Sat', date: 24 },
    { name: 'Sun', date: 25 },
  ];

  const currentDayName = days[selectedDay].name;
  const filteredSchedules = schedules.filter(s => s.day_of_week.startsWith(currentDayName));

  return (
    <div className="flex-1 p-6 animate-fade-in no-scrollbar overflow-y-auto">
      <div className="mb-6">
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">January 2026</p>
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-slate-900">Timetable</h1>
            <div className="flex gap-2">
                <button className="p-2 bg-white rounded-xl border border-slate-100 shadow-sm"><ICONS.Search size={18} /></button>
            </div>
        </div>
      </div>

      {/* Date Picker */}
      <div className="flex justify-between mb-8 overflow-x-auto no-scrollbar pb-2">
        {days.map((day, idx) => (
          <button
            key={day.name}
            onClick={() => setSelectedDay(idx)}
            className={`flex flex-col items-center gap-2 min-w-[48px] transition-all ${
              selectedDay === idx ? '' : 'opacity-60'
            }`}
          >
            <span className={`text-[10px] font-bold uppercase tracking-wider ${selectedDay === idx ? 'text-[#0088CC]' : 'text-slate-400'}`}>
              {day.name}
            </span>
            <div className={`w-11 h-11 rounded-[1.2rem] flex items-center justify-center font-bold text-sm transition-all duration-300 ${
              selectedDay === idx ? 'bg-[#0088CC] text-white shadow-lg shadow-blue-100' : 'bg-white border border-slate-100'
            }`}>
              {day.date}
            </div>
          </button>
        ))}
      </div>

      <div className="mb-6">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{filteredSchedules.length} CLASSES ON {currentDayName.toUpperCase()}</span>
      </div>

      {/* Schedule List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {filteredSchedules.length > 0 ? filteredSchedules.map((cls) => (
          <div key={cls.id} className="flex gap-4 lg:gap-6">
            <div className="flex flex-col items-center pt-1 min-w-[50px]">
              <span className="text-sm font-black text-slate-900 leading-none">{cls.start_time.split(':')[0]}</span>
              <span className="text-[10px] font-bold text-slate-400 mt-1 uppercase">AM</span>
              <div className="w-0.5 h-16 bg-slate-100 my-2 rounded-full"></div>
            </div>
            
            <div className="flex-1 bg-white rounded-3xl p-5 shadow-sm border border-slate-100 relative overflow-hidden group active:scale-[0.98] transition-transform">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#0088CC]"></div>
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start">
                    <span className="bg-blue-50 text-[#0088CC] text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">{cls.course_id}</span>
                    <span className="text-[10px] font-bold text-slate-400">{cls.start_time} - {cls.end_time}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-lg leading-tight">{cls.course_name}</h3>
                <div className="flex flex-col gap-1.5 mt-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-bold uppercase tracking-wide">
                        <ICONS.Building size={14} className="text-[#0088CC]" />
                        {cls.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <ICONS.User size={14} className="text-[#0088CC]" />
                        {cls.instructor_name}
                    </div>
                </div>
              </div>
            </div>
          </div>
        )) : (
            <div className="py-20 flex flex-col items-center justify-center text-slate-300">
                <ICONS.Calendar size={48} strokeWidth={1} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest">No classes today</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleView;
