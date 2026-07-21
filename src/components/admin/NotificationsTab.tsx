import React from 'react';

interface NotificationsTabProps {
  cmsAlert: string;
  setCmsAlert: (val: string) => void;
}

export const NotificationsTab: React.FC<NotificationsTabProps> = ({ cmsAlert, setCmsAlert }) => {
  const handleBroadcast = () => {
    alert('Global alert notice successfully broadcasted to all active merchant and buyer interfaces.');
  };

  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Broadcast Global Platform Notification</h3>
        <span className="text-[10px] text-slate-400">System announcement engine</span>
      </div>

      <div className="space-y-3 text-xs text-left">
        <div>
          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Notice Content Banner</label>
          <textarea 
            rows={3} 
            value={cmsAlert}
            onChange={(e) => setCmsAlert(e.target.value)}
            placeholder="Naira wallet deposit settlement speed upgraded..."
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-600"
          />
        </div>
        <button 
          onClick={handleBroadcast}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors"
        >
          Broadcast System Alert Notice
        </button>
      </div>
    </div>
  );
};
