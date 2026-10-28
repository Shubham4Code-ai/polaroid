import React from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck, Gift } from 'lucide-react';

export const PacksPricing: React.FC<{ onStartCustomizing: () => void }> = ({ onStartCustomizing }) => {
  const packs = [
    {
      name: 'Starter Capsule',
      prints: '10 Prints',
      originalPrice: '₹390',
      price: '₹330',
      discount: '15% OFF',
      desc: 'Ideal for weekend roadtrips, birthday memories, or testing our archival paper weight.',
      features: [
        '350 GSM museum cotton stock',
        'Custom handwritten ink captions',
        'Silk Matte or High Gloss finish',
        'Protective glassine sleeves',
      ],
      popular: false,
    },
    {
      name: 'Memory Keepsake',
      prints: '20 Prints',
      originalPrice: '₹780',
      price: '₹624',
      discount: '20% OFF',
      desc: 'Our most cherished pack. Perfect for annual retrospectives, couple albums, and holidays.',
      features: [
        'Complimentary linen gift pouch',
        'Free Express Tracked Delivery',
        'Choice of 5 border tones',
        'Backside message printing',
        'Archival 100-year color emulsion',
      ],
      popular: true,
    },
    {
      name: 'Grand Collector',
      prints: '50 Prints',
      originalPrice: '₹1,950',
      price: '₹1,365',
      discount: '30% OFF',
      desc: 'The ultimate luxury gift. Includes our handcrafted oatmeal linen box and beechwood stands.',
      features: [
        'Complimentary Linen Keepsake Box (Worth ₹299)',
        'Set of 4 Beechwood Stands included',
        'Zero-glare anti-fingerprint coating',
        'Free Express 48hr Dispatch',
        'VIP WhatsApp darkroom preview',
      ],
      popular: false,
    },
    {
      name: 'Master Event Batch',
      prints: '100+ Prints',
      originalPrice: '₹3,900',
      price: '₹2,340',
      discount: '40% OFF',
      desc: 'Crafted for luxury weddings, brand launches, and bespoke corporate gifting.',
      features: [
        'Custom foil-stamped corporate logo/monogram',
        '2 × Archival hardback memory albums',
        'Priority same-day darkroom technician',
        'Custom packing slips with zero pricing',
        'Dedicated corporate concierge',
      ],
      popular: false,
    },
  ];

  return (
    <div className="py-12 sm:py-20 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold">
            Honest Studio Pricing
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif-display text-[#1A1A1A]">
            Curated Archival Print Packs
          </h1>
          <p className="text-stone-600 text-sm sm:text-base font-light">
            Enjoy progressive volume discounts on museum-grade cotton polaroids. Zero hidden fees. All taxes & GST included.
          </p>
        </div>

        {/* Packs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packs.map(pack => (
            <div
              key={pack.name}
              className={`p-6 sm:p-7 rounded-sm border transition-all relative flex flex-col justify-between ${
                pack.popular
                  ? 'bg-white border-[#1A1A1A] ring-2 ring-[#C9A66B] shadow-xl'
                  : 'bg-[#FAF6EF] border-[#E8E0D2] hover:border-stone-400 shadow-sm'
              }`}
            >
              <div>
                {pack.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-[#C9A66B] px-3 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold border border-[#C9A66B]">
                    Most Popular Choice
                  </div>
                )}

                <div className="text-xs font-mono text-[#C9A66B] font-bold uppercase tracking-wider mb-1">
                  {pack.discount}
                </div>
                <h3 className="font-serif-display text-2xl text-[#1A1A1A]">
                  {pack.name}
                </h3>
                <div className="text-xs text-stone-500 font-mono mt-0.5">{pack.prints}</div>

                {/* Price Display */}
                <div className="my-5 pb-5 border-b border-[#E8E0D2] flex items-baseline gap-2">
                  <span className="font-mono text-3xl font-bold text-[#1A1A1A] tabular-nums">
                    {pack.price}
                  </span>
                  <span className="font-mono text-xs text-stone-400 line-through tabular-nums">
                    {pack.originalPrice}
                  </span>
                </div>

                <p className="text-xs text-stone-600 font-light leading-relaxed mb-6">
                  {pack.desc}
                </p>

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-stone-700">
                  {pack.features.map(f => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="mt-8 pt-4">
                <button
                  onClick={onStartCustomizing}
                  className={`w-full py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    pack.popular
                      ? 'bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF]'
                      : 'bg-[#F3ECE0] hover:bg-[#1A1A1A] hover:text-[#FAF6EF] text-[#1A1A1A]'
                  }`}
                >
                  <span>Select {pack.prints}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate / Wedding Batch Order Callout */}
        <div className="mt-16 bg-[#1A1A1A] text-[#FAF6EF] p-8 sm:p-12 rounded-sm relative overflow-hidden text-left">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-mono uppercase text-[#C9A66B] tracking-widest font-semibold">
              Weddings & Brand Collaborations
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif-display text-white">
              Planning wedding favors or bespoke corporate gifts?
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">
              We provide tailored gift packaging with foil monogramming, wax sealing, custom guest photo curation, and split courier shipping across India and worldwide.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <a
                href="mailto:concierge@lumiereatelier.com?subject=Bulk Wedding / Corporate Inquiry"
                className="bg-[#C9A66B] hover:bg-[#B59356] text-[#1A1A1A] px-6 py-3 rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Inquire for Bulk Gifting
              </a>
              <a
                href="https://wa.me/919820045678"
                target="_blank"
                rel="noreferrer"
                className="border border-[#FAF6EF]/30 hover:border-white text-white px-5 py-3 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors"
              >
                Chat on WhatsApp (+91 98200 45678)
              </a>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
