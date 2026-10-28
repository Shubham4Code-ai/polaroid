import React, { useState } from 'react';
import { FAQS } from '../data/mockData';
import { ChevronDown, ChevronUp, Shield, Truck, RotateCcw, FileText } from 'lucide-react';

interface PoliciesViewProps {
  initialPolicy?: 'shipping' | 'refund' | 'terms' | 'privacy' | 'faq';
}

export const PoliciesView: React.FC<PoliciesViewProps> = ({ initialPolicy = 'shipping' }) => {
  const [activeTab, setActiveTab] = useState<'shipping' | 'refund' | 'terms' | 'privacy' | 'faq'>(initialPolicy);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  return (
    <div className="py-12 sm:py-20 bg-[#FAF6EF]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 text-left space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold">
            Merchant Governance & Razorpay Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-display text-[#1A1A1A]">
            Policies & Client Assurances
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Transparent terms for payment processing, express courier transit, reprints, and strict photo privacy.
          </p>
        </div>

        {/* Policy Tab Nav */}
        <div className="flex border-b border-[#E8E0D2] overflow-x-auto text-xs font-mono uppercase tracking-wider">
          {[
            { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
            { id: 'refund', label: 'Refunds & Returns', icon: RotateCcw },
            { id: 'privacy', label: 'Photo Privacy Policy', icon: Shield },
            { id: 'terms', label: 'Terms & Conditions', icon: FileText },
            { id: 'faq', label: 'FAQ', icon: FileText },
          ].map(t => {
            const Icon = t.icon;
            const isActive = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-[#1A1A1A] font-bold text-[#1A1A1A]'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#C9A66B]" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* CONTENT */}
        <div className="bg-white border border-[#E8E0D2] rounded-sm p-6 sm:p-10 text-stone-700 space-y-6 leading-relaxed text-sm">
          
          {/* TAB 1: SHIPPING & DELIVERY */}
          {activeTab === 'shipping' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif-display text-[#1A1A1A]">
                Shipping & Delivery Policy
              </h2>
              <p>
                At Lumière Atelier, each order is custom-printed to order in our darkroom facility. We partner with premier air courier services including Delhivery Express, BlueDart, and DTDC to guarantee rapid, pristine doorstep delivery.
              </p>
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-stone-900 font-serif">1. Processing & Darkroom Turnaround</h3>
                <p className="text-xs text-stone-600">
                  Orders placed before 2:00 PM IST enter print calibration the same day. Average lab turnaround is 24 to 48 hours for standard orders.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-stone-900 font-serif">2. Estimated Transit Times</h3>
                <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
                  <li><strong>Tier 1 Metro Hubs (Mumbai, Delhi NCR, Bengaluru, Pune, Hyderabad, Chennai):</strong> 2–3 Business Days.</li>
                  <li><strong>Rest of India:</strong> 3–5 Business Days.</li>
                  <li><strong>Remote / Special Postal Zones:</strong> 5–7 Business Days.</li>
                </ul>
              </div>
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-stone-900 font-serif">3. Shipping Fees</h3>
                <p className="text-xs text-stone-600">
                  Complimentary Free Express Shipping is provided automatically on all orders with cart value of <strong>₹799 or more</strong>. For orders under ₹799, a flat subsidized shipping fee of ₹49 to ₹79 is applied at checkout depending on zone.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: REFUNDS & RETURNS */}
          {activeTab === 'refund' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif-display text-[#1A1A1A]">
                Cancellation & Refund Policy
              </h2>
              <p>
                Because our polaroid prints are customized with individual personal photographs and handwritten typography, standard returns are not possible once printing has commenced. However, we maintain an unconditional <strong>100% Quality Assurance Guarantee</strong>.
              </p>
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-stone-900 font-serif">1. Damaged or Defective Prints</h3>
                <p className="text-xs text-stone-600">
                  If your package arrives damaged during courier transit, or if there is a laboratory printing defect (ink streaks, color banding, paper bends), please email us at <strong>concierge@lumiereatelier.com</strong> or message our WhatsApp concierge within 48 hours with a photograph of the damage. We will immediately reprint and dispatch a brand-new batch free of charge.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-stone-900 font-serif">2. Refund Processing via Razorpay</h3>
                <p className="text-xs text-stone-600">
                  In eligible cases where a monetary refund is authorized, refunds are processed directly back to the original source method (UPI account, Credit/Debit card, or Netbanking) via the Razorpay Refund API. Refunds typically credit within 5 to 7 business days per banking protocol.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-stone-900 font-serif">3. Order Cancellations</h3>
                <p className="text-xs text-stone-600">
                  Cancellations are accepted within <strong>2 hours</strong> of placing an order before the image calibration files are sent to the master printer.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: PRIVACY POLICY */}
          {activeTab === 'privacy' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif-display text-[#1A1A1A]">
                Customer Photo Privacy & Security Policy
              </h2>
              <p>
                We treat your memories with absolute reverence and confidential integrity.
              </p>
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-stone-900 font-serif">1. Strict No-Sharing Policy</h3>
                <p className="text-xs text-stone-600">
                  Your uploaded photos are strictly confidential. We NEVER publish, share, or display customer photos on our social media, website, or marketing channels without explicit written permission from the client.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-stone-900 font-serif">2. Automated 30-Day Purge</h3>
                <p className="text-xs text-stone-600">
                  To ensure complete digital security, all high-resolution source photos stored in our darkroom system are automatically and permanently deleted 30 days after your order is confirmed delivered.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-stone-900 font-serif">3. Payment & Data Security</h3>
                <p className="text-xs text-stone-600">
                  We never store card numbers, CVVs, or bank account credentials. All financial transactions are securely tokenized through Razorpay’s PCI-DSS Level 1 compliant infrastructure with 256-bit encryption.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: TERMS & CONDITIONS */}
          {activeTab === 'terms' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif-display text-[#1A1A1A]">
                Terms & Conditions of Service
              </h2>
              <p className="text-xs text-stone-600">
                By uploading images and placing an order on Lumière Atelier, you confirm that you hold the lawful copyright or permission to reproduce the submitted photographs.
              </p>
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-stone-900 font-serif">1. Content Guidelines</h3>
                <p className="text-xs text-stone-600">
                  We reserve the right to decline printing any imagery containing unlawful, obscene, defamatory, or abusive material. In such rare instances, the order will be cancelled and refunded immediately.
                </p>
              </div>
              <div className="space-y-2 pt-2">
                <h3 className="font-semibold text-stone-900 font-serif">2. GST & Invoicing</h3>
                <p className="text-xs text-stone-600">
                  All listed prices on the website are inclusive of applicable Goods and Services Tax (GST 18%). A valid digital tax invoice is generated automatically upon payment completion.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: FAQ */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-serif-display text-[#1A1A1A]">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3 pt-2">
                {FAQS.map((faq, idx) => (
                  <div
                    key={idx}
                    className="border border-[#E8E0D2] rounded-sm overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                      className="w-full p-4 text-left font-serif-display text-base text-stone-900 flex items-center justify-between bg-stone-50 hover:bg-stone-100 transition-colors"
                    >
                      <span>{faq.question}</span>
                      {expandedFaq === idx ? (
                        <ChevronUp className="w-4 h-4 text-[#C9A66B] shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-500 shrink-0" />
                      )}
                    </button>
                    {expandedFaq === idx && (
                      <div className="p-4 bg-white text-xs sm:text-sm text-stone-600 font-light leading-relaxed border-t border-[#E8E0D2]">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
