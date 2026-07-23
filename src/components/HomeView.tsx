import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Eye, EyeOff, History, Landmark, Download, ArrowUpRight, ArrowDownLeft, Share2, Store, ShoppingCart, MessageSquare, Clock, ShieldCheck, ChevronRight, X, Phone, Wifi, Gift, Briefcase } from 'lucide-react';
import { UserProfile } from '../types';
import { mockProducts } from '../mockData';
import QuickTransferModal from './QuickTransferModal';

interface HomeViewProps {
  activeProfile: UserProfile;
  onNavigateTab: (tab: 'home' | 'trade' | 'chat' | 'market') => void;
  onRoleSwitch: (role: 'buyer' | 'seller') => void;
  onOpenStoreUpgrade: () => void;
  onOpenDeposit: () => void;
  onOpenTransfer: () => void;
  onNavigateToLanding?: () => void;
}

export default function HomeView({ activeProfile, onNavigateTab, onRoleSwitch, onOpenStoreUpgrade, onOpenDeposit, onOpenTransfer, onNavigateToLanding }: HomeViewProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [referModalOpen, setReferModalOpen] = useState(false);
  const [quickTransferOpen, setQuickTransferOpen] = useState(false);

  const trendingProducts = mockProducts.slice(0, 2);

  const isSeller = activeProfile.role === 'seller';

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-y-auto no-scrollbar pb-24">

      {/* Header without notification bell */}
      <div className="px-4 pt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setRoleModalOpen(true)}
            className="w-10 h-10 rounded-full bg-purple-100 border border-purple-200 text-purple-600 font-sans font-bold text-sm flex items-center justify-center cursor-pointer hover:bg-purple-200 transition-colors"
          >
            {activeProfile.name.charAt(0).toUpperCase()}
          </button>
          <div>
            <span className="block text-slate-400 text-xs font-sans">Welcome back</span>
            <span className="text-sm font-sans font-extrabold text-slate-800 flex items-center gap-1">
              {activeProfile.name} 
              {activeProfile.verificationStatus === 'VERIFIED' && (
                <ShieldCheck className="w-3.5 h-3.5 text-green-500 fill-green-50" />
              )}
            </span>
          </div>
        </div>

        <button 
          onClick={() => setRoleModalOpen(true)}
          className={`text-[10px] font-sans font-extrabold px-2.5 py-1 rounded-full border cursor-pointer capitalize transition-colors ${
            isSeller 
              ? 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100' 
              : 'bg-purple-50 text-purple-600 border-purple-100 hover:bg-purple-100'
          }`}
        >
          Role: {activeProfile.role}
        </button>
      </div>

      {/* Available Balance - SMALLER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="px-4 mt-3"
      >
        <div className="bg-slate-900 text-white rounded-2xl px-4 py-3 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Landmark className="w-3 h-3 text-purple-400" />
              <span className="text-[9px] font-sans text-slate-400 tracking-wide font-medium">Available Balance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowBalance(!showBalance)}
                className="p-0.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
              >
                {showBalance ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
              <button className="p-0.5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors">
                <History className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-1">
            <span className="text-xl font-display font-black tracking-tight">
              {showBalance ? `₦${activeProfile.walletBalance.toLocaleString()}.00` : '•••••••'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 mt-2">
            <div className="bg-white/5 rounded-xl px-2 py-1.5 border border-white/5 flex items-center gap-1.5">
              <div className="p-0.5 bg-blue-500/10 text-blue-400 rounded-lg">
                <ArrowDownLeft className="w-3 h-3 stroke-[2.5]" />
              </div>
              <div>
                <span className="block text-[7px] font-sans text-slate-400 font-bold uppercase tracking-wider">Pending In</span>
                <span className="text-[9px] font-sans font-bold text-slate-200">
                  {showBalance ? `₦${activeProfile.walletBalance.toLocaleString()}.00` : '•••••••'}
                </span>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl px-2 py-1.5 border border-white/5 flex items-center gap-1.5">
              <div className="p-0.5 bg-amber-500/10 text-amber-400 rounded-lg">
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              </div>
              <div>
                <span className="block text-[7px] font-sans text-slate-400 font-bold uppercase tracking-wider">Pending Out</span>
                <span className="text-[9px] font-sans font-bold text-slate-200">
                  {showBalance ? `₦${activeProfile.walletBalance.toLocaleString()}.00` : '•••••••'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Market Actions - WITH SHADOWS */}
      <div className="px-4 mt-4">
        <h3 className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 mb-2">Market Actions</h3>
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-2 gap-2"
        >
          {/* Trade - Green with Briefcase icon */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2, scale: 1.01 }}
            onClick={() => onNavigateTab('trade')}
            className="p-3 bg-white border border-slate-100 hover:border-green-300 shadow-md hover:shadow-lg rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-green-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] font-sans font-bold text-slate-800">Trade</span>
                <span className="text-[9px] font-sans text-slate-400">Create & manage escrow</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </motion.div>

          {/* My Store - Orange */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2, scale: 1.01 }}
            onClick={onOpenStoreUpgrade}
            className="p-3 bg-white border border-slate-100 hover:border-orange-300 shadow-md hover:shadow-lg rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] font-sans font-bold text-slate-800">My Store</span>
                <span className="text-[9px] font-sans text-slate-400">List merchant items</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </motion.div>

          {/* Chats - Blue */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2, scale: 1.01 }}
            onClick={() => onNavigateTab('chat')}
            className="p-3 bg-white border border-slate-100 hover:border-blue-300 shadow-md hover:shadow-lg rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] font-sans font-bold text-slate-800">Chats</span>
                <span className="text-[9px] font-sans text-slate-400">Direct user channels</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </motion.div>

          {/* Pending Trades - Yellow */}
          <motion.div
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2, scale: 1.01 }}
            onClick={() => onNavigateTab('trade')}
            className="p-3 bg-white border border-slate-100 hover:border-yellow-300 shadow-md hover:shadow-lg rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-yellow-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="block text-[11px] font-sans font-bold text-slate-800">Pending Trades</span>
                <span className="text-[9px] font-sans text-slate-400">Awaiting clearance</span>
              </div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </motion.div>
        </motion.div>
      </div>

      {/* Refer & Earn */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="px-4 mt-4"
      >
        <motion.div
          whileHover={{ scale: 1.01 }}
          onClick={() => setReferModalOpen(true)}
          className="bg-purple-600 text-white rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer relative overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="absolute top-2 right-12 w-8 h-8 bg-purple-500 rounded-full opacity-30" />
          <div className="absolute bottom-1 right-20 w-4 h-4 bg-purple-400 rounded-full opacity-20" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white">
              <Gift className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-sm font-sans font-bold">Refer & Earn</span>
              <span className="text-[10px] font-sans text-purple-200">Get ₦500 for each friend invited!</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-purple-200" />
        </motion.div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } } }}
        className="px-4 mt-4"
      >
        <h3 className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400 mb-2">Quick Actions</h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <motion.button
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2 }}
            onClick={onOpenDeposit}
            className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-xs group-hover:shadow-md group-hover:bg-purple-100 transition-all">
              <Download className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-sans font-semibold text-slate-700">Deposit</span>
          </motion.button>

          <motion.button
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2 }}
            onClick={onOpenTransfer}
            className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-xs group-hover:shadow-md group-hover:bg-purple-100 transition-all">
              <Share2 className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-sans font-semibold text-slate-700">Transfer</span>
          </motion.button>

          <motion.button
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2 }}
            onClick={() => setQuickTransferOpen(true)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-xs group-hover:shadow-md group-hover:bg-purple-100 transition-all">
              <Phone className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-sans font-semibold text-slate-700">Airtime</span>
          </motion.button>

          <motion.button
            variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
            whileHover={{ y: -2 }}
            onClick={() => setQuickTransferOpen(true)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-xs group-hover:shadow-md group-hover:bg-purple-100 transition-all">
              <Wifi className="w-4.5 h-4.5 stroke-[2.5]" />
            </div>
            <span className="text-[10px] font-sans font-semibold text-slate-700">Data</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Market Top Products */}
      <div className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">Market Top Products</h3>
          <button 
            onClick={() => onNavigateTab('market')}
            className="text-[10px] font-sans font-bold text-purple-600 hover:text-purple-700 flex items-center gap-0.5 cursor-pointer"
          >
            Open Market <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="grid grid-cols-2 gap-2"
        >
          {trendingProducts.map((prod) => (
            <motion.div 
              key={prod.id}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -2 }}
              onClick={() => onNavigateTab('market')}
              className="bg-white border border-slate-100 rounded-xl overflow-hidden shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between transition-shadow"
            >
              <div className="aspect-square w-full bg-slate-50 relative overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-2.5">
                <span className="text-[9px] font-sans font-semibold text-slate-400 block mb-0.5">{prod.salesCount} Sales</span>
                <h4 className="text-[10px] font-sans font-bold text-slate-800 line-clamp-1">{prod.title}</h4>
                <p className="text-[10px] font-sans font-extrabold text-purple-600 mt-0.5">₦{prod.price.toLocaleString()}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {onNavigateToLanding && (
        <div className="px-4 mt-4">
          <button 
            onClick={onNavigateToLanding}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-sans font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" /> View Marketing Landing Page
          </button>
        </div>
      )}

      <AnimatePresence>
        {roleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl relative"
            >
              <button
                onClick={() => setRoleModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center pb-4 border-b border-slate-50">
                <h3 className="text-lg font-display font-bold text-slate-900">How will you use ShopAffair?</h3>
                <p className="text-xs font-sans text-slate-500 mt-1">Choose your workspace role. Verification state is retained.</p>
              </div>

              <div className="space-y-3 mt-4">
                <button
                  onClick={() => {
                    onRoleSwitch('buyer');
                    setRoleModalOpen(false);
                  }}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    activeProfile.role === 'buyer'
                      ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                      : 'border-slate-100 hover:bg-slate-50 bg-white hover:shadow-sm'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${activeProfile.role === 'buyer' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <ShoppingCart className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-sans font-bold text-slate-800">I am a Buyer</span>
                    <span className="text-[10px] font-sans text-slate-400 mt-0.5 block leading-relaxed">
                      Browse catalog items, checkout via multi-sig escrow, and message sellers.
                    </span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onRoleSwitch('seller');
                    setRoleModalOpen(false);
                  }}
                  className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                    activeProfile.role === 'seller'
                      ? 'border-purple-600 bg-purple-50/50 shadow-sm'
                      : 'border-slate-100 hover:bg-slate-50 bg-white hover:shadow-sm'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${activeProfile.role === 'seller' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-sans font-bold text-slate-800">I am a Seller</span>
                    <span className="text-[10px] font-sans text-slate-400 mt-0.5 block leading-relaxed">
                      Create trade terms, track customer escrows, and expand digital or physical product stores.
                    </span>
                  </div>
                </button>
              </div>

              <div className="mt-5">
                <button
                  onClick={() => setRoleModalOpen(false)}
                  className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-sans font-bold text-xs rounded-xl shadow-md shadow-green-100 transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {referModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl relative text-center space-y-4"
            >
              <button
                onClick={() => setReferModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
                <Gift className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-display font-bold text-slate-900">Your Invitation Code</h3>
                <p className="text-xs font-sans text-slate-500 mt-1">Share this with friends in Lagos, Abuja and beyond to earn ₦500 each!</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-base font-bold text-slate-700 select-all">
                SHOPAFFAIR-{activeProfile.username.toUpperCase()}-REFER
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(`SHOPAFFAIR-${activeProfile.username.toUpperCase()}-REFER`);
                  alert('Referral link copied to clipboard!');
                  setReferModalOpen(false);
                }}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-sans font-bold text-xs rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Copy & Share Link
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <QuickTransferModal open={quickTransferOpen} onClose={() => setQuickTransferOpen(false)} />
    </div>
  );
}