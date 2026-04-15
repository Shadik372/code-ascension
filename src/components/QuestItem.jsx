import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { setInterval, clearInterval } from 'worker-timers'; 

const getTypeIcon = (type) => {
  const icons = { MCQ: '[M]', Concept: '[C]', Debug: '[D]', Project: '[P]', Boss: '[B]' };
  return icons[type] || '[X]';
};

const QuestItem = ({ quest, onComplete, onDelete, isActiveList }) => {
  const [isTracking, setIsTracking] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  useEffect(() => {
    let intervalId;
    if (isTracking) {
      intervalId = setInterval(() => setTimeSpent((prev) => prev + 1), 1000);
    }
    return () => clearInterval(intervalId);
  }, [isTracking]);

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const s = (totalSeconds % 60).toString().padStart(2, '0');
    return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98, x: -10 }}
      animate={{ opacity: 1, scale: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: 20 }}
      className="group relative flex items-center justify-between p-4 bg-[#050505]/60 hover:bg-[#0a0a0a] border border-white/5 border-l-2 border-l-cyan-500 hover:border-cyan-500/50 transition-colors"
    >
      <div className="flex items-center gap-4 flex-1">
        <span className="text-lg font-mono font-bold text-cyan-600/50 group-hover:text-cyan-400 transition-colors">
          {getTypeIcon(quest.type)}
        </span>

        <div className="flex flex-col">
          <h3 className="text-base font-bold text-slate-200 tracking-wide m-0 leading-tight uppercase font-sans">
            {quest.title}
          </h3>

          <div className="flex items-center gap-4 mt-2 text-[10px] font-mono tracking-widest uppercase">
            <span className={`flex items-center gap-1 ${
              quest.difficulty === 'Hard' ? 'text-red-400' :
              quest.difficulty === 'Medium' ? 'text-amber-400' :
              'text-green-400'
            }`}>
              <span className="w-1 h-1 bg-current rounded-full animate-pulse" />
              {quest.difficulty}
            </span>

            <span className="text-cyan-500">
              +{quest.xpValue} DATA
            </span>

            {isActiveList && (
              <div className={`flex items-center gap-2 transition-all duration-300 ${
                isTracking ? 'text-red-400' : 'text-slate-500'
              }`}>
                <span className="text-[10px]">T-MINUS</span>
                <span className={`w-[45px] ${isTracking ? 'font-bold text-red-400' : ''}`}>
                  {formatTime(timeSpent)}
                </span>
                
                <div 
                  role="button"
                  onClick={() => setIsTracking(!isTracking)}
                  className="w-5 h-5 flex items-center justify-center border border-current hover:bg-current hover:text-black transition-colors cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="currentColor">
                    <motion.path
                      initial={false}
                      animate={{ d: isTracking ? "M 6 5 L 6 19 L 10 19 L 10 5 Z" : "M 7 5 L 7 12 L 19 12 L 19 12 Z" }}
                      transition={{ duration: 0.2 }}
                    />
                    <motion.path
                      initial={false}
                      animate={{ d: isTracking ? "M 14 5 L 14 19 L 18 19 L 18 5 Z" : "M 7 12 L 7 19 L 19 12 L 19 12 Z" }}
                      transition={{ duration: 0.2 }}
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity ml-4">
        {isActiveList && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete(quest.id, quest.xpValue)}
            className="px-3 py-1.5 border border-cyan-500 text-cyan-400 text-[10px] uppercase font-bold tracking-widest hover:bg-cyan-500 hover:text-black transition-all"
          >
            Execute
          </motion.button>
        )}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(quest.id)}
          className="w-8 h-8 flex items-center justify-center border border-white/10 text-slate-500 hover:border-red-500/50 hover:text-red-400 transition-colors"
        >
          ✕
        </motion.button>
      </div>
    </motion.div>
  );
};

export default QuestItem;