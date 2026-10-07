import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { generateFireplacePDF } from '../../services/pdfService';
import { quoteService } from '../../services/quoteService';
import { Quote } from '../../types';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import brickWallBg from '../../assets/images/somine-cami-tugla-duvar-arka-plan.png';
import {
  Square,
  Settings,
  Coins,
  Percent,
  Wallet,
  Layers,
  ChevronRight,
  ChevronDown,
  Plus,
  ArrowLeftRight,
  ArrowUpDown,
  Save,
  RotateCcw,
  X,
  Ruler,
  ShieldCheck,
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  FileDown,
  Sparkles,
  MapPin,
  Clock,
  Truck,
  FileText,
  User,
  Phone,
  AlertCircle,
  DoorClosed,
  Share2,
  Check,
  Loader2,
  Send,
} from 'lucide-react';

const FIREBASE_FIRE_VIDEO_URL =
  'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/somine-alev-10sn.mp4?alt=media';
const FIREBASE_KARE_KAPAK_URL =
  'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/kare-somine-kagai.png?alt=media';
const FIREBASE_KAVISLI_KAPAK_URL =
  'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/kavisli-s%C3%B6mine-kapagi.png?alt=media';

// Kapak PNG'lerinin 1536x1024 (1.5) doğal geometrisindeki tam şeffaf cam açıklığı koordinatları:
const OPENING_CONFIG = {
  rectangle: {
    // kare-somine-kagai.png (1536 x 1024) -> Cam açıklığı: x: 429..1107 (w: 678), y: 332..692 (h: 360)
    left: 27.93,
    top: 32.42,
    width: 44.14,
    height: 35.16,
    borderRadius: '4px',
  },
  arch: {
    // kavisli-sömine-kapagi.png (1536 x 1024) -> Cam açıklığı: x: 406..1123 (w: 717), y: 293..734 (h: 441)
    left: 26.43,
    top: 28.61, // Kavis tepe noktası
    sideTop: 39.5, // Sol yan kenarın bitip kavisin başladığı omuz hizası
    width: 46.68,
    height: 43.07, // Toplam yükseklik (tepe ile taban arası)
    sideHeight: 32.18, // Yan düz kenar yüksekliği (omuz ile taban arası)
    borderRadius: '48% 48% 4px 4px / 22% 22% 4px 4px',
  },
};

// Metal Kapakların Dış Çerçeve Sınırları (Tuğla Duvar ile Metal Çerçevenin Tam Birleştiği Dış Kenarlar):
const COVER_FRAME_CONFIG = {
  rectangle: {
    // kare-somine-kagai.png dış metal sınırları:
    left: 20.5,
    top: 24.2,
    width: 59.0,
    height: 51.6,
  },
  arch: {
    // kavisli-sömine-kapagi.png (1536 x 1024) tam dış metal sınırları:
    // Üst tepe dış kavis: y = ~288px (28.1%)
    // Sol ve sağ düz dikey kenarın bittiği ve kemerin başladığı omuz dış noktası: y = ~415px (40.5%)
    // Alt taban dış kenarı: y = ~804px (78.5%)
    // Sol dış dikey kenar: x = ~344px (22.4%)
    // Sağ dış dikey kenar: x = ~1190px (77.5%)
    left: 22.4,
    top: 28.1, // En tepe kavis dış noktası
    sideTop: 40.5, // Düz yan dikey metal kenarın bittiği ve kemer kavisinin başladığı sol omuz dış noktası
    width: 55.1,
    height: 50.4, // Toplam dış yükseklik (tepe ile taban arası: 78.5 - 28.1 = 50.4%)
    sideHeight: 38.0, // Yan düz dikey kenar yüksekliği (omuz ile taban arası: 78.5 - 40.5 = 38.0%)
  },
};

export type ProductPricingOption = 'only_glass' | 'square_cover' | 'arch_cover';

export interface GlassTypeOption {
  id: string;
  name: string;
  pricePerM2: number;
  thickness: string;
  tempResistance: string;
}

export interface CoverModelOption {
  id: string;
  name: string;
  additionalPrice: number;
}

export interface CoverColorOption {
  id: string;
  name: string;
  colorCode: string;
}

export interface FireplacePricingSettings {
  whatsappPhone: string;
  baseCoverPricePerM2: number;
  kdvRate: number;
  minBillableAreaM2: number;
  archLaborMultiplier: number;
  archCoverMultiplier: number;
  glassPrices: Record<string, number>;
  coverModelPrices: Record<string, number>;
}

const DEFAULT_SETTINGS: FireplacePricingSettings = {
  whatsappPhone: '905421452525',
  baseCoverPricePerM2: 60000,
  kdvRate: 0.20,
  minBillableAreaM2: 0.25,
  archLaborMultiplier: 1.25,
  archCoverMultiplier: 1.35,
  glassPrices: {
    'robax_4mm': 28000,
    'self_cleaning_black': 32000,
    'robax_5mm': 34000,
    'high_temp_4mm': 26000,
  },
  coverModelPrices: {
    'single_door': 0,
    'double_door': 450,
    'folding_door': 750,
    'wrought_iron': 950,
  },
};

const GLASS_TYPES: GlassTypeOption[] = [
  {
    id: 'robax_4mm',
    name: '4 mm SCHOTT ROBAX® Şömine Camı',
    pricePerM2: 28000,
    thickness: '4 mm',
    tempResistance: '800°C',
  },
];

const COVER_MODELS: CoverModelOption[] = [
  { id: 'single_door', name: 'Standart Tek Kanat Açılır Kapak', additionalPrice: 0 },
  { id: 'double_door', name: 'Çift Kanat Açılır Kapak', additionalPrice: 450 },
];

const COVER_COLORS: CoverColorOption[] = [
  { id: 'matte_black', name: 'Mat Siyah', colorCode: '#1A1A1A' },
  { id: 'bronze_patina', name: 'Eskitme Bronz / Bakır Patine', colorCode: '#6B4C35' },
];

export interface RecentQuoteItem {
  id: string;
  city: string;
  district: string;
  title: string;
  productType: ProductPricingOption;
  dimensionsText: string;
  featuresText: string;
  timeAgoText: string;
  timestamp: number;
}

const INITIAL_RECENT_QUOTES: RecentQuoteItem[] = [
  {
    id: 'quote-erzurum-1',
    city: 'Erzurum',
    district: 'Pasinler',
    title: 'Kavisli (Kemerli) Şömine Camı & Kapak Siparişi',
    productType: 'arch_cover',
    dimensionsText: 'G: 70.0 cm | Y1: 55.0 cm | Y2: 65.0 cm',
    featuresText: '4 mm SCHOTT ROBAX® Isıya Dayanıklı Cam, Mat Siyah Kapak',
    timeAgoText: '12 dakika önce teklif oluşturuldu',
    timestamp: Date.now() - 12 * 60 * 1000,
  },
  {
    id: 'quote-bolu-2',
    city: 'Bolu',
    district: 'Mengen',
    title: 'Kare Şömine Kapağı & Düz Isı Camı',
    productType: 'square_cover',
    dimensionsText: 'G: 65.0 cm | Y: 52.0 cm',
    featuresText: '4 mm SCHOTT ROBAX® Şeffaf Cam, Eskitme Bronz Kapak (Tek Kanat)',
    timeAgoText: '35 dakika önce teklif oluşturuldu',
    timestamp: Date.now() - 35 * 60 * 1000,
  },
  {
    id: 'quote-bursa-3',
    city: 'Bursa',
    district: 'Nilüfer',
    title: 'Isıya Dayanıklı Şömine Camı (Kapak Hariç)',
    productType: 'only_glass',
    dimensionsText: 'G: 78.0 cm | Y: 60.0 cm',
    featuresText: '4 mm SCHOTT ROBAX® Orijinal Seramik Cam, Rodajlı Kenar & Ahşap Kasa',
    timeAgoText: '1 saat önce teklif oluşturuldu',
    timestamp: Date.now() - 65 * 60 * 1000,
  },
  {
    id: 'quote-ankara-4',
    city: 'Ankara',
    district: 'Çankaya',
    title: 'Kavisli Kemerli Şömine Kapağı & Özel Kesim Cam',
    productType: 'arch_cover',
    dimensionsText: 'G: 82.0 cm | Y1: 60.0 cm | Y2: 72.0 cm',
    featuresText: '4 mm SCHOTT ROBAX® Cam, Mat Siyah Çift Kanat Açılır Kapak',
    timeAgoText: '2 saat önce teklif oluşturuldu',
    timestamp: Date.now() - 130 * 60 * 1000,
  },
  {
    id: 'quote-mugla-5',
    city: 'Muğla',
    district: 'Bodrum',
    title: 'Kare Şömine Kapağı ve Şömine Camı',
    productType: 'square_cover',
    dimensionsText: 'G: 74.0 cm | Y: 58.0 cm',
    featuresText: '4 mm SCHOTT ROBAX® Cam, Mat Siyah Standart Tek Kanat Kapak',
    timeAgoText: '3 saat önce teklif oluşturuldu',
    timestamp: Date.now() - 190 * 60 * 1000,
  },
  {
    id: 'quote-trabzon-6',
    city: 'Trabzon',
    district: 'Akçaabat',
    title: 'Yüksek Sıcaklığa Dayanıklı Şömine Camı',
    productType: 'only_glass',
    dimensionsText: 'G: 62.0 cm | Y: 48.0 cm',
    featuresText: '4 mm SCHOTT ROBAX® Isıya Dayanıklı Düz Cam (Özel Koruyucu Ambalaj)',
    timeAgoText: '4 saat önce teklif oluşturuldu',
    timestamp: Date.now() - 245 * 60 * 1000,
  },
];

