import { motion } from 'framer-motion';

const REWARDS = [
  { id: 1, name: '15 Min Break', cost: 50, icon: '📺' },
  { id: 2, name: 'Fancy Coffee', cost: 150, icon: '☕' },
  { id: 3, name: '1Hr Gaming', cost: 300, icon: '🎮' },
  { id: 4, name: 'Guilt-Free Nap', cost: 500, icon: '😴' },
];

const LootShop = ({ availableGold, onBuyReward }) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-xl">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">🛒 Loot Shop</h2>
          <p className="text-sm text-slate-400 mt-1">Spend your hard-earned gold.</p>
        </div>
        <span className="text-lg font-bold text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
          {availableGold} 🪙
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {REWARDS.map((reward) => {
          const canAfford = availableGold >= reward.cost;
          
          return (
            <motion.div 
              key={reward.id}
              whileHover={canAfford ? { y: -2, scale: 1.02 } : {}}
              className={`flex flex-col items-center p-4 rounded-xl border transition-all ${
                canAfford 
                  ? 'bg-slate-800/40 border-white/10 hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.2)]' 
                  : 'bg-slate-900/50 border-white/5 opacity-60 grayscale'
              }`}
            >
              <span className="text-4xl mb-3 drop-shadow-md">{reward.icon}</span>
              <h4 className="font-semibold text-slate-200 text-sm text-center mb-1">{reward.name}</h4>
              <span className="text-amber-400 text-xs font-bold mb-4">{reward.cost} 🪙</span>
              
              <motion.button 
                whileTap={canAfford ? { scale: 0.95 } : {}}
                disabled={!canAfford}
                onClick={() => onBuyReward(reward.cost, reward.name)}
                className={`w-full py-2 rounded-lg text-xs font-bold tracking-wider uppercase transition-all ${
                  canAfford 
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {canAfford ? 'Purchase' : 'Locked'}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LootShop;