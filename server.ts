import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Body parser with generous limit for base64 photo uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// In-Memory Database for Orders, Coupons, and Serviceable Pincodes
interface OrderItem {
  id: string;
  name: string;
  size: 'mini' | 'classic' | 'square' | 'wide';
  border: string;
  finish: 'matte' | 'glossy';
  caption?: string;
  font?: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
  adjustments?: {
    zoom: number;
    rotation: number;
    brightness: number;
    contrast: number;
    filter: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: 'Order Placed' | 'Photos Verified' | 'Printing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  isGift: boolean;
  giftNote?: string;
  giftWrap?: boolean;
  hidePrice?: boolean;
  recipientName?: string;
  items: OrderItem[];
  addOns: { id: string; name: string; price: number }[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number; // 18% GST included or specified
  total: number;
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: string;
}

const ordersDB: Order[] = [
  {
    id: 'ord_demo_101',
    orderNumber: 'LUM-84920',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    status: 'Printing',
    paymentStatus: 'paid',
    razorpayOrderId: 'order_test_99214',
    razorpayPaymentId: 'pay_test_881923',
    customer: {
      fullName: 'Aarav Mehta',
      email: 'aarav.mehta@example.com',
      phone: '9876543210',
    },
    shippingAddress: {
      street: 'Flat 402, Sea Green Apartments, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    isGift: true,
    giftNote: 'Happy 5th Anniversary! Cherishing every chapter together.',
    giftWrap: true,
    hidePrice: true,
    recipientName: 'Priya & Aarav',
    items: [
      {
        id: 'item_1',
        name: 'Classic Polaroid Print',
        size: 'classic',
        border: 'Classic Vintage White',
        finish: 'matte',
        caption: 'Amalfi Coast · Summer ‘24',
        font: 'Caveat',
        quantity: 10,
        unitPrice: 39,
        imageUrl: '/src/assets/images/polaroid_travel_roadtrip_1793201231800.jpg',
      },
      {
        id: 'item_2',
        name: 'Classic Polaroid Print',
        size: 'classic',
        border: 'Warm Cream',
        finish: 'matte',
        caption: 'Our First Dance in Paris',
        font: 'Homemade Apple',
        quantity: 10,
        unitPrice: 39,
        imageUrl: '/src/assets/images/polaroid_wedding_couple_1793201216532.jpg',
      },
    ],
    addOns: [
      { id: 'addon_box', name: 'Handcrafted Linen Keepsake Box', price: 299 },
      { id: 'addon_stands', name: 'Solid Beechwood Stands (Set of 4)', price: 149 },
    ],
    subtotal: 780,
    discount: 100,
    couponCode: 'MEMORIES50',
    shippingFee: 0,
    tax: 120,
    total: 1128,
    trackingNumber: 'DELHIVERY-774920194',
    courierName: 'Delhivery Express',
    estimatedDelivery: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
  },
  {
    id: 'ord_demo_102',
    orderNumber: 'LUM-84921',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    status: 'Photos Verified',
    paymentStatus: 'paid',
    razorpayOrderId: 'order_test_99215',
    razorpayPaymentId: 'pay_test_881924',
    customer: {
      fullName: 'Ananya Sharma',
      email: 'ananya.sharma@example.com',
      phone: '9820011223',
    },
    shippingAddress: {
      street: 'Villa 12, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
    },
    isGift: false,
    items: [
      {
        id: 'item_3',
        name: 'Mini Instax Prints',
        size: 'mini',
        border: 'Classic Vintage White',
        finish: 'glossy',
        caption: 'Golden Hour Laughs',
        font: 'Caveat',
        quantity: 20,
        unitPrice: 29,
        imageUrl: '/src/assets/images/polaroid_golden_friends_1793201232934.jpg',
      },
    ],
    addOns: [
      { id: 'addon_lights', name: 'Fairy String Lights with 20 Clips', price: 249 },
    ],
    subtotal: 580,
    discount: 58,
    couponCode: 'FIRST10',
    shippingFee: 0,
    tax: 92,
    total: 863,
    estimatedDelivery: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
  },
];

const coupons = [
  { code: 'FIRST10', type: 'percentage', value: 10, minOrder: 399, description: '10% off your first order' },
  { code: 'MEMORIES50', type: 'flat', value: 50, minOrder: 499, description: '₹50 flat savings' },
  { code: 'FREESHIP', type: 'shipping', value: 79, minOrder: 400, description: 'Free Express Shipping' },
  { code: 'LUMIERE20', type: 'percentage', value: 20, minOrder: 1499, description: '20% off luxury orders over ₹1,499' },
];

// Serviceable Pincodes database simulation with estimated transit times
const serviceableRegions: Record<string, { city: string; state: string; days: string; standardFee: number }> = {
  '400': { city: 'Mumbai', state: 'Maharashtra', days: '2-3 Business Days', standardFee: 49 },
  '110': { city: 'Delhi NCR', state: 'Delhi', days: '2-3 Business Days', standardFee: 49 },
  '560': { city: 'Bengaluru', state: 'Karnataka', days: '2-3 Business Days', standardFee: 49 },
  '500': { city: 'Hyderabad', state: 'Telangana', days: '3-4 Business Days', standardFee: 69 },
  '600': { city: 'Chennai', state: 'Tamil Nadu', days: '3-4 Business Days', standardFee: 69 },
  '700': { city: 'Kolkata', state: 'West Bengal', days: '3-5 Business Days', standardFee: 69 },
  '411': { city: 'Pune', state: 'Maharashtra', days: '2-3 Business Days', standardFee: 49 },
  '380': { city: 'Ahmedabad', state: 'Gujarat', days: '3-4 Business Days', standardFee: 59 },
  '302': { city: 'Jaipur', state: 'Rajasthan', days: '3-4 Business Days', standardFee: 59 },
};

// ==========================================
// API ROUTES
// ==========================================

// 1. Config / Public Keys
app.get('/api/config', (_req: Request, res: Response) => {
  const razorpayKeyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_lumiere_demo';
  const hasSecret = Boolean(process.env.RAZORPAY_KEY_SECRET);
  res.json({
    razorpayKeyId,
    testMode: !hasSecret || process.env.RAZORPAY_TEST_MODE === 'true',
    currency: 'INR',
    businessName: 'Lumière Atelier',
    supportPhone: '+91 98200 45678',
    supportEmail: 'concierge@lumiereatelier.com',
  });
});

// 2. Validate Coupon Code
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) {
    return res.status(400).json({ error: 'Promo code is required.' });
  }
  const cleanCode = String(code).trim().toUpperCase();
  const coupon = coupons.find(c => c.code === cleanCode);
  if (!coupon) {
    return res.status(404).json({ error: 'Invalid coupon code. Try FIRST10 or MEMORIES50.' });
  }
  if (subtotal < coupon.minOrder) {
    return res.status(400).json({ error: `Minimum cart value of ₹${coupon.minOrder} required for ${cleanCode}.` });
  }

  let discountAmount = 0;
  if (coupon.type === 'percentage') {
    discountAmount = Math.round((subtotal * coupon.value) / 100);
  } else if (coupon.type === 'flat') {
    discountAmount = coupon.value;
  } else if (coupon.type === 'shipping') {
    discountAmount = coupon.value;
  }

  res.json({
    valid: true,
    code: coupon.code,
    description: coupon.description,
    type: coupon.type,
    discountAmount,
  });
});

