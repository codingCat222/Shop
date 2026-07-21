/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Plus, Filter, ArrowLeft, Image as ImageIcon, Trash2, ShieldCheck, HelpCircle, Landmark, MapPin, Truck, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';
import { TradeItem, EscrowStatus, TradeType, TradeCategory, UserProfile } from '../types';

interface TradeViewProps {
  trades: TradeItem[];
  activeProfile: UserProfile;
  onCreateTrade: (newTrade: Omit<TradeItem, 'id' | 'createdAt' | 'updatedAt' | 'creatorUsername' | 'creatorName' | 'creatorRating' | 'reviewsCount'>) => void;
  onUpdateTradeStatus: (id: string, status: EscrowStatus) => void;
}

export default function TradeView({ trades, activeProfile, onCreateTrade, onUpdateTradeStatus }: TradeViewProps) {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'detail'>('list');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Drafts' | 'Offers' | 'Pending'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected Trade for Detail view
  const [selectedTrade, setSelectedTrade] = useState<TradeItem | null>(null);

  // Trade Creation form state
  const [tradeType, setTradeType] = useState<TradeType>(TradeType.SUPPLY);
  const [tradeCategory, setTradeCategory] = useState<TradeCategory>(TradeCategory.PHYSICAL);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [condition, setCondition] = useState('New');
  const [specs, setSpecs] = useState<Array<{ key: string; value: string }>>([
    { key: 'Size', value: '' },
    { key: 'Color', value: '' },
    { key: 'Qty', value: '' }
  ]);
  const [accountNumber, setAccountNumber] = useState(activeProfile.accountNumber || '');
  const [deliveryFee, setDeliveryFee] = useState('0');
  const [deliveryTime, setDeliveryTime] = useState('e.g. 2-3 days');
  const [takeOffLocation, setTakeOffLocation] = useState('e.g. Ikeja, Lagos');
  const [deliveryLocation, setDeliveryLocation] = useState('');

  // Filtering trades
  const filteredTrades = trades.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.creatorUsername.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === 'All') return matchesSearch;
    if (activeFilter === 'Drafts') return matchesSearch && t.status === EscrowStatus.DRAFT;
    if (activeFilter === 'Pending') return matchesSearch && t.status === EscrowStatus.PENDING;
    if (activeFilter === 'Offers') return matchesSearch && (t.status === EscrowStatus.FUNDED || t.status === EscrowStatus.DELIVERED);
    return matchesSearch;
  });

  const handleAddSpec = () => {
    setSpecs([...specs, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecs(specs.filter((_, i) => i !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specs];
    updated[index][field] = val;
    setSpecs(updated);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;

    // Convert specs array to record
    const specRecord: Record<string, string> = {};
    specs.forEach((item) => {
      if (item.key && item.value) {
        specRecord[item.key] = item.value;
      }
    });

    onCreateTrade({
      title,
      description: description || `Trade listing for ${title}`,
      amount: parseFloat(amount),
      status: EscrowStatus.PENDING,
      type: tradeType,
      category: tradeCategory,
      condition,
      specs: specRecord,
      accountNumber,
      deliveryFee: parseFloat(deliveryFee) || 0,
      deliveryTime,
      takeOffLocation,
      deliveryLocation,
      image: tradeCategory === TradeCategory.PHYSICAL 
        ? 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=300'
        : 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=300'
    });

    // Reset Form
    setTitle('');
    setDescription('');
    setAmount('');
    setAccountNumber('');
    setCurrentView('list');
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden pb-24">
      
      {/* 1. TRADES LIST VIEW */}
      {currentView === 'list' && (
        <>
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 px-4 pt-4 pb-2 border-b border-slate-50">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-2xl font-display font-bold text-slate-900">Trades</h1>
              <button
                onClick={() => setCurrentView('create')}
                className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center shadow-lg shadow-purple-100 cursor-pointer"
              >
                <Plus className="w-5.5 h-5.5 stroke-[2.5]" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats, trades..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl font-sans text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 focus:bg-white transition-all"
              />
              <Search className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
              {(['All', 'Drafts', 'Offers', 'Pending'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-xs font-sans font-bold whitespace-nowrap transition-all border ${
                    activeFilter === filter
                      ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                      : 'bg-slate-50 text-slate-600 border-slate-200/60 hover:bg-slate-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Trade List Container */}
          <div className="flex-1 overflow-y-auto px-4 py-3 no-scrollbar space-y-3">
            {filteredTrades.length > 0 ? (
              filteredTrades.map((trade) => (
                <div
                  key={trade.id}
                  onClick={() => {
                    setSelectedTrade(trade);
                    setCurrentView('detail');
                  }}
                  className="p-4 bg-white border border-slate-100 rounded-2xl shadow-xs hover:shadow-sm cursor-pointer transition-all flex items-start gap-3.5 relative overflow-hidden"
                >
                  {/* Image slot */}
                  <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                    {trade.image ? (
                      <img src={trade.image} alt={trade.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Text details */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <h3 className="text-sm font-sans font-extrabold text-slate-800 truncate">
                      {trade.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-sans text-slate-500">
                      <span>@{trade.creatorUsername}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-amber-600 font-bold">★ {trade.creatorRating} ({trade.reviewsCount})</span>
                    </div>
                    <p className="text-sm font-sans font-black text-purple-600 pt-1">
                      ₦{trade.amount.toLocaleString()}
                    </p>
                  </div>

                  {/* Escrow Status Tag */}
                  <div className="absolute top-4 right-4 text-[10px] font-mono font-bold uppercase tracking-wider">
                    <span className={`px-2 py-0.5 rounded-full ${
                      trade.status === EscrowStatus.FUNDED ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      trade.status === EscrowStatus.DELIVERED ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      trade.status === EscrowStatus.COMPLETED ? 'bg-green-50 text-green-600 border border-green-100' :
                      trade.status === EscrowStatus.DISPUTED ? 'bg-red-50 text-red-600 border border-red-100' :
                      'bg-slate-50 text-slate-500 border border-slate-200/50'
                    }`}>
                      {trade.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 px-6">
                <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-sans text-slate-500 font-medium">No active escrow trades found.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* 2. CREATE TRADE FORM VIEW */}
      {currentView === 'create' && (
        <form onSubmit={handleFormSubmit} className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentView('list')}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-display font-bold text-slate-900">Create Trade</h2>
            <div className="w-8 h-8" /> {/* Balance spacer */}
          </div>

          {/* Form Scroll Body */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar pb-28 bg-slate-50/50">
            
            {/* Toggles */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/40">
              <button
                type="button"
                onClick={() => setTradeType(TradeType.SUPPLY)}
                className={`py-2 text-xs font-sans font-bold rounded-xl transition-all cursor-pointer ${
                  tradeType === TradeType.SUPPLY ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                }`}
              >
                Market (Supply)
              </button>
              <button
                type="button"
                onClick={() => setTradeType(TradeType.REQUEST)}
                className={`py-2 text-xs font-sans font-bold rounded-xl transition-all cursor-pointer ${
                  tradeType === TradeType.REQUEST ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                }`}
              >
                Demands (Requests)
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-100/70 p-1.5 rounded-2xl border border-slate-200/40">
              <button
                type="button"
                onClick={() => setTradeCategory(TradeCategory.PHYSICAL)}
                className={`py-2 text-xs font-sans font-bold rounded-xl transition-all cursor-pointer ${
                  tradeCategory === TradeCategory.PHYSICAL ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                }`}
              >
                Physical Product
              </button>
              <button
                type="button"
                onClick={() => setTradeCategory(TradeCategory.DIGITAL)}
                className={`py-2 text-xs font-sans font-bold rounded-xl transition-all cursor-pointer ${
                  tradeCategory === TradeCategory.DIGITAL ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
                }`}
              >
                Digital Asset
              </button>
            </div>

            {/* Images block */}
            <div>
              <span className="block text-xs font-sans font-bold text-slate-500 uppercase mb-2">Images</span>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-white border-2 border-dashed border-slate-200 hover:border-purple-300 rounded-2xl flex flex-col items-center justify-center text-slate-400 gap-1 cursor-pointer hover:bg-slate-50/50 transition-all">
                  <Plus className="w-5 h-5" />
                  <span className="text-[9px] font-sans">Tap to add</span>
                </div>
                <div className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-6 h-6" />
                </div>
                <div className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300">
                  <ImageIcon className="w-6 h-6" />
                </div>
              </div>
            </div>

            {/* Title & Price */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Trade Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. iPhone 15 Pro Max 256GB"
                  className="w-full font-sans text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 transition-all shadow-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Amount (₦)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="e.g. 910000"
                    className="w-full font-sans text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 transition-all shadow-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Item Condition</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full font-sans text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 transition-all shadow-xs"
                  >
                    <option value="New">New</option>
                    <option value="Like New">Like New</option>
                    <option value="Gently Used">Gently Used</option>
                    <option value="Fair">Fair</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Specs list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="block text-xs font-sans font-bold text-slate-500 uppercase">Specs</span>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="text-xs font-sans font-bold text-purple-600 hover:text-purple-700 flex items-center gap-0.5 cursor-pointer"
                >
                  + Add Spec
                </button>
              </div>

              <div className="space-y-2">
                {specs.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Size, Color, etc."
                      value={item.key}
                      onChange={(e) => handleSpecChange(index, 'key', e.target.value)}
                      className="flex-1 font-sans text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Value"
                      value={item.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      className="flex-1 font-sans text-xs px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(index)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification bank details */}
            <div className="space-y-4 border-t border-slate-200/60 pt-4">
              <div>
                <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">10-Digit Account Number (NUBAN)</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter your 10-digit account number"
                    className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 transition-all shadow-xs font-mono"
                  />
                  <Landmark className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Delivery Fee (₦)</label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(e.target.value)}
                      placeholder="0"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 transition-all shadow-xs"
                    />
                    <Truck className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Delivery Time</label>
                  <input
                    type="text"
                    required
                    value={deliveryTime}
                    onChange={(e) => setDeliveryTime(e.target.value)}
                    placeholder="e.g. 2-3 days"
                    className="w-full font-sans text-sm px-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 transition-all shadow-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Take-off Location</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={takeOffLocation}
                      onChange={(e) => setTakeOffLocation(e.target.value)}
                      placeholder="e.g. Ikeja, Lagos"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 transition-all shadow-xs"
                    />
                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-sans font-bold uppercase tracking-wider text-slate-500 mb-1.5">Delivery Destination</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      placeholder="e.g. Lekki, Lagos"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600/15 focus:border-purple-600 transition-all shadow-xs"
                    />
                    <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Note info */}
            <div className="p-3 bg-purple-50 text-purple-800 rounded-xl border border-purple-100 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5 animate-pulse" />
              <p className="text-[10px] font-sans leading-relaxed">
                As a verified trader on TESM, your trade operates under multi-sig cryptographic protection. Buyers can check details and lock funds prior to inspection periods.
              </p>
            </div>
          </div>

          {/* Action button */}
          <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100">
            <button
              type="submit"
              className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-sans font-bold text-sm rounded-xl shadow-lg shadow-purple-100 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 fill-white" /> Create Market Trade
            </button>
          </div>
        </form>
      )}

      {/* 3. TRADE DETAIL VIEW (ACTIVE ESCROW PIPELINE) */}
      {currentView === 'detail' && selectedTrade && (
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedTrade(null);
                setCurrentView('list');
              }}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <span className="text-xs font-mono font-bold text-purple-600">TRADE {selectedTrade.id}</span>
            <div className="w-8 h-8" />
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 no-scrollbar pb-28">
            {/* Status pipeline graphics */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <span className="block text-[10px] font-sans font-bold tracking-wider text-slate-400 mb-3">ESCROW PIPELINE STATE</span>
              
              <div className="flex items-center justify-between relative">
                {/* Horizontal progress guide line */}
                <div className="absolute left-4 right-4 top-4.5 h-0.5 bg-slate-200 -z-10" />

                {[
                  { label: 'Draft', status: EscrowStatus.DRAFT },
                  { label: 'Pending', status: EscrowStatus.PENDING },
                  { label: 'Funded', status: EscrowStatus.FUNDED },
                  { label: 'Completed', status: EscrowStatus.COMPLETED }
                ].map((step, idx) => {
                  const statesList = [EscrowStatus.DRAFT, EscrowStatus.PENDING, EscrowStatus.FUNDED, EscrowStatus.DELIVERED, EscrowStatus.COMPLETED];
                  const activeIdx = statesList.indexOf(selectedTrade.status);
                  const stepIdx = statesList.indexOf(step.status);
                  const isDone = activeIdx >= stepIdx;

                  return (
                    <div key={idx} className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center border font-sans font-bold text-xs ${
                        isDone 
                          ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                          : 'bg-white text-slate-400 border-slate-200'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[10px] font-sans mt-1.5 font-bold ${isDone ? 'text-purple-600' : 'text-slate-400'}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* General Specs card */}
            <div className="space-y-3">
              <h2 className="text-lg font-sans font-extrabold text-slate-900 leading-snug">
                {selectedTrade.title}
              </h2>
              
              <div className="flex items-center gap-3">
                <span className="text-2xl font-sans font-black text-slate-900">
                  ₦{selectedTrade.amount.toLocaleString()}
                </span>
                {selectedTrade.condition && (
                  <span className="text-xs font-sans font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">
                    {selectedTrade.condition}
                  </span>
                )}
              </div>
            </div>

            {/* Merchant / Owner */}
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-2xl border border-purple-100/50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white font-sans font-bold text-sm flex items-center justify-center">
                  {selectedTrade.creatorName.charAt(0)}
                </div>
                <div>
                  <span className="block text-xs font-sans font-bold text-slate-800">{selectedTrade.creatorName}</span>
                  <span className="text-[10px] font-sans text-purple-600">@{selectedTrade.creatorUsername} • Trader</span>
                </div>
              </div>
            </div>

            {/* Custom specification details */}
            {selectedTrade.specs && Object.keys(selectedTrade.specs).length > 0 && (
              <div className="space-y-2">
                <span className="block text-xs font-sans font-bold text-slate-500 uppercase">Trade Specifications</span>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(selectedTrade.specs).map(([key, val]) => (
                    <div key={key} className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                      <span className="block text-[9px] font-sans font-bold text-slate-400 uppercase">{key}</span>
                      <span className="text-xs font-sans font-bold text-slate-700">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Logistics Card */}
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-3 text-xs font-sans">
              <span className="block text-[10px] font-sans font-bold tracking-wider text-slate-400 uppercase">Logistics & Escrow Parameters</span>
              
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Take-off Location:</span>
                <span className="font-semibold text-slate-700">{selectedTrade.takeOffLocation || 'Ikeja, Lagos'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Destination:</span>
                <span className="font-semibold text-slate-700">{selectedTrade.deliveryLocation || 'Lekki Phase 1, Lagos'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Delivery Time:</span>
                <span className="font-semibold text-slate-700">{selectedTrade.deliveryTime}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200/50">
                <span className="text-slate-400 font-bold">Delivery Fee:</span>
                <span className="font-bold text-slate-800">₦{(selectedTrade.deliveryFee || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Secure Escrow actions */}
            <div className="space-y-2 pt-4">
              {selectedTrade.status === EscrowStatus.PENDING && (
                <button
                  onClick={() => {
                    onUpdateTradeStatus(selectedTrade.id, EscrowStatus.FUNDED);
                    setSelectedTrade({ ...selectedTrade, status: EscrowStatus.FUNDED });
                  }}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-sans font-bold text-xs rounded-xl shadow-md cursor-pointer text-center"
                >
                  Fund Escrow Lock (₦{(selectedTrade.amount + selectedTrade.deliveryFee).toLocaleString()})
                </button>
              )}

              {selectedTrade.status === EscrowStatus.FUNDED && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onUpdateTradeStatus(selectedTrade.id, EscrowStatus.DELIVERED);
                      setSelectedTrade({ ...selectedTrade, status: EscrowStatus.DELIVERED });
                    }}
                    className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans font-bold text-xs rounded-xl cursor-pointer text-center"
                  >
                    Mark as Dispatched/Delivered
                  </button>
                  <button
                    onClick={() => {
                      onUpdateTradeStatus(selectedTrade.id, EscrowStatus.DISPUTED);
                      setSelectedTrade({ ...selectedTrade, status: EscrowStatus.DISPUTED });
                    }}
                    className="py-3 bg-red-50 hover:bg-red-100 text-red-600 font-sans font-bold text-xs rounded-xl border border-red-100 cursor-pointer text-center"
                  >
                    Trigger Disagreement/Dispute
                  </button>
                </div>
              )}

              {selectedTrade.status === EscrowStatus.DELIVERED && (
                <div className="space-y-2">
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-xl border border-amber-100">
                    <p className="text-[10px] font-sans font-bold leading-normal">
                      The merchant has submitted proof of delivery. Please inspect the assets carefully before releasing locked multi-sig funds!
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onUpdateTradeStatus(selectedTrade.id, EscrowStatus.COMPLETED);
                      setSelectedTrade({ ...selectedTrade, status: EscrowStatus.COMPLETED });
                    }}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-sans font-bold text-xs rounded-xl shadow-md cursor-pointer text-center"
                  >
                    Release Funds to Merchant (Complete)
                  </button>
                </div>
              )}

              {selectedTrade.status === EscrowStatus.DISPUTED && (
                <div className="p-4 bg-red-50 text-red-800 rounded-2xl border border-red-100 space-y-1">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-red-600">Dispute Under Arbitration</span>
                  <p className="text-xs font-sans leading-normal">
                    This trade has been temporarily frozen. Our assigned compliance auditor is investigating chat logs, tracking tickets, and specifications.
                  </p>
                </div>
              )}

              {selectedTrade.status === EscrowStatus.COMPLETED && (
                <div className="p-4 bg-green-50 text-green-800 rounded-2xl border border-green-100 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                  <div>
                    <span className="block text-xs font-bold text-green-800">Trade Resolved & Released</span>
                    <p className="text-[10px] font-sans leading-relaxed text-green-700 mt-0.5">
                      Secure escrow finalized. Funds disbursed to merchant's settlement account.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
