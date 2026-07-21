import React, { useState } from 'react';
import { UserProfile } from '../../types';

interface UsersTabProps {
  pendingUsers: UserProfile[];
  onApproveUser: (userId: string) => void;
  onRejectUser: (userId: string, reason: string) => void;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  pendingUsers,
  onApproveUser,
  onRejectUser,
}) => {
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">KYC Document Verification Queue</h3>
        <span className="text-[10px] text-slate-500">Manual compliance overrides</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-2">
          {pendingUsers.length > 0 ? (
            pendingUsers.map((user) => (
              <div 
                key={user.id} 
                onClick={() => { setSelectedUser(user); setShowRejectForm(false); }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${selectedUser?.id === user.id ? 'border-purple-600 bg-purple-950/10' : 'border-slate-800 bg-slate-900/60'}`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-xs text-white block">{user.name}</strong>
                    <span className="text-[10px] text-slate-400 font-mono">@{user.username} • {user.email}</span>
                  </div>
                  <span className="text-[9px] font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full font-bold">{user.tempId}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-slate-500 text-xs">No pending verification applicants found.</div>
          )}
        </div>

        <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800">
          {selectedUser ? (
            <div className="space-y-4 text-xs">
              <h4 className="font-bold text-white text-xs border-b border-slate-800 pb-2">Document Inspector</h4>
              <div className="space-y-2 text-[11px] text-slate-300 font-mono">
                <p>BVN Code: <strong className="text-white">{selectedUser.documents?.bvn || 'N/A'}</strong></p>
                <p>Phone: <strong className="text-white">{selectedUser.phoneNumber || 'N/A'}</strong></p>
                <p>Bank: <strong className="text-white">{selectedUser.bankName || 'Access Bank'}</strong></p>
                <p>Account NUBAN: <strong className="text-white">{selectedUser.accountNumber || 'N/A'}</strong></p>
              </div>

              {!showRejectForm ? (
                <div className="space-y-2 pt-2">
                  <button 
                    onClick={() => { onApproveUser(selectedUser.id); setSelectedUser(null); }}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-bold text-xs rounded-lg cursor-pointer"
                  >
                    Approve Registration
                  </button>
                  <button 
                    onClick={() => setShowRejectForm(true)}
                    className="w-full py-2 bg-slate-800 hover:bg-red-950/20 text-red-400 font-bold text-xs rounded-lg border border-slate-700 cursor-pointer"
                  >
                    Reject Documents
                  </button>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-bold text-red-400 block uppercase">Rejection Reason</label>
                  <input 
                    type="text" 
                    required
                    value={rejectionReason} 
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="e.g., Mismatched document spelling"
                    className="w-full px-2 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs focus:outline-none focus:border-red-500 text-white"
                  />
                  <div className="flex gap-1">
                    <button 
                      onClick={() => { 
                        if (rejectionReason.trim()) {
                          onRejectUser(selectedUser.id, rejectionReason); 
                          setSelectedUser(null); 
                          setShowRejectForm(false);
                          setRejectionReason('');
                        }
                      }}
                      className="flex-1 py-1.5 bg-red-600 text-white font-bold text-[10px] rounded cursor-pointer"
                    >
                      Submit Reject
                    </button>
                    <button onClick={() => setShowRejectForm(false)} className="px-2 py-1.5 bg-slate-800 text-slate-300 font-bold text-[10px] rounded cursor-pointer">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500 text-[11px]">Select a user queue item to inspect bank identity credentials.</div>
          )}
        </div>
      </div>
    </div>
  );
};
