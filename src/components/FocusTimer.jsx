import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { setInterval, clearInterval } from 'worker-timers';

// --- CONSTANTS ---
const STUDY_TOTAL = 90 * 60; // 90 minutes
const MID_BREAK_TRIGGER = 45 * 60; // 45 minutes mark
const RECOVERY_TIME = 10 * 60; // 10 minutes

// --- UTILITY: Audio Bell ---
const playBell = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3);
    osc.start();
    osc.stop(ctx.currentTime + 3);
  } catch (e) {
    console.log("Audio not supported or blocked");
  }
};

// --- SUB-COMPONENT: Breathing Guide ---
const BreathingGuide = () => (
  <div className="flex flex-col items-center justify-center h-48">
    <motion.div
      animate={{
        scale: [1, 1.8, 1.8, 1],
        opacity: [0.5, 1, 1, 0.5],
      }}
      transition={{
        duration: 12, // 4s inhale, 4s hold, 4s exhale
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="w-24 h-24 rounded-full bg-gradient-to-tr from-teal-400 to-emerald-400 shadow-[0_0_30px_rgba(45,212,191,0.5)] flex items-center justify-center"
    >
      <div className="w-16 h-16 rounded-full bg-slate-950/50 backdrop-blur-sm" />
    </motion.div>
    <p className="mt-8 text-teal-200 font-medium tracking-widest uppercase text-sm animate-pulse">
      Inhale (4s) • Hold (4s) • Exhale (4s)
    </p>
  </div>
);

// --- SUB-COMPONENT: Activity Card ---
const ActivityCard = ({ icon, title, items }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center shadow-xl"
  >
    <div className="text-4xl mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-white mb-4 tracking-wide">{title}</h3>
    <ul className="space-y-3 text-slate-300 text-sm">
      {items.map((item, i) => (
        <li key={i} className="bg-slate-900/50 py-2 px-4 rounded-lg border border-white/5">{item}</li>
      ))}
    </ul>
  </motion.div>
);

// --- SUB-COMPONENT: Recovery Modal ---
const RecoveryModal = ({ phase, timeLeft, onContinue, onExtend, onReset }) => {
  const [activityIndex, setActivityIndex] = useState(0);

  const activities = [
    { type: 'breathe', comp: <BreathingGuide /> },
    { type: 'exercise', comp: <ActivityCard icon="💪" title="Light Movement" items={["Push-ups (5–15 reps)", "Sit-ups (10–20 reps)", "Neck & Shoulder rolls"]} /> },
    { type: 'tips', comp: <ActivityCard icon="👀" title="Eye & Mind Rest" items={["20-20-20 Rule (Look 20ft away)", "Drink a glass of water", "Close your eyes & relax jaw"]} /> }
  ];

  // Rotate activities every 20 seconds during mid-break
  useEffect(() => {
    if (phase !== 'mid-break') return;
    const interval = setInterval(() => {
      setActivityIndex((prev) => (prev + 1) % activities.length);
    }, 20000);
    return () => clearInterval(interval);
  }, [phase]);

  const isTimeUp = timeLeft <= 0;
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-xl p-4"
    >
      <div className="flex flex-col items-center w-full max-w-lg">
        <h2 className={`text-3xl font-black tracking-widest uppercase mb-2 ${phase === 'mid-break' ? 'text-teal-400' : 'text-indigo-400'}`}>
          {phase === 'mid-break' ? 'Recovery Phase' : 'Session Complete'}
        </h2>
        
        {phase === 'mid-break' && !isTimeUp && (
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 mb-8 font-mono">
            {mins}:{secs}
          </div>
        )}

        <div className="h-64 flex items-center justify-center w-full mb-8">
          <AnimatePresence mode="wait">
            {phase === 'mid-break' && !isTimeUp && (
              <motion.div key={activityIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {activities[activityIndex].comp}
              </motion.div>
            )}
            
            {phase === 'mid-break' && isTimeUp && (
              <ActivityCard icon="🔔" title="Ready to Continue?" items={["Your break is over.", "Stay hydrated and refocus."]} />
            )}

            {phase === 'final-break' && (
              <ActivityCard icon="🌌" title="Deep Recovery Required" items={["Take a 15–25 min power nap", "Go for a light walk outside", "Step away from all screens"]} />
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-4 w-full">
          {phase === 'mid-break' && isTimeUp && (
            <>
              <button onClick={() => onExtend(5 * 60)} className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition-colors">
                +5 Min Break
              </button>
              <button onClick={onContinue} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold shadow-[0_0_15px_rgba(20,184,166,0.4)] hover:scale-105 transition-all">
                Resume Grind
              </button>
            </>
          )}
          {phase === 'final-break' && (
            <button onClick={onReset} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:scale-105 transition-all">
              Complete & Start Fresh
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};


// --- MAIN COMPONENT: Focus Timer ---
const FocusTimer = ({ onSessionComplete }) => {
  const [state, setState] = useState(() => {
    const saved = localStorage.getItem('ca-smart-timer');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Smart Resume logic: calculate offline time
      if (parsed.isRunning) {
        const elapsed = Math.floor((Date.now() - parsed.lastUpdate) / 1000);
        let newTime = parsed.timeLeft - elapsed;
        if (newTime < 0) newTime = 0;
        return { ...parsed, timeLeft: newTime, lastUpdate: Date.now() };
      }
      return parsed;
    }
    return { timeLeft: STUDY_TOTAL, phase: 'study', isRunning: false, lastUpdate: Date.now() };
  });

  const [isFocusMode, setIsFocusMode] = useState(false);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('ca-smart-timer', JSON.stringify({ ...state, lastUpdate: Date.now() }));
  }, [state]);

  // Main Clock Logic

  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      setState((prev) => {
        const nextTime = prev.timeLeft - 1;

        // Trigger Mid-Break
        if (prev.phase === 'study' && nextTime === MID_BREAK_TRIGGER) {
          playBell();
          return { ...prev, phase: 'mid-break', timeLeft: RECOVERY_TIME, isRunning: true };
        }

        // Trigger Final Break
        if (prev.phase === 'study' && nextTime <= 0) {
          playBell();
          if (onSessionComplete) onSessionComplete(50);
          return { ...prev, phase: 'final-break', timeLeft: 0, isRunning: false };
        }

        // Break Timer hits 0
        if (prev.phase === 'mid-break' && nextTime <= 0) {
          if (prev.timeLeft > 0) playBell(); 
          return { ...prev, timeLeft: 0, isRunning: false };
        }

        return { ...prev, timeLeft: nextTime, lastUpdate: Date.now() };
      });
    }, 1000);

    // THIS ALSO USES THE NPM PACKAGE!
    return () => clearInterval(interval);
  }, [state.isRunning, onSessionComplete]);

  // Actions
  const toggleTimer = () => setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  
  const handleContinueStudy = () => {
    setState({ phase: 'study', timeLeft: MID_BREAK_TRIGGER, isRunning: true, lastUpdate: Date.now() });
  };

  const handleExtendBreak = (seconds) => {
    setState(prev => ({ ...prev, timeLeft: prev.timeLeft + seconds, isRunning: true, lastUpdate: Date.now() }));
  };

  const handleReset = () => {
    setState({ phase: 'study', timeLeft: STUDY_TOTAL, isRunning: false, lastUpdate: Date.now() });
  };

  const mins = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
  const secs = (state.timeLeft % 60).toString().padStart(2, '0');
  const progressPercent = ((STUDY_TOTAL - state.timeLeft) / STUDY_TOTAL) * 100;

  // Render Wrapper (Handles Focus Mode full-screen)
  const wrapperClasses = isFocusMode 
    ? "fixed inset-0 z-40 bg-slate-950 flex items-center justify-center p-8"
    : "relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden";

  return (
    <>
      <AnimatePresence>
        {(state.phase === 'mid-break' || state.phase === 'final-break') && (
          <RecoveryModal 
            phase={state.phase} 
            timeLeft={state.timeLeft} 
            onContinue={handleContinueStudy} 
            onExtend={handleExtendBreak}
            onReset={handleReset}
          />
        )}
      </AnimatePresence>

      <div className={wrapperClasses}>
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-32 bg-indigo-500/10 blur-[100px] pointer-events-none" />

        <div className={`flex flex-col items-center justify-center relative z-10 ${isFocusMode ? 'scale-150' : ''}`}>
          <div className="flex items-center justify-between w-full mb-6">
            <h2 className="text-sm font-bold tracking-widest uppercase text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Smart Focus Protocol
            </h2>
            <button 
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="text-xs font-bold text-slate-500 hover:text-indigo-400 transition-colors uppercase tracking-wider bg-white/5 px-3 py-1 rounded-md border border-white/5"
            >
              {isFocusMode ? 'Exit Focus' : 'Focus Mode'}
            </button>
          </div>

          {/* Radial Progress / Timer Display */}
          <div className="relative flex items-center justify-center w-64 h-64 mb-8">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
              <motion.circle 
                cx="128" cy="128" r="120" 
                stroke="currentColor" strokeWidth="4" fill="transparent" 
                strokeDasharray="754" // 2 * pi * 120
                strokeDashoffset={754 - (754 * progressPercent) / 100}
                className="text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="flex flex-col items-center">
              <span className="text-6xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-md">
                {mins}:{secs}
              </span>
              <span className="text-indigo-400 font-medium tracking-widest text-xs uppercase mt-2">
                {state.phase === 'study' ? (state.timeLeft <= MID_BREAK_TRIGGER ? 'Phase 2: Deep Work' : 'Phase 1: Flow State') : 'Resting'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 w-full max-w-xs">
            <button 
              onClick={toggleTimer}
              className={`flex-1 py-3 rounded-xl font-bold transition-all shadow-lg ${
                state.isRunning 
                  ? 'bg-slate-800 text-red-400 hover:bg-slate-700 border border-white/5' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-105 shadow-[0_0_15px_rgba(99,102,241,0.4)]'
              }`}
            >
              {state.isRunning ? 'Pause' : 'Engage'}
            </button>
            <button 
              onClick={handleReset}
              className="px-6 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-white/5 font-bold"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FocusTimer;