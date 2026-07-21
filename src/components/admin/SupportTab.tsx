import React, { useState } from 'react';

interface Ticket {
  id: string;
  user: string;
  subject: string;
  status: string;
  date: string;
  message: string;
  replies: string[];
}

export const SupportTab: React.FC = () => {
  const [supportTickets, setSupportTickets] = useState<Ticket[]>([
    { id: 'TKT-88', user: 'bello_99', subject: 'BVN mismatched error', status: 'OPEN', date: '1 hour ago', message: 'I tried to input my BVN but my spelling differs from bank credentials.', replies: [] }
  ]);
  const [replyText, setReplyText] = useState('');

  const handleReply = (id: string) => {
    if (replyText.trim()) {
      setSupportTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'RESOLVED', replies: [...t.replies, replyText] } : t));
      setReplyText('');
    }
  };

  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Trader Support Tickets</h3>
        <span className="text-[10px] text-slate-400">Active Support Desk</span>
      </div>

      <div className="space-y-3 text-left">
        {supportTickets.map((tkt) => (
          <div key={tkt.id} className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-white text-xs block">{tkt.subject}</strong>
                <span className="text-[10px] text-slate-400">From @{tkt.user} • {tkt.date}</span>
              </div>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                {tkt.status}
              </span>
            </div>
            <p className="text-slate-300 italic">"{tkt.message}"</p>

            {tkt.replies.map((reply, idx) => (
              <div key={idx} className="p-2 bg-slate-950 border-l-2 border-purple-600 text-[10px] text-slate-300">
                <strong>Compliance Reply:</strong> {reply}
              </div>
            ))}

            <div className="flex gap-1 pt-1">
              <input 
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type resolution message..."
                className="flex-1 text-xs px-2.5 py-1 bg-slate-950 border border-slate-800 rounded focus:outline-none focus:border-purple-600 text-white"
              />
              <button 
                onClick={() => handleReply(tkt.id)}
                className="px-3 bg-purple-600 hover:bg-purple-700 text-white text-[10px] font-bold rounded cursor-pointer transition-colors"
              >
                Reply & Resolve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
