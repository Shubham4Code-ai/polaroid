import React from 'react';
import { OrderRecord } from '../types';
import { CheckCircle2, ShieldCheck, Printer, ArrowRight, Share2, MessageCircle } from 'lucide-react';

interface OrderSuccessModalProps {
  order: OrderRecord | null;
  onClose: () => void;
  onTrackOrder: (orderNumber: string, phone: string) => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  onClose,
  onTrackOrder,
}) => {
  if (!order) return null;

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleWhatsAppAlert = () => {
    const text = encodeURIComponent(
      `Hello Lumière Atelier Concierge! I just placed order #${order.orderNumber}. Looking forward to the prints!`
    );
    window.open(`https://wa.me/919820045678?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#1A1A1A]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#FAF6EF] border border-[#E8E0D2] shadow-2xl rounded-sm max-w-xl w-full p-6 sm:p-8 space-y-6 text-left relative">
        
        {/* Success Header */}
        <div className="text-center space-y-2 pb-4 border-b border-[#E8E0D2]">
          <div className="w-14 h-14 bg-[#1A1A1A] text-[#C9A66B] rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <CheckCircle2 className="w-8 h-8 stroke-[1.8]" />
          </div>
          <div className="text-xs font-mono uppercase tracking-widest text-[#C9A66B] font-bold">
            Payment Confirmed · Razorpay Verified
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif-display text-[#1A1A1A]">
            Your Memories Are in the Darkroom!
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 font-light">
            Order Reference: <span className="font-mono font-bold text-[#1A1A1A]">{order.orderNumber}</span>
          </p>
        </div>

        {/* Status Tracker Graphic */}
        <div className="p-4 bg-white border border-[#E8E0D2] rounded-sm space-y-3">
          <div className="text-[11px] font-mono uppercase text-stone-500 font-semibold">
            Order Lifecycle Progress
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <div className="flex flex-col items-center text-center">
              <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-[#FAF6EF] flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
              <span className="text-[10px] mt-1 text-stone-800 font-semibold">Placed</span>
            </div>
            <div className="flex-1 h-[2px] bg-[#C9A66B]" />
            <div className="flex flex-col items-center text-center">
              <span className="w-6 h-6 rounded-full bg-[#C9A66B] text-[#FAF6EF] flex items-center justify-center text-[10px] font-bold">
                ✓
              </span>
              <span className="text-[10px] mt-1 text-stone-800 font-semibold">Verified</span>
            </div>
            <div className="flex-1 h-[2px] bg-stone-300" />
            <div className="flex flex-col items-center text-center">
              <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-[10px]">
                3
              </span>
              <span className="text-[10px] mt-1 text-stone-500">Printing</span>
            </div>
            <div className="flex-1 h-[2px] bg-stone-300" />
            <div className="flex flex-col items-center text-center">
              <span className="w-6 h-6 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center text-[10px]">
                4
              </span>
              <span className="text-[10px] mt-1 text-stone-500">Shipped</span>
            </div>
          </div>
        </div>

        {/* Invoice Summary */}
        <div className="p-4 bg-[#F3ECE0] rounded-sm border border-[#E3D9C9] space-y-2 text-xs font-mono">
          <div className="flex justify-between text-stone-800 font-semibold pb-1 border-b border-[#E3D9C9]">
            <span>Receipt Details</span>
            <span>GST-Compliant (18% Included)</span>
          </div>
          <div className="flex justify-between">
            <span>Customer:</span>
            <span>{order.customer.fullName} ({order.customer.phone})</span>
          </div>
          <div className="flex justify-between">
            <span>Destination:</span>
            <span>{order.shippingAddress.city}, {order.shippingAddress.pincode}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment ID:</span>
            <span className="truncate max-w-[200px]">{order.razorpayPaymentId || 'pay_demo_success'}</span>
          </div>
          <div className="flex justify-between font-bold text-sm text-[#1A1A1A] pt-1 border-t border-[#E3D9C9]">
            <span>Total Paid:</span>
            <span>₹{order.total}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onTrackOrder(order.orderNumber, order.customer.phone)}
              className="flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] py-3 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>Track Live Status</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrintReceipt}
              className="flex items-center justify-center gap-2 border border-stone-400 hover:border-[#1A1A1A] text-stone-800 py-3 rounded-sm text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>
          </div>

          <button
            onClick={handleWhatsAppAlert}
            className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5B] text-white py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Connect on WhatsApp for Dispatch Alerts</span>
          </button>

          <button
            onClick={onClose}
            className="w-full text-center text-xs text-stone-500 hover:text-stone-900 pt-1 underline font-mono"
          >
            Return to Studio Home
          </button>
        </div>

      </div>
    </div>
  );
};
