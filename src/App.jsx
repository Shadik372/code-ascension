import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
};

function App() {
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

  const getLevelData = (currentXp) => {
    let level = 1;
    let nextXp = LEVEL_THRESHOLDS[1];
    let prevXp = 0;

    for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
      if (currentXp >= LEVEL_THRESHOLDS[i]) {
        level = i + 1;
        prevXp = LEVEL_THRESHOLDS[i];
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

  useEffect(() => {
    localStorage.setItem('ca-quests', JSON.stringify(quests));
    localStorage.setItem('ca-xp', xp);
    localStorage.setItem('ca-streak', streak);
    localStorage.setItem('ca-spent-gold', spentGold);
    localStorage.setItem('ca-class', playerClass);
    localStorage.setItem('ca-prestige', prestige); 
  }, [quests, xp, streak, spentGold, playerClass, prestige]);

  const addQuest = (newQuest) => {
    setQuests([...quests, { ...newQuest, id: Date.now(), completed: false }]);
  };

  const calculateXpWithBonus = (baseXp, type, difficulty, source = 'quest') => {
    let multiplier = 1;
    if (playerClass === 'Shadow Mage' && (type === 'Concept' || type === 'MCQ')) multiplier = 1.5;
    if (playerClass === 'Assassin' && (type === 'Debug' || difficulty === 'Easy')) multiplier = 1.5;
    if (playerClass === 'Architect' && type === 'Project') multiplier = 1.5;
    if (playerClass === 'Iron Tank' && (difficulty === 'Hard' || source === 'boss')) multiplier = 1.5;

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
    // FIX: Use xpReward instead of undefined baseXp
    const finalXp = calculateXpWithBonus(xpReward, 'Boss', 'Hard', 'boss'); 
    const newXp = xp + finalXp;
    const newLevelData = getLevelData(newXp);

    if (newLevelData.level > level) {
      alert(`🎉 LEVEL UP! You are now Level ${newLevelData.level}!`);
    }
    setXp(newXp);
  };

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);
  
  const lifetimeXp = xp + (prestige * 900);
  const lifetimeGold = Math.floor(lifetimeXp * 0.5);
  const availableGold = lifetimeGold - spentGold;

  const handleAscension = () => {
    if (level < 5) return;
    const confirm = window.confirm(
      "🌌 Ready to Ascend? This will wipe your current Quests and Level. \n\nYou will keep your Class, Gold, and Streak, and gain a permanent +50% XP boost. Proceed?"
    );
    if (confirm) {
      setPrestige(prestige + 1);
      setXp(0);
      setQuests([]);
      alert("🌌 ASCENSION COMPLETE! Welcome to New Game +");
    }
  };

  const handleBuyReward = (cost, itemName) => {
    if (availableGold >= cost) {
      setSpentGold(spentGold + cost);
      alert(`🛍️ Purchase successful! Go enjoy your: ${itemName}`);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      {/* Awakening UI Overlay */}
      <ClassAwakening 
        playerClass={playerClass} 
        level={level} 
        onSelectClass={(cls) => {
          setPlayerClass(cls);
          alert(`You have awakened as a ${cls}!`);
        }} 
      />

      <motion.div 
        className="max-w-5xl mx-auto space-y-8 relative z-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.header variants={itemVariants} className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            CODE ASCENSION
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">LEVEL UP YOUR GRIND</p>
        </motion.header>

        <motion.div variants={itemVariants}>
          {/* FIX: Passed all actual props instead of dashboardProps */}
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
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
            <QuestForm onAddQuest={addQuest} />
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
          </motion.div>

          {/* FIX: Re-added the missing components to the Sidebar */}
          <motion.div variants={itemVariants} className="space-y-8">
            <PomodoroBoss onDefeatBoss={handleBossDefeat} />
            <LootShop availableGold={availableGold} onBuyReward={handleBuyReward} />
            <StatsChart completedQuests={completedQuests} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;