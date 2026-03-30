import { motion } from 'framer-motion';

const Dashboard = ({ level, xp, nextXp, progress, gold, streak, playerClass, prestige }) => {
  return (
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
      {/* Subtle background glow behind the card */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        
        {/* Player Identity */}
        <div className="flex items-center gap-6">
          <div className="relative flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-white/20 text-3xl font-black text-white">
            {level}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              {playerClass === 'None' ? 'Novice' : playerClass}
            </h2>
            <p className="text-indigo-300 font-medium text-sm tracking-widest uppercase mt-1">
              Prestige {prestige > 0 ? `⭐${prestige}` : '0'}
            </p>
          </div>
        </div>

        {/* Core Stats Grid */}
        <div className="grid grid-cols-3 gap-4 md:gap-8 w-full md:w-auto">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Total XP</span>
            <span className="text-xl font-bold text-white">{xp}</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Gold</span>
            <span className="text-xl font-bold text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">{gold} 🪙</span>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Streak</span>
            <span className="text-xl font-bold text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]">{streak} 🔥</span>
          </div>
        </div>
      </div>

      {/* Animated Progress Bar */}
      <div className="mt-8 relative z-10">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          <span>XP Progress</span>
          <span className="text-slate-300">{xp} / {nextXp}</span>
        </div>
        <div className="h-3 w-full bg-slate-800/50 rounded-full overflow-hidden border border-white/5 inset-shadow-sm">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;