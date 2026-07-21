import React from 'react';
import { ChevronRight } from 'lucide-react';
import { UserProfile, TradeItem } from '../../types';

interface OverviewTabProps {
  adminRevenue: number;
  totalVolume: number;
  totalDisputed: number;
  pendingUsers: UserProfile[];
  trades: TradeItem[];
  setActiveSection: (section: string) => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  adminRevenue,
  totalVolume,
  totalDisputed,
  pendingUsers,
  trades,
  setActiveSection,
}) => {
  return (
    <div className="space-y-6">
      {/* Performance Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-[#020617] p-4 rounded-2xl border border-slate-800">
          <span className="text-[9px] text-slate-400 font-bold uppercase block">1% Processing Revenue</span>
          <strong className="text-lg font-black text-white block mt-1">₦{adminRevenue.toLocaleString()}</strong>
          <span className="text-[8px] text-slate-500 font-mono">Based on active escrow rate</span>
        </div>
        <div className="bg-[#020617] p-4 rounded-2xl border border-slate-800">
          <span className="text-[9px] text-slate-400 font-bold uppercase block">Total Escrow Volume</span>
          <strong className="text-lg font-black text-white block mt-1">₦{totalVolume.toLocaleString()}</strong>
          <span className="text-[8px] text-slate-500 font-mono">Across registered users</span>
        </div>
        <div className="bg-[#020617] p-4 rounded-2xl border border-slate-800">
          <span className="text-[9px] text-slate-400 font-bold uppercase block">Disputed Cases</span>
          <strong className="text-lg font-black text-amber-500 block mt-1">{totalDisputed}</strong>
          <span className="text-[8px] text-slate-500 font-mono">Flagged trade overrides</span>
        </div>
        <div className="bg-[#020617] p-4 rounded-2xl border border-slate-800">
          <span className="text-[9px] text-slate-400 font-bold uppercase block">KYC Document Queue</span>
          <strong className="text-lg font-black text-emerald-500 block mt-1">{pendingUsers.length}</strong>
          <span className="text-[8px] text-slate-500 font-mono">Verification applicants</span>
        </div>
      </div>

      {/* Operational Quicklinks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#020617] p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-white border-b border-slate-800 pb-2">Compliance Action Required</h3>
          <div className="space-y-2">
            {pendingUsers.length > 0 ? (
              pendingUsers.slice(0, 3).map((user) => (
                <div key={user.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-900 rounded-lg">
                  <div>
                    <span className="font-bold text-slate-200 block">{user.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">BVN Verification</span>
                  </div>
                  <button 
                    onClick={() => setActiveSection('Users')}
                    className="text-[10px] font-bold text-purple-400 hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    Review <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-slate-500 text-xs py-3 text-center">All user verification queues are clean!</div>
            )}
          </div>
        </div>

        <div className="bg-[#020617] p-4 rounded-2xl border border-slate-800 space-y-3">
          <h3 className="text-xs font-bold text-white border-b border-slate-800 pb-2">Recent Escrows</h3>
          <div className="space-y-2">
            {trades.slice(0, 3).map((t) => (
              <div key={t.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-900 rounded-lg">
                <div>
                  <span className="font-bold text-slate-200 block truncate max-w-[150px]">{t.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">₦{t.amount.toLocaleString()}</span>
                </div>
                <span className="text-[9px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-mono uppercase font-bold">{t.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
