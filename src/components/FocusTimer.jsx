import { useState, useEffect } from 'react';
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

// --- SUB-COMPONENT: Breathing Guide (Animus Style) ---
const BreathingGuide = () => (
  <div className="flex flex-col items-center justify-center h-48 font-mono">
    <div className="relative flex items-center justify-center w-24 h-24 mb-6">
      <motion.div
        animate={{ scale: [1, 1.4, 1.4, 1], opacity: [0.2, 0.8, 0.8, 0.2], rotate: 45 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
      />
      <div className="w-12 h-12 bg-cyan-950/80 border border-cyan-500 rotate-45 backdrop-blur-sm" />
    </div>
    <p className="mt-4 text-cyan-400 font-bold tracking-[0.2em] uppercase text-[10px] animate-pulse text-center">
      [ INHALE 4s ]<br/>.<br/>[ HOLD 4s ]<br/>.<br/>[ EXHALE 4s ]
    </p>
  </div>
);

// --- SUB-COMPONENT: Activity Terminal Log ---
const ActivityCard = ({ title, items }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    className="bg-[#0a0a0a]/90 backdrop-blur-md border border-cyan-500/30 p-6 w-full max-w-sm text-left shadow-[0_0_20px_rgba(6,182,212,0.1)] font-mono relative"
  >
    <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-cyan-400" />
    <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-400" />
    
    <h3 className="text-xs font-bold text-cyan-400 mb-4 tracking-[0.2em] uppercase border-b border-cyan-900/50 pb-2">
      :: {title} ::
    </h3>
    <ul className="space-y-2 text-cyan-500/70 text-[10px] tracking-widest uppercase">
      {items.map((item, i) => (
        <li key={i} className="border-l border-cyan-800 pl-3 py-1 bg-cyan-950/20">
          <span className="text-cyan-400 mr-2">{'>'}</span>{item}
        </li>
      ))}
    </ul>
  </motion.div>
);

// --- SUB-COMPONENT: Recovery Modal ---
const RecoveryModal = ({ phase, timeLeft, onContinue, onExtend, onReset }) => {
  const [activityIndex, setActivityIndex] = useState(0);

  const activities = [
    { type: 'breathe', comp: <BreathingGuide /> },
    { type: 'exercise', comp: <ActivityCard title="Physical Diagnostics" items={["Execute 10-15 Push-ups", "Engage Core: 20 Sit-ups", "Run Neck/Shoulder Rotations"]} /> },
    { type: 'tips', comp: <ActivityCard title="Sensory Reset" items={["Focus optics 20ft away", "Hydration cycle required", "Disengage jaw tension"]} /> }
  ];

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#050505]/95 backdrop-blur-xl p-4 font-mono"
    >
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="flex flex-col items-center w-full max-w-lg relative z-10">
        <h2 className={`text-xl font-black tracking-[0.3em] uppercase mb-2 ${phase === 'mid-break' ? 'text-teal-400' : 'text-cyan-400'}`}>
          {phase === 'mid-break' ? 'Recovery Protocol' : 'Sequence Complete'}
        </h2>
        
        {phase === 'mid-break' && !isTimeUp && (
          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-teal-600 mb-8 tracking-widest drop-shadow-[0_0_15px_rgba(20,184,166,0.5)]">
            {mins}:{secs}
          </div>
        )}

        <div className="h-64 flex items-center justify-center w-full mb-8">
          <AnimatePresence mode="wait">
            {phase === 'mid-break' && !isTimeUp && (
              <motion.div key={activityIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {activities[activityIndex].comp}
              </motion.div>
            )}
            
            {phase === 'mid-break' && isTimeUp && (
              <ActivityCard title="System Ready" items={["Diagnostics nominal.", "Return to synchronization.", "Awaiting input."]} />
            )}

            {phase === 'final-break' && (
              <ActivityCard title="Deep Sleep Recommended" items={["Engage 20 min power nap", "Sever connection to screens", "Perform environmental scan (Walk)"]} />
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-4 w-full">
          {phase === 'mid-break' && isTimeUp && (
            <>
              <button onClick={() => onExtend(5 * 60)} className="flex-1 py-3 text-[10px] uppercase tracking-widest font-bold border border-white/20 text-white/50 hover:text-cyan-400 hover:border-cyan-400 transition-colors">
                [ Extend 5 Min ]
              </button>
              <button onClick={onContinue} className="flex-1 py-3 text-[10px] uppercase tracking-widest font-bold bg-teal-500/10 border border-teal-500 text-teal-400 hover:bg-teal-500 hover:text-black transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)]">
                [ Resume Sync ]
              </button>
            </>
          )}
          {phase === 'final-break' && (
            <button onClick={onReset} className="w-full py-3 text-[10px] uppercase tracking-widest font-bold bg-cyan-500/10 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              [ Save & Disconnect ]
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
      if (parsed.isRunning) {
        const elapsed = Math.floor((Date.now() - parsed.lastUpdate) / 1000);
        let newTime = parsed.timeLeft - elapsed;
        
        if (parsed.phase === 'study' && parsed.timeLeft > MID_BREAK_TRIGGER && newTime <= MID_BREAK_TRIGGER) {
          return {
            ...parsed,
            phase: 'mid-break',
            timeLeft: RECOVERY_TIME, 
            isRunning: false, 
            lastUpdate: Date.now()
          };
        }

        if (newTime < 0) newTime = 0;
        return { ...parsed, timeLeft: newTime, lastUpdate: Date.now() };
      }
      return parsed;
    }
    return { timeLeft: STUDY_TOTAL, phase: 'study', isRunning: false, lastUpdate: Date.now() };
  });

  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    localStorage.setItem('ca-smart-timer', JSON.stringify({ ...state, lastUpdate: Date.now() }));
  }, [state]);

  // Main Clock Logic
  useEffect(() => {
    if (!state.isRunning) return;

    const interval = setInterval(() => {
      setState((prev) => {
        const nextTime = prev.timeLeft - 1;

        if (prev.phase === 'study' && prev.timeLeft > MID_BREAK_TRIGGER && nextTime <= MID_BREAK_TRIGGER) {
          playBell();
          return { ...prev, phase: 'mid-break', timeLeft: RECOVERY_TIME, isRunning: true, lastUpdate: Date.now() };
        }

        if (prev.phase === 'study' && nextTime <= 0) {
          playBell();
          if (onSessionComplete) onSessionComplete(50);
          return { ...prev, phase: 'final-break', timeLeft: 0, isRunning: false, lastUpdate: Date.now() };
        }

        if (prev.phase === 'mid-break' && nextTime <= 0) {
          if (prev.timeLeft > 0) playBell(); 
          return { ...prev, timeLeft: 0, isRunning: false, lastUpdate: Date.now() };
        }

        return { ...prev, timeLeft: nextTime, lastUpdate: Date.now() };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isRunning, onSessionComplete]);

  // Actions
  const toggleTimer = () => setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  const handleContinueStudy = () => setState({ phase: 'study', timeLeft: MID_BREAK_TRIGGER, isRunning: true, lastUpdate: Date.now() });
  const handleExtendBreak = (seconds) => setState(prev => ({ ...prev, timeLeft: prev.timeLeft + seconds, isRunning: true, lastUpdate: Date.now() }));
  const handleReset = () => setState({ phase: 'study', timeLeft: STUDY_TOTAL, isRunning: false, lastUpdate: Date.now() });

  const mins = Math.floor(state.timeLeft / 60).toString().padStart(2, '0');
  const secs = (state.timeLeft % 60).toString().padStart(2, '0');
  
  let progressPercent = 0;
  if (state.phase === 'study') {
    progressPercent = ((STUDY_TOTAL - state.timeLeft) / STUDY_TOTAL) * 100;
  } else if (state.phase === 'mid-break') {
    progressPercent = Math.min(100, (state.timeLeft / RECOVERY_TIME) * 100);
  } else {
    progressPercent = 100;
  }

  const ringColor = state.phase === 'mid-break' 
    ? 'text-teal-400 drop-shadow-[0_0_10px_rgba(45,212,191,0.6)]' 
    : 'text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]';

  const wrapperClasses = isFocusMode 
    ? "fixed inset-0 z-40 bg-[#050505] flex items-center justify-center p-8"
    : "relative bg-[#050505]/90 backdrop-blur-xl border border-cyan-900/50 p-6 md:p-8 shadow-[0_0_30px_rgba(6,182,212,0.1)] overflow-hidden font-mono";

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
        
        {/* Subtle Background Glow & Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-900/20 blur-[80px] pointer-events-none" />

        <div className={`flex flex-col items-center justify-center relative z-10 ${isFocusMode ? 'scale-150' : ''}`}>
          
          {/* Header */}
          <div className="flex items-center justify-between w-full mb-8">
            <h2 className="text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-500/70 flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-none animate-pulse ${state.phase === 'mid-break' ? 'bg-teal-400' : 'bg-cyan-500'}`} />
              Sync Sequence
            </h2>
            <button 
              onClick={() => setIsFocusMode(!isFocusMode)}
              className="text-[10px] font-bold text-white/30 hover:text-cyan-400 transition-colors uppercase tracking-[0.2em] border border-white/10 hover:border-cyan-400 px-3 py-1 bg-black/50"
            >
              {isFocusMode ? '[ Exit ]' : '[ Focus ]'}
            </button>
          </div>

          {/* The Dial */}
          <div className="relative flex items-center justify-center w-64 h-64 mb-10">
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              {/* Outer Dashed Track */}
              <circle cx="128" cy="128" r="120" stroke="rgba(6,182,212,0.2)" strokeWidth="1" strokeDasharray="4 6" fill="transparent" />
              {/* Inner Solid Track */}
              <circle cx="128" cy="128" r="110" stroke="rgba(0,0,0,0.5)" strokeWidth="4" fill="transparent" />
              {/* Animated Fill */}
              <motion.circle 
                cx="128" cy="128" r="110" 
                stroke="currentColor" strokeWidth="4" fill="transparent" 
                strokeDasharray="691" 
                strokeDashoffset={691 - (691 * progressPercent) / 100}
                className={`transition-all duration-1000 ease-linear ${ringColor}`}
              />
            </svg>
            
            {/* Center Data */}
            <div className="flex flex-col items-center">
              <span className="text-5xl font-black font-mono text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-700 tracking-wider">
                {mins}:{secs}
              </span>
              <span className={`${state.phase === 'mid-break' ? 'text-teal-400' : 'text-cyan-500'} font-bold tracking-[0.2em] text-[9px] uppercase mt-3`}>
                {state.phase === 'study' ? (state.timeLeft <= MID_BREAK_TRIGGER ? 'Phase 2: Deep Link' : 'Phase 1: Flow') : 'Restoring'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-4 w-full max-w-xs">
            <button 
              onClick={toggleTimer}
              className={`flex-1 py-3 text-[10px] uppercase tracking-[0.2em] font-bold border transition-all ${
                state.isRunning 
                  ? 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-black shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                  : 'bg-cyan-500/10 border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black shadow-[0_0_15px_rgba(6,182,212,0.3)]'
              }`}
            >
              {state.isRunning ? '[ Suspend ]' : '[ Engage ]'}
            </button>
            <button 
              onClick={handleReset}
              className="px-6 py-3 text-[10px] uppercase tracking-[0.2em] font-bold border border-white/10 bg-black/50 text-white/30 hover:text-cyan-400 hover:border-cyan-400 transition-colors"
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