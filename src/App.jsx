import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import QuestForm from './components/QuestForm';
import QuestList from './components/QuestList';
import PomodoroBoss from './components/PomodoroBoss';
import StatsChart from './components/StatsChart';
import LootShop from './components/LootShop';
import ClassAwakening from './components/ClassAwakening';
import './App.css';

// XP threshold logic
const LEVEL_THRESHOLDS = [0, 100, 250, 500, 900];

function App() {
  // Initialize state from local storage or set defaults
  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem('ca-quests');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [xp, setXp] = useState(() => {
    return Number(localStorage.getItem('ca-xp')) || 0;
  });

  const [streak, setStreak] = useState(() => {
    return Number(localStorage.getItem('ca-streak')) || 0;
  });

  // Calculate Level and Progress based on XP
  const getLevelData = (currentXp) => {
    let level = 1;
    let nextXp = LEVEL_THRESHOLDS[1];
    let prevXp = 0;

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (currentXp >= LEVEL_THRESHOLDS[i]) {
        level = i + 1;
        prevXp = LEVEL_THRESHOLDS[i];
        // Handle max level cap safely
        nextXp = LEVEL_THRESHOLDS[i + 1] || LEVEL_THRESHOLDS[i]; 
      }
    }

    const progress = level < 5 
      ? ((currentXp - prevXp) / (nextXp - prevXp)) * 100 
      : 100;

    return { level, progress, nextXp };
  };

  const { level, progress, nextXp } = getLevelData(xp);

  const [spentGold, setSpentGold] = useState(() => {
    return Number(localStorage.getItem('ca-spent-gold')) || 0;
  });

  const [playerClass, setPlayerClass] = useState(() => {
    return localStorage.getItem('ca-class') || 'None';
  });

  const [prestige, setPrestige] = useState(() => {
    return Number(localStorage.getItem('ca-prestige')) || 0;
  });

  // Save to LocalStorage whenever critical state changes
 useEffect(() => {
    localStorage.setItem('ca-quests', JSON.stringify(quests));
    localStorage.setItem('ca-xp', xp);
    localStorage.setItem('ca-streak', streak);
    localStorage.setItem('ca-spent-gold', spentGold);
    localStorage.setItem('ca-class', playerClass);
    localStorage.setItem('ca-prestige', prestige); 
  }, [quests, xp, streak, spentGold, playerClass, prestige]);
  // Core Actions
  const addQuest = (newQuest) => {
    setQuests([...quests, { ...newQuest, id: Date.now(), completed: false }]);
  };

// Calculate bonus XP based on class
  const calculateXpWithBonus = (baseXp, type, difficulty, source = 'quest') => {
    let multiplier = 1;

    if (playerClass === 'Shadow Mage' && (type === 'Concept' || type === 'MCQ')) multiplier = 1.5;
    if (playerClass === 'Assassin' && (type === 'Debug' || difficulty === 'Easy')) multiplier = 1.5;
    if (playerClass === 'Architect' && type === 'Project') multiplier = 1.5;
    if (playerClass === 'Iron Tank' && (difficulty === 'Hard' || source === 'boss')) multiplier = 1.5;

    // Apply Prestige Bonus (+50% per Ascension level)
    const prestigeBonus = 1 + (prestige * 0.5);

    return Math.floor(baseXp * multiplier * prestigeBonus);
  };

  const completeQuest = (id, baseXp, type, difficulty) => {
    const finalXp = calculateXpWithBonus(baseXp, type, difficulty, 'quest');
    
    setQuests(quests.map(q => 
      q.id === id ? { ...q, completed: true, completedAt: Date.now() } : q
    ));
    
    const newXp = xp + finalXp;
    const newLevelData = getLevelData(newXp);
    
    if (newLevelData.level > level) {
      alert(`🎉 LEVEL UP! You are now Level ${newLevelData.level}!`);
    }
    setXp(newXp);
  };

  const deleteQuest = (id) => {
    setQuests(quests.filter(q => q.id !== id));
  };

  const incrementStreak = () => setStreak(streak + 1);
  const handleBossDefeat = (xpReward) => {
  const finalXp = calculateXpWithBonus(baseXp, 'Boss', 'Hard', 'boss'); 
  const newXp = xp + finalXp;
  const newLevelData = getLevelData(newXp);

  if (newLevelData.level > level) {
    alert(`🎉 LEVEL UP! You are now Level ${newLevelData.level}!`);
  }

  setXp(newXp);
};

  // Derived state
  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);
  
  // NEW GOLD LOGIC
  const lifetimeXp = xp + (prestige * 900); // 900 is the max level threshold
  const lifetimeGold = Math.floor(lifetimeXp * 0.5);
  const availableGold = lifetimeGold - spentGold;

  // NEW GAME + HANDLER
  const handleAscension = () => {
    if (level < 5) return;
    
    const confirm = window.confirm(
      "🌌 Ready to Ascend? This will wipe your current Quests and Level. \n\nYou will keep your Class, Gold, and Streak, and gain a permanent +50% XP boost. Proceed?"
    );

    if (confirm) {
      setPrestige(prestige + 1);
      setXp(0);
      setQuests([]); // Clears the board for the new run
      alert("🌌 ASCENSION COMPLETE! Welcome to New Game +");
    }
  };

  // NEW BUY HANDLER
  const handleBuyReward = (cost, itemName) => {
    if (availableGold >= cost) {
      setSpentGold(spentGold + cost);
      alert(`🛍️ Purchase successful! Go enjoy your: ${itemName}`);
    }
  };

  return (
    <div className="app-container">
      <ClassAwakening 
        playerClass={playerClass} 
        level={level} 
        onSelectClass={(cls) => {
          setPlayerClass(cls);
          alert(`You have awakened as a ${cls}!`);
        }} 
      />
      <h1>⚔️ Code Ascension</h1>
      
      <Dashboard 
        level={level} 
        xp={xp} 
        nextXp={nextXp}
        progress={progress} 
        gold={availableGold} 
        streak={streak} 
        onIncrementStreak={incrementStreak}
        playerClass={playerClass}
        prestige={prestige}         
        onAscend={handleAscension} 
      />
      <StatsChart completedQuests={completedQuests} />

      <PomodoroBoss onDefeatBoss={handleBossDefeat} />
      <LootShop availableGold={availableGold} onBuyReward={handleBuyReward} />

      <div className="card">
        <h2>Add New Quest</h2>
        <QuestForm onAddQuest={addQuest} />
      </div>

      <QuestList 
        title="Active Quests" 
        quests={activeQuests} 
        onComplete={completeQuest} 
        onDelete={deleteQuest} 
        isActiveList={true}
      />

      {completedQuests.length > 0 && (
        <QuestList 
          title="Completed Quests" 
          quests={completedQuests} 
          onDelete={deleteQuest} 
          isActiveList={false}
        />
      )}
    </div>
  );
}

export default App;