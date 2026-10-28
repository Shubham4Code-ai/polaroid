import React from 'react';
import { PolaroidFrame } from './PolaroidFrame';
import { ASSET_IMAGES } from '../data/mockData';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Truck } from 'lucide-react';

interface HeroSectionProps {
  onStartCreating: () => void;
  onExplorePacks: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartCreating,
  onExplorePacks,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-[#E8E0D2]">
      {/* Background soft ambient radial gradient */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#C9A66B]/8 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold">
              <span className="w-6 h-[1px] bg-[#C9A66B]" />
              The Darkroom Revival · Est. 2024
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif-display font-medium text-[#1A1A1A] leading-[1.12] tracking-tight text-balance">
              Turn Fleeting Screen Pixels into <span className="italic font-normal">Timeless</span> Film Polaroids.
            </h1>

            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-light">
              Crafted on 350 GSM museum-grade cotton rag with archival chemistry. 
              Upload your camera roll, customize with authentic handwritten captions, and hold your memories forever.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onStartCreating}
                className="group flex items-center justify-center gap-3 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-7 py-4 rounded-sm text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
              >
                <span>Customise Your Prints</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExplorePacks}
                className="flex items-center justify-center gap-2 border border-stone-400/80 hover:border-[#1A1A1A] text-[#1A1A1A] px-6 py-4 rounded-sm text-sm font-medium tracking-wider uppercase transition-colors cursor-pointer"
              >
                <span>Curated Packs & Pricing</span>
              </button>
            </div>

            {/* Adjacent Trust Proof Strip (Claim-to-proof adjacency) */}
            <div className="pt-6 border-t border-[#E8E0D2]/80 grid grid-cols-3 gap-4 text-xs font-mono text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C9A66B] shrink-0" />
                <span>350 GSM Cotton Film</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-[#C9A66B] shrink-0" />
                <span>Handwritten Ink Script</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C9A66B] shrink-0" />
                <span>Razorpay & Express COD</span>
              </div>
            </div>
          </div>

          {/* Right Column: Scattered Floating Realistic Polaroids */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[440px] sm:min-h-[500px]">
            
            {/* Polaroid 1: Wedding (Rotated -5 deg) */}
            <div className="absolute -top-4 -left-2 sm:left-4 z-10 transition-transform duration-300 hover:z-30 hover:scale-105">
              <PolaroidFrame
                imageUrl={ASSET_IMAGES.wedding}
                caption="Paris · Forever Starts Here"
                captionFont="homemade"
                size="classic"
                border="cream"
                finish="matte"
                tiltDegree={-5}
                showDateStamp={true}
                dateStampText="SEP 26"
              />
            </div>

            {/* Polaroid 2: Travel Coast (Rotated +6 deg) */}
            <div className="absolute top-12 right-0 sm:right-6 z-20 transition-transform duration-300 hover:z-30 hover:scale-105">
              <PolaroidFrame
                imageUrl={ASSET_IMAGES.travel}
                caption="Amalfi Breeze & Salty Hair"
                captionFont="caveat"
                size="classic"
                border="white"
                finish="glossy"
                tiltDegree={6}
                showDateStamp={false}
              />
            </div>

            {/* Polaroid 3: Golden Friends (Rotated -2 deg, bottom center) */}
            <div className="absolute bottom-2 left-10 sm:left-24 z-20 transition-transform duration-300 hover:z-30 hover:scale-105">
              <PolaroidFrame
                imageUrl={ASSET_IMAGES.friends}
                caption="The Candlelit Supper Club"
                captionFont="caveat"
                size="mini"
                border="noir"
                finish="matte"
                tiltDegree={-3}
              />
            </div>

            {/* Decorative background element: Brass Paperclip & wax seal hint */}
            <div className="absolute -bottom-4 right-12 hidden sm:block p-3 bg-stone-900/5 rounded-full border border-stone-300/40 text-[10px] font-mono uppercase tracking-widest text-stone-500">
              Archival Quality Guaranteed · 100 Year Emulsion
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
