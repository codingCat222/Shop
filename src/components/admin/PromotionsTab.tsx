import React, { useState } from 'react';

interface Promo {
  code: string;
  discount: string;
  type: string;
  status: string;
}

interface PromotionsTabProps {
  promotions: Promo[];
  setPromotions: React.Dispatch<React.SetStateAction<Promo[]>>;
}

export const PromotionsTab: React.FC<PromotionsTabProps> = ({ promotions, setPromotions }) => {
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoDiscount, setNewPromoDiscount] = useState('');

  const handleCreatePromo = () => {
    if (newPromoCode && newPromoDiscount) {
      setPromotions(prev => [
        ...prev,
        { 
          code: newPromoCode.toUpperCase().replace(/\s+/g, ''), 
          discount: newPromoDiscount, 
          type: 'Percentage', 
          status: 'ACTIVE' 
        }
      ]);
      setNewPromoCode('');
      setNewPromoDiscount('');
    }
  };

  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Active Promo Codes & Coupons</h3>
        <span className="text-[10px] text-slate-400">Marketing campaigns</span>
      </div>

      <div className="space-y-2 text-left">
        {promotions.map((p) => (
          <div key={p.code} className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg text-xs font-mono">
            <div>
              <strong className="text-white text-xs">{p.code}</strong>
              <span className="text-[10px] text-slate-400 block">{p.type} • Discount: {p.discount}</span>
            </div>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${p.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
              {p.status}
            </span>
          </div>
        ))}
      </div>

      <div className="p-3 bg-slate-900 rounded-xl space-y-2 pt-3 border border-slate-800 mt-4 text-xs text-left">
        <h4 className="font-bold text-white mb-1 text-xs">Create Promo Voucher</h4>
        <div className="grid grid-cols-2 gap-2">
          <input 
            type="text" 
            value={newPromoCode}
            onChange={(e) => setNewPromoCode(e.target.value)}
            placeholder="Voucher Code (e.g. SAVINGS20)" 
            className="p-1.5 bg-slate-950 border border-slate-800 rounded focus:outline-none text-white text-xs"
          />
          <input 
            type="text" 
            value={newPromoDiscount}
            onChange={(e) => setNewPromoDiscount(e.target.value)}
            placeholder="Discount e.g. 15%" 
            className="p-1.5 bg-slate-950 border border-slate-800 rounded focus:outline-none text-white text-xs"
          />
        </div>
        <button 
          onClick={handleCreatePromo}
          className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg cursor-pointer text-xs transition-colors"
        >
          Authorize Voucher Launch
        </button>
      </div>
    </div>
  );
};
