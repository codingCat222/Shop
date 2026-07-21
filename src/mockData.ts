/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarketProduct, TradeItem, EscrowStatus, TradeType, TradeCategory, ChatRoom, UserProfile } from './types';

// Supported Banks list in Nigeria
export const NIGERIAN_BANKS = [
  'Access Bank',
  'First Bank of Nigeria',
  'Guaranty Trust Bank (GTB)',
  'United Bank for Africa (UBA)',
  'Zenith Bank',
  'Wema Bank',
  'Kuda Bank',
  'Moniepoint MFB',
  'Opay',
  'Stanbic IBTC Bank',
  'Fidelity Bank'
];

export const mockProducts: MarketProduct[] = [
  {
    id: 'prod_1',
    title: 'Iphone 15 Pro Max',
    price: 8000,
    sellerUsername: 'techking',
    sellerName: 'TechKing Store',
    rating: 4.8,
    salesCount: 154,
    reviewsCount: 32,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400',
    category: 'Phones',
    condition: 'New',
    description: 'Premium titanium iPhone 15 Pro Max with stunning battery health, accessories, and complete warranty.'
  },
  {
    id: 'prod_2',
    title: 'MacBook Air M2',
    price: 8000,
    sellerUsername: 'gadgetzone',
    sellerName: 'GadgetZone',
    rating: 4.8,
    salesCount: 89,
    reviewsCount: 18,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400',
    category: 'Trade',
    condition: 'Like New',
    description: 'Apple MacBook Air M2. Sleek, powerful, and ready for high-performance creative tasks.'
  },
  {
    id: 'prod_3',
    title: 'Samsung Galaxy S24 Ultra',
    price: 12000,
    sellerUsername: 'techking',
    sellerName: 'TechKing Store',
    rating: 4.9,
    salesCount: 210,
    reviewsCount: 45,
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400',
    category: 'Phones',
    condition: 'New',
    description: 'S24 Ultra with AI-powered features, 200MP camera, and bundled S-Pen.'
  },
  {
    id: 'prod_4',
    title: 'Toyota Camry 2022',
    price: 15000000,
    sellerUsername: 'wheels_deal',
    sellerName: 'Wheels & Deals',
    rating: 4.6,
    salesCount: 3,
    reviewsCount: 1,
    image: 'https://images.unsplash.com/photo-1621007947382-cc34aa8642e9?auto=format&fit=crop&q=80&w=400',
    category: 'Vehicles',
    condition: 'Gently Used',
    description: 'Super clean foreign-used Toyota Camry 2022. Leather seats, panoramic roof, low mileage.'
  },
  {
    id: 'prod_5',
    title: '3-Bedroom Lekki Duplex',
    price: 85000000,
    sellerUsername: 'homes_co',
    sellerName: 'Apex Homes',
    rating: 4.8,
    salesCount: 2,
    reviewsCount: 1,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=400',
    category: 'Houses',
    condition: 'New',
    description: 'Modern 3-Bedroom fully detached duplex in Lekki Phase 1. All rooms en-suite, fully fitted kitchen.'
  },
  {
    id: 'prod_6',
    title: 'Nike Air Max 90',
    price: 5000,
    sellerUsername: 'fashion_hub',
    sellerName: 'Fashion Hub',
    rating: 4.7,
    salesCount: 340,
    reviewsCount: 68,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400',
    category: 'Fashion',
    condition: 'New',
    description: 'Original Nike Air Max 90 in eye-catching red and white colors. Extremely comfortable.'
  },
  {
    id: 'prod_7',
    title: 'Screen Repair Service Kit',
    price: 3500,
    sellerUsername: 'repair_pro',
    sellerName: 'Repair Pros',
    rating: 4.5,
    salesCount: 95,
    reviewsCount: 12,
    image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80f02e?auto=format&fit=crop&q=80&w=400',
    category: 'Repair',
    condition: 'New',
    description: 'Professional mobile screen repair and diagnostics kit with high-grade tools.'
  },
  {
    id: 'prod_8',
    title: 'Secure Multi-Sig Key Ledger',
    price: 25000,
    sellerUsername: 'crypto_secure',
    sellerName: 'CryptoSecure',
    rating: 4.9,
    salesCount: 1500,
    reviewsCount: 420,
    image: 'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?auto=format&fit=crop&q=80&w=400',
    category: 'More',
    condition: 'New',
    description: 'Safeguard your digital escrow keys with this state-of-the-art secure hardware ledger.'
  }
];