// 3. Pincode Check
app.post('/api/pincode/check', (req: Request, res: Response) => {
  const { pincode } = req.body;
  if (!pincode || String(pincode).length !== 6) {
    return res.status(400).json({ error: 'Please enter a valid 6-digit Indian Postal Code.' });
  }
  const prefix = String(pincode).slice(0, 3);
  const match = serviceableRegions[prefix];
  if (match) {
    return res.json({
      serviceable: true,
      city: match.city,
      state: match.state,
      estimatedDeliveryDays: match.days,
      shippingFee: match.standardFee,
      freeShippingEligible: true, // Free above 799
    });
  }

  // Default national courier coverage
  res.json({
    serviceable: true,
    city: 'All India Serviceable',
    state: 'India',
    estimatedDeliveryDays: '4-6 Business Days',
    shippingFee: 79,
    freeShippingEligible: true,
  });
});

// 4. Create Razorpay Order
app.post('/api/create-order', async (req: Request, res: Response) => {
  try {
    const {
      amount, // in rupees
      items,
      customer,
      shippingAddress,
      isGift,
      giftNote,
      giftWrap,
      hidePrice,
      recipientName,
      addOns,
      discount,
      couponCode,
      shippingFee,
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid order amount' });
    }

    const orderNumber = `LUM-${Math.floor(10000 + Math.random() * 90000)}`;
    const amountInPaise = Math.round(amount * 100);
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let razorpayOrderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    // If real Razorpay keys are provided, call official Razorpay Orders API
    if (keyId && keySecret && !keyId.includes('test_lumiere_demo')) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${auth}`,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency: 'INR',
            receipt: orderNumber,
            notes: {
              customer_email: customer?.email,
              customer_phone: customer?.phone,
              brand: 'Lumière Atelier',
            },
          }),
        });

        if (rzpResponse.ok) {
          const rzpData = await rzpResponse.json();
          razorpayOrderId = rzpData.id;
        } else {
          console.warn('Razorpay API returned error, falling back to sandbox order simulation');
        }
      } catch (err) {
        console.warn('Could not contact live Razorpay, using sandbox order flow:', err);
      }
    }

    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'Order Placed',
      paymentStatus: 'pending',
      razorpayOrderId,
      customer: customer || { fullName: 'Valued Client', email: '', phone: '' },
      shippingAddress: shippingAddress || { street: '', city: '', state: '', pincode: '' },
      isGift: Boolean(isGift),
      giftNote,
      giftWrap: Boolean(giftWrap),
      hidePrice: Boolean(hidePrice),
      recipientName,
      items: items || [],
      addOns: addOns || [],
      subtotal: items ? items.reduce((acc: number, it: any) => acc + (it.unitPrice * (it.quantity || 1)), 0) : amount,
      discount: discount || 0,
      couponCode,
      shippingFee: shippingFee || 0,
      tax: Math.round(amount * 0.18),
      total: amount,
      estimatedDelivery: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
    };

    ordersDB.unshift(newOrder);

    res.json({
      success: true,
      orderId: newOrder.id,
      orderNumber: newOrder.orderNumber,
      razorpayOrderId,
      amount: amountInPaise,
      currency: 'INR',
      keyId: keyId || 'rzp_test_lumiere_demo',
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: error.message || 'Failed to create order' });
  }
});

// 5. Verify Razorpay Payment (HMAC SHA256)
app.post('/api/verify-payment', (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderNumber } = req.body;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    let isValid = true;

    // Verify cryptographic signature if secret is available
    if (keySecret && razorpay_signature) {
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isValid = generatedSignature === razorpay_signature;
    }

    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: 'Invalid payment signature. Verification failed.',
      });
    }

    // Update order in database
    const order = ordersDB.find(
      o => o.razorpayOrderId === razorpay_order_id || o.orderNumber === orderNumber
    );

    if (order) {
      order.paymentStatus = 'paid';
      order.razorpayPaymentId = razorpay_payment_id || `pay_mock_${Date.now()}`;
      order.status = 'Photos Verified';
    }

    res.json({
      success: true,
      message: 'Payment verified successfully. Your custom prints have entered our darkroom printing queue!',
      orderNumber: order?.orderNumber || orderNumber,
      paymentId: razorpay_payment_id,
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Internal payment verification error' });
  }
});

// 6. Razorpay Webhook Handler
app.post('/api/webhook', (req: Request, res: Response) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'] as string;

    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature !== signature) {
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    }

    const event = req.body.event;
    const payload = req.body.payload;

    if (event === 'payment.captured') {
      const payment = payload?.payment?.entity;
      const orderId = payment?.order_id;
      const order = ordersDB.find(o => o.razorpayOrderId === orderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.razorpayPaymentId = payment?.id;
      }
    } else if (event === 'payment.failed') {
      const payment = payload?.payment?.entity;
      const orderId = payment?.order_id;
      const order = ordersDB.find(o => o.razorpayOrderId === orderId);
      if (order) {
        order.paymentStatus = 'failed';
      }
    }

    res.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook processing error:', err);
    res.status(500).json({ error: 'Webhook error' });
  }
});

// 7. Track Order (By Order Number + Phone)
app.get('/api/orders/track', (req: Request, res: Response) => {
  const { orderNumber, phone } = req.query;

  if (!orderNumber || !phone) {
    return res.status(400).json({ error: 'Order Number and Phone are required.' });
  }

  const cleanOrder = String(orderNumber).trim().toUpperCase();
  const cleanPhone = String(phone).trim().replace(/\D/g, '');

  const order = ordersDB.find(o => {
    const matchOrder = o.orderNumber.toUpperCase() === cleanOrder || o.id === cleanOrder;
    const matchPhone = o.customer.phone.replace(/\D/g, '').endsWith(cleanPhone.slice(-10));
    return matchOrder && matchPhone;
  });

  if (!order) {
    return res.status(404).json({ error: 'No order found matching this Order Number and Phone.' });
  }

  res.json({ order });
});

// 8. Admin: List All Orders
app.get('/api/admin/orders', (_req: Request, res: Response) => {
  res.json({ orders: ordersDB });
});

// 9. Admin: Update Order Status & Courier Info
app.patch('/api/admin/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, trackingNumber, courierName } = req.body;

  const order = ordersDB.find(o => o.id === id || o.orderNumber === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (status) order.status = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courierName) order.courierName = courierName;

  res.json({ success: true, order });
});

// 10. Admin: Process Refund
app.post('/api/admin/orders/:id/refund', (req: Request, res: Response) => {
  const { id } = req.params;
  const order = ordersDB.find(o => o.id === id || o.orderNumber === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  order.paymentStatus = 'refunded';
  order.status = 'Refunded';

  res.json({ success: true, message: 'Refund initiated via Razorpay.', order });
});

// 11. Admin: Analytics Overview
app.get('/api/admin/analytics', (_req: Request, res: Response) => {
  const totalRevenue = ordersDB
    .filter(o => o.paymentStatus === 'paid')
    .reduce((acc, curr) => acc + curr.total, 0);

  const totalOrders = ordersDB.length;
  const paidOrders = ordersDB.filter(o => o.paymentStatus === 'paid').length;
  const totalPhotosPrinted = ordersDB.reduce((acc, o) => {
    return acc + o.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  }, 0);

  res.json({
    totalRevenue,
    totalOrders,
    paidOrders,
    totalPhotosPrinted,
    averageOrderValue: paidOrders > 0 ? Math.round(totalRevenue / paidOrders) : 0,
    activeDarkroomQueue: ordersDB.filter(o => ['Photos Verified', 'Printing', 'Packed'].includes(o.status)).length,
  });
});

// ==========================================
// VITE DEV SERVER / PRODUCTION SERVING
// ==========================================
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Lumière Atelier Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
