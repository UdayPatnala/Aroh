"use client";

import * as React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

// Helper components for the custom tooltip matching AROH's dark/amber aesthetic
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  valueSuffix?: string;
}

const CustomTooltip = ({ active, payload, label, valueSuffix = "" }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 border border-white/10 rounded-lg p-3 shadow-xl backdrop-blur-md">
        <p className="text-xs font-semibold text-zinc-400 mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((pld: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-xs font-medium">
              <span 
                className="w-1.5 h-1.5 rounded-full" 
                style={{ backgroundColor: pld.color || pld.stroke || '#f59e0b' }} 
              />
              <span className="text-zinc-300">{pld.name}:</span>
              <span className="font-bold text-white ml-auto">
                {pld.value.toLocaleString()}{valueSuffix}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function AdminCharts() {
  const [isMounted, setIsMounted] = React.useState(false);

  // System Metrics state: CPU Load & Memory Usage
  const [systemData, setSystemData] = React.useState([
    { time: "10s ago", cpu: 32, memory: 58 },
    { time: "8s ago", cpu: 45, memory: 60 },
    { time: "6s ago", cpu: 28, memory: 59 },
    { time: "4s ago", cpu: 55, memory: 62 },
    { time: "2s ago", cpu: 48, memory: 61 },
    { time: "Now", cpu: 50, memory: 63 }
  ]);

  // Transaction Volume state: Aros transacted over time
  const [txData, setTxData] = React.useState([
    { time: "09:00", volume: 1200 },
    { time: "10:00", volume: 1900 },
    { time: "11:00", volume: 1500 },
    { time: "12:00", volume: 2700 },
    { time: "13:00", volume: 2200 },
    { time: "14:00", volume: 3100 },
    { time: "15:00", volume: 2900 }
  ]);

  // User Journeys state: Path activity
  const [journeyData, setJourneyData] = React.useState([
    { path: "Home", activity: 340 },
    { path: "Dashboard", activity: 210 },
    { path: "Explore", activity: 450 },
    { path: "AI", activity: 180 },
    { path: "CMS", activity: 90 },
    { path: "Admin", activity: 40 }
  ]);

  React.useEffect(() => {
    setIsMounted(true);

    const interval = setInterval(() => {
      // 1. Roll/adjust System Metrics
      setSystemData(prev => {
        const lastPoint = prev[prev.length - 1];
        // CPU load fluctuates between 10% and 95%
        const newCpu = Math.max(10, Math.min(95, Math.floor(lastPoint.cpu + (Math.random() - 0.5) * 16)));
        // Memory Usage fluctuates between 30% and 90%
        const newMemory = Math.max(30, Math.min(90, Math.floor(lastPoint.memory + (Math.random() - 0.5) * 6)));
        const nextData = prev.slice(1);
        const times = ["10s ago", "8s ago", "6s ago", "4s ago", "2s ago", "Now"];
        return [...nextData, { cpu: newCpu, memory: newMemory }].map((item, idx) => ({
          ...item,
          time: times[idx]
        }));
      });

      // 2. Roll/adjust Transaction Volumes
      setTxData(prev => {
        const lastPoint = prev[prev.length - 1];
        const change = Math.floor((Math.random() - 0.45) * 900); // slight positive bias
        const newVolume = Math.max(500, Math.min(9500, lastPoint.volume + change));
        
        const lastTime = lastPoint.time;
        const [hours, minutes] = lastTime.split(":").map(Number);
        const nextHours = (hours + 1) % 24;
        const nextTime = `${String(nextHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
        
        return [...prev.slice(1), { time: nextTime, volume: newVolume }];
      });

      // 3. Mutate User Journeys path activity in-place
      setJourneyData(prev => {
        return prev.map(item => {
          // Adjust activity counts dynamically by +/- 30 actions
          const change = Math.floor((Math.random() - 0.5) * 60);
          const newActivity = Math.max(10, item.activity + change);
          return { ...item, activity: newActivity };
        });
      });
    }, 4000); // Live updates every 4 seconds

    return () => clearInterval(interval);
  }, []);

  // Server-side / Hydration placeholder
  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((key) => (
          <div 
            key={key} 
            className="bg-white/5 border border-white/10 rounded-xl p-6 h-[360px] flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="h-6 w-32 bg-white/10 rounded animate-pulse" />
              <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
            </div>
            <div className="h-[230px] w-full bg-white/5 rounded flex items-center justify-center animate-pulse">
              <span className="text-zinc-500 text-xs">Initializing dashboard metrics...</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* 1. LineChart for System Metrics */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col h-[360px] shadow-xl">
        <div className="mb-4">
          <h3 className="text-base font-bold tracking-tight text-white">System Metrics</h3>
          <p className="text-xs text-zinc-400">Live CPU Load & Memory Usage</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={systemData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="time" stroke="#71717a" fontSize={10} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={10} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip valueSuffix="%" />} />
              <Legend 
                verticalAlign="top" 
                height={28} 
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: '#d4d4d8' }} 
              />
              <Line 
                name="CPU Load" 
                type="monotone" 
                dataKey="cpu" 
                stroke="#f59e0b" // Amber 500
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 4 }} 
              />
              <Line 
                name="Memory Usage" 
                type="monotone" 
                dataKey="memory" 
                stroke="#a1a1aa" // Zinc 400
                strokeWidth={2} 
                dot={false} 
                activeDot={{ r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. AreaChart for Transaction Volumes */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col h-[360px] shadow-xl">
        <div className="mb-4">
          <h3 className="text-base font-bold tracking-tight text-white">Transaction Volumes</h3>
          <p className="text-xs text-zinc-400">Total Aros transacted over time</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={txData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="time" stroke="#71717a" fontSize={10} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip valueSuffix=" Aros" />} />
              <Legend 
                verticalAlign="top" 
                height={28} 
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: '#d4d4d8' }} 
              />
              <Area 
                name="Aros Transacted" 
                type="monotone" 
                dataKey="volume" 
                stroke="#f59e0b" 
                fillOpacity={1} 
                fill="url(#colorVolume)" 
                strokeWidth={2} 
                activeDot={{ r: 4 }} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. BarChart for User Journeys */}
      <div className="bg-white/5 border border-white/10 p-6 rounded-xl flex flex-col h-[360px] shadow-xl">
        <div className="mb-4">
          <h3 className="text-base font-bold tracking-tight text-white">User Journeys</h3>
          <p className="text-xs text-zinc-400">Active views/actions across system paths</p>
        </div>
        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={journeyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
              <XAxis dataKey="path" stroke="#71717a" fontSize={10} tickLine={false} />
              <YAxis stroke="#71717a" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip valueSuffix=" actions" />} />
              <Legend 
                verticalAlign="top" 
                height={28} 
                iconType="circle" 
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: '#d4d4d8' }} 
              />
              <Bar 
                name="Path Activity" 
                dataKey="activity" 
                fill="#f59e0b" 
                radius={[4, 4, 0, 0]} 
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
