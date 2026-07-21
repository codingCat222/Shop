import React from 'react';

interface Product {
  id: string;
  title: string;
  price: number;
  seller: string;
  status: string;
  sales: number;
}

interface ProductsTabProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const ProductsTab: React.FC<ProductsTabProps> = ({ products, setProducts }) => {
  const toggleProductFlag = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: p.status === 'ACTIVE' ? 'FLAGGED' : 'ACTIVE' } : p));
  };

  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Consolidated Catalog Listings</h3>
        <span className="text-[10px] text-slate-400">Total: {products.length} Items</span>
      </div>

      <div className="space-y-2">
        {products.map((prod) => (
          <div key={prod.id} className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800 text-xs">
            <div>
              <strong className="text-white block">{prod.title}</strong>
              <span className="text-[10px] text-slate-400 font-mono">Owner: @{prod.seller} • Price: ₦{prod.price.toLocaleString()} • Sales: {prod.sales}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${prod.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {prod.status}
              </span>
              <button 
                onClick={() => toggleProductFlag(prod.id)}
                className="text-[10px] font-bold px-2 py-1 bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded cursor-pointer text-slate-300 transition-colors"
              >
                Toggle Flag
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
