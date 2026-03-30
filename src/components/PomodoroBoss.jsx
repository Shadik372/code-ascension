import { useState, useEffect } from 'react';

const PomodoroBoss = ({ onDefeatBoss }) => {
  const BOSS_TIME =  60 * 60; // 25 minutes in seconds
  const XP_REWARD = 100; // Big reward for deep work

  const [timeLeft, setTimeLeft] = useState(BOSS_TIME);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Boss Defeated!
      setIsActive(false);
      onDefeatBoss(XP_REWARD);
      setTimeLeft(BOSS_TIME); // Reset for the next battle
      alert(`🐉 BOSS DEFEATED! You earned ${XP_REWARD} XP for your deep focus!`);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onDefeatBoss]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const fleeBattle = () => {
    setIsActive(false);
    setTimeLeft(BOSS_TIME);
  };

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  // Calculate health bar percentage
  const healthPercent = (timeLeft / BOSS_TIME) * 100;

  return (
    <div className="card boss-card">
      <div className="boss-header">
        <h2>🐉 Boss Battle: Deep Focus</h2>
        <span className="text-gold">Reward: {XP_REWARD} XP</span>
      </div>
      
      <div className="boss-timer-display">
        {minutes}:{seconds}
      </div>

      <div className="boss-health-bar-container">
        <div 
          className="boss-health-fill" 
          style={{ width: `${healthPercent}%` }}
        ></div>
      </div>

      <div className="boss-controls">
        <button 
          className={isActive ? "btn-delete" : "btn-complete"} 
          onClick={toggleTimer}
        >
          {isActive ? "Pause Attack" : "Engage Boss (Start)"}
        </button>
        <button 
          className="btn-flee" 
          onClick={fleeBattle}
          disabled={!isActive && timeLeft === BOSS_TIME}
        >
          Flee (Reset)
        </button>
      </div>
    </div>
  );
};

export default PomodoroBoss;