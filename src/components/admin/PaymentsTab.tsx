import React, { useState } from 'react';

interface PaymentLog {
  id: string;
  type: string;
  reference: string;
  amount: number;
  status: 'SUCCESS' | 'ESCROWED' | 'FAILED';
  channel: string;
  time: string;
}

export const PaymentsTab: React.FC = () => {
  const [payments] = useState<PaymentLog[]>([
    { id: 'P-901', type: 'CREDIT_CLEARANCE', reference: 'PAY-9428 • Naira Wallet Deposit', amount: 50000, status: 'SUCCESS', channel: 'WEMA API', time: '10 mins ago' },
    { id: 'P-902', type: 'ESCROW_HOLD', reference: 'ESC-8829 • Secure Trade Release Lock', amount: 24000, status: 'ESCROWED', channel: 'Providus Settlement API', time: '1 hour ago' },
    { id: 'P-903', type: 'WALLET_FUNDING', reference: 'PAY-1104 • Quick checkout fund', amount: 82000, status: 'SUCCESS', channel: 'Biometric Pay', time: '2 hours ago' },
    { id: 'P-904', type: 'REFUND_DISPATCH', reference: 'RFD-3942 • Escrow mediation return', amount: 12000, status: 'SUCCESS', channel: 'Auto-Vault Transfer', time: 'Yesterday' }
  ]);

  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Naira Gateway Payment Audit</h3>
        <span className="text-[10px] text-emerald-400">Wema & Providus Settlement API Active</span>
      </div>

      <div className="space-y-2.5 text-xs font-mono text-left">
        {payments.map((pay) => (
          <div key={pay.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-bold block text-[10px] ${
                  pay.status === 'SUCCESS' ? 'text-emerald-400' :
                  pay.status === 'ESCROWED' ? 'text-purple-400' : 'text-rose-400'
                }`}>{pay.type} • {pay.status}</span>
                <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">{pay.channel}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">Ref: {pay.reference} ({pay.time})</span>
            </div>
            <strong className="text-white text-sm">₦{pay.amount.toLocaleString()}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
