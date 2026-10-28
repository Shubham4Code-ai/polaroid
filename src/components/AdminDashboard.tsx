import React, { useState, useEffect } from 'react';
import { OrderRecord } from '../types';
import {
  ShieldCheck,
  Package,
  TrendingUp,
  Clock,
  Printer,
  Search,
  Filter,
  CheckCircle2,
  Download,
  RotateCcw,
  ExternalLink,
  Lock,
  LogOut,
  ChevronRight,
  Eye,
  X,
} from 'lucide-react';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pin, setPin] = useState<string>('1234');
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<string>('');

  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [analytics, setAnalytics] = useState<any>({
    totalRevenue: 0,
    totalOrders: 0,
    paidOrders: 0,
    totalPhotosPrinted: 0,
    averageOrderValue: 0,
    activeDarkroomQueue: 0,
  });
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);

  // Status edit form
  const [newStatus, setNewStatus] = useState<string>('');
  const [newTrackingNo, setNewTrackingNo] = useState<string>('');
  const [newCourier, setNewCourier] = useState<string>('Delhivery Express');

  // Load orders & analytics from server
  const loadAdminData = async () => {
    try {
      const [ordRes, anaRes] = await Promise.all([
        fetch('/api/admin/orders'),
        fetch('/api/admin/analytics'),
      ]);
      if (ordRes.ok) {
        const data = await ordRes.json();
        setOrders(data.orders || []);
      }
      if (anaRes.ok) {
        const aData = await anaRes.json();
        setAnalytics(aData);
      }
    } catch (e) {
      console.warn('Error loading admin data', e);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === pin || pinInput === '1234' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Incorrect security PIN. Default is 1234.');
    }
  };

  // Update status handler
  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus || selectedOrder.status,
          trackingNumber: newTrackingNo,
          courierName: newCourier,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data.order);
        loadAdminData();
        alert('Order status & courier tracking updated successfully!');
      }
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Process refund
  const handleProcessRefund = async () => {
    if (!selectedOrder) return;
    if (!confirm(`Are you sure you want to process a full refund of ₹${selectedOrder.total} via Razorpay?`)) return;

    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/refund`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(data.order);
        loadAdminData();
        alert('Refund processed via Razorpay successfully.');
      }
    } catch (e) {
      alert('Refund failed');
    }
  };

  // Filtered orders list
  const filteredOrders = orders.filter(o => {
    const matchesStatus = statusFilter === 'all' || o.status.toLowerCase() === statusFilter.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(query) ||
      o.customer.fullName.toLowerCase().includes(query) ||
      o.customer.phone.includes(query);
    return matchesStatus && matchesSearch;
  });

  // Login Gate
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-[#1A1A1A]/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-[#FAF6EF] border border-[#E8E0D2] p-8 max-w-sm w-full rounded-sm text-center space-y-6 shadow-2xl relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-stone-500 hover:text-stone-900"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 bg-[#1A1A1A] text-[#C9A66B] rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 stroke-[1.8]" />
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#C9A66B] font-bold">
              Darkroom Management
            </div>
            <h2 className="text-2xl font-serif-display text-[#1A1A1A] mt-1">
              Studio Owner Portal
            </h2>
            <p className="text-xs text-stone-500 font-light mt-1">
              Enter master PIN to manage print queue, Razorpay orders & batches. (Default PIN: 1234)
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              maxLength={8}
              autoFocus
              value={pinInput}
              onChange={e => setPinInput(e.target.value)}
              placeholder="Enter PIN (1234)"
              className="w-full text-center text-xl tracking-widest font-mono bg-white border border-[#E8E0D2] py-2.5 rounded-sm focus:outline-hidden focus:border-[#1A1A1A]"
            />
            {pinError && <p className="text-xs font-mono text-rose-700">{pinError}</p>}

            <button
              type="submit"
              className="w-full py-3 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] text-xs font-semibold uppercase tracking-wider rounded-sm transition-colors cursor-pointer"
            >
              Authenticate & Open Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#FAF6EF] overflow-y-auto">
      {/* Top Admin Bar */}
      <div className="bg-[#1A1A1A] text-[#FAF6EF] px-6 py-4 flex items-center justify-between border-b border-[#C9A66B]/30 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <span className="font-serif-display text-lg tracking-wide text-white">
            Lumière Atelier · Darkroom Operations
          </span>
          <span className="bg-[#C9A66B]/20 text-[#C9A66B] text-[10px] font-mono uppercase px-2 py-0.5 rounded-xs border border-[#C9A66B]/40">
            Admin Live
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => loadAdminData()}
            className="text-stone-300 hover:text-white underline cursor-pointer"
          >
            Refresh Data
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 px-3 py-1.5 rounded-sm transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Exit Dashboard</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-8 text-left">
        
        {/* KPI Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 border border-[#E8E0D2] rounded-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold">Total Revenue (INR)</span>
            <div className="text-2xl font-mono font-bold text-[#1A1A1A] tabular-nums">
              ₹{analytics.totalRevenue}
            </div>
            <div className="text-[11px] text-emerald-700 font-mono">
              {analytics.paidOrders} Settled Orders via Razorpay
            </div>
          </div>

          <div className="bg-white p-5 border border-[#E8E0D2] rounded-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold">Prints In Darkroom</span>
            <div className="text-2xl font-mono font-bold text-[#C9A66B] tabular-nums">
              {analytics.totalPhotosPrinted}
            </div>
            <div className="text-[11px] text-stone-500 font-mono">
              350 GSM Cotton Rag calibrated
            </div>
          </div>

          <div className="bg-white p-5 border border-[#E8E0D2] rounded-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold">Active Print Queue</span>
            <div className="text-2xl font-mono font-bold text-amber-700 tabular-nums">
              {analytics.activeDarkroomQueue}
            </div>
            <div className="text-[11px] text-stone-500 font-mono">
              Needs master calibration
            </div>
          </div>

          <div className="bg-white p-5 border border-[#E8E0D2] rounded-sm space-y-1">
            <span className="text-[10px] font-mono uppercase text-stone-500 font-semibold">Average Order Value</span>
            <div className="text-2xl font-mono font-bold text-[#1A1A1A] tabular-nums">
              ₹{analytics.averageOrderValue}
            </div>
            <div className="text-[11px] text-stone-500 font-mono">
              Boutique keepsake packs
            </div>
          </div>
        </div>

        {/* Orders Management Toolbar */}
        <div className="bg-white p-4 border border-[#E8E0D2] rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs font-mono uppercase">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'photos verified', label: 'Verified' },
              { id: 'printing', label: 'Printing' },
              { id: 'packed', label: 'Packed' },
              { id: 'shipped', label: 'Shipped' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-[#1A1A1A] text-[#FAF6EF]'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search order ID, client or phone..."
              className="w-full bg-stone-50 border border-stone-200 pl-9 pr-3 py-1.5 text-xs font-mono rounded-sm focus:outline-hidden"
            />
          </div>

        </div>

        {/* Orders Table */}
        <div className="bg-white border border-[#E8E0D2] rounded-sm overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#FAF6EF] text-stone-600 uppercase tracking-wider border-b border-[#E8E0D2]">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Prints & Add-ons</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E0D2]">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="p-4 font-bold text-[#1A1A1A]">
                      {order.orderNumber}
                      <div className="text-[10px] text-stone-400 font-normal">
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-stone-900">{order.customer.fullName}</div>
                      <div className="text-stone-500 text-[11px]">{order.customer.phone}</div>
                      <div className="text-stone-400 text-[10px]">{order.shippingAddress.city}</div>
                    </td>
                    <td className="p-4">
                      <div>{order.items?.length || 0} custom items</div>
                      {order.addOns?.length > 0 && (
                        <div className="text-[10px] text-[#C9A66B]">
                          +{order.addOns.length} Keepsake add-ons
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-bold text-stone-900 tabular-nums">
                      ₹{order.total}
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-800 border border-stone-200">
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-block px-2 py-0.5 rounded-xs text-[10px] font-bold uppercase tracking-wider ${
                        order.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedOrder(order);
                          setNewStatus(order.status);
                          setNewTrackingNo(order.trackingNumber || '');
                          setNewCourier(order.courierName || 'Delhivery Express');
                        }}
                        className="px-3 py-1.5 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] rounded-sm text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Inspect & Print Batch
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Order Detail & Batch Export Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF6EF] border border-[#E8E0D2] rounded-sm max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-left shadow-2xl relative">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-stone-500 hover:text-stone-900"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex justify-between items-baseline pb-4 border-b border-[#E8E0D2]">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#C9A66B] font-bold">
                  Darkroom Print Inspection
                </span>
                <h2 className="text-2xl font-serif-display text-[#1A1A1A]">
                  Order {selectedOrder.orderNumber}
                </h2>
              </div>
              <div className="text-right text-xs font-mono">
                <span className="font-bold text-stone-900">Total: ₹{selectedOrder.total}</span>
                <div className="text-stone-500 text-[10px]">
                  Razorpay ID: {selectedOrder.razorpayPaymentId || 'Verified'}
                </div>
              </div>
            </div>

            {/* Customer & Gift Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono bg-white p-4 rounded-sm border border-[#E8E0D2]">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold">Recipient & Shipping</span>
                <div className="font-semibold text-stone-900 mt-1">{selectedOrder.customer.fullName}</div>
                <div className="text-stone-600">{selectedOrder.shippingAddress.street}</div>
                <div className="text-stone-600">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} - {selectedOrder.shippingAddress.pincode}
                </div>
                <div className="text-stone-500 mt-1">Phone: {selectedOrder.customer.phone}</div>
              </div>

              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold">Gift Options</span>
                {selectedOrder.isGift ? (
                  <div className="mt-1 space-y-1">
                    <div className="text-amber-800 font-semibold">Surprise Gift Wrap Active</div>
                    {selectedOrder.giftNote && (
                      <div className="italic text-stone-600 bg-amber-50 p-2 rounded-xs border border-amber-200">
                        “{selectedOrder.giftNote}”
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-stone-500 mt-1">Standard Personal Order</div>
                )}
              </div>
            </div>

            {/* High-Res Photo Grid for Master Darkroom Batch */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">
                  Print-Ready Photo Batch ({selectedOrder.items?.length || 0} prints)
                </span>
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 text-xs font-mono text-[#C9A66B] hover:text-[#1A1A1A] underline"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Sheet Layout</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-white border border-[#E8E0D2] rounded-sm text-center space-y-1.5"
                  >
                    <div className="w-full h-24 overflow-hidden rounded-[1px] bg-stone-900">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[10px] font-mono font-bold text-stone-800 truncate">
                      {item.size.toUpperCase()} · {item.finish}
                    </div>
                    {item.caption && (
                      <div className="text-[9px] font-serif italic text-stone-600 truncate">
                        “{item.caption}”
                      </div>
                    )}
                    <a
                      href={item.imageUrl}
                      download={`polaroid_print_${idx + 1}.jpg`}
                      className="inline-flex items-center gap-1 text-[9px] font-mono text-stone-500 hover:text-stone-900 underline pt-1"
                    >
                      <Download className="w-2.5 h-2.5" />
                      <span>Download File</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Darkroom Status & Courier Management */}
            <div className="p-4 bg-white border border-[#E8E0D2] rounded-sm space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-stone-600 font-semibold">
                Update Darkroom Status & Logistics
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-stone-500 mb-1">Current Status</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-xs font-mono rounded-xs"
                  >
                    <option value="Order Placed">Order Placed</option>
                    <option value="Photos Verified">Photos Verified</option>
                    <option value="Printing">Printing in Darkroom</option>
                    <option value="Packed">Packed in Keepsake Box</option>
                    <option value="Shipped">Shipped with Courier</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-stone-500 mb-1">Courier Partner</label>
                  <input
                    type="text"
                    value={newCourier}
                    onChange={e => setNewCourier(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-xs font-mono rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-stone-500 mb-1">AWB Tracking Number</label>
                  <input
                    type="text"
                    value={newTrackingNo}
                    onChange={e => setNewTrackingNo(e.target.value)}
                    placeholder="e.g. DELHIVERY-774920194"
                    className="w-full bg-stone-50 border border-stone-300 p-2 text-xs font-mono rounded-xs"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={handleProcessRefund}
                  className="text-xs font-mono text-rose-700 hover:text-rose-900 underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Initiate Razorpay Refund</span>
                </button>

                <button
                  onClick={handleUpdateStatus}
                  disabled={updatingStatus}
                  className="bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-5 py-2 rounded-sm text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {updatingStatus ? 'Updating...' : 'Save Status & Notify Client'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
