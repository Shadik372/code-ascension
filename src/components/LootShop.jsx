import { motion } from 'framer-motion';

const REWARDS = [
  { id: 1, name: '15 Min Pause', cost: 50, icon: '||' },
  { id: 2, name: 'Stimulant (Coffee)', cost: 150, icon: 'C8H10N4O2' },
  { id: 3, name: 'Simulation Run (Game)', cost: 300, icon: '///' },
  { id: 4, name: 'Deep Sleep Mode', cost: 500, icon: 'Zz' },
];

const LootShop = ({ availableGold, onBuyReward }) => {
  return (
    <div className="bg-[#050505]/90 backdrop-blur-xl border border-cyan-900/50 p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 blur-[50px] pointer-events-none" />

      <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white tracking-[0.2em] uppercase">Asset Exchange</h2>
          <p className="text-[10px] text-cyan-500/70 font-mono tracking-widest mt-1 uppercase">Authorized personnel only</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-white/40 font-mono tracking-widest uppercase block mb-1">Available Credits</span>
          <span className="text-xl font-mono font-bold text-amber-500 tracking-wider">
            {availableGold} CR
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {REWARDS.map((reward) => {
          const canAfford = availableGold >= reward.cost;
          
          return (
            <div 
              key={reward.id}
              className={`flex flex-col relative p-4 border transition-all ${
                canAfford 
                  ? 'bg-cyan-950/10 border-cyan-500/20 hover:border-amber-500/50 group' 
                  : 'bg-black/50 border-white/5 opacity-50'
              }`}
            >
              {canAfford && <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-amber-500/50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />}
              
              <span className="text-xs font-mono font-bold text-cyan-600 mb-4">{reward.icon}</span>
              
              <h4 className="font-bold text-slate-200 text-xs tracking-wider uppercase mb-1">{reward.name}</h4>
              <span className="text-amber-500 font-mono text-[10px] tracking-widest mb-4 block">COST: {reward.cost}</span>
              
              <motion.button 
                whileTap={canAfford ? { scale: 0.98 } : {}}
                disabled={!canAfford}
                onClick={() => onBuyReward(reward.cost, reward.name)}
                className={`w-full py-2 text-[10px] font-bold tracking-widest uppercase transition-all ${
                  canAfford 
                    ? 'bg-transparent border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-black' 
                    : 'bg-white/5 text-white/30 cursor-not-allowed border border-transparent'
                }`}
              >
                {canAfford ? 'Acquire' : 'Locked'}
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LootShop;