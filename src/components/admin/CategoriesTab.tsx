import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

interface CategoriesTabProps {
  categories: string[];
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({ categories, setCategories }) => {
  const [newCategoryName, setNewCategoryName] = useState('');

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      setCategories(prev => [...prev, newCategoryName.trim()]);
      setNewCategoryName('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories(prev => prev.filter(c => c !== cat));
  };

  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Product Categories Settings</h3>
        <span className="text-[10px] text-slate-400">Catalog structure control</span>
      </div>

      <div className="space-y-2">
        {categories.map((cat, idx) => (
          <div key={idx} className="flex justify-between items-center bg-slate-900/60 p-2.5 rounded-lg text-xs font-sans">
            <span className="text-slate-300 font-bold">{cat}</span>
            <button 
              onClick={() => handleRemoveCategory(cat)}
              className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-slate-800">
        <input 
          type="text" 
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="Add custom category..."
          className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-600"
          onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
        />
        <button 
          onClick={handleAddCategory}
          className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl cursor-pointer transition-colors"
        >
          Create
        </button>
      </div>
    </div>
  );
};
