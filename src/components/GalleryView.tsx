import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/mockData';
import { PolaroidFrame } from './PolaroidFrame';
import { Sparkles, X, ArrowRight } from 'lucide-react';

interface GalleryViewProps {
  onSelectToCustomize: (imageUrl: string, defaultCaption: string) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ onSelectToCustomize }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeLightbox, setActiveLightbox] = useState<any | null>(null);

  const categories = ['All', 'Wedding', 'Travel', 'Couple', 'Friends', 'Pets', 'Studio'];

  const filteredItems = selectedCategory === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(it => it.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="py-12 sm:py-20 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold">
            Archival Exhibition
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-display text-[#1A1A1A]">
            The Memory Gallery
          </h1>
          <p className="text-stone-600 text-sm sm:text-base font-light">
            Real custom polaroids crafted by Lumière Atelier for weddings, journeys, milestones, and furry companions.
          </p>
        </div>

        {/* Filter Segmented Controls */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-sm transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#1A1A1A] text-[#FAF6EF] shadow-sm'
                  : 'bg-white text-stone-600 border border-[#E8E0D2] hover:border-stone-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Polaroid Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-8 justify-items-center">
          {filteredItems.map((item, idx) => {
            const tilt = idx % 2 === 0 ? -2 : 3;
            return (
              <div
                key={item.id}
                onClick={() => setActiveLightbox(item)}
                className="group flex flex-col items-center cursor-pointer"
              >
                <PolaroidFrame
                  imageUrl={item.image}
                  caption={item.caption}
                  captionFont={item.font as any}
                  border={item.border as any}
                  tiltDegree={tilt}
                  interactiveLift={true}
                />

                <div className="mt-4 text-center">
                  <span className="text-xs font-serif-display font-medium text-stone-900 group-hover:text-[#C9A66B] transition-colors">
                    {item.title}
                  </span>
                  <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                    {item.category} · {item.client}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Lightbox Modal */}
        {activeLightbox && (
          <div className="fixed inset-0 z-50 bg-[#1A1A1A]/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="relative bg-[#FAF6EF] border border-[#E8E0D2] p-8 max-w-lg w-full rounded-sm text-center space-y-6">
              <button
                onClick={() => setActiveLightbox(null)}
                className="absolute top-4 right-4 p-2 text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex justify-center">
                <PolaroidFrame
                  imageUrl={activeLightbox.image}
                  caption={activeLightbox.caption}
                  captionFont={activeLightbox.font}
                  border={activeLightbox.border}
                  tiltDegree={0}
                  interactiveLift={false}
                />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif-display text-xl text-[#1A1A1A]">{activeLightbox.title}</h3>
                <p className="text-xs font-mono uppercase text-stone-500">
                  Archival Fine Art Paper · {activeLightbox.client}
                </p>
              </div>

              <button
                onClick={() => {
                  onSelectToCustomize(activeLightbox.image, activeLightbox.caption);
                  setActiveLightbox(null);
                }}
                className="w-full py-3 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] text-xs font-semibold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#C9A66B]" />
                <span>Customise This Polaroid Style</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
