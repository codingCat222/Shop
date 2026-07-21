import React from 'react';

interface Review {
  id: string;
  user: string;
  target: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewsTabProps {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews, setReviews }) => {
  const handleDelete = (id: string) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="bg-[#020617] p-5 rounded-2xl border border-slate-800 space-y-4">
      <div className="flex justify-between items-center border-b border-[#1E293B] pb-3">
        <h3 className="text-xs font-bold uppercase text-white">Public Reviews & Feedback Audit</h3>
        <span className="text-[10px] text-slate-400">Total: {reviews.length} Feedbacks</span>
      </div>

      <div className="space-y-3 text-left">
        {reviews.map((rev) => (
          <div key={rev.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1.5 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-purple-400 font-bold block">By @{rev.user} → Target: @{rev.target}</span>
                <span className="text-yellow-400 text-[10px]">{'★'.repeat(rev.rating)}</span>
              </div>
              <button 
                onClick={() => handleDelete(rev.id)}
                className="text-[10px] font-bold text-red-400 hover:text-red-300 border border-red-500/20 bg-red-500/5 px-2.5 py-1 rounded cursor-pointer transition-colors"
              >
                Delete Review
              </button>
            </div>
            <p className="text-slate-300 italic">"{rev.comment}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};
