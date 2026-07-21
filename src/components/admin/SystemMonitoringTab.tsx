import React from 'react';

interface SystemMonitoringTabProps {
  systemCpu: number;
}

export const SystemMonitoringTab: React.FC<SystemMonitoringTabProps> = ({ systemCpu }) => {
  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Virtual Server Telemetry & Latency Logs</h3>
        <span className="text-[10px] text-emerald-400 font-bold animate-pulse">● LIVE STREAM ACTIVE</span>
      </div>

      <div className="space-y-3 text-xs font-mono text-left">
        <div className="p-3 bg-slate-900 rounded-xl space-y-2">
          <div className="flex justify-between text-[11px]">
            <span>CPU Processor Core Utilization</span>
            <strong className="text-purple-400">{systemCpu}%</strong>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full transition-all duration-500" 
              style={{ width: `${systemCpu}%` }} 
            />
          </div>
        </div>

        <div className="p-3 bg-slate-900 rounded-xl space-y-2">
          <div className="flex justify-between text-[11px]">
            <span>RAM Memory Allocation</span>
            <strong className="text-purple-400">542 MB / 1024 MB</strong>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-500 h-full" style={{ width: '53%' }} />
          </div>
        </div>

        <div className="p-3 bg-slate-900 rounded-xl space-y-1 text-[10px] text-slate-400">
          <p className="text-white font-bold mb-1 text-[11px]">Microservice Nodes Status:</p>
          <p>• auth-service-k8s: <span className="text-green-400">HEALTHY (9ms)</span></p>
          <p>• escrow-vault-worker: <span className="text-green-400">HEALTHY (14ms)</span></p>
          <p>• nuban-settlement-cron: <span className="text-green-400">HEALTHY (22ms)</span></p>
        </div>
      </div>
    </div>
  );
};
