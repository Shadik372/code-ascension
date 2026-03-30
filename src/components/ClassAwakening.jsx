import React from 'react';

const CLASSES = [
  {
    id: 'Shadow Mage',
    icon: '🌑',
    title: 'Shadow Mage',
    desc: 'Master of arcane theory. Gain +50% XP from Concept & MCQ quests.',
    color: '#9c27b0' // Purple
  },
  {
    id: 'Assassin',
    icon: '🗡️',
    title: 'Shadow Assassin',
    desc: 'Swift and deadly. Gain +50% XP from Debug & Easy quests.',
    color: '#f44336' // Red
  },
  {
    id: 'Iron Tank',
    icon: '🛡️',
    title: 'Iron Tank',
    desc: 'Unbreakable focus. Gain +50% XP from Boss Battles & Hard quests.',
    color: '#2196f3' // Blue
  },
  {
    id: 'Architect',
    icon: '🏗️',
    title: 'The Architect',
    desc: 'Creator of worlds. Gain +50% XP from Project quests.',
    color: '#ff9800' // Orange
  }
];

const ClassAwakening = ({ playerClass, level, onSelectClass }) => {
  // If they already have a class, or aren't level 3 yet, hide this component
  if (playerClass !== 'None' || level < 3) return null;

  return (
    <div className="system-alert-overlay">
      <div className="system-alert-box">
        <div className="system-header">
          <span className="blink-text">⚠️ SYSTEM ALERT ⚠️</span>
        </div>
        
        <h2>JOB CHANGE QUEST COMPLETE</h2>
        <p>Player has reached Level 3. The time for your Awakening has come. Choose your path wisely, Hunter.</p>

        <div className="class-grid">
          {CLASSES.map(cls => (
            <div 
              key={cls.id} 
              className="class-card" 
              style={{ '--theme-color': cls.color }}
              onClick={() => onSelectClass(cls.id)}
            >
              <div className="class-icon">{cls.icon}</div>
              <h3>{cls.title}</h3>
              <p>{cls.desc}</p>
              <button className="btn-awaken">Awaken</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClassAwakening;