import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useColorModeValue } from '@chakra-ui/react';

const generateData = () => {
  const data = [];
  const now = new Date();
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      deployments: Math.floor(Math.random() * 10) + 5,
      tests: Math.floor(Math.random() * 50) + 30,
      issues: Math.floor(Math.random() * 8) + 2,
    });
  }
  
  return data;
};

export const ProjectOverview: React.FC = () => {
  const data = useMemo(() => generateData(), []);
  const textColor = useColorModeValue('#718096', '#A0AEC0');
  const gridColor = useColorModeValue('#E2E8F0', '#4A5568');

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="deployments" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3182CE" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3182CE" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="tests" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#38A169" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#38A169" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis 
          dataKey="date" 
          axisLine={false}
          tickLine={false}
          tick={{ fill: textColor, fontSize: 12 }}
        />
        <YAxis 
          axisLine={false}
          tickLine={false}
          tick={{ fill: textColor, fontSize: 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: useColorModeValue('#FFFFFF', '#2D3748'),
            border: `1px solid ${useColorModeValue('#E2E8F0', '#4A5568')}`,
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          }}
        />
        <Area
          type="monotone"
          dataKey="deployments"
          stroke="#3182CE"
          fillOpacity={1}
          fill="url(#deployments)"
          strokeWidth={2}
        />
        <Area
          type="monotone"
          dataKey="tests"
          stroke="#38A169"
          fillOpacity={1}
          fill="url(#tests)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};