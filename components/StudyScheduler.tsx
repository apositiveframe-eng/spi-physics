
import React, { useState, useEffect } from 'react';
import { Calendar, Target, ChevronRight, Clock, Star } from 'lucide-react';
import { courseData } from '../data/courseContent';

const StudyScheduler: React.FC = () => {
  const [examDate, setExamDate] = useState(() => {
    return localStorage.getItem('em-exam-target-date') || '';
  });
  const [schedule, setSchedule] = useState<any[]>([]);

  useEffect(() => {
      if (examDate) {
          localStorage.setItem('em-exam-target-date', examDate);
          generateSchedule();
      }
  }, [examDate]);

  const generateSchedule = () => {
    if (!examDate) return;
    const target = new Date(examDate);
    const start = new Date();
    const diffTime = Math.abs(target.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const totalModules = courseData.length;
    const daysPerModule = Math.floor(diffDays / totalModules);

    const newSchedule = courseData.map((m, i) => {
      const moduleStart = new Date(start);
      moduleStart.setDate(start.getDate() + (i * daysPerModule));
      return {
        module: m.title,
        date: moduleStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        status: i === 0 ? 'Current' : 'Locked'
      };
    });
    setSchedule(newSchedule);
  };

  return (
    <div className="glass-panel p-10 rounded-[3rem] border-gold-main/10 bg-dark-secondary/40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div className="space-y-2">
            <h3 className="text-2xl font-display font-black text-white uppercase tracking-widest">Vector Timeline</h3>
            <p className="text-xs text-text-muted font-sans uppercase tracking-widest opacity-60">Strategic prep alignment protocol.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
            <input 
                type="date" 
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white text-sm focus:border-gold-main outline-none"
            />
            <button 
                onClick={generateSchedule}
                className="btn-gold px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-gold-bright"
            >
                Initialize
            </button>
        </div>
      </div>

      <div className="relative">
         {schedule.length > 0 ? (
            <div className="space-y-6">
                {schedule.map((item, i) => (
                    <div key={i} className="flex items-center gap-6 group">
                        <div className="text-[10px] font-mono text-gold-main w-20 opacity-50">{item.date}</div>
                        <div className="relative flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full border-2 transition-all ${i === 0 ? 'bg-gold-main border-gold-main shadow-gold' : 'border-white/10 bg-transparent'}`} />
                            {i < schedule.length - 1 && <div className="w-0.5 h-12 bg-white/5" />}
                        </div>
                        <div className={`flex-1 p-5 rounded-2xl border transition-all ${i === 0 ? 'bg-gold-main/10 border-gold-main/30' : 'bg-white/5 border-transparent opacity-40'}`}>
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-bold text-white uppercase tracking-wide truncate max-w-[200px]">{item.module}</span>
                                {i === 0 && <span className="text-[8px] bg-gold-main text-dark-primary px-2 py-0.5 rounded-full font-black uppercase tracking-widest">Active Vector</span>}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
                <Calendar className="w-16 h-16 text-gold-main mb-6" />
                <p className="text-[10px] font-black uppercase tracking-[0.5em]">Set your exam date to visualize trajectory</p>
            </div>
         )}
      </div>
    </div>
  );
};

export default StudyScheduler;
