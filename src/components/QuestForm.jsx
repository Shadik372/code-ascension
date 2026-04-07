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

    // Reset form
    setTitle('');
    setType('Concept');
    setDifficulty('Easy');
  };

  return (
    <form className="quest-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="e.g. Learn React useEffect..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Concept">Concept</option>
        <option value="MCQ">MCQ</option>
        <option value="Debug">Debug</option>
        <option value="Project">Project</option>
        <option value="Boss">Boss</option>
      </select>

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
        className={`font-bold transition-colors ${difficulty === 'Hard' ? 'text-red-400 border-red-500/50' :
            difficulty === 'Medium' ? 'text-yellow-400 border-yellow-500/50' :
              'text-green-400 border-green-500/50'
          }`}
      >
        <option value="Easy" className="text-green-400 bg-slate-900">Easy (10 XP)</option>
        <option value="Medium" className="text-yellow-400 bg-slate-900">Medium (20 XP)</option>
        <option value="Hard" className="text-red-400 bg-slate-900">Hard (40 XP)</option>
      </select>
      <button type="submit">Add Quest</button>
    </form>
  );
};

export default QuestForm;