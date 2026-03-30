import React from 'react';

// You can customize these to match your actual life rewards!
const REWARDS = [
  { id: 1, name: '15 Min YouTube Break', cost: 50, icon: '📺' },
  { id: 2, name: 'Buy a Fancy Coffee', cost: 150, icon: '☕' },
  { id: 3, name: '1 Hour of Gaming', cost: 300, icon: '🎮' },
  { id: 4, name: 'Guilt-Free Nap', cost: 500, icon: '😴' },
];

const LootShop = ({ availableGold, onBuyReward }) => {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🛒 Loot Shop</h2>
        <span className="text-gold">Wallet: {availableGold} 🪙</span>
      </div>
      
      <p style={{ color: '#9e9e9e', fontSize: '0.9em', marginTop: 0 }}>
        Spend your hard-earned gold on real-life rewards!
      </p>

      <div className="shop-grid">
        {REWARDS.map((reward) => {
          const canAfford = availableGold >= reward.cost;
          
          return (
            <div key={reward.id} className={`shop-item ${!canAfford ? 'locked' : ''}`}>
              <div className="shop-icon">{reward.icon}</div>
              <div className="shop-details">
                <h4>{reward.name}</h4>
                <span className="text-gold">{reward.cost} 🪙</span>
              </div>
              <button 
                className="btn-buy"
                disabled={!canAfford}
                onClick={() => onBuyReward(reward.cost, reward.name)}
              >
                {canAfford ? 'Purchase' : 'Too Expensive'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LootShop;