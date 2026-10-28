import React from 'react';
import { UploadCloud, Sliders, Printer, Gift, CheckCircle2 } from 'lucide-react';

export const HowItWorks: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  const steps = [
    {
      num: '01',
      title: 'Curate Your Moments',
      desc: 'Drag & drop multiple high-resolution photos straight from your iPhone, Android camera roll, or laptop.',
      icon: UploadCloud,
    },
    {
      num: '02',
      title: 'Darkroom Customization',
      desc: 'Choose your format, border tones, matte/glossy finish, crop with precision, and scribe handwritten captions.',
      icon: Sliders,
    },
    {
      num: '03',
      title: 'Master Print & Emulsion',
      desc: 'Our lab technicians calibrate 12-color archival pigment onto 350 GSM museum cotton stock rated for 100+ years.',
      icon: Printer,
    },
    {
      num: '04',
      title: 'Delivered in Keepsake Box',
      desc: 'Hand-inspected, wrapped in parchment with satin ribbons, and dispatched via express tracked courier in 48 hours.',
      icon: Gift,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#F7F3EB] border-b border-[#E8E0D2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold">
            Simple 4-Step Process
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif-display text-[#1A1A1A]">
            How Your Polaroids Are Born
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-light">
            We bridge vintage analog soul with effortless modern mobile checkout.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="bg-[#FAF6EF] p-8 rounded-sm border border-[#E8E0D2] relative hover:border-[#C9A66B] transition-colors group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-light text-[#C9A66B]">
                      {step.num}
                    </span>
                    <div className="p-2.5 rounded-sm bg-[#1A1A1A] text-[#C9A66B] group-hover:bg-[#C9A66B] group-hover:text-[#1A1A1A] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-serif-display text-xl text-[#1A1A1A] mb-3">
                    {step.title}
                  </h3>
                  <p className="text-stone-600 text-xs sm:text-sm leading-relaxed font-light">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E8E0D2]/60 flex items-center gap-1.5 text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>Studio Calibrated</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-8 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-md"
          >
            Create Your First Batch
          </button>
        </div>

      </div>
    </section>
  );
};
