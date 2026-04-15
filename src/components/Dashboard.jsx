import { motion } from 'framer-motion';

const Dashboard = ({ level, xp, nextXp, progress, gold, streak, playerClass, prestige }) => {
  return (
    <div className="relative bg-[#050505]/90 backdrop-blur-xl border border-cyan-900/50 p-6 md:p-8 shadow-[0_0_30px_rgba(6,182,212,0.1)] overflow-hidden">
      
      {/* Animus Blueprint Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />
      
      {/* Subtle Cyan ambient glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative HUD Corner Brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/40 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/40 pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
        
        {/* Player Identity (Subject Sync) */}
        <div className="flex items-center gap-8">
          
          {/* Diamond Level Indicator */}
          <div className="relative flex items-center justify-center w-16 h-16">
            <motion.div 
              animate={{ rotate: [45, 45, 135, 135, 45] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 border border-cyan-500/30 rotate-45"
            />
            <div className="absolute inset-2 bg-cyan-950/50 border border-cyan-400 rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]" />
            <span className="relative z-10 text-2xl font-black text-cyan-50 font-mono tracking-tighter">
              {level}
            </span>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white tracking-[0.2em] uppercase">
              {playerClass === 'None' ? 'Unassigned Subject' : playerClass}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 bg-cyan-500 rounded-none animate-pulse" />
              <p className="text-cyan-500/80 font-mono text-xs tracking-widest uppercase">
                Sync Level: {prestige > 0 ? `Tier ${prestige}` : 'Base'}
              </p>
            </div>
          </div>
        </div>

        {/* Core Stats Grid (Database Style) */}
        <div className="grid grid-cols-3 gap-6 md:gap-10 w-full md:w-auto font-mono">
          <div className="flex flex-col items-center md:items-start border-l border-white/10 pl-4">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Total Data</span>
            <span className="text-lg font-bold text-white tracking-wider">{xp}</span>
          </div>
          <div className="flex flex-col items-center md:items-start border-l border-white/10 pl-4">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Credits</span>
            <span className="text-lg font-bold text-amber-500/90 tracking-wider drop-shadow-[0_0_5px_rgba(245,158,11,0.3)]">
              {gold}
            </span>
          </div>
          <div className="flex flex-col items-center md:items-start border-l border-white/10 pl-4">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-1">Sequence</span>
            <span className="text-lg font-bold text-red-500/90 tracking-wider drop-shadow-[0_0_5px_rgba(239,68,68,0.3)]">
              {streak}
            </span>
          </div>
        </div>
      </div>

      {/* Sharp Memory Sync Progress Bar */}
      <div className="mt-10 relative z-10">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-cyan-500/70 mb-2 font-mono">
          <span>Memory Synchronization</span>
          <span className="text-white/70">{xp} / {nextXp}</span>
        </div>
        
        {/* Progress Track */}
        <div className="h-1.5 w-full bg-white/5 border-y border-white/10 relative overflow-hidden">
          {/* Animated Fill */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-0 left-0 h-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
          />
          {/* Scanning Line overlay */}
          <motion.div 
            animate={{ x: ["-100%", "1000%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent"
          />
        </div>
      </div>
      
    </div>
  );
};

export default Dashboard;