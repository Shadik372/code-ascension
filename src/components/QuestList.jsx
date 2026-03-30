import QuestItem from './QuestItem';
import { AnimatePresence } from 'framer-motion';

const QuestList = ({ title, quests, onComplete, onDelete, isActiveList }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      {quests.length === 0 ? (
        <p style={{ color: '#9e9e9e' }}>No quests here. Time to rest!</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <AnimatePresence mode="popLayout">
            {quests.map(quest => (
              <QuestItem 
                key={quest.id} 
                quest={quest} 
                onComplete={onComplete} 
                onDelete={onDelete} 
                isActiveList={isActiveList}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default QuestList;