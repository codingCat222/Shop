import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShieldCheck, Landmark, User, CheckCircle2, Copy, Check } from 'lucide-react';
import { UserProfile } from '../types';
import { NIGERIAN_BANKS } from '../mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (profile: UserProfile) => void;
  initialMode?: 'login' | 'register' | 'verify-wizard';
  activeProfile?: UserProfile | null;
  onUpdateProfile?: (updated: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess, initialMode = 'login', activeProfile, onUpdateProfile }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'verify-wizard'>(initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');

  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [bankName, setBankName] = useState('Guaranty Trust Bank (GTB)');
  const [accountNumber, setAccountNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleCopyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const DEMO_ADMIN_EMAIL = 'admin@shopfair.com';
  const DEMO_ADMIN_PASSWORD = 'ShopFairAdmin!2024';

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    if (email.toLowerCase() === DEMO_ADMIN_EMAIL && password === DEMO_ADMIN_PASSWORD) {
      const adminProfile: UserProfile = {
        id: `usr_${Date.now()}`,
        tempId: `SHOPFAIR-${Math.floor(100000 + Math.random() * 900000)}`,
        name: 'Admin',
        username: 'admin',
        email: email,
        role: 'admin',
        verificationStatus: 'VERIFIED',
        walletBalance: 0,
        isPro: false,
        avatarColor: 'bg-purple-600'
      };

      onAuthSuccess(adminProfile);
      onClose();
      return;
    }

    const userPart = email.split('@')[0];
    const createdProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      tempId: `SHOPFAIR-${Math.floor(100000 + Math.random() * 900000)}`,
      name: userPart.charAt(0).toUpperCase() + userPart.slice(1),
      username: userPart.toLowerCase(),
      email: email,
      role: 'buyer',
      verificationStatus: 'UNVERIFIED',
      walletBalance: 0,
      isPro: false,
      avatarColor: 'bg-purple-600'
    };

    onAuthSuccess(createdProfile);
    setMode('verify-wizard');
    setWizardStep(1);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username) return;

    const createdProfile: UserProfile = {
      id: `usr_${Date.now()}`,
      tempId: `SHOPFAIR-${Math.floor(100000 + Math.random() * 900000)}`,
      name: fullName || username,
      username: username.toLowerCase().replace(/\s+/g, ''),
      email: email,
      role: 'buyer',
      verificationStatus: 'UNVERIFIED',
      walletBalance: 0,
      isPro: false,
      avatarColor: 'bg-purple-600'
    };

    onAuthSuccess(createdProfile);
    setMode('verify-wizard');
    setWizardStep(1);
  };

  const handleProfileSetup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProfile) return;

    const updated: UserProfile = {
      ...activeProfile,
      name: fullName || activeProfile.name,
      username: username ? username.toLowerCase() : activeProfile.username,
      bankName: bankName,
      accountNumber: accountNumber || '0123456789',
      phoneNumber: phoneNumber || '+234 812 345 6789',
      verificationStatus: 'PENDING'
    };

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
    setWizardStep(2);
  };

  const handleFundWallet = () => {
    if (!activeProfile) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const updated: UserProfile = {
        ...activeProfile,
        walletBalance: 82000,
        verificationStatus: 'VERIFIED'
      };

      if (onUpdateProfile) {
        onUpdateProfile(updated);
      }
      setIsSubmitting(false);
      setWizardStep(3);
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-md overflow-hidden bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col"
          >
            <div className="h-1.5 w-full bg-purple-600" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 md:p-8 overflow-y-auto max-h-[85vh] no-scrollbar">
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600 mb-3">
                      <ShieldCheck className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900">Sign in to ShopFair</h3>
                    <p className="text-sm font-sans text-slate-500 mt-1">Unlock secure trades & real-time messaging</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rumline@shopfair.com"
                        className="w-full font-sans text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full font-sans text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full font-sans font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 py-3.5 rounded-xl transition-all shadow-md shadow-purple-100 flex items-center justify-center cursor-pointer"
                  >
                    Continue Securely
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-xs font-sans font-semibold text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      New to ShopFair? Create a secure account
                    </button>
                  </div>
                </form>
              )}

              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-5">
                  <div className="text-center">
                    <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-xl bg-purple-50 text-purple-600 mb-3">
                      <User className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-slate-900">Create Account</h3>
                    <p className="text-sm font-sans text-slate-500 mt-1">Get started with secure multi-sig escrow trading</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rumline Peters"
                        className="w-full font-sans text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Username</label>
                      <input
                        type="text"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="e.g. rumline"
                        className="w-full font-sans text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Email Address</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. rumline@example.com"
                        className="w-full font-sans text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Password</label>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full font-sans text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full font-sans font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 py-3.5 rounded-xl transition-all shadow-md shadow-purple-100 flex items-center justify-center cursor-pointer"
                  >
                    Register & Verify Identity
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-xs font-sans font-semibold text-purple-600 hover:text-purple-700 hover:underline"
                    >
                      Already registered? Sign in
                    </button>
                  </div>
                </form>
              )}

              {mode === 'verify-wizard' && (
                <div className="space-y-6">
                  {wizardStep === 1 && (
                    <form onSubmit={handleProfileSetup} className="space-y-5">
                      <div className="text-center">
                        <span className="inline-block text-[10px] font-mono font-bold tracking-widest text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full uppercase">
                          STEP 1 OF 2
                        </span>
                        <h3 className="text-2xl font-display font-bold text-slate-900 mt-2">Set up your profile</h3>
                        <p className="text-xs font-sans text-slate-500 mt-1">
                          Your temporary workspace ID is <span className="font-mono font-bold text-slate-800">{activeProfile?.tempId || 'SHOPFAIR-849302'}</span>
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Full Name</label>
                          <input
                            type="text"
                            required
                            value={fullName || activeProfile?.name || ''}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Rumline Peters"
                            className="w-full font-sans text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 focus:bg-white transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Username</label>
                            <input
                              type="text"
                              required
                              value={username || activeProfile?.username || ''}
                              onChange={(e) => setUsername(e.target.value)}
                              placeholder="e.g. rumline"
                              className="w-full font-sans text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 focus:bg-white transition-all"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Phone Number</label>
                            <input
                              type="tel"
                              required
                              value={phoneNumber}
                              onChange={(e) => setPhoneNumber(e.target.value)}
                              placeholder="+234 812 345 6789"
                              className="w-full font-sans text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Select Settlement Bank</label>
                          <select
                            value={bankName}
                            onChange={(e) => setBankName(e.target.value)}
                            className="w-full font-sans text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 focus:bg-white transition-all"
                          >
                            {NIGERIAN_BANKS.map((b) => (
                              <option key={b} value={b}>{b}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Account Number</label>
                          <input
                            type="text"
                            required
                            pattern="\d{10}"
                            maxLength={10}
                            value={accountNumber}
                            onChange={(e) => setAccountNumber(e.target.value)}
                            placeholder="10 digit NUBAN"
                            className="w-full font-sans text-sm px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 focus:bg-white transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full font-sans font-bold text-sm text-white bg-purple-600 hover:bg-purple-700 py-3.5 rounded-xl transition-all shadow-md shadow-purple-100 flex items-center justify-center cursor-pointer"
                      >
                        Save & Proceed to Fund Wallet
                      </button>
                    </form>
                  )}

                  {wizardStep === 2 && (
                    <div className="space-y-5">
                      <div className="text-center">
                        <span className="inline-block text-[10px] font-mono font-bold tracking-widest text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full uppercase">
                          STEP 2 OF 2
                        </span>
                        <h3 className="text-2xl font-display font-bold text-slate-900 mt-2">Fund your secure wallet</h3>
                        <p className="text-xs font-sans text-slate-500 mt-1">
                          Instantly activate trading, listing, and messaging features by pre-funding your account.
                        </p>
                      </div>

                      <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100 space-y-4">
                        <div className="flex items-center justify-between text-xs border-b border-purple-100 pb-2">
                          <span className="font-sans text-slate-500">ESCROW ASSIGNED BANK</span>
                          <span className="font-sans font-bold text-purple-700 flex items-center gap-1">
                            <Landmark className="w-3 h-3" /> WEMA Bank
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="block text-[10px] font-sans font-bold tracking-wider text-slate-400">ACCOUNT NUMBER</span>
                            <span className="text-lg font-mono font-bold text-slate-800">9482740294</span>
                          </div>
                          <button
                            onClick={() => handleCopyText('9482740294')}
                            className="p-2 bg-white hover:bg-purple-100 text-purple-600 rounded-xl transition-colors border border-purple-100/50 shadow-xs"
                          >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <div>
                            <span className="block text-[10px] font-sans font-bold tracking-wider text-slate-400">ACCOUNT NAME</span>
                            <span className="text-xs font-sans font-bold text-slate-700">
                              SHOPFAIR / {activeProfile?.name?.toUpperCase() || 'RUMLINE'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 bg-green-50 text-green-800 rounded-xl border border-green-100 flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                        <p className="text-xs font-sans leading-relaxed">
                          This is a secure virtual settlement vault configured specifically for your account. Funds sent clear immediately.
                        </p>
                      </div>

                      <button
                        onClick={handleFundWallet}
                        disabled={isSubmitting}
                        className="w-full font-sans font-bold text-sm text-white bg-green-600 hover:bg-green-700 py-3.5 rounded-xl transition-all shadow-md shadow-green-100 flex items-center justify-center cursor-pointer disabled:opacity-50"
                      >
                        {isSubmitting ? 'Verifying payment clearing...' : "I've sent the money"}
                      </button>
                    </div>
                  )}

                  {wizardStep === 3 && (
                    <div className="space-y-6 text-center py-4">
                      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-green-50 text-green-500 shadow-lg shadow-green-100 mb-2">
                        <CheckCircle2 className="w-10 h-10 stroke-[2] animate-bounce" />
                      </div>

                      <div>
                        <h3 className="text-2xl font-display font-bold text-slate-900">
                          Welcome, {activeProfile?.username || 'rumline'}!
                        </h3>
                        <p className="text-sm font-sans text-slate-500 mt-2">
                          Your account is all set up and fully verified. You are ready to explore the marketplace, chat with sellers, and start trading securely.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-left">
                        <div>
                          <span className="block text-[10px] font-sans font-bold text-slate-400 uppercase">AVAILABLE WALLET</span>
                          <span className="text-lg font-sans font-bold text-slate-800">₦82,000.00</span>
                        </div>
                        <div>
                          <span className="block text-[10px] font-sans font-bold text-slate-400 uppercase">VERIFICATION BADGE</span>
                          <span className="inline-flex items-center gap-1 text-xs font-sans font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full mt-1">
                            <ShieldCheck className="w-3.5 h-3.5" /> Verified
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          if (activeProfile) {
                            onAuthSuccess({
                              ...activeProfile,
                              walletBalance: 82000,
                              verificationStatus: 'VERIFIED'
                            });
                          }
                          onClose();
                        }}
                        className="w-full font-sans font-bold text-sm text-white bg-green-600 hover:bg-green-700 py-3.5 rounded-xl transition-all shadow-md shadow-green-100 flex items-center justify-center cursor-pointer"
                      >
                        Explore ShopFair
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}