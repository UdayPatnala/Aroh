"use client";

import * as React from "react";
import {
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
  Legend,
  ResponsiveContainer,
} from "recharts";

// Custom Tooltip styled for AROH's premium dark aesthetics
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950 border border-white/10 p-3 rounded-lg shadow-xl text-xs space-y-1">
        <p className="font-semibold text-zinc-400 mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="flex justify-between gap-4 items-center">
            <span className="flex items-center gap-1.5 font-medium text-zinc-300">
              <span
                className="w-1.5 h-1.5 rounded-full inline-block"
                style={{ backgroundColor: p.color || p.fill }}
              />
              {p.name}:
            </span>
            <span className="font-bold text-white">
              {p.value}
              {p.name.toLowerCase().includes("cpu") || p.name.toLowerCase().includes("memory") ? "%" : ""}
            </span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminCharts() {
  const [mounted, setMounted] = React.useState(false);

  // 1. State for System Metrics (CPU & Memory)
  const [systemData, setSystemData] = React.useState([
    { name: "00:00", CPU: 22, Memory: 54 },
    { name: "00:05", CPU: 28, Memory: 55 },
    { name: "00:10", CPU: 35, Memory: 58 },
    { name: "00:15", CPU: 42, Memory: 57 },
    { name: "00:20", CPU: 38, Memory: 60 },
    { name: "00:25", CPU: 48, Memory: 62 },
    { name: "00:30", CPU: 45, Memory: 61 },
  ]);

  // 2. State for Transaction Volumes (Aros transacted)
  const [transactionData, setTransactionData] = React.useState([
    { name: "10:00", Aros: 1200 },
    { name: "11:00", Aros: 1800 },
    { name: "12:00", Aros: 1400 },
    { name: "13:00", Aros: 2200 },
    { name: "14:00", Aros: 3100 },
    { name: "15:00", Aros: 2500 },
    { name: "16:00", Aros: 2900 },
  ]);

  // 3. State for User Journeys (Views & Actions across paths)
  const [userJourneyData, setUserJourneyData] = React.useState([
    { name: "Home", Views: 450, Actions: 120 },
    { name: "Dashboard", Views: 320, Actions: 95 },
    { name: "Explore", Views: 280, Actions: 80 },
    { name: "AI Hub", Views: 210, Actions: 150 },
    { name: "CMS Manager", Views: 150, Actions: 45 },
    { name: "Admin", Views: 60, Actions: 20 },
  ]);

  React.useEffect(() => {
    setMounted(true);

    // Live data simulation interval (every 4 seconds)
    const interval = setInterval(() => {
      // System Metrics update (slight shifts, clamped between 5% and 95%)
      setSystemData((prev) =>
        prev.map((item) => {
          const cpuDelta = Math.floor(Math.random() * 11) - 5; // -5 to +5
          const memDelta = Math.floor(Math.random() * 7) - 3;  // -3 to +3
          return {
            ...item,
            CPU: Math.max(5, Math.min(95, item.CPU + cpuDelta)),
            Memory: Math.max(5, Math.min(95, item.Memory + memDelta)),
          };
        })
      );

      // Transaction Volumes update (simulating buy/sell/rewards activity)
      setTransactionData((prev) =>
        prev.map((item) => {
          const txDelta = Math.floor(Math.random() * 401) - 200; // -200 to +200
          return {
            ...item,
            Aros: Math.max(100, item.Aros + txDelta),
          };
        })
      );

      // User Journeys / Path Activity update
      setUserJourneyData((prev) =>
        prev.map((item) => {
          const viewsDelta = Math.floor(Math.random() * 41) - 20;   // -20 to +20
          const actionsDelta = Math.floor(Math.random() * 21) - 10; // -10 to +10
          return {
            ...item,
            Views: Math.max(10, item.Views + viewsDelta),
            Actions: Math.max(5, item.Actions + actionsDelta),
          };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="h-[350px] bg-white/5 border border-white/10 rounded-xl animate-pulse" />
        <div className="h-[350px] bg-white/5 border border-white/10 rounded-xl animate-pulse" />
        <div className="h-[350px] bg-white/5 border border-white/10 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* 1. LineChart for System Metrics */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl flex flex-col space-y-4">
        <div>
          <h3 className="font-bold text-white text-base">System Metrics</h3>
          <p className="text-xs text-zinc-400">Ecosystem node workload & capacity</p>
        </div>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={systemData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.2} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }} />
              <Line type="monotone" dataKey="CPU" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="CPU Load" />
              <Line type="monotone" dataKey="Memory" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} name="Memory Usage" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. AreaChart for Transaction Volumes */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl flex flex-col space-y-4">
        <div>
          <h3 className="font-bold text-white text-base">Transaction Volumes</h3>
          <p className="text-xs text-zinc-400">Total volume of Aros transacted over time</p>
        </div>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={transactionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAros" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.2} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }} />
              <Area type="monotone" dataKey="Aros" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorAros)" name="Volume (Aros)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. BarChart for User Journeys */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl flex flex-col space-y-4">
        <div>
          <h3 className="font-bold text-white text-base">User Journeys</h3>
          <p className="text-xs text-zinc-400">Active views vs actions across modules</p>
        </div>
        <div className="w-full h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userJourneyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" opacity={0.2} />
              <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }} />
              <Bar dataKey="Views" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Page Views" />
              <Bar dataKey="Actions" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="User Actions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
