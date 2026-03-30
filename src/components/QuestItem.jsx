import { motion } from 'framer-motion';

const QuestItem = ({ quest, onComplete, onDelete, isActiveList }) => {
  return (
    <motion.div 
      className="quest-item"
      layout /* This tells the item to smoothly slide up if the item above it is deleted */
      initial={{ opacity: 0, x: -50, scale: 0.9 }} /* How it looks before it enters */
      animate={{ opacity: 1, x: 0, scale: 1 }}     /* How it looks when resting */
      exit={{ opacity: 0, scale: 0.5, x: 50 }}     /* How it animates out when deleted/completed */
      transition={{ duration: 0.2, type: 'spring', stiffness: 250, damping: 20 }}
    >
      <div className="quest-info">
        <h3 style={{ textDecoration: !isActiveList ? 'line-through' : 'none', color: !isActiveList ? '#777' : '#fff' }}>
          {quest.title}
        </h3>
        <div className="quest-meta">
          <span className="badge">{quest.type}</span>
          <span className="badge">{quest.difficulty}</span>
          <span className="text-gold">+{quest.xpValue} XP</span>
        </div>
      </div>
      
      <div className="quest-actions">
        {isActiveList && (
          <button 
            className="btn-complete" 
            onClick={() => onComplete(quest.id, quest.xpValue, quest.type, quest.difficulty)}
          >
            Complete
          </button>
        )}
        <button 
          className="btn-delete" 
          onClick={() => onDelete(quest.id)}
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

export default QuestItem;