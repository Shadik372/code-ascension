import { useMemo } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const StatsChart = ({ completedQuests }) => {
  // Process data to group XP by date
  const chartData = useMemo(() => {
    if (!completedQuests || completedQuests.length === 0) return [];

    const groupedData = {};

    completedQuests.forEach(quest => {
      // Use the completion date, fallback to creation date (id) if old data
      const timestamp = quest.completedAt || quest.id; 
      const date = new Date(timestamp).toLocaleDateString(undefined, { 
        month: 'short', 
        day: 'numeric' 
      });

      if (!groupedData[date]) {
        groupedData[date] = { date, xp: 0, questsCompleted: 0 };
      }
      
      groupedData[date].xp += quest.xpValue;
      groupedData[date].questsCompleted += 1;
    });

    // Convert object to array
    return Object.values(groupedData);
  }, [completedQuests]);

  if (chartData.length === 0) {
    return (
      <div className="card text-center">
        <h2>📈 Quest Analytics</h2>
        <p style={{ color: '#9e9e9e' }}>Complete some quests to generate your hero's journey chart!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>📈 XP Journey</h2>
      <p style={{ color: '#9e9e9e', fontSize: '0.9em', marginTop: 0 }}>
        Your daily XP grind visualized.
      </p>
      
      <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6200ea" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#6200ea" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis dataKey="date" stroke="#9e9e9e" tick={{fill: '#9e9e9e'}} axisLine={false} />
            <YAxis stroke="#9e9e9e" tick={{fill: '#9e9e9e'}} axisLine={false} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#444', color: '#fff' }}
              itemStyle={{ color: '#ffd700' }}
            />
            <Area 
              type="monotone" 
              dataKey="xp" 
              name="XP Earned"
              stroke="#7c4dff" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorXp)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default StatsChart;