import React, { useState, useEffect } from 'react';
import { OrderRecord } from '../types';
import { Search, Package, CheckCircle2, Clock, Truck, ShieldCheck, MapPin, Printer } from 'lucide-react';

interface TrackOrderViewProps {
  initialOrderNumber?: string;
  initialPhone?: string;
}

export const TrackOrderView: React.FC<TrackOrderViewProps> = ({
  initialOrderNumber = '',
  initialPhone = '',
}) => {
  const [orderNumber, setOrderNumber] = useState<string>(initialOrderNumber || 'LUM-84920');
  const [phone, setPhone] = useState<string>(initialPhone || '9876543210');
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const fetchTrackOrder = async (ordNum: string, ph: string) => {
    if (!ordNum || !ph) {
      setError('Please provide both Order Number and Phone Number.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(ordNum)}&phone=${encodeURIComponent(ph)}`);
      const data = await res.json();
      if (res.ok && data.order) {
        setOrder(data.order);
      } else {
        setError(data.error || 'No matching order found.');
        setOrder(null);
      }
    } catch (e) {
      setError('Network error contacting tracking service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber && initialPhone) {
      fetchTrackOrder(initialOrderNumber, initialPhone);
    }
  }, [initialOrderNumber, initialPhone]);

  const stepsList = [
    { title: 'Order Placed', desc: 'Secure payment confirmed via Razorpay' },
    { title: 'Photos Verified', desc: 'Resolution & color profiles calibrated' },
    { title: 'Printing', desc: '350 GSM archival emulsion printing' },
    { title: 'Packed', desc: 'Parchment wrapping & keepsake box seal' },
    { title: 'Shipped', desc: 'Dispatched via express air courier' },
    { title: 'Delivered', desc: 'Received at customer address' },
  ];

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Order Placed': return 0;
      case 'Photos Verified': return 1;
      case 'Printing': return 2;
      case 'Packed': return 3;
      case 'Shipped': return 4;
      case 'Delivered': return 5;
      default: return 1;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.status) : 0;

  return (
    <div className="py-12 sm:py-20 bg-[#FAF6EF] min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10 space-y-3">
          <div className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold">
            Real-Time Logistics
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif-display text-[#1A1A1A]">
            Track Your Custom Polaroid Order
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm font-light">
            Monitor each artisanal phase from darkroom calibration to express doorstep courier delivery.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-6 rounded-sm border border-[#E8E0D2] shadow-sm mb-10">
          <form
            onSubmit={e => {
              e.preventDefault();
              fetchTrackOrder(orderNumber, phone);
            }}
            className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end"
          >
            <div className="sm:col-span-5 text-left">
              <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                Order Number
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                placeholder="e.g. LUM-84920"
                className="w-full bg-stone-50 border border-stone-300 px-3.5 py-2.5 rounded-sm text-xs font-mono focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-4 text-left">
              <label className="block text-xs font-mono uppercase text-stone-600 mb-1">
                Customer Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className="w-full bg-stone-50 border border-stone-300 px-3.5 py-2.5 rounded-sm text-xs font-mono focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] py-2.5 px-4 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Searching...' : 'Track'}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Hint */}
          <div className="mt-3 text-[11px] font-mono text-stone-500 text-left">
            Try demo order: <span className="font-semibold text-stone-800">LUM-84920</span> with phone <span className="font-semibold text-stone-800">9876543210</span>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono rounded-sm text-left">
              {error}
            </div>
          )}
        </div>

        {/* Order Details Display if found */}
        {order && (
          <div className="bg-white border border-[#E8E0D2] rounded-sm p-6 sm:p-8 space-y-8 text-left shadow-sm">
            
            {/* Top Bar with Status Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E8E0D2]">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
                  Tracking ID: {order.orderNumber}
                </span>
                <h2 className="text-2xl font-serif-display text-[#1A1A1A] mt-0.5">
                  Status: {order.status}
                </h2>
                <div className="text-xs text-stone-500 font-mono mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-[#1A1A1A] text-[#C9A66B] rounded-xs font-mono text-xs font-semibold uppercase">
                  {order.paymentStatus === 'paid' ? 'Payment Verified' : order.paymentStatus}
                </span>
                {order.estimatedDelivery && (
                  <div className="text-xs font-mono text-stone-600 mt-1">
                    Est. Arrival: {new Date(order.estimatedDelivery).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </div>
                )}
              </div>
            </div>

            {/* Step-by-Step Progress Bar */}
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">
                Progress Timeline
              </span>

              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {stepsList.map((st, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div
                      key={st.title}
                      className={`p-3 rounded-sm border transition-all ${
                        isCurrent
                          ? 'border-[#C9A66B] bg-amber-50/60 ring-1 ring-[#C9A66B]'
                          : isDone
                          ? 'border-stone-300 bg-stone-50'
                          : 'border-stone-200 bg-white opacity-40'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-mono font-bold ${
                            isDone ? 'bg-[#1A1A1A] text-[#FAF6EF]' : 'bg-stone-300 text-stone-600'
                          }`}
                        >
                          {isDone ? '✓' : idx + 1}
                        </span>
                        <span className="font-semibold text-xs text-stone-900 truncate">
                          {st.title}
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 font-light leading-tight">
                        {st.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Details if Shipped */}
            {order.trackingNumber && (
              <div className="p-4 bg-[#F3ECE0] rounded-sm border border-[#E3D9C9] flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Truck className="w-6 h-6 text-[#C9A66B] shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-stone-900">
                      Dispatched with {order.courierName || 'Express Courier'}
                    </div>
                    <div className="text-xs font-mono text-stone-600">
                      AWB Tracking No: <span className="font-bold text-stone-900">{order.trackingNumber}</span>
                    </div>
                  </div>
                </div>

                <a
                  href={`https://www.delhivery.com/track/package/${order.trackingNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#1A1A1A] text-[#FAF6EF] text-xs font-mono uppercase tracking-wider rounded-sm hover:bg-[#C9A66B] transition-colors whitespace-nowrap"
                >
                  Live Courier Portal →
                </a>
              </div>
            )}

            {/* Itemized Polaroids in this order */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">
                Prints in This Batch ({order.items?.length || 0} items)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-stone-50 border border-stone-200 rounded-sm flex items-center gap-3"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-[1px] border border-stone-300"
                    />
                    <div className="text-xs">
                      <div className="font-semibold text-stone-900">{item.name}</div>
                      <div className="text-stone-500 text-[11px] font-mono">
                        {item.border} · {item.finish} finish
                      </div>
                      {item.caption && (
                        <div className="text-stone-700 italic font-serif text-[11px] truncate max-w-[200px]">
                          “{item.caption}”
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Destination */}
            <div className="pt-4 border-t border-[#E8E0D2] flex flex-col sm:flex-row justify-between text-xs font-mono text-stone-600 gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-bold">Delivery Address</span>
                <div>{order.customer.fullName}</div>
                <div>{order.shippingAddress.street}</div>
                <div>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</div>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[10px] text-stone-400 uppercase font-bold">Order Total</span>
                <div className="text-base font-bold text-[#1A1A1A]">₹{order.total}</div>
                <div className="text-stone-400 text-[10px]">Tax Invoice Included</div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
