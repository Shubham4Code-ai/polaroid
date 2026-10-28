import React from 'react';
import { ASSET_IMAGES } from '../data/mockData';
import { Sparkles, Shield, Heart, Feather } from 'lucide-react';

export const AboutView: React.FC<{ onStartCustomizing: () => void }> = ({ onStartCustomizing }) => {
  return (
    <div className="py-12 sm:py-20 bg-[#FAF6EF]">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold">
            Our Darkroom Manifesto
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif-display text-[#1A1A1A]">
            In Praise of Physical Tangibility
          </h1>
          <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
            We take thousands of photos on our phones, only for them to vanish into bottomless cloud streams. 
            Lumière Atelier was founded to rescue your most meaningful chapters into objects of heirloom beauty.
          </p>
        </div>

        {/* Big Editorial Visual Banner */}
        <div className="relative rounded-sm overflow-hidden border border-[#E8E0D2] shadow-lg">
          <img
            src={ASSET_IMAGES.studio}
            alt="Darkroom Studio Flatlay"
            className="w-full h-[320px] sm:h-[440px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-6 sm:p-10">
            <div className="text-white max-w-lg space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A66B]">
                Hand-Calibrated Chemistry
              </span>
              <h3 className="font-serif-display text-2xl">
                Every print inspected by human eyes.
              </h3>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white p-6 rounded-sm border border-[#E8E0D2] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#1A1A1A] text-[#C9A66B] flex items-center justify-center">
              <Feather className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display text-xl text-[#1A1A1A]">350 GSM Cotton Rag</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              We source heavyweight fine art stock from historic European mills. It has substantial tactile heft, subtle tooth, and will never curl or warp over time.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-[#E8E0D2] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#1A1A1A] text-[#C9A66B] flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display text-xl text-[#1A1A1A]">100-Year Archival Inks</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Our 12-channel pigment emulsions offer museum-grade ultraviolet resistance. The vibrant highlights and deep analog blacks will endure across generations.
            </p>
          </div>

          <div className="bg-white p-6 rounded-sm border border-[#E8E0D2] space-y-3">
            <div className="w-10 h-10 rounded-sm bg-[#1A1A1A] text-[#C9A66B] flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="font-serif-display text-xl text-[#1A1A1A]">Privacy Commitment</h3>
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              Your personal photos belong only to you. Our print engines operate on isolated, encrypted pipelines, and source files are auto-purged 30 days post-dispatch.
            </p>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center pt-8 border-t border-[#E8E0D2]">
          <button
            onClick={onStartCustomizing}
            className="bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-8 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-md cursor-pointer"
          >
            Start Your Print Order Today
          </button>
        </div>

      </div>
    </div>
  );
};
