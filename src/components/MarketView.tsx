import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, ShoppingCart, Star, Plus, Minus, Trash2, X,
  Flame, Store, Car, Home, Smartphone, Shirt, Wrench, MoreHorizontal,
  ShoppingBag, ArrowRight, Wallet, Eye, EyeOff, Heart, SlidersHorizontal, Tag,
  ChevronLeft, Pencil, Check as CheckIcon, Zap, Gift, Cpu, Smartphone as PhoneIcon, Lock,
  Percent, Clock, TrendingUp, Shield, Truck, Coffee, Headphones, Watch, Camera, Laptop, Package,
  ChevronRight, Sparkles, Gem, Beer, Shirt as ShirtIcon, Wine, Headphones as HeadphoneIcon
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

// Carousel messages
const carouselMessages = [
  { text: 'ShopAffairShop', subtext: 'Your trusted marketplace', icon: Store },
  { text: 'Flash Sale Live!', subtext: 'Up to 40% off', icon: Zap },
  { text: 'New Arrivals', subtext: 'Check out latest products', icon: Sparkles },
  { text: 'Premium Deals', subtext: 'Exclusive offers', icon: Gem },
  { text: 'Fast Delivery', subtext: 'Get it in 24hrs', icon: Truck },
  { text: 'Secure Escrow', subtext: '100% protected', icon: Shield }
];

// Hot Deals Carousel Data - COMPACT VERSION
const hotDeals = [
  {
    id: 'hot_1',
    title: 'GET UP TO 25% OFF',
    subtitle: 'Limited time offer. T&Cs apply',
    discount: '25%',
    bgGradient: 'from-purple-600 via-purple-700 to-indigo-700',
    tag: 'HOT DEAL',
    tag2: 'LIMITED TIME',
    timeLeft: '3h 45m',
    icon: Flame,
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=100'
    ]
  },
  {
    id: 'hot_2',
    title: 'FLASH SALE 40% OFF',
    subtitle: 'Electronics & Gadgets',
    discount: '40%',
    bgGradient: 'from-red-600 via-rose-700 to-pink-700',
    tag: 'FLASH SALE',
    tag2: 'TODAY ONLY',
    timeLeft: '1h 30m',
    icon: Zap,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=100'
    ]
  },
  {
    id: 'hot_3',
    title: 'BUY 1 GET 1 FREE',
    subtitle: 'Selected items only',
    discount: '50%',
    bgGradient: 'from-emerald-600 via-teal-700 to-cyan-700',
    tag: 'BOGO OFFER',
    tag2: 'LIMITED STOCK',
    timeLeft: '5h 20m',
    icon: Gift,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=100'
    ]
  },
  {
    id: 'hot_4',
    title: 'PREMIUM DEALS',
    subtitle: 'Luxury items at best prices',
    discount: '30%',
    bgGradient: 'from-amber-600 via-orange-700 to-yellow-700',
    tag: 'PREMIUM',
    tag2: 'EXCLUSIVE',
    timeLeft: '2h 15m',
    icon: Gem,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&q=80&w=100',
      'https://images.unsplash.com/photo-1610945265064-0e34e4d213b5?auto=format&fit=crop&q=80&w=100'
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
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hotDealSlide, setHotDealSlide] = useState(0);

  // Auto-slide carousel for header
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-slide carousel for hot deals
  useEffect(() => {
    const interval = setInterval(() => {
      setHotDealSlide((prev) => (prev + 1) % hotDeals.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const isLoggedIn = activeProfile && activeProfile.verificationStatus !== 'GUEST';

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

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToHotDealSlide = (index: number) => {
    setHotDealSlide(index);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#F8F9FC] h-full overflow-hidden pb-24 relative font-sans">

      <div className="px-4 pt-4 pb-2 sticky top-0 bg-[#F8F9FC] z-10 border-b border-slate-50">
        {isLoggedIn ? (
          <div className="flex items-center justify-between mb-2 gap-2">
            <div className="flex items-center gap-2 flex-1 max-w-[70%]">
              <div className="flex-1 min-w-0">
                <span className="block text-[8px] font-sans font-semibold text-slate-400 tracking-wide uppercase leading-none">Wallet Balance</span>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[11px] font-sans font-black text-slate-950 truncate leading-none">
                    {showBalance ? `₦${(activeProfile?.walletBalance ?? 82000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '₦••••••'}
                  </span>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none shrink-0"
                  >
                    {showBalance ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  alert("Your saved favorites lists will appear here.");
                }}
                className="w-8 h-8 rounded-lg bg-[#F4F4F6] flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <Heart className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setCartOpen(true)}
                className="w-8 h-8 rounded-lg bg-[#F4F4F6] flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors relative cursor-pointer"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#7C3AED] text-white text-[8px] font-sans font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs border border-white">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-3">
            <div className="flex-1">
              {/* Carousel Header */}
              <div className="relative h-10 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 flex flex-col justify-center"
                  >
                    <div className="flex items-center gap-1.5">
                      {(() => {
                        const Icon = carouselMessages[currentSlide].icon;
                        return <Icon className="w-4 h-4 text-purple-600" />;
                      })()}
                      <h1 className="text-base font-sans font-black text-slate-950 tracking-tight leading-none">
                        {carouselMessages[currentSlide].text}
                      </h1>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      {carouselMessages[currentSlide].subtext}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
              
              {/* Carousel dots - KEEP THESE for header */}
              <div className="flex gap-1 mt-0.5">
                {carouselMessages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      index === currentSlide ? 'w-3 bg-[#7C3AED]' : 'w-1 bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={() => setCartOpen(true)}
              className="w-8 h-8 rounded-lg bg-[#F4F4F6] flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors relative cursor-pointer ml-1"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#7C3AED] text-white text-[8px] font-sans font-extrabold w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        )}

        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isLoggedIn ? "Search products..." : "Search materials..."}
              className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg font-sans text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/20 focus:border-[#7C3AED] transition-all"
            />
            <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
          </div>
          {isLoggedIn && (
            <button className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 shrink-0 transition-colors cursor-pointer">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ONLY HOT DEALS CAROUSEL - REDUCED HEIGHT */}
        <div className="mb-3">
          {/* Hot Deals Carousel - COMPACT VERSION */}
          <div className="relative overflow-hidden rounded-xl shadow-lg border border-purple-400/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={hotDealSlide}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className={`relative bg-gradient-to-r ${hotDeals[hotDealSlide].bgGradient} p-0`}
              >
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800')] opacity-10 bg-cover bg-center" />
                <div className="relative p-2.5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        {(() => {
                          const Icon = hotDeals[hotDealSlide].icon;
                          return <Icon className="w-2 h-2 text-amber-400" />;
                        })()}
                        <span className="bg-amber-400 text-black text-[6px] font-black px-1.5 py-0.5 rounded-full tracking-wider">
                          {hotDeals[hotDealSlide].tag}
                        </span>
                        <span className="bg-white/20 text-white text-[6px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                          {hotDeals[hotDealSlide].tag2}
                        </span>
                      </div>
                      <h2 className="text-base font-black text-white leading-tight tracking-tight">
                        {hotDeals[hotDealSlide].title}
                      </h2>
                      <p className="text-[8px] text-white/80 font-semibold mt-0.5">{hotDeals[hotDealSlide].subtitle}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-1.5 py-0.5 rounded-full border border-white/10">
                          <Clock className="w-2 h-2 text-amber-400" />
                          <span className="text-[7px] text-white font-bold">Ends in {hotDeals[hotDealSlide].timeLeft}</span>
                        </div>
                        <button className="bg-white text-purple-700 text-[7px] font-black px-2 py-0.5 rounded-full shadow-lg hover:bg-purple-50 transition-colors">
                          SHOP NOW →
                        </button>
                      </div>
                    </div>
                    <div className="flex -space-x-1.5">
                      {hotDeals[hotDealSlide].images.slice(0, 2).map((img, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg border-2 border-white/30 overflow-hidden shadow-md -ml-1.5 first:ml-0">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {isLoggedIn && (
          <div className="bg-[#F4F4F6] p-0.5 rounded-lg flex w-full mb-3">
            <button
              onClick={() => setMarketTab('supply')}
              className={`flex-1 py-1.5 text-center text-[10px] font-sans font-bold transition-all rounded-md cursor-pointer ${
                marketTab === 'supply'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Market (Supply)
            </button>
            <button
              onClick={() => setMarketTab('demands')}
              className={`flex-1 py-1.5 text-center text-[10px] font-sans font-bold transition-all rounded-md cursor-pointer ${
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
          <div className="flex items-center gap-1.5 mb-1.5">
            {activeGroup && (
              <button
                onClick={goBackToGroups}
                className="w-5 h-5 rounded-md bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer shrink-0"
              >
                <ChevronLeft className="w-3 h-3" />
              </button>
            )}
            <h3 className="text-[10px] font-sans font-bold text-slate-900 tracking-wide">
              {activeGroup ? activeGroup : 'Categories'}
            </h3>
          </div>

          {!activeGroup ? (
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              <button
                onClick={() => { setSelectedCategory('Trending'); setActiveGroup(null); }}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition-all cursor-pointer ${
                  selectedCategory === 'Trending' && !activeGroup
                    ? 'bg-[#F5F3FF] border-[#7C3AED] text-[#7C3AED] shadow-[0_2px_8px_rgba(124,58,237,0.06)]'
                    : 'bg-white border-slate-100 text-[#1A1A1A] hover:bg-slate-50'
                }`}
              >
                <Flame className={`w-3.5 h-3.5 mb-0.5 ${selectedCategory === 'Trending' ? 'text-[#7C3AED]' : 'text-slate-600'}`} />
                <span className={`text-[8px] font-sans font-bold tracking-tight ${selectedCategory === 'Trending' ? 'text-[#7C3AED]' : 'text-slate-700'}`}>
                  Trending
                </span>
              </button>

              {categoryGroups.map((group) => {
                const GroupIcon = group.icon;
                return (
                  <button
                    key={group.name}
                    onClick={() => openGroup(group.name)}
                    className="flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border border-slate-100 bg-white text-[#1A1A1A] hover:bg-slate-50 transition-all cursor-pointer"
                  >
                    <GroupIcon className="w-3.5 h-3.5 mb-0.5 text-slate-600" />
                    <span className="text-[8px] font-sans font-bold tracking-tight text-slate-700 text-center leading-tight">
                      {group.name}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              {activeGroupData?.subcategories.map((sub) => {
                const SubIcon = sub.icon;
                const isActive = selectedCategory === sub.name;
                return (
                  <button
                    key={sub.name}
                    onClick={() => selectSubcategory(sub.name)}
                    className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#F5F3FF] border-[#7C3AED] text-[#7C3AED] shadow-[0_2px_8px_rgba(124,58,237,0.06)]'
                        : 'bg-white border-slate-100 text-[#1A1A1A] hover:bg-slate-50'
                    }`}
                  >
                    <SubIcon className={`w-3.5 h-3.5 mb-0.5 ${isActive ? 'text-[#7C3AED]' : 'text-slate-600'}`} />
                    <span className={`text-[8px] font-sans font-bold tracking-tight text-center leading-tight ${isActive ? 'text-[#7C3AED]' : 'text-slate-700'}`}>
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
            <h3 className="text-[10px] font-sans font-black text-slate-900 mb-2 tracking-wide uppercase">
              {selectedCategory === 'Trending' ? 'Trending Products (6)' : `${selectedCategory} Products`} ({filteredProducts.length})
            </h3>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {filteredProducts.map((prod) => {
                  const ownListing = isOwnListing(prod);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => setSelectedProduct(prod)}
                      className="bg-white border border-slate-100/90 rounded-lg overflow-hidden shadow-2xs cursor-pointer flex flex-col justify-between hover:border-slate-200 transition-all relative"
                    >
                      {ownListing && (
                        <span className="absolute top-1.5 left-1.5 z-10 bg-slate-900/80 text-white text-[7px] font-sans font-black px-1.5 py-0.5 rounded-full tracking-wider backdrop-blur-xs">
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

                      <div className="p-2 flex flex-col justify-between flex-1">
                        <div>
                          <h4 className="text-[10px] font-sans font-bold text-slate-900 leading-tight line-clamp-2">
                            {prod.title}
                          </h4>

                          <div className="flex items-center gap-0.5 text-[8px] text-slate-400 font-medium mt-0.5">
                            <Star className="w-2.5 h-2.5 fill-amber-400 stroke-amber-400" />
                            <span className="font-bold text-slate-600">{prod.rating}</span>
                            <span className="text-slate-300">•</span>
                            <span>@{prod.sellerUsername}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-1.5 pt-0.5">
                          <span className="text-[10px] font-sans font-black text-slate-950">
                            ₦{prod.price.toLocaleString()}
                          </span>
                          {ownListing ? (
                            <div
                              className="w-6 h-6 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center shadow-xs"
                              title="You can't buy your own listing"
                            >
                              <Lock className="w-2.5 h-2.5" />
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onAddToCart(prod);
                              }}
                              className="w-6 h-6 bg-[#7C3AED] hover:bg-purple-700 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer shadow-xs"
                            >
                              <Plus className="w-3 h-3 stroke-[2.5]" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-slate-50/50 rounded-lg border border-dashed border-slate-150">
                <ShoppingBag className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-[10px] font-sans text-slate-500 font-bold">No products found under this category.</p>
              </div>
            )}
          </>
        ) : (
          <>
            <h3 className="text-[10px] font-sans font-black text-slate-900 mb-2 tracking-wide uppercase">
              Buyer Demands ({filteredDemands.length})
            </h3>

            {filteredDemands.length > 0 ? (
              <div className="space-y-2">
                {filteredDemands.map((demand) => (
                  <div
                    key={demand.id}
                    onClick={() => setSelectedDemand(demand)}
                    className="bg-white border border-slate-100 rounded-lg p-2 shadow-2xs hover:border-slate-200 transition-all flex gap-2 cursor-pointer"
                  >
                    <img
                      src={demand.image}
                      alt={demand.title}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-100 shrink-0"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[8px] font-bold text-[#7C3AED] bg-[#F5F3FF] px-1.5 py-0.5 rounded">
                            {demand.category}
                          </span>
                          <span className="text-[8px] text-slate-400 font-medium">@{demand.buyerUsername}</span>
                        </div>
                        <h4 className="text-[10px] font-sans font-extrabold text-slate-900 truncate mt-0.5">
                          {demand.title}
                        </h4>
                        <p className="text-[8px] text-slate-400 line-clamp-1 mt-0.5 leading-snug">{demand.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-1 pt-0.5 border-t border-slate-50">
                        <span className="text-[10px] font-black text-slate-950">
                          ₦{demand.price.toLocaleString()}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStartChatWithSeller(demand.buyerUsername, demand.buyerName);
                          }}
                          className="text-[8px] font-sans font-bold text-white bg-[#7C3AED] hover:bg-purple-700 px-2 py-0.5 rounded-md transition-colors shadow-2xs"
                        >
                          Send Offer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-slate-50/50 rounded-lg border border-dashed border-slate-150">
                <Tag className="w-8 h-8 text-slate-300 mx-auto mb-1" />
                <p className="text-[10px] font-sans text-slate-500 font-bold">No demands found under this category.</p>
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