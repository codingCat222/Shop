/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Home, RefreshCw, MessageSquare, ShoppingBag, User } from 'lucide-react';
import { UserProfile } from '../../types';

interface BottomNavProps {
  activeTab: 'home' | 'trade' | 'chat' | 'market' | 'profile' | 'checkout';
  onTabChange: (tab: 'home' | 'trade' | 'chat' | 'market' | 'profile') => void;
  unreadChatsCount: number;
  activeProfile: UserProfile | null;
}

export default function BottomNav({ activeTab, onTabChange, unreadChatsCount, activeProfile }: BottomNavProps) {
  const tabs = [
    { id: 'home' as const, label: 'Home', icon: Home },
    { id: 'trade' as const, label: 'Trade', icon: RefreshCw },
    { id: 'market' as const, label: 'Market', icon: ShoppingBag },
    { id: 'chat' as const, label: 'Chat', icon: MessageSquare, badge: unreadChatsCount },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 px-4 pb-5 pt-2 bg-gradient-to-t from-transparent via-slate-900/5 to-transparent pointer-events-none flex justify-center">
      <motion.nav
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="pointer-events-auto flex items-center justify-around w-full max-w-md bg-[#7C3AED] border border-[#8B5CF6] shadow-xl rounded-2xl px-2 py-2.5 relative overflow-visible"
        style={{ perspective: 800 }}
      >
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="flex flex-col items-center justify-center relative py-1 px-1 cursor-pointer select-none outline-none group text-purple-200 focus:outline-none"
              style={{ width: '18%' }}
            >
              {/* Highlight background pill with a subtle dark highlight */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-[#6D28D9] rounded-xl -z-10 border border-[#8B5CF6]/40"
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                />
              )}

              {/* Icon container with bounce animation */}
              <motion.div
                animate={{
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -2 : 0,
                }}
                whileTap={{ scale: 0.9, y: 1 }}
                className={`relative p-1 rounded-lg ${isActive ? 'text-white' : 'group-hover:text-white'}`}
                transition={{ type: 'spring', stiffness: 500, damping: 15 }}
              >
                {tab.id === 'profile' && activeProfile?.profilePicture ? (
                  <img
                    src={activeProfile.profilePicture}
                    alt="Profile"
                    className={`w-5.5 h-5.5 rounded-full object-cover border ${isActive ? 'border-white' : 'border-purple-300 group-hover:border-white'}`}
                  />
                ) : (
                  <IconComponent className="w-5.5 h-5.5 stroke-[2]" />
                )}

                {/* Optional Badge Indicator */}
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-sans font-bold text-[10px] w-4.5 h-4.5 flex items-center justify-center rounded-full border border-[#7C3AED] shadow-sm">
                    {tab.badge}
                  </span>
                ) : null}
              </motion.div>

              {/* Tab label */}
              <motion.span
                animate={{
                  scale: isActive ? 1.05 : 0.95,
                  opacity: isActive ? 1 : 0.85,
                }}
                className={`text-[10px] font-sans font-semibold mt-1 tracking-wide ${isActive ? 'text-white' : 'text-purple-200 group-hover:text-white'}`}
              >
                {tab.label}
              </motion.span>
            </button>
          );
        })}
      </motion.nav>
    </div>
  );
}
