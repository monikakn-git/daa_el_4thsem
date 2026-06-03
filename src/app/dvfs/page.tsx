"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Cpu, Zap, Thermometer, Activity } from "lucide-react";
import { api, getSocket } from "@/lib/api";

type DVFSHistoryPoint = {
  time: string;
  power: number;
  temp: number;
};

type ProcessorNode = {
  id: string;
  voltage?: number;
  frequency?: number;
  temperature?: number;
  utilization?: number;
};

const initialHistory: DVFSHistoryPoint[] = Array.from({ length: 20 }, (_, i) => ({
  time: `${i}`,
  power: 85,
  temp: 45,
}));

export default function DVFSPage() {
  const [voltage, setVoltage] = useState(1.2);
  const [frequency, setFrequency] = useState(3.5);
  const [power, setPower] = useState(85);
  const [temp, setTemp] = useState(45);
  const [processorId, setProcessorId] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [history, setHistory] = useState<DVFSHistoryPoint[]>(initialHistory);

  useEffect(() => {
    // Initial fetch to get a processor to control
    const fetchProcessor = async () => {
      try {
        const p = await api.get<ProcessorNode[]>("/processors");
        if (p.data && p.data.length > 0) {
          setProcessorId(p.data[0].id);
          setVoltage(p.data[0].voltage || 1.2);
          setFrequency(p.data[0].frequency || 3.5);
        } else {
          // Add a dummy processor if none exists
          const newP = await api.post<ProcessorNode>("/processors", {
            processorName: "Main CPU Node",
            totalCapacity: 100,
            availableCapacity: 100,
            frequency: 3.5,
            voltage: 1.2,
            temperature: 45,
            utilization: 0
          });
          setProcessorId(newP.data.id);
        }
      } catch (error) {
        console.error("Failed to fetch processor", error);
      }
    };
    fetchProcessor();

    const socket = getSocket();
    if (socket) {
      socket.on("dvfs_updated", (data) => {
        if (data.processor && data.processor.id === processorId) {
           setPower(data.powerConsumption || (voltage * voltage * frequency * 5));
           setTemp(data.processor.temperature);
           
           setHistory(prev => {
             const newHistory = [...prev.slice(1), {
               time: new Date().getSeconds().toString(),
               power: data.powerConsumption,
               temp: data.processor.temperature
             }];
             return newHistory;
           });
        }
      });
    }

    return () => {
      if (socket) socket.off("dvfs_updated");
    };
  }, [processorId, voltage, frequency]);

  useEffect(() => {
    // Debounced API call when user changes sliders
    const timeout = setTimeout(async () => {
      if (processorId) {
        try {
          await api.post("/dvfs/update", {
            processorId,
            voltage,
            frequency
          });
        } catch (error) {
           console.error("Failed to update DVFS", error);
        }
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [voltage, frequency, processorId]);

  const handleVoltageChange = (e: ChangeEvent<HTMLInputElement>) => setVoltage(parseFloat(e.target.value));
  const handleFrequencyChange = (e: ChangeEvent<HTMLInputElement>) => setFrequency(parseFloat(e.target.value));

  const handleAutoOptimize = async () => {
    if (!processorId) return;
    setIsOptimizing(true);

    try {
      const response = await api.post<{ processor: ProcessorNode; recommended: { voltage: number; frequency: number; temperature: number; powerConsumption: number } }>("/dvfs/optimize", {
        processorId,
      });

      if (response.data.processor) {
        setVoltage(response.data.processor.voltage ?? voltage);
        setFrequency(response.data.processor.frequency ?? frequency);
        setTemp(response.data.processor.temperature ?? temp);
        setPower(response.data.recommended.powerConsumption ?? power);

        setHistory((prev) => {
          const next = [...prev.slice(1), {
            time: new Date().toLocaleTimeString([], { minute: '2-digit', second: '2-digit' }),
            power: response.data.recommended.powerConsumption,
            temp: response.data.recommended.temperature,
          }];
          return next;
        });
      }
    } catch (error) {
      console.error("Auto-optimization failed", error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-6">
      <div className="container mx-auto max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            DVFS <span className="text-gradient">Control Engine</span>
          </h1>
          <p className="text-gray-400">Dynamic Voltage and Frequency Scaling simulator for power optimization.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard>
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Cpu className="text-brand-neon" /> Processor Settings
              </h3>
              
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Core Voltage (V)</label>
                    <span className="font-mono text-brand-neon">{voltage.toFixed(2)} V</span>
                  </div>
                  <input 
                    type="range" min="0.8" max="1.5" step="0.01" 
                    value={voltage} onChange={handleVoltageChange} 
                    className="w-full accent-brand-neon"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0.8V (Power Save)</span>
                    <span>1.5V (Performance)</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Clock Frequency (GHz)</label>
                    <span className="font-mono text-brand-emerald">{frequency.toFixed(1)} GHz</span>
                  </div>
                  <input 
                    type="range" min="1.0" max="5.0" step="0.1" 
                    value={frequency} onChange={handleFrequencyChange} 
                    className="w-full accent-brand-emerald"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1.0 GHz</span>
                    <span>5.0 GHz</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAutoOptimize}
                  disabled={isOptimizing || !processorId}
                  className="w-full rounded-full border border-white/10 bg-brand-neon px-4 py-3 text-sm font-semibold text-black transition hover:bg-brand-neon/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isOptimizing ? "Auto-optimizing…" : "Auto Optimize"}
                </button>
              </div>
            </GlassCard>

            <div className="grid grid-cols-2 gap-4">
              <GlassCard glowColor="neon" className="flex flex-col items-center justify-center p-6 text-center">
                <Zap className="w-8 h-8 text-yellow-400 mb-2" />
                <div className="text-sm text-gray-400">Est. Power</div>
                <div className="text-2xl font-bold font-mono text-white">{power.toFixed(1)} W</div>
              </GlassCard>
              <GlassCard glowColor="emerald" className="flex flex-col items-center justify-center p-6 text-center">
                <Thermometer className="w-8 h-8 text-red-400 mb-2" />
                <div className="text-sm text-gray-400">Thermal</div>
                <div className="text-2xl font-bold font-mono text-white">{temp.toFixed(1)} °C</div>
              </GlassCard>
            </div>
          </div>

          {/* Charts */}
          <div className="lg:col-span-8">
            <GlassCard className="h-full min-h-[500px] flex flex-col">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Activity className="text-brand-cyan" /> Real-time Telemetry
              </h3>
              
              <div className="flex-grow w-full min-h-[320px] min-w-0">
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={history}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis yAxisId="left" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <YAxis yAxisId="right" orientation="right" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(17,17,17,0.9)', borderColor: '#ffffff20', borderRadius: '8px' }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="power" name="Power (W)" stroke="#fbbf24" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                    <Line yAxisId="right" type="monotone" dataKey="temp" name="Temp (°C)" stroke="#f87171" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
