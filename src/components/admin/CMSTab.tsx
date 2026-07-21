import React, { useState } from 'react';

interface CMSTabProps {
  cmsAlert: string;
  setCmsAlert: (val: string) => void;
}

export const CMSTab: React.FC<CMSTabProps> = ({ cmsAlert, setCmsAlert }) => {
  const [welcomeTitle, setWelcomeTitle] = useState('TESM Peer-to-Peer Secure Escrow Trading');

  const handleCMSUpdate = () => {
    alert('CMS updates synchronized with production static views successfully.');
  };

  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Content Management System Settings</h3>
        <span className="text-[10px] text-slate-400">Configure Landing Content</span>
      </div>

      <div className="space-y-3 text-xs text-left">
        <div>
          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">Banner Welcome Title</label>
          <input 
            type="text" 
            value={welcomeTitle}
            onChange={(e) => setWelcomeTitle(e.target.value)}
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-600"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-slate-400 block uppercase mb-1">System-wide Banner Notice</label>
          <input 
            type="text" 
            value={cmsAlert}
            onChange={(e) => setCmsAlert(e.target.value)}
            className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-purple-600"
          />
        </div>
        <button 
          onClick={handleCMSUpdate}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg cursor-pointer transition-colors"
        >
          Update Static Landing CMS
        </button>
      </div>
    </div>
  );
};
