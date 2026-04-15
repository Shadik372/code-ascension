import { useState } from 'react';

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
    <form className="bg-[#050505]/90 backdrop-blur-xl border border-cyan-900/50 p-6 flex flex-col md:flex-row gap-4 items-end relative overflow-hidden" onSubmit={handleSubmit}>
      {/* Background Grid Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

      <div className="flex-1 w-full relative group">
        <label className="text-[10px] font-mono tracking-widest uppercase text-cyan-500/70 mb-1 block">Initialize Objective</label>
        <input
          type="text"
          placeholder="Enter memory sequence..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-transparent border-b border-white/20 py-2 text-cyan-50 placeholder-cyan-900/50 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-sm"
          required
        />
      </div>

      <div className="w-full md:w-32 relative">
        <label className="text-[10px] font-mono tracking-widest uppercase text-cyan-500/70 mb-1 block">Class</label>
        <select 
          value={type} 
          onChange={(e) => setType(e.target.value)}
          className="w-full bg-[#0a0a0a] border-b border-white/20 py-2 text-cyan-50 focus:outline-none focus:border-cyan-400 transition-colors font-mono text-sm appearance-none cursor-pointer"
        >
          <option value="Concept">Concept</option>
          <option value="MCQ">MCQ</option>
          <option value="Debug">Debug</option>
          <option value="Project">Project</option>
          <option value="Boss">Boss</option>
        </select>
      </div>

      <div className="w-full md:w-32 relative">
        <label className="text-[10px] font-mono tracking-widest uppercase text-cyan-500/70 mb-1 block">Threat</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className={`w-full bg-[#0a0a0a] border-b py-2 focus:outline-none transition-colors font-mono text-sm appearance-none cursor-pointer ${
            difficulty === 'Hard' ? 'text-red-400 border-red-500/50 focus:border-red-400' :
            difficulty === 'Medium' ? 'text-amber-400 border-amber-500/50 focus:border-amber-400' :
            'text-green-400 border-green-500/50 focus:border-green-400'
          }`}
        >
          <option value="Easy" className="text-green-400 bg-[#050505]">Easy</option>
          <option value="Medium" className="text-amber-400 bg-[#050505]">Medium</option>
          <option value="Hard" className="text-red-400 bg-[#050505]">Hard</option>
        </select>
      </div>

      <button 
        type="submit" 
        className="w-full md:w-auto relative py-2 px-6 border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 font-bold tracking-widest text-xs uppercase hover:bg-cyan-500 hover:text-black transition-all duration-300"
      >
        Compile
      </button>
    </form>
  );
};

export default QuestForm;