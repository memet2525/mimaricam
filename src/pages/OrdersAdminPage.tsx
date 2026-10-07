import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from '../router/Router';
import { db } from '../config/firebase';
import { SeoHead } from '../components/seo/SeoHead';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
} from 'firebase/firestore';
import {
  Lock,
  Eye,
  EyeOff,
  LogOut,
  RefreshCw,
  Search,
  Mail,
  Send,
  Check,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  X,
  Phone,
  MessageCircle,
  FileText,
  Layers,
  Settings,
  DollarSign,
  Printer,
  ChevronDown,
  Calendar,
  Flame,
  ArrowRight,
  Package,
} from 'lucide-react';
import { emailNotificationService } from '../services/emailNotificationService';

// Sabit Yönetici Giriş Şifresi
const AUTHORIZED_PASSWORD = 'meh246890met';
const AUTH_STORAGE_KEY = 'mimaricam_orders_auth_token';
const SUPPLIER_EMAIL_STORAGE_KEY = 'mimaricam_supplier_email';
const DEFAULT_SUPPLIER_EMAIL = 'imalat@mimaricam.com';
const CLOUD_FUNCTION_EMAIL_URL =
  'https://us-central1-mimaricam-7dbd6.cloudfunctions.net/sendOrderEmail';

export type OrderStatus =
  | 'new'
  | 'preparing'
  | 'shipping'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: string;
  quoteNumber: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  projectLocation?: string;
  city?: string;
  district?: string;
  status: OrderStatus | string;
  offeredPrice?: number;
  totalPrice?: number;
  currency?: string;
  model?: string;
  dimensions?: {
    g?: string | number;
    y?: string | number;
    y1?: string | number;
    y2?: string | number;
    widthMm?: number;
    heightMm?: number;
    centerArchMm?: number;
    formatted?: string;
  };
  orderDetails?: {
    camModeli?: string;
    olculer?: string;
    adet?: number;
    fiyat?: string;
  };
  adminNotes?: string;
  items?: Array<{
    id?: string;
    productTitle?: string;
    quantity?: number;
    unitPrice?: number;
    totalPrice?: number;
    notes?: string;
    designConfig?: {
      shape?: string;
      glassTypeName?: string;
      thicknessMm?: number;
      widthMm?: number;
      heightMm?: number;
      centerArchMm?: number;
      edgeFinish?: string;
      calculatedAreaM2?: number;
      notes?: string;
    };
  }>;
  supplierEmailSent?: boolean;
  supplierEmailSentAt?: string;
  supplierEmailRecipient?: string;
  createdAt: string;
  updatedAt?: string;
}

// Statü etiket ve renk eşleşmeleri (Referans görseldeki yumuşak pill stilinde)
export const STATUS_MAP: Record<
  OrderStatus,
  { label: string; pillClass: string; textClass: string }
> = {
  new: {
    label: 'Yeni',
    pillClass: 'border-amber-400/90 text-amber-700 bg-white hover:bg-amber-50/50',
    textClass: 'text-amber-700',
  },
  preparing: {
    label: 'Hazırlanıyor',
    pillClass: 'border-orange-400/90 text-orange-700 bg-white hover:bg-orange-50/50',
    textClass: 'text-orange-700',
  },
  shipping: {
    label: 'Kargoda',
    pillClass: 'border-purple-400/90 text-purple-700 bg-white hover:bg-purple-50/50',
    textClass: 'text-purple-700',
  },
  completed: {
    label: 'Tamamlandı',
    pillClass: 'border-emerald-400/90 text-emerald-700 bg-white hover:bg-emerald-50/50',
    textClass: 'text-emerald-700',
  },
  cancelled: {
    label: 'İptal',
    pillClass: 'border-red-400/90 text-red-700 bg-white hover:bg-red-50/50',
    textClass: 'text-red-700',
  },
};

// Statü normalizasyonu
export function normalizeStatus(rawStatus?: string): OrderStatus {
  if (!rawStatus) return 'new';
  const s = rawStatus.toLowerCase().trim();
  if (['new', 'yeni', 'pending', 'in_review', 'beklemede'].includes(s))
    return 'new';
  if (
    ['preparing', 'hazirlaniyor', 'hazırlanıyor', 'quoted', 'approved'].includes(
      s
    )
  )
    return 'preparing';
  if (['shipping', 'kargoda', 'kargoya verildi'].includes(s)) return 'shipping';
  if (['completed', 'tamamlandi', 'tamamlandı', 'delivered'].includes(s))
    return 'completed';
  if (['cancelled', 'iptal', 'rejected'].includes(s)) return 'cancelled';
  return 'new';
}

export function formatTL(amount?: number): string {
  if (typeof amount !== 'number' || isNaN(amount)) return '0 TL';
  return `${amount.toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} TL`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return '-';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleString('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateString;
  }
}

// Yardımcı: Müşteri Adı
export function getCustomerName(order: OrderItem): string {
  return (
    order.clientName ||
    order.customerName ||
    'İsimsiz Müşteri'
  ).trim();
}

// Yardımcı: Müşteri Telefonu
export function getCustomerPhone(order: OrderItem): string {
  return (
    order.clientPhone ||
    order.customerPhone ||
    ''
  ).trim();
}

// Yardımcı: Teslimat Adresi
export function getCustomerAddress(order: OrderItem): string {
  if (order.customerAddress && order.customerAddress.trim()) {
    return order.customerAddress.trim();
  }
  if (order.projectLocation && order.projectLocation.trim()) {
    return order.projectLocation.trim();
  }
  const parts = [order.district, order.city].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : 'Adres belirtilmedi';
}

// Yardımcı: Ürün Başlığı (Görseldeki "800°C Isıya Dayanıklı Seramik Şömine Camı")
export function getProductTitle(order: OrderItem): string {
  const firstTitle = order.items?.[0]?.productTitle;
  if (firstTitle && firstTitle.trim()) return firstTitle.trim();
  if (order.model && order.model.trim()) return order.model.trim();
  return '800°C Isıya Dayanıklı Seramik Şömine Camı';
}

