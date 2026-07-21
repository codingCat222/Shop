import React, { useState } from 'react';

interface Vendor {
  id: string;
  name: string;
  username: string;
  rating: number;
  tier: 'PRO' | 'STANDARD';
  status: 'ACTIVE' | 'SUSPENDED';
  volume: string;
}

export const VendorsTab: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([
    { id: 'V-001', name: 'Adebayo S.', username: 'agro_merch', rating: 4.9, tier: 'PRO', status: 'ACTIVE', volume: '₦1,240,000' },
    { id: 'V-002', name: 'Mustapha Metals', username: 'scrap_king', rating: 4.7, tier: 'STANDARD', status: 'ACTIVE', volume: '₦340,000' },
    { id: 'V-003', name: 'Olamide Coker', username: 'ola_gadgets', rating: 4.5, tier: 'PRO', status: 'ACTIVE', volume: '₦680,000' },
    { id: 'V-004', name: 'Smart Trade Nigeria', username: 'scammer_user', rating: 1.2, tier: 'STANDARD', status: 'SUSPENDED', volume: '₦1,000' }
  ]);

  const toggleVendorTier = (id: string) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, tier: v.tier === 'PRO' ? 'STANDARD' : 'PRO' } : v));
  };

  const toggleVendorStatus = (id: string) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status: v.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE' } : v));
  };

  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Merchant Store Clearance & Badging</h3>
        <span className="text-[10px] text-slate-400">Total: {vendors.length} Registered Merchants</span>
      </div>

      <div className="space-y-3">
        {vendors.map((vendor) => (
          <div key={vendor.id} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs font-sans">
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-white text-sm">{vendor.name}</strong>
                <span className="text-slate-400 font-mono text-[10px]">@{vendor.username}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${vendor.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {vendor.status}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Rating: <span className="text-yellow-400">★ {vendor.rating}</span> • Secured Trading Volume: <strong className="text-slate-200">{vendor.volume}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto justify-end">
              <button
                onClick={() => toggleVendorTier(vendor.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  vendor.tier === 'PRO'
                    ? 'bg-purple-600/20 text-purple-400 border-purple-500/30 hover:bg-purple-600/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {vendor.tier === 'PRO' ? '✓ Pro Badge Active' : 'Grant Pro Badge'}
              </button>
              
              <button
                onClick={() => toggleVendorStatus(vendor.id)}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                  vendor.status === 'ACTIVE'
                    ? 'bg-slate-800 text-red-400 border-red-900/20 hover:bg-red-950/20'
                    : 'bg-green-600/20 text-green-400 border-green-500/30 hover:bg-green-600/30'
                }`}
              >
                {vendor.status === 'ACTIVE' ? 'Suspend Merchant' : 'Re-activate'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