export const initialTrades: TradeItem[] = [
  {
    id: 'trd_101',
    title: 'iPhone 15 Pro Max',
    creatorUsername: 'Gadget_zone',
    creatorName: 'Gadget Zone',
    creatorRating: 4.5,
    reviewsCount: 6,
    amount: 910000,
    status: EscrowStatus.PENDING,
    type: TradeType.SUPPLY,
    category: TradeCategory.PHYSICAL,
    condition: 'Like New',
    specs: { Size: '256GB', Color: 'Titanium Gray', Qty: '1' },
    accountNumber: '2019483758',
    deliveryFee: 1500,
    deliveryTime: '2-3 days',
    takeOffLocation: 'Ikeja, Lagos',
    deliveryLocation: 'Lekki Phase 1, Lagos',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=400',
    description: 'Verified trade request for premium iPhone 15 Pro Max. Includes original box accessories.',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'trd_102',
    title: 'Samsung S21',
    creatorUsername: 'Gadget_zone',
    creatorName: 'Gadget Zone',
    creatorRating: 4.5,
    reviewsCount: 6,
    amount: 220000,
    status: EscrowStatus.DRAFT,
    type: TradeType.SUPPLY,
    category: TradeCategory.PHYSICAL,
    condition: 'Gently Used',
    specs: { Size: '128GB', Color: 'Phantom Black', Qty: '1' },
    accountNumber: '2019483758',
    deliveryFee: 1000,
    deliveryTime: '1-2 days',
    takeOffLocation: 'Ikeja, Lagos',
    deliveryLocation: 'Surulere, Lagos',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=400',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'trd_103',
    title: 'Ecoflow Portable Power Station',
    creatorUsername: 'solarPlug',
    creatorName: 'Solar Plug',
    creatorRating: 3.5,
    reviewsCount: 26,
    amount: 277000,
    status: EscrowStatus.FUNDED,
    type: TradeType.SUPPLY,
    category: TradeCategory.PHYSICAL,
    condition: 'New',
    specs: { Capacity: '600W', Weight: '7.5kg', Qty: '1' },
    accountNumber: '3029481748',
    deliveryFee: 5000,
    deliveryTime: '3-5 days',
    takeOffLocation: 'Abuja, FCT',
    deliveryLocation: 'Enugu, Nigeria',
    image: 'https://images.unsplash.com/photo-1624996379697-f01d168b1a52?auto=format&fit=crop&q=80&w=400',
    createdAt: new Date(Date.now() - 3600000 * 96).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 10).toISOString()
  },
  {
    id: 'trd_104',
    title: 'Oraimo 30000mah Powerbank',
    creatorUsername: 'Gadget_zone',
    creatorName: 'Gadget Zone',
    creatorRating: 4.5,
    reviewsCount: 6,
    amount: 25000,
    status: EscrowStatus.COMPLETED,
    type: TradeType.SUPPLY,
    category: TradeCategory.PHYSICAL,
    condition: 'New',
    specs: { Battery: '30,000mAh', Color: 'Black', Qty: '2' },
    accountNumber: '2019483758',
    deliveryFee: 800,
    deliveryTime: 'Same day',
    takeOffLocation: 'Ikeja, Lagos',
    deliveryLocation: 'Yaba, Lagos',
    image: 'https://images.unsplash.com/photo-1609592424109-dd77366dbb71?auto=format&fit=crop&q=80&w=400',
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 90).toISOString()
  }
];

