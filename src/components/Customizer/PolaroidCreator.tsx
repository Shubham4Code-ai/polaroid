import React, { useState, useEffect, useRef } from 'react';
import { PolaroidPhoto, PolaroidSize, BorderColor, PaperFinish, CaptionFont, PhotoFilter } from '../../types';
import { PolaroidFrame } from '../PolaroidFrame';
import { SAMPLE_POLAROIDS } from '../../data/mockData';
import {
  Upload,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Sun,
  Contrast,
  Type,
  Calendar,
  Sparkles,
  Trash2,
  Copy,
  Plus,
  AlertTriangle,
  Check,
  Layers,
  ArrowRight,
  SlidersHorizontal,
  Image as ImageIcon,
  RotateCcw,
} from 'lucide-react';

interface PolaroidCreatorProps {
  onAddToCart: (photos: PolaroidPhoto[]) => void;
  initialPhotoUrl?: string;
  initialCaption?: string;
}

export const PolaroidCreator: React.FC<PolaroidCreatorProps> = ({
  onAddToCart,
  initialPhotoUrl,
  initialCaption,
}) => {
  // Load draft from localStorage if present
  const [photos, setPhotos] = useState<PolaroidPhoto[]>(() => {
    try {
      const saved = localStorage.getItem('lumiere_polaroid_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Could not read draft from localStorage', e);
    }
    return SAMPLE_POLAROIDS;
  });

  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showAppliedToast, setShowAppliedToast] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'format' | 'photo' | 'caption' | 'finish'>('format');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If initialPhotoUrl is provided from Memory Wall or Gallery
  useEffect(() => {
    if (initialPhotoUrl) {
      const newPhoto: PolaroidPhoto = {
        id: `photo_${Date.now()}`,
        name: 'Curated Photo',
        previewUrl: initialPhotoUrl,
        size: 'classic',
        border: 'white',
        finish: 'matte',
        caption: initialCaption || 'Cherished moment',
        captionFont: 'caveat',
        showDateStamp: false,
        roundedCorners: false,
        quantity: 1,
        adjustments: {
          zoom: 1,
          panX: 0,
          panY: 0,
          rotation: 0,
          brightness: 100,
          contrast: 100,
          filter: 'original',
        },
      };
      setPhotos(prev => [newPhoto, ...prev]);
      setActiveIndex(0);
    }
  }, [initialPhotoUrl, initialCaption]);

  // Auto-save draft to localStorage whenever photos change
  useEffect(() => {
    try {
      localStorage.setItem('lumiere_polaroid_draft', JSON.stringify(photos));
    } catch (e) {
      // ignore quota exceeded if huge base64
    }
  }, [photos]);

  const activePhoto = photos[activeIndex] || photos[0];

  // Helper to update current active photo
  const updateActivePhoto = (updater: (prev: PolaroidPhoto) => PolaroidPhoto) => {
    setPhotos(prev => {
      const updated = [...prev];
      if (updated[activeIndex]) {
        updated[activeIndex] = updater(updated[activeIndex]);
      }
      return updated;
    });
  };

  // Handle multi-file upload
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(15);

    const newPhotosToAdd: PolaroidPhoto[] = [];
    let completed = 0;

    Array.from(files).forEach((file, index) => {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/jpg'];
      if (!validTypes.includes(file.type) && !file.name.match(/\.(heic|heif)$/i)) {
        alert(`${file.name} is not an accepted format. Please upload JPG, PNG, WEBP, or HEIC.`);
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        const resultUrl = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const isLowRes = img.width < 800 || img.height < 800;
          newPhotosToAdd.push({
            id: `upload_${Date.now()}_${index}`,
            file,
            previewUrl: resultUrl,
            name: file.name.replace(/\.[^/.]+$/, ''),
            width: img.width,
            height: img.height,
            isLowRes,
            size: 'classic',
            border: 'white',
            finish: 'matte',
            caption: '',
            captionFont: 'caveat',
            showDateStamp: false,
            roundedCorners: false,
            quantity: 1,
            adjustments: {
              zoom: 1,
              panX: 0,
              panY: 0,
              rotation: 0,
              brightness: 100,
              contrast: 100,
              filter: 'original',
            },
          });

          completed += 1;
          setUploadProgress(Math.round((completed / files.length) * 100));

          if (completed === files.length) {
            setPhotos(prev => [...newPhotosToAdd, ...prev]);
            setActiveIndex(0);
            setIsUploading(false);
            setUploadProgress(0);
            triggerToast(`Successfully loaded ${completed} photos into darkroom!`);
          }
        };
        img.src = resultUrl;
      };
      reader.readAsDataURL(file);
    });
  };

  const triggerToast = (msg: string) => {
    setShowAppliedToast(msg);
    setTimeout(() => setShowAppliedToast(null), 3000);
  };

  // Apply current photo's styles to ALL photos in the batch
  const applySettingsToAll = () => {
    if (!activePhoto) return;
    setPhotos(prev =>
      prev.map(p => ({
        ...p,
        size: activePhoto.size,
        border: activePhoto.border,
        finish: activePhoto.finish,
        roundedCorners: activePhoto.roundedCorners,
        captionFont: activePhoto.captionFont,
        adjustments: {
          ...p.adjustments,
          filter: activePhoto.adjustments.filter,
        },
      }))
    );
    triggerToast('Applied format, border & finish styling to all photos!');
  };

  // Duplicate active photo
  const duplicatePhoto = (idx: number) => {
    const target = photos[idx];
    if (!target) return;
    const duplicated: PolaroidPhoto = {
      ...target,
      id: `copy_${Date.now()}`,
      name: `${target.name} (Copy)`,
    };
    setPhotos(prev => [...prev.slice(0, idx + 1), duplicated, ...prev.slice(idx + 1)]);
    setActiveIndex(idx + 1);
  };

  // Delete active photo
  const deletePhoto = (idx: number) => {
    if (photos.length <= 1) {
      alert('You need at least one photo in your workspace.');
      return;
    }
    setPhotos(prev => prev.filter((_, i) => i !== idx));
    setActiveIndex(Math.max(0, idx - 1));
  };

  // Bulk Price Calculator with volume discount tiers
  const sizePrices: Record<PolaroidSize, number> = {
    mini: 29,
    classic: 39,
    square: 39,
    wide: 49,
  };

  const totalPrintsCount = photos.reduce((sum, p) => sum + (p.quantity || 1), 0);
  const rawSubtotal = photos.reduce((sum, p) => sum + (sizePrices[p.size] || 39) * (p.quantity || 1), 0);

  // Discount rule
  let discountPercentage = 0;
  let packTierBadge = 'Standard Batch';
  if (totalPrintsCount >= 100) {
    discountPercentage = 40;
    packTierBadge = '100+ Master Pack (40% OFF)';
  } else if (totalPrintsCount >= 50) {
    discountPercentage = 30;
    packTierBadge = '50+ Keepsake Pack (30% OFF)';
  } else if (totalPrintsCount >= 20) {
    discountPercentage = 20;
    packTierBadge = '20+ Memory Pack (20% OFF)';
  } else if (totalPrintsCount >= 10) {
    discountPercentage = 15;
    packTierBadge = '10+ Starter Pack (15% OFF)';
  }

  const discountAmount = Math.round((rawSubtotal * discountPercentage) / 100);
  const finalCalculatedTotal = rawSubtotal - discountAmount;

  return (
    <div className="py-8 sm:py-12 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Workspace Title & Actions Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-[#E8E0D2]">
          <div>
            <div className="text-xs font-mono tracking-widest uppercase text-[#C9A66B] font-semibold mb-1">
              Live Darkroom Studio
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-display text-[#1A1A1A]">
              Customise Your Archival Polaroids
            </h1>
            <p className="text-stone-600 text-xs sm:text-sm font-light mt-1">
              {photos.length} photos ready · {totalPrintsCount} total prints · Auto-saved draft
            </p>
          </div>

          {/* Quick upload button */}
          <div className="flex items-center gap-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.heic,.heif"
              className="hidden"
              onChange={e => handleFileUpload(e.target.files)}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 bg-[#FAF6EF] hover:bg-stone-200/60 text-[#1A1A1A] border border-[#1A1A1A] px-4 py-2.5 rounded-sm text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#C9A66B]" />
              <span>Upload Photos (JPG/PNG/HEIC)</span>
            </button>

            <button
              onClick={() => onAddToCart(photos)}
              className="flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] px-5 py-2.5 rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors shadow-md cursor-pointer whitespace-nowrap"
            >
              <span>Add All ({totalPrintsCount}) to Bag</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Upload Progress Bar if active */}
        {isUploading && (
          <div className="mt-4 p-4 bg-[#F3ECE0] rounded-sm border border-[#E3D9C9] animate-pulse">
            <div className="flex justify-between text-xs font-mono mb-1 text-stone-700">
              <span>Optimizing & importing photos into darkroom...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full bg-stone-300 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#C9A66B] h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Toast alert */}
        {showAppliedToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1A1A1A] text-[#FAF6EF] px-4 py-3 rounded-sm shadow-2xl border border-[#C9A66B] flex items-center gap-3 text-xs font-mono">
            <Check className="w-4 h-4 text-[#C9A66B]" />
            <span>{showAppliedToast}</span>
          </div>
        )}

        {/* Studio Main Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
          
          {/* Left Column: Polaroid Preview Viewport & Photo Filmstrip (7 cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            
            {/* Live Interactive Canvas */}
            <div className="w-full bg-[#EFE9DD] border border-[#E0D7C6] rounded-sm p-6 sm:p-10 flex flex-col items-center justify-center min-h-[460px] relative film-grain">
              
              {/* Resolution Warning Badge if photo < 800px */}
              {activePhoto?.isLowRes && (
                <div className="absolute top-4 left-4 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-sm text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Photo resolution under 800px. Print may be slightly soft.</span>
                </div>
              )}

              {/* Master Live Polaroid Frame */}
              {activePhoto && (
                <div className="relative">
                  <PolaroidFrame
                    imageUrl={activePhoto.previewUrl}
                    caption={activePhoto.caption}
                    captionFont={activePhoto.captionFont}
                    size={activePhoto.size}
                    border={activePhoto.border}
                    finish={activePhoto.finish}
                    showDateStamp={activePhoto.showDateStamp}
                    dateStampText={activePhoto.dateStampText || 'OCT 26'}
                    roundedCorners={activePhoto.roundedCorners}
                    tiltDegree={0}
                    interactiveLift={false}
                    adjustments={activePhoto.adjustments}
                    className="transform transition-all duration-300"
                  />
                </div>
              )}

              {/* Viewport hint */}
              <div className="mt-6 text-stone-500 text-[11px] font-mono tracking-wider uppercase flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C9A66B]" />
                <span>1:1 Live Darkroom Calibration · 350 GSM Cotton Rag</span>
              </div>
            </div>

            {/* Thumbnail Filmstrip (All Uploaded Photos) */}
            <div className="w-full mt-4 bg-[#FAF6EF] p-4 rounded-sm border border-[#E8E0D2]">
              <div className="flex items-center justify-between mb-3 text-xs font-mono uppercase text-stone-600">
                <span>Select Photo ({activeIndex + 1} of {photos.length})</span>
                <span className="text-[#C9A66B]">{activePhoto?.size.toUpperCase()} FORMAT</span>
              </div>

              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                {photos.map((item, idx) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveIndex(idx)}
                    className={`relative shrink-0 w-16 h-20 bg-white border p-1 rounded-[1px] transition-all cursor-pointer ${
                      activeIndex === idx
                        ? 'border-[#1A1A1A] ring-2 ring-[#C9A66B] scale-105 shadow-md'
                        : 'border-stone-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="w-full h-13 overflow-hidden bg-stone-900">
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-[9px] truncate font-mono text-stone-700 text-center pt-0.5">
                      #{idx + 1}
                    </div>
                  </button>
                ))}

                {/* Add new photo thumbnail trigger */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="shrink-0 w-16 h-20 border-2 border-dashed border-stone-300 hover:border-[#C9A66B] flex flex-col items-center justify-center text-stone-500 hover:text-[#C9A66B] transition-colors p-2 text-center rounded-[1px] cursor-pointer"
                >
                  <Plus className="w-5 h-5 mb-1" />
                  <span className="text-[8px] uppercase tracking-wider font-mono">Upload</span>
                </button>
              </div>

              {/* Photo Actions Bar (Duplicate / Delete / Apply to all) */}
              <div className="mt-3 pt-3 border-t border-[#E8E0D2] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => duplicatePhoto(activeIndex)}
                    className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 px-2.5 py-1.5 border border-stone-300 rounded-sm hover:bg-stone-100 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicate</span>
                  </button>
                  <button
                    onClick={() => deletePhoto(activeIndex)}
                    className="flex items-center gap-1.5 text-rose-700 hover:text-rose-900 px-2.5 py-1.5 border border-rose-200 rounded-sm hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>

                <button
                  onClick={applySettingsToAll}
                  className="flex items-center gap-1.5 bg-[#F3ECE0] text-[#1A1A1A] hover:bg-[#E7DDCC] px-3 py-1.5 rounded-sm font-medium transition-colors"
                >
                  <Layers className="w-3.5 h-3.5 text-[#C9A66B]" />
                  <span>Sync Format & Border to All ({photos.length})</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Customization Controls & Live Price Calculator (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Customizer Subtabs */}
            <div className="flex items-center border-b border-[#E8E0D2] gap-1 text-xs font-semibold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('format')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'format' ? 'border-[#1A1A1A] text-[#1A1A1A]' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                1. Size & Border
              </button>
              <button
                onClick={() => setActiveTab('photo')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'photo' ? 'border-[#1A1A1A] text-[#1A1A1A]' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                2. Crop & Filter
              </button>
              <button
                onClick={() => setActiveTab('caption')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'caption' ? 'border-[#1A1A1A] text-[#1A1A1A]' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                3. Ink Caption
              </button>
              <button
                onClick={() => setActiveTab('finish')}
                className={`py-3 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'finish' ? 'border-[#1A1A1A] text-[#1A1A1A]' : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                4. Paper & Extras
              </button>
            </div>

            {/* TAB 1: Format & Border */}
            {activeTab === 'format' && activePhoto && (
              <div className="space-y-6">
                
                {/* Polaroid Size Selector */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2">
                    Print Size & Aspect Ratio
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'classic', name: 'Classic Polaroid', dim: '88 × 107 mm', price: '₹39' },
                      { id: 'mini', name: 'Mini Instax', dim: '54 × 86 mm', price: '₹29' },
                      { id: 'square', name: 'Square Studio', dim: '88 × 88 mm', price: '₹39' },
                      { id: 'wide', name: 'Cinematic Wide', dim: '108 × 86 mm', price: '₹49' },
                    ].map(sizeOption => (
                      <button
                        key={sizeOption.id}
                        onClick={() => updateActivePhoto(p => ({ ...p, size: sizeOption.id as PolaroidSize }))}
                        className={`p-3 text-left border rounded-sm transition-all cursor-pointer ${
                          activePhoto.size === sizeOption.id
                            ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#FAF6EF] shadow-sm'
                            : 'border-[#E8E0D2] bg-white text-stone-800 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-medium text-xs flex justify-between items-center">
                          <span>{sizeOption.name}</span>
                          <span className="font-mono text-[11px] opacity-80">{sizeOption.price}</span>
                        </div>
                        <div className="text-[10px] opacity-60 font-mono mt-0.5">{sizeOption.dim}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Border Colors */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2">
                    Border Frame Tone
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: 'white', name: 'Vintage White', bg: 'bg-[#FCFCFC] border-[#E8E4DC]' },
                      { id: 'cream', name: 'Warm Cream', bg: 'bg-[#FAF6EC] border-[#E4DEC9]' },
                      { id: 'noir', name: 'Velvet Noir', bg: 'bg-[#18181A] border-[#2C2C30]' },
                      { id: 'sage', name: 'Pastel Sage', bg: 'bg-[#EFF3EE] border-[#D2DDD0]' },
                      { id: 'rose', name: 'Rose Dust', bg: 'bg-[#FAF0EE] border-[#EAD3CE]' },
                    ].map(b => (
                      <button
                        key={b.id}
                        onClick={() => updateActivePhoto(p => ({ ...p, border: b.id as BorderColor }))}
                        className={`flex flex-col items-center gap-1.5 p-2 rounded-sm border transition-all cursor-pointer ${
                          activePhoto.border === b.id
                            ? 'ring-2 ring-[#C9A66B] border-[#1A1A1A]'
                            : 'border-[#E8E0D2] hover:border-stone-400'
                        }`}
                      >
                        <span className={`w-7 h-7 rounded-[2px] border ${b.bg} shadow-inner`} />
                        <span className="text-[9px] font-mono text-center text-stone-700 truncate w-full">
                          {b.name.split(' ')[0]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rounded Corners Option */}
                <div className="flex items-center justify-between p-3 bg-white border border-[#E8E0D2] rounded-sm">
                  <div>
                    <div className="text-xs font-semibold text-stone-900">Soft Rounded Corners</div>
                    <div className="text-[11px] text-stone-500 font-light">Gentle 8px curve on outer frame</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={activePhoto.roundedCorners}
                    onChange={e => updateActivePhoto(p => ({ ...p, roundedCorners: e.target.checked }))}
                    className="w-4 h-4 accent-[#1A1A1A] cursor-pointer"
                  />
                </div>

              </div>
            )}

            {/* TAB 2: Crop, Zoom & Filters */}
            {activeTab === 'photo' && activePhoto && (
              <div className="space-y-6">
                
                {/* Vintage Color Filters */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2">
                    Analog Darkroom Filter
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { id: 'original', name: 'Original' },
                      { id: 'bw', name: 'Noir B&W' },
                      { id: 'sepia', name: 'Sepia Warmth' },
                      { id: 'vintage', name: 'Kodak ‘74' },
                      { id: 'faded', name: '90s Film' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() =>
                          updateActivePhoto(p => ({
                            ...p,
                            adjustments: { ...p.adjustments, filter: f.id as PhotoFilter },
                          }))
                        }
                        className={`py-2 px-1 text-center rounded-sm text-[10px] font-mono border transition-all cursor-pointer ${
                          activePhoto.adjustments.filter === f.id
                            ? 'bg-[#1A1A1A] text-[#FAF6EF] border-[#1A1A1A]'
                            : 'bg-white text-stone-700 border-[#E8E0D2] hover:border-stone-400'
                        }`}
                      >
                        {f.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Zoom Slider */}
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1.5 text-stone-700">
                    <span className="flex items-center gap-1.5">
                      <ZoomIn className="w-3.5 h-3.5 text-[#C9A66B]" /> Zoom / Crop Frame
                    </span>
                    <span>{Math.round(activePhoto.adjustments.zoom * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="2.5"
                    step="0.05"
                    value={activePhoto.adjustments.zoom}
                    onChange={e =>
                      updateActivePhoto(p => ({
                        ...p,
                        adjustments: { ...p.adjustments, zoom: parseFloat(e.target.value) },
                      }))
                    }
                    className="w-full accent-[#1A1A1A] cursor-pointer"
                  />
                </div>

                {/* Brightness & Contrast */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1 text-stone-700">
                      <span className="flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-[#C9A66B]" /> Brightness
                      </span>
                      <span>{activePhoto.adjustments.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={activePhoto.adjustments.brightness}
                      onChange={e =>
                        updateActivePhoto(p => ({
                          ...p,
                          adjustments: { ...p.adjustments, brightness: parseInt(e.target.value) },
                        }))
                      }
                      className="w-full accent-[#1A1A1A] cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-mono mb-1 text-stone-700">
                      <span className="flex items-center gap-1">
                        <Contrast className="w-3.5 h-3.5 text-[#C9A66B]" /> Contrast
                      </span>
                      <span>{activePhoto.adjustments.contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="50"
                      max="150"
                      value={activePhoto.adjustments.contrast}
                      onChange={e =>
                        updateActivePhoto(p => ({
                          ...p,
                          adjustments: { ...p.adjustments, contrast: parseInt(e.target.value) },
                        }))
                      }
                      className="w-full accent-[#1A1A1A] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Rotate Button */}
                <div className="flex items-center justify-between p-3 bg-white border border-[#E8E0D2] rounded-sm">
                  <span className="text-xs font-mono text-stone-700">Rotate Orientation</span>
                  <button
                    onClick={() =>
                      updateActivePhoto(p => ({
                        ...p,
                        adjustments: {
                          ...p.adjustments,
                          rotation: (p.adjustments.rotation + 90) % 360,
                        },
                      }))
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-stone-300 rounded-sm text-xs hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Rotate 90° ({activePhoto.adjustments.rotation}°)</span>
                  </button>
                </div>

              </div>
            )}

            {/* TAB 3: Handwritten Ink Caption */}
            {activeTab === 'caption' && activePhoto && (
              <div className="space-y-6">
                
                {/* Caption Input */}
                <div>
                  <div className="flex justify-between text-xs font-mono uppercase tracking-wider text-stone-600 mb-2">
                    <span>Bottom Polaroid Caption</span>
                    <span className="text-stone-400">{activePhoto.caption.length}/45</span>
                  </div>
                  <input
                    type="text"
                    maxLength={45}
                    value={activePhoto.caption}
                    onChange={e => updateActivePhoto(p => ({ ...p, caption: e.target.value }))}
                    placeholder="e.g. Summer in Amalfi · July 2026"
                    className="w-full bg-white border border-[#E8E0D2] focus:border-[#1A1A1A] px-3.5 py-2.5 rounded-sm text-sm focus:outline-hidden"
                  />
                </div>

                {/* Choice of Font */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2">
                    Handwritten Ink Font Style
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'caveat', name: 'Caveat (Playful Hand)', sample: 'Amalfi memories', fontClass: 'font-polaroid-hand text-lg' },
                      { id: 'homemade', name: 'Cursive (Vintage Quill)', sample: 'Claire & Julien', fontClass: 'font-polaroid-cursive text-xs' },
                      { id: 'serif', name: 'Editorial Serif', sample: 'Archival 2026', fontClass: 'font-serif-display italic text-sm' },
                      { id: 'sans', name: 'Minimal Sans', sample: 'MODERN CLEAN', fontClass: 'font-sans font-semibold text-xs tracking-wider' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => updateActivePhoto(p => ({ ...p, captionFont: f.id as CaptionFont }))}
                        className={`p-2.5 text-left border rounded-sm transition-all cursor-pointer ${
                          activePhoto.captionFont === f.id
                            ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#FAF6EF]'
                            : 'border-[#E8E0D2] bg-white text-stone-800 hover:border-stone-400'
                        }`}
                      >
                        <div className="text-[10px] font-mono opacity-60 uppercase">{f.name}</div>
                        <div className={`mt-1 truncate ${f.fontClass}`}>{f.sample}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vintage Date Stamp Toggle */}
                <div className="p-3 bg-white border border-[#E8E0D2] rounded-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-stone-900">Vintage Orange Date Stamp</div>
                      <div className="text-[11px] text-stone-500 font-light">Authentic 90s camera LED date imprint</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={activePhoto.showDateStamp}
                      onChange={e => updateActivePhoto(p => ({ ...p, showDateStamp: e.target.checked }))}
                      className="w-4 h-4 accent-[#1A1A1A] cursor-pointer"
                    />
                  </div>

                  {activePhoto.showDateStamp && (
                    <div className="pt-2 border-t border-stone-200 flex items-center gap-2">
                      <span className="text-xs font-mono text-stone-500">Date Text:</span>
                      <input
                        type="text"
                        maxLength={10}
                        value={activePhoto.dateStampText || 'OCT 26'}
                        onChange={e => updateActivePhoto(p => ({ ...p, dateStampText: e.target.value.toUpperCase() }))}
                        className="bg-stone-100 border border-stone-300 font-mono text-xs px-2 py-1 rounded-xs uppercase"
                      />
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB 4: Paper Finish & Quantity */}
            {activeTab === 'finish' && activePhoto && (
              <div className="space-y-6">
                
                {/* Paper Finish */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-stone-600 mb-2">
                    Paper Chemistry & Coating
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateActivePhoto(p => ({ ...p, finish: 'matte' }))}
                      className={`p-3 text-left border rounded-sm transition-all cursor-pointer ${
                        activePhoto.finish === 'matte'
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#FAF6EF]'
                          : 'border-[#E8E0D2] bg-white text-stone-800 hover:border-stone-400'
                      }`}
                    >
                      <div className="font-medium text-xs">Silk Matte (Recommended)</div>
                      <div className="text-[10px] opacity-70 mt-1 font-light">
                        Velvety touch, zero glare, anti-fingerprint archival cotton rag.
                      </div>
                    </button>

                    <button
                      onClick={() => updateActivePhoto(p => ({ ...p, finish: 'glossy' }))}
                      className={`p-3 text-left border rounded-sm transition-all cursor-pointer ${
                        activePhoto.finish === 'glossy'
                          ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#FAF6EF]'
                          : 'border-[#E8E0D2] bg-white text-stone-800 hover:border-stone-400'
                      }`}
                    >
                      <div className="font-medium text-xs">High Gloss Crystal</div>
                      <div className="text-[10px] opacity-70 mt-1 font-light">
                        Vibrant high-contrast sheen reminiscent of 1980s Polaroid Originals.
                      </div>
                    </button>
                  </div>
                </div>

                {/* Quantity for this specific photo */}
                <div className="p-3 bg-white border border-[#E8E0D2] rounded-sm flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold text-stone-900">Prints of this Photo</div>
                    <div className="text-[11px] text-stone-500 font-light">Gift extra copies to friends & family</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        updateActivePhoto(p => ({
                          ...p,
                          quantity: Math.max(1, (p.quantity || 1) - 1),
                        }))
                      }
                      className="w-7 h-7 flex items-center justify-center border border-stone-300 rounded-sm hover:bg-stone-100"
                    >
                      -
                    </button>
                    <span className="font-mono text-sm font-semibold w-6 text-center">
                      {activePhoto.quantity || 1}
                    </span>
                    <button
                      onClick={() =>
                        updateActivePhoto(p => ({
                          ...p,
                          quantity: (p.quantity || 1) + 1,
                        }))
                      }
                      className="w-7 h-7 flex items-center justify-center border border-stone-300 rounded-sm hover:bg-stone-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Backside message printing option */}
                <div className="p-3 bg-white border border-[#E8E0D2] rounded-sm space-y-2">
                  <div className="text-xs font-semibold text-stone-900">Backside Personal Inscription (Optional)</div>
                  <div className="text-[11px] text-stone-500 font-light">
                    Printed cleanly on the reverse of this print in archival gray ink
                  </div>
                  <input
                    type="text"
                    maxLength={80}
                    value={activePhoto.backsideMessage || ''}
                    onChange={e => updateActivePhoto(p => ({ ...p, backsideMessage: e.target.value }))}
                    placeholder="e.g. For Sophie, with love always. 28th Birthday."
                    className="w-full bg-stone-50 border border-stone-200 px-3 py-2 rounded-xs text-xs focus:outline-hidden"
                  />
                </div>

              </div>
            )}

            {/* LIVE PRICE CALCULATOR & BATCH PACK DEALS CARD */}
            <div className="bg-[#FAF6EF] border-2 border-[#1A1A1A] p-5 rounded-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#E8E0D2]">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#C9A66B] font-bold">
                    Real-Time Pricing
                  </span>
                  <div className="font-serif-display text-lg text-[#1A1A1A]">
                    {totalPrintsCount} Custom Prints
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-xl font-bold text-[#1A1A1A] tabular-nums">
                    ₹{finalCalculatedTotal}
                  </div>
                  {discountPercentage > 0 && (
                    <div className="text-[10px] font-mono text-emerald-700 line-through tabular-nums">
                      ₹{rawSubtotal}
                    </div>
                  )}
                </div>
              </div>

              {/* Volume Discount Notice */}
              <div className="bg-[#F3ECE0] p-2.5 rounded-sm text-xs flex items-center justify-between">
                <span className="font-mono text-[11px] text-stone-700 font-medium">
                  {packTierBadge}
                </span>
                {discountPercentage > 0 ? (
                  <span className="text-emerald-700 font-bold font-mono">
                    Save ₹{discountAmount}
                  </span>
                ) : (
                  <span className="text-stone-500 font-mono text-[11px]">
                    Add {10 - totalPrintsCount} more for 15% OFF
                  </span>
                )}
              </div>

              {/* Direct Add to Cart Action */}
              <button
                onClick={() => onAddToCart(photos)}
                className="w-full py-3.5 bg-[#1A1A1A] hover:bg-[#C9A66B] text-[#FAF6EF] font-semibold text-xs tracking-wider uppercase rounded-sm transition-all shadow-md cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Proceed with {totalPrintsCount} Prints (₹{finalCalculatedTotal})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
