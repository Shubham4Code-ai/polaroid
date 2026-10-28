import React, { useState } from 'react';
import { Sparkles, MessageCircle, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenPolicy: (policy: 'shipping' | 'refund' | 'terms' | 'privacy' | 'faq') => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPolicy,
  onOpenAdmin,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
    }
  };

  return (
    <footer className="bg-[#18181A] text-[#EDE8DF] pt-16 pb-12 border-t border-[#C9A66B]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12 text-left">
        
        {/* Top Newsletter & Brand Lockup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-stone-800">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="font-serif-display text-2xl tracking-tight text-white">
              LUMIÈRE ATELIER
            </span>
            <p className="text-xs text-stone-400 font-light leading-relaxed max-w-md">
              Boutique photo studio crafting museum-grade custom Polaroid prints on authentic 350 GSM cotton rag. 
              Bridging vintage analog darkroom craft with modern digital seamlessness.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-[#C9A66B]">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Studio: Bandra West, Mumbai 400050
              </span>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#C9A66B] font-semibold">
              The Atelier Journal
            </span>
            <h4 className="font-serif-display text-lg text-white">
              Receive 10% off your inaugural keepsake box
            </h4>
            
            {!newsletterSubscribed ? (
              <form onSubmit={handleSubscribe} className="flex gap-2 max-w-md">
                <input
                  type="email"
                  required
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-stone-900 border border-stone-700 focus:border-[#C9A66B] px-3.5 py-2.5 rounded-sm text-xs font-mono text-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-[#C9A66B] hover:bg-[#B59356] text-[#1A1A1A] px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Join
                </button>
              </form>
            ) : (
              <div className="p-3 bg-stone-900 border border-[#C9A66B] rounded-sm text-xs font-mono text-[#C9A66B]">
                Welcome to the Atelier! Use voucher code <strong className="text-white">FIRST10</strong> at checkout for 10% off.
              </div>
            )}
          </div>

        </div>

        {/* 4 Column Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono">
          
          <div className="space-y-3">
            <h5 className="uppercase text-[#C9A66B] font-bold tracking-wider">Prints & Formats</h5>
            <ul className="space-y-2 text-stone-400">
              <li><button onClick={() => onNavigate('create')} className="hover:text-white transition-colors">Classic Polaroid (88×107mm)</button></li>
              <li><button onClick={() => onNavigate('create')} className="hover:text-white transition-colors">Mini Instax (54×86mm)</button></li>
              <li><button onClick={() => onNavigate('create')} className="hover:text-white transition-colors">Square Fine Art (88×88mm)</button></li>
              <li><button onClick={() => onNavigate('create')} className="hover:text-white transition-colors">Cinematic Wide (108×86mm)</button></li>
              <li><button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">Curated Print Packs</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="uppercase text-[#C9A66B] font-bold tracking-wider">Customer Experience</h5>
            <ul className="space-y-2 text-stone-400">
              <li><button onClick={() => onNavigate('track')} className="hover:text-white transition-colors">Track Order Live</button></li>
              <li><button onClick={() => onNavigate('gallery')} className="hover:text-white transition-colors">Memory Gallery</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">Darkroom Craft Story</button></li>
              <li><button onClick={() => onOpenPolicy('faq')} className="hover:text-white transition-colors">Frequently Asked Questions</button></li>
              <li><button onClick={onOpenAdmin} className="hover:text-[#C9A66B] transition-colors text-stone-500">Darkroom Admin Portal</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="uppercase text-[#C9A66B] font-bold tracking-wider">Legal & Compliance</h5>
            <ul className="space-y-2 text-stone-400">
              <li><button onClick={() => onOpenPolicy('shipping')} className="hover:text-white transition-colors">Shipping & Delivery Policy</button></li>
              <li><button onClick={() => onOpenPolicy('refund')} className="hover:text-white transition-colors">Cancellation & Refund Policy</button></li>
              <li><button onClick={() => onOpenPolicy('privacy')} className="hover:text-white transition-colors">Customer Photo Privacy Policy</button></li>
              <li><button onClick={() => onOpenPolicy('terms')} className="hover:text-white transition-colors">Terms & Conditions of Service</button></li>
              <li><span className="text-stone-500">GST Registration: 27AABCL1234F1Z8</span></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="uppercase text-[#C9A66B] font-bold tracking-wider">Studio Concierge</h5>
            <p className="text-stone-400 leading-relaxed font-light">
              Need assistance with photo resolution, bulk wedding favors, or corporate orders?
            </p>
            <div className="pt-1">
              <a
                href="https://wa.me/919820045678"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5B] text-white px-3.5 py-2 rounded-xs text-[11px] font-bold tracking-wider uppercase transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Concierge</span>
              </a>
            </div>
            <div className="text-stone-500 text-[11px]">
              Email: concierge@lumiereatelier.com
            </div>
          </div>

        </div>

        {/* Bottom Bar with Razorpay Payment Security Badges */}
        <div className="pt-8 border-t border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-stone-500">
          <div>
            © 2026 Lumière Atelier. All rights reserved. Handcrafted with reverence for memories.
          </div>

          {/* Payment Trust Lockup */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-stone-400">Secured by</span>
            <div className="px-2 py-1 bg-stone-900 border border-stone-700 rounded-xs text-white font-bold text-[10px]">
              RAZORPAY
            </div>
            <div className="px-2 py-1 bg-stone-900 border border-stone-700 rounded-xs text-stone-300 text-[10px]">
              UPI · CARDS · NETBANKING
            </div>
            <div className="px-2 py-1 bg-stone-900 border border-stone-700 rounded-xs text-[#C9A66B] text-[10px]">
              256-BIT SSL
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
