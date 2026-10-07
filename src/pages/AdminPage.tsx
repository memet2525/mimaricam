import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../router/Router';
import { useAuth } from '../hooks/useAuth';
import { quoteService } from '../services/quoteService';
import { productService } from '../services/productService';
import { imageService, formatSeoFileName } from '../services/imageService';
import { StorageImage } from '../components/common/StorageImage';
import { Quote, Product, Category } from '../types';
import { CATEGORIES, PRODUCTS, GEO_PAGES } from '../data/catalog';
import { testFirestoreConnection, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { generateFireplacePDF } from '../services/pdfService';
import { LegalPagesAdmin } from '../components/admin/LegalPagesAdmin';
import { OrderEmailNotificationsManager } from '../components/admin/OrderEmailNotificationsManager';
import { emailNotificationService, extractOrderDetails } from '../services/emailNotificationService';
import { fireGlassPricingService, CategoryPricingSettings, DEFAULT_FIRE_GLASS_SETTINGS } from '../services/fireGlassPricingService';
import {
  Sliders,
  Flame,
  FileText,
  Package,
  Layers,
  Globe,
  Activity,
  CheckCircle,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Plus,
  RefreshCw,
  LogOut,
  Lock,
  ExternalLink,
  Upload,
  Pencil,
  X,
  Loader2,
  Image as ImageIcon,
  FileDown,
  Scale,
  Mail,
  Send,
  LayoutGrid,
  List,
  Clock,
  User,
  Phone,
  MapPin,
  Save,
  RotateCcw,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { navigate, currentPath } = useRouter();
  const { user, profile, isAdmin, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'products' | 'categories' | 'quotes' | 'seo' | 'legal' | 'health' | 'configurator' | 'fire_pricing'>(
    currentPath.includes('legal-pages') ? 'legal' : 'products'
  );
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);
  const [isLoadingQuotes, setIsLoadingQuotes] = useState(false);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [quotesViewMode, setQuotesViewMode] = useState<'cards' | 'table'>('cards');
  const [productSearchTerm, setProductSearchTerm] = useState('');

  // Selected quote for detail view
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Email sending state for quotes/orders
  const [sendingEmailQuoteId, setSendingEmailQuoteId] = useState<string | null>(null);
  const [emailSendSuccessMsg, setEmailSendSuccessMsg] = useState<string | null>(null);
  const [emailSendErrorMsg, setEmailSendErrorMsg] = useState<string | null>(null);

  // Product Edit Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productFile, setProductFile] = useState<File | null>(null);
  const [productPreviewUrl, setProductPreviewUrl] = useState<string | null>(null);
  const [productAltText, setProductAltText] = useState<string>('');
  const [isUploadingProduct, setIsUploadingProduct] = useState(false);
  const [productUploadProgress, setProductUploadProgress] = useState<number | null>(null);
  const [productSuccessMsg, setProductSuccessMsg] = useState<string | null>(null);
  const [productErrorMsg, setProductErrorMsg] = useState<string | null>(null);
  const productFileInputRef = useRef<HTMLInputElement>(null);

  // Category Edit Modal State
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryFile, setCategoryFile] = useState<File | null>(null);
  const [categoryPreviewUrl, setCategoryPreviewUrl] = useState<string | null>(null);
  const [categoryAltText, setCategoryAltText] = useState<string>('');
  const [isUploadingCategory, setIsUploadingCategory] = useState(false);
  const [categoryUploadProgress, setCategoryUploadProgress] = useState<number | null>(null);
  const [categorySuccessMsg, setCategorySuccessMsg] = useState<string | null>(null);
  const [categoryErrorMsg, setCategoryErrorMsg] = useState<string | null>(null);
  const categoryFileInputRef = useRef<HTMLInputElement>(null);

  // ==============================================================
  // ŞÖMİNE KONFİGÜRATÖRÜ AYARLARI DEVLETİ VE YÖNETİMİ
  // ==============================================================
  interface FireplacePricingSettings {
    whatsappPhone: string;
    baseCoverPricePerM2: number;
    kdvRate: number;
    minBillableAreaM2: number;
    archLaborMultiplier: number;
    archCoverMultiplier: number;
    glassPrices: Record<string, number>;
    coverModelPrices: Record<string, number>;
  }

  const DEFAULT_FIREPLACE_SETTINGS: FireplacePricingSettings = {
    whatsappPhone: '905421452525',
    baseCoverPricePerM2: 60000,
    kdvRate: 0.20,
    minBillableAreaM2: 0.25,
    archLaborMultiplier: 1.25,
    archCoverMultiplier: 1.35,
    glassPrices: {
      'robax_4mm': 28000,
    },
    coverModelPrices: {
      'single_door': 0,
      'double_door': 450,
    },
  };

  const [fireplaceSettings, setFireplaceSettings] = useState<FireplacePricingSettings>(DEFAULT_FIREPLACE_SETTINGS);
  const [isSavingFireplaceSettings, setIsSavingFireplaceSettings] = useState(false);
  const [fireplaceSettingsSuccessMsg, setFireplaceSettingsSuccessMsg] = useState<string | null>(null);
  const [fireplaceSettingsErrorMsg, setFireplaceSettingsErrorMsg] = useState<string | null>(null);

  // Fire Glass & Temperli Cam pricing/measurements settings
  const [fireGlassSettings, setFireGlassSettings] = useState<Record<string, CategoryPricingSettings>>(DEFAULT_FIRE_GLASS_SETTINGS);
  const [isSavingCategory, setIsSavingCategory] = useState<Record<string, boolean>>({});
  const [categorySuccessMsgs, setCategorySuccessMsgs] = useState<Record<string, string | null>>({});
  const [categoryErrorMsgs, setCategoryErrorMsgs] = useState<Record<string, string | null>>({});

  useEffect(() => {
    const loadFireGlassSettings = async () => {
      try {
        const data = await fireGlassPricingService.getAllSettings();
        setFireGlassSettings(data);
      } catch (err) {
        console.error('Error loading fire glass pricing settings:', err);
      }
    };
    loadFireGlassSettings();
  }, []);

  const handleSaveCategorySettings = async (categoryId: string) => {
    setIsSavingCategory((prev) => ({ ...prev, [categoryId]: true }));
    setCategorySuccessMsgs((prev) => ({ ...prev, [categoryId]: null }));
    setCategoryErrorMsgs((prev) => ({ ...prev, [categoryId]: null }));

    try {
      await fireGlassPricingService.saveCategorySettings(categoryId, fireGlassSettings[categoryId]);
      setCategorySuccessMsgs((prev) => ({
        ...prev,
        [categoryId]: 'Ayarlar başarıyla kaydedildi ve canlı sisteme yansıtıldı!',
      }));
      setTimeout(() => {
        setCategorySuccessMsgs((prev) => ({ ...prev, [categoryId]: null }));
      }, 5000);
    } catch (err: any) {
      setCategoryErrorMsgs((prev) => ({
        ...prev,
        [categoryId]: err?.message || 'Ayarlar kaydedilirken bir hata oluştu.',
      }));
      setTimeout(() => {
        setCategoryErrorMsgs((prev) => ({ ...prev, [categoryId]: null }));
      }, 5000);
    } finally {
      setIsSavingCategory((prev) => ({ ...prev, [categoryId]: false }));
    }
  };

  // Firestore'dan Şömine Fiyat Ayarlarını Yükleme
  useEffect(() => {
    const loadFireplaceSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'fireplace_pricing');
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setFireplaceSettings(snap.data() as FireplacePricingSettings);
        } else {
          // Eğer Firestore'da henüz doküman yoksa varsayılanı oluşturup kaydet
          await setDoc(docRef, DEFAULT_FIREPLACE_SETTINGS);
          setFireplaceSettings(DEFAULT_FIREPLACE_SETTINGS);
        }
      } catch (err) {
        console.warn('Error loading fireplace pricing settings, falling back to local storage/default:', err);
        // Fallback Local Storage
        try {
          const saved = localStorage.getItem('mimaricam_fireplace_pricing');
          if (saved) setFireplaceSettings(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    };
    loadFireplaceSettings();
  }, []);

  const handleSaveFireplaceSettings = async () => {
    setIsSavingFireplaceSettings(true);
    setFireplaceSettingsSuccessMsg(null);
    setFireplaceSettingsErrorMsg(null);

    try {
      const docRef = doc(db, 'settings', 'fireplace_pricing');
      await setDoc(docRef, fireplaceSettings);
      
      try {
        localStorage.setItem('mimaricam_fireplace_pricing', JSON.stringify(fireplaceSettings));
      } catch (e) {
        console.error(e);
      }

      setFireplaceSettingsSuccessMsg('Şömine konfigüratörü fiyat parametreleri başarıyla Firestore veritabanına kaydedildi ve tüm kullanıcılarda canlı olarak güncellendi!');
      setTimeout(() => setFireplaceSettingsSuccessMsg(null), 6000);
    } catch (err: any) {
      console.error('Error saving fireplace settings:', err);
      setFireplaceSettingsErrorMsg(err?.message || 'Ayarlar kaydedilirken veritabanı yetki hatası veya bağlantı hatası oluştu.');
      setTimeout(() => setFireplaceSettingsErrorMsg(null), 6000);
    } finally {
      setIsSavingFireplaceSettings(false);
    }
  };

  const handleResetFireplaceSettingsToDefault = () => {
    if (window.confirm('Tüm fiyat ve katsayı parametrelerini varsayılan fabrika ayarlarına geri döndürmek istediğinizden emin misiniz?')) {
      setFireplaceSettings(DEFAULT_FIREPLACE_SETTINGS);
    }
  };

  // Load quotes from Firestore
  const loadQuotes = async () => {
    setIsLoadingQuotes(true);
    try {
      const data = await quoteService.getAllQuotes();
      setQuotes(data);
    } catch {
      setQuotes([]);
    } finally {
      setIsLoadingQuotes(false);
    }
  };

  // Load data on mount and live-subscribe to quotes collection
  useEffect(() => {
    testFirestoreConnection().then(setDbConnected);
    productService.getProducts().then(setProducts);
    productService.getCategories().then(setCategories);

    setIsLoadingQuotes(true);
    // Firestore quotes koleksiyonunu canlı dinle (onSnapshot)
    const unsubscribeQuotes = quoteService.subscribeToQuotes((liveQuotes) => {
      setQuotes(liveQuotes);
      setIsLoadingQuotes(false);
    });

    return () => {
      unsubscribeQuotes();
    };
  }, []);

  const handleUpdateQuoteStatus = async (quoteId: string, status: Quote['status']) => {
    try {
      await quoteService.updateQuoteStatus(quoteId, status);
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status } : q))
      );
      if (selectedQuote && selectedQuote.id === quoteId) {
        setSelectedQuote({ ...selectedQuote, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadAdminPDF = (quote: Quote) => {
    const item = quote.items?.[0];
    if (!item) return;

    const design = item.designConfig;
    const width = design?.widthMm || 690;
    const height = design?.heightMm || 580;
    const shape = (design?.shape as string) === 'arch' || design?.shape === 'curved' ? 'arch' : 'rectangle';
    const archApex = design?.centerArchMm || (shape === 'arch' ? height + 60 : undefined);
    
    // Area calculation
    let area = 0;
    if (shape === 'rectangle') {
      area = (width * height) / 1000000;
    } else {
      const avgHeight = (height + (archApex || (height + 60))) / 2;
      area = (width * avgHeight) / 1000000;
    }
    const calculatedAreaM2 = Number(area.toFixed(3));
    const billableArea = Math.max(calculatedAreaM2, 0.20);

    // Dynamic price calculation
    const glassPricePerM2 = 5100; // standard Self-cleaning
    const rawGlassTotal = Math.round(billableArea * glassPricePerM2 * (item.quantity || 1));
    
    // KDV and totals
    const subTotal = rawGlassTotal;
    const kdvRate = 0.20;
    const kdvAmount = Math.round(subTotal * kdvRate);
    const grandTotal = subTotal + kdvAmount;

    generateFireplacePDF({
      quoteNumber: quote.quoteNumber,
      date: quote.createdAt ? new Date(quote.createdAt).toLocaleDateString('tr-TR') : new Date().toLocaleDateString('tr-TR'),
      shape,
      widthMm: width,
      heightMm: height,
      archApexMm: shape === 'arch' ? archApex : undefined,
      glassTypeName: design?.glassTypeName || 'Isiya Dayanikli Seramik Cam',
      includeCover: false,
      quantity: item.quantity || 1,
      calculatedAreaM2,
      rawGlassTotal,
      kdvAmount,
      grandTotal,
      clientName: quote.clientName,
      clientPhone: quote.clientPhone,
      clientEmail: quote.clientEmail,
    });
  };

  // Sipariş Özetini Tanımlı Alıcılara e-Posta Gönderme
  const handleSendOrderEmail = async (quote: Quote) => {
    setSendingEmailQuoteId(quote.id);
    setEmailSendSuccessMsg(null);
    setEmailSendErrorMsg(null);

    try {
      const result = await emailNotificationService.sendOrderEmail(quote);
      setEmailSendSuccessMsg(result.message);
      setTimeout(() => setEmailSendSuccessMsg(null), 6000);
    } catch (err: any) {
      console.error('Error sending order email:', err);
      setEmailSendErrorMsg(err?.message || 'E-posta gönderilirken bir hata oluştu.');
      setTimeout(() => setEmailSendErrorMsg(null), 6000);
    } finally {
      setSendingEmailQuoteId(null);
    }
  };

  // Sipariş Özetini Alıcılara Mailto (Outlook/Gmail vb.) ile İletme
  const handleSendEmailViaClient = async (quote: Quote) => {
    try {
      const mailtoUrl = await emailNotificationService.getMailtoUrl(quote);
      const link = document.createElement('a');
      link.href = mailtoUrl;
      link.click();
    } catch (err) {
      console.error('Mailto error:', err);
    }
  };

  // Open Product Edit Modal
  const handleOpenProductEdit = (prod: Product) => {
    setEditingProduct(prod);
    setProductFile(null);
    setProductPreviewUrl(null);
    setProductUploadProgress(null);
    setProductSuccessMsg(null);
    setProductErrorMsg(null);
    setProductAltText(`${prod.name} - MimariCam`);
  };

  // Handle Product File Select
  const handleProductFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProductFile(file);
      setProductSuccessMsg(null);
      setProductErrorMsg(null);
      const url = URL.createObjectURL(file);
      setProductPreviewUrl(url);
    }
  };

  // Upload and attach image to Product
  const handleUploadProductImage = async () => {
    if (!editingProduct || !productFile) return;

    setIsUploadingProduct(true);
    setProductUploadProgress(0);
    setProductSuccessMsg(null);
    setProductErrorMsg(null);

    try {
      const fileExt = productFile.name.includes('.') ? productFile.name.split('.').pop() || 'webp' : 'webp';
      const cleanSeoName = formatSeoFileName(editingProduct.name, fileExt);

      // 1. Upload file to Firebase Storage
      const { downloadUrl } = await imageService.uploadToFirebaseStorage(
        productFile,
        cleanSeoName,
        (progress) => setProductUploadProgress(progress)
      );

      // 2. Prepare updated product preserving all existing information
      const updatedProduct: Product = {
        ...editingProduct,
        imageUrl: downloadUrl,
        updatedAt: new Date().toISOString(),
      };

      // 3. Save to Firestore product record (explicit error handling if write fails)
      try {
        await productService.saveProduct(updatedProduct);
      } catch (firestoreErr: any) {
        throw new Error(
          `Görsel Storage'a yüklendi ancak Firestore ürün kaydı güncellenemedi: ${firestoreErr?.message || 'Veritabanı erişim/izin hatası'}`
        );
      }

      // 4. Update UI state with new download URL immediately
      setEditingProduct(updatedProduct);
      setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));

      // 5. Reset upload file selection
      setProductFile(null);
      setProductPreviewUrl(null);
      if (productFileInputRef.current) {
        productFileInputRef.current.value = '';
      }

      // 6. Display success message only after Firestore write succeeded
      setProductSuccessMsg('Ürün görseli başarıyla güncellendi ve ürün kaydına kaydedildi.');
    } catch (err: any) {
      console.error('Product image upload error:', err);
      setProductErrorMsg(err?.message || 'Görsel güncellenirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsUploadingProduct(false);
      setProductUploadProgress(null);
    }
  };

  // Open Category Edit Modal
  const handleOpenCategoryEdit = (cat: Category) => {
    setEditingCategory(cat);
    setCategoryFile(null);
    setCategoryPreviewUrl(null);
    setCategoryUploadProgress(null);
    setCategorySuccessMsg(null);
    setCategoryErrorMsg(null);
    setCategoryAltText(`${cat.name} - MimariCam`);
  };

  // Handle Category File Select
  const handleCategoryFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCategoryFile(file);
      setCategorySuccessMsg(null);
      setCategoryErrorMsg(null);
      const url = URL.createObjectURL(file);
      setCategoryPreviewUrl(url);
    }
  };

  // Upload and attach image to Category
  const handleUploadCategoryImage = async () => {
    if (!editingCategory || !categoryFile) return;

    setIsUploadingCategory(true);
    setCategoryUploadProgress(0);
    setCategorySuccessMsg(null);
    setCategoryErrorMsg(null);

    try {
      const fileExt = categoryFile.name.includes('.') ? categoryFile.name.split('.').pop() || 'webp' : 'webp';
      const cleanSeoName = formatSeoFileName(editingCategory.name, fileExt);

      const { downloadUrl } = await imageService.uploadToFirebaseStorage(
        categoryFile,
        cleanSeoName,
        (progress) => setCategoryUploadProgress(progress)
      );

      // Save to category record (preserves all existing info, updates imageUrl)
      await productService.saveCategory({
        id: editingCategory.id,
        imageUrl: downloadUrl,
      });

      // Update local state
      const updatedCat = { ...editingCategory, imageUrl: downloadUrl };
      setEditingCategory(updatedCat);
      setCategories((prev) => prev.map((c) => (c.id === updatedCat.id ? updatedCat : c)));

      setCategoryFile(null);
      setCategoryPreviewUrl(null);
      setCategorySuccessMsg('Kategori görseli başarıyla Firebase Storage mimaricam-gorseller/ klasörüne yüklendi ve kategoriye bağlandı.');
    } catch (err: any) {
      console.error('Category image upload error:', err);
      setCategoryErrorMsg(err?.message || 'Görsel yüklenirken bir hata oluştu. Lütfen tekrar deneyiniz.');
    } finally {
      setIsUploadingCategory(false);
      setCategoryUploadProgress(null);
    }
  };

  // Protect AdminPage: if not logged in or not admin, restrict direct access
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-md w-full text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-amber-50 text-[#C58B38] mx-auto flex items-center justify-center border border-amber-200">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Yönetici Girişi Gerekli</h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            Bu alana yalnızca yetkili yönetici hesabı ile <strong>/boss</strong> adresi üzerinden erişilebilir.
          </p>
          <button
            type="button"
            onClick={() => navigate('/boss')}
            className="w-full py-2.5 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs shadow-xs transition-colors"
          >
            Yönetici Girişine Git (/boss)
          </button>
        </div>
      </div>
    );
  }

  // Filter products by search term
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      p.categoryName.toLowerCase().includes(productSearchTerm.toLowerCase())
  );

  // Filter quotes by search term
  const filteredQuotes = quotes.filter((q) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      (q.quoteNumber && q.quoteNumber.toLowerCase().includes(term)) ||
      (q.clientName && q.clientName.toLowerCase().includes(term)) ||
      (q.customerName && q.customerName.toLowerCase().includes(term)) ||
      (q.clientPhone && q.clientPhone.toLowerCase().includes(term)) ||
      (q.clientEmail && q.clientEmail.toLowerCase().includes(term)) ||
      (q.city && q.city.toLowerCase().includes(term)) ||
      (q.items?.[0]?.productTitle && q.items[0].productTitle.toLowerCase().includes(term))
    );
  });

  return (
    <div className="min-h-screen bg-white py-10 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C58B38]">
                <Sliders className="w-4 h-4" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                MimariCam Yönetici Paneli
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Ürün ve kategori görsel yönetimi, gelen teklifler ve teknik SEO kontrol paneli.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/siparisler')}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-50 to-amber-100 hover:from-amber-100 hover:to-amber-200 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
              title="Sadece Yetkili İmalat ve Sipariş Yönetim Paneline Git"
            >
              <Package className="w-3.5 h-3.5 text-[#C58B38]" />
              <span>İmalat & Sipariş Paneli (/siparisler)</span>
            </button>

            <div className="flex items-center gap-2 text-xs bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-gray-700 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-medium">{user.email}</span>
              <span className="text-[10px] font-mono text-[#C58B38] uppercase font-bold">({profile?.role || 'Admin'})</span>
            </div>
            <button
              type="button"
              onClick={logout}
              className="px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200 border border-gray-200 text-gray-700 font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              title="Yönetici Oturumunu Kapat"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıkış Yap</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation (Ayrı Görsel Yönetimi sekmesi tamamen kaldırıldı) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 custom-scrollbar">
          {[
            { id: 'products', label: 'Ürün Kataloğu', icon: Package, count: products.length },
            { id: 'categories', label: 'Kategoriler', icon: Layers, count: categories.length },
            { id: 'quotes', label: 'Siparişler & Teklifler', icon: FileText, count: quotes.length },
            { id: 'configurator', label: 'Şömine Hesaplayıcı Ayarları', icon: Sliders },
            { id: 'fire_pricing', label: 'Yangın & Temperli Cam Ayarları', icon: Flame },
            { id: 'seo', label: 'GEO & Şehir Yönetimi', icon: Globe, count: GEO_PAGES.length },
            { id: 'legal', label: 'Yasal Sayfa Yönetimi', icon: Scale, count: 6 },
            { id: 'health', label: 'Sistem & Firebase', icon: Activity },
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-[#C58B38] text-white font-bold shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isActive ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content 1: ÜRÜN KATALOĞU */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  Kayıtlı Cam Ürünleri ({products.length})
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Ürün kartlarındaki "Düzenle" butonunu kullanarak doğrudan cihazınızdan Firebase Storage'a görsel yükleyebilirsiniz.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Ürün adı, kod veya kategori ara..."
                  value={productSearchTerm}
                  onChange={(e) => setProductSearchTerm(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C58B38] w-64 shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => navigate('/camini-tasarla')}
                  className="px-3.5 py-2 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Özel Ürün Tasarla</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:border-[#C58B38]/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Ürün Görseli Önizleme */}
                    <div className="relative w-full h-44 bg-gray-100 overflow-hidden border-b border-gray-100">
                      <StorageImage
                        key={`${prod.id}-${prod.imageUrl}`}
                        imageName={prod.imageUrl}
                        alt={`${prod.name} - MimariCam`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      {prod.fireRating !== 'NONE' && (
                        <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-amber-300 border border-amber-400/30 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold shadow-xs">
                          {prod.fireRating}
                        </div>
                      )}
                      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-mono">
                        {prod.code}
                      </div>
                    </div>

                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-bold text-gray-900 leading-snug line-clamp-1">
                          {prod.name}
                        </h4>
                      </div>
                      <div className="text-[11px] text-[#C58B38] font-medium">
                        {prod.categoryName}
                      </div>
                      <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                        {prod.summary}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="flex items-center justify-between text-gray-500 border-t border-gray-100 pt-3 text-[11px]">
                      <span className="font-mono text-gray-600">Kalınlık: {prod.thicknessMm}</span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenProductEdit(prod)}
                          className="px-3 py-1.5 rounded-lg bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Pencil className="w-3 h-3" />
                          <span>Düzenle</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(`/urun/${prod.slug}`)}
                          className="px-2 py-1.5 text-gray-600 hover:text-gray-900 flex items-center gap-1 font-semibold text-xs"
                          title="Ürün Detay Sayfasını Aç"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 2: KATEGORİLER */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                11 Ana Ürün Kategorisi
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Kategori kartlarındaki "Düzenle" butonuna tıklayarak doğrudan cihazınızdan Firebase Storage'a yeni kategori görseli yükleyebilirsiniz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:border-[#C58B38]/50 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Kategori Görseli Önizleme */}
                    <div className="relative w-full h-40 bg-gray-100 overflow-hidden border-b border-gray-100">
                      <StorageImage
                        imageName={cat.imageUrl}
                        alt={`${cat.name} - MimariCam`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                      {cat.fireClassRange && (
                        <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-xs text-amber-300 border border-amber-400/30 font-mono text-[10px] px-2 py-0.5 rounded-md font-bold shadow-xs">
                          {cat.fireClassRange}
                        </div>
                      )}
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="text-sm font-bold text-gray-900">{cat.name}</h4>
                      <p className="text-gray-600 text-xs line-clamp-2 leading-relaxed">
                        {cat.shortDesc}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 pt-0">
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-[11px]">
                      <button
                        type="button"
                        onClick={() => navigate(`/kategori/${cat.slug}`)}
                        className="text-gray-500 hover:text-gray-900 font-semibold"
                      >
                        Kategori Sayfası →
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenCategoryEdit(cat)}
                        className="px-3 py-1.5 rounded-lg bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        <span>Düzenle</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: SİPARİŞLER & GELEN TEKLİFLER */}
        {activeTab === 'quotes' && (
          <div className="space-y-6">
            {/* Bildirim Alıcı e-Postaları Yönetimi (Maks 5 Adet) */}
            <OrderEmailNotificationsManager />

            {/* E-Posta Gönderim Bildirim Toast/Alert */}
            {emailSendSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{emailSendSuccessMsg}</span>
              </div>
            )}
            {emailSendErrorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-800 text-xs shadow-xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-semibold">{emailSendErrorMsg}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Teklif no, müşteri adı veya e-posta ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C58B38] w-72 shadow-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                {/* Görünüm Seçici (Kart / Tablo) */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1 border border-gray-200 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuotesViewMode('cards')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      quotesViewMode === 'cards'
                        ? 'bg-white text-gray-900 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-[#C58B38]" />
                    <span>Kart Görünümü</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuotesViewMode('table')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      quotesViewMode === 'table'
                        ? 'bg-white text-gray-900 shadow-2xs'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <List className="w-3.5 h-3.5 text-[#C58B38]" />
                    <span>Tablo Görünümü</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={loadQuotes}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-xs flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingQuotes ? 'animate-spin' : ''}`} />
                  <span>Yenile</span>
                </button>
              </div>
            </div>

            {quotes.length > 0 ? (
              quotesViewMode === 'cards' ? (
                /* Sipariş Özeti Kartları Görünümü (Müşteri Siparişi OnSnapshot ile Sayfada Canlı Belirir) */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4.5">
                  {filteredQuotes.map((q) => {
                    const details = extractOrderDetails(q);
                    return (
                      <div
                        key={q.id}
                        className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-[#C58B38] transition-all space-y-4 flex flex-col justify-between"
                      >
                        <div>
                          {/* Üst Kısım: Sipariş No & Durum & Tarih */}
                          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-xs text-[#C58B38] bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                                {q.quoteNumber}
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                                  q.status === 'pending' || q.status === 'new'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : q.status === 'in_review'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : q.status === 'quoted'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : q.status === 'approved'
                                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {q.status === 'pending'
                                  ? 'Beklemede'
                                  : q.status === 'new'
                                  ? 'Yeni'
                                  : q.status === 'in_review'
                                  ? 'İnceleniyor'
                                  : q.status === 'quoted'
                                  ? 'Fiyat Verildi'
                                  : q.status === 'approved'
                                  ? 'Onaylandı'
                                  : q.status}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1 shrink-0">
                              <Clock className="w-3.5 h-3.5 text-gray-400" />
                              {new Date(q.createdAt).toLocaleString('tr-TR')}
                            </span>
                          </div>

                          {/* Müşteri Bilgileri Bloğu */}
                          <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 text-xs space-y-1.5 mt-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-bold text-gray-900 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#C58B38] shrink-0" />
                                <span>{q.clientName || q.customerName}</span>
                              </span>
                              <a
                                href={`tel:${q.clientPhone || q.customerPhone}`}
                                className="text-[#C58B38] font-mono font-bold hover:underline flex items-center gap-1 shrink-0"
                              >
                                <Phone className="w-3 h-3 text-gray-400" />
                                <span>{q.clientPhone || q.customerPhone}</span>
                              </a>
                            </div>
                            <div className="text-[11px] text-gray-600 flex items-start gap-1.5 leading-snug">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                              <span>{q.projectLocation || q.customerAddress || `${q.city} / ${q.district || 'Belirtilmedi'}`}</span>
                            </div>
                          </div>

                          {/* İmalat Ölçüleri & Fiyat */}
                          <div className="border border-gray-100 rounded-xl p-3 bg-white text-xs space-y-2 mt-3 shadow-2xs">
                            <div className="flex items-center justify-between font-bold text-gray-900 leading-snug">
                              <span>{q.items?.[0]?.productTitle || q.model || 'Isıya Dayanıklı Cam / Şömine Kapağı'}</span>
                              <span className="text-[#C58B38] font-mono shrink-0">{q.items?.[0]?.quantity || 1} Adet</span>
                            </div>
                            <div className="bg-gray-50/80 p-2.5 rounded-lg text-[11px] font-mono text-gray-700 flex items-center justify-between border border-gray-100">
                              <span className="font-sans text-gray-500 font-semibold">📏 İmalat Ölçüleri:</span>
                              <span className="font-bold text-gray-900">{details.dimensionsText}</span>
                            </div>
                            <div className="flex items-center justify-between pt-1.5 border-t border-gray-100 mt-2">
                              <span className="text-gray-500 font-medium">Toplam Tutar (KDV Dahil):</span>
                              <span className="text-emerald-700 font-black font-mono text-sm">
                                {q.offeredPrice
                                  ? `${q.offeredPrice.toLocaleString('tr-TR')} TL`
                                  : q.totalPrice
                                  ? `${q.totalPrice.toLocaleString('tr-TR')} TL`
                                  : 'Belirtilmedi'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Alt Kısım: e-Posta Gönder & Detay Butonları */}
                        <div className="pt-3.5 border-t border-gray-100 mt-2 shrink-0 space-y-2.5">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleSendOrderEmail(q)}
                              disabled={sendingEmailQuoteId === q.id}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-[11px] sm:text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                              title="Sipariş Özetini Arka Plandan Otomatik Gönder"
                            >
                              {sendingEmailQuoteId === q.id ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-950 shrink-0" />
                                  <span>Gönderiliyor...</span>
                                </>
                              ) : (
                                <>
                                  <Mail className="w-3.5 h-3.5 text-stone-950 shrink-0" />
                                  <span>Sistemden Gönder</span>
                                </>
                              )}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSendEmailViaClient(q)}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] sm:text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                              title="Sipariş Özetini Bilgisayarınızdaki Outlook/Gmail ile Gönder"
                            >
                              <Send className="w-3.5 h-3.5 text-[#C58B38] shrink-0" />
                              <span>Outlook/Gmail ile Aç</span>
                            </button>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => setSelectedQuote(q)}
                            className="w-full py-2 px-4 rounded-xl bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors cursor-pointer text-center"
                          >
                            Detaylı İncele & Yönet
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Tablo Görünümü */
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider bg-gray-50/50">
                          <th className="py-3.5 px-4">Teklif No</th>
                          <th className="py-3.5 px-4">Müşteri / Şirket</th>
                          <th className="py-3.5 px-4">Şehir</th>
                          <th className="py-3.5 px-4">Ürün / Kalem</th>
                          <th className="py-3.5 px-4">Durum</th>
                          <th className="py-3.5 px-4">Tarih</th>
                          <th className="py-3.5 px-4 text-right">İşlem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-gray-700">
                        {filteredQuotes.map((q) => (
                          <tr key={q.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3.5 px-4 font-mono font-bold text-[#C58B38]">
                              {q.quoteNumber}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-semibold text-gray-900">{q.clientName || q.customerName}</div>
                              {q.clientCompany && (
                                <div className="text-[10px] text-gray-500">{q.clientCompany}</div>
                              )}
                              <div className="text-[10px] text-gray-400 font-mono">{q.clientPhone || q.customerPhone}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span>{q.city}</span>
                              {q.district && <span className="text-gray-400 text-[10px]"> / {q.district}</span>}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-medium text-gray-800">
                                {q.items?.[0]?.productTitle || q.model || 'Özel Cam & Kapak'}
                              </div>
                              <div className="text-[10px] text-gray-400 font-mono">
                                {q.items?.length || 1} Kalem {q.offeredPrice ? `• ${q.offeredPrice.toLocaleString('tr-TR')} TL` : ''}
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  q.status === 'pending' || q.status === 'new'
                                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                    : q.status === 'in_review'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : q.status === 'quoted'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : q.status === 'approved'
                                    ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {q.status === 'pending'
                                  ? 'Beklemede'
                                  : q.status === 'new'
                                  ? 'Yeni'
                                  : q.status === 'in_review'
                                  ? 'İnceleniyor'
                                  : q.status === 'quoted'
                                  ? 'Fiyat Verildi'
                                  : q.status === 'approved'
                                  ? 'Onaylandı'
                                  : q.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-mono text-gray-500 text-[11px]">
                              {new Date(q.createdAt).toLocaleDateString('tr-TR')}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleSendOrderEmail(q)}
                                  disabled={sendingEmailQuoteId === q.id}
                                  className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer disabled:opacity-50"
                                  title="Sipariş Özetini Arka Plandan Otomatik Gönder"
                                >
                                  {sendingEmailQuoteId === q.id ? (
                                    <>
                                      <Loader2 className="w-3 h-3 animate-spin text-[#C58B38] shrink-0" />
                                      <span>Gönderiliyor...</span>
                                    </>
                                  ) : (
                                    <>
                                      <Mail className="w-3.5 h-3.5 text-[#C58B38] shrink-0" />
                                      <span>Sistemden Gönder</span>
                                    </>
                                  )}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleSendEmailViaClient(q)}
                                  className="px-2.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-200 text-[11px] font-semibold transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                                  title="Outlook/Gmail e-Posta Programı ile Gönder"
                                >
                                  <Send className="w-3 h-3 text-[#C58B38] shrink-0" />
                                  <span>Outlook/Gmail ile Aç</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setSelectedQuote(q)}
                                  className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-[11px] font-medium transition-colors cursor-pointer"
                                >
                                  Detay
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center space-y-3">
                <FileText className="w-10 h-10 text-gray-400 mx-auto" />
                <h3 className="text-base font-bold text-gray-900">Henüz Teklif Kaydı Bulunmuyor</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Kullanıcılar "Teklif Al" veya "Camını Tasarla" formunu doldurduğunda teklifler anlık olarak burada listelenecektir.
                </p>
              </div>
            )}

            {/* Quote Detail Modal */}
            {selectedQuote && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white border border-gray-200 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-xl max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                      <span className="text-xs font-mono text-[#C58B38] font-bold">
                        {selectedQuote.quoteNumber}
                      </span>
                      <h3 className="text-lg font-bold text-gray-900">Teklif Detayı</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedQuote(null)}
                      className="text-gray-500 hover:text-gray-800 text-xs px-2 py-1 rounded bg-gray-100 cursor-pointer"
                    >
                      Kapat ✕
                    </button>
                  </div>

                  {/* Modal Feedback Alert */}
                  {emailSendSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{emailSendSuccessMsg}</span>
                    </div>
                  )}
                  {emailSendErrorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-800 text-xs">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span className="font-semibold">{emailSendErrorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-gray-500 block">Müşteri Adı:</span>
                      <span className="text-gray-900 font-medium">{selectedQuote.clientName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Firma:</span>
                      <span className="text-gray-900 font-medium">{selectedQuote.clientCompany || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">E-Posta:</span>
                      <span className="text-[#C58B38] font-mono">{selectedQuote.clientEmail}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Telefon:</span>
                      <span className="text-gray-900 font-mono">{selectedQuote.clientPhone}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Lokasyon / Şantiye:</span>
                      <span className="text-gray-900">{selectedQuote.city} {selectedQuote.district ? `(${selectedQuote.district})` : ''}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Kullanıcı Tipi:</span>
                      <span className="text-[#C58B38] font-medium capitalize">{selectedQuote.clientType}</span>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-gray-200 pt-3">
                    <span className="text-xs font-bold text-gray-800">Talep Edilen Cam Kalemleri:</span>
                    {selectedQuote.items?.map((it, idx) => (
                      <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1">
                        <div className="flex justify-between font-bold text-gray-900">
                          <span>{it.productTitle}</span>
                          <span className="text-[#C58B38] font-mono">x {it.quantity} Adet</span>
                        </div>
                        {it.designConfig && (
                          <div className="text-gray-500 font-mono text-[11px]">
                            {it.designConfig.shape.toUpperCase()} | {it.designConfig.widthMm} x {it.designConfig.heightMm} mm | Kalınlık: {it.designConfig.thicknessMm} mm | Kenar: {it.designConfig.edgeFinish}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-gray-500">İşlemler:</span>
                      {/* E-Posta Gönder Butonu */}
                      <button
                        type="button"
                        onClick={() => handleSendOrderEmail(selectedQuote)}
                        disabled={sendingEmailQuoteId === selectedQuote.id}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Sipariş Özetini Tedarikçilere (E-posta Listesine) Gönder"
                      >
                        {sendingEmailQuoteId === selectedQuote.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-950" />
                            <span>Gönderiliyor...</span>
                          </>
                        ) : (
                          <>
                            <Mail className="w-3.5 h-3.5 text-stone-950" />
                            <span>📧 Sipariş Özetini Tedarikçilere Gönder</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDownloadAdminPDF(selectedQuote)}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                        PDF İndir
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Durumu Güncelle:</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleUpdateQuoteStatus(selectedQuote.id, 'in_review')}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          İnceleniyor
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateQuoteStatus(selectedQuote.id, 'quoted')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-100 transition-colors cursor-pointer"
                        >
                          Fiyat Verildi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: ŞÖMİNE HESAPLAYICI PARAMETRE AYARLARI (YALNIZCA YÖNETİCİ GÖRÜR) */}
        {activeTab === 'configurator' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#C58B38]" />
                  <span>Şömine Konfigüratörü Yönetim Sistemi</span>
                </h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Hesaplayıcının kullandığı birim fiyatları, kavis çarpanlarını, KDV oranını ve sipariş yönlendirme numarasını yönetin.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleResetFireplaceSettingsToDefault}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Varsayılana Sıfırla</span>
                </button>

                <button
                  type="button"
                  disabled={isSavingFireplaceSettings}
                  onClick={handleSaveFireplaceSettings}
                  className="px-4 py-2 rounded-xl bg-[#C58B38] hover:bg-[#B37B24] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSavingFireplaceSettings ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Parametreleri Kaydet</span>
                </button>
              </div>
            </div>

            {/* Success / Error Messages */}
            {fireplaceSettingsSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{fireplaceSettingsSuccessMsg}</span>
              </div>
            )}
            {fireplaceSettingsErrorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{fireplaceSettingsErrorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-gray-700">
              {/* Sol Sütun: Genel ve İletişim Parametreleri */}
              <div className="space-y-4 border border-gray-100 p-5 rounded-2xl bg-gray-50/30">
                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 text-xs uppercase tracking-wider text-[#C58B38]">
                  📞 Genel ve İletişim Ayarları
                </h3>

                <div className="space-y-1">
                  <label className="font-bold text-gray-800 block">WhatsApp Sipariş Gönderim Hattı:</label>
                  <input
                    type="text"
                    value={fireplaceSettings.whatsappPhone}
                    onChange={(e) =>
                      setFireplaceSettings({ ...fireplaceSettings, whatsappPhone: e.target.value })
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                    placeholder="Örn: 905421452525"
                  />
                  <span className="text-[10px] text-gray-400 block leading-relaxed mt-0.5">
                    Müşteri siparişi onayladığında WhatsApp yönlendirmesinin yapılacağı ülke kodlu numara (Boşluksuz ve işaretsiz olmalıdır).
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-800 block">KDV Oranı (%):</label>
                    <input
                      type="number"
                      step="1"
                      value={Math.round(fireplaceSettings.kdvRate * 100)}
                      onChange={(e) =>
                        setFireplaceSettings({
                          ...fireplaceSettings,
                          kdvRate: Number(e.target.value) / 100,
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-gray-800 block">Min. Fatura Alanı (m²):</label>
                    <input
                      type="number"
                      step="0.05"
                      value={fireplaceSettings.minBillableAreaM2}
                      onChange={(e) =>
                        setFireplaceSettings({
                          ...fireplaceSettings,
                          minBillableAreaM2: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                    />
                  </div>
                </div>
              </div>

              {/* Sağ Sütun: Cam ve Çerçeve Taban Fiyatları */}
              <div className="space-y-4 border border-gray-100 p-5 rounded-2xl bg-gray-50/30">
                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 text-xs uppercase tracking-wider text-[#C58B38]">
                  💰 Fiyatlama ve Katsayı Çarpanları
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gray-800 block">Cam Taban Fiyat (TL/m²):</span>
                    <input
                      type="number"
                      value={fireplaceSettings.glassPrices['robax_4mm'] || 28000}
                      onChange={(e) =>
                        setFireplaceSettings({
                          ...fireplaceSettings,
                          glassPrices: {
                            ...fireplaceSettings.glassPrices,
                            robax_4mm: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gray-800 block">Kavisli Cam Çarpanı:</span>
                    <input
                      type="number"
                      step="0.05"
                      value={fireplaceSettings.archLaborMultiplier}
                      onChange={(e) =>
                        setFireplaceSettings({
                          ...fireplaceSettings,
                          archLaborMultiplier: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gray-800 block">Çerçeve Taban Fiyat (TL/m²):</span>
                    <input
                      type="number"
                      value={fireplaceSettings.baseCoverPricePerM2}
                      onChange={(e) =>
                        setFireplaceSettings({
                          ...fireplaceSettings,
                          baseCoverPricePerM2: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-gray-800 block">Kavisli Kapak Çarpanı:</span>
                    <input
                      type="number"
                      step="0.05"
                      value={fireplaceSettings.archCoverMultiplier}
                      onChange={(e) =>
                        setFireplaceSettings({
                          ...fireplaceSettings,
                          archCoverMultiplier: Number(e.target.value),
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50/50 border border-amber-200/80 rounded-2xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#C58B38] shrink-0 mt-0.5" />
              <div className="text-[11px] text-amber-900 leading-relaxed space-y-1">
                <span className="font-bold block">💡 Önemli Yönetici Bilgilendirmesi:</span>
                <span>
                  Bu sekmede yaptığınız tüm değişiklikler doğrudan **Firestore Bulut Veritabanına** kaydedilir. Kaydedilen yeni birim fiyatlar ve WhatsApp iletişim hattı, siteyi ziyaret eden tüm müşterilerinizin hesaplayıcısında anlık ve eş zamanlı olarak aktif hale gelir. Manuel kod değişikliği gerektirmez.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: YANGIN & TEMPERLİ CAM PARAMETRE AYARLARI (YALNIZCA YÖNETİCİ GÖRÜR) */}
        {activeTab === 'fire_pricing' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Flame className="w-5 h-5 text-red-500" />
                <span>Yangın ve Temperli Cam Fiyat & Ölçü Yönetimi</span>
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                7 kategorinin m² birim satış fiyatlarını, kalınlıklarını, aktiflik durumlarını ve minimum/maksimum imalat ölçü sınırlamalarını bağımsız olarak düzenleyin.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.keys(DEFAULT_FIRE_GLASS_SETTINGS).map((catId) => {
                const settings = fireGlassSettings[catId] || DEFAULT_FIRE_GLASS_SETTINGS[catId];
                const isSaving = isSavingCategory[catId] || false;
                const successMsg = categorySuccessMsgs[catId];
                const errorMsg = categoryErrorMsgs[catId];

                return (
                  <div
                    key={catId}
                    className="bg-white border border-gray-200 rounded-3xl p-5 shadow-sm space-y-4 hover:border-[#C58B38]/30 transition-all flex flex-col justify-between text-xs text-gray-700"
                  >
                    <div className="space-y-4">
                      {/* Kart Başlığı & Aktif/Pasif Durumu */}
                      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span className="font-extrabold text-sm text-gray-900 tracking-tight">
                          {settings.name}
                        </span>
                        
                        <label className="relative inline-flex items-center cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={settings.isActive}
                            onChange={(e) =>
                              setFireGlassSettings({
                                ...fireGlassSettings,
                                [catId]: { ...settings, isActive: e.target.checked }
                              })
                            }
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500" />
                          <span className="ml-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-wide">
                            {settings.isActive ? 'AKTİF' : 'PASİF'}
                          </span>
                        </label>
                      </div>

                      {/* Bilgilendirme Badge'i */}
                      <div className="bg-stone-50 border border-stone-200/60 rounded-xl p-3 text-xs space-y-3">
                        {/* m² Satış Fiyatı */}
                        <div className="space-y-1">
                          <label className="font-bold text-gray-800 block">m² Satış Fiyatı (TL):</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={settings.m2Price}
                              onChange={(e) =>
                                setFireGlassSettings({
                                  ...fireGlassSettings,
                                  [catId]: { ...settings, m2Price: Number(e.target.value) }
                                })
                              }
                              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                              placeholder="Örn: 10104"
                            />
                            <span className="absolute right-3 top-2 text-xs font-bold text-gray-400 pointer-events-none">
                              TL
                            </span>
                          </div>
                        </div>

                        {/* Kalınlık Bilgisi */}
                        <div className="space-y-1">
                          <label className="font-bold text-gray-800 block">Kalınlık Bilgisi:</label>
                          <input
                            type="text"
                            value={settings.thickness}
                            onChange={(e) =>
                              setFireGlassSettings({
                                ...fireGlassSettings,
                                [catId]: { ...settings, thickness: e.target.value }
                              })
                            }
                            className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                            placeholder="Örn: 6 mm"
                          />
                        </div>

                        {/* Ölçü Sınırları - Genişlik (Min/Max) */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="font-bold text-gray-800 block">Min Genişlik (cm):</label>
                            <input
                              type="number"
                              value={settings.minWidth}
                              onChange={(e) =>
                                setFireGlassSettings({
                                  ...fireGlassSettings,
                                  [catId]: { ...settings, minWidth: Number(e.target.value) }
                                })
                              }
                              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-gray-800 block">Max Genişlik (cm):</label>
                            <input
                              type="number"
                              value={settings.maxWidth}
                              onChange={(e) =>
                                setFireGlassSettings({
                                  ...fireGlassSettings,
                                  [catId]: { ...settings, maxWidth: Number(e.target.value) }
                                })
                              }
                              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                            />
                          </div>
                        </div>

                        {/* Ölçü Sınırları - Yükseklik (Min/Max) */}
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="font-bold text-gray-800 block">Min Yükseklik (cm):</label>
                            <input
                              type="number"
                              value={settings.minHeight}
                              onChange={(e) =>
                                setFireGlassSettings({
                                  ...fireGlassSettings,
                                  [catId]: { ...settings, minHeight: Number(e.target.value) }
                                })
                              }
                              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="font-bold text-gray-800 block">Max Yükseklik (cm):</label>
                            <input
                              type="number"
                              value={settings.maxHeight}
                              onChange={(e) =>
                                setFireGlassSettings({
                                  ...fireGlassSettings,
                                  [catId]: { ...settings, maxHeight: Number(e.target.value) }
                                })
                              }
                              className="w-full bg-white border border-gray-200 rounded-xl py-2 px-3 text-xs font-mono font-bold text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-2xs"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Durum Mesajları ve Kaydet Butonu */}
                    <div className="pt-3 border-t border-gray-100 space-y-2 mt-2">
                      {successMsg && (
                        <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-800 text-[10px] font-semibold flex items-center gap-1.5 leading-snug">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{successMsg}</span>
                        </div>
                      )}
                      {errorMsg && (
                        <div className="p-2 rounded-xl bg-red-50 border border-red-100 text-red-800 text-[10px] font-semibold flex items-center gap-1.5 leading-snug">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
                          <span>{errorMsg}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={isSaving}
                        onClick={() => handleSaveCategorySettings(catId)}
                        className="w-full py-2.5 rounded-xl bg-[#C58B38] hover:bg-[#B37B24] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Save className="w-3.5 h-3.5" />
                        )}
                        <span>{settings.name} Ayarlarını Kaydet</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content 4: SEO & GEO */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <h2 className="text-base font-bold text-gray-900">Bölgesel GEO & Yerel SEO Sayfaları</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {GEO_PAGES.map((geo) => (
                <div key={geo.slug} className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 text-xs shadow-xs">
                  <div className="font-bold text-gray-900 text-sm">{geo.city} Bölge Sayfası</div>
                  <div className="text-gray-400 text-[11px] font-mono">/sehir/{geo.slug}</div>
                  <p className="text-gray-600 line-clamp-2">{geo.metaDescription}</p>
                  <div className="border-t border-gray-100 pt-2 flex justify-between items-center">
                    <span className="text-gray-500 font-mono">{geo.phone}</span>
                    <button
                      type="button"
                      onClick={() => navigate(`/sehir/${geo.slug}`)}
                      className="text-[#C58B38] hover:underline font-semibold"
                    >
                      Görüntüle →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 5: Yasal & Kurumsal Sayfa Yönetimi */}
        {activeTab === 'legal' && <LegalPagesAdmin />}

        {/* Tab Content 6: System & Firebase Health */}
        {activeTab === 'health' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#C58B38]" />
              <span>Sistem ve Veritabanı Durumu</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="text-gray-500">Firestore Bağlantısı:</span>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {dbConnected ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Çevrimiçi (Aktif)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-amber-700">Bağlantı Kontrol Ediliyor</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-1">
                <span className="text-gray-500">Yönetici Yetkilendirmesi:</span>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {isAdmin ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700">Yönetici Yetkisi Onaylı ({user?.email})</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">Admin girişi bekleniyor (atlaspelet.com@gmail.com)</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 leading-relaxed">
              Firebase Security Rules mimarisi <span className="text-[#C58B38] font-mono font-semibold">firestore.rules</span> dosyasında tanımlı olup, admin yetkileri güvenli get/exists lookup mekanizmaları ile teyit edilmektedir.
            </div>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* ÜRÜN DÜZENLEME & GÖRSEL YÜKLEME MODALI */}
      {/* ============================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-50 text-[#C58B38] border border-amber-200 font-mono text-[10px] font-bold">
                    {editingProduct.code}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {editingProduct.categoryName}
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-1">
                  {editingProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success / Error Messages */}
            {productSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span className="font-medium">{productSuccessMsg}</span>
              </div>
            )}
            {productErrorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span className="font-medium">{productErrorMsg}</span>
              </div>
            )}

            {/* Ürün Görseli Yönetimi */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#C58B38]" />
                  <span>Ürün Görseli</span>
                </label>
                <span className="text-[11px] text-gray-400">
                  Storage → mimaricam-gorseller/
                </span>
              </div>

              {/* Görsel Önizleme */}
              <div className="relative w-full h-52 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center">
                {productPreviewUrl ? (
                  <img
                    src={productPreviewUrl}
                    alt="Seçilen Önizleme"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <StorageImage
                    key={`modal-${editingProduct.id}-${editingProduct.imageUrl}`}
                    imageName={editingProduct.imageUrl}
                    alt={`${editingProduct.name} - MimariCam`}
                    className="w-full h-full object-cover"
                  />
                )}
                {productPreviewUrl && (
                  <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    Yeni Seçilen Görsel (Yükleme Bekliyor)
                  </div>
                )}
              </div>

              {/* Cihazdan Görsel Seçme Butonu */}
              <div className="space-y-3">
                <input
                  type="file"
                  ref={productFileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleProductFileChange}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => productFileInputRef.current?.click()}
                    className="flex-1 py-2.5 px-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#C58B38] bg-gray-50 hover:bg-amber-50/20 text-xs font-bold text-gray-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#C58B38]" />
                    <span>
                      {productFile ? 'Farklı Bir Görsel Seç' : 'Cihazından Yeni Görsel Seç'}
                    </span>
                  </button>

                  {productFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setProductFile(null);
                        setProductPreviewUrl(null);
                      }}
                      className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 text-xs font-medium"
                      title="Seçimi İptal Et"
                    >
                      İptal
                    </button>
                  )}
                </div>

                {/* Seçilen dosya SEO ve Alt Metin detayları */}
                {productFile && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Otomatik SEO Dosya Adı:
                      </span>
                      <div className="font-mono text-xs font-bold text-[#C58B38] break-all bg-white px-3 py-1.5 rounded-lg border border-amber-200/60">
                        {formatSeoFileName(editingProduct.name, productFile.name.split('.').pop() || 'webp')}
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Türkçe karakterler ve boşluklar otomatik olarak temizlenir, -mimaricam son ekiyle kaydedilir.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Görsel Alt Metni (SEO):
                      </span>
                      <input
                        type="text"
                        value={productAltText}
                        onChange={(e) => setProductAltText(e.target.value)}
                        placeholder="Örn: Yangına Dayanıklı Cam - MimariCam"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#C58B38]"
                      />
                    </div>

                    {/* Progress Bar */}
                    {productUploadProgress !== null && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] text-gray-600 font-mono">
                          <span>Yükleniyor...</span>
                          <span>%{productUploadProgress}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#C58B38] h-2 rounded-full transition-all duration-200"
                            style={{ width: `${productUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={isUploadingProduct}
                      onClick={handleUploadProductImage}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isUploadingProduct ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Firebase Storage'a Yükleniyor...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Görseli Firebase Storage'a Yükle ve Ürüne Bağla</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mevcut Ürün Bilgileri (Korumalı Özet) */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <span className="text-[11px] font-bold text-gray-700 block">
                Korunan Mevcut Ürün Bilgileri:
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 text-[10px] block">Ürün Kodu:</span>
                  <span className="font-mono font-bold text-gray-800">{editingProduct.code}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Yangın Dayanımı:</span>
                  <span className="font-mono font-bold text-[#C58B38]">{editingProduct.fireRating}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Kalınlık:</span>
                  <span className="text-gray-700">{editingProduct.thicknessMm}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block">Kategori:</span>
                  <span className="text-gray-700">{editingProduct.categoryName}</span>
                </div>
              </div>
              <p className="text-[10px] text-gray-400">
                Görsel değiştiğinde mevcut ürün açıklamaları, yangın sınıfları ve teknik özellikleri aynen korunur.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* KATEGORİ DÜZENLEME & GÖRSEL YÜKLEME MODALI */}
      {/* ============================================================== */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-3xl max-w-xl w-full p-6 sm:p-7 space-y-6 shadow-2xl max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="px-2 py-0.5 rounded bg-amber-50 text-[#C58B38] border border-amber-200 font-mono text-[10px] font-bold">
                  {editingCategory.slug}
                </span>
                <h3 className="text-base font-bold text-gray-900 mt-1">
                  {editingCategory.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                title="Kapat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success / Error Messages */}
            {categorySuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5 text-emerald-800 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <span className="font-medium">{categorySuccessMsg}</span>
              </div>
            )}
            {categoryErrorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <span className="font-medium">{categoryErrorMsg}</span>
              </div>
            )}

            {/* Kategori Görseli Yönetimi */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#C58B38]" />
                  <span>Kategori Görseli</span>
                </label>
                <span className="text-[11px] text-gray-400">
                  Storage → mimaricam-gorseller/
                </span>
              </div>

              {/* Görsel Önizleme */}
              <div className="relative w-full h-48 bg-gray-100 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center">
                {categoryPreviewUrl ? (
                  <img
                    src={categoryPreviewUrl}
                    alt="Seçilen Kategori Önizleme"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <StorageImage
                    imageName={editingCategory.imageUrl}
                    alt={`${editingCategory.name} - MimariCam`}
                    className="w-full h-full object-cover"
                  />
                )}
                {categoryPreviewUrl && (
                  <div className="absolute top-2.5 left-2.5 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                    Yeni Seçilen Görsel (Yükleme Bekliyor)
                  </div>
                )}
              </div>

              {/* Cihazdan Görsel Seçme Butonu */}
              <div className="space-y-3">
                <input
                  type="file"
                  ref={categoryFileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/jpg"
                  onChange={handleCategoryFileChange}
                  className="hidden"
                />

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => categoryFileInputRef.current?.click()}
                    className="flex-1 py-2.5 px-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#C58B38] bg-gray-50 hover:bg-amber-50/20 text-xs font-bold text-gray-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Upload className="w-4 h-4 text-[#C58B38]" />
                    <span>
                      {categoryFile ? 'Farklı Bir Görsel Seç' : 'Cihazından Yeni Görsel Seç'}
                    </span>
                  </button>

                  {categoryFile && (
                    <button
                      type="button"
                      onClick={() => {
                        setCategoryFile(null);
                        setCategoryPreviewUrl(null);
                      }}
                      className="px-3 py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 text-xs font-medium"
                      title="Seçimi İptal Et"
                    >
                      İptal
                    </button>
                  )}
                </div>

                {/* Seçilen dosya SEO ve Alt Metin detayları */}
                {categoryFile && (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Otomatik SEO Dosya Adı:
                      </span>
                      <div className="font-mono text-xs font-bold text-[#C58B38] break-all bg-white px-3 py-1.5 rounded-lg border border-amber-200/60">
                        {formatSeoFileName(editingCategory.name, categoryFile.name.split('.').pop() || 'webp')}
                      </div>
                      <p className="text-[10px] text-gray-400">
                        Türkçe karakterler ve boşluklar otomatik olarak temizlenir, -mimaricam son ekiyle kaydedilir.
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                        Görsel Alt Metni (SEO):
                      </span>
                      <input
                        type="text"
                        value={categoryAltText}
                        onChange={(e) => setCategoryAltText(e.target.value)}
                        placeholder="Örn: Yangına Dayanıklı Camlar - MimariCam"
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-none focus:border-[#C58B38]"
                      />
                    </div>

                    {/* Progress Bar */}
                    {categoryUploadProgress !== null && (
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] text-gray-600 font-mono">
                          <span>Yükleniyor...</span>
                          <span>%{categoryUploadProgress}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[#C58B38] h-2 rounded-full transition-all duration-200"
                            style={{ width: `${categoryUploadProgress}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      disabled={isUploadingCategory}
                      onClick={handleUploadCategoryImage}
                      className="w-full py-2.5 px-4 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      {isUploadingCategory ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Firebase Storage'a Yükleniyor...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          <span>Görseli Firebase Storage'a Yükle ve Kategoriye Bağla</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mevcut Kategori Bilgileri (Korumalı Özet) */}
            <div className="border-t border-gray-100 pt-4 space-y-2">
              <span className="text-[11px] font-bold text-gray-700 block">
                Korunan Mevcut Kategori Bilgileri:
              </span>
              <div className="space-y-1.5 text-xs bg-gray-50/70 p-3.5 rounded-xl border border-gray-100">
                <div>
                  <span className="text-gray-400 text-[10px] block">Kısa Açıklama:</span>
                  <span className="text-gray-700">{editingCategory.shortDesc}</span>
                </div>
                {editingCategory.fireClassRange && (
                  <div>
                    <span className="text-gray-400 text-[10px] block">Yangın Sınıfı Aralığı:</span>
                    <span className="font-mono font-bold text-[#C58B38]">{editingCategory.fireClassRange}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-100 pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
