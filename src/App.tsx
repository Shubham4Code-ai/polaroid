import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorks } from './components/HowItWorks';
import { MemoryWall } from './components/MemoryWall';
import { PolaroidCreator } from './components/Customizer/PolaroidCreator';
import { PacksPricing } from './components/PacksPricing';
import { GalleryView } from './components/GalleryView';
import { TrackOrderView } from './components/TrackOrderView';
import { AboutView } from './components/AboutView';
import { PoliciesView } from './components/PoliciesView';
import { ContactView } from './components/ContactView';
import { ReviewsSection } from './components/ReviewsSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminDashboard } from './components/AdminDashboard';
import { PolaroidPhoto, OrderRecord } from './types';
import { SAMPLE_POLAROIDS, ASSET_IMAGES } from './data/mockData';
import { Sparkles, ArrowRight, ShieldCheck, HeartHandshake, Truck } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [adminOpen, setAdminOpen] = useState<boolean>(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  
  // Customizer initial state
  const [customizerPhotoUrl, setCustomizerPhotoUrl] = useState<string | undefined>(undefined);
  const [customizerCaption, setCustomizerCaption] = useState<string | undefined>(undefined);

  // Policies subtab
  const [policySubtab, setPolicySubtab] = useState<'shipping' | 'refund' | 'terms' | 'privacy' | 'faq'>('shipping');

  // Track Order query params
  const [trackInfo, setTrackInfo] = useState<{ orderNumber: string; phone: string }>({
    orderNumber: 'LUM-84920',
    phone: '9876543210',
  });

  // Current photos in workspace
  const [photos, setPhotos] = useState<PolaroidPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('lumiere_polaroid_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      // fallback
    }
    return SAMPLE_POLAROIDS;
  });

  const cartPrintsCount = photos.reduce((sum, p) => sum + (p.quantity || 1), 0);

  // Navigate to customizer with a specific photo from gallery or memory wall
  const handleCustomizePhoto = (imageUrl: string, defaultCaption: string) => {
    setCustomizerPhotoUrl(imageUrl);
    setCustomizerCaption(defaultCaption);
    setCurrentTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open policy page
  const handleOpenPolicy = (policy: 'shipping' | 'refund' | 'terms' | 'privacy' | 'faq') => {
    setPolicySubtab(policy);
    setCurrentTab('policies');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Track order handler
  const handleTrackOrder = (ordNum: string, ph: string) => {
    setTrackInfo({ orderNumber: ordNum, phone: ph });
    setConfirmedOrder(null);
    setCurrentTab('track');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EF] text-[#1A1A1A] selection:bg-[#C9A66B]/25">
      
      {/* Navigation Top Bar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        cartCount={cartPrintsCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Main Page Routing */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <>
            <HeroSection
              onStartCreating={() => {
                setCurrentTab('create');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onExplorePacks={() => {
                setCurrentTab('pricing');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <HowItWorks
              onStart={() => {
                setCurrentTab('create');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <MemoryWall onCustomizePhoto={handleCustomizePhoto} />

            {/* Artisanal Craftsmanship Editorial Rest Section */}
            <section className="py-16 sm:py-24 bg-[#FAF6EF] border-b border-[#E8E0D2]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  <div className="lg:col-span-6 relative">
                    <div className="border border-[#E8E0D2] p-2 bg-white rounded-sm shadow-md">
                      <img
                        src={ASSET_IMAGES.studio}
                        alt="Master Printmaking"
                        className="w-full h-[320px] sm:h-[400px] object-cover rounded-[1px]"
                      />
                    </div>
                  </div>

                  <div className="lg:col-span-6 space-y-6 text-left">
                    <div className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold">
                      The Darkroom Renaissance
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-serif-display text-[#1A1A1A] leading-tight">
                      Archival Chemistry Meets Handwritten Soul.
                    </h2>
                    <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
                      Every photograph tells an unrepeatable story. Unlike standard digital prints that fade within years, our prints are cured with 12-channel pigment emulsions on pure cotton rag, certified to preserve tonal richness for over a century.
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono pt-2">
                      <div className="p-3 bg-white border border-[#E8E0D2] rounded-sm">
                        <div className="text-[#C9A66B] font-bold text-sm">350 GSM</div>
                        <div className="text-stone-500 mt-0.5">Heavyweight French cotton paper</div>
                      </div>
                      <div className="p-3 bg-white border border-[#E8E0D2] rounded-sm">
                        <div className="text-[#C9A66B] font-bold text-sm">100+ Years</div>
                        <div className="text-stone-500 mt-0.5">Archival lightfast stability</div>
                      </div>
                    </div>

                    <div>
                      <button
                        onClick={() => {
                          setCurrentTab('create');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-7 py-3.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
                      >
                        Design Your Archival Prints
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <ReviewsSection />

            {/* Quick Pricing Strip on Home */}
            <section className="py-16 bg-[#F7F3EB] border-b border-[#E8E0D2]">
              <div className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-6">
                <div className="max-w-xl mx-auto space-y-2">
                  <div className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold">
                    Volume Keepsake Bundles
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-serif-display text-[#1A1A1A]">
                    Order in Packs & Save up to 40%
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600 font-light">
                    From 10 starter prints to 100+ wedding suites with complimentary keepsake packaging.
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => {
                      setCurrentTab('pricing');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="border border-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAF6EF] text-[#1A1A1A] px-6 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    View All Pack Tiers & Inclusions
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {currentTab === 'create' && (
          <PolaroidCreator
            onAddToCart={updatedPhotos => {
              setPhotos(updatedPhotos);
              setCartOpen(true);
            }}
            initialPhotoUrl={customizerPhotoUrl}
            initialCaption={customizerCaption}
          />
        )}

        {currentTab === 'pricing' && (
          <PacksPricing
            onStartCustomizing={() => {
              setCurrentTab('create');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'gallery' && (
          <GalleryView onSelectToCustomize={handleCustomizePhoto} />
        )}

        {currentTab === 'track' && (
          <TrackOrderView
            initialOrderNumber={trackInfo.orderNumber}
            initialPhone={trackInfo.phone}
          />
        )}

        {currentTab === 'about' && (
          <AboutView
            onStartCustomizing={() => {
              setCurrentTab('create');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'contact' && <ContactView />}

        {currentTab === 'policies' && (
          <PoliciesView initialPolicy={policySubtab} />
        )}
      </main>

      {/* Cart & Checkout Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        photos={photos}
        onUpdatePhotos={updated => setPhotos(updated)}
        onOrderSuccess={order => {
          setCartOpen(false);
          setConfirmedOrder(order);
        }}
      />

      {/* Order Success Celebration Modal */}
      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
        onTrackOrder={handleTrackOrder}
      />

      {/* Admin Dashboard Gate & Management View */}
      {adminOpen && (
        <AdminDashboard onClose={() => setAdminOpen(false)} />
      )}

      {/* Luxury Footer */}
      <Footer
        onNavigate={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenPolicy={handleOpenPolicy}
        onOpenAdmin={() => setAdminOpen(true)}
      />

    </div>
  );
}
