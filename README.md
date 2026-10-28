# Lumière Atelier — Luxury Custom Polaroid Prints & E-Commerce

A luxurious, ultra-premium, fully functional e-commerce platform for an artisanal custom Polaroid printing studio. Built with React 19, TypeScript, Express, Tailwind CSS, and Razorpay standard checkout.

---

## Key Features

### 1. Brand & Aesthetic Direction
- **Warm Editorial Color Palette**: Warm cream/ivory (`#FAF6EF`), deep charcoal (`#1A1A1A`), soft gold accents (`#C9A66B`), and muted linen textures.
- **Bespoke Typography**: Editorial serif (`Playfair Display` & `Cormorant Garamond`), refined sans (`Plus Jakarta Sans`), and authentic handwritten script (`Caveat` & `Homemade Apple`) for realistic Polaroid captions.
- **Physical Memory Presence**: Interactive `<PolaroidFrame>` with subtle tilt ($-4^\circ$ to $+4^\circ$), lifelike paper borders, glossy/matte finishes, and micro-elevation shadows.

### 2. Core Feature: Live Darkroom Polaroid Creator
- **Multi-Photo Upload**: Drag & drop or batch select JPEG, PNG, WEBP, and HEIC files with upload progress indicator.
- **Photo Quality Guard**: Automatic resolution check alerting users if an image is under 800px for print sharpness.
- **Real-Time Live Editing**:
  - **4 Iconic Formats**: Classic Polaroid ($88 \times 107\,\text{mm}$), Mini Instax ($54 \times 86\,\text{mm}$), Square ($88 \times 88\,\text{mm}$), and Cinematic Wide ($108 \times 86\,\text{mm}$).
  - **5 Border Tones**: Vintage White, Velvet Noir, Warm Cream, Pastel Sage, and Rose Dust.
  - **Coating & Chemistry**: Silk Matte (anti-fingerprint archival cotton rag) or High Gloss Crystal.
  - **Darkroom Adjustments**: Zoom/crop slider ($1\times$ to $2.5\times$), 90° rotation, brightness & contrast sliders, and analog filters (*Original, Noir B&W, Sepia, Kodak ‘74, 90s Film*).
  - **Handwritten Captions**: 4 font styles (*Caveat, Cursive Quill, Editorial Serif, Modern Sans*) with 45-character limit.
  - **Vintage Orange Date Stamp**: Authentic 1990s LED date imprint.
  - **Backside Inscriptions**: Archival message printing on the reverse.
  - **Batch Operations**: "Sync Format & Border to All Photos" button for quick multi-print configuration.
- **Auto-Save Draft**: Never lose ongoing work across browser refreshes via `localStorage`.
- **Dynamic Bulk Volume Pricing**: Automatic progressive tier discounts (10+ prints: 15% off, 20+ prints: 20% off, 50+ prints: 30% off, 100+ prints: 40% off).

### 3. Shopping Bag & Checkout
- **Itemized Cart Drawer**: Preview each Polaroid's custom format, border, finish, and caption with quantity controls.
- **Curated Keepsake Add-ons**:
  - Natural Beechwood Display Stands (+₹149)
  - Warm Fairy String Lights & 20 Wooden Clips (+₹249)
  - Handcrafted Oatmeal Linen Keepsake Box (+₹299)
  - Magnetic Acrylic Polaroid Sleeves (+₹199)
  - Vintage Leatherette Memory Album (+₹499)
- **Gifting Suite**: Luxury wax-sealed gift wrapping (+₹99), handwritten calligraphy gift card (complimentary), and price suppression for packing slips.
- **Pincode Logistics Checker**: Real-time delivery timeline calculation across India (e.g. 2–3 business days) with free express shipping on orders over ₹799.
- **Promo Code Engine**: Supports `FIRST10` (10% off), `MEMORIES50` (₹50 flat savings), `FREESHIP` (Free shipping), and `LUMIERE20` (20% off luxury orders).

### 4. Razorpay Payment Gateway Integration
- **Server-Side Order Creation**: `/api/create-order` creates official Razorpay orders with receipt identifiers.
- **Frontend Standard Modal**: Opens the Razorpay Checkout popup supporting:
  - **UPI** (Google Pay, PhonePe, Paytm, BHIM)
  - **Credit & Debit Cards** (Visa, Mastercard, RuPay, Amex)
  - **Netbanking** (50+ Indian banks)
  - **Cardless EMI & Wallets**
- **Cryptographic Signature Verification**: `/api/verify-payment` verifies the HMAC SHA256 payment signature on the server with `RAZORPAY_KEY_SECRET`.
- **Webhook Endpoint**: `/api/webhook` handles `payment.captured` and `payment.failed` events.
- **Sandbox Fallback Mode**: Graceful simulated test checkout for zero-friction evaluation when merchant keys are in test mode.

### 5. Darkroom Operations & Admin Portal
- **Protected Access**: Master PIN gate (default: `1234`).
- **Live Sales & Print Analytics**: Total revenue, paid orders, total photos printed, and active queue counts.
- **Order Inspection & Batch Export**:
  - View high-resolution photos uploaded by customers.
  - Single-click "Download File" and "Print Sheet Layout" for laboratory printing.
  - Status progression: *Order Placed → Photos Verified → Printing → Packed → Shipped → Delivered*.
  - AWB tracking number & courier partner assignment.
  - Instant Razorpay refund initiation.

### 6. Full Policy Suite (Mandatory for Razorpay Approval)
- Shipping & Delivery Policy
- Cancellation & Refund Policy
- Customer Photo Privacy & Security (Automated 30-day file purge)
- Terms & Conditions of Service
- Frequently Asked Questions (FAQ)

---

## Razorpay Configuration Guide

To enable live payments:
1. Log in to your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Navigate to **Settings** → **API Keys** → **Generate Key**.
3. Copy your `Key ID` and `Key Secret`.
4. Create or edit your `.env` file:
   ```env
   RAZORPAY_KEY_ID="rzp_test_YourKeyHere"
   RAZORPAY_KEY_SECRET="YourSecretHere"
   RAZORPAY_WEBHOOK_SECRET="YourWebhookSecretHere"
   RAZORPAY_TEST_MODE="false"
   ```
5. Set up your Webhook in Razorpay under **Settings** → **Webhooks** pointing to `https://your-domain.com/api/webhook` subscribing to `payment.captured` and `payment.failed`.
