import React from 'react';
import { AuditLog } from '../../types';

interface ActivityLogsTabProps {
  auditLogs: AuditLog[];
}

export const ActivityLogsTab: React.FC<ActivityLogsTabProps> = ({ auditLogs }) => {
  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Administrative Actions Security Log Feed</h3>
        <span className="text-[10px] text-slate-500">Auto-Refreshed</span>
      </div>

      <div className="space-y-2 max-h-[380px] overflow-y-auto no-scrollbar font-mono text-[10.5px] text-left">
        {auditLogs.map((log) => (
          <div key={log.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-lg space-y-1">
            <div className="flex justify-between">
              <strong className="text-purple-400 uppercase">{log.action}</strong>
              <span className="text-slate-500 text-[9px]">{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-slate-300 font-sans">{log.details}</p>
            <div className="flex justify-between text-[9px] text-slate-500 font-sans">
              <span>ID: {log.id}</span>
              <span>Actor: @{log.actor}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
