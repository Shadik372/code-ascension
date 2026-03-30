import QuestItem from './QuestItem';

const QuestList = ({ title, quests, onComplete, onDelete, isActiveList }) => {
  return (
    <div className="card">
      <h2>{title}</h2>
      {quests.length === 0 ? (
        <p style={{ color: '#9e9e9e' }}>No quests here. Time to rest!</p>
      ) : (
        quests.map(quest => (
          <QuestItem 
            key={quest.id} 
            quest={quest} 
            onComplete={onComplete} 
            onDelete={onDelete} 
            isActiveList={isActiveList}
          />
        ))
      )}
    </div>
  );
};

export default QuestList;