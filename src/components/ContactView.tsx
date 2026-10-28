import React, { useState } from 'react';
import { Mail, MessageCircle, MapPin, Phone, Instagram, Send, CheckCircle2 } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [type, setType] = useState('Wedding / Event Bulk Order');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 sm:py-20 bg-[#FAF6EF]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 text-left space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold">
            Boutique Concierge
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-display text-[#1A1A1A]">
            Connect With Our Darkroom
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            We are here for wedding commissions, corporate gifting, high-volume orders, and technical print questions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-sm border border-[#E8E0D2] shadow-sm">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif-display text-xl text-[#1A1A1A]">Send a Direct Studio Inquiry</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Priya Sen"
                      className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-xs text-xs focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="priya@example.com"
                      className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-xs text-xs focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">Phone / WhatsApp</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-xs text-xs focus:outline-hidden font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">Inquiry Purpose</label>
                    <select
                      value={type}
                      onChange={e => setType(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-xs text-xs focus:outline-hidden font-mono"
                    >
                      <option value="Wedding / Event Bulk Order">Wedding / Event Bulk Order</option>
                      <option value="Corporate Monogram Gifting">Corporate Monogram Gifting</option>
                      <option value="Photo Resolution Calibration">Photo Resolution Calibration</option>
                      <option value="Order Tracking & Logistics">Order Tracking & Logistics</option>
                      <option value="Press & Collaborative Feature">Press & Collaborative Feature</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase text-stone-600 mb-1">Your Message or Event Date</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us about your event, quantity, desired paper finishes or timeline..."
                    className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-xs text-xs focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message to Concierge</span>
                </button>
              </form>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-12 h-12 bg-[#1A1A1A] text-[#C9A66B] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="font-serif-display text-2xl text-[#1A1A1A]">Inquiry Received</h3>
                <p className="text-xs text-stone-600 font-light max-w-md mx-auto">
                  Thank you, {name}. Our darkroom concierge will review your requirements and respond via email/WhatsApp within 4 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-mono text-[#C9A66B] hover:text-[#1A1A1A] underline"
                >
                  Send another inquiry
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Direct Channels & Studio Studio Location (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Quick Connect Card */}
            <div className="bg-[#1A1A1A] text-[#FAF6EF] p-6 rounded-sm border border-[#C9A66B]/30 space-y-4">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#C9A66B] font-semibold">
                Instant Response
              </span>
              <h3 className="font-serif-display text-xl text-white">
                Live WhatsApp Darkroom Help
              </h3>
              <p className="text-xs text-stone-300 font-light leading-relaxed">
                Send your photo directly on WhatsApp to have a lab technician verify print resolution before placing an order.
              </p>
              <a
                href="https://wa.me/919820045678"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1EBE5B] text-white px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+91 98200 45678)</span>
              </a>
            </div>

            {/* Studio Address & Hours */}
            <div className="bg-white p-6 rounded-sm border border-[#E8E0D2] space-y-4 text-xs font-mono">
              <span className="text-[10px] text-stone-400 uppercase font-bold">Studio Darkroom Headquarters</span>
              
              <div className="flex items-start gap-3 text-stone-700">
                <MapPin className="w-4 h-4 text-[#C9A66B] shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-stone-900">Lumière Atelier Private Limited</div>
                  <div>402, Heritage Print House, Waterfield Road</div>
                  <div>Bandra West, Mumbai, Maharashtra 400050, India</div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-stone-700">
                <Mail className="w-4 h-4 text-[#C9A66B] shrink-0" />
                <div>concierge@lumiereatelier.com</div>
              </div>

              <div className="flex items-center gap-3 text-stone-700">
                <Instagram className="w-4 h-4 text-[#C9A66B] shrink-0" />
                <div>@lumiere.atelier.prints</div>
              </div>

              <div className="pt-2 border-t border-stone-100 text-stone-500 text-[11px]">
                Darkroom Working Hours: Monday – Saturday, 9:30 AM to 7:00 PM IST
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
