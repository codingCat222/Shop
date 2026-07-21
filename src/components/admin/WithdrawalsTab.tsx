import React from 'react';

interface Withdrawal {
  id: string;
  name: string;
  amount: number;
  bank: string;
  account: string;
  status: string;
  date: string;
}

interface WithdrawalsTabProps {
  withdrawals: Withdrawal[];
  setWithdrawals: React.Dispatch<React.SetStateAction<Withdrawal[]>>;
}

export const WithdrawalsTab: React.FC<WithdrawalsTabProps> = ({ withdrawals, setWithdrawals }) => {
  const handleApprove = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'APPROVED' } : w));
  };

  const handleReject = (id: string) => {
    setWithdrawals(prev => prev.map(w => w.id === id ? { ...w, status: 'REJECTED' } : w));
  };

  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">NUBAN Withdrawal Settlement Payouts</h3>
        <span className="text-[10px] text-slate-400">Total requests: {withdrawals.length}</span>
      </div>

      <div className="space-y-3 text-left">
        {withdrawals.map((item) => (
          <div key={item.id} className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-white block">{item.name}</strong>
                <span className="text-[10px] text-slate-400">{item.bank} • Acct: {item.account}</span>
              </div>
              <div className="text-right">
                <span className="block font-black text-white">₦{item.amount.toLocaleString()}</span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                  item.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                  item.status === 'APPROVED' ? 'bg-green-500/10 text-green-400' :
                  'bg-red-500/10 text-red-400'
                }`}>{item.status}</span>
              </div>
            </div>

            {item.status === 'PENDING' && (
              <div className="flex gap-2 pt-2 border-t border-slate-800/60">
                <button 
                  onClick={() => handleApprove(item.id)}
                  className="flex-1 py-1 bg-green-600 hover:bg-green-700 text-white text-[10px] font-bold rounded cursor-pointer transition-colors"
                >
                  Release Payout
                </button>
                <button 
                  onClick={() => handleReject(item.id)}
                  className="px-3 py-1 bg-slate-800 hover:bg-red-950/20 text-red-400 text-[10px] font-bold rounded cursor-pointer border border-slate-700 transition-colors"
                >
                  Deny
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
