import { useState } from 'react';
import { motion } from 'framer-motion';

const XP_MAP = { Easy: 10, Medium: 20, Hard: 40 };

const QuestForm = ({ onAddQuest }) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('Concept');
  const [difficulty, setDifficulty] = useState('Easy');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddQuest({
      title,
      type,
      difficulty,
      xpValue: XP_MAP[difficulty]
    });

    setTitle('');
    setType('Concept');
    setDifficulty('Easy');
  };

  return (
    <form className="bg-[#050505]/90 backdrop-blur-xl border border-cyan-900/40 p-6 flex flex-col md:flex-row gap-6 items-end relative" onSubmit={handleSubmit}>
      {/* HUD Accent lines */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/50" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/50" />

      {/* Objective Input */}
      <div className="flex-[2] w-full relative group">
        <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-cyan-500/50 mb-2 block">
          Initialize Objective
        </label>
        <input
          type="text"
          placeholder="// enter sequence..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-cyan-950/10 border-b border-white/10 py-2.5 px-1 text-cyan-50 placeholder-cyan-900/40 focus:outline-none focus:border-cyan-400 focus:bg-cyan-950/20 transition-all font-mono text-sm"
          required
        />
      </div>

      {/* Refined Dropdowns */}
      <div className="flex-1 w-full md:w-40 relative">
        <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-cyan-500/50 mb-2 block">
          Class
        </label>
        <div className="relative">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-cyan-950/10 border-b border-white/10 py-2.5 px-1 text-cyan-400 focus:outline-none focus:border-cyan-400 transition-all font-mono text-sm appearance-none cursor-pointer hover:bg-cyan-950/20"
          >
            <option value="Concept">Concept</option>
            <option value="MCQ">MCQ</option>
            <option value="Debug">Debug</option>
            <option value="Project">Project</option>
            <option value="Boss">Boss</option>
          </select>
          {/* Custom Arrow */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500/50 text-[10px]">
            ▼
          </div>
        </div>
      </div>

      <div className="flex-1 w-full md:w-40 relative">
        <label className="text-[10px] font-mono tracking-[0.2em] uppercase text-cyan-500/50 mb-2 block">
          Threat
        </label>
        <div className="relative">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className={`w-full bg-cyan-950/10 border-b py-2.5 px-1 focus:outline-none transition-all font-mono text-sm appearance-none cursor-pointer hover:bg-cyan-950/20 ${difficulty === 'Hard' ? 'text-red-400 border-red-500/30 focus:border-red-400' :
                difficulty === 'Medium' ? 'text-amber-400 border-amber-500/30 focus:border-amber-400' :
                  'text-green-400 border-green-500/30 focus:border-green-400'
              }`}
          >
            <option value="Easy" className="bg-[#050505] text-green-400">Easy</option>
            <option value="Medium" className="bg-[#050505] text-amber-400">Medium</option>
            <option value="Hard" className="bg-[#050505] text-red-400">Hard</option>
          </select>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-cyan-500/50 text-[10px]">
            ▼
          </div>
        </div>
      </div>

      {/* Compile Button */}
      <button 
  type="submit" 
  className="relative w-full md:w-auto px-14 py-3 group transition-all duration-500 active:scale-95 overflow-hidden"
>
  {/* The Hex-Cut Background Frame */}
  <div 
    className="absolute inset-0 border border-cyan-400/30 group-hover:border-white transition-colors duration-500"
    style={{ 
      clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 35%)' 
    }}
  />

  {/* Active Sync Fill - White glow on hover */}
  <div 
    className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-500"
    style={{ 
      clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 35%)' 
    }}
  />

  {/* High-Speed Data Sweep */}
  <motion.div 
    animate={{ x: ["-100%", "300%"] }}
    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
    className="absolute inset-0 w-12 bg-white/20 blur-xl skew-x-[-45deg] pointer-events-none opacity-0 group-hover:opacity-100"
  />

  {/* Bold Pure White Text */}
  <span className="relative z-10 font-mono font-black tracking-[0.5em] uppercase text-[11px] text-white transition-all duration-500 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
    Compile
  </span>

  {/* Precision HUD Brackets */}
  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
</button>
    </form>
  );
};

export default QuestForm;