import React from 'react';
import { PolaroidFrame } from './PolaroidFrame';
import { ASSET_IMAGES } from '../data/mockData';
import { Sparkles } from 'lucide-react';

interface MemoryWallProps {
  onCustomizePhoto: (imageUrl: string, defaultCaption: string) => void;
}

export const MemoryWall: React.FC<MemoryWallProps> = ({ onCustomizePhoto }) => {
  const hangingPrints = [
    {
      id: 'h_1',
      image: ASSET_IMAGES.travel,
      caption: 'Cliffside Dreams · Amalfi',
      font: 'caveat' as const,
      border: 'white' as const,
      tilt: -3,
      clipColor: '#C49A6C',
    },
    {
      id: 'h_2',
      image: ASSET_IMAGES.wedding,
      caption: 'Claire & Julien · Paris Vows',
      font: 'homemade' as const,
      border: 'cream' as const,
      tilt: 2,
      clipColor: '#A88054',
    },
    {
      id: 'h_3',
      image: ASSET_IMAGES.pet,
      caption: 'Cooper in October Sun',
      font: 'caveat' as const,
      border: 'white' as const,
      tilt: -2,
      clipColor: '#C49A6C',
    },
    {
      id: 'h_4',
      image: ASSET_IMAGES.friends,
      caption: 'Evenings that never end',
      font: 'caveat' as const,
      border: 'noir' as const,
      tilt: 4,
      clipColor: '#A88054',
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#FAF6EF] border-b border-[#E8E0D2] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold">
            Tactile Living Archive
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-display text-[#1A1A1A]">
            The Memory Wall
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-light">
            Strung along natural jute twine with miniature wooden clothespins, these prints breathe warmth and character into bedrooms, studios, and dining nooks.
          </p>
        </div>

        {/* The Hanging Twine Wire */}
        <div className="relative pt-6 pb-12">
          {/* Natural Jute Twine Line */}
          <div className="absolute top-10 left-0 right-0 h-[2.5px] bg-[#B09874] shadow-xs opacity-80" />
          
          {/* Wall Nails at ends */}
          <div className="absolute top-[34px] left-2 w-3 h-3 rounded-full bg-[#524436] shadow-md border border-[#C9A66B]/50" />
          <div className="absolute top-[34px] right-2 w-3 h-3 rounded-full bg-[#524436] shadow-md border border-[#C9A66B]/50" />

          {/* Hanging Polaroids Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 justify-items-center">
            {hangingPrints.map((item, idx) => (
              <div key={item.id} className="relative group pt-4">
                
                {/* Miniature Wooden Clothespin */}
                <div 
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-10 rounded-[1px] shadow-md z-30 flex flex-col items-center justify-between py-1 transition-transform group-hover:-translate-y-0.5"
                  style={{ backgroundColor: item.clipColor }}
                >
                  {/* Metal spring ring on clothespin */}
                  <div className="w-5 h-1.5 bg-[#8C827A] rounded-full shadow-inner opacity-90" />
                  <div className="w-2.5 h-1 bg-[#4A3B2C]/40 rounded-full" />
                </div>

                {/* Hanging Polaroid Card */}
                <div 
                  onClick={() => onCustomizePhoto(item.image, item.caption)}
                  className="transition-transform duration-300 group-hover:scale-102"
                >
                  <PolaroidFrame
                    imageUrl={item.image}
                    caption={item.caption}
                    captionFont={item.font}
                    border={item.border}
                    tiltDegree={item.tilt}
                    interactiveLift={true}
                  />
                </div>

                {/* Hover Quick Edit tooltip */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 mt-2 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-[#C9A66B] font-semibold bg-[#1A1A1A] text-white px-2.5 py-1 rounded-sm shadow-sm">
                    <Sparkles className="w-3 h-3" /> Click to Customise This
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flatlay Wooden Desk Preview callout */}
        <div className="mt-12 p-6 sm:p-8 bg-[#F3ECE0] rounded-sm border border-[#E3D9C9] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <h3 className="font-serif-display text-xl text-[#1A1A1A]">
              Add Beechwood Display Blocks & Warm Fairy Lights
            </h3>
            <p className="text-stone-600 text-xs sm:text-sm font-light">
              Elevate your memory wall with custom accessories during checkout. Free linen gift pouch included with every 20+ print order.
            </p>
          </div>
          <button
            onClick={() => onCustomizePhoto(ASSET_IMAGES.travel, 'Summer memories')}
            className="bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 rounded-sm cursor-pointer"
          >
            Start Your Print Order
          </button>
        </div>

      </div>
    </section>
  );
};
