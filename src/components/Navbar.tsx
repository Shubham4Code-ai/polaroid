import React from 'react';
import { ShoppingBag, Sparkles, Menu, X, User } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  cartCount,
  onOpenCart,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'home', label: 'Studio' },
    { id: 'create', label: 'Customise' },
    { id: 'pricing', label: 'Packs & Pricing' },
    { id: 'gallery', label: 'Memory Gallery' },
    { id: 'track', label: 'Track Order' },
    { id: 'about', label: 'Darkroom Story' },
  ];

  return (
    <>
      {/* Top subtle shipping notice banner */}
      <div className="bg-[#1A1A1A] text-[#FAF6EF] text-[11px] py-1.5 px-4 text-center tracking-widest uppercase font-mono border-b border-[#C9A66B]/20">
        Complimentary Express Shipping across India on orders above ₹799 · Archival 350 GSM Paper
      </div>

      {/* Main Top Bar strictly obeying Top Bar Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF6EF]/90 backdrop-blur-md border-b border-[#E8E0D2] transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 sm:py-4">
          
          {/* Zone 1: Single text element brand wordmark */}
          <button
            onClick={() => onNavigate('home')}
            className="group flex items-baseline gap-1 text-left cursor-pointer whitespace-nowrap shrink-0 focus:outline-hidden"
          >
            <span className="font-serif-display text-xl sm:text-2xl font-bold tracking-tight text-[#1A1A1A] group-hover:text-[#C9A66B] transition-colors">
              LUMIÈRE ATELIER
            </span>
            <span className="text-[10px] tracking-widest uppercase font-mono text-[#C9A66B] font-semibold hidden sm:inline ml-1">
              PARIS · BOM
            </span>
          </button>

          {/* Zone 2: 4-5 clean single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-medium uppercase tracking-wider text-stone-700">
            {navLinks.map(link => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.id)}
                  className={`hover:text-[#1A1A1A] transition-colors whitespace-nowrap shrink-0 py-1 relative ${
                    isActive ? 'text-[#1A1A1A] font-semibold' : 'text-stone-600'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#C9A66B]" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action lockup (Cart + CTA) */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Bag Button with Counter */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-stone-800 hover:text-[#C9A66B] transition-colors cursor-pointer rounded-md hover:bg-stone-200/50"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#1A1A1A] text-[#FAF6EF] text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center border border-[#C9A66B]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin / Account Quick Access */}
            <button
              onClick={onOpenAdmin}
              className="hidden sm:flex items-center text-stone-500 hover:text-stone-900 transition-colors p-2 text-xs"
              title="Studio Admin Portal"
            >
              <User className="w-4 h-4" />
            </button>

            {/* Primary CTA */}
            <button
              onClick={() => onNavigate('create')}
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-4 py-2 sm:px-5 sm:py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-sm cursor-pointer whitespace-nowrap shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C9A66B] group-hover:text-white" />
              <span>Create Polaroids</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-800 focus:outline-hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF6EF] border-b border-[#E8E0D2] px-6 py-4 space-y-3">
            {navLinks.map(link => (
              <button
                key={link.id}
                onClick={() => {
                  onNavigate(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`block w-full text-left py-2 text-sm uppercase tracking-wider ${
                  currentTab === link.id ? 'font-bold text-[#C9A66B]' : 'text-stone-700'
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 border-t border-[#E8E0D2] flex justify-between items-center text-xs">
              <button
                onClick={() => {
                  onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="text-stone-500 hover:text-stone-900 font-mono underline"
              >
                Owner / Darkroom Admin Login
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