export const FireplaceGlassConfigurator: React.FC = () => {
  const { isAdmin } = useAuth();

  // Cam Formu Seçimi ('square' | 'arch') - Varsayılan: 'square' (Kare Cam)
  const [glassShape, setGlassShape] = useState<'square' | 'arch'>('square');
  // Kapak Ekle Seçeneği (Toggle) - Varsayılan: false (Kapak Yok / Pasif)
  const [includeCover, setIncludeCover] = useState<boolean>(false);

  // Ölçü Girdileri (cm cinsinden string) - Başlangıçta boş
  const [widthInput, setWidthInput] = useState<string>('');
  const [heightInput, setHeightInput] = useState<string>(''); // Y veya Y1
  const [y2Input, setY2Input] = useState<string>(''); // Kavisli için Tepe Yüksekliği Y2

  // Güvenli parsing (Input silinirken veya yazılırken 0.0 cm sıfırlanma hatasını %100 önler)
  const parseSafeCm = (val: string, fallback: number): number => {
    if (!val) return fallback;
    const clean = val.replace(',', '.').trim();
    const num = parseFloat(clean);
    return isNaN(num) || num <= 0 ? fallback : num;
  };

  const widthCm = useMemo(() => parseSafeCm(widthInput, 60.0), [widthInput]);
  const heightCm = useMemo(() => parseSafeCm(heightInput, 40.0), [heightInput]);
  const y2Cm = useMemo(() => parseSafeCm(y2Input, 50.0), [y2Input]);

  // Kullanıcı geçerli ölçü girdi mi kontrolü
  const hasInputDimensions = useMemo(() => {
    const w = parseFloat(widthInput.replace(',', '.'));
    const h = parseFloat(heightInput.replace(',', '.'));
    if (isNaN(w) || w <= 0 || isNaN(h) || h <= 0) return false;
    if (glassShape === 'arch') {
      const y2 = parseFloat(y2Input.replace(',', '.'));
      if (isNaN(y2) || y2 <= 0) return false;
    }
    return true;
  }, [widthInput, heightInput, y2Input, glassShape]);

  const displayG = useMemo(() => widthCm.toFixed(1), [widthCm]);
  const displayY = useMemo(() => heightCm.toFixed(1), [heightCm]);
  const displayY2 = useMemo(() => y2Cm.toFixed(1), [y2Cm]);

  const widthMm = useMemo(() => Math.round(widthCm * 10), [widthCm]);
  const heightMm = useMemo(() => Math.round(heightCm * 10), [heightCm]);
  const y2Mm = useMemo(() => Math.round(y2Cm * 10), [y2Cm]);

  const [selectedGlassId] = useState<string>('robax_4mm');
  const [quantity, setQuantity] = useState<number>(1);

  // Kapak Modeli & Rengi (Kapaklı seçenekler için)
  const [selectedCoverModelId, setSelectedCoverModelId] = useState<string>('single_door');
  const [selectedCoverColorId, setSelectedCoverColorId] = useState<string>('matte_black');
  const [isFeaturesAccordionOpen, setIsFeaturesAccordionOpen] = useState<boolean>(false);

  // Müşteri Bilgi Giriş Formu (Zorunlu / 3 Kolonlu Grid)
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerAddress, setCustomerAddress] = useState<string>('');
  const [formErrors, setFormErrors] = useState<{ name?: boolean; phone?: boolean; address?: boolean }>({});
  const [validationErrorMessage, setValidationErrorMessage] = useState<string | null>(null);
  const [isSubmittingToDb, setIsSubmittingToDb] = useState<boolean>(false);
  const [submissionSuccessMessage, setSubmissionSuccessMessage] = useState<string | null>(null);

  // Son Oluşturulan Teklifler (SEO & Geo-SEO / Canlı Sipariş Akışı)
  const [recentQuotes, setRecentQuotes] = useState<RecentQuoteItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mimaricam_recent_fireplace_quotes');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_RECENT_QUOTES;
  });

  // Admin Ayarları
  const [settings, setSettings] = useState<FireplacePricingSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('mimaricam_fireplace_pricing');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    // Firestore settings/fireplace_pricing belgesini canlı dinle ve yerel state'i güncelle
    const docRef = doc(db, 'settings', 'fireplace_pricing');
    const unsubscribe = onSnapshot(
      docRef,
      (snap) => {
        if (snap.exists()) {
          const data = snap.data() as FireplacePricingSettings;
          setSettings(data);
          try {
            localStorage.setItem('mimaricam_fireplace_pricing', JSON.stringify(data));
          } catch (e) {
            console.error(e);
          }
        }
      },
      (error) => {
        console.warn('Firestore settings subscription error, using local storage/defaults:', error);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sosyal Paylaşım Butonu State & Handler (Web Share API / Clipboard Fallback)
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleShare = async () => {
    const shareData = {
      title: 'MimariCam - Şömine Camı ve Kapak Hesaplayıcı',
      text: 'Ölçünü gir, fiyatını al, anında sipariş ver!',
      url: 'https://mimaricam.com/camini-tasarla',
    };

    if (navigator.share && typeof navigator.canShare === 'function' && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err: any) {
        if (err.name === 'AbortError') return;
      }
    }

    // Fallback: Clipboard kopyalama
    try {
      await navigator.clipboard.writeText('https://mimaricam.com/camini-tasarla');
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2800);
    } catch {
      // Çok eski tarayıcılar için prompt
      window.prompt('Paylaşım linkini kopyalayabilirsiniz:', 'https://mimaricam.com/camini-tasarla');
    }
  };

  // Input Değişim ve Blur Handlers (Maksimum sınırlar: Genişlik 196 cm, Yükseklik 110 cm)
  const MAX_WIDTH_CM = 196.0;
  const MAX_HEIGHT_CM = 110.0;
  const [dimensionLimitWarning, setDimensionLimitWarning] = useState<string | null>(null);

  const handleWidthChange = (val: string) => {
    const clean = val.replace(',', '.');
    if (clean === '' || /^\d*\.?\d*$/.test(clean)) {
      const parts = clean.split('.');
      if (parts[1] && parts[1].length > 1) return;
      const num = parseFloat(clean);
      if (!isNaN(num) && num > MAX_WIDTH_CM) {
        setWidthInput(MAX_WIDTH_CM.toFixed(1));
        setDimensionLimitWarning(`Maksimum imalat ölçüleri Genişlik: ${MAX_WIDTH_CM} cm, Yükseklik: ${MAX_HEIGHT_CM} cm ile sınırlıdır.`);
        return;
      }
      setDimensionLimitWarning(null);
      setWidthInput(val);
    }
  };

  const handleHeightChange = (val: string) => {
    const clean = val.replace(',', '.');
    if (clean === '' || /^\d*\.?\d*$/.test(clean)) {
      const parts = clean.split('.');
      if (parts[1] && parts[1].length > 1) return;
      const num = parseFloat(clean);
      if (!isNaN(num) && num > MAX_HEIGHT_CM) {
        setHeightInput(MAX_HEIGHT_CM.toFixed(1));
        setDimensionLimitWarning(`Maksimum imalat ölçüleri Genişlik: ${MAX_WIDTH_CM} cm, Yükseklik: ${MAX_HEIGHT_CM} cm ile sınırlıdır.`);
        return;
      }
      setDimensionLimitWarning(null);
      setHeightInput(val);
    }
  };

  const handleY2Change = (val: string) => {
    const clean = val.replace(',', '.');
    if (clean === '' || /^\d*\.?\d*$/.test(clean)) {
      const parts = clean.split('.');
      if (parts[1] && parts[1].length > 1) return;
      const num = parseFloat(clean);
      if (!isNaN(num) && num > MAX_HEIGHT_CM) {
        setY2Input(MAX_HEIGHT_CM.toFixed(1));
        setDimensionLimitWarning(`Maksimum imalat ölçüleri Genişlik: ${MAX_WIDTH_CM} cm, Yükseklik: ${MAX_HEIGHT_CM} cm ile sınırlıdır.`);
        return;
      }
      setDimensionLimitWarning(null);
      setY2Input(val);
    }
  };

  const handleWidthBlur = () => {
    let num = parseFloat(widthInput.replace(',', '.'));
    if (isNaN(num) || num < 5.0) num = 5.0;
    if (num > MAX_WIDTH_CM) {
      num = MAX_WIDTH_CM;
      setDimensionLimitWarning(`Maksimum imalat ölçüleri Genişlik: ${MAX_WIDTH_CM} cm, Yükseklik: ${MAX_HEIGHT_CM} cm ile sınırlıdır.`);
    }
    setWidthInput(num.toFixed(1));
  };

  const handleHeightBlur = () => {
    let num = parseFloat(heightInput.replace(',', '.'));
    if (isNaN(num) || num < 5.0) num = 5.0;
    if (num > MAX_HEIGHT_CM) {
      num = MAX_HEIGHT_CM;
      setDimensionLimitWarning(`Maksimum imalat ölçüleri Genişlik: ${MAX_WIDTH_CM} cm, Yükseklik: ${MAX_HEIGHT_CM} cm ile sınırlıdır.`);
    }
    setHeightInput(num.toFixed(1));
  };

  const handleY2Blur = () => {
    let num = parseFloat(y2Input.replace(',', '.'));
    if (isNaN(num) || num < heightCm) num = Number(Math.min(heightCm + 8, MAX_HEIGHT_CM).toFixed(1));
    if (num > MAX_HEIGHT_CM) {
      num = MAX_HEIGHT_CM;
      setDimensionLimitWarning(`Maksimum imalat ölçüleri Genişlik: ${MAX_WIDTH_CM} cm, Yükseklik: ${MAX_HEIGHT_CM} cm ile sınırlıdır.`);
    }
    setY2Input(num.toFixed(1));
  };

  // Cam Formu ve Kapak Ekle Durumuna Göre productType türetimi:
  // includeCover false ise => 'only_glass'
  // includeCover true ise: glassShape === 'arch' ? 'arch_cover' : 'square_cover'
  const isArch = glassShape === 'arch';
  const hasCover = includeCover;
  const productType: ProductPricingOption = !includeCover
    ? 'only_glass'
    : isArch
    ? 'arch_cover'
    : 'square_cover';

  // Cam Şekli Değiştirme
  const handleGlassShapeChange = (shape: 'square' | 'arch') => {
    setGlassShape(shape);
    if (shape === 'arch' && y2Cm <= heightCm) {
      setY2Input((heightCm + 10).toFixed(1));
    }
  };

  // Kapak Ekle Toggle
  const handleToggleCover = () => {
    setIncludeCover((prev) => !prev);
  };

  // ==============================================================
  // KESİN MATEMATİKSEL FİYAT HESAPLAMA MOTORU
  // ==============================================================
  const priceCalculations = useMemo(() => {
    const width = parseFloat(widthInput.replace(',', '.')) || 0;
    const baseHeight = parseFloat(heightInput.replace(',', '.')) || 0;
    const middleHeight = parseFloat(y2Input.replace(',', '.')) || 0;
    const qty = Math.max(1, Number(quantity) || 1);

    if (width <= 0 || baseHeight <= 0) {
      return {
        billedArea: 0,
        rawArea: 0,
        subtotalNet: 0,
        vatAmount: 0,
        grandTotal: 0,
        hasBulkDiscount: false,
        isMinAreaApplied: false
      };
    }

    const isOvalSelected = isArch;
    const isFrameSelected = includeCover;
    const isGlassAndFrameSelected = includeCover;

    // 1. Oval / Kavisli kesimde efektif yükseklik tespiti
    let effectiveHeight = baseHeight;
    if (isOvalSelected && middleHeight > 0) {
      effectiveHeight = Math.max(baseHeight, middleHeight);
    }

    // 2. Metrekare (m²) hesabı
    const areaSquareMeters = (width * effectiveHeight) / 10000;

    // 3. m² Birim Fiyatı
    const GLASS_M2_PRICE = 28000;
    const FRAME_M2_PRICE = 60000;

    let unitPricePerM2 = GLASS_M2_PRICE;
    if (isFrameSelected || isGlassAndFrameSelected) {
      unitPricePerM2 = GLASS_M2_PRICE + FRAME_M2_PRICE; // 88.000 TL
    }

    // 4. Ara Toplam
    let totalPrice = areaSquareMeters * unitPricePerM2 * qty;

    // 5. 10 Adet ve Üzeri %15 Toptan İndirim
    const hasBulkDiscount = qty >= 10;
    if (hasBulkDiscount) {
      totalPrice = totalPrice * 0.85;
    }

    // 6. Nihai Fiyat (En yakın tam sayıya yuvarlanmış)
    const finalPrice = Math.round(totalPrice);

    // KDV Dağılım Hesabı (Nihai fiyatı tam koruyarak %20 KDV kırılımı sunar)
    const subtotalNet = totalPrice / 1.20;
    const vatAmount = totalPrice - subtotalNet;

    return {
      billedArea: areaSquareMeters,
      rawArea: areaSquareMeters,
      subtotalNet,
      vatAmount,
      grandTotal: finalPrice,
      hasBulkDiscount,
      isMinAreaApplied: false
    };
  }, [widthInput, heightInput, y2Input, quantity, includeCover, isArch]);

  // UI ve PDF ile Geriye Dönük Uyumluluk Değişkenleri
  const calculatedAreaM2 = Number(priceCalculations.rawArea.toFixed(3));
  const billableArea = priceCalculations.billedArea;
  const subTotal = priceCalculations.subtotalNet;
  const kdvAmount = priceCalculations.vatAmount;
  const grandTotal = priceCalculations.grandTotal;

  // Geriye Dönük Uyumluluk ve UI Parçalama için M² Dağılımlı Fiyat Tanımları
  // Sadece Cam: Birim 28.000 TL. Cam+Kapak: 28.000 TL cam, 60.000 TL kapak olarak paylaştırılır (Toplam: 88.000 TL).
  const totalGlassPrice = useMemo(() => {
    const unitPart = 28000 / 1.20;
    const discountMultiplier = quantity >= 10 ? 0.85 : 1.0;
    return Math.round(priceCalculations.billedArea * unitPart * discountMultiplier * quantity);
  }, [priceCalculations.billedArea, quantity]);

  const totalCoverPriceBeforeDiscount = useMemo(() => {
    if (!includeCover) return 0;
    const unitPart = 60000 / 1.20; // Çerçeve birim fiyatı 60.000 TL (KDV hariç matrahı)
    return Math.round(priceCalculations.billedArea * unitPart * quantity);
  }, [priceCalculations.billedArea, quantity, includeCover]);

  const coverDiscount = useMemo(() => {
    if (!includeCover) return 0;
    const unitPart = 60000 / 1.20;
    const discountMultiplier = quantity >= 10 ? 0.15 : 0;
    return Math.round(priceCalculations.billedArea * unitPart * discountMultiplier * quantity);
  }, [priceCalculations.billedArea, quantity, includeCover]);

  // Yardımcı Tanımlar
  const selectedGlass = GLASS_TYPES[0];
  const selectedCoverModel = COVER_MODELS.find((m) => m.id === selectedCoverModelId) || COVER_MODELS[0];
  const selectedCoverColor = COVER_COLORS.find((c) => c.id === selectedCoverColorId) || COVER_COLORS[0];

  const formatTL = (num: number) => {
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(num);
  };

  // Yeni Teklifi Kaydet (Anonimleştirilmiş Geo-SEO Listesine)
  const recordRecentQuote = () => {
    const geoLocations = [
      { city: 'Erzurum', district: 'Pasinler' },
      { city: 'Ankara', district: 'Çankaya' },
      { city: 'Bursa', district: 'Nilüfer' },
      { city: 'Bolu', district: 'Mengen' },
      { city: 'Trabzon', district: 'Akçaabat' },
      { city: 'Muğla', district: 'Bodrum' },
      { city: 'Kayseri', district: 'Melikgazi' },
      { city: 'Balıkesir', district: 'Edremit' },
      { city: 'İzmir', district: 'Urla' },
      { city: 'Kocaeli', district: 'Kartepe' },
      { city: 'Rize', district: 'Çamlıhemşin' },
      { city: 'Antalya', district: 'Alanya' },
    ];
    const randomLoc = geoLocations[Math.floor(Math.random() * geoLocations.length)];

    const title =
      productType === 'arch_cover'
        ? 'Kavisli (Kemerli) Şömine Camı & Kapak Siparişi'
        : productType === 'square_cover'
        ? 'Kare Şömine Kapağı & Düz Isı Camı'
        : 'Isıya Dayanıklı Şömine Camı (Kapak Hariç)';

    const dimensionsText =
      productType === 'arch_cover'
        ? `G: ${displayG} cm | Y1: ${displayY} cm | Y2: ${displayY2} cm`
        : `G: ${displayG} cm | Y: ${displayY} cm`;

    const featuresText = hasCover
      ? `4 mm SCHOTT ROBAX® Isıya Dayanıklı Cam, ${selectedCoverColor.name} Kapak (${selectedCoverModel.name})`
      : '4 mm SCHOTT ROBAX® Orijinal Seramik Cam, Rodajlı Kenar & Korumalı Ambalaj';

    const newQuote: RecentQuoteItem = {
      id: `quote-${Date.now()}`,
      city: randomLoc.city,
      district: randomLoc.district,
      title,
      productType,
      dimensionsText,
      featuresText,
      timeAgoText: 'Az önce teklif oluşturuldu',
      timestamp: Date.now(),
    };

    setRecentQuotes((prev) => {
      const updated = [newQuote, ...prev.slice(0, 8)];
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('mimaricam_recent_fireplace_quotes', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
      }
      return updated;
    });
  };

  // Müşteri Formu Doğrulama (Validation)
  const validateCustomerForm = (): boolean => {
    // Ölçülerin tam ve geçerli girildiğinden emin ol
    if (!hasInputDimensions) {
      if (glassShape === 'arch') {
        setValidationErrorMessage('Lütfen öncelikle GENİŞLİK, YÜKSEKLİK ve ORTA UÇ ÖLÇÜSÜ değerlerini geçerli şekilde doldurunuz.');
      } else {
        setValidationErrorMessage('Lütfen öncelikle GENİŞLİK ve YÜKSEKLİK değerlerini geçerli şekilde doldurunuz.');
      }
      return false;
    }

    const errors: { name?: boolean; phone?: boolean; address?: boolean } = {};
    const trimmedName = customerName.trim();
    const cleanDigits = customerPhone.replace(/[^0-9]/g, '');
    const trimmedAddress = customerAddress.trim();

    if (!trimmedName || trimmedName.length < 3) {
      errors.name = true;
    }

    // Telefon doğrulaması: en az 10 basamak (Türkiye formatı 05XX XXX XX XX)
    if (!cleanDigits || cleanDigits.length < 10) {
      errors.phone = true;
    }

    if (!trimmedAddress || trimmedAddress.length < 5) {
      errors.address = true;
    }

    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setValidationErrorMessage('Lütfen sipariş için Ad-Soyad, Telefon ve Adres bilgilerinizi doldurunuz.');
      return false;
    }

    setValidationErrorMessage(null);
    return true;
  };

  // Firestore quotes/orders Koleksiyonuna Kaydetme (Admin Paneli ile tam entegre)
  const saveQuoteToFirestore = async (): Promise<Quote> => {
    const optionTitle =
      productType === 'only_glass'
        ? 'Sadece Isıya Dayanıklı Cam (SCHOTT ROBAX®)'
        : productType === 'square_cover'
        ? 'Kare Şömine Kapağı'
        : 'Kavisli (Kemerli) Şömine Kapağı';

    const coverDetails = hasCover
      ? `${selectedCoverModel.name} / ${selectedCoverColor.name}`
      : 'Kapak Hariç (Sadece Düz Cam Plaka)';

    const dimensionsText =
      productType === 'arch_cover'
        ? `G: ${displayG} cm | Y1: ${displayY} cm | Y2: ${displayY2} cm`
        : `G: ${displayG} cm | Y: ${displayY} cm`;

    const quoteDetailsNotes = [
      `Ölçüler: ${dimensionsText}`,
      `Cam: ${selectedGlass.name} (${selectedGlass.thickness})`,
      `Kapak: ${coverDetails}`,
      `Adet: ${quantity}`,
      `Cam Alanı: ${calculatedAreaM2} m²`,
      `KDV Dahil Toplam Tutar: ${formatTL(grandTotal)} TL`,
      `Adres: ${customerAddress.trim()}`,
    ].join(' | ');

    // Adresten Şehir/İlçe parse etme (varsa)
    const addressParts = customerAddress.split(/[\/,-]/).map((s) => s.trim()).filter(Boolean);
    const cityCandidate = addressParts.length > 0 ? addressParts[addressParts.length - 1] : 'Türkiye';
    const districtCandidate = addressParts.length > 1 ? addressParts[addressParts.length - 2] : '';

    const saved = await quoteService.createQuote({
      clientName: customerName.trim(),
      customerName: customerName.trim(),
      clientEmail: 'info@mimaricam.com',
      clientPhone: customerPhone.trim(),
      customerPhone: customerPhone.trim(),
      clientType: 'individual',
      city: cityCandidate || 'Türkiye',
      district: districtCandidate || '',
      projectLocation: customerAddress.trim(),
      customerAddress: customerAddress.trim(),
      model: optionTitle,
      dimensions: {
        g: displayG,
        y: displayY,
        y1: displayY,
        ...(productType === 'arch_cover' ? { y2: displayY2, centerArchMm: y2Mm } : {}),
        widthMm,
        heightMm,
        formatted: dimensionsText,
      },
      orderDetails: {
        camModeli: optionTitle,
        olculer: dimensionsText,
        adet: quantity,
        fiyat: `${formatTL(grandTotal)} TL`,
      },
      offeredPrice: grandTotal,
      totalPrice: grandTotal,
      currency: 'TRY',
      isGuest: true,
      status: 'new',
      adminNotes: quoteDetailsNotes,
      items: [
        {
          id: `item-${Date.now()}`,
          type: 'custom_design',
          productTitle: `${optionTitle} (${displayG}x${displayY} cm)`,
          quantity,
          unitPrice: grandTotal / (quantity || 1),
          totalPrice: grandTotal,
          notes: quoteDetailsNotes,
          designConfig: {
            shape: productType === 'arch_cover' ? 'curved' : 'rectangle',
            categoryId: 'somine-camlari',
            glassTypeName: selectedGlass.name,
            thicknessMm: 4,
            widthMm,
            heightMm,
            ...(productType === 'arch_cover' ? { centerArchMm: y2Mm } : {}),
            edgeFinish: 'rodaj',
            calculatedAreaM2,
            notes: `Kapak: ${coverDetails} | Toplam Tutar: ${grandTotal} TL`,
          },
        },
      ],
    });

    return saved;
  };

  // WhatsApp Sipariş Metni (Önce Firestore addDoc kaydı beklenir, ardından WhatsApp yönlendirmesi yapılır)
  const handleWhatsAppOrder = async () => {
    if (!validateCustomerForm()) {
      return;
    }

    try {
      setIsSubmittingToDb(true);
      recordRecentQuote();

      // 1. ADIM: Önce Firestore'a addDoc ile kayıt işlemi tamamlanmalı (AWAIT)
      const savedQuote = await saveQuoteToFirestore();
      const orderCode = savedQuote?.quoteNumber || `MC-${new Date().getFullYear()}`;

      setSubmissionSuccessMessage(`Siparişiniz (#${orderCode}) başarıyla alındı! WhatsApp'a aktarılıyorsunuz...`);
      setTimeout(() => setSubmissionSuccessMessage(null), 8000);

      // 2. ADIM: Ardından müşteri WhatsApp'a yönlendirilir
      const optionTitle =
        productType === 'only_glass'
          ? 'Sadece Isıya Dayanıklı Cam (SCHOTT ROBAX®)'
          : productType === 'square_cover'
          ? 'Kare Şömine Kapağı'
          : 'Kavisli (Kemerli) Şömine Kapağı';

      const dimensionsText =
        productType === 'arch_cover'
          ? `• Genişlik (G): ${widthMm} mm (${displayG} cm)\n• Yan Yükseklik (Y1): ${heightMm} mm (${displayY} cm)\n• Kavis Tepe Yüksekliği (Y2): ${y2Mm} mm (${displayY2} cm)`
          : `• Genişlik (G): ${widthMm} mm (${displayG} cm)\n• Yükseklik (Y): ${heightMm} mm (${displayY} cm)`;

      const coverDetails = hasCover
        ? `${selectedCoverModel.name} / ${selectedCoverColor.name}`
        : 'Kapak Hariç (Sadece Düz Cam Plaka)';

      const discountLine =
        coverDiscount > 0
          ? `\n🎁 *Toplu Alım İndirimi (%15):* -${formatTL(coverDiscount)} TL`
          : '';

      const message = `*MİMARİCAM SİPARİŞİ (#${orderCode})*
👤 *Müşteri:* ${customerName.trim()}
📞 *Telefon:* ${customerPhone.trim()}
📍 *Teslimat Adresi:* ${customerAddress.trim()}
----------------------------------
*SİPARİŞ DETAYLARI:*
- Sipariş No: ${orderCode}
- Ürün: ${optionTitle}
- Ölçüler:
${dimensionsText}
- Cam Tipi: ${selectedGlass.name} (${selectedGlass.thickness})
- Kapak Seçimi: ${coverDetails}
- Adet: ${quantity} Adet
- Hesaplanan Cam Alanı: ${calculatedAreaM2} m² (Faturalandırılan: ${billableArea} m²)
- Cam Tutarı: ${formatTL(totalGlassPrice)} TL
${hasCover ? `- Kapak Tutarı: ${formatTL(totalCoverPriceBeforeDiscount)} TL${discountLine}\n` : ''}- KDV (%${Math.round(settings.kdvRate * 100)}): ${formatTL(kdvAmount)} TL
- Toplam Tutar: ${formatTL(grandTotal)} TL
----------------------------------
Siparişim MimariCam sistemine kaydedilmiştir. İmalat ve onay süreci hakkında bilgi rica ederim.`;

      const cleanPhone = settings.whatsappPhone.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

      // Popup blocker koruması için DOM element tıklaması
      try {
        const link = document.createElement('a');
        link.href = waUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.click();
      } catch {
        window.location.href = waUrl;
      }
    } catch (err: any) {
      console.error('Firestore sipariş kaydı hatası:', err);
      setSubmissionSuccessMessage('Sipariş sisteme kaydedilirken bir hata oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyiniz.');
    } finally {
      setIsSubmittingToDb(false);
    }
  };

  // PDF İndir
  const handleDownloadPDF = async () => {
    if (!validateCustomerForm()) {
      return;
    }

    recordRecentQuote();
    await saveQuoteToFirestore();

    generateFireplacePDF({
      date: new Date().toLocaleDateString('tr-TR'),
      shape: productType === 'arch_cover' ? 'arch' : 'rectangle',
      widthMm,
      heightMm,
      archApexMm: productType === 'arch_cover' ? y2Mm : undefined,
      glassTypeName: selectedGlass.name,
      includeCover: hasCover,
      coverModelName: hasCover ? selectedCoverModel.name : undefined,
      coverColorName: hasCover ? selectedCoverColor.name : undefined,
      quantity,
      calculatedAreaM2,
      rawGlassTotal: totalGlassPrice,
      coverModelPrice: hasCover ? totalCoverPriceBeforeDiscount : undefined,
      coverDiscount: hasCover ? coverDiscount : undefined,
      kdvAmount,
      grandTotal,
    });
  };

  // Doğrudan Teklif İlet / Sipariş Talebi Gönder
  const handleDirectQuoteSubmit = async () => {
    if (!validateCustomerForm()) {
      return;
    }

    recordRecentQuote();
    await saveQuoteToFirestore();
  };

  // Aktif model pencere açıklığı koordinatları (Kavisli cam seçiliyse arch, kare cam seçiliyse rectangle):
  const currentOpening = isArch ? OPENING_CONFIG.arch : OPENING_CONFIG.rectangle;

  // Ölçü oklarının referans sınırları:
  // Kapak ekliyse metal çerçevenin en dış sınırları (tuğla duvar birleşimi), sadece cam ise cam sınırları
  const currentFrame = isArch ? COVER_FRAME_CONFIG.arch : COVER_FRAME_CONFIG.rectangle;
  const activeArrowBounds = useMemo(() => {
    if (hasCover) {
      return {
        left: currentFrame.left,
        width: currentFrame.width,
        top: currentFrame.top,
        height: currentFrame.height,
        // Dikey Y/Y1 oku için omuz yüksekliği
        sideTop: isArch ? COVER_FRAME_CONFIG.arch.sideTop : currentFrame.top,
        sideHeight: isArch ? COVER_FRAME_CONFIG.arch.sideHeight : currentFrame.height,
      };
    }
    return {
      left: currentOpening.left,
      width: currentOpening.width,
      top: currentOpening.top,
      height: currentOpening.height,
      // Dikey Y/Y1 oku için omuz yüksekliği (kavisli şeffaf cam için)
      sideTop: isArch ? OPENING_CONFIG.arch.sideTop : currentOpening.top,
      sideHeight: isArch ? OPENING_CONFIG.arch.sideHeight : currentOpening.height,
    };
  }, [hasCover, isArch, currentFrame, currentOpening]);

  return (
    <div className="w-full max-w-3xl mx-auto font-sans antialiased text-gray-900 select-none pb-6">
      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden">
        
        {/* ============================================================== */}
        {/* 1. GÖRSEL SİMÜLATÖR (3 Seçeneğe Göre Dinamik Katman & Alev Haznesi) */}
        {/* ============================================================== */}
        <div className="relative w-full aspect-[1.5] bg-stone-950 overflow-hidden flex items-center justify-center select-none">
          
          {/* KATMAN 0: SABİT TUĞLA DUVAR ARKA FONU (Tüm seçeneklerde kesintisiz taban) */}
          <img
            src={brickWallBg}
            alt="Şömine Tuğla Duvarı"
            width={800}
            height={533}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0 select-none"
          />

          {/* Tuğla Duvar Ambiyans & Derinlik Gölgelendirmesi */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/65 pointer-events-none z-[1]" />

          {/* KATMAN 1: Z-5 - Alev Videosu ve Döküm Yanma Odası Haznesi */}
          {/* Pencere sınırlarına birebir oturur; kavisli modelde kavis maskesi uygulanır */}
          <div
            className="absolute z-[5] overflow-hidden"
            style={{
              left: `${currentOpening.left}%`,
              top: `${currentOpening.top}%`,
              width: `${currentOpening.width}%`,
              height: `${currentOpening.height}%`,
              borderRadius: currentOpening.borderRadius,
            }}
          >
            {/* Döküm Yanma Odası Derinlik Gölgelendirmesi */}
            <div className="absolute inset-0 bg-[#090706] shadow-[inset_0_20px_35px_rgba(0,0,0,0.98),inset_0_-14px_25px_rgba(0,0,0,0.95)] z-[1]" />

            {/* somine-alev-10sn.mp4 */}
            <video
              src={FIREBASE_FIRE_VIDEO_URL}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover z-[2]"
            />

            {/* Alev Ambiyans ve Sıcak Işık Parlaması */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none z-[3]" />
            <div className="absolute inset-0 bg-radial from-amber-500/15 via-transparent to-black/30 pointer-events-none z-[3]" />
          </div>

          {/* KATMAN 2: Z-10 - Şeffaf Cam Seramik Katmanı + SCHOTT ROBAX® Logosu / Işık Yansıması */}
          <div
            className="absolute z-10 pointer-events-none flex flex-col justify-between p-2 sm:p-3 overflow-hidden"
            style={{
              left: `${currentOpening.left}%`,
              top: `${currentOpening.top}%`,
              width: `${currentOpening.width}%`,
              height: `${currentOpening.height}%`,
              borderRadius: currentOpening.borderRadius,
              border:
                productType === 'only_glass'
                  ? '2px solid rgba(255,255,255,0.7)'
                  : '1px solid rgba(255,255,255,0.18)',
              boxShadow:
                productType === 'only_glass'
                  ? '0 0 15px rgba(255,255,255,0.2), inset 0 0 15px rgba(255,255,255,0.15)'
                  : 'none',
            }}
          >
            {/* Sadece Cam Seçeneğinde 4 Köşe Cam Tutucu Braket (Pabuç) Görünümü */}
            {productType === 'only_glass' && (
              <>
                <div className="absolute top-1.5 left-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-700 border border-white/60 shadow" />
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-700 border border-white/60 shadow" />
                <div className="absolute bottom-1.5 left-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-700 border border-white/60 shadow" />
                <div className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full bg-gradient-to-br from-zinc-200 via-zinc-400 to-zinc-700 border border-white/60 shadow" />
              </>
            )}

            {/* Parlak Diagonal Yansıma Çizgileri */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.01] via-white/[0.18] to-white/[0.02] mix-blend-overlay" />
            <div className="absolute top-0 -left-[30%] w-[60%] h-[300%] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent transform -skew-x-[25deg] -translate-y-[30%]" />
            <div className="absolute top-0 left-[25%] w-[25%] h-[300%] bg-gradient-to-r from-transparent via-white/[0.16] to-transparent transform -skew-x-[25deg] -translate-y-[30%] animate-pulse" />

            {/* SCHOTT ROBAX® Su İşareti */}
            <div className="z-10 text-[7px] sm:text-[9px] font-black tracking-widest text-white bg-black/65 px-1.5 py-0.5 rounded border border-white/20 uppercase select-none font-mono self-start shadow-xs">
              SCHOTT ROBAX®
            </div>

            {/* 4mm Cam Seramik Etiketi */}
            <div className="z-10 text-[6px] sm:text-[8px] font-bold text-amber-300 font-mono self-end bg-black/50 px-1.5 py-0.5 rounded-xs">
              4 mm Cam Seramik
            </div>
          </div>

          {/* KATMAN 3: Z-20 - Metal Şömine Kapağı Frame PNG'si (SADECE KAPAK EKLENDİĞİNDE GÖSTERİLİR) */}
          {hasCover && (
            <img
              src={isArch ? FIREBASE_KAVISLI_KAPAK_URL : FIREBASE_KARE_KAPAK_URL}
              alt={isArch ? 'Kavisli Şömine Kapağı' : 'Kare Şömine Kapağı'}
              width={800}
              height={533}
              className="absolute inset-0 w-full h-full object-fill pointer-events-none z-20 select-none transition-all duration-300"
              style={{
                filter:
                  selectedCoverColorId === 'bronze_patina'
                    ? 'sepia(0.55) saturate(1.4) hue-rotate(340deg) brightness(1.05)'
                    : 'none',
              }}
            />
          )}

          {/* Çift Kanat Açılır Kapak ise Orta Birleşim Hattı ve Çift Kulp */}
          {hasCover && selectedCoverModelId === 'double_door' && (
            <div
              className="absolute z-25 pointer-events-none flex items-center justify-center"
              style={{
                left: `calc(${currentOpening.left + currentOpening.width / 2}% - 3px)`,
                top: `${currentOpening.top}%`,
                width: '6px',
                height: `${currentOpening.height}%`,
              }}
            >
              <div className="w-full h-full bg-[#18181b] border-x border-white/20 shadow-md relative flex items-center justify-center">
                <div className="absolute right-[8px] w-[4px] h-8 rounded-xs bg-gradient-to-r from-zinc-700 via-zinc-400 to-zinc-800 shadow border border-black/40" />
                <div className="absolute left-[8px] w-[4px] h-8 rounded-xs bg-gradient-to-r from-zinc-800 via-zinc-400 to-zinc-700 shadow border border-black/40" />
              </div>
            </div>
          )}

          {/* KATMAN 4: Z-30 - Dinamik Ölçü Okları ve cm Etiketleri (Kapak seçiliyse Dış Metal Çerçeve, Sadece Cam ise Cam Açıklığı Sınırlarında) */}
          
          {/* TABAN GENİŞLİK OKU (G) - Çerçevenin/Camın altında tuğla zemin üzerinde yer alır */}
          <div
            className="absolute flex items-center pointer-events-none z-30 transition-all duration-300"
            style={{
              left: `${activeArrowBounds.left}%`,
              width: `${activeArrowBounds.width}%`,
              top: `calc(${activeArrowBounds.top + activeArrowBounds.height}% + 10px)`,
            }}
          >
            <div className="absolute -top-2 left-0 w-[1px] h-2.5 bg-amber-400/90" />
            <div className="absolute -top-2 right-0 w-[1px] h-2.5 bg-amber-400/90" />

            <div className="relative w-full flex items-center justify-between">
              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-r-[7px] border-r-amber-400 shrink-0 drop-shadow-[0_0_2px_#C58A2B]" />
              <div className="flex-1 h-[2px] bg-amber-400 shadow-[0_0_6px_#C58A2B]" />
              <div className="px-2 py-0.5 rounded-md bg-stone-950/95 border border-amber-500/80 text-white font-mono text-[10px] sm:text-xs font-bold shadow-lg flex items-center gap-1 mx-1.5 shrink-0 whitespace-nowrap backdrop-blur-xs">
                <span className="text-amber-400 font-bold">G:</span>
                <span>{displayG} cm</span>
              </div>
              <div className="flex-1 h-[2px] bg-amber-400 shadow-[0_0_6px_#C58A2B]" />
              <div className="w-0 h-0 border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent border-l-[7px] border-l-amber-400 shrink-0 drop-shadow-[0_0_2px_#C58A2B]" />
            </div>
          </div>

          {/* SOL KENAR DİKEY YÜKSEKLİK OKU (Tüm modellerde SOL taraftaki tuğla zemin üzerinde, sol dış kenara tam yapışık ve paralel) */}
          <div
            className="absolute flex flex-col items-center pointer-events-none z-30 transition-all duration-300"
            style={{
              top: `${activeArrowBounds.sideTop}%`,
              height: `${activeArrowBounds.sideHeight}%`,
              right: `calc(${100 - activeArrowBounds.left}% + 1px)`,
            }}
          >
            {/* Omuz hizası yatay kılavuz çizgisi */}
            <div className="absolute top-0 -right-2 w-3 h-[1px] bg-amber-400" />
            {/* Taban dış kenarı yatay kılavuz çizgisi */}
            <div className="absolute bottom-0 -right-2 w-3 h-[1px] bg-amber-400" />

            <div className="relative h-full flex flex-col items-center justify-between">
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-amber-400 shrink-0 drop-shadow-[0_0_2px_#C58A2B]" />
              <div className="flex-1 w-[2px] bg-amber-400 shadow-[0_0_6px_#C58A2B]" />
              <div className="px-1.5 py-0.5 rounded-md bg-stone-950/95 border border-amber-500/80 text-white font-mono text-[10px] sm:text-xs font-bold shadow-lg flex items-center gap-1 my-1 shrink-0 whitespace-nowrap backdrop-blur-xs">
                <span className="text-amber-400 font-bold">
                  {isArch ? 'Y1:' : 'Y:'}
                </span>
                <span>{displayY} cm</span>
              </div>
              <div className="flex-1 w-[2px] bg-amber-400 shadow-[0_0_6px_#C58A2B]" />
              <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[7px] border-t-amber-400 shrink-0 drop-shadow-[0_0_2px_#C58A2B]" />
            </div>
          </div>

          {/* KAVİSLİ SEÇENEKTE: ORTA KAVİS TEPE NOKTASI ÖLÇÜ OKU (Y2) - Kapak dış üst tepe noktası ile alt taban sınırı arası */}
          {isArch && (
            <div
              className="absolute flex flex-col items-center pointer-events-none z-35 transition-all duration-300"
              style={{
                left: `${activeArrowBounds.left + activeArrowBounds.width / 2}%`,
                top: `${activeArrowBounds.top}%`,
                height: `${activeArrowBounds.height}%`,
                transform: 'translateX(-50%)',
              }}
            >
              {/* Tepe kavis yatay rehber çizgisi */}
              <div className="absolute top-0 -left-4 w-8 h-[1.5px] bg-amber-300 drop-shadow" />
              {/* Taban yatay rehber çizgisi */}
              <div className="absolute bottom-0 -left-4 w-8 h-[1.5px] bg-amber-300 drop-shadow" />

              <div className="relative h-full flex flex-col items-center justify-between">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[7px] border-b-amber-300 shrink-0 drop-shadow-[0_0_3px_#C58A2B]" />
                <div className="flex-1 w-[2px] border-l-2 border-dashed border-amber-300 shadow-[0_0_8px_#C58A2B]" />
                
                {/* Y2 Tepe Rozeti */}
                <div className="px-2 py-0.5 rounded-md bg-stone-950/95 border-2 border-amber-400 text-white font-mono text-[10px] sm:text-xs font-bold shadow-xl flex items-center gap-1 my-1 shrink-0 whitespace-nowrap backdrop-blur-md">
                  <span className="text-amber-400 font-black">Y2:</span>
                  <span>{displayY2} cm</span>
                  <span className="text-[8px] text-amber-200 font-sans font-normal">(Tepe)</span>
                </div>

                <div className="flex-1 w-[2px] border-l-2 border-dashed border-amber-300 shadow-[0_0_8px_#C58A2B]" />
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[7px] border-t-amber-300 shrink-0 drop-shadow-[0_0_3px_#C58A2B]" />
              </div>
            </div>
          )}

          {/* SAĞ ÜST KÖŞE EYLEM BUTONLARI (Sosyal Paylaşım & Admin) */}
          <div className="absolute top-3 right-3 flex items-center gap-2 z-40">
            {/* Sosyal Paylaşım Butonu */}
            <div className="relative">
              <button
                type="button"
                onClick={handleShare}
                className="px-2.5 py-1.5 rounded-lg bg-black/65 hover:bg-black/85 text-amber-300 hover:text-amber-200 border border-amber-400/40 hover:border-amber-400/70 backdrop-blur-md transition-all shadow-md flex items-center gap-1.5 text-xs font-semibold cursor-pointer active:scale-95 select-none"
                title="Şömine Camı & Kapak Hesaplayıcıyı Paylaş"
                aria-label="Paylaş"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-emerald-300 text-[11px] font-bold">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-[11px] font-semibold">Paylaş</span>
                  </>
                )}
              </button>

              {/* Kopyalandı Bildirim Rozeti (Fallback için) */}
              {isCopied && (
                <div className="absolute right-0 top-full mt-1.5 px-2 py-1 rounded bg-stone-900 border border-emerald-500/60 text-emerald-300 text-[10px] font-medium shadow-xl whitespace-nowrap animate-fadeIn">
                  Link kopyalandı!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* KONTROL & HESAPLAMA PANELİ */}
        {/* ============================================================== */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* ============================================================== */}
          {/* 1. ÜRÜN TİPİ SEÇİMİ */}
          {/* ============================================================== */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
              <span>ÜRÜN TİPİ SEÇİMİ</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIncludeCover(false)}
                className={`py-3.5 px-3 sm:px-4 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  !includeCover
                    ? 'bg-[#C58A2B]/5 border-[#C58A2B] text-stone-900 shadow-xs ring-1 ring-[#C58A2B]/20 font-bold'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300 font-semibold'
                }`}
              >
                <span className="text-xs sm:text-sm">Sadece Cam</span>
              </button>
              <button
                type="button"
                onClick={() => setIncludeCover(true)}
                className={`py-3.5 px-3 sm:px-4 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  includeCover
                    ? 'bg-[#C58A2B]/5 border-[#C58A2B] text-stone-900 shadow-xs ring-1 ring-[#C58A2B]/20 font-bold'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300 font-semibold'
                }`}
              >
                <span className="text-xs sm:text-sm">Cam + Çerçeve</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 2. KESİM ŞEKLİ SEÇİMİ */}
          {/* ============================================================== */}
          <div className="space-y-2">
            <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
              <span>KESİM ŞEKLİ</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleGlassShapeChange('square')}
                className={`py-3.5 px-3 sm:px-4 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  glassShape === 'square'
                    ? 'bg-[#C58A2B]/5 border-[#C58A2B] text-stone-900 shadow-xs ring-1 ring-[#C58A2B]/20 font-bold'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300 font-semibold'
                }`}
              >
                <span className="text-xs sm:text-sm tracking-wide uppercase font-bold">DİKDÖRTGEN</span>
              </button>
              <button
                type="button"
                onClick={() => handleGlassShapeChange('arch')}
                className={`py-3.5 px-3 sm:px-4 rounded-xl border-2 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  glassShape === 'arch'
                    ? 'bg-[#C58A2B]/5 border-[#C58A2B] text-stone-900 shadow-xs ring-1 ring-[#C58A2B]/20 font-bold'
                    : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300 font-semibold'
                }`}
              >
                <span className="text-xs sm:text-sm tracking-wide uppercase font-bold">OVAL / KAVİSLİ</span>
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 3. ÖLÇÜ GİRDİLERİ (CM) */}
          {/* ============================================================== */}
          <div className="space-y-3">
            {/* Genişlik & Yükseklik Yan Yana */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* GENİŞLİK (CM) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                  <Ruler className="w-3.5 h-3.5 text-[#C58A2B]" />
                  <span>GENİŞLİK (CM)</span>
                </label>
                <div className="flex items-center bg-gray-50/80 hover:bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 shadow-2xs focus-within:border-[#C58A2B] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#C58A2B] transition-all">
                  <input
                    type="text"
                    inputMode="decimal"
                    max={196}
                    value={widthInput}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    onBlur={handleWidthBlur}
                    placeholder="Örn: 60"
                    className="w-full text-left pl-1 text-sm font-bold text-gray-900 bg-transparent focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-gray-400 pr-1 shrink-0">cm</span>
                </div>
              </div>

              {/* YÜKSEKLİK (CM) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                  <Ruler className="w-3.5 h-3.5 text-[#C58A2B]" />
                  <span>YÜKSEKLİK (CM)</span>
                </label>
                <div className="flex items-center bg-gray-50/80 hover:bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 shadow-2xs focus-within:border-[#C58A2B] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#C58A2B] transition-all">
                  <input
                    type="text"
                    inputMode="decimal"
                    max={110}
                    value={heightInput}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    onBlur={handleHeightBlur}
                    placeholder="Örn: 40"
                    className="w-full text-left pl-1 text-sm font-bold text-gray-900 bg-transparent focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-gray-400 pr-1 shrink-0">cm</span>
                </div>
              </div>
            </div>

            {/* ORTA UÇ ÖLÇÜSÜ (CM) - Sadece Oval/Kavisli Seçili İken Alta Gelir ve Tam Genişlik Kaplar */}
            {isArch && (
              <div className="space-y-1 animate-fadeIn pt-1">
                <label className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wide">
                  <Ruler className="w-3.5 h-3.5 text-[#C58A2B]" />
                  <span>ORTA UÇ ÖLÇÜSÜ (CM)</span>
                </label>
                <div className="flex items-center bg-gray-50/80 hover:bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 shadow-2xs focus-within:border-[#C58A2B] focus-within:bg-white focus-within:ring-1 focus-within:ring-[#C58A2B] transition-all">
                  <input
                    type="text"
                    inputMode="decimal"
                    max={110}
                    value={y2Input}
                    onChange={(e) => handleY2Change(e.target.value)}
                    onBlur={handleY2Blur}
                    placeholder="Örn: 45"
                    className="w-full text-left pl-1 text-sm font-bold text-gray-900 bg-transparent focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-gray-400 pr-1 shrink-0">cm</span>
                </div>
              </div>
            )}

            {/* Maksimum Ölçü Sınırı Uyarı Metni */}
            {dimensionLimitWarning && (
              <div className="flex items-center gap-1.5 mt-2 p-2 rounded-lg bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-medium animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                <span>{dimensionLimitWarning}</span>
              </div>
            )}

            {/* Kavisli için Yardımcı Bilgilendirme Notu */}
            {isArch && (
              <p className="text-[10px] text-amber-800 mt-2 bg-amber-50/30 p-2.5 rounded-xl border border-amber-200/50 leading-relaxed shadow-3xs">
                💡 <strong>Kavisli Kemer Hesabı:</strong> Camın ve kapağın düz yan kenar yüksekliği (<strong>Y1</strong>) ile merkezdeki en yüksek kavis tepe noktası (<strong>Y2</strong>) milimetrik olarak CNC şablon kesimle üretilir.
              </p>
            )}
          </div>

          {/* ============================================================== */}
          {/* AKORDİYON: ÖZELLİK EKLE (Kapak Açılış Modeli & Rengi) */}
          {/* ============================================================== */}
          {hasCover && (
            <div className="border border-orange-200 rounded-xl overflow-hidden bg-orange-50/10 shadow-3xs transition-all">
              <button
                type="button"
                onClick={() => setIsFeaturesAccordionOpen((prev) => !prev)}
                className="w-full px-3.5 py-2.5 flex items-center justify-between text-left cursor-pointer hover:bg-orange-50/20 transition-colors select-none"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 shrink-0">
                    {isFeaturesAccordionOpen ? (
                      <ChevronDown className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-gray-800">
                    Özellik Ekle
                  </span>
                  <span className="text-[10px] text-gray-400 font-normal">
                    (Kapak modeli & rengi)
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                    isFeaturesAccordionOpen ? 'rotate-180 text-orange-600' : ''
                  }`}
                />
              </button>

              {isFeaturesAccordionOpen && (
                <div className="p-3.5 pt-1 space-y-3 border-t border-orange-100 animate-fadeIn">
                  {/* Kapak Açılış Modeli */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-gray-700 block">Kapak Açılış Modeli</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {COVER_MODELS.map((model) => (
                        <button
                          key={model.id}
                          type="button"
                          onClick={() => setSelectedCoverModelId(model.id)}
                          className={`p-2.5 rounded-lg border text-left text-[11px] transition-all cursor-pointer ${
                            selectedCoverModelId === model.id
                              ? 'border-[#C58A2B] bg-[#C58A2B]/5 font-semibold text-stone-900 shadow-2xs'
                              : 'border-gray-200 bg-white/70 hover:bg-white text-gray-700'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="truncate">{model.name}</span>
                            {model.additionalPrice > 0 && (
                              <span className="text-[10px] text-[#C58A2B] font-mono font-bold shrink-0 ml-1">
                                +{model.additionalPrice} TL
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Kapak Metal Rengi */}
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-gray-700 block">Kapak Metal Rengi</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {COVER_COLORS.map((color) => (
                        <button
                          key={color.id}
                          type="button"
                          onClick={() => setSelectedCoverColorId(color.id)}
                          className={`p-2 rounded-lg border text-left text-[11px] flex items-center gap-2 transition-all cursor-pointer ${
                            selectedCoverColorId === color.id
                              ? 'border-[#C58A2B] bg-[#C58A2B]/5 font-semibold text-stone-900 shadow-2xs'
                              : 'border-gray-200 bg-white/70 hover:bg-white text-gray-700'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-gray-400 shrink-0"
                            style={{ backgroundColor: color.colorCode }}
                          />
                          <span className="truncate">{color.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================== */}
          {/* 4. TOPTAN İNDİRİM BİLGİSİ */}
          {/* ============================================================== */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-950 leading-relaxed shadow-3xs">
            <span className="text-sm shrink-0">💡</span>
            <span>10 adet ve üzeri alımlarda %15 toptan indirim uygulanır.</span>
          </div>

          {/* ============================================================== */}
          {/* 5. ADET SEÇİMİ */}
          {/* ============================================================== */}
          <div className="flex items-center justify-between border-t border-b border-gray-100 py-3.5">
            <label className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
              <span>ADET SEÇİMİ</span>
            </label>
            
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-1 w-28 sm:w-32 shadow-2xs select-none shrink-0">
              <button
                type="button"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                disabled={quantity <= 1}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all ${
                  quantity <= 1
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-orange-700 hover:bg-orange-100 cursor-pointer active:scale-95'
                }`}
                aria-label="Azalt"
              >
                −
              </button>
              <span className="font-mono text-xs sm:text-sm font-black text-gray-900 flex-1 text-center">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-sm sm:text-base text-orange-700 hover:bg-orange-100 transition-all cursor-pointer active:scale-95"
                aria-label="Artır"
              >
                +
              </button>
            </div>
          </div>

          {/* ============================================================== */}
          {/* 6. TAHMİNİ TUTAR KARTI (Koyu renkli şık kart) */}
          {/* ============================================================== */}
          <div className="bg-[#0B132B] rounded-2xl p-4 sm:p-5 text-white shadow-lg shadow-slate-950/20 mb-3 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.01] to-white/[0.04] pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10 gap-3">
              <div className="space-y-1">
                <div className="text-xs font-black text-slate-300 tracking-wider uppercase">
                  TAHMİNİ TUTAR ({quantity} ADET)
                </div>
                <div className="text-[11px] text-slate-400 font-semibold tracking-wide">
                  KDV Dahil{hasInputDimensions && calculatedAreaM2 > 0 ? ` • ${calculatedAreaM2.toFixed(2)} m²` : ''}
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-3xl sm:text-4xl font-black text-white font-sans tracking-tight flex items-baseline justify-end gap-1.5">
                  {hasInputDimensions && grandTotal > 0 ? (
                    <>
                      <span>{formatTL(grandTotal)}</span>
                      <span className="text-[#F59E0B] font-bold text-2xl sm:text-3xl">TL</span>
                    </>
                  ) : (
                    <>
                      <span>0</span>
                      <span className="text-[#F59E0B] font-bold text-2xl sm:text-3xl">TL</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Ölçü girildiğinde hesaplama detayları */}
            {hasInputDimensions && grandTotal > 0 && (
              <div className="mt-3.5 space-y-1.5 border-t border-white/10 pt-3 text-[10px] sm:text-[11px] text-stone-400 relative z-10 animate-fadeIn">
                <div className="flex justify-between gap-4">
                  <span>Hesaplanan Cam Alanı:</span>
                  <span className="font-mono text-white">{calculatedAreaM2} m² (Min: {settings.minBillableAreaM2} m²)</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Isı Cam Bedeli ({quantity} Adet):</span>
                  <span className="font-mono text-white">{formatTL(totalGlassPrice)} TL</span>
                </div>
                {hasCover && (
                  <div className="flex justify-between gap-4">
                    <span>Çerçeve & İşçilik Bedeli ({quantity} Adet):</span>
                    <span className="font-mono text-white">{formatTL(totalCoverPriceBeforeDiscount)} TL</span>
                  </div>
                )}
                {coverDiscount > 0 && (
                  <div className="flex justify-between gap-4 text-emerald-400">
                    <span>%15 Toplu Alım İndirimi:</span>
                    <span className="font-mono font-bold">-{formatTL(coverDiscount)} TL</span>
                  </div>
                )}
                <div className="flex justify-between gap-4 border-t border-white/5 pt-1.5 text-stone-300">
                  <span>KDV (%{Math.round(settings.kdvRate * 100)}):</span>
                  <span className="font-mono">{formatTL(kdvAmount)} TL</span>
                </div>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* MÜŞTERİ BİLGİ GİRİŞ FORMU (3 KOLONLU RESPONSIVE GRID) */}
          {/* ============================================================== */}
          <div className="pt-3 border-t border-gray-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-gray-800 flex items-center gap-2">
                <span>MÜŞTERİ BİLGİLERİ DOLDURMA</span>
              </span>
              <span className="text-[10px] text-amber-800 bg-amber-50/50 border border-amber-200/60 px-2.5 py-0.5 rounded-full font-bold">
                * Zorunlu Alanlar
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {/* Kolon 1: Ad Soyad */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1">
                  <User className="w-3 h-3 text-gray-400" />
                  <span>Ad Soyad *</span>
                </label>
                <div
                  className={`flex items-center bg-white border rounded-xl px-3 py-2 shadow-2xs transition-all ${
                    formErrors.name
                      ? 'border-amber-600 ring-1 ring-amber-500/30 bg-amber-50/15'
                      : 'border-gray-200 focus-within:border-[#C58A2B] focus-within:ring-1 focus-within:ring-[#C58A2B]'
                  }`}
                >
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (formErrors.name) setFormErrors((prev) => ({ ...prev, name: false }));
                    }}
                    placeholder="Adınız Soyadınız"
                    className="w-full text-xs font-medium text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Kolon 2: Telefon Numarası */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-gray-400" />
                  <span>Telefon Numarası *</span>
                </label>
                <div
                  className={`flex items-center bg-white border rounded-xl px-3 py-2 shadow-2xs transition-all ${
                    formErrors.phone
                      ? 'border-amber-600 ring-1 ring-amber-500/30 bg-amber-50/15'
                      : 'border-gray-200 focus-within:border-[#C58A2B] focus-within:ring-1 focus-within:ring-[#C58A2B]'
                  }`}
                >
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (formErrors.phone) setFormErrors((prev) => ({ ...prev, phone: false }));
                    }}
                    placeholder="05XX XXX XX XX"
                    className="w-full text-xs font-medium text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400 font-mono"
                  />
                </div>
              </div>

              {/* Kolon 3: İl / İlçe / Açık Adres */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-gray-400" />
                  <span>Teslimat Adresi *</span>
                </label>
                <div
                  className={`flex items-center bg-white border rounded-xl px-3 py-2 shadow-2xs transition-all ${
                    formErrors.address
                      ? 'border-amber-600 ring-1 ring-amber-500/30 bg-amber-50/15'
                      : 'border-gray-200 focus-within:border-[#C58A2B] focus-within:ring-1 focus-within:ring-[#C58A2B]'
                  }`}
                >
                  <input
                    type="text"
                    required
                    value={customerAddress}
                    onChange={(e) => {
                      setCustomerAddress(e.target.value);
                      if (formErrors.address) setFormErrors((prev) => ({ ...prev, address: false }));
                    }}
                    placeholder="Örn: Erzurum / Pasinler, Atatürk Cad. No:12"
                    className="w-full text-xs font-medium text-gray-900 bg-transparent focus:outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            {/* Hata Mesajı Uyarısı */}
            {validationErrorMessage && (
              <div className="flex items-center gap-1.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-medium animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>{validationErrorMessage}</span>
              </div>
            )}
          </div>

          {/* ============================================================== */}
          {/* 8. SİPARİŞ BUTONU (SİPARİŞ VER) & PDF İNDİR BUTONLARI */}
          {/* ============================================================== */}
          <div className="pt-2 space-y-2.5">
            {/* Başarı Bildirimi */}
            {submissionSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{submissionSuccessMessage}</span>
              </div>
            )}

            {/* SİPARİŞ BUTONU */}
            <button
              type="button"
              onClick={handleWhatsAppOrder}
              disabled={isSubmittingToDb}
              className="w-full py-4 px-6 rounded-full bg-[#C58A2B] hover:bg-[#b07823] text-white font-extrabold text-base sm:text-lg tracking-wider flex items-center justify-center gap-3 shadow-md shadow-amber-900/10 transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              {isSubmittingToDb ? (
                <Loader2 className="w-5.5 h-5.5 animate-spin text-white shrink-0" />
              ) : (
                <svg
                  className="w-5.5 h-5.5 text-white fill-current shrink-0"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
                </svg>
              )}
              <span className="tracking-widest uppercase font-black text-white text-base sm:text-lg">
                {isSubmittingToDb ? 'KAYDEDİLİYOR...' : 'SİPARİŞ VER'}
              </span>
            </button>

            {/* SİPARİŞ FORMU (PDF) İNDİR */}
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isSubmittingToDb}
              className="w-full py-3.5 px-5 rounded-full border-2 border-[#C58A2B]/40 bg-amber-50/5 hover:bg-amber-50/15 text-stone-800 font-bold text-xs sm:text-sm tracking-wider flex items-center justify-between shadow-2xs transition-all transform active:scale-[0.99] cursor-pointer disabled:opacity-50"
            >
              <div className="flex items-center gap-2.5">
                <FileDown className="w-5 h-5 text-[#C58A2B] shrink-0" />
                <span className="text-stone-800 font-extrabold uppercase">SİPARİŞ FORMU (PDF) İNDİR</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#C58A2B]" />
            </button>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SEO & GEO-SEO: SON OLUŞTURULAN TEKLİFLER & REFERANS ÖLÇÜLER */}
      {/* ============================================================== */}
      <section className="mt-8 bg-white rounded-2xl sm:rounded-3xl border border-gray-200/90 shadow-md p-5 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C58A2B]" />
              <span>Son Oluşturulan Teklifler ve Referans Ölçüler</span>
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Türkiye genelinden şömine camı ve özel kapak siparişi veren müşterilerimizin anonimleştirilmiş son teknik imalat ölçüleri
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Canlı Sipariş Akışı</span>
          </div>
        </div>

        {/* Canlı Mikro Teklif Kartları Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {recentQuotes.map((quote) => (
            <div
              key={quote.id}
              className="bg-stone-50/70 hover:bg-amber-50/30 border border-gray-200/80 hover:border-amber-300 rounded-xl p-3.5 transition-all shadow-3xs flex flex-col justify-between gap-2.5 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                    <MapPin className="w-3.5 h-3.5 text-[#C58A2B] shrink-0" />
                    <span>{quote.city} / {quote.district}</span>
                  </div>
                  <span className="text-[10px] text-amber-800 font-semibold bg-amber-100/70 px-2 py-0.5 rounded-full shrink-0">
                    {quote.productType === 'arch_cover'
                      ? 'Kavisli Kemer'
                      : quote.productType === 'square_cover'
                      ? 'Kare Kapak'
                      : 'Düz Cam'}
                  </span>
                </div>

                <h3 className="text-xs font-semibold text-gray-800 group-hover:text-[#8B5E19] transition-colors leading-snug">
                  {quote.title}
                </h3>

                <div className="mt-2 bg-white/90 border border-gray-200/60 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-gray-500 font-sans font-medium text-[10px]">İmalat Ölçüleri:</span>
                  <span className="font-bold text-gray-900">{quote.dimensionsText}</span>
                </div>

                <p className="text-[11px] text-gray-600 mt-2 leading-relaxed">
                  <strong>Özellikler:</strong> {quote.featuresText}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-200/50 text-[10px] text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span>{quote.timeAgoText}</span>
                </span>
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Truck className="w-3 h-3 text-emerald-600" />
                  <span>Ahşap Sandıkta Güvenli Sevkiyat</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Güvenlik & KVKK Bilgilendirme Rozeti */}
        <div className="bg-amber-50/40 border border-amber-200/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-gray-600">
          <ShieldCheck className="w-4 h-4 text-[#C58A2B] shrink-0 mt-0.5" />
          <div className="leading-snug text-[11px]">
            <strong>KVKK & Gizlilik Güvencesi:</strong> Yukarıdaki referans siparişler müşteri gizliliği gereğince kişisel verilerden tamamen arındırılarak sadece teknik imalat boyutları ve ilçe bilgileriyle yayınlanmaktadır. Tüm camlarımız 800°C ısı şokuna dayanıklı orijinal <strong>SCHOTT ROBAX®</strong> seramik camdır.
          </div>
        </div>

        {/* Schema.org JSON-LD Structured Data (Google Geo & Product SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'SCHOTT ROBAX® Isıya Dayanıklı Şömine Camı & Özel Şömine Kapağı',
              description:
                'Özel ölçüye göre üretilen 4 mm SCHOTT ROBAX® ısıya dayanıklı düz ve kavisli (kemerli) şömine camları, emniyet contalı şömine kapakları ve CNC kesim imalatı.',
              brand: {
                '@type': 'Brand',
                name: 'SCHOTT ROBAX®',
              },
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'TRY',
                lowPrice: '1062',
                highPrice: '15000',
                offerCount: recentQuotes.length.toString(),
                offers: recentQuotes.slice(0, 5).map((q) => ({
                  '@type': 'Offer',
                  name: `${q.city} ${q.district} - ${q.title}`,
                  itemOffered: {
                    '@type': 'IndividualProduct',
                    name: q.title,
                    description: `${q.dimensionsText} - ${q.featuresText}`,
                  },
                  areaServed: {
                    '@type': 'AdministrativeArea',
                    name: `${q.city}, Türkiye`,
                  },
                  availability: 'https://schema.org/InStock',
                })),
              },
            }),
          }}
        />
      </section>

    </div>
  );
};
