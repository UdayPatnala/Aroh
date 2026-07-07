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
  Legend,
} from "recharts";

// Interfaces for chart data structures
interface SystemMetric {
  name: string;
  cpu: number;
  memory: number;
}

interface TransactionVolume {
  name: string;
  volume: number;
}

interface UserJourney {
  name: string;
  views: number;
}

// Interfaces for Tooltip
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  suffix?: string;
}

// Custom Tooltip component for premium dark aesthetics
const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
  suffix = "",
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-zinc-950/90 border border-white/10 backdrop-blur-md p-3 rounded-lg shadow-2xl text-xs space-y-1.5 font-sans">
        <p className="font-mono font-semibold text-zinc-400">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {entry.value}
            {suffix}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function AdminCharts() {
  const [mounted, setMounted] = React.useState(false);

  // 1. System Metrics (CPU Load & Memory Usage)
  const [systemData, setSystemData] = React.useState<SystemMetric[]>([
    { name: "-30s", cpu: 42, memory: 64 },
    { name: "-25s", cpu: 48, memory: 65 },
    { name: "-20s", cpu: 35, memory: 65 },
    { name: "-15s", cpu: 52, memory: 66 },
    { name: "-10s", cpu: 58, memory: 66 },
    { name: "-05s", cpu: 41, memory: 67 },
    { name: "Now", cpu: 45, memory: 67 },
  ]);

  // 2. Transaction Volumes (Aros transacted over time)
  const [txData, setTxData] = React.useState<TransactionVolume[]>([
    { name: "09:00", volume: 1450 },
    { name: "10:00", volume: 1850 },
    { name: "11:00", volume: 1600 },
    { name: "12:00", volume: 2900 },
    { name: "13:00", volume: 2200 },
    { name: "14:00", volume: 3100 },
    { name: "15:00", volume: 3800 },
  ]);

  // 3. User Journeys / Path Activity
  const [journeyData, setJourneyData] = React.useState<UserJourney[]>([
    { name: "Home", views: 420 },
    { name: "Dashboard", views: 310 },
    { name: "Explore", views: 290 },
    { name: "AI", views: 180 },
    { name: "CMS", views: 140 },
    { name: "Admin", views: 75 },
  ]);

  React.useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      // System metrics update (dance around previous values)
      setSystemData((prev) =>
        prev.map((item) => {
          const cpuDelta = (Math.random() - 0.5) * 12;
          const memDelta = (Math.random() - 0.5) * 4;
          return {
            ...item,
            cpu: Math.max(10, Math.min(98, Math.round(item.cpu + cpuDelta))),
            memory: Math.max(20, Math.min(98, Math.round(item.memory + memDelta))),
          };
        })
      );

      // Transaction volumes update (upward biased fluctuations)
      setTxData((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.4) * 350;
          return {
            ...item,
            volume: Math.max(200, Math.round(item.volume + delta)),
          };
        })
      );

      // User journeys update
      setJourneyData((prev) =>
        prev.map((item) => {
          const delta = (Math.random() - 0.5) * 50;
          return {
            ...item,
            views: Math.max(15, Math.round(item.views + delta)),
          };
        })
      );
    }, 4000); // 4 seconds update frequency

    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/5 border border-white/10 rounded-xl h-[320px] flex items-center justify-center"
          >
            <span className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. System Metrics (Line Chart) */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl flex flex-col justify-between h-[320px]">
        <div className="mb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            System Telemetry
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5">
            Real-time CPU Load & Memory Usage
          </p>
        </div>
        <div className="flex-1 min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={systemData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip suffix="%" />} cursor={{ stroke: 'rgba(255, 255, 255, 0.1)' }} />
              <Legend
                verticalAlign="top"
                height={28}
                iconSize={10}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }}
              />
              <Line
                type="monotone"
                dataKey="cpu"
                name="CPU Load"
                stroke="#f59e0b"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: "#f59e0b" }}
              />
              <Line
                type="monotone"
                dataKey="memory"
                name="Memory Usage"
                stroke="#e4e4e7"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0, fill: "#e4e4e7" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Transaction Volumes (Area Chart) */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl flex flex-col justify-between h-[320px]">
        <div className="mb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Aros Transactions
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5">
            Total tokens transacted over time
          </p>
        </div>
        <div className="flex-1 min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={txData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip suffix=" Aros" />} cursor={{ stroke: 'rgba(255, 255, 255, 0.1)' }} />
              <Legend
                verticalAlign="top"
                height={28}
                iconSize={10}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }}
              />
              <Area
                type="monotone"
                dataKey="volume"
                name="Tokens Transacted"
                stroke="#d97706"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorVolume)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. User Journeys (Bar Chart) */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-xl flex flex-col justify-between h-[320px]">
        <div className="mb-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400">
            Ecosystem Journeys
          </h3>
          <p className="text-zinc-500 text-xs mt-0.5">
            Path activity per app route
          </p>
        </div>
        <div className="flex-1 min-h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={journeyData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#71717a"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip suffix=" Actions" />} cursor={{ fill: 'rgba(255, 255, 255, 0.02)' }} />
              <Legend
                verticalAlign="top"
                height={28}
                iconSize={10}
                iconType="circle"
                wrapperStyle={{ fontSize: "11px", color: "#a1a1aa" }}
              />
              <Bar
                dataKey="views"
                name="Path Actions"
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
