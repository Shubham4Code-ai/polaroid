export type PolaroidSize = 'classic' | 'mini' | 'square' | 'wide';
export type BorderColor = 'white' | 'noir' | 'cream' | 'sage' | 'rose';
export type PaperFinish = 'matte' | 'glossy';
export type CaptionFont = 'caveat' | 'homemade' | 'sans' | 'serif';
export type PhotoFilter = 'original' | 'bw' | 'sepia' | 'vintage' | 'faded';

export interface PolaroidPhoto {
  id: string;
  file?: File;
  previewUrl: string;
  name: string;
  width?: number;
  height?: number;
  isLowRes?: boolean;
  size: PolaroidSize;
  border: BorderColor;
  finish: PaperFinish;
  caption: string;
  captionFont: CaptionFont;
  showDateStamp: boolean;
  dateStampText?: string;
  backsideMessage?: string;
  roundedCorners: boolean;
  quantity: number;
  adjustments: {
    zoom: number; // 1 to 2.5
    panX: number; // -50 to 50
    panY: number; // -50 to 50
    rotation: number; // 0, 90, 180, 270
    brightness: number; // 50 to 150
    contrast: number; // 50 to 150
    filter: PhotoFilter;
  };
}

export interface AddOnItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  selected?: boolean;
}

export interface CartItem {
  id: string;
  photo: PolaroidPhoto;
  unitPrice: number;
  quantity: number;
  subtotal: number;
}

export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
}

export interface GiftDetails {
  isGift: boolean;
  recipientName: string;
  giftNote: string;
  giftWrap: boolean;
  hidePrice: boolean;
}

export interface OrderRecord {
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
  };
  isGift: boolean;
  giftNote?: string;
  giftWrap?: boolean;
  hidePrice?: boolean;
  recipientName?: string;
  items: Array<{
    id: string;
    name: string;
    size: string;
    border: string;
    finish: string;
    caption?: string;
    font?: string;
    quantity: number;
    unitPrice: number;
    imageUrl: string;
  }>;
  addOns: Array<{ id: string; name: string; price: number }>;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: string;
}
