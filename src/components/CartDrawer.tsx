import React, { useState } from 'react';
import { PolaroidPhoto, AddOnItem, CustomerDetails, GiftDetails, OrderRecord } from '../types';
import { ADD_ONS_CATALOG } from '../data/mockData';
import {
  X,
  Trash2,
  Gift,
  Tag,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Printer,
  ChevronRight,
  CreditCard,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  photos: PolaroidPhoto[];
  onUpdatePhotos: (photos: PolaroidPhoto[]) => void;
  onOrderSuccess: (order: OrderRecord) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  photos,
  onUpdatePhotos,
  onOrderSuccess,
}) => {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; desc: string } | null>(null);
  const [couponError, setCouponError] = useState<string>('');
  
  // Pincode state
  const [pincode, setPincode] = useState<string>('400050');
  const [pincodeResult, setPincodeResult] = useState<{
    city: string;
    state: string;
    days: string;
    fee: number;
  } | null>({
    city: 'Mumbai',
    state: 'Maharashtra',
    days: '2-3 Business Days',
    fee: 0,
  });
  const [pincodeChecking, setPincodeChecking] = useState<boolean>(false);

  // Gift options
  const [isGift, setIsGift] = useState<boolean>(false);
  const [giftNote, setGiftNote] = useState<string>('');
  const [giftWrap, setGiftWrap] = useState<boolean>(true);
  const [hidePrice, setHidePrice] = useState<boolean>(true);
  const [recipientName, setRecipientName] = useState<string>('');

  // Customer & Delivery Details
  const [step, setStep] = useState<'bag' | 'shipping' | 'payment'>('bag');
  const [customer, setCustomer] = useState<CustomerDetails>({
    fullName: 'Ananya Sharma',
    email: 'ananya.sharma@example.com',
    phone: '9820045678',
    street: 'Flat 402, Sea Green Apartments, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
  });

  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string>('');

  if (!isOpen) return null;

  // Price calculations
  const sizePrices = { mini: 29, classic: 39, square: 39, wide: 49 };
  const totalPrints = photos.reduce((acc, p) => acc + (p.quantity || 1), 0);
  const printsSubtotal = photos.reduce((acc, p) => acc + (sizePrices[p.size] || 39) * (p.quantity || 1), 0);

  // Bulk discount
  let volumeDiscountPct = 0;
  if (totalPrints >= 100) volumeDiscountPct = 40;
  else if (totalPrints >= 50) volumeDiscountPct = 30;
  else if (totalPrints >= 20) volumeDiscountPct = 20;
  else if (totalPrints >= 10) volumeDiscountPct = 15;

  const volumeDiscountAmount = Math.round((printsSubtotal * volumeDiscountPct) / 100);

  // Add-ons total
  const addOnsTotal = selectedAddOns.reduce((sum, id) => {
    const item = ADD_ONS_CATALOG.find(a => a.id === id);
    return sum + (item ? item.price : 0);
  }, 0);

  // Gift wrap charge
  const giftWrapTotal = isGift && giftWrap ? 99 : 0;

  const grossTotal = printsSubtotal - volumeDiscountAmount + addOnsTotal + giftWrapTotal;

  // Coupon discount
  const couponDiscountAmount = appliedDiscount ? appliedDiscount.amount : 0;

  // Shipping fee (Free if grossTotal >= 799 or coupon FREESHIP)
  const isFreeShipping = grossTotal >= 799 || appliedDiscount?.code === 'FREESHIP';
  const shippingFee = isFreeShipping ? 0 : (pincodeResult ? pincodeResult.fee : 79);

  const finalOrderTotal = Math.max(0, grossTotal - couponDiscountAmount + shippingFee);

  // Toggle add-on
  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Check pincode serviceability
  const handleCheckPincode = async () => {
    if (!pincode || pincode.length !== 6) {
      alert('Please enter a 6-digit postal code');
      return;
    }
    setPincodeChecking(true);
    try {
      const res = await fetch('/api/pincode/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode }),
      });
      const data = await res.json();
      if (res.ok) {
        setPincodeResult({
          city: data.city,
          state: data.state,
          days: data.estimatedDeliveryDays,
          fee: grossTotal >= 799 ? 0 : data.shippingFee,
        });
        setCustomer(prev => ({ ...prev, pincode, city: data.city, state: data.state }));
      }
    } catch (e) {
      console.warn('Pincode check failed', e);
    } finally {
      setPincodeChecking(false);
    }
  };

  // Validate coupon
  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal: grossTotal }),
      });
      const data = await res.json();
      if (res.ok && data.valid) {
        setAppliedDiscount({
          code: data.code,
          amount: data.discountAmount,
          desc: data.description,
        });
        setCouponError('');
      } else {
        setCouponError(data.error || 'Invalid code.');
      }
    } catch (e) {
      setCouponError('Network error checking coupon.');
    }
  };

  // Execute Razorpay Checkout
  const handleInitiateRazorpay = async () => {
    setIsProcessingPayment(true);
    setPaymentError('');

    try {
      // 1. Request backend to create Razorpay Order
      const chosenAddOns = ADD_ONS_CATALOG.filter(a => selectedAddOns.includes(a.id));
      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalOrderTotal,
          items: photos.map(p => ({
            id: p.id,
            name: `${p.size.toUpperCase()} Polaroid Print`,
            size: p.size,
            border: p.border,
            finish: p.finish,
            caption: p.caption,
            font: p.captionFont,
            quantity: p.quantity || 1,
            unitPrice: sizePrices[p.size] || 39,
            imageUrl: p.previewUrl,
          })),
          customer,
          shippingAddress: {
            street: customer.street,
            city: customer.city,
            state: customer.state,
            pincode: customer.pincode,
          },
          isGift,
          giftNote,
          giftWrap,
          hidePrice,
          recipientName: isGift ? recipientName : customer.fullName,
          addOns: chosenAddOns,
          discount: volumeDiscountAmount + couponDiscountAmount,
          couponCode: appliedDiscount?.code,
          shippingFee,
        }),
      });

      const orderData = await res.json();

      if (!res.ok) {
        throw new Error(orderData.error || 'Failed to initialize payment.');
      }

      // Check if window.Razorpay SDK is available
      if (typeof (window as any).Razorpay !== 'undefined') {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency || 'INR',
          name: 'Lumière Atelier',
          description: `Custom Polaroid Prints (${totalPrints} prints)`,
          order_id: orderData.razorpayOrderId.startsWith('order_') ? orderData.razorpayOrderId : undefined,
          prefill: {
            name: customer.fullName,
            email: customer.email,
            contact: customer.phone,
          },
          theme: {
            color: '#1A1A1A',
          },
          handler: async (response: any) => {
            // Verify payment on backend
            await verifyPaymentAndComplete(response, orderData);
          },
          modal: {
            ondismiss: () => {
              setIsProcessingPayment(false);
            },
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', (resp: any) => {
          setPaymentError(resp.error?.description || 'Payment was declined. Please try another card or UPI.');
          setIsProcessingPayment(false);
        });
        rzp.open();
      } else {
        // Fallback simulation in sandbox if Razorpay script is blocked or offline
        await simulateSuccessfulPayment(orderData);
      }
    } catch (err: any) {
      console.error('Razorpay init error:', err);
      setPaymentError(err.message || 'Payment initiation failed.');
      setIsProcessingPayment(false);
    }
  };

  // Backend payment signature verification
  const verifyPaymentAndComplete = async (rzpResponse: any, orderData: any) => {
    try {
      const verifyRes = await fetch('/api/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: rzpResponse.razorpay_order_id || orderData.razorpayOrderId,
          razorpay_payment_id: rzpResponse.razorpay_payment_id || `pay_mock_${Date.now()}`,
          razorpay_signature: rzpResponse.razorpay_signature,
          orderNumber: orderData.orderNumber,
        }),
      });

      const verifyData = await verifyRes.json();

      if (verifyRes.ok && verifyData.success) {
        completeOrderSuccess(orderData.orderNumber, rzpResponse.razorpay_payment_id);
      } else {
        throw new Error(verifyData.error || 'Payment verification failed.');
      }
    } catch (err: any) {
      setPaymentError(err.message || 'Payment verification failed.');
      setIsProcessingPayment(false);
    }
  };

  // Instant sandbox fallback
  const simulateSuccessfulPayment = async (orderData: any) => {
    const mockPaymentId = `pay_sandbox_${Date.now()}`;
    await fetch('/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        razorpay_order_id: orderData.razorpayOrderId,
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: 'sandbox_verified_signature',
        orderNumber: orderData.orderNumber,
      }),
    });
    completeOrderSuccess(orderData.orderNumber, mockPaymentId);
  };

  const completeOrderSuccess = (orderNumber: string, paymentId: string) => {
    setIsProcessingPayment(false);
    
    // Confetti explosion
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C9A66B', '#1A1A1A', '#FAF6EF', '#D4AF37'],
      });
    } catch (e) {
      // ignore
    }

    const orderRecord: OrderRecord = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'Photos Verified',
      paymentStatus: 'paid',
      razorpayPaymentId: paymentId,
      customer,
      shippingAddress: {
        street: customer.street,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
      },
      isGift,
      giftNote,
      giftWrap,
      hidePrice,
      recipientName: isGift ? recipientName : customer.fullName,
      items: photos.map(p => ({
        id: p.id,
        name: `${p.size.toUpperCase()} Polaroid Print`,
        size: p.size,
        border: p.border,
        finish: p.finish,
        caption: p.caption,
        font: p.captionFont,
        quantity: p.quantity || 1,
        unitPrice: sizePrices[p.size] || 39,
        imageUrl: p.previewUrl,
      })),
      addOns: ADD_ONS_CATALOG.filter(a => selectedAddOns.includes(a.id)),
      subtotal: printsSubtotal,
      discount: volumeDiscountAmount + couponDiscountAmount,
      couponCode: appliedDiscount?.code,
      shippingFee,
      tax: Math.round(finalOrderTotal * 0.18),
      total: finalOrderTotal,
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
    };

    onOrderSuccess(orderRecord);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#FAF6EF] shadow-2xl flex flex-col border-l border-[#E8E0D2]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8E0D2] flex items-center justify-between bg-[#FAF6EF]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C9A66B]" />
              <h2 className="font-serif-display text-xl text-[#1A1A1A]">
                {step === 'bag' && `Your Memory Bag (${totalPrints} Prints)`}
                {step === 'shipping' && 'Delivery Address & Gift Options'}
                {step === 'payment' && 'Review & Razorpay Checkout'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-500 hover:text-stone-900 rounded-sm hover:bg-stone-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper tabs */}
          <div className="flex border-b border-[#E8E0D2] text-[11px] font-mono uppercase tracking-wider bg-[#F7F3EB]">
            <button
              onClick={() => setStep('bag')}
              className={`flex-1 py-2.5 text-center transition-colors ${
                step === 'bag' ? 'border-b-2 border-[#1A1A1A] font-bold text-[#1A1A1A]' : 'text-stone-500'
              }`}
            >
              1. Prints & Add-ons
            </button>
            <button
              onClick={() => setStep('shipping')}
              className={`flex-1 py-2.5 text-center transition-colors ${
                step === 'shipping' ? 'border-b-2 border-[#1A1A1A] font-bold text-[#1A1A1A]' : 'text-stone-500'
              }`}
            >
              2. Shipping & Gift
            </button>
            <button
              onClick={() => setStep('payment')}
              className={`flex-1 py-2.5 text-center transition-colors ${
                step === 'payment' ? 'border-b-2 border-[#1A1A1A] font-bold text-[#1A1A1A]' : 'text-stone-500'
              }`}
            >
              3. Payment
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* STEP 1: BAG ITEMS & ADD-ONS */}
            {step === 'bag' && (
              <div className="space-y-6">
                
                {/* Volume discount banner */}
                <div className="bg-[#F3ECE0] p-3 rounded-sm border border-[#E3D9C9] flex items-center justify-between text-xs font-mono">
                  <span className="text-stone-800 font-medium">
                    {volumeDiscountPct > 0
                      ? `Volume Tier Applied: ${volumeDiscountPct}% Discount`
                      : 'Add 10+ prints to unlock 15% bulk discount'}
                  </span>
                  {volumeDiscountAmount > 0 && (
                    <span className="text-emerald-700 font-bold">-₹{volumeDiscountAmount}</span>
                  )}
                </div>

                {/* Photos List */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase text-stone-500">
                    Uploaded Polaroids ({photos.length} photos)
                  </span>

                  {photos.map((photo, idx) => (
                    <div
                      key={photo.id}
                      className="p-3 bg-white border border-[#E8E0D2] rounded-sm flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={photo.previewUrl}
                          alt="Thumbnail"
                          className="w-12 h-14 object-cover rounded-[1px] border border-stone-200"
                        />
                        <div>
                          <div className="text-xs font-semibold text-stone-900 capitalize">
                            {photo.size} Polaroid · {photo.border} Border
                          </div>
                          <div className="text-[11px] text-stone-500 font-light truncate max-w-[200px]">
                            {photo.caption || 'No caption'} · {photo.finish} finish
                          </div>
                          <div className="text-xs font-mono text-stone-800 mt-0.5">
                            ₹{sizePrices[photo.size] || 39} × {photo.quantity || 1} prints
                          </div>
                        </div>
                      </div>

                      {/* Quantity stepper */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            const updated = [...photos];
                            updated[idx].quantity = Math.max(1, (updated[idx].quantity || 1) - 1);
                            onUpdatePhotos(updated);
                          }}
                          className="w-6 h-6 flex items-center justify-center border border-stone-300 rounded-sm hover:bg-stone-100 text-xs"
                        >
                          -
                        </button>
                        <span className="font-mono text-xs font-semibold w-4 text-center">
                          {photo.quantity || 1}
                        </span>
                        <button
                          onClick={() => {
                            const updated = [...photos];
                            updated[idx].quantity = (updated[idx].quantity || 1) + 1;
                            onUpdatePhotos(updated);
                          }}
                          className="w-6 h-6 flex items-center justify-center border border-stone-300 rounded-sm hover:bg-stone-100 text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add-ons Section */}
                <div className="pt-4 border-t border-[#E8E0D2] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-stone-600 font-semibold">
                      Curated Keepsake Add-ons
                    </span>
                    <span className="text-[11px] font-mono text-[#C9A66B]">Boutique Extras</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {ADD_ONS_CATALOG.map(addon => {
                      const isChecked = selectedAddOns.includes(addon.id);
                      return (
                        <div
                          key={addon.id}
                          onClick={() => toggleAddOn(addon.id)}
                          className={`p-3 border rounded-sm flex items-center justify-between gap-3 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-amber-50/50 border-[#C9A66B] ring-1 ring-[#C9A66B]'
                              : 'bg-white border-[#E8E0D2] hover:border-stone-400'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {}}
                              className="w-4 h-4 accent-[#1A1A1A]"
                            />
                            <div>
                              <div className="text-xs font-semibold text-stone-900">{addon.name}</div>
                              <div className="text-[11px] text-stone-500 font-light leading-tight">
                                {addon.description}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs font-mono font-bold text-stone-800 shrink-0">
                            +₹{addon.price}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Promo Coupon Bar */}
                <div className="pt-4 border-t border-[#E8E0D2] space-y-2">
                  <label className="block text-xs font-mono uppercase text-stone-600">
                    Promo / Gift Voucher Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="e.g. FIRST10, MEMORIES50"
                      className="flex-1 bg-white border border-[#E8E0D2] px-3 py-2 rounded-sm text-xs font-mono uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-4 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-rose-700 text-xs font-mono">{couponError}</p>}
                  {appliedDiscount && (
                    <p className="text-emerald-700 text-xs font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Applied: {appliedDiscount.desc} (-₹{appliedDiscount.amount})
                    </p>
                  )}
                </div>

              </div>
            )}

            {/* STEP 2: SHIPPING ADDRESS & GIFT WRAPPING */}
            {step === 'shipping' && (
              <div className="space-y-6">
                
                {/* Pincode and Courier Estimation */}
                <div className="p-4 bg-[#F3ECE0] rounded-sm border border-[#E3D9C9] space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-stone-800 font-semibold">
                    <Truck className="w-4 h-4 text-[#C9A66B]" />
                    <span>Courier Serviceability & Transit Time</span>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={pincode}
                      onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter 6-digit Pincode"
                      className="flex-1 bg-white border border-[#E8E0D2] px-3 py-2 rounded-sm text-xs font-mono"
                    />
                    <button
                      onClick={handleCheckPincode}
                      disabled={pincodeChecking}
                      className="bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-4 py-2 rounded-sm text-xs font-mono uppercase transition-colors"
                    >
                      {pincodeChecking ? 'Checking...' : 'Check'}
                    </button>
                  </div>

                  {pincodeResult && (
                    <div className="text-xs font-mono text-stone-700 space-y-1 pt-1 border-t border-[#E3D9C9]">
                      <div className="flex justify-between">
                        <span>Destination:</span>
                        <span className="font-semibold">{pincodeResult.city}, {pincodeResult.state}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Estimated Delivery:</span>
                        <span className="text-[#C9A66B] font-bold">{pincodeResult.days}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Courier Fee:</span>
                        <span className="text-emerald-700 font-bold">
                          {isFreeShipping ? 'FREE (Orders > ₹799)' : `₹${shippingFee}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Recipient Contact & Address Fields */}
                <div className="space-y-3 text-left">
                  <span className="text-xs font-mono uppercase text-stone-600 font-semibold">
                    Customer & Delivery Address
                  </span>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={customer.fullName}
                      onChange={e => setCustomer({ ...customer, fullName: e.target.value })}
                      className="w-full bg-white border border-[#E8E0D2] px-3 py-2 text-xs rounded-sm focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-stone-500 mb-1">Phone (for courier SMS)</label>
                      <input
                        type="tel"
                        value={customer.phone}
                        onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full bg-white border border-[#E8E0D2] px-3 py-2 text-xs rounded-sm focus:outline-hidden font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-stone-500 mb-1">Email (for invoice)</label>
                      <input
                        type="email"
                        value={customer.email}
                        onChange={e => setCustomer({ ...customer, email: e.target.value })}
                        className="w-full bg-white border border-[#E8E0D2] px-3 py-2 text-xs rounded-sm focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase text-stone-500 mb-1">Street Address & Apartment</label>
                    <input
                      type="text"
                      value={customer.street}
                      onChange={e => setCustomer({ ...customer, street: e.target.value })}
                      className="w-full bg-white border border-[#E8E0D2] px-3 py-2 text-xs rounded-sm focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-stone-500 mb-1">City</label>
                      <input
                        type="text"
                        value={customer.city}
                        onChange={e => setCustomer({ ...customer, city: e.target.value })}
                        className="w-full bg-white border border-[#E8E0D2] px-3 py-2 text-xs rounded-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-stone-500 mb-1">State</label>
                      <input
                        type="text"
                        value={customer.state}
                        onChange={e => setCustomer({ ...customer, state: e.target.value })}
                        className="w-full bg-white border border-[#E8E0D2] px-3 py-2 text-xs rounded-sm font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono uppercase text-stone-500 mb-1">Pincode</label>
                      <input
                        type="text"
                        value={customer.pincode}
                        onChange={e => setCustomer({ ...customer, pincode: e.target.value })}
                        className="w-full bg-white border border-[#E8E0D2] px-3 py-2 text-xs rounded-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Gifting Options */}
                <div className="p-4 bg-white border border-[#E8E0D2] rounded-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gift className="w-4 h-4 text-[#C9A66B]" />
                      <span className="text-xs font-semibold text-stone-900">
                        Is this a surprise gift for someone?
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={e => setIsGift(e.target.checked)}
                      className="w-4 h-4 accent-[#1A1A1A] cursor-pointer"
                    />
                  </div>

                  {isGift && (
                    <div className="space-y-3 pt-3 border-t border-stone-200 text-xs">
                      <div>
                        <label className="block text-[11px] font-mono text-stone-500 mb-1">
                          Recipient's Name
                        </label>
                        <input
                          type="text"
                          value={recipientName}
                          onChange={e => setRecipientName(e.target.value)}
                          placeholder="e.g. Priyanshu & Tanvi"
                          className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xs"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-stone-500 mb-1">
                          Handwritten Calligraphy Gift Card Message (Complimentary)
                        </label>
                        <textarea
                          rows={2}
                          value={giftNote}
                          onChange={e => setGiftNote(e.target.value)}
                          placeholder="e.g. Wishing you both a lifetime of uncontainable adventures and memories!"
                          className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xs"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Luxury Wax-Sealed Gift Wrap (+₹99)</span>
                        <input
                          type="checkbox"
                          checked={giftWrap}
                          onChange={e => setGiftWrap(e.target.checked)}
                          className="w-4 h-4 accent-[#1A1A1A]"
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span>Hide Prices on Packing Slip</span>
                        <input
                          type="checkbox"
                          checked={hidePrice}
                          onChange={e => setHidePrice(e.target.checked)}
                          className="w-4 h-4 accent-[#1A1A1A]"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* STEP 3: PAYMENT REVIEW & RAZORPAY */}
            {step === 'payment' && (
              <div className="space-y-6">
                
                {/* Summary Card */}
                <div className="p-4 bg-white border border-[#E8E0D2] rounded-sm space-y-2 text-xs font-mono">
                  <div className="text-stone-500 uppercase font-bold text-[10px] pb-1 border-b border-stone-200">
                    Order Price Breakdown (INR)
                  </div>
                  <div className="flex justify-between">
                    <span>{totalPrints} Polaroid Prints:</span>
                    <span>₹{printsSubtotal}</span>
                  </div>
                  {volumeDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Volume Pack Discount ({volumeDiscountPct}%):</span>
                      <span>-₹{volumeDiscountAmount}</span>
                    </div>
                  )}
                  {addOnsTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Keepsake Add-ons ({selectedAddOns.length}):</span>
                      <span>+₹{addOnsTotal}</span>
                    </div>
                  )}
                  {giftWrapTotal > 0 && (
                    <div className="flex justify-between">
                      <span>Wax-Sealed Luxury Gift Wrap:</span>
                      <span>+₹{giftWrapTotal}</span>
                    </div>
                  )}
                  {couponDiscountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Coupon Discount ({appliedDiscount?.code}):</span>
                      <span>-₹{couponDiscountAmount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Express Tracked Shipping:</span>
                    <span className="text-emerald-700 font-bold">
                      {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
                    </span>
                  </div>
                  <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-sm text-[#1A1A1A]">
                    <span>Total Payable:</span>
                    <span>₹{finalOrderTotal}</span>
                  </div>
                  <div className="text-[10px] text-stone-400">
                    Includes 18% GST · Tax invoice auto-generated upon payment
                  </div>
                </div>

                {/* Razorpay Trust Information */}
                <div className="p-4 bg-[#F3ECE0] rounded-sm border border-[#E3D9C9] space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-[#C9A66B]" />
                    <span className="text-xs font-semibold text-[#1A1A1A]">
                      Razorpay Standard 256-bit SSL Checkout
                    </span>
                  </div>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    Razorpay supports instant payments via <strong>UPI (Google Pay, PhonePe, Paytm, BHIM)</strong>, 
                    all Credit/Debit cards (Visa, Mastercard, RuPay, Amex), Netbanking (50+ banks), and Cardless EMI.
                  </p>

                  <div className="flex items-center gap-2 pt-2 text-[11px] font-mono text-stone-500">
                    <CreditCard className="w-4 h-4 text-[#C9A66B]" />
                    <span>Instant payment signature verification via HMAC SHA256</span>
                  </div>
                </div>

                {paymentError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono rounded-sm">
                    {paymentError}
                  </div>
                )}

              </div>
            )}

          </div>

          {/* Footer Bar */}
          <div className="p-5 border-t border-[#E8E0D2] bg-[#FAF6EF] flex items-center justify-between gap-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-stone-500">
                Total Amount
              </div>
              <div className="font-mono text-xl font-bold text-[#1A1A1A]">
                ₹{finalOrderTotal}
              </div>
            </div>

            {step === 'bag' && (
              <button
                onClick={() => setStep('shipping')}
                className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-6 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>Continue to Shipping</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            {step === 'shipping' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('bag')}
                  className="px-4 py-3 border border-stone-300 rounded-sm text-xs font-medium text-stone-700 hover:bg-stone-100"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('payment')}
                  className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-6 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <span>Review & Pay</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="flex gap-2">
                <button
                  onClick={() => setStep('shipping')}
                  disabled={isProcessingPayment}
                  className="px-4 py-3 border border-stone-300 rounded-sm text-xs font-medium text-stone-700 hover:bg-stone-100"
                >
                  Back
                </button>
                <button
                  onClick={handleInitiateRazorpay}
                  disabled={isProcessingPayment}
                  className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-6 py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <span>Opening Razorpay...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-[#C9A66B]" />
                      <span>Pay with Razorpay (₹{finalOrderTotal})</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
