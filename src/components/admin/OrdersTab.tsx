import React from 'react';

interface Order {
  id: string;
  product: string;
  buyer: string;
  seller: string;
  amount: number;
  status: string;
  date: string;
}

interface OrdersTabProps {
  orders: Order[];
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders }) => {
  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Purchase Orders Logs</h3>
        <span className="text-[10px] text-slate-400">Total Sales Pipeline</span>
      </div>

      <div className="space-y-2">
        {orders.map((order) => (
          <div key={order.id} className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 space-y-1.5 text-xs text-left">
            <div className="flex justify-between items-center">
              <span className="font-black text-white">{order.product}</span>
              <span className="text-[9px] font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded font-bold uppercase">{order.status}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono space-y-0.5">
              <p>Order ID: {order.id} • Amount: ₦{order.amount.toLocaleString()} • Date: {order.date}</p>
              <p>Buyer: @{order.buyer} • Seller: @{order.seller}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