// Yardımcı: Ürün Tipi (Sadece Cam / Cam + Çerçeve)
export function getProductType(order: OrderItem): string {
  const model = (order.model || '').toLowerCase();
  const notes = (order.adminNotes || '').toLowerCase();
  const firstTitle = (order.items?.[0]?.productTitle || '').toLowerCase();

  if (
    model.includes('kapak') ||
    model.includes('cerceve') ||
    model.includes('çerçeve') ||
    notes.includes('kapak: pirinç') ||
    notes.includes('kapak: siyah') ||
    notes.includes('kapak: eskitme') ||
    notes.includes('özel çerçeveli') ||
    firstTitle.includes('kapak')
  ) {
    return 'Cam + Çerçeve (Kapaklı Model)';
  }
  return 'Sadece Cam (Düz / Özel Kesim Cam Plaka)';
}

// Yardımcı: Kesim Şekli
export function getCutShape(order: OrderItem): {
  shape: 'rectangle' | 'curved' | 'oval';
  label: string;
} {
  const firstItem = order.items?.[0];
  const designShape = firstItem?.designConfig?.shape?.toLowerCase();
  const model = (order.model || '').toLowerCase();
  const notes = (order.adminNotes || '').toLowerCase();

  if (
    designShape === 'curved' ||
    model.includes('kemer') ||
    model.includes('kavis') ||
    notes.includes('y2:')
  ) {
    return { shape: 'curved', label: 'Kavisli / Kemerli' };
  }
  if (designShape === 'oval' || model.includes('oval') || model.includes('elips')) {
    return { shape: 'oval', label: 'Oval / Elips' };
  }
  return { shape: 'rectangle', label: 'Düz Kesim' };
}

// Yardımcı: Net Ölçüler Metni
export function getDimensionsText(order: OrderItem): string {
  if (order.dimensions?.formatted) return order.dimensions.formatted;

  const d = order.dimensions;
  if (d && (d.g || d.y || d.y1)) {
    if (d.y2) {
      return `G: ${d.g} cm | Y1: ${d.y1 || d.y} cm | Y2: ${d.y2} cm`;
    }
    return `${d.g} x ${d.y1 || d.y} cm`;
  }

  const firstItem = order.items?.[0]?.designConfig;
  if (firstItem && firstItem.widthMm && firstItem.heightMm) {
    const gCm = (firstItem.widthMm / 10).toFixed(1);
    const yCm = (firstItem.heightMm / 10).toFixed(1);
    if (firstItem.centerArchMm) {
      const y2Cm = (firstItem.centerArchMm / 10).toFixed(1);
      return `G: ${gCm} cm | Y1: ${yCm} cm | Y2: ${y2Cm} cm`;
    }
    return `${gCm} x ${yCm} cm`;
  }

  if (order.adminNotes && order.adminNotes.includes('Ölçüler:')) {
    const match = order.adminNotes.match(/Ölçüler:[^|]+/);
    if (match) return match[0].replace('Ölçüler:', '').trim();
  }

  return '52.5 x 41.5 cm';
}

// Yardımcı: Adet
export function getOrderQuantity(order: OrderItem): number {
  if (order.orderDetails?.adet && typeof order.orderDetails.adet === 'number') {
    return order.orderDetails.adet;
  }
  if (order.items && order.items.length > 0) {
    const sum = order.items.reduce(
      (acc, it) => acc + (it.quantity && it.quantity > 0 ? it.quantity : 1),
      0
    );
    if (sum > 0) return sum;
  }
  return 1;
}

// Yardımcı: Temiz Fiyatsız İmalat Notu (Gizlilik Kuralı)
export function getCleanManufacturingNotes(order: OrderItem): string {
  const rawNotes = order.adminNotes || order.items?.[0]?.notes || '';
  if (!rawNotes) return 'Standart rodajlı kenarlar, montaja hazır teslimat.';

  const clean = rawNotes
    .split('|')
    .map((p) => p.trim())
    .filter(
      (p) =>
        !p.toLowerCase().includes('tutar') &&
        !p.toLowerCase().includes('fiyat') &&
        !p.toLowerCase().includes('tl') &&
        !p.toLowerCase().includes('kdv') &&
        !p.toLowerCase().includes('kar') &&
        !p.toLowerCase().includes('maliyet')
    )
    .join(' | ');

  return clean || 'Standart imalat kurallarına uygun kesim ve kenar işleme.';
}

