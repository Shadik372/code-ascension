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

      <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        <option value="Easy">Easy (10 XP)</option>
        <option value="Medium">Medium (20 XP)</option>
        <option value="Hard">Hard (40 XP)</option>
      </select>

      <button type="submit">Add Quest</button>
    </form>
  );
};

export default QuestForm;