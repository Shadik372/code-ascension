import { motion } from 'framer-motion';

// Helper for type icons
const getTypeIcon = (type) => {
  const icons = { MCQ: '📝', Concept: '🧠', Debug: '🐛', Project: '🏗️', Boss: '🐉' };
  return icons[type] || '🎯';
};

const QuestItem = ({ quest, onComplete, onDelete, isActiveList }) => {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      whileHover={{ y: -2 }}
      className="group relative flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-indigo-500/50 rounded-xl transition-colors shadow-lg"
    >
      {/* Left Side: Info */}
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 flex items-center justify-center bg-slate-800/80 rounded-lg text-xl shadow-inner border border-white/5">
          {getTypeIcon(quest.type)}
        </div>
        <div>
          <h3 className={`font-semibold text-lg ${!isActiveList ? 'line-through text-slate-500' : 'text-slate-100'}`}>
            {quest.title}
          </h3>
          <div className="flex gap-2 mt-1 text-xs font-medium tracking-wider">
            <span className="text-slate-400 bg-slate-900/50 px-2 py-0.5 rounded border border-white/5">{quest.difficulty}</span>
            <span className="text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.3)]">+{quest.xpValue} XP</span>
          </div>
        </div>
      </div>
      
      {/* Right Side: Actions */}
      <div className="flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
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