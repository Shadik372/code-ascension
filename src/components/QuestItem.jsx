const QuestItem = ({ quest, onComplete, onDelete, isActiveList }) => {
  return (
    <div className="quest-item">
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
            onClick={() => onComplete(quest.id, quest.xpValue)}
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
    </div>
  );
};

export default QuestItem;