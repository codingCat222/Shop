/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, MapPin, CreditCard, Wallet, ShoppingBag, 
  CheckCircle2, ArrowRight, ShieldCheck, AlertCircle, Phone, User, Landmark
} from 'lucide-react';
import { CartItem, UserProfile, TradeItem, EscrowStatus, TradeType, TradeCategory } from '../types';

interface CheckoutViewProps {
  activeProfile: UserProfile;
  cart: CartItem[];
  onClearCart: () => void;
  onUpdateWalletBalance: (newBalance: number) => void;
  onAddTrade: (trade: TradeItem) => void;
  onNavigateTab: (tab: 'home' | 'trade' | 'chat' | 'market' | 'profile') => void;
  onAddAuditLog: (action: string, details: string, actor: string) => void;
}

export default function CheckoutView({
  activeProfile,
  cart,
  onClearCart,
  onUpdateWalletBalance,
  onAddTrade,
  onNavigateTab,
  onAddAuditLog
}: CheckoutViewProps) {
  // Shipping info state
  const [fullName, setFullName] = useState(activeProfile.name || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [phone, setPhone] = useState(activeProfile.phoneNumber || '');

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'bank_transfer' | 'card'>('wallet');

  // Order submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessDetails, setOrderSuccessDetails] = useState<{
    orderId: string;
    total: number;
    payment: string;
  } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Subtotals and pricing
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingFee = subtotal > 0 ? 1500 : 0;
  const total = subtotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate form
    if (!fullName.trim() || !address.trim() || !city.trim() || !state.trim() || !phone.trim()) {
      setValidationError('Please complete all delivery and shipping fields.');
      return;
    }

    if (cart.length === 0) {
      setValidationError('Your cart is empty. Please add items to your cart.');
      return;
    }

    // Wallet balance validation
    if (paymentMethod === 'wallet' && activeProfile.walletBalance < total) {
      setValidationError(`Insufficient wallet balance. You need ₦${(total - activeProfile.walletBalance).toLocaleString()} more. Please top up your wallet or choose another payment method.`);
      return;
    }

    setIsSubmitting(true);

    // Simulate place order
    setTimeout(() => {
      const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      if (paymentMethod === 'wallet') {
        const remainingBalance = activeProfile.walletBalance - total;
        onUpdateWalletBalance(remainingBalance);
      }

      // Add each cart item as a secure trade/escrow item for tracing
      cart.forEach((item, index) => {
        const syntheticTrade: TradeItem = {
          id: `trd_ord_${Date.now()}_${index}`,
          title: `Escrow Order: ${item.product.title}`,
          creatorUsername: activeProfile.username,
          creatorName: activeProfile.name || activeProfile.username,
          creatorRating: 5.0,
          reviewsCount: 1,
          amount: item.product.price * item.quantity,
          status: EscrowStatus.FUNDED, // Orders placed immediately enter Funded escrow status
          type: TradeType.SUPPLY,
          category: TradeCategory.PHYSICAL,
          condition: item.product.condition,
          specs: { 
            Quantity: item.quantity.toString(),
            'Order Ref': orderId,
            Recipient: fullName,
            Address: `${address}, ${city}, ${state}`
          },
          accountNumber: activeProfile.accountNumber || 'N/A',
          deliveryFee: shippingFee,
          deliveryTime: '2-4 days',
          takeOffLocation: 'ShopFair Hub Lagos',
          deliveryLocation: `${city}, ${state}`,
          image: item.product.image,
          description: `Direct secure escrow trade transaction triggered by order reference ${orderId}. Funds held in ShopFair vault.`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        onAddTrade(syntheticTrade);
      });

      // Audit Log
      onAddAuditLog(
        'ORDER_PLACED', 
        `Placed Order ${orderId} total ₦${total.toLocaleString()} via ${paymentMethod.toUpperCase()}. Created escrow transactions.`,
        activeProfile.username
      );

      // Save order details
      setOrderSuccessDetails({
        orderId,
        total,
        payment: paymentMethod === 'wallet' ? 'Secure Wallet Vault' : paymentMethod === 'bank_transfer' ? 'Nigerian Bank Transfer' : 'Secured Escrow Card'
      });

      setIsSubmitting(false);
      onClearCart();
    }, 1500);
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 h-full overflow-hidden pb-24 font-sans">
      {/* Top Header */}
      <div className="bg-white px-4 py-3.5 border-b border-slate-100 flex items-center gap-3 sticky top-0 z-20 shadow-xs">
        <button 
          onClick={() => onNavigateTab('market')}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-base font-sans font-black text-slate-900 tracking-tight">Checkout</h1>
          <p className="text-[10px] text-slate-400 font-medium">Verify escrow & complete your transaction</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!orderSuccessDetails ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar"
          >
            {/* Escrow Guarantee Banner */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs font-bold text-emerald-950">Multi-Sig Escrow Guaranteed</span>
                <span className="block text-[10px] text-emerald-700/90 leading-normal mt-0.5">
                  Your funds are secured inside the ShopFair Multi-Signature Vault. The seller is only credited upon successful tracking and physical confirmation of delivery at your destination.
                </span>
              </div>
            </div>

            {/* Error Prompt */}
            {validationError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl p-3 text-xs font-medium flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{validationError}</span>
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              {/* 1. Delivery / Shipping Information */}
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-3">
                <h2 className="text-xs font-sans font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-600" /> Delivery Information
                </h2>

                <div className="space-y-2.5">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Ngozi Chukwu"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-purple-600 transition-all"
                        required
                      />
                      <User className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Street Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="12 Joel Ogunnaike St, G.R.A"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-purple-600 transition-all"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ikeja"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-purple-600 transition-all"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">State</label>
                      <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        placeholder="Lagos State"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-purple-600 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Contact Phone</label>
                    <div className="relative">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+234 803 456 7890"
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-sans text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-600/10 focus:border-purple-600 transition-all"
                        required
                      />
                      <Phone className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Payment Method selection */}
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-3">
                <h2 className="text-xs font-sans font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-purple-600" /> Payment Method
                </h2>

                <div className="space-y-2">
                  {/* Option 1: Secure Wallet */}
                  <div 
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'wallet' 
                        ? 'border-purple-600 bg-purple-50/20' 
                        : 'border-slate-150 hover:bg-slate-50/55'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        paymentMethod === 'wallet' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-800">Secure Wallet Vault (NUBAN)</span>
                        <span className="block text-[10px] text-slate-400 font-semibold">
                          Current Balance: <span className="text-purple-600 font-bold">₦{activeProfile.walletBalance.toLocaleString()}</span>
                        </span>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'wallet' ? 'border-purple-600' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'wallet' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                    </div>
                  </div>

                  {/* Option 2: Bank Transfer */}
                  <div 
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'bank_transfer' 
                        ? 'border-purple-600 bg-purple-50/20' 
                        : 'border-slate-150 hover:bg-slate-50/55'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        paymentMethod === 'bank_transfer' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-800">Nigerian Bank Transfer</span>
                        <span className="block text-[10px] text-slate-400">Direct instant funding on confirmation</span>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'bank_transfer' ? 'border-purple-600' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'bank_transfer' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                    </div>
                  </div>

                  {/* Option 3: Card */}
                  <div 
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      paymentMethod === 'card' 
                        ? 'border-purple-600 bg-purple-50/20' 
                        : 'border-slate-150 hover:bg-slate-50/55'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        paymentMethod === 'card' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-500'
                      }`}>
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="block text-xs font-bold text-slate-800">Secure Debit / Credit Card</span>
                        <span className="block text-[10px] text-slate-400">Pay via Paystack instant escrow gate</span>
                      </div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === 'card' ? 'border-purple-600' : 'border-slate-300'
                    }`}>
                      {paymentMethod === 'card' && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Order Summary & Total Price */}
              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-xs space-y-3">
                <h2 className="text-xs font-sans font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-purple-600" /> Order Summary ({cart.length})
                </h2>

                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.product.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 max-w-[70%]">
                        <img 
                          src={item.product.image} 
                          alt={item.product.title} 
                          className="w-10 h-10 rounded-xl object-cover border border-slate-100"
                        />
                        <div className="truncate">
                          <span className="block text-xs font-bold text-slate-800 truncate">{item.product.title}</span>
                          <span className="block text-[10px] text-slate-400">Qty: {item.quantity} • ₦{item.product.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-slate-900">
                        ₦{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-150 pt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-700">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <span>Escrow Courier Service Fee</span>
                    <span className="font-semibold text-slate-700">₦{shippingFee.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-900 font-extrabold text-sm pt-1 border-t border-dashed border-slate-200">
                    <span>Total Price</span>
                    <span className="text-purple-600 text-base">₦{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className={`w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-sans font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isSubmitting ? 'opacity-85 pointer-events-none' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Initializing Multi-Sig Vault...
                  </>
                ) : (
                  <>
                    Place Order & Fund Escrow <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          /* Animated Success Screen */
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 shadow-xs relative">
              <CheckCircle2 className="w-12 h-12" />
              <div className="absolute -inset-1 rounded-full border border-emerald-500/20 animate-ping" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-sans font-black text-slate-900 tracking-tight leading-none">
                Escrow Order Confirmed!
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Ref: <span className="font-mono text-slate-800 font-black">{orderSuccessDetails.orderId}</span>
              </p>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed mx-auto">
                Your payment of <span className="font-bold text-slate-800">₦{orderSuccessDetails.total.toLocaleString()}</span> has been successfully logged and locked into secure multi-sig escrow via <strong>{orderSuccessDetails.payment}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 text-left w-full max-w-sm space-y-2 text-[11px] text-slate-500">
              <div className="flex justify-between">
                <span>Shipping Recipient:</span>
                <strong className="text-slate-800">{fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Destination Address:</span>
                <strong className="text-slate-800 text-right truncate max-w-[60%]">{address}, {city}</strong>
              </div>
              <div className="flex justify-between">
                <span>Escrow Status:</span>
                <strong className="text-emerald-600 flex items-center gap-1">● FUNDS LOCKED</strong>
              </div>
            </div>

            <div className="w-full max-w-sm space-y-2 pt-4">
              <button
                onClick={() => onNavigateTab('trade')}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-sans font-bold text-xs rounded-xl shadow-lg shadow-purple-100 transition-all cursor-pointer"
              >
                Track Escrow Trades
              </button>
              
              <button
                onClick={() => onNavigateTab('market')}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-250 text-slate-600 font-sans font-bold text-xs rounded-xl transition-all border border-slate-200/50 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
