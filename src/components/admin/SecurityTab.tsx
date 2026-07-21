import React from 'react';

interface SecurityTabProps {
  securityMFA: boolean;
  setSecurityMFA: (val: boolean) => void;
}

export const SecurityTab: React.FC<SecurityTabProps> = ({ securityMFA, setSecurityMFA }) => {
  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">System Cryptography & Access Rules</h3>
        <span className="text-[10px] text-slate-400">Security Suite</span>
      </div>

      <div className="space-y-3.5 text-xs text-left">
        <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
          <div>
            <strong className="text-white block">Enforce 2FA Authenticator BVN Matching</strong>
            <span className="text-[10px] text-slate-400">Require all verified accounts to declare biometric details</span>
          </div>
          <input 
            type="checkbox" 
            checked={securityMFA} 
            onChange={() => setSecurityMFA(!securityMFA)}
            className="w-4 h-4 text-purple-600 focus:ring-purple-500 bg-slate-950 border-slate-800 rounded cursor-pointer"
          />
        </div>

        <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-800">
          <div>
            <strong className="text-white block">Compliance Safety Threshold Level</strong>
            <span className="text-[10px] text-slate-400">Set threat mitigation filter level</span>
          </div>
          <select className="bg-slate-950 border border-slate-800 text-xs font-bold text-slate-300 rounded px-2.5 py-1 focus:outline-none">
            <option>Level 1 - Light Monitoring</option>
            <option>Level 2 - BVN + NUBAN Required</option>
            <option>Level 3 - Strict Manual Approvals</option>
          </select>
        </div>
      </div>
    </div>
  );
};
