import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Dashboard from './components/Dashboard';
import QuestForm from './components/QuestForm';
import QuestList from './components/QuestList';
import StatsChart from './components/StatsChart';
import LootShop from './components/LootShop';
import ClassAwakening from './components/ClassAwakening';
import FocusTimer from './components/FocusTimer';
import './App.css';

// --- FIREBASE IMPORTS ---
import Login from './components/Login'; 
import { auth, db } from './firebase'; // Imported 'db'
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Imported Firestore functions

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
  // --- AUTH & CLOUD STATE ---
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false); // Safety lock for cloud saving

  // --- GAME STATE (Defaults until loaded from cloud) ---
  const [quests, setQuests] = useState([]);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [spentGold, setSpentGold] = useState(0);
  const [playerClass, setPlayerClass] = useState('None');
  const [prestige, setPrestige] = useState(0);

  // --- AUTHENTICATION & DATA FETCHING LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // User logged in: Fetch their data from Firestore
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Load existing data into state
          const data = docSnap.data();
          setQuests(data.quests || []);
          setXp(data.xp || 0);
          setStreak(data.streak || 0);
          setSpentGold(data.spentGold || 0);
          setPlayerClass(data.playerClass || 'None');
          setPrestige(data.prestige || 0);
        } else {
          // New User: Create their document in Firestore with default values
          await setDoc(docRef, {
            quests: [],
            xp: 0,
            streak: 0,
            spentGold: 0,
            playerClass: 'None',
            prestige: 0
          });
        }
        setDataLoaded(true); // Unlock saving
      } else {
        // User logged out: lock saving and clear state
        setDataLoaded(false);
        setQuests([]);
        setXp(0);
        setStreak(0);
        setSpentGold(0);
        setPlayerClass('None');
        setPrestige(0);
      }
      
      setLoading(false); 
    });
    
    return () => unsubscribe(); 
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // --- CLOUD SYNC: SAVE TO FIRESTORE ON STATE CHANGE ---
  useEffect(() => {
    // Only save if the user is logged in AND their data has finished downloading
    if (user && dataLoaded) {
      const syncToCloud = async () => {
        try {
          const docRef = doc(db, 'users', user.uid);
          // merge: true updates existing fields without destroying unmentioned ones
          await setDoc(docRef, {
            quests,
            xp,
            streak,
            spentGold,
            playerClass,
            prestige
          }, { merge: true });
        } catch (error) {
          console.error("Cloud Sync Error:", error);
        }
      };
      syncToCloud();
    }
  }, [quests, xp, streak, spentGold, playerClass, prestige, user, dataLoaded]);

  // --- LEVEL LOGIC ---
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

  // --- GAME ACTIONS ---
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

  const handleSessionComplete = (xpReward) => {
    const finalXp = calculateXpWithBonus(xpReward, 'Focus', 'Hard', 'timer'); 
    const newXp = xp + finalXp;
    const newLevelData = getLevelData(newXp);

    if (newLevelData.level > level) {
      alert(`🎉 LEVEL UP! You are now Level ${newLevelData.level}!`);
    }
    setXp(newXp);
    incrementStreak(); 
    alert(`🧠 Full 90-Minute Protocol Complete! +${finalXp} XP Awarded.`);
  };

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

  const lifetimeXp = xp + (prestige * 900);
  const lifetimeGold = Math.floor(lifetimeXp * 0.5);
  const availableGold = lifetimeGold - spentGold;

  const handleBuyReward = (cost, itemName) => {
    if (availableGold >= cost) {
      setSpentGold(spentGold + cost);
      alert(`🛍️ Purchase successful! Go enjoy your: ${itemName}`);
    }
  };

  const activeQuests = quests.filter(q => !q.completed);
  const completedQuests = quests.filter(q => q.completed);

  // --- THE BOUNCER LOGIC ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        {/* Assassin/Cyberpunk style loader */}
        <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  // --- MAIN APP RENDER ---
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
        <motion.header variants={itemVariants} className="text-center space-y-2 relative">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            CODE ASCENSION
          </h1>
          <p className="text-slate-400 font-medium tracking-wide">LEVEL UP YOUR GRIND</p>
          
          {/* USER INFO & SIGN OUT */}
          <div className="absolute top-0 right-0 flex items-center gap-3">
             <span className="text-sm font-semibold text-slate-300 hidden sm:inline-block">
                {user.email}
             </span>
             <button 
               onClick={handleSignOut} 
               className="btn btn-outline btn-error btn-sm"
             >
               Sign Out
             </button>
          </div>
        </motion.header>

        <motion.div variants={itemVariants}>
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

          <motion.div variants={itemVariants} className="space-y-8">
            <FocusTimer onSessionComplete={handleSessionComplete} />
            <LootShop availableGold={availableGold} onBuyReward={handleBuyReward} />
            <StatsChart completedQuests={completedQuests} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default App;