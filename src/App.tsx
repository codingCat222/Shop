/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, TradeItem, ChatRoom, ChatMessage, EscrowStatus, TradeType, TradeCategory, AuditLog, MarketProduct, CartItem } from './types';
import { initialTrades, initialChatRooms, mockUserProfiles } from './mockData';
import { motion, AnimatePresence } from 'motion/react';

// Component Imports
import Preloader from './components/Preloader/Preloader';
import BottomNav from './components/layout/BottomNav';
import AuthModal from './components/AuthModal';
import MarketView from './components/MarketView';
import HomeView from './components/HomeView';
import TradeView from './components/TradeView';
import ChatView from './components/ChatView';
import AdminPortal from './components/AdminPortal';
import LandingPage from './landing/LandingPage';
import ProfileView from './components/account/ProfileView';
import CheckoutView from './components/CheckoutView';

import { ShieldCheck, UserPlus, LogIn, AlertTriangle, Cpu, HelpCircle, Landmark, Check, Copy, ArrowRight, X, Sparkles, Star, Clock, LogOut, User, Settings, Bell } from 'lucide-react';

export default function App() {
  // --- 1. CORE APPS STATES ---
  const [isPreloaderActive, setIsPreloaderActive] = useState(true);
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'trade' | 'chat' | 'market' | 'profile' | 'checkout'>('market');

  // Shopping Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('tesm_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Active User Profile
  const [activeProfile, setActiveProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tesm_active_profile');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return mockUserProfiles.guest; // Defaults to visitor/guest
  });

  // Escrow Trades
  const [trades, setTrades] = useState<TradeItem[]>(() => {
    const saved = localStorage.getItem('tesm_trades');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialTrades;
  });

  // Active Direct Message Chat Rooms
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(() => {
    const saved = localStorage.getItem('tesm_chat_rooms');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return initialChatRooms;
  });

  // Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('tesm_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'aud_1',
        action: 'PLATFORM_BOOT',
        actor: 'System Core',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        details: 'Cryptographic multi-sig escrow validator online.'
      }
    ];
  });

  // Pending Verifications Queue (Admin-auditable)
  const [pendingUsers, setPendingUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('tesm_pending_queue');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [
      {
        id: 'usr_adebayo',
        tempId: 'TESM-482019',
        name: 'Adebayo Johnson',
        username: 'ade_j',
        email: 'adebayo@gmail.com',
        role: 'seller',
        verificationStatus: 'PENDING',
        bankName: 'Access Bank',
        accountNumber: '1029482748',
        walletBalance: 12000,
        isPro: false,
        avatarColor: 'bg-emerald-600',
        phoneNumber: '+234 803 219 4837',
        documents: {
          bvn: '22294837104',
          idCardName: 'bvn_adebayo_id_passport.png',
          submittedAt: new Date(Date.now() - 1200000).toISOString()
        }
      },
      {
        id: 'usr_ngozi',
        tempId: 'TESM-394820',
        name: 'Ngozi Chukwu',
        username: 'ng_stores',
        email: 'ngozi_m@yahoo.com',
        role: 'seller',
        verificationStatus: 'PENDING',
        bankName: 'Zenith Bank',
        accountNumber: '2039481748',
        walletBalance: 45000,
        isPro: false,
        avatarColor: 'bg-indigo-600',
        phoneNumber: '+234 815 483 9204',
        documents: {
          bvn: '22219483019',
          idCardName: 'ngozi_voter_card_proof.png',
          submittedAt: new Date(Date.now() - 600000).toISOString()
        }
      }
    ];
  });

  // Modal Triggers
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register' | 'verify-wizard'>('login');
  const [adminPortalOpen, setAdminPortalOpen] = useState(false);
  const [storeUpgradeOpen, setStoreUpgradeOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Compliance verification simulation
  const [isSimulatingApproval, setIsSimulatingApproval] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);

  // Transfer & Deposit local variables
  const [depositAmount, setDepositAmount] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferBeneficiary, setTransferBeneficiary] = useState('');
  const [transferBank, setTransferBank] = useState('Guaranty Trust Bank (GTB)');

  // --- 2. LOCAL SYNC EFFECTS ---
  useEffect(() => {
    localStorage.setItem('tesm_active_profile', JSON.stringify(activeProfile));
  }, [activeProfile]);

  useEffect(() => {
    localStorage.setItem('tesm_trades', JSON.stringify(trades));
  }, [trades]);

  useEffect(() => {
    localStorage.setItem('tesm_chat_rooms', JSON.stringify(chatRooms));
  }, [chatRooms]);

  useEffect(() => {
    localStorage.setItem('tesm_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('tesm_pending_queue', JSON.stringify(pendingUsers));
  }, [pendingUsers]);

  useEffect(() => {
    localStorage.setItem('tesm_cart', JSON.stringify(cart));
  }, [cart]);

  // Redirect flag for guests who click proceed to checkout or attempt to access checkout directly
  const [redirectToCheckoutAfterLogin, setRedirectToCheckoutAfterLogin] = useState(false);

  useEffect(() => {
    if (activeTab === 'checkout' && activeProfile.verificationStatus === 'GUEST') {
      setRedirectToCheckoutAfterLogin(true);
      setAuthInitialMode('login');
      setAuthModalOpen(true);
      setActiveTab('market');
    }
  }, [activeTab, activeProfile]);

  // --- 3. AUDIT LOGGER UTILITY ---
  const addAuditLog = (action: string, details: string, actor: string = 'System') => {
    const newLog: AuditLog = {
      id: `aud_${Date.now()}`,
      action,
      actor,
      timestamp: new Date().toISOString(),
      details
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // --- 3.5. CART MUTATION HANDLERS ---
  const handleAddToCart = (product: MarketProduct) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0);
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleProceedToCheckout = () => {
    if (activeProfile.verificationStatus === 'GUEST') {
      setRedirectToCheckoutAfterLogin(true);
      setAuthInitialMode('login');
      setAuthModalOpen(true);
    } else {
      setActiveTab('checkout');
    }
  };

  // --- 4. CALLBACK OPERATIONS ---

  // Auth / SignUp callback
  const handleAuthSuccess = (profile: UserProfile) => {
    setActiveProfile(profile);
    addAuditLog('USER_AUTH', `Authenticated as ${profile.username} (${profile.role}).`, profile.username);
    if (redirectToCheckoutAfterLogin) {
      setActiveTab('checkout');
      setRedirectToCheckoutAfterLogin(false);
    }
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setActiveProfile(updated);
    if (updated.verificationStatus === 'PENDING') {
      // Add user to the admin's auditable pending lists if they submit steps
      setPendingUsers((prev) => {
        if (prev.some((p) => p.id === updated.id)) return prev;
        return [updated, ...prev];
      });
      addAuditLog('VERIFICATION_SUBMITTED', `${updated.name} uploaded ID & BVN checks. Added to compliance queue.`, updated.username);
    }
  };

  const handleRoleSwitch = (role: 'buyer' | 'seller') => {
    setActiveProfile((prev) => ({
      ...prev,
      role
    }));
    addAuditLog('ROLE_SWITCH', `Toggled default view workspace role to: ${role.toUpperCase()}.`, activeProfile.username);
  };

  // Admin approvals
  const handleApproveUser = (userId: string) => {
    const userToVerify = pendingUsers.find((p) => p.id === userId);
    if (!userToVerify) return;

    setPendingUsers((prev) => prev.filter((p) => p.id !== userId));
    addAuditLog('VERIFICATION_APPROVED', `Assigned Verified credential credentials to ${userToVerify.username}.`, 'Admin Core');

    // If the active profile is the one being approved (for instant sandbox test loops!)
    if (activeProfile.id === userId) {
      setActiveProfile({
        ...activeProfile,
        verificationStatus: 'VERIFIED',
        walletBalance: 82000 // Give initial verified balance as shown in Figma
      });
    }
  };

  const handleRejectUser = (userId: string, reason: string) => {
    const userToReject = pendingUsers.find((p) => p.id === userId);
    if (!userToReject) return;

    setPendingUsers((prev) => prev.filter((p) => p.id !== userId));
    addAuditLog('VERIFICATION_REJECTED', `Rejected credentials for ${userToReject.username}. Reason: ${reason}`, 'Admin Core');

    if (activeProfile.id === userId) {
      setActiveProfile({
        ...activeProfile,
        verificationStatus: 'REJECTED',
        rejectionReason: reason
      });
    }
  };

  const handleForceCancelTrade = (tradeId: string) => {
    setTrades((prev) =>
      prev.map((t) => {
        if (t.id === tradeId) {
          return {
            ...t,
            status: EscrowStatus.REFUNDED,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
    addAuditLog('ADMIN_FORCE_CANCEL', `Admin forced cancellation & refund check for Trade #${tradeId}.`, 'Admin Core');
  };

  // Trade actions
  const handleCreateTrade = (newTrade: Omit<TradeItem, 'id' | 'createdAt' | 'updatedAt' | 'creatorUsername' | 'creatorName' | 'creatorRating' | 'reviewsCount'>) => {
    const id = `trd_${100 + trades.length + 1}`;
    const item: TradeItem = {
      ...newTrade,
      id,
      creatorUsername: activeProfile.username,
      creatorName: activeProfile.name,
      creatorRating: 4.8,
      reviewsCount: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTrades([item, ...trades]);
    addAuditLog('TRADE_CREATED', `Escrow trade draft generated for: ${item.title}. Amount: ₦${item.amount}`, activeProfile.username);
  };

  const handleUpdateTradeStatus = (id: string, status: EscrowStatus) => {
    setTrades((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            status,
            updatedAt: new Date().toISOString()
          };
        }
        return t;
      })
    );
    addAuditLog('TRADE_STATUS_CHANGE', `Trade #${id} shifted state to ${status}.`, activeProfile.username);
  };

  // Chats callback
  const handleSendMessage = (roomId: string, text: string) => {
    setChatRooms((prev) =>
      prev.map((room) => {
        if (room.id === roomId) {
          const newMsg: ChatMessage = {
            id: `msg_${Date.now()}`,
            chatId: roomId,
            senderUsername: activeProfile.username,
            senderName: activeProfile.name,
            senderRole: activeProfile.role,
            content: text,
            timestamp: new Date().toISOString()
          };
          return {
            ...room,
            lastMessage: text,
            lastMessageTime: 'now',
            messages: [...room.messages, newMsg]
          };
        }
        return room;
      })
    );
  };

  const handleStartChatWithSeller = (sellerUsername: string, sellerName: string) => {
    // See if room already exists
    const existing = chatRooms.find((c) => c.participantUsername === sellerUsername);
    if (existing) {
      setActiveTab('chat');
      return;
    }

    const newId = `chat_${Date.now()}`;
    const newRoom: ChatRoom = {
      id: newId,
      participantUsername: sellerUsername,
      participantName: sellerName,
      participantAvatar: sellerName.charAt(0).toUpperCase(),
      participantRole: 'seller',
      lastMessage: 'Chat opened from Market.',
      lastMessageTime: 'now',
      unreadCount: 0,
      messages: []
    };

    setChatRooms([newRoom, ...chatRooms]);
    setActiveTab('chat');
  };

  // Instant Buy Shortcut
  const handleInitiateBuy = (product: MarketProduct) => {
    const id = `trd_${100 + trades.length + 1}`;
    const newEscrow: TradeItem = {
      id,
      title: product.title,
      creatorUsername: product.sellerUsername,
      creatorName: product.sellerName,
      creatorRating: product.rating,
      reviewsCount: product.reviewsCount,
      amount: product.price,
      status: EscrowStatus.PENDING,
      type: TradeType.SUPPLY,
      category: TradeCategory.PHYSICAL,
      condition: product.condition,
      deliveryFee: 1500,
      deliveryTime: '2-3 days',
      image: product.image,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setTrades([newEscrow, ...trades]);
    addAuditLog('DIRECT_PURCHASE', `Locked instant buy for: ${product.title}. Created escrow trade #${id}`, activeProfile.username);
    setActiveTab('trade');
  };

  // Total unread messages
  const totalUnreadChats = chatRooms.reduce((sum, r) => sum + r.unreadCount, 0);

  // --- 5. VISUAL RENDERING ENGINES ---
  if (showLanding && !isPreloaderActive) {
    return (
      <>
        <LandingPage 
          onEnterPlatform={() => {
            setShowLanding(false);
            setActiveTab('market');
          }}
          onLogin={() => {
            setAuthInitialMode('login');
            setAuthModalOpen(true);
          }}
          onRegister={() => {
            setAuthInitialMode('register');
            setAuthModalOpen(true);
          }}
        />
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={(profile) => {
            handleAuthSuccess(profile);
            setShowLanding(false);
          }}
          initialMode={authInitialMode}
          activeProfile={activeProfile}
          onUpdateProfile={handleUpdateProfile}
        />
      </>
    );
  }

  if (activeProfile.role === 'admin') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased">
        <AnimatePresence>
          {isPreloaderActive && (
            <Preloader onComplete={() => setIsPreloaderActive(false)} />
          )}
        </AnimatePresence>
        <AdminPortal
          activeProfile={activeProfile}
          pendingUsers={pendingUsers}
          auditLogs={auditLogs}
          trades={trades}
          onApproveUser={handleApproveUser}
          onRejectUser={handleRejectUser}
          onForceCancelTrade={handleForceCancelTrade}
          onClose={() => {
            setActiveProfile(mockUserProfiles.guest);
            setShowLanding(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center text-slate-800 antialiased selection:bg-purple-100 font-sans">
      <AnimatePresence>
        {isPreloaderActive && (
          <Preloader onComplete={() => setIsPreloaderActive(false)} />
        )}
      </AnimatePresence>

      <div className="w-full max-w-md min-h-screen bg-white flex flex-col relative overflow-hidden shadow-2xl shadow-purple-950/5 border-x border-slate-100">
        
        {/* GLOBAL TOP APP BAR (Only for logged-in users) */}
        {activeProfile.verificationStatus !== 'GUEST' && (
          <div className="bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between shadow-xs sticky top-0 z-30">
            {/* Title representing active state */}
            <h2 className="text-sm font-sans font-black text-slate-950 tracking-tight flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-600" />
              {activeTab === 'home' && "Secured Wallet"}
              {activeTab === 'trade' && "Escrow Trades"}
              {activeTab === 'market' && "Public Market"}
              {activeTab === 'chat' && "Direct Chats"}
              {activeTab === 'profile' && "Member Profile"}
            </h2>

            {/* Notification and Profile Avatar Dropdown */}
            <div className="flex items-center gap-2.5 relative">
              {/* Notification icon */}
              <button 
                onClick={() => alert('Notifications: No unread compliance or payment alerts at this time.')}
                className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100/80 flex items-center justify-center text-slate-500 relative hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-purple-600 rounded-full animate-pulse" />
              </button>

              {/* Profile Avatar trigger with uploaded image or default initials */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center cursor-pointer hover:border-purple-300 transition-colors"
                >
                  {activeProfile.profilePicture ? (
                    <img 
                      src={activeProfile.profilePicture} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs font-sans font-bold text-slate-500">
                      {activeProfile.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </button>

                {/* Dropdown Menu block */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-40" 
                        onClick={() => setProfileDropdownOpen(false)} 
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 py-1.5 divide-y divide-slate-50"
                      >
                        <div className="px-3 py-2 text-left">
                          <span className="block text-xs font-sans font-bold text-slate-800 truncate">{activeProfile.name}</span>
                          <span className="block text-[10px] text-slate-400 font-mono truncate">@{activeProfile.username}</span>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setActiveTab('profile');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-xs font-sans hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer border-0 bg-transparent"
                          >
                            <User className="w-4 h-4 text-slate-400" /> View Profile
                          </button>
                          <button
                            onClick={() => {
                              setActiveTab('profile');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-xs font-sans hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer border-0 bg-transparent"
                          >
                            <Settings className="w-4 h-4 text-slate-400" /> Settings
                          </button>
                        </div>
                        <div className="py-1">
                          <button
                            onClick={() => {
                              setActiveProfile(mockUserProfiles.guest);
                              setActiveTab('market');
                              setProfileDropdownOpen(false);
                            }}
                            className="w-full px-3 py-2 text-left text-xs font-sans hover:bg-rose-50 text-rose-600 flex items-center gap-2 cursor-pointer border-0 bg-transparent"
                          >
                            <LogOut className="w-4 h-4 text-rose-400" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* ACCESS GATE RESOLUTION */}
        {activeTab !== 'market' && activeProfile.verificationStatus === 'GUEST' ? (
          /* visitantes / unverified Guest blocks */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="relative flex items-center justify-center w-20 h-20 rounded-3xl bg-purple-50 text-purple-600 shadow-sm border border-purple-100/50">
              <ShieldCheck className="w-10 h-10 stroke-[2] animate-float" />
              <div className="absolute -bottom-1 -right-1 bg-amber-500 text-white p-1 rounded-full border-2 border-white">
                <AlertTriangle className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-display font-extrabold text-slate-900 leading-snug">
                Verified Account Required
              </h2>
              <p className="text-xs font-sans text-slate-500 max-w-xs leading-relaxed">
                In order to unlock secure multi-sig trades, wallet deposits, and real-time merchant direct messaging, please sign in or register your verified profile.
              </p>
            </div>

            <div className="w-full space-y-2 pt-4">
              <button
                onClick={() => {
                  setAuthInitialMode('register');
                  setAuthModalOpen(true);
                }}
                className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-sans font-bold text-xs rounded-xl shadow-lg shadow-purple-100 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" /> Create Verified Profile
              </button>
              
              <button
                onClick={() => {
                  setAuthInitialMode('login');
                  setAuthModalOpen(true);
                }}
                className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-sans font-bold text-xs rounded-xl transition-all border border-slate-200/50 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </button>
            </div>

            <div className="pt-6">
              <button
                onClick={() => setActiveTab('market')}
                className="text-xs font-sans font-bold text-purple-600 hover:text-purple-700 hover:underline"
              >
                Go back to browse the Public Market
              </button>
            </div>
          </div>
        ) : activeTab !== 'market' && activeProfile.verificationStatus === 'UNVERIFIED' ? (
          /* UNVERIFIED BUT SIGNED IN -> wizard prompt */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              📋
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-display font-bold text-slate-900">Finish Setting Up Profile</h2>
              <p className="text-xs font-sans text-slate-500 leading-relaxed max-w-xs mx-auto">
                Your profile is created under workspace ID <strong className="font-mono text-slate-800">{activeProfile.tempId}</strong>. Finish identity registration to activate trades and wallets.
              </p>
            </div>

            <button
              onClick={() => {
                setAuthInitialMode('verify-wizard');
                setAuthModalOpen(true);
              }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-sans font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Verify Profile & Fund Account
            </button>
          </div>
        ) : activeTab !== 'market' && activeProfile.verificationStatus === 'PENDING' ? (
          /* PENDING REVIEW -> Show nice feedback + admin prompt */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            {isSimulatingApproval ? (
              <div className="space-y-6 w-full py-8">
                <div className="relative flex items-center justify-center w-20 h-20 mx-auto">
                  {/* Rotating elegant gradient border ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-purple-100 border-t-purple-600 animate-spin" />
                  <ShieldCheck className="w-8 h-8 text-purple-600 animate-pulse" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-base font-sans font-black text-slate-950">Running Automated Verification</h3>
                  <div className="space-y-2 max-w-xs mx-auto text-left">
                    <p className={`text-xs transition-all duration-300 font-semibold flex items-center gap-1.5 ${simulationStep === 0 ? 'text-purple-600 scale-105 font-bold' : 'text-slate-400'}`}>
                      <span>{simulationStep > 0 ? "✓" : "○"}</span> Checking BVN signature registries...
                    </p>
                    <p className={`text-xs transition-all duration-300 font-semibold flex items-center gap-1.5 ${simulationStep === 1 ? 'text-purple-600 scale-105 font-bold' : 'text-slate-400'}`}>
                      <span>{simulationStep > 1 ? "✓" : "○"}</span> Matching NUBAN settlement accounts...
                    </p>
                    <p className={`text-xs transition-all duration-300 font-semibold flex items-center gap-1.5 ${simulationStep === 2 ? 'text-purple-600 scale-105 font-bold' : 'text-slate-400'}`}>
                      <span>{simulationStep > 2 ? "✓" : "○"}</span> Activating secure vault channel...
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto border border-amber-100">
                  <Clock className="w-8 h-8 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-display font-bold text-slate-900">Verification Pending Review</h2>
                  <p className="text-xs font-sans text-slate-500 leading-relaxed max-w-xs mx-auto">
                    Your BVN details and virtual deposit account credentials have been submitted securely to the settlement network.
                  </p>
                </div>

                <div className="p-3 bg-purple-50 rounded-2xl border border-purple-100 text-left w-full">
                  <span className="text-[10px] font-sans font-bold text-purple-800 uppercase block mb-1">Sandbox Automatic Bypass</span>
                  <p className="text-[10px] font-sans text-purple-700 leading-normal">
                    This is a prototype environment. You can trigger an instant simulated verification check to immediately verify and fund your wallet.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsSimulatingApproval(true);
                    setSimulationStep(0);
                    setTimeout(() => setSimulationStep(1), 1000);
                    setTimeout(() => setSimulationStep(2), 2000);
                    setTimeout(() => {
                      setActiveProfile((prev) => ({
                        ...prev,
                        verificationStatus: 'VERIFIED',
                        walletBalance: 82000
                      }));
                      setIsSimulatingApproval(false);
                    }, 3000);
                  }}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white font-sans font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-purple-200" /> Run Instant Compliance Verification
                </button>
              </>
            )}
          </div>
        ) : activeTab !== 'market' && activeProfile.verificationStatus === 'REJECTED' ? (
          /* REJECTED RED PANEL */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100">
              <X className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-display font-bold text-slate-900">Verification Rejected</h2>
              <div className="bg-red-50 text-red-800 p-3 rounded-xl border border-red-100 text-xs font-sans">
                <strong>Reason:</strong> {activeProfile.rejectionReason || "Blurred photo uploads."}
              </div>
              <p className="text-xs font-sans text-slate-500 leading-relaxed max-w-xs mx-auto">
                Please resubmit document credentials with matching BVN details.
              </p>
            </div>

            <button
              onClick={() => {
                // Return status to unverified so they can resubmit form
                setActiveProfile({
                  ...activeProfile,
                  verificationStatus: 'UNVERIFIED'
                });
                setAuthInitialMode('verify-wizard');
                setAuthModalOpen(true);
              }}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-sans font-bold text-xs rounded-xl shadow-md cursor-pointer"
            >
              Resubmit Identification Forms
            </button>
          </div>
        ) : (
          /* MAIN APPROVED INTERACTIVE SCREEN ROUTER */
          <>
            {activeTab === 'home' && (
              <HomeView
                activeProfile={activeProfile}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onRoleSwitch={handleRoleSwitch}
                onOpenStoreUpgrade={() => setStoreUpgradeOpen(true)}
                onOpenDeposit={() => setDepositOpen(true)}
                onOpenTransfer={() => setTransferOpen(true)}
                onNavigateToLanding={() => setShowLanding(true)}
              />
            )}

            {activeTab === 'trade' && (
              <TradeView
                trades={trades}
                activeProfile={activeProfile}
                onCreateTrade={handleCreateTrade}
                onUpdateTradeStatus={handleUpdateTradeStatus}
              />
            )}

            {activeTab === 'chat' && (
              <ChatView
                chatRooms={chatRooms}
                activeProfile={activeProfile}
                onSendMessage={handleSendMessage}
                onNavigateToTradeDetail={(tradeId) => {
                  const targetTrade = trades.find((t) => t.id === tradeId);
                  if (targetTrade) {
                    // Inject a synthetic state routing logic inside TradeView
                    setActiveTab('trade');
                  }
                }}
              />
            )}

            {activeTab === 'market' && (
              <MarketView
                activeProfile={activeProfile}
                onInitiateVerification={() => {
                  setAuthInitialMode('register');
                  setAuthModalOpen(true);
                }}
                onStartChatWithSeller={handleStartChatWithSeller}
                onInitiateBuy={handleInitiateBuy}
                cart={cart}
                onAddToCart={handleAddToCart}
                onUpdateCartQty={handleUpdateCartQty}
                onRemoveFromCart={handleRemoveFromCart}
                onProceedToCheckout={handleProceedToCheckout}
              />
            )}

            {activeTab === 'checkout' && (
              <CheckoutView
                activeProfile={activeProfile}
                cart={cart}
                onClearCart={handleClearCart}
                onUpdateWalletBalance={(newBalance) => {
                  setActiveProfile(prev => prev ? { ...prev, walletBalance: newBalance } : prev);
                }}
                onAddTrade={(newTrade) => {
                  setTrades(prev => [newTrade, ...prev]);
                }}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onAddAuditLog={addAuditLog}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileView
                activeProfile={activeProfile}
                trades={trades}
                onUpdateProfile={handleUpdateProfile}
                onLogout={() => {
                  setActiveProfile(mockUserProfiles.guest);
                  setActiveTab('market');
                }}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}
          </>
        )}

        {/* 3D Animated Navigation Controls always sticky at the bottom */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
          }}
          unreadChatsCount={totalUnreadChats}
          activeProfile={activeProfile}
        />

        {/* --- 6. DIALOGS & DRAWER OVERLAYS --- */}

        {/* Account Auth Modal Drawer */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          onAuthSuccess={handleAuthSuccess}
          initialMode={authInitialMode}
          activeProfile={activeProfile}
          onUpdateProfile={handleUpdateProfile}
        />

        {/* Merchant Pro upgrade popup */}
        <AnimatePresence>
          {storeUpgradeOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl relative text-center space-y-4"
              >
                <button
                  onClick={() => setStoreUpgradeOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 text-3xl flex items-center justify-center mx-auto animate-float">
                  🏪
                </div>

                <div>
                  <h3 className="text-lg font-display font-bold text-slate-900">Open a Merchant Store</h3>
                  <p className="text-xs font-sans text-slate-500 mt-1">
                    Upgrade to a premium verified merchant account to activate public listing limits and multi-sig physical item deliveries.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left space-y-2 text-xs font-sans text-slate-600">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>TESM Pro Merchant tier</span>
                    <span className="text-purple-600">₦10,000 / month</span>
                  </div>
                  <p>• Zero escrow mediation processing fee on supply trades.</p>
                  <p>• Dedicated virtual settlement account with instant clearing.</p>
                  <p>• High-volume product listings limit raised to 250 items.</p>
                </div>

                <button
                  onClick={() => {
                    setActiveProfile((prev) => ({
                      ...prev,
                      isPro: true
                    }));
                    addAuditLog('SUBSCRIBE_PRO', 'Upgraded default workspace profile to premium PRO store.', activeProfile.username);
                    alert('Congratulations! Your account is now upgraded to Premium Merchant Pro tier.');
                    setStoreUpgradeOpen(false);
                  }}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-sans font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Subscribe & Upgrade Now
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Deposit fund popup */}
        <AnimatePresence>
          {depositOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl relative space-y-4"
              >
                <button
                  onClick={() => setDepositOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <h3 className="text-lg font-display font-bold text-slate-900">Fund Naira Wallet</h3>
                  <p className="text-xs font-sans text-slate-500 mt-1">Send funds directly to your virtual Wema Bank assignment vault.</p>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Enter Deposit amount (₦)</label>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="e.g. 50000"
                      className="w-full text-sm font-sans px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="p-3 bg-purple-50 rounded-xl border border-purple-100 flex justify-between text-slate-700">
                    <div>
                      <span className="block text-[8px] text-slate-400 font-bold uppercase">Account number</span>
                      <strong className="font-mono text-sm text-slate-800">9482740294</strong>
                    </div>
                    <div>
                      <span className="block text-[8px] text-slate-400 font-bold uppercase">Assigned bank</span>
                      <strong className="text-purple-700 text-xs">WEMA Bank</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const amt = parseFloat(depositAmount);
                    if (!amt || amt <= 0) return;

                    setActiveProfile((prev) => ({
                      ...prev,
                      walletBalance: prev.walletBalance + amt
                    }));
                    addAuditLog('WALLET_DEPOSIT', `Cleared credit transfer of ₦${amt.toLocaleString()} via virtual bank channel.`, activeProfile.username);
                    alert(`Naira transfer verified! ₦${amt.toLocaleString()} added to your wallet balance.`);
                    setDepositAmount('');
                    setDepositOpen(false);
                  }}
                  className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-sans font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Verify Deposit Clearance
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Transfer fund popup */}
        <AnimatePresence>
          {transferOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-3xl p-6 max-w-sm w-full border border-slate-100 shadow-2xl relative space-y-4"
              >
                <button
                  onClick={() => setTransferOpen(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center">
                  <h3 className="text-lg font-display font-bold text-slate-900">Direct Wallet Transfer</h3>
                  <p className="text-xs font-sans text-slate-500 mt-1">Disburse funds instantly to external Nigerian bank checking accounts.</p>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Beneficiary NUBAN account</label>
                    <input
                      type="text"
                      maxLength={10}
                      value={transferBeneficiary}
                      onChange={(e) => setTransferBeneficiary(e.target.value)}
                      placeholder="e.g. 0123456789"
                      className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Beneficiary Bank</label>
                    <select
                      value={transferBank}
                      onChange={(e) => setTransferBank(e.target.value)}
                      className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl"
                    >
                      <option value="Access Bank">Access Bank</option>
                      <option value="Zenith Bank">Zenith Bank</option>
                      <option value="Guaranty Trust Bank (GTB)">Guaranty Trust Bank (GTB)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Disbursement Amount (₦)</label>
                    <input
                      type="number"
                      value={transferAmount}
                      onChange={(e) => setTransferAmount(e.target.value)}
                      placeholder="e.g. 2000"
                      className="w-full text-sm px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    const amt = parseFloat(transferAmount);
                    if (!amt || amt <= 0) return;
                    if (activeProfile.walletBalance < amt) {
                      alert('Insufficient balance to disburse this transfer.');
                      return;
                    }

                    setActiveProfile((prev) => ({
                      ...prev,
                      walletBalance: prev.walletBalance - amt
                    }));
                    addAuditLog('WALLET_TRANSFER', `Disbursed ₦${amt.toLocaleString()} to ${transferBeneficiary} (${transferBank}).`, activeProfile.username);
                    alert(`Transfer successfully dispatched! ₦${amt.toLocaleString()} debited.`);
                    setTransferAmount('');
                    setTransferBeneficiary('');
                    setTransferOpen(false);
                  }}
                  className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-sans font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Authorize Disbursal
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>



      </div>
    </div>
  );
}

// Minimal helper placeholder
function ShieldAlert(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" />
      <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" />
    </svg>
  );
}
