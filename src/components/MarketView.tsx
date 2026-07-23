import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ShoppingCart, Star, Plus, Minus, Trash2, X,
  Flame, Store, Car, Home, Smartphone, Shirt, Wrench, MoreHorizontal,
  ShoppingBag, ArrowRight, Wallet, Eye, EyeOff, Heart, SlidersHorizontal, Tag,
  ChevronLeft, Pencil, Check as CheckIcon, Zap, Gift, Cpu, Smartphone as PhoneIcon, Lock
} from 'lucide-react';
import { MarketProduct, UserProfile, CartItem } from '../types';
import { mockProducts } from '../mockData';
import QuickTransferModal from './QuickTransferModal';

interface MarketViewProps {
  activeProfile: UserProfile | null;
  onInitiateVerification: () => void;
  onStartChatWithSeller: (sellerUsername: string, sellerName: string) => void;
  onInitiateBuy: (product: MarketProduct) => void;
  cart: CartItem[];
  onAddToCart: (product: MarketProduct) => void;
  onUpdateCartQty: (productId: string, delta: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onProceedToCheckout: () => void;
}

interface SubCategory {
  name: string;
  icon: typeof Smartphone;
}

interface CategoryGroup {
  name: string;
  icon: typeof Store;
  subcategories: SubCategory[];
}

const categoryGroups: CategoryGroup[] = [
  {
    name: 'Products',
    icon: Store,
    subcategories: [
      { name: 'Phones', icon: Smartphone },
      { name: 'Fashion', icon: Shirt },
      { name: 'Vehicles', icon: Car },
      { name: 'Houses', icon: Home }
    ]
  },
  {
    name: 'Services',
    icon: Wrench,
    subcategories: [
      { name: 'Repair', icon: Wrench },
      { name: 'Trade', icon: Store }
    ]
  },
  {
    name: 'Digital Assets',
    icon: Tag,
    subcategories: [
      { name: 'Airtime & Data', icon: PhoneIcon },
      { name: 'Gift Cards', icon: Gift },
      { name: 'Software & Apps', icon: Cpu }
    ]
  }
];

export default function MarketView({
  activeProfile,
  onInitiateVerification,
  onStartChatWithSeller,
  onInitiateBuy,
  cart,
  onAddToCart,
  onUpdateCartQty,
  onRemoveFromCart,
  onProceedToCheckout
}: MarketViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Trending');
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<MarketProduct | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [marketTab, setMarketTab] = useState<'supply' | 'demands'>('supply');
  const [selectedDemand, setSelectedDemand] = useState<any | null>(null);
  const [quickTransferOpen, setQuickTransferOpen] = useState(false);
  const [accountNumber, setAccountNumber] = useState('2034785521');
  const [editingAccount, setEditingAccount] = useState(false);
  const [accountDraft, setAccountDraft] = useState(accountNumber);

  const isLoggedIn = activeProfile && activeProfile.verificationStatus !== 'GUEST';

  // A user can list products, but can't be the buyer on their own listing —
  // escrow requires two distinct parties, otherwise the pickup-code flow has no meaning.
  const isOwnListing = (product: MarketProduct) =>
    !!activeProfile && activeProfile.username === product.sellerUsername;

  const mockDemands = [
    {
      id: 'dem_1',
      title: 'Looking for iPhone 15 Pro Max',
      price: 1050000,
      buyerName: 'Tech Explorer',
      buyerUsername: 'techexplore',
      category: 'Phones',
      condition: 'New or Like New',
      description: 'Need a titanium blue or natural titanium 256GB iPhone 15 Pro Max. Must have 95%+ battery health.',
      image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=150',
      offersCount: 4,
      status: 'Active'
    },
    {
      id: 'dem_2',
      title: 'Toyota Camry 2018+ wanted',
      price: 15500000,
      buyerName: 'Auto Dealer NG',
      buyerUsername: 'autodealer_ng',
      category: 'Vehicles',
      condition: 'Foreign Used',
      description: 'Urgently buying a clean Toyota Camry 2018 or newer. Full option, low mileage preferred.',
      image: 'https://images.unsplash.com/photo-1621007947382-cc34aa8668c2?auto=format&fit=crop&q=80&w=150',
      offersCount: 7,
      status: 'Active'
    },
    {
      id: 'dem_3',
      title: 'Urgently need 3-Bedroom Lekki Duplex',
      price: 85000000,
      buyerName: 'John Estates',
      buyerUsername: 'john_estates',
      category: 'Houses',
      condition: 'New',
      description: 'Looking to purchase a detached 3-bedroom duplex around Lekki Phase 1 / Orchid Road.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=150',
      offersCount: 2,
      status: 'Active'
    },
    {
      id: 'dem_4',
      title: 'Looking for Bulk Screen Repair Kits',
      price: 45000,
      buyerName: 'FixIt Hub',
      buyerUsername: 'fixit_hub',
      category: 'Repair',
      condition: 'New',
      description: 'Need 10 sets of high-grade screen separation and repair toolkits for mobile phone workshop.',
      image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80f02e?auto=format&fit=crop&q=80&w=150',
      offersCount: 3,
      status: 'Active'
    }
  ];

  const filteredProducts = mockProducts.filter((product) => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'Trending') {
      const trendingIds = ['prod_1', 'prod_2', 'prod_3', 'prod_4', 'prod_5', 'prod_6'];
      return matchesSearch && trendingIds.includes(product.id);
    }

    const matchesCategory = product.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredDemands = mockDemands.filter((demand) => {
    const matchesSearch = demand.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          demand.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === 'Trending') {
      return matchesSearch;
    }

    const matchesCategory = demand.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const activeGroupData = categoryGroups.find((g) => g.name === activeGroup);

  const openGroup = (groupName: string) => {
    setActiveGroup(groupName);
  };

  const goBackToGroups = () => {
    setActiveGroup(null);
    setSelectedCategory('Trending');
  };

  const selectSubcategory = (name: string) => {
    setSelectedCategory(name);
  };

  const saveAccountNumber = () => {
    setAccountNumber(accountDraft);
    setEditingAccount(false);
  };

  const cancelAccountEdit = () => {
    setAccountDraft(accountNumber);
    setEditingAccount(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-white h-full overflow-hidden pb-24 relative font-sans">

      <div className="px-4 pt-4 pb-2 sticky top-0 bg-white z-10 border-b border-slate-50">
        {isLoggedIn ? (
          <div className="flex items-center justify-between mb-3 gap-2">
            <div className="flex items-center gap-2 bg-[#F5F3FF] border border-[#7C3AED]/10 rounded-lg px-2.5 py-1.5 flex-1 max-w-[70%] shadow-[0_2px_8px_rgba(124,58,237,0.05)]">
              <div className="w-7 h-7 rounded-lg bg-[#F5F3FF] border border-[#7C3AED]/20 flex items-center justify-center text-[#7C3AED] shrink-0">
                <Wallet className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block text-[9px] font-sans font-semibold text-slate-400 tracking-wide uppercase leading-none">Wallet Balance</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[12px] font-sans font-black text-slate-950 truncate leading-none">
                    {showBalance ? `₦${(activeProfile?.walletBalance ?? 82000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₦••••••'}
                  </span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
                  >
                    {showBalance ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  alert("Your saved favorites lists will appear here.");
                }}
                className="w-9 h-9 rounded-lg bg-[#F4F4F6] flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Heart className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="w-9 h-9 rounded-lg bg-[#F4F4F6] flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors relative cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7C3AED] text-white text-[9px] font-sans font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 id="shopaffair-shop-title" className="text-xl font-sans font-black text-slate-950 tracking-tight leading-none">ShopAffairShop</h1>
              <p className="text-[11px] text-slate-400 font-medium mt-1">Access our open marketplace</p>
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="w-10 h-10 rounded-lg bg-[#F4F4F6] flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors relative cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7C3AED] text-white text-[9px] font-sans font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        )}

        {isLoggedIn && (
          <div className="flex items-center justify-between mb-3 px-0.5">
            <span className="text-[10px] text-slate-400 font-medium">Account No:</span>
            {editingAccount ? (
              <div className="flex items-center gap-1.5">
                <input
                  value={accountDraft}
                  onChange={(e) => setAccountDraft(e.target.value)}
                  className="w-32 px-2 py-1 text-[11px] font-mono font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#7C3AED]/30"
                />
                <button onClick={saveAccountNumber} className="text-emerald-600 hover:bg-emerald-50 rounded-md p-1 cursor-pointer">
                  <CheckIcon className="w-3.5 h-3.5" />
                </button>
                <button onClick={cancelAccountEdit} className="text-slate-400 hover:bg-slate-100 rounded-md p-1 cursor-pointer">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditingAccount(true)}
                className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-slate-700 hover:text-[#7C3AED] transition-colors cursor-pointer"
              >
                {accountNumber}
                <Pencil className="w-3 h-3 text-slate-400" />
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isLoggedIn ? "Search chats, trades..." : "Search materials, categories ..."}
              className="w-full pl-10 pr-4 py-2.5 bg-[#F4F4F6] border-none rounded-lg font-sans text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:bg-white transition-all"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          </div>
          {isLoggedIn && (
            <button className="w-10 h-10 rounded-lg bg-[#F4F4F6] flex items-center justify-center text-slate-600 hover:bg-slate-200 shrink-0 transition-colors cursor-pointer">
              <SlidersHorizontal className="w-4.5 h-4.5" />
            </button>
          )}
        </div>

        {isLoggedIn && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4 pt-1 -mx-4 px-4 scroll-smooth">
            <div className="relative w-[75%] shrink-0 rounded-lg bg-[#5B21B6] p-4 text-white overflow-hidden shadow-sm border border-[#7C3AED]/20 flex flex-col justify-between h-28">
              <span className="absolute top-2.5 left-2.5 bg-rose-500 text-white text-[8px] font-sans font-black px-1.5 py-0.5 rounded tracking-wider">
                SALE
              </span>
              <div className="flex justify-between items-end h-full w-full">
                <div className="max-w-[65%] pt-3">
                  <h2 className="text-sm font-sans font-black text-white tracking-tight leading-none">Flash Sale !!!</h2>
                  <p className="text-[10px] text-white/90 font-semibold mt-1 leading-tight">Up to 40% off Electronics</p>
                </div>
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-xs" />
                  <img
                    src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=150"
                    alt="Electronics"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-lg relative z-10 rotate-6 shadow-md border border-white/20"
                  />
                </div>
              </div>
            </div>

            <div className="relative w-[75%] shrink-0 rounded-lg bg-[#7C3AED] p-4 text-white overflow-hidden shadow-sm border border-[#8B5CF6]/20 flex flex-col justify-between h-28">
              <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-white text-[8px] font-sans font-black px-1.5 py-0.5 rounded tracking-wider">
                NEW
              </span>
              <div className="flex justify-between items-end h-full w-full">
                <div className="max-w-[65%] pt-3">
                  <h2 className="text-sm font-sans font-black text-white tracking-tight leading-none">New Arrivals</h2>
                  <p className="text-[10px] text-white/90 font-semibold mt-1 leading-tight">Check it out now</p>
                </div>
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-xs" />
                  <img
                    src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=150"
                    alt="Sneakers"
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 object-cover rounded-lg relative z-10 -rotate-6 shadow-md border border-white/20"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setQuickTransferOpen(true)}
              className="relative w-[75%] shrink-0 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 p-4 text-white overflow-hidden shadow-sm border border-emerald-400/20 flex flex-col justify-between h-28 text-left cursor-pointer"
            >
              <span className="absolute top-2.5 left-2.5 bg-white/20 text-white text-[8px] font-sans font-black px-1.5 py-0.5 rounded tracking-wider">
                FAST
              </span>
              <div className="flex justify-between items-end h-full w-full">
                <div className="max-w-[70%] pt-3">
                  <h2 className="text-sm font-sans font-black text-white tracking-tight leading-none">Quick Transfer</h2>
                  <p className="text-[10px] text-white/90 font-semibold mt-1 leading-tight">Airtime, Data & Transfers</p>
                </div>
                <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 bg-white/10 rounded-full blur-xs" />
                  <div className="w-11 h-11 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center relative z-10">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            </button>
          </div>
        )}

        {isLoggedIn && (
          <div className="bg-[#F4F4F6] p-1 rounded-lg flex w-full mb-4">
            <button
              onClick={() => setMarketTab('supply')}
              className={`flex-1 py-2 text-center text-xs font-sans font-bold transition-all rounded-md cursor-pointer ${
                marketTab === 'supply'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Market (Supply)
            </button>
            <button
              onClick={() => setMarketTab('demands')}
              className={`flex-1 py-2 text-center text-xs font-sans font-bold transition-all rounded-md cursor-pointer ${
                marketTab === 'demands'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Demands (Requests)
            </button>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-2">
            {activeGroup && (
              <button
                onClick={goBackToGroups}
                className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <h3 className="text-xs font-sans font-bold text-slate-900 tracking-wide">
              {activeGroup ? activeGroup : 'Categories'}
            </h3>
          </div>

          {!activeGroup ? (
            <div className="grid grid-cols-4 gap-2 mb-2">
              <button
                onClick={() => { setSelectedCategory('Trending'); setActiveGroup(null); }}
                className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedCategory === 'Trending' && !activeGroup
                    ? 'bg-[#F5F3FF] border-[#7C3AED] text-[#7C3AED] shadow-[0_2px_8px_rgba(124,58,237,0.06)]'
                    : 'bg-[#F4F4F6] border-transparent text-[#1A1A1A] hover:bg-slate-100'
                }`}
              >
                <Flame className={`w-4 h-4 mb-1 ${selectedCategory === 'Trending' ? 'text-[#7C3AED]' : 'text-slate-600'}`} />
                <span className={`text-[10px] font-sans font-bold tracking-tight ${selectedCategory === 'Trending' ? 'text-[#7C3AED]' : 'text-slate-700'}`}>
                  Trending
                </span>
              </button>

              {categoryGroups.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <button
                    key={group.name}
                    onClick={() => openGroup(group.name)}
                    className="flex flex-col items-center justify-center py-2 px-1.5 rounded-lg border border-transparent bg-[#F4F4F6] text-[#1A1A1A] hover:bg-slate-100 transition-all cursor-pointer"
                  >
                    <GroupIcon className="w-4 h-4 mb-1 text-slate-600" />
                    <span className="text-[10px] font-sans font-bold tracking-tight text-slate-700 text-center leading-tight">
                      {group.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2 mb-2">
              {activeGroupData?.subcategories.map((sub) => {
                const SubIcon = sub.icon;
                const isActive = selectedCategory === sub.name;
                return (
                  <button
                    key={sub.name}
                    onClick={() => selectSubcategory(sub.name)}
                    className={`flex flex-col items-center justify-center py-2 px-1.5 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#F5F3FF] border-[#7C3AED] text-[#7C3AED] shadow-[0_2px_8px_rgba(124,58,237,0.06)]'
                        : 'bg-[#F4F4F6] border-transparent text-[#1A1A1A] hover:bg-slate-100'
                    }`}
                  >
                    <SubIcon className={`w-4 h-4 mb-1 ${isActive ? 'text-[#7C3AED]' : 'text-slate-600'}`} />
                    <span className={`text-[10px] font-sans font-bold tracking-tight text-center leading-tight ${isActive ? 'text-[#7C3AED]' : 'text-slate-700'}`}>
                      {sub.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 no-scrollbar">

        {marketTab === 'supply' ? (
          <>
            <h3 className="text-xs font-sans font-black text-slate-900 mb-3 tracking-wide uppercase">
              {selectedCategory === 'Trending' ? 'Trending Products (6)' : `${selectedCategory} Products`} ({filteredProducts.length})
            </h3>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3.5">
                {filteredProducts.map((prod) => {
                  const ownListing = isOwnListing(prod);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className="bg-white border border-slate-100/90 rounded-lg overflow-hidden shadow-2xs cursor-pointer flex flex-col justify-between hover:border-slate-200 transition-all relative"
                    >
                      {ownListing && (
                        <span className="absolute top-2 left-2 z-10 bg-slate-900/80 text-white text-[8px] font-sans font-black px-2 py-0.5 rounded-full tracking-wider backdrop-blur-xs">
                          YOUR LISTING
                        </span>
                      )}
                      <div className="aspect-square w-full bg-slate-50 relative overflow-hidden">
                        <img
                          src={prod.image}
                          alt={prod.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="p-3 flex flex-col justify-between flex-1">
                        <div>
                          <h4 className="text-xs font-sans font-bold text-slate-900 leading-tight line-clamp-2">
                            {prod.title}
                          </h4>

                          <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium mt-1">
                            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
                            <span className="font-bold text-slate-600">{prod.rating}</span>
                            <span className="text-slate-300">•</span>
                            <span>@{prod.sellerUsername}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-2 pt-1">
                          <span className="text-xs font-sans font-black text-slate-950">
                            ₦{prod.price.toLocaleString()}
                          </span>
                          {ownListing ? (
                            <div
                              className="w-7 h-7 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center shadow-xs"
                              title="You can't buy your own listing"
                            >
                              <Lock className="w-3 h-3" />
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(prod);
                              }}
                              className="w-7 h-7 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                            >
                              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-slate-50/50 rounded-lg border border-dashed border-slate-150">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-sans text-slate-500 font-bold">No products found under this category.</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="text-xs font-sans font-black text-slate-900 mb-3 tracking-wide uppercase">
              Buyer Demands ({filteredDemands.length})
            </h3>

            {filteredDemands.length > 0 ? (
              <div className="space-y-3">
                {filteredDemands.map((demand) => (
                  <div
                    key={demand.id}
                    onClick={() => setSelectedDemand(demand)}
                    className="bg-white border border-slate-100 rounded-lg p-3 shadow-2xs hover:border-slate-200 transition-all flex gap-3 cursor-pointer"
                  >
                    <img
                      src={demand.image}
                      alt={demand.title}
                      className="w-16 h-16 rounded-lg object-cover border border-slate-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[9px] font-bold text-[#7C3AED] bg-[#F5F3FF] px-1.5 py-0.5 rounded">
                            {demand.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">@{demand.buyerUsername}</span>
                        </div>
                        <h4 className="text-xs font-sans font-extrabold text-slate-900 truncate mt-1">
                          {demand.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 leading-snug">{demand.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50">
                        <span className="text-xs font-black text-slate-950">
                          Budget: ₦{demand.price.toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartChatWithSeller(demand.buyerUsername, demand.buyerName);
                          }}
                          className="text-[10px] font-sans font-bold text-white bg-[#7C3AED] hover:bg-purple-700 px-2.5 py-1 rounded-md transition-colors shadow-2xs"
                        >
                          Send Offer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-6 bg-slate-50/50 rounded-lg border border-dashed border-slate-150">
                <Tag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-sans text-slate-500 font-bold">No demands found under this category.</p>
              </div>
            )}
          </>
        )}
      </div>


      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
              className="fixed inset-0 bg-slate-950 z-40"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[#7C3AED]" />
                  <h3 className="text-sm font-sans font-black text-slate-900 tracking-tight">Your Cart ({cartCount})</h3>
                </div>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border border-slate-100/50">
                      <img
                        src={item.product.image}
                        alt={item.product.title}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-100 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="block text-xs font-bold text-slate-800 truncate">{item.product.title}</span>
                        <span className="block text-[10px] text-[#7C3AED] font-black mt-0.5">₦{item.product.price.toLocaleString()}</span>

                        <div className="flex items-center gap-2 mt-1.5">
                          <button
                            onClick={() => onUpdateCartQty(item.product.id, -1)}
                            className="w-5 h-5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-md flex items-center justify-center cursor-pointer"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="text-[11px] font-sans font-bold text-slate-700 w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateCartQty(item.product.id, 1)}
                            className="w-5 h-5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-md flex items-center justify-center cursor-pointer"
                          >
                            <Plus className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveFromCart(item.product.id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-lg transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-16 space-y-3">
                    <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                    <p className="text-xs text-slate-400 font-bold">Your shopping cart is currently empty.</p>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-4 border-t border-slate-100 bg-white space-y-3">
                  <div className="flex items-center justify-between text-xs font-sans">
                    <span className="font-bold text-slate-500">Cart Subtotal:</span>
                    <span className="font-black text-slate-950 text-base">₦{cartTotal.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => {
                      setCartOpen(false);
                      onProceedToCheckout();
                    }}
                    className="w-full py-3 bg-[#7C3AED] hover:bg-purple-700 text-white font-sans font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-45 bg-slate-900/50 backdrop-blur-xs flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white w-full max-w-md rounded-t-xl shadow-2xl border-t border-slate-150 max-h-[90vh] flex flex-col"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto my-3" />

              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-3 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto px-6 pb-28 space-y-4 no-scrollbar flex-1">
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {isOwnListing(selectedProduct) && (
                  <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-lg flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <p className="text-[10px] font-sans text-slate-500 font-semibold">
                      This is your own listing — you can't buy or chat about it as a customer.
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 bg-purple-50/15 rounded-lg border border-purple-100/40">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#7C3AED] text-white font-sans font-black text-xs flex items-center justify-center">
                      {selectedProduct.sellerName.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-800 leading-tight">{selectedProduct.sellerName}</span>
                      <span className="text-[10px] text-slate-400">@{selectedProduct.sellerUsername} • Merchant</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-amber-500 block">★ {selectedProduct.rating}</span>
                    <span className="text-[9px] text-slate-400">Verified Seller</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="inline-block text-[9px] font-bold text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded-md">
                    {selectedProduct.category}
                  </span>
                  <h2 className="text-base font-sans font-black text-slate-900 leading-snug">
                    {selectedProduct.title}
                  </h2>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-lg font-sans font-black text-slate-900">
                      ₦{selectedProduct.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {selectedProduct.condition}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 border-t border-slate-100 pt-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product Description</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex gap-3">
                {isOwnListing(selectedProduct) ? (
                  <div className="flex-1 py-3 bg-slate-50 text-slate-400 font-sans font-bold text-xs rounded-lg border border-slate-200/50 text-center flex items-center justify-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" /> This is your own listing
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onStartChatWithSeller(selectedProduct.sellerUsername, selectedProduct.sellerName);
                        setSelectedProduct(null);
                      }}
                      className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-sans font-bold text-xs rounded-lg border border-slate-200/50 cursor-pointer text-center transition-colors"
                    >
                      Chat with Seller
                    </button>
                    <button
                      onClick={() => {
                        onAddToCart(selectedProduct);
                        setSelectedProduct(null);
                        setCartOpen(true);
                      }}
                      className="flex-1 py-3 bg-[#7C3AED] hover:bg-purple-700 text-white font-sans font-bold text-xs rounded-lg shadow-md cursor-pointer text-center transition-all"
                    >
                      Add to Cart
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedDemand && (
          <div className="fixed inset-0 z-45 bg-slate-900/50 backdrop-blur-xs flex items-end justify-center">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-white w-full max-w-md rounded-t-xl shadow-2xl border-t border-slate-150 max-h-[90vh] flex flex-col"
            >
              <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto my-3" />

              <button
                onClick={() => setSelectedDemand(null)}
                className="absolute top-3 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="overflow-y-auto px-6 pb-28 space-y-4 no-scrollbar flex-1">
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-slate-50 border border-slate-100">
                  <img
                    src={selectedDemand.image}
                    alt={selectedDemand.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50/15 rounded-lg border border-purple-100/40">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#7C3AED] text-white font-sans font-black text-xs flex items-center justify-center">
                      {selectedDemand.buyerName.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-xs font-bold text-slate-800 leading-tight">{selectedDemand.buyerName}</span>
                      <span className="text-[10px] text-slate-400">@{selectedDemand.buyerUsername} • Requester</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded border border-purple-250">
                      {selectedDemand.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="inline-block text-[9px] font-bold text-[#7C3AED] bg-[#F5F3FF] px-2 py-0.5 rounded-md">
                    {selectedDemand.category}
                  </span>
                  <h2 className="text-base font-sans font-black text-slate-900 leading-snug">
                    {selectedDemand.title}
                  </h2>
                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-xs font-bold text-slate-400">Target Budget:</span>
                    <span className="text-lg font-sans font-black text-slate-900">
                      ₦{selectedDemand.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Condition requested: <strong className="text-slate-700">{selectedDemand.condition}</strong></p>
                </div>

                <div className="space-y-1 border-t border-slate-100 pt-3">
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Demand Description</span>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedDemand.description}
                  </p>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 flex gap-3">
                <button
                  onClick={() => setSelectedDemand(null)}
                  className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-sans font-bold text-xs rounded-lg border border-slate-200/50 cursor-pointer text-center transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onStartChatWithSeller(selectedDemand.buyerUsername, selectedDemand.buyerName);
                    setSelectedDemand(null);
                  }}
                  className="flex-1 py-3 bg-[#7C3AED] hover:bg-purple-700 text-white font-sans font-bold text-xs rounded-lg shadow-md cursor-pointer text-center transition-all"
                >
                  Send Offer Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <QuickTransferModal open={quickTransferOpen} onClose={() => setQuickTransferOpen(false)} />
    </div>
  );
}