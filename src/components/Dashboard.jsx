const Dashboard = ({
  level,
  xp,
  nextXp,
  progress,
  gold,
  streak,
  onIncrementStreak,
  playerClass,
  prestige, 
  onAscend
}) => {
    // Map prestige levels to anime ranks
  const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'];
  
  // Cap the rank at the max array length so it doesn't break if you play forever
  const currentRank = RANKS[Math.min(prestige, RANKS.length - 1)];
  return (
    <div className="card dashboard">
      <div className="stats-grid">
        <div className="stat-box">
          <span>Level</span>
          <strong>
            {level} {level >= 5 && "(MAX)"}
          </strong>
        </div>
        <div className="stat-box">
          <span>Total XP</span>
          <strong>{xp}</strong>
        </div>
        <div className="stat-box">
          <span>Gold</span>
          <strong className="text-gold">{gold} 🪙</strong>
        </div>
        <div className="stat-box">
          <span>Daily Streak</span>
          <strong>{streak} 🔥</strong>
        </div>
        <div className="stat-box">
          <span>Class / Rank</span>
          <strong style={{ color: playerClass !== 'None' ? '#7c4dff' : '#9e9e9e' }}>
             {/* Example output: "S-Rank Shadow Mage" or "E-Rank Novice" */}
             {currentRank}-Rank {playerClass === 'None' ? 'Novice' : playerClass}
          </strong>
        </div>
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "0.85em",
            color: "#9e9e9e",
          }}
        >
          <span>XP Progress</span>
          <span>
            {level < 5 ? `${xp} / ${nextXp} XP` : "Max Level Reached!"}
          </span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <button
        onClick={onIncrementStreak}
        style={{ marginTop: "15px", width: "100%" }}
      >
        Log Daily Study Session (+1 Streak)
      </button>
      {level >= 5 && (
        <button 
          onClick={onAscend} 
          className="btn-ascend"
          style={{ marginTop: '15px', width: '100%' }}
        >
          🌌 Ascend (New Game +)
        </button>
      )}
    </div>
  );
};

export default Dashboard;
