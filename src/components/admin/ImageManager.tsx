import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  Link as LinkIcon,
  Sparkles,
  CheckCircle2,
  Trash2,
  Edit3,
  Copy,
  ExternalLink,
  Eye,
  RefreshCw,
  SlidersHorizontal,
  Layers,
  Tag,
  CheckCircle,
  AlertCircle,
  X,
  FileCode,
  HardDrive,
  Globe2,
} from 'lucide-react';
import { imageService, formatSeoFileName } from '../../services/imageService';
import { ImageItem } from '../../types';
import { CATEGORIES, PRODUCTS } from '../../data/catalog';

export const ImageManager: React.FC = () => {
  // Mode: Upload device vs URL
  const [inputMode, setInputMode] = useState<'device' | 'url'>('device');

  // Images list
  const [images, setImages] = useState<ImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // New Image draft state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // AI-generated draft fields
  const [draftName, setDraftName] = useState('');
  const [draftSeoFileName, setDraftSeoFileName] = useState('');
  const [draftAltText, setDraftAltText] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [draftCategory, setDraftCategory] = useState('Yangına Dayanıklı Camlar');
  const [draftProduct, setDraftProduct] = useState('MimariCam HeavyDuty EI90 Yangın Camı');
  const [draftIsActive, setDraftIsActive] = useState(true);
  const [draftOrder, setDraftOrder] = useState(1);
  const [draftSource, setDraftSource] = useState<'Firebase Storage' | 'Harici URL'>('Firebase Storage');

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');

  // Edit Modal State
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing images on mount
  const loadImages = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const data = await imageService.getAllImages();
      setImages(data || []);
      // Calculate next default order
      if (data && data.length > 0) {
        const maxOrder = Math.max(...data.map((img) => img.order || 0));
        setDraftOrder(maxOrder + 1);
      } else {
        setDraftOrder(1);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Görseller yüklenirken bir sorun oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  // Handle device file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Lütfen geçerli bir görsel dosyası seçin (PNG, JPEG, WebP).');
      return;
    }

    setSelectedFile(file);
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
    setDraftSource('Firebase Storage');
    setErrorMsg(null);

    // Read base64 for AI analysis
    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = reader.result as string;
      await runAIAnalysis({
        imageBase64: base64String,
        mimeType: file.type,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  // Handle Drag & Drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);
        setDraftSource('Firebase Storage');
        setErrorMsg(null);

        const reader = new FileReader();
        reader.onload = async () => {
          const base64String = reader.result as string;
          await runAIAnalysis({
            imageBase64: base64String,
            mimeType: file.type,
            fileName: file.name,
          });
        };
        reader.readAsDataURL(file);
      } else {
        setErrorMsg('Lütfen geçerli bir görsel dosyası sürükleyin.');
      }
    }
  };

  // Handle URL Image Analysis
  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrlInput.trim()) {
      setErrorMsg('Lütfen geçerli bir görsel URL adresi girin.');
      return;
    }

    setSelectedFile(null);
    setPreviewUrl(imageUrlInput.trim());
    setDraftSource('Harici URL');
    setErrorMsg(null);

    await runAIAnalysis({
      imageUrl: imageUrlInput.trim(),
      fileName: 'web-gorsel',
    });
  };

  // Run AI analysis and auto-populate all fields
  const runAIAnalysis = async (params: {
    imageBase64?: string;
    mimeType?: string;
    imageUrl?: string;
    fileName?: string;
  }) => {
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const aiData = await imageService.analyzeWithAI(params);

      // Auto-populate all metadata
      setDraftName(aiData.name);
      setDraftSeoFileName(aiData.seoFileName);
      setDraftAltText(aiData.altText);
      setDraftTitle(aiData.title);
      setDraftDescription(aiData.description);
      setDraftCategory(aiData.category || 'Yangına Dayanıklı Camlar');
      setDraftProduct(aiData.product || 'MimariCam HeavyDuty EI90 Yangın Camı');
      setDraftIsActive(true); // default Active

      setSuccessMsg('Görsel başarıyla analiz edildi! AI verileri otomatik oluşturuldu.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('AI analysis error:', err);
      setErrorMsg('AI analizi sırasında uyarı alındı, varsayılan şablon değerleri aktarıldı.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Save new image to Firestore & Storage
  const handleSaveImage = async () => {
    if (!previewUrl) {
      setErrorMsg('Lütfen önce bir görsel seçin veya URL girin.');
      return;
    }

    if (!draftName.trim()) {
      setErrorMsg('Görsel adı boş bırakılamaz.');
      return;
    }

    setIsSaving(true);
    setErrorMsg(null);
    setUploadProgress(0);

    try {
      let finalUrl = previewUrl;
      let finalStoragePath: string | undefined = undefined;

      // 1. If from device: upload to Firebase Storage under `mimaricam-gorseller/`
      if (inputMode === 'device' && selectedFile) {
        const seoName = formatSeoFileName(draftSeoFileName || draftName);
        const uploadResult = await imageService.uploadToFirebaseStorage(
          selectedFile,
          seoName,
          (progress) => setUploadProgress(progress)
        );
        finalUrl = uploadResult.downloadUrl;
        finalStoragePath = uploadResult.storagePath;
      } else {
        // From URL: direct external URL, no Firebase Storage copy required
        finalUrl = previewUrl;
      }

      // 2. Save central record in Firestore collection `images`
      const newImage = await imageService.createImage({
        name: draftName.trim(),
        seoFileName: formatSeoFileName(draftSeoFileName || draftName),
        altText: draftAltText.trim() || draftName.trim(),
        title: draftTitle.trim() || draftName.trim(),
        description: draftDescription.trim(),
        category: draftCategory,
        product: draftProduct,
        isActive: draftIsActive,
        order: Number(draftOrder) || images.length + 1,
        source: draftSource,
        url: finalUrl,
        storagePath: finalStoragePath,
        fileSize: selectedFile?.size,
        mimeType: selectedFile?.type,
        updatedAt: new Date().toISOString(),
      });

      // Update state
      setImages((prev) => [newImage, ...prev]);
      setSuccessMsg('Görsel merkezi kütüphaneye başarıyla kaydedildi!');
      setTimeout(() => setSuccessMsg(null), 4000);

      // Reset upload draft form
      setSelectedFile(null);
      setImageUrlInput('');
      setPreviewUrl(null);
      setDraftName('');
      setDraftSeoFileName('');
      setDraftAltText('');
      setDraftTitle('');
      setDraftDescription('');
      setDraftOrder((prev) => prev + 1);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Görsel kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
      setUploadProgress(null);
    }
  };

  // Save manual edit
  const handleUpdateImage = async () => {
    if (!editingImage) return;

    try {
      await imageService.updateImage(editingImage.id, {
        name: editingImage.name,
        seoFileName: formatSeoFileName(editingImage.seoFileName || editingImage.name),
        altText: editingImage.altText,
        title: editingImage.title,
        description: editingImage.description,
        category: editingImage.category,
        product: editingImage.product,
        isActive: editingImage.isActive,
        order: Number(editingImage.order) || 1,
      });

      setImages((prev) =>
        prev.map((img) => (img.id === editingImage.id ? { ...editingImage } : img))
      );
      setEditingImage(null);
      setSuccessMsg('Görsel bilgileri güncellendi.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Güncelleme sırasında hata oluştu.');
    }
  };

  // Delete image
  const handleDeleteImage = async (id: string, storagePath?: string) => {
    try {
      await imageService.deleteImage(id, storagePath);
      setImages((prev) => prev.filter((img) => img.id !== id));
      setDeleteConfirmId(null);
      setSuccessMsg('Görsel kütüphaneden silindi.');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Görsel silinirken hata oluştu.');
    }
  };

  // Toggle active/passive
  const handleToggleActive = async (image: ImageItem) => {
    const updatedStatus = !image.isActive;
    try {
      await imageService.updateImage(image.id, { isActive: updatedStatus });
      setImages((prev) =>
        prev.map((img) => (img.id === image.id ? { ...img, isActive: updatedStatus } : img))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Copy Image ID
  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered images list
  const filteredImages = images.filter((img) => {
    const matchesSearch =
      img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.seoFileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.altText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      img.product?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === 'all' || img.category === filterCategory;

    const matchesSource =
      filterSource === 'all' || img.source === filterSource;

    const matchesActive =
      filterActive === 'all'
        ? true
        : filterActive === 'active'
        ? img.isActive === true
        : img.isActive === false;

    return matchesSearch && matchesCategory && matchesSource && matchesActive;
  });

  return (
    <div className="space-y-8">
      {/* Toast Messages */}
      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg(null)}
            className="text-emerald-600 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-rose-600 hover:text-rose-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SECTION 1: ADD IMAGE (Cihazdan Görsel Seç / URL ile Görsel Ekle) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-[#C58B38]">
                <Sparkles className="w-4 h-4" />
              </span>
              <h2 className="text-base font-bold text-gray-900">
                Otomatik AI Görsel Yükleme ve Analiz
              </h2>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Görseli seçin veya URL girin; Gemini AI mimari cam tipini, SEO dosya adını, alt metnini ve teknik detayları otomatik doldursun.
            </p>
          </div>

          {/* Sadece iki seçenek: Cihazdan Görsel Seç / URL ile Görsel Ekle */}
          <div className="inline-flex rounded-xl p-1 bg-gray-100 border border-gray-200 text-xs">
            <button
              type="button"
              onClick={() => {
                setInputMode('device');
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                inputMode === 'device'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Cihazdan Görsel Seç</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setInputMode('url');
                setSelectedFile(null);
                setPreviewUrl(null);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                inputMode === 'url'
                  ? 'bg-white text-gray-900 shadow-xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>URL ile Görsel Ekle</span>
            </button>
          </div>
        </div>

        {/* Input Interface Area */}
        {inputMode === 'device' ? (
          /* Cihazdan Görsel Seç */
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-[#C58B38] rounded-2xl p-8 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-amber-50/30 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 text-[#C58B38] flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">
              Görseli buraya sürükleyin veya dosya seçmek için tıklayın
            </h4>
            <p className="text-xs text-gray-500 mt-1">
              Desteklenen formatlar: WEBP, PNG, JPG, JPEG • Firebase Storage (`mimaricam-gorseller/`) yoluna yüklenir
            </p>
          </div>
        ) : (
          /* URL ile Görsel Ekle */
          <form onSubmit={handleUrlSubmit} className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/yangin-cami.jpg şeklinde görsel URL'si girin..."
              value={imageUrlInput}
              onChange={(e) => setImageUrlInput(e.target.value)}
              className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C58B38] shadow-xs"
            />
            <button
              type="submit"
              disabled={isAnalyzing || !imageUrlInput.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Görseli Getir & AI Analiz Et</span>
            </button>
          </form>
        )}

        {/* AI Analyzing Spinner & Status */}
        {isAnalyzing && (
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center gap-3 text-xs text-amber-900 animate-pulse">
            <RefreshCw className="w-4 h-4 text-[#C58B38] animate-spin shrink-0" />
            <div>
              <span className="font-bold">Gemini AI Görseli İnceliyor...</span>
              <p className="text-[11px] text-amber-800">
                Yangın sınıfı, mimari cam türü, SEO dosya adı, alt metin ve teknik katalog eşleşmeleri oluşturuluyor.
              </p>
            </div>
          </div>
        )}

        {/* Preview and Auto-Populated AI Fields */}
        {previewUrl && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-gray-100">
            {/* Visual Preview */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold text-gray-700 block">Görsel Önizleme</span>
              <div className="relative rounded-xl border border-gray-200 overflow-hidden bg-gray-100 aspect-4/3 flex items-center justify-center shadow-xs group">
                <img
                  src={previewUrl}
                  alt={draftAltText || 'Önizleme'}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-white backdrop-blur-xs">
                  {inputMode === 'device' ? 'Firebase Storage' : 'Harici URL'}
                </span>
              </div>

              {uploadProgress !== null && (
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-gray-500 font-mono">
                    <span>Yükleniyor...</span>
                    <span>%{uploadProgress}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C58B38] transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* AI Auto-Populated & Editable Fields */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>AI Bilgileri Otomatik Dolduruldu (İsteğe bağlı düzenleyebilirsiniz)</span>
                </div>
                <span className="text-[11px] text-gray-400 font-mono">
                  Kaynak: {draftSource}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Görsel Adı */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Görsel Adı</label>
                  <input
                    type="text"
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    placeholder="Örn: EI90 Yangın Dayanımlı Cam"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                  />
                </div>

                {/* SEO Uyumlu Dosya Adı */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">
                    SEO Uyumlu Dosya Adı <span className="text-[10px] text-gray-400">(Türkçe karaktersiz)</span>
                  </label>
                  <input
                    type="text"
                    value={draftSeoFileName}
                    onChange={(e) => setDraftSeoFileName(e.target.value)}
                    placeholder="ei90-yangin-dayanimli-cam-mimaricam.webp"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                  />
                </div>

                {/* Alt Metni */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Alt Metni (SEO & Erişilebilirlik)</label>
                  <input
                    type="text"
                    value={draftAltText}
                    onChange={(e) => setDraftAltText(e.target.value)}
                    placeholder="Örn: EI90 yangın dayanımlı cam sistemi"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                  />
                </div>

                {/* Başlık */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">Başlık</label>
                  <input
                    type="text"
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                    placeholder="Örn: EI90 Yangın Camı"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                  />
                </div>

                {/* İlgili Kategori */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">İlgili Kategori</label>
                  <select
                    value={draftCategory}
                    onChange={(e) => setDraftCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                    <option value="Diğer Mimari Çözümler">Diğer Mimari Çözümler</option>
                  </select>
                </div>

                {/* İlgili Ürün */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">İlgili Ürün</label>
                  <select
                    value={draftProduct}
                    onChange={(e) => setDraftProduct(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                  >
                    {PRODUCTS.map((p) => (
                      <option key={p.id} value={p.name}>
                        {p.code ? `[${p.code}] ` : ''}{p.name}
                      </option>
                    ))}
                    <option value="Özel Yangın Camı">Özel Yangın Camı</option>
                    <option value="Genel Mimari Cam">Genel Mimari Cam</option>
                  </select>
                </div>

                {/* Sıralama & Aktif/Pasif */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-600 font-medium mb-1">Sıralama</label>
                    <input
                      type="number"
                      value={draftOrder}
                      onChange={(e) => setDraftOrder(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                    />
                  </div>

                  <div className="pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                      <input
                        type="checkbox"
                        checked={draftIsActive}
                        onChange={(e) => setDraftIsActive(e.target.checked)}
                        className="w-4 h-4 accent-[#C58B38] rounded cursor-pointer"
                      />
                      <span>Aktif</span>
                    </label>
                  </div>
                </div>

                {/* Açıklama (Tam genişlik) */}
                <div className="sm:col-span-2">
                  <label className="block text-gray-600 font-medium mb-1">Açıklama</label>
                  <textarea
                    rows={2}
                    value={draftDescription}
                    onChange={(e) => setDraftDescription(e.target.value)}
                    placeholder="EI90 sınıfı yangın dayanımlı mimari cam çözümü..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                  />
                </div>
              </div>

              {/* Action Buttons: Kaydet */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    setImageUrlInput('');
                  }}
                  className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium transition-colors"
                >
                  İptal
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSaveImage}
                  className="px-6 py-2.5 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Kütüphaneye Kaydet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: IMAGE LIBRARY (GÖRSEL KÜTÜPHANESİ) */}
      <div className="space-y-4">
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-gray-900">
                Merkezi Görsel Kütüphanesi
              </h3>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 font-bold border border-gray-200">
                {images.length} Görsel
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Frontend bileşenleri bu merkezi kütüphaneden ve `imageId` üzerinden görsellere erişebilir.
            </p>
          </div>

          <button
            type="button"
            onClick={loadImages}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs flex items-center gap-1.5 transition-colors self-start shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Yenile</span>
          </button>
        </div>

        {/* Filter Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
            {/* Search */}
            <input
              type="text"
              placeholder="Görsel adı, dosya adı veya ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C58B38] w-64 shadow-xs"
            />

            {/* Category filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#C58B38] shadow-xs"
            >
              <option value="all">Tüm Kategoriler</option>
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Source filter */}
            <select
              value={filterSource}
              onChange={(e) => setFilterSource(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#C58B38] shadow-xs"
            >
              <option value="all">Tüm Kaynaklar</option>
              <option value="Firebase Storage">Firebase Storage</option>
              <option value="Harici URL">Harici URL</option>
            </select>

            {/* Status filter */}
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-700 focus:outline-none focus:border-[#C58B38] shadow-xs"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="active">Yalnızca Aktif</option>
              <option value="passive">Yalnızca Pasif</option>
            </select>
          </div>

          <div className="text-[11px] text-gray-500 font-mono">
            Gösterilen: {filteredImages.length} / {images.length}
          </div>
        </div>

        {/* Cards Grid */}
        {isLoading ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#C58B38]" />
            Görseller yükleniyor...
          </div>
        ) : filteredImages.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredImages.map((img) => (
              <div
                key={img.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Görsel Önizleme */}
                  <div className="relative aspect-4/3 bg-gray-100 overflow-hidden group">
                    <img
                      src={img.url}
                      alt={img.altText || img.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Source Badge */}
                    <div className="absolute top-2 left-2 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs font-semibold flex items-center gap-1 ${
                          img.source === 'Firebase Storage'
                            ? 'bg-blue-600/90 text-white'
                            : 'bg-neutral-800/90 text-white'
                        }`}
                      >
                        {img.source === 'Firebase Storage' ? (
                          <HardDrive className="w-3 h-3" />
                        ) : (
                          <Globe2 className="w-3 h-3" />
                        )}
                        {img.source}
                      </span>
                    </div>

                    {/* Aktif/Pasif Toggle Badge */}
                    <div className="absolute top-2 right-2">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(img)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-xs transition-colors flex items-center gap-1 backdrop-blur-xs ${
                          img.isActive
                            ? 'bg-emerald-600/90 text-white hover:bg-emerald-700'
                            : 'bg-rose-600/90 text-white hover:bg-rose-700'
                        }`}
                        title="Durumu değiştirmek için tıklayın"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            img.isActive ? 'bg-white' : 'bg-gray-300'
                          }`}
                        />
                        {img.isActive ? 'Aktif' : 'Pasif'}
                      </button>
                    </div>

                    {/* Quick view link */}
                    <a
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute bottom-2 right-2 w-7 h-7 rounded-lg bg-black/60 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs"
                      title="Görseli yeni sekmede aç"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-2 text-xs">
                    {/* Görsel Adı */}
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1" title={img.name}>
                        {img.name}
                      </h4>
                      <p className="text-[11px] font-mono text-[#C58B38] line-clamp-1" title={img.seoFileName}>
                        {img.seoFileName}
                      </p>
                    </div>

                    {/* Kategori */}
                    <div className="flex items-center gap-1.5 text-gray-600">
                      <Layers className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="line-clamp-1 font-medium">{img.category}</span>
                    </div>

                    {/* Ürün */}
                    {img.product && (
                      <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                        <Tag className="w-3 h-3 text-gray-400 shrink-0" />
                        <span className="line-clamp-1">{img.product}</span>
                      </div>
                    )}

                    {/* Alt Metni */}
                    <div className="bg-gray-50 p-2 rounded-lg border border-gray-100 text-[11px] text-gray-600 line-clamp-2 italic">
                      "{img.altText}"
                    </div>

                    {/* imageId Copy Info */}
                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-gray-400">
                      <span>ID: {img.id.slice(0, 10)}...</span>
                      <button
                        type="button"
                        onClick={() => handleCopyId(img.id)}
                        className="text-[#C58B38] hover:underline flex items-center gap-1 font-sans font-medium"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedId === img.id ? 'Kopyalandı!' : 'ID Kopyala'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Actions: Düzenle / Sil */}
                <div className="p-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-2">
                  <div className="text-[11px] font-mono text-gray-400">
                    Sıra: #{img.order || 1}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingImage({ ...img })}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-[#C58B38] text-gray-700 hover:text-[#C58B38] text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Düzenle</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(img.id)}
                      className="px-2.5 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-rose-400 text-gray-500 hover:text-rose-600 text-xs font-semibold flex items-center gap-1 transition-colors shadow-2xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Sil</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center space-y-3">
            <Upload className="w-10 h-10 text-gray-400 mx-auto" />
            <h4 className="text-base font-bold text-gray-900">Henüz Görsel Bulunmuyor</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Yukarıdaki alandan cihazınızdan bir görsel seçebilir veya web URL'si girerek AI analizi ile ilk görselinizi ekleyebilirsiniz.
            </p>
          </div>
        )}
      </div>

      {/* MODAL 1: EDIT IMAGE (DÜZENLE) */}
      {editingImage && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-[#C58B38]" />
                <h3 className="text-base font-bold text-gray-900">Görsel Bilgilerini Düzenle</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Preview Thumbnail */}
              <div className="sm:col-span-2 flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <img
                  src={editingImage.url}
                  alt={editingImage.name}
                  className="w-14 h-14 object-cover rounded-lg border border-gray-200"
                />
                <div>
                  <span className="font-mono text-[10px] text-gray-500">ID: {editingImage.id}</span>
                  <div className="font-bold text-gray-900 text-xs">{editingImage.name}</div>
                  <span className="text-[10px] text-[#C58B38] font-mono">Kaynak: {editingImage.source}</span>
                </div>
              </div>

              {/* Görsel Adı */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">Görsel Adı</label>
                <input
                  type="text"
                  value={editingImage.name}
                  onChange={(e) => setEditingImage({ ...editingImage, name: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38]"
                />
              </div>

              {/* SEO Dosya Adı */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">SEO Dosya Adı</label>
                <input
                  type="text"
                  value={editingImage.seoFileName}
                  onChange={(e) => setEditingImage({ ...editingImage, seoFileName: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-mono text-gray-900 focus:outline-none focus:border-[#C58B38]"
                />
              </div>

              {/* Alt Metni */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">Alt Metni</label>
                <input
                  type="text"
                  value={editingImage.altText}
                  onChange={(e) => setEditingImage({ ...editingImage, altText: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38]"
                />
              </div>

              {/* Başlık */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">Başlık</label>
                <input
                  type="text"
                  value={editingImage.title}
                  onChange={(e) => setEditingImage({ ...editingImage, title: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38]"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">Kategori</label>
                <select
                  value={editingImage.category}
                  onChange={(e) => setEditingImage({ ...editingImage, category: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38]"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                  <option value="Diğer Mimari Çözümler">Diğer Mimari Çözümler</option>
                </select>
              </div>

              {/* Ürün */}
              <div>
                <label className="block text-gray-600 font-medium mb-1">Ürün</label>
                <select
                  value={editingImage.product}
                  onChange={(e) => setEditingImage({ ...editingImage, product: e.target.value })}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38]"
                >
                  {PRODUCTS.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name}
                    </option>
                  ))}
                  <option value="Özel Yangın Camı">Özel Yangın Camı</option>
                  <option value="Genel Mimari Cam">Genel Mimari Cam</option>
                </select>
              </div>

              {/* Sıralama & Aktif/Pasif */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-gray-600 font-medium mb-1">Sıralama</label>
                  <input
                    type="number"
                    value={editingImage.order}
                    onChange={(e) =>
                      setEditingImage({
                        ...editingImage,
                        order: parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38]"
                  />
                </div>

                <div className="pt-5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-800">
                    <input
                      type="checkbox"
                      checked={editingImage.isActive}
                      onChange={(e) =>
                        setEditingImage({ ...editingImage, isActive: e.target.checked })
                      }
                      className="w-4 h-4 accent-[#C58B38] rounded cursor-pointer"
                    />
                    <span>Aktif</span>
                  </label>
                </div>
              </div>

              {/* Açıklama */}
              <div className="sm:col-span-2">
                <label className="block text-gray-600 font-medium mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={editingImage.description}
                  onChange={(e) =>
                    setEditingImage({ ...editingImage, description: e.target.value })
                  }
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-gray-200">
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleUpdateImage}
                className="px-5 py-2 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white text-xs font-bold transition-colors shadow-xs"
              >
                Değişiklikleri Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: DELETE CONFIRMATION */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-xl">
            <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="text-sm font-bold text-gray-900">Görseli Silmek İstiyor musunuz?</h4>
              <p className="text-xs text-gray-500">
                Bu görsel Firestore'dan ve depolandıysa Firebase Storage'dan güvenle silinecektir.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => {
                  const targetImg = images.find((i) => i.id === deleteConfirmId);
                  handleDeleteImage(deleteConfirmId, targetImg?.storagePath);
                }}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
