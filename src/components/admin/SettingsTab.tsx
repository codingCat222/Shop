import React from 'react';

interface SettingsTabProps {
  escrowFee: number;
  setEscrowFee: (val: number) => void;
  systemOnline: boolean;
  setSystemOnline: (val: boolean) => void;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({
  escrowFee,
  setEscrowFee,
  systemOnline,
  setSystemOnline,
}) => {
  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Escrow Processing Commission Fee</h3>
        <span className="text-[10px] text-slate-400">Platform-wide settlement fees</span>
      </div>

      <div className="space-y-4 text-xs text-left">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Default Escrow Commission Rate</span>
            <strong className="text-purple-400">{escrowFee}%</strong>
          </div>
          <input 
            type="range" 
            min={0.5} 
            max={5} 
            step={0.1}
            value={escrowFee}
            onChange={(e) => setEscrowFee(parseFloat(e.target.value))}
            className="w-full accent-purple-600 h-1 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
          <div>
            <strong className="text-white block">Naira Trading Settlement Switch</strong>
            <span className="text-[10px] text-slate-400">Turn off peer-to-peer operations temporarily during system upgrades</span>
          </div>
          <button 
            onClick={() => {
              const nextState = !systemOnline;
              setSystemOnline(nextState);
              alert(nextState ? 'System restored to fully active trading state.' : 'System placed into compliance mode.');
            }}
            className={`text-[10px] font-sans font-bold px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${systemOnline ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'}`}
          >
            {systemOnline ? 'P2P Online' : 'P2P Paused'}
          </button>
        </div>
      </div>
    </div>
  );
};