export const initialChatRooms: ChatRoom[] = [
  {
    id: 'chat_1',
    participantUsername: 'micha',
    participantName: 'Micha',
    participantAvatar: 'M',
    participantRole: 'seller',
    lastMessage: 'How can i help with your trade today?',
    lastMessageTime: 'now',
    unreadCount: 2,
    isPinned: true,
    messages: [
      {
        id: 'c1_m1',
        chatId: 'chat_1',
        senderUsername: 'micha',
        senderName: 'Micha',
        senderRole: 'seller',
        content: 'Hello, saw you looking at the power station.',
        timestamp: new Date(Date.now() - 600000).toISOString()
      },
      {
        id: 'c1_m2',
        chatId: 'chat_1',
        senderUsername: 'micha',
        senderName: 'Micha',
        senderRole: 'seller',
        content: 'How can i help with your trade today?',
        timestamp: new Date().toISOString()
      }
    ]
  },
  {
    id: 'chat_2',
    participantUsername: 'techking',
    participantName: 'Techking',
    participantAvatar: 'T',
    participantRole: 'seller',
    lastMessage: 'I have created the trade for the iphone',
    lastMessageTime: '1hr ago',
    unreadCount: 1,
    isPinned: true,
    messages: [
      {
        id: 'c2_m1',
        chatId: 'chat_2',
        senderUsername: 'techking',
        senderName: 'Techking',
        senderRole: 'seller',
        content: 'I have created the trade for the iphone',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  },
  {
    id: 'chat_3',
    participantUsername: 'Gadget_zone',
    participantName: 'Gadget Zone',
    participantAvatar: 'G',
    participantRole: 'seller',
    lastMessage: 'Alright that seems fair, proceed with...',
    lastMessageTime: '1hr ago',
    unreadCount: 1,
    isPinned: true,
    associatedTradeId: 'trd_101',
    messages: [
      {
        id: 'c3_m1',
        chatId: 'chat_3',
        senderUsername: 'rumline',
        senderName: 'Rumline',
        senderRole: 'buyer',
        content: 'Hey, is the iPhone 15 Pro Max still available at 910k?',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: 'c3_m2',
        chatId: 'chat_3',
        senderUsername: 'Gadget_zone',
        senderName: 'Gadget Zone',
        senderRole: 'seller',
        content: 'Alright that seems fair, proceed with the trade creation under our secure escrow gate.',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      }
    ]
  }
];

// Seed some user profiles
export const mockUserProfiles: Record<string, UserProfile> = {
  rumline: {
    id: 'usr_rumline',
    tempId: 'TESM-849302',
    name: 'Rumline',
    username: 'rumline',
    email: 'rumline@tesm-escrow.com',
    role: 'buyer',
    verificationStatus: 'VERIFIED',
    bankName: 'Guaranty Trust Bank (GTB)',
    accountNumber: '0129485748',
    walletBalance: 82000,
    isPro: false,
    avatarColor: 'bg-purple-600',
    phoneNumber: '+234 812 345 6789',
    documents: {
      bvn: '22284930194',
      idCardName: 'nigerian_passport_rumline.png',
      submittedAt: new Date(Date.now() - 3600000 * 72).toISOString()
    },
    auditLogs: [
      {
        id: 'aud_1',
        action: 'PROFILE_CREATED',
        actor: 'System',
        timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
        details: 'Initial temporary workspace profile registered.'
      },
      {
        id: 'aud_2',
        action: 'VERIFICATION_APPROVED',
        actor: 'admin_joseph',
        timestamp: new Date(Date.now() - 3600000 * 71).toISOString(),
        details: 'BVN checking and Passport verification validated.'
      }
    ]
  },
  guest: {
    id: 'usr_guest',
    tempId: 'TESM-000000',
    name: 'Guest Visitor',
    username: 'guest',
    email: '',
    role: 'buyer',
    verificationStatus: 'GUEST',
    walletBalance: 0,
    isPro: false,
    avatarColor: 'bg-slate-400'
  }
};
