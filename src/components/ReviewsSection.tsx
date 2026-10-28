import React, { useState } from 'react';
import { REVIEWS } from '../data/mockData';
import { Star, CheckCircle2, MessageSquarePlus, Image as ImageIcon, Sparkles } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const [reviewsList, setReviewsList] = useState(REVIEWS);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [city, setCity] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !text) return;
    const newRev = {
      id: `rev_${Date.now()}`,
      name,
      role: role || 'Verified Customer',
      city: city || 'India',
      rating,
      title: title || 'Exceptional craftsmanship',
      text,
      date: 'Verified Buyer · Today',
    };
    setReviewsList([newRev, ...reviewsList]);
    setShowReviewModal(false);
    setName('');
    setText('');
    setTitle('');
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF6EF] border-b border-[#E8E0D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-2 text-left">
            <div className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold">
              Client Chronicles
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif-display text-[#1A1A1A]">
              Cherished Across 45,000+ Polaroids
            </h2>
            <p className="text-stone-600 text-sm font-light">
              Real stories from brides, travelers, collectors, and sentimental gifters.
            </p>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer self-start md:self-auto"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#C9A66B]" />
            <span>Write a Client Review</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviewsList.map(rev => (
            <div
              key={rev.id}
              className="bg-white p-7 rounded-sm border border-[#E8E0D2] shadow-sm flex flex-col justify-between text-left hover:border-stone-400 transition-colors"
            >
              <div className="space-y-3">
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 text-[#C9A66B]">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current stroke-current" />
                  ))}
                </div>

                <h3 className="font-serif-display text-lg text-[#1A1A1A] leading-snug">
                  “{rev.title}”
                </h3>

                <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
                  {rev.text}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-stone-900">{rev.name}</div>
                  <div className="text-stone-500 text-[11px] font-mono">{rev.role} · {rev.city}</div>
                </div>
                <div className="flex items-center gap-1 text-emerald-700 font-mono text-[10px] uppercase font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit Review Modal */}
        {showReviewModal && (
          <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-[#FAF6EF] border border-[#E8E0D2] rounded-sm p-6 sm:p-8 max-w-lg w-full space-y-4 text-left shadow-2xl relative">
              <div className="flex justify-between items-center pb-2 border-b border-[#E8E0D2]">
                <h3 className="font-serif-display text-xl text-[#1A1A1A]">Share Your Darkroom Experience</h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="text-stone-500 hover:text-stone-900 text-xs font-mono"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Sanya Kapoor"
                    className="w-full bg-white border border-[#E8E0D2] p-2 rounded-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">Role / Occasion</label>
                    <input
                      type="text"
                      value={role}
                      onChange={e => setRole(e.target.value)}
                      placeholder="e.g. Bride, Traveler, Stylist"
                      className="w-full bg-white border border-[#E8E0D2] p-2 rounded-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. Mumbai"
                      className="w-full bg-white border border-[#E8E0D2] p-2 rounded-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">Rating</label>
                  <div className="flex gap-2">
                    {[5, 4, 3, 2, 1].map(num => (
                      <button
                        type="button"
                        key={num}
                        onClick={() => setRating(num)}
                        className={`px-3 py-1.5 rounded-xs border font-mono ${
                          rating === num ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-stone-700'
                        }`}
                      >
                        {num} ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">Review Headline</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. The paper texture and ink warmth exceeded all expectations"
                    className="w-full bg-white border border-[#E8E0D2] p-2 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">Detailed Feedback</label>
                  <textarea
                    rows={3}
                    required
                    value={text}
                    onChange={e => setText(e.target.value)}
                    placeholder="Describe how your polaroids look and feel in hand..."
                    className="w-full bg-white border border-[#E8E0D2] p-2 rounded-xs"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
                >
                  Publish Review
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