export const OrdersAdminPage: React.FC = () => {
  const { navigate } = useRouter();

  // 1. GÜVENLİK VE GİRİŞ SİSTEMİ
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem(AUTH_STORAGE_KEY) === AUTHORIZED_PASSWORD
      );
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // 2. SİPARİŞ VERİLERİ VE CANLI SENKRONİZASYON
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<
    'all' | 'new' | 'preparing' | 'shipping' | 'completed' | 'cancelled'
  >('all');

  // 3. TEDARİKÇİ E-POSTA AYARI
  const [supplierEmail, setSupplierEmail] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return (
        localStorage.getItem(SUPPLIER_EMAIL_STORAGE_KEY) ||
        DEFAULT_SUPPLIER_EMAIL
      );
    }
    return DEFAULT_SUPPLIER_EMAIL;
  });
  const [isEditingSupplierEmail, setIsEditingSupplierEmail] = useState(false);
  const [supplierEmailInput, setSupplierEmailInput] = useState(supplierEmail);
  const [supplierEmailSavedSuccess, setSupplierEmailSavedSuccess] =
    useState(false);

  // 4. E-POSTA GÖNDERİM DURUMLARI
  const [sendingEmailOrderId, setSendingEmailOrderId] = useState<string | null>(
    null
  );
  const [emailNotificationMsg, setEmailNotificationMsg] = useState<{
    orderId: string;
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  // 5. DETAY MODALI VE ETİKET YAZDIRMA MODALI
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [labelOrder, setLabelOrder] = useState<OrderItem | null>(null);

  // Oturum Giriş Kontrolü
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === AUTHORIZED_PASSWORD) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, AUTHORIZED_PASSWORD);
      }
      setIsAuthenticated(true);
      setAuthError(null);
      setPasswordInput('');
    } else {
      setAuthError('Hatalı Giriş Şifresi!');
    }
  };

  // Oturum Çıkış
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
    setIsAuthenticated(false);
  };

  // Tedarikçi E-posta Kaydetme
  const handleSaveSupplierEmail = () => {
    const clean = supplierEmailInput.trim().toLowerCase();
    if (!clean || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setEmailNotificationMsg({
        orderId: 'supplier_email',
        text: 'Lütfen geçerli bir e-posta adresi giriniz.',
        type: 'error',
      });
      return;
    }
    setSupplierEmail(clean);
    if (typeof window !== 'undefined') {
      localStorage.setItem(SUPPLIER_EMAIL_STORAGE_KEY, clean);
    }
    try {
      setDoc(
        doc(db, 'settings', 'supplier_config'),
        {
          supplierEmail: clean,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (e) {
      console.warn('Firestore settings/supplier_config notice:', e);
    }

    setIsEditingSupplierEmail(false);
    setSupplierEmailSavedSuccess(true);
    setTimeout(() => setSupplierEmailSavedSuccess(false), 3000);
  };

  // Firestore Realtime onSnapshot Dinleyici (orders ve siparisler koleksiyonları)
  useEffect(() => {
    if (!isAuthenticated) return;
    setLoadingOrders(true);

    const ordersMap = new Map<string, OrderItem>();

    const updateCombinedList = () => {
      const list = Array.from(ordersMap.values());
      list.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setOrders(list);
      setLoadingOrders(false);

      setSelectedOrder((prev) => {
        if (!prev) return null;
        return list.find((it) => it.id === prev.id) || prev;
      });
    };

    const processDoc = (d: any): OrderItem => {
      const data = d.data();
      return {
        ...data,
        id: d.id,
        quoteNumber:
          data.quoteNumber ||
          `GO-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${d.id.substring(0, 6).toUpperCase()}`,
        clientName: data.clientName || data.customerName || 'Müşteri',
        clientPhone: data.clientPhone || data.customerPhone || '',
        status: normalizeStatus(data.status),
        offeredPrice:
          typeof data.offeredPrice === 'number'
            ? data.offeredPrice
            : typeof data.totalPrice === 'number'
            ? data.totalPrice
            : 0,
        createdAt:
          data.createdAt?.toDate?.()?.toISOString() ||
          data.createdAtIso ||
          data.createdAt ||
          new Date().toISOString(),
      } as OrderItem;
    };

    // 1. orders koleksiyonu canlı dinleyici
    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        snapshot.docs.forEach((d) => {
          ordersMap.set(d.id, processDoc(d));
        });
        updateCombinedList();
      },
      (error) => {
        console.error('Firestore orders subscription error:', error);
        setLoadingOrders(false);
      }
    );

    // 2. siparisler koleksiyonu canlı dinleyici
    const unsubSiparisler = onSnapshot(
      collection(db, 'siparisler'),
      (snapshot) => {
        snapshot.docs.forEach((d) => {
          if (!ordersMap.has(d.id)) {
            ordersMap.set(d.id, processDoc(d));
          }
        });
        updateCombinedList();
      },
      (error) => {
        console.warn('Firestore siparisler subscription notice:', error);
      }
    );

    return () => {
      unsubOrders();
      unsubSiparisler();
    };
  }, [isAuthenticated]);

  // Statü Güncelleme (Anında Firestore Senkronizasyonu - orders ve siparisler)
  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      const updatePayload = {
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      await Promise.allSettled([
        setDoc(doc(db, 'orders', orderId), updatePayload, { merge: true }),
        setDoc(doc(db, 'siparisler', orderId), updatePayload, { merge: true }),
      ]);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      }
    } catch (err) {
      console.error('Statü güncelleme hatası:', err);
      setEmailNotificationMsg({
        orderId,
        text: 'Statü güncellenirken hata oluştu.',
        type: 'error',
      });
    }
  };

  // Tedarikçiye E-posta Gönderme (GİZLİLİK KURALI: 100% FİYATSIZ İMALAT EMRİ)
  const handleSendSupplierEmail = async (order: OrderItem) => {
    const orderId = order.id;
    setSendingEmailOrderId(orderId);
    setEmailNotificationMsg(null);

    const customerName = getCustomerName(order);
    const customerPhone = getCustomerPhone(order);
    const customerAddress = getCustomerAddress(order);
    const productType = getProductType(order);
    const shape = getCutShape(order);
    const dimensionsText = getDimensionsText(order);
    const quantity = getOrderQuantity(order);
    const cleanNotes = getCleanManufacturingNotes(order);
    const formattedDate = formatDate(order.createdAt);
    const glassSpec = '4 mm ROBAX (800°C Isıya Dayanıklı Seramik Cam)';

    // E-posta Konusu (Subject): MİMARİCAM - YENİ İMALAT SİPARİŞİ
    const emailSubject = 'MİMARİCAM - YENİ İMALAT SİPARİŞİ';

    // Fiyatsız İmalat Metni (Plain Text)
    const plainText = [
      `🚨 MİMARİCAM - YENİ İMALAT SİPARİŞİ`,
      `==================================================`,
      `Sipariş / İmalat Kodu : ${order.quoteNumber}`,
      `Sipariş Tarihi        : ${formattedDate}`,
      `--------------------------------------------------`,
      `MÜŞTERİ BİLGİLERİ:`,
      `Müşteri Adı Soyadı    : ${customerName}`,
      `İletişim Telefonu     : ${customerPhone}`,
      `Teslimat Açık Adresi  : ${customerAddress}`,
      `--------------------------------------------------`,
      `İMALAT VE KESİM BİLGİLERİ (FİYATSIZ):`,
      `Ürün Tipi             : ${productType}`,
      `Kesim Şekli           : ${shape.label}`,
      `Net Ölçüler           : ${dimensionsText}`,
      `Cam Özelliği          : ${glassSpec}`,
      `Sipariş Adeti         : ${quantity} Adet`,
      `Özel İmalat Notu      : ${cleanNotes}`,
      `==================================================`,
      `DİKKAT: Bu e-posta MimariCam İmalat Paneli üzerinden tedarikçi fabrikaya iletilmiştir. Fiyat ve tutar içermez.`,
    ].join('\n');

    // 1. emailNotificationService üzerinden Cloud Function ve Proxy çağrısı
    try {
      await emailNotificationService.sendOrderEmail(order as any, [supplierEmail]);
    } catch (cfErr) {
      console.warn('sendOrderEmail notice:', cfErr);
    }

    // 2. Firestore'da sipariş üzerine "Tedarikçiye Gönderildi" işaretle (orders ve siparisler)
    try {
      const nowIso = new Date().toISOString();
      const emailSentPayload = {
        supplierEmailSent: true,
        supplierEmailSentAt: nowIso,
        supplierEmailRecipient: supplierEmail,
      };

      await Promise.allSettled([
        setDoc(doc(db, 'orders', orderId), emailSentPayload, { merge: true }),
        setDoc(doc(db, 'siparisler', orderId), emailSentPayload, { merge: true }),
      ]);

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                supplierEmailSent: true,
                supplierEmailSentAt: nowIso,
                supplierEmailRecipient: supplierEmail,
              }
            : o
        )
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) =>
          prev
            ? {
                ...prev,
                supplierEmailSent: true,
                supplierEmailSentAt: nowIso,
                supplierEmailRecipient: supplierEmail,
              }
            : null
        );
      }
    } catch (dbErr) {
      console.warn('Firestore sipariş işareti güncellenemedi:', dbErr);
    }

    setSendingEmailOrderId(null);
    setEmailNotificationMsg({
      orderId,
      text: `İmalat emri ${supplierEmail} adresine iletildi!`,
      type: 'success',
    });

    // Otomatik mailto istemcisini tetikle
    try {
      const mailtoUrl = `mailto:${encodeURIComponent(
        supplierEmail
      )}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(plainText)}`;
      const mailLink = document.createElement('a');
      mailLink.href = mailtoUrl;
      mailLink.click();
    } catch {
      // ignore
    }

    setTimeout(() => {
      setEmailNotificationMsg(null);
    }, 4500);
  };

  // WhatsApp Müşteri Mesajı
  const handleOpenWhatsApp = (order: OrderItem) => {
    const rawPhone = getCustomerPhone(order);
    const cleanPhone = rawPhone.replace(/\D/g, '');
    if (!cleanPhone) {
      setEmailNotificationMsg({
        orderId: order.id,
        text: 'Müşteriye ait geçerli bir telefon numarası bulunamadı.',
        type: 'error',
      });
      return;
    }

    const fullPhone = cleanPhone.startsWith('90')
      ? cleanPhone
      : cleanPhone.startsWith('0')
      ? `90${cleanPhone.slice(1)}`
      : `90${cleanPhone}`;

    const customerName = getCustomerName(order);
    const statusLabel = STATUS_MAP[normalizeStatus(order.status)].label;
    const dimensionsText = getDimensionsText(order);
    const productTitle = getProductTitle(order);

    const message = [
      `Merhaba Sayın ${customerName},`,
      ``,
      `MimariCam üzerinden vermiş olduğunuz ${order.quoteNumber} numaralı siparişinizin güncel durumu: *${statusLabel.toUpperCase()}*`,
      ``,
      `📦 *Ürün:* ${productTitle}`,
      `📏 *Ölçüler:* ${dimensionsText}`,
      ``,
      `Siparişinizle ilgili herhangi bir sorunuz olursa doğrudan bu WhatsApp hattımızdan bize iletebilirsiniz.`,
      `MimariCam İyi Günler Diler!`,
    ].join('\n');

    try {
      const waLink = document.createElement('a');
      waLink.href = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
      waLink.target = '_blank';
      waLink.rel = 'noopener noreferrer';
      waLink.click();
    } catch {
      // ignore
    }
  };

  // 2. ÜST DİNAMİK İSTATİSTİK KARTLARI (CANLI ÖZET HESAPLAMALARI)
  const stats = useMemo(() => {
    let totalCount = orders.length;
    let newCount = 0;
    let preparingCount = 0;
    let shippingCount = 0;
    let completedCount = 0;
    let totalRevenue = 0;

    orders.forEach((o) => {
      const s = normalizeStatus(o.status);
      if (s === 'new') newCount++;
      else if (s === 'preparing') preparingCount++;
      else if (s === 'shipping') shippingCount++;
      else if (s === 'completed') completedCount++;

      // İptal edilenler cirodan otomatik düşer
      if (s !== 'cancelled') {
        const price =
          typeof o.offeredPrice === 'number'
            ? o.offeredPrice
            : typeof o.totalPrice === 'number'
            ? o.totalPrice
            : 0;
        totalRevenue += price;
      }
    });

    return {
      totalCount,
      newCount,
      preparingCount,
      shippingCount,
      completedCount,
      totalRevenue,
    };
  }, [orders]);

  // Filtrelenmiş ve Aranmış Siparişler
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const s = normalizeStatus(order.status);
      if (activeTab !== 'all' && s !== activeTab) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const name = getCustomerName(order).toLowerCase();
        const phone = getCustomerPhone(order).toLowerCase();
        const no = (order.quoteNumber || '').toLowerCase();
        const address = getCustomerAddress(order).toLowerCase();
        if (
          !name.includes(q) &&
          !phone.includes(q) &&
          !no.includes(q) &&
          !address.includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  // GİRİŞ EKRANI (ŞİFRE KORUMASI)
  const seoData = {
    title: 'Sipariş Yönetim Paneli | MimariCam',
    description: 'Yönetici İmalat ve Sipariş Takip Paneli',
    canonical: 'https://mimaricam.com/siparisler',
    h1: 'Sipariş Yönetimi',
    noindex: true,
  };

  if (!isAuthenticated) {
    return (
      <>
        <SeoHead seo={seoData} />
        <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-stone-950 flex items-center justify-center p-4 sm:p-6 select-none font-sans">
        <div className="w-full max-w-md">
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#C58B38] mx-auto mb-4 shadow-inner">
                <Lock className="w-8 h-8 text-[#C58B38]" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Sipariş Yönetim & İmalat Paneli
              </h1>
              <p className="text-xs text-gray-400 mt-1.5 font-medium">
                Sadece yetkili personel erişimine açıktır
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              {authError && (
                <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-800/80 flex items-center gap-2.5 text-red-300 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{authError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider">
                  Yönetici Şifresi
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (authError) setAuthError(null);
                    }}
                    placeholder="Erişim şifrenizi giriniz..."
                    autoFocus
                    className="w-full px-4 py-3.5 pr-11 bg-gray-950/80 border border-gray-700/80 rounded-xl text-white text-sm placeholder-gray-500 focus:outline-none focus:border-[#C58B38] focus:ring-1 focus:ring-[#C58B38] transition-all font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#B97F24] via-[#C58A2B] to-[#D89B3D] hover:from-[#A8721E] hover:to-[#C58A2B] text-white font-black text-sm tracking-wide shadow-lg shadow-amber-950/30 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Güvenli Giriş Yap</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
                >
                  ← MimariCam Ana Sayfasına Dön
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </>
    );
  }

  // ANA YÖNETİM PANELİ (GİRİŞ YAPILDIĞINDA)
  return (
    <>
      <SeoHead seo={seoData} />
      <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-amber-100 selection:text-[#C58B38] pb-16">
      {/* ÜST BAR (BAŞLIK & ÇIKIŞ YAP) */}
      <header className="sticky top-0 z-40 bg-gray-900 border-b border-gray-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-[#C58B38] shrink-0">
              <Layers className="w-5 h-5 text-[#C58B38]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-white tracking-tight truncate">
                  Sipariş Yönetim & İmalat Paneli
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold shrink-0">
                  CANLI
                </span>
              </div>
              <p className="text-[11px] text-gray-400 truncate">
                mimaricam.com • İmalat Emirleri & Müşteri Sipariş Takibi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate('/boss')}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700 transition-colors"
            >
              <span>Ana Admin</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>🔒 Çıkış Yap</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* ============================================================== */}
        {/* 2. ÜST DİNAMİK İSTATİSTİK KARTLARI (CANLI ÖZET)                  */}
        {/* ============================================================== */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {/* Kart 1: TOPLAM SİPARİŞ */}
          <div
            onClick={() => setActiveTab('all')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              activeTab === 'all'
                ? 'bg-gray-900 text-white border-gray-900 ring-2 ring-gray-900 shadow-md'
                : 'bg-white hover:bg-gray-50 border-gray-200 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                Toplam Sipariş
              </span>
              <FileText className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              {stats.totalCount}
            </div>
            <div className="text-[10px] text-gray-400 mt-1">Sistemdeki tümü</div>
          </div>

          {/* Kart 2: YENİ (Mavi) */}
          <div
            onClick={() => setActiveTab('new')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              activeTab === 'new'
                ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500 shadow-md'
                : 'bg-blue-50/50 hover:bg-blue-100/60 border-blue-200 text-blue-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-80">
                Yeni
              </span>
              <AlertCircle className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              {stats.newCount}
            </div>
            <div className="text-[10px] opacity-75 mt-1">İşlem bekliyor</div>
          </div>

          {/* Kart 3: HAZIRLANIYOR (Turuncu) */}
          <div
            onClick={() => setActiveTab('preparing')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              activeTab === 'preparing'
                ? 'bg-amber-600 text-white border-amber-600 ring-2 ring-amber-500 shadow-md'
                : 'bg-amber-50/60 hover:bg-amber-100/60 border-amber-200 text-amber-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-80">
                Hazırlanıyor
              </span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              {stats.preparingCount}
            </div>
            <div className="text-[10px] opacity-75 mt-1">Kesim / İmalatta</div>
          </div>

          {/* Kart 4: KARGODA (Mor) */}
          <div
            onClick={() => setActiveTab('shipping')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              activeTab === 'shipping'
                ? 'bg-purple-600 text-white border-purple-600 ring-2 ring-purple-500 shadow-md'
                : 'bg-purple-50/50 hover:bg-purple-100/60 border-purple-200 text-purple-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-80">
                Kargoda
              </span>
              <Truck className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              {stats.shippingCount}
            </div>
            <div className="text-[10px] opacity-75 mt-1">Yolda / Sevk edildi</div>
          </div>

          {/* Kart 5: TAMAMLANDI (Yeşil) */}
          <div
            onClick={() => setActiveTab('completed')}
            className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
              activeTab === 'completed'
                ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500 shadow-md'
                : 'bg-emerald-50/50 hover:bg-emerald-100/60 border-emerald-200 text-emerald-950'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider opacity-80">
                Tamamlandı
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl sm:text-3xl font-black tracking-tight">
              {stats.completedCount}
            </div>
            <div className="text-[10px] opacity-75 mt-1">Teslim edildi</div>
          </div>

          {/* Kart 6: TOPLAM CİRO (Aktif Satış Tutarı) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-900 to-gray-900 border border-gray-800 text-white shadow-xs col-span-2 sm:col-span-1 lg:col-span-1">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-400">
                Toplam Ciro
              </span>
              <DollarSign className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight truncate">
              {formatTL(stats.totalRevenue)}
            </div>
            <div className="text-[10px] text-gray-400 mt-1">
              İptaller hariç net KDV dahil
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. TEDARİKÇİ E-POSTA AYARI & İMALAT EMRİ İLETİM ÇUBUĞU             */}
        {/* ============================================================== */}
        <section className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C58B38] shrink-0">
                <Mail className="w-5 h-5 text-[#C58B38]" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-black text-gray-900 tracking-tight flex items-center gap-2">
                  <span>Tedarikçi & Fabrika E-Posta Entegrasyonu</span>
                  {supplierEmailSavedSuccess && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Kaydedildi</span>
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-gray-500">
                  İmalat emirleri doğrudan bu adrese <strong>fiyatsız</strong>{' '}
                  olarak iletilir (Gizlilik Kuralı garantili).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {isEditingSupplierEmail ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <input
                    type="email"
                    value={supplierEmailInput}
                    onChange={(e) => setSupplierEmailInput(e.target.value)}
                    placeholder="imalat@mimaricam.com"
                    className="px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs text-gray-900 font-mono focus:outline-none focus:border-[#C58B38] w-full sm:w-64"
                  />
                  <button
                    type="button"
                    onClick={handleSaveSupplierEmail}
                    className="px-3.5 py-2 bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer"
                  >
                    Kaydet
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingSupplierEmail(false);
                      setSupplierEmailInput(supplierEmail);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-700 rounded-xl hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between md:justify-end gap-3 w-full sm:w-auto bg-gray-50 border border-gray-200 px-3.5 py-2 rounded-xl">
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-gray-800 truncate">
                    <span className="text-gray-400 font-sans text-[11px] font-normal">
                      Kayıtlı:
                    </span>
                    <span className="truncate">{supplierEmail}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsEditingSupplierEmail(true)}
                    className="text-xs font-bold text-[#C58B38] hover:underline shrink-0"
                  >
                    Değiştir
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. ARAMA & STATÜ SEKMELERİ                                        */}
        {/* ============================================================== */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {[
              { id: 'all', label: `Tümü (${stats.totalCount})` },
              { id: 'new', label: `Yeni (${stats.newCount})` },
              {
                id: 'preparing',
                label: `Hazırlanıyor (${stats.preparingCount})`,
              },
              { id: 'shipping', label: `Kargoda (${stats.shippingCount})` },
              {
                id: 'completed',
                label: `Tamamlandı (${stats.completedCount})`,
              },
              {
                id: 'cancelled',
                label: `İptal (${
                  orders.filter((o) => normalizeStatus(o.status) === 'cancelled')
                    .length
                })`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-gray-900 text-white shadow-xs'
                    : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Müşteri, tel, sipariş no ara..."
              className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C58B38] focus:ring-1 focus:ring-[#C58B38]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Global Bildirim */}
        {emailNotificationMsg && (
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs font-bold shadow-xs ${
              emailNotificationMsg.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                : 'bg-red-50 border-red-300 text-red-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{emailNotificationMsg.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setEmailNotificationMsg(null)}
              className="text-gray-400 hover:text-gray-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* SİPARİŞ KARTLARI LİSTESİ (TAM REFERANS GÖRSEL TASARIMI)           */}
        {/* ============================================================== */}
        {loadingOrders ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center">
            <RefreshCw className="w-8 h-8 text-[#C58B38] animate-spin mx-auto mb-3" />
            <p className="text-xs text-gray-500 font-medium">
              Siparişler canlı yükleniyor...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-3xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">
              Kayıtlı Sipariş Bulunamadı
            </h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              {searchQuery
                ? `"${searchQuery}" aramasına uygun sipariş bulunamadı.`
                : 'Bu filtre altında henüz sipariş bulunmamaktadır.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => {
              const currentStatus = normalizeStatus(order.status);
              const statusConfig = STATUS_MAP[currentStatus];
              const customerName = getCustomerName(order);
              const customerPhone = getCustomerPhone(order);
              const productTitle = getProductTitle(order);
              const shape = getCutShape(order);
              const dimensionsText = getDimensionsText(order);
              const quantity = getOrderQuantity(order);
              const isSendingThis = sendingEmailOrderId === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white border border-gray-200/90 rounded-[28px] p-5 sm:p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3.5">
                    {/* 1. SATIR: Sipariş No & Statü Dropdown (Pill) */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-base sm:text-lg text-gray-900 tracking-tight">
                        {order.quoteNumber}
                      </span>

                      {/* Statü Pill Dropdown (Referans görseldeki oval açılır buton) */}
                      <div className="relative">
                        <select
                          value={currentStatus}
                          onChange={(e) =>
                            handleStatusChange(
                              order.id,
                              e.target.value as OrderStatus
                            )
                          }
                          className={`appearance-none border ${statusConfig.pillClass} font-semibold text-xs py-1.5 pl-3.5 pr-7 rounded-full cursor-pointer focus:outline-none shadow-2xs transition-colors`}
                        >
                          <option value="new">Yeni</option>
                          <option value="preparing">Hazırlanıyor</option>
                          <option value="shipping">Kargoda</option>
                          <option value="completed">Tamamlandı</option>
                          <option value="cancelled">İptal</option>
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-amber-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>

                    {/* 2. SATIR: Tarih Satırı */}
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium -mt-1">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>

                    {/* 3. SATIR: Müşteri Bilgi Kutusu (Açık Gri Yuvarlatılmış Kutu) */}
                    <div className="bg-[#F8F9FA] border border-gray-100 rounded-2xl p-3 sm:p-3.5 space-y-1">
                      <h4 className="font-bold text-sm sm:text-base text-gray-900 leading-snug">
                        {customerName}
                      </h4>
                      {customerPhone ? (
                        <a
                          href={`tel:${customerPhone}`}
                          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#059669] font-mono font-medium hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#059669]" />
                          <span>{customerPhone}</span>
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">
                          Telefon belirtilmedi
                        </span>
                      )}
                    </div>

                    {/* 4. SATIR: Ürün & İmalat Bilgisi (Alev İkonlu Sarı Kutu) */}
                    <div className="flex items-start gap-3 pt-1">
                      {/* Sol Alev Rozeti */}
                      <div className="w-12 h-12 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center justify-center text-[#D97706] shrink-0 shadow-2xs">
                        <Flame className="w-6 h-6 text-[#D97706] fill-[#FDE68A]/60 stroke-[1.8]" />
                      </div>

                      {/* Sağ Ürün Detayı */}
                      <div className="min-w-0 flex-1">
                        <h5 className="font-black text-xs sm:text-sm text-gray-900 leading-tight line-clamp-1">
                          {productTitle}
                        </h5>
                        <p className="text-xs text-gray-500 font-medium mt-0.5">
                          {quantity} Adet • {dimensionsText} • {shape.label}
                        </p>
                        {/* Admin Fiyat Satırı (Yönetici Görünümü) */}
                        <p className="font-black text-xs sm:text-sm text-gray-900 mt-1">
                          {formatTL(order.offeredPrice || order.totalPrice)}{' '}
                          <span className="text-gray-500 font-normal text-xs">
                            (Havale / Kapıda Ödeme)
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 5 & 6. SATIRLAR: Eylemler Bölümü */}
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    {/* 4'lü Buton Grubu: DETAY | ARA | WHATS... | ETİKET */}
                    <div className="grid grid-cols-4 gap-2">
                      {/* Buton 1: DETAY */}
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="bg-[#F1F5F9] hover:bg-[#E2E8F0] active:scale-95 text-slate-700 font-bold text-[11px] py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="Sipariş Detaylarını İncele"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-600" />
                        <span>DETAY</span>
                      </button>

                      {/* Buton 2: ARA */}
                      {customerPhone ? (
                        <a
                          href={`tel:${customerPhone}`}
                          className="bg-[#ECFDF5] hover:bg-[#D1FAE5] active:scale-95 text-[#047857] font-bold text-[11px] py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                          title="Müşteriyi Telefonla Ara"
                        >
                          <Phone className="w-3.5 h-3.5 text-[#047857]" />
                          <span>ARA</span>
                        </a>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-100 text-gray-400 font-bold text-[11px] py-2 px-1 rounded-xl flex items-center justify-center gap-1 opacity-60"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>ARA</span>
                        </button>
                      )}

                      {/* Buton 3: WHATS... */}
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsApp(order)}
                        className="bg-[#F0FDFA] hover:bg-[#CCFBF1] active:scale-95 text-[#0F766E] font-bold text-[11px] py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                        title="WhatsApp Sipariş Durum Mesajı Gönder"
                      >
                        <Send className="w-3.5 h-3.5 text-[#0F766E]" />
                        <span>WHATS...</span>
                      </button>

                      {/* Buton 4: ETİKET (Yazdırılabilir Kargo / İmalat Etiketi) */}
                      <button
                        type="button"
                        onClick={() => setLabelOrder(order)}
                        className="bg-[#0F172A] hover:bg-black active:scale-95 text-white font-bold text-[11px] py-2 px-1 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
                        title="Kargo ve İmalat Etiketi Oluştur / Yazdır"
                      >
                        <Printer className="w-3.5 h-3.5 text-white" />
                        <span>ETİKET</span>
                      </button>
                    </div>

                    {/* Alt Geniş Buton: [✉️ TEDARİKÇİYE E-POSTA] (FİYATSIZ İMALAT EMRİ) */}
                    <button
                      type="button"
                      disabled={isSendingThis}
                      onClick={() => handleSendSupplierEmail(order)}
                      className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.99] cursor-pointer ${
                        order.supplierEmailSent
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                      }`}
                      title="İmalat emrini tedarikçiye fiyatsız olarak ilet"
                    >
                      {isSendingThis ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>İletiliyor...</span>
                        </>
                      ) : order.supplierEmailSent ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-200" />
                          <span>✓ TEDARİKÇİYE GÖNDERİLDİ</span>
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          <span>✉️ TEDARİKÇİYE E-POSTA</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ============================================================== */}
      {/* 5. SİPARİŞ DETAY MODALI (POPUP)                                 */}
      {/* ============================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col justify-between">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-900 text-white flex items-center justify-between border-b border-gray-800 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-[#C58B38] flex items-center justify-center font-bold">
                  MC
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base">
                    Sipariş Detayı & İmalat Emri
                  </h3>
                  <p className="text-[11px] text-gray-400 font-mono">
                    Ref: {selectedOrder.quoteNumber} •{' '}
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              {/* Üst Statü & Hızlı İşlem */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-600">
                    Sipariş Durumu:
                  </span>
                  <select
                    value={normalizeStatus(selectedOrder.status)}
                    onChange={(e) =>
                      handleStatusChange(
                        selectedOrder.id,
                        e.target.value as OrderStatus
                      )
                    }
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer ${
                      STATUS_MAP[normalizeStatus(selectedOrder.status)].pillClass
                    }`}
                  >
                    <option value="new">Yeni</option>
                    <option value="preparing">Hazırlanıyor</option>
                    <option value="shipping">Kargoda</option>
                    <option value="completed">Tamamlandı</option>
                    <option value="cancelled">İptal</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenWhatsApp(selectedOrder)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </button>
                  {getCustomerPhone(selectedOrder) && (
                    <a
                      href={`tel:${getCustomerPhone(selectedOrder)}`}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Ara</span>
                    </a>
                  )}
                </div>
              </div>

              {/* 📐 ŞEMATİK KESİM ÖNİZLEMESİ */}
              <div className="border border-gray-200 rounded-2xl p-5 bg-gradient-to-b from-stone-50 to-amber-50/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                    <span>📐 Kesim & Form Şematik Önizlemesi</span>
                  </span>
                  <span className="text-xs font-bold text-[#C58B38] bg-white border border-amber-200 px-2 py-0.5 rounded-lg shadow-2xs">
                    {getCutShape(selectedOrder).label}
                  </span>
                </div>

                <div className="h-44 w-full flex items-center justify-center bg-white rounded-xl border border-gray-200/80 p-4 relative shadow-inner">
                  {(() => {
                    const shapeInfo = getCutShape(selectedOrder);
                    const dims = selectedOrder.dimensions || {};
                    const gText = dims.g ? `${dims.g} cm` : 'G';
                    const y1Text = dims.y1 || dims.y ? `${dims.y1 || dims.y} cm` : 'Y1';
                    const y2Text = dims.y2 ? `${dims.y2} cm` : 'Y2';

                    if (shapeInfo.shape === 'curved') {
                      return (
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                          <svg
                            viewBox="0 0 300 130"
                            className="w-56 h-28 stroke-[#C58B38] fill-amber-500/10 stroke-2 drop-shadow-xs"
                          >
                            <path d="M 30,110 L 30,55 Q 150,15 270,55 L 270,110 Z" />
                          </svg>
                          <div className="absolute top-1 text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded border border-amber-300">
                            Merkez Kemer (Y2): {y2Text}
                          </div>
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-gray-700 bg-white px-1 py-0.2 rounded border">
                            Y1: {y1Text}
                          </div>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-gray-700 bg-white px-1 py-0.2 rounded border">
                            Y1: {y1Text}
                          </div>
                          <div className="absolute bottom-1 text-[11px] font-mono font-bold text-gray-800 bg-white px-2 py-0.5 rounded border">
                            Genişlik (G): {gText}
                          </div>
                        </div>
                      );
                    }

                    if (shapeInfo.shape === 'oval') {
                      return (
                        <div className="relative w-full h-full flex flex-col items-center justify-center">
                          <svg
                            viewBox="0 0 300 130"
                            className="w-56 h-28 stroke-[#C58B38] fill-amber-500/10 stroke-2 drop-shadow-xs"
                          >
                            <ellipse cx="150" cy="65" rx="120" ry="50" />
                          </svg>
                          <div className="absolute top-2 text-[10px] font-mono font-bold text-gray-700 bg-white px-1.5 py-0.5 rounded border">
                            Yükseklik: {y1Text}
                          </div>
                          <div className="absolute bottom-2 text-[11px] font-mono font-bold text-gray-800 bg-white px-2 py-0.5 rounded border">
                            Genişlik: {gText}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div className="relative w-full h-full flex flex-col items-center justify-center">
                        <svg
                          viewBox="0 0 300 130"
                          className="w-56 h-28 stroke-[#C58B38] fill-amber-500/10 stroke-2 drop-shadow-xs"
                        >
                          <rect x="40" y="20" width="220" height="90" rx="4" />
                        </svg>
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-gray-700 bg-white px-1 py-0.5 rounded border">
                          Y: {y1Text}
                        </div>
                        <div className="absolute bottom-1 text-[11px] font-mono font-bold text-gray-800 bg-white px-2 py-0.5 rounded border">
                          G: {gText}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="text-center font-mono font-bold text-xs text-gray-800">
                  {getDimensionsText(selectedOrder)}
                </div>
              </div>

              {/* Müşteri ve Adres Bilgisi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">
                    Müşteri Bilgileri
                  </h4>
                  <div className="text-xs space-y-1">
                    <p>
                      <strong>Ad Soyad:</strong> {getCustomerName(selectedOrder)}
                    </p>
                    <p>
                      <strong>Telefon:</strong>{' '}
                      <a
                        href={`tel:${getCustomerPhone(selectedOrder)}`}
                        className="text-blue-600 font-mono font-bold hover:underline"
                      >
                        {getCustomerPhone(selectedOrder)}
                      </a>
                    </p>
                    <p>
                      <strong>E-Posta:</strong>{' '}
                      {selectedOrder.clientEmail || 'info@mimaricam.com'}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2">
                  <h4 className="text-xs font-black uppercase text-gray-500 tracking-wider">
                    Teslimat Adresi
                  </h4>
                  <p className="text-xs text-gray-800 leading-relaxed font-medium">
                    {getCustomerAddress(selectedOrder)}
                  </p>
                </div>
              </div>

              {/* Fiyatlandırma Dökümü (Admin Görünümü - SADECE BURADA YER ALIR) */}
              <div className="bg-emerald-50/50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider">
                    💰 Satış Fiyatı ve KDV Dökümü (Yönetici Görünümü)
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                    KDV Dahil
                  </span>
                </div>
                <div className="flex items-end justify-between pt-2 border-t border-emerald-200/60">
                  <div>
                    <span className="text-xs text-gray-600 block">
                      Müşteri Satış Bedeli:
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-emerald-800">
                      {formatTL(
                        selectedOrder.offeredPrice || selectedOrder.totalPrice
                      )}
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-gray-500">
                    Özel Sipariş Satış Fiyatı
                  </div>
                </div>
              </div>

              {/* Özel İmalat ve Sipariş Notları */}
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-1.5">
                <h4 className="text-xs font-black uppercase text-stone-600 tracking-wider">
                  Özel İmalat ve Kesim Notu
                </h4>
                <p className="text-xs text-stone-800 font-mono leading-relaxed whitespace-pre-wrap">
                  {selectedOrder.adminNotes ||
                    selectedOrder.items?.[0]?.notes ||
                    'Özel not belirtilmemiş.'}
                </p>
              </div>
            </div>

            {/* Modal Footer Eylemleri */}
            <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              <div className="text-xs text-gray-500 font-medium">
                Tedarikçi: <strong>{supplierEmail}</strong>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setLabelOrder(selectedOrder)}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-100 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Etiket</span>
                </button>

                <button
                  type="button"
                  disabled={sendingEmailOrderId === selectedOrder.id}
                  onClick={() => handleSendSupplierEmail(selectedOrder)}
                  className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer ${
                    selectedOrder.supplierEmailSent
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white'
                  }`}
                >
                  {sendingEmailOrderId === selectedOrder.id ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>İletiliyor...</span>
                    </>
                  ) : selectedOrder.supplierEmailSent ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>✓ TEDARİKÇİYE GÖNDERİLDİ</span>
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" />
                      <span>✉️ TEDARİKÇİYE E-POSTA</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 6. KARGO VE İMALAT ETİKETİ YAZDIRMA MODALI (ETİKET BUTONU)      */}
      {/* ============================================================== */}
      {labelOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-gray-900" />
                <h3 className="font-black text-sm text-gray-900">
                  İmalat & Kargo Etiketi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setLabelOrder(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Etiket Önizleme Kartı (Yazdırılabilir Alan) */}
            <div
              id="printable-label"
              className="p-5 border-2 border-dashed border-gray-800 rounded-2xl bg-white space-y-3 font-mono text-xs"
            >
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <div className="font-black text-sm tracking-tight text-gray-900">
                    MİMARİCAM
                  </div>
                  <div className="text-[10px] text-gray-500">
                    Özel Ölçü Seramik & Şömine Camı
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-black text-xs text-gray-900">
                    {labelOrder.quoteNumber}
                  </div>
                  <div className="text-[10px] text-gray-500">
                    {formatDate(labelOrder.createdAt)}
                  </div>
                </div>
              </div>

              {/* Müşteri Bilgisi */}
              <div className="space-y-0.5">
                <div className="text-[10px] text-gray-400 uppercase font-sans font-bold">
                  ALICI:
                </div>
                <div className="font-bold text-sm text-gray-900">
                  {getCustomerName(labelOrder)}
                </div>
                <div className="font-bold text-xs text-gray-800">
                  {getCustomerPhone(labelOrder)}
                </div>
                <div className="text-[11px] text-gray-700 font-sans leading-tight pt-1">
                  {getCustomerAddress(labelOrder)}
                </div>
              </div>

              {/* İmalat Ölçüleri */}
              <div className="pt-2 border-t space-y-1">
                <div className="text-[10px] text-gray-400 uppercase font-sans font-bold">
                  İMALAT & KESİM DETAYI:
                </div>
                <div className="font-black text-sm text-gray-900">
                  {getDimensionsText(labelOrder)}
                </div>
                <div className="text-xs text-gray-700">
                  {getOrderQuantity(labelOrder)} Adet • {getCutShape(labelOrder).label}
                </div>
                <div className="text-[11px] text-gray-600 font-sans">
                  4 mm ROBAX (800°C Isıya Dayanıklı Seramik Cam)
                </div>
              </div>

              {/* Barkod Görsel Simülasyonu */}
              <div className="pt-2 text-center">
                <div className="inline-block tracking-[4px] font-black text-xs border-y border-black py-1 px-4">
                  ||| | | |||| || ||| | ||| |||| |
                </div>
                <div className="text-[9px] text-gray-400 mt-0.5">
                  {labelOrder.quoteNumber}
                </div>
              </div>
            </div>

            {/* Butonlar */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setLabelOrder(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100"
              >
                Kapat
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-5 py-2 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Yazdır</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};
