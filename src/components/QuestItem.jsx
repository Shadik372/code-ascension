import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { setInterval, clearInterval } from 'worker-timers'; // The S-Rank Timer tool!

// Helper for type icons
const getTypeIcon = (type) => {
  const icons = { MCQ: '📝', Concept: '🧠', Debug: '🐛', Project: '🏗️', Boss: '🐉' };
  return icons[type] || '🎯';
};

const QuestItem = ({ quest, onComplete, onDelete, isActiveList }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // The Stopwatch Logic
  useEffect(() => {
    let intervalId;
    if (isTracking) {
      intervalId = setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isTracking]);

  // Format the time into MM:SS or HH:MM:SS
  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      whileHover={{ y: -2 }}
      className="group relative flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-indigo-500/50 rounded-xl transition-colors shadow-lg"
    >
      {/* Left Side: Icon & Info */}
      <div className="flex items-center gap-4 flex-1">
        <span className="text-3xl drop-shadow-md">{getTypeIcon(quest.type)}</span>

        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white tracking-wide m-0 leading-tight">{quest.title}</h3>

          <div className="flex items-center gap-3 mt-2 text-xs font-medium tracking-wider">
            {/* Threat-Level Badge */}
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border backdrop-blur-sm ${quest.difficulty === 'Hard' ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-[0_0_8px_rgba(239,68,68,0.2)]' :
                quest.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                  'bg-green-500/10 text-green-400 border-green-500/30 shadow-[0_0_8px_rgba(34,197,94,0.2)]'
              }`}>
              {quest.difficulty || 'Easy'}
            </span>

            {/* XP Value */}
            <span className="text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.3)]">
              +{quest.xpValue} XP
            </span>
           {/* Minimalist Stopwatch with Morphing Button */}
            {isActiveList && (
              <div className={`ml-2 flex items-center gap-1 px-2 py-1 rounded-md border transition-all duration-300 ${
                isTracking 
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.1)]' 
                  : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20 hover:bg-white/10'
              }`}>
                {/* Visual Indicator */}
                <svg className="w-3 h-3 opacity-70 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

                {/* The Ticking Clock */}
                <span className={`font-mono text-[11px] tracking-wider w-[38px] text-center ${
                  isTracking ? 'font-bold' : 'font-medium'
                }`}>
                  {formatTime(timeSpent)}
                </span>
                
                {/* Framer Motion Morphing Button (Bypasses global CSS) */}
                <div 
                  role="button"
                  onClick={() => setIsTracking(!isTracking)}
                  className={`w-6 h-6 flex items-center justify-center rounded transition-all cursor-pointer ${
                    isTracking 
                      ? 'text-red-400 hover:bg-red-500/20' 
                      : 'text-slate-300 hover:text-indigo-400 hover:bg-indigo-500/20'
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 ml-[1px]" fill="currentColor">
                    {/* Top half of Play morphs into Left bar of Pause */}
                    <motion.path
                      initial={false}
                      animate={{ d: isTracking ? "M 6 5 L 6 19 L 10 19 L 10 5 Z" : "M 7 5 L 7 12 L 19 12 L 19 12 Z" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                    {/* Bottom half of Play morphs into Right bar of Pause */}
                    <motion.path
                      initial={false}
                      animate={{ d: isTracking ? "M 14 5 L 14 19 L 18 19 L 18 5 Z" : "M 7 12 L 7 19 L 19 12 L 19 12 Z" }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Side: Actions */}
      <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-4">
        {isActiveList && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete(quest.id, quest.xpValue)}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-bold rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_20px_rgba(16,185,129,0.5)] transition-all"
          >
            Complete
          </motion.button>
        )}
        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(quest.id)}
          className="w-9 h-9 flex items-center justify-center bg-slate-800/50 hover:text-red-400 text-slate-400 rounded-lg transition-colors border border-white/5"
        >
          ✕
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuestItem;