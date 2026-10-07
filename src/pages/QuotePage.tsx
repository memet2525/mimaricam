import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/Router';
import { useAuth } from '../hooks/useAuth';
import { quoteService } from '../services/quoteService';
import { storageService } from '../services/storageService';
import { CustomDesignConfig, QuoteItem, ClientType } from '../types';
import { SeoHead } from '../components/seo/SeoHead';
import {
  Send,
  Upload,
  CheckCircle,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

export const QuotePage: React.FC = () => {
  const { navigate } = useRouter();
  const { user } = useAuth();

  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientType, setClientType] = useState<ClientType>('architect');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [requiredDeliveryDate, setRequiredDeliveryDate] = useState('');
  const [notes, setNotes] = useState('');
  const [fileAttachment, setFileAttachment] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuoteNumber, setSubmittedQuoteNumber] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Quote items (either configured design or general product inquiry)
  const [items, setItems] = useState<QuoteItem[]>([]);

  useEffect(() => {
    if (user?.email && !clientEmail) {
      setClientEmail(user.email);
    }
    if (user?.displayName && !clientName) {
      setClientName(user.displayName);
    }

    // Check if session storage has pending configured glass
    if (typeof window !== 'undefined') {
      const pendingDesignRaw = window.sessionStorage.getItem('mimaricam_pending_design');
      if (pendingDesignRaw) {
        try {
          const design = JSON.parse(pendingDesignRaw) as CustomDesignConfig;
          setItems([
            {
              id: 'item-custom-1',
              type: 'custom_design',
              productTitle: `${design.glassTypeName} (${design.widthMm} x ${design.heightMm} mm)`,
              designConfig: design,
              quantity: 1,
            },
          ]);
        } catch {
          // ignore
        }
      }
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail || !clientPhone) {
      setErrorMsg('Lütfen ad, e-posta ve telefon alanlarını eksiksiz doldurunuz.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      let attachmentUrls: string[] = [];
      if (fileAttachment) {
        const fileUrl = await storageService.uploadFile(
          fileAttachment,
          'quotes',
          (prog) => setUploadProgress(prog)
        );
        attachmentUrls.push(fileUrl);
      }

      // Default item if none was selected
      const finalItems = items.length > 0 ? items : [
        {
          id: 'item-general',
          type: 'standard_product' as const,
          productTitle: 'Genel Mimari Cam / Yangın Camı Talebi',
          quantity: 1,
          notes: notes,
        },
      ];

      const newQuote = await quoteService.createQuote({
        clientName,
        clientCompany: clientCompany || undefined,
        clientType,
        clientEmail,
        clientPhone,
        city,
        district: district || undefined,
        items: finalItems,
        projectLocation: projectLocation || undefined,
        requiredDeliveryDate: requiredDeliveryDate || undefined,
        attachmentUrls: attachmentUrls.length > 0 ? attachmentUrls : undefined,
        adminNotes: notes || undefined,
        isGuest: !user,
      });

      // Clear pending design from storage
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem('mimaricam_pending_design');
      }

      setSubmittedQuoteNumber(newQuote.quoteNumber);
    } catch (err: any) {
      setErrorMsg(err.message || 'Teklif gönderilirken bir hata oluştu.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const seoData = {
    title: 'Hemen Teklif Al | Mimari ve Yangına Dayanıklı Cam',
    description: 'Şömine camı, yangın camı veya mimari cephe camı için resmi fiyat teklifi isteyin. Akredite test belgeli cam çözümleri için en geç 2 saatte yanıt.',
    canonical: 'https://mimaricam.com/teklif-al',
    h1: 'MimariCam Resmi Teklif Talep Formu',
  };

  return (
    <>
      <SeoHead seo={seoData} />
      <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold text-[#C58B38] uppercase tracking-wider">
              Hızlı & Resmi Teklif
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Kurumsal ve Özel Ölçü Teklif Formu
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Proje detaylarınızı, ebatları ve CAD çizimlerinizi iletin; teknik ekibimiz statik ve yangın yönetmeliğine uygun fiyatlandırma ile en kısa sürede dönüş yapsın.
            </p>
          </div>

          {/* Submission Success Banner */}
          {submittedQuoteNumber ? (
            <div className="bg-white border border-emerald-200 rounded-2xl p-8 sm:p-12 text-center space-y-6 shadow-sm animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto text-emerald-600">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-gray-900">Teklif Talebiniz Alındı!</h2>
                <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                  Teklif numaranız sistemimize kaydedilmiştir. Teknik departmanımız belirtilen telefon ve e-posta üzerinden en kısa sürede iletişime geçecektir.
                </p>
              </div>

              <div className="inline-block bg-gray-50 border border-gray-200 px-6 py-3 rounded-xl">
                <span className="text-xs text-gray-500 block mb-0.5">Teklif Takip Numaranız</span>
                <span className="text-xl font-mono font-bold text-[#C58B38]">
                  {submittedQuoteNumber}
                </span>
              </div>

              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-6 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-medium text-xs border border-gray-200 shadow-xs transition-colors"
                >
                  Ana Sayfaya Dön
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSubmittedQuoteNumber(null);
                    setItems([]);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Yeni Bir Teklif İste
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
              {/* Configured Item Preview if arriving from configurator */}
              {items.length > 0 && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-2xl p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#C58B38] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#C58B38]" />
                      Tasarladığınız Özel Cam Listede
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate('/camini-tasarla')}
                      className="text-[#C58B38] hover:underline font-semibold"
                    >
                      Ölçüleri Düzenle →
                    </button>
                  </div>

                  {items.map((item, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs shadow-xs">
                      <div>
                        <div className="text-gray-900 font-bold">{item.productTitle}</div>
                        {item.designConfig && (
                          <div className="text-gray-500 font-mono mt-1">
                            Şekil: {item.designConfig.shape.toUpperCase()} • {item.designConfig.widthMm}x{item.designConfig.heightMm}mm • {item.designConfig.thicknessMm}mm • {item.designConfig.edgeFinish}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-gray-600">Adet:</label>
                        <input
                          type="number"
                          min="1"
                          max="5000"
                          value={item.quantity}
                          onChange={(e) => {
                            const q = Math.max(1, Number(e.target.value));
                            setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, quantity: q } : it)));
                          }}
                          className="w-16 bg-white border border-gray-300 rounded px-2 py-1 text-gray-900 font-mono text-center shadow-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 1. Müşteri Profili & Şirket */}
              <div className="space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-[#C58B38]">
                  1. İletişim ve Firma Bilgileri
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Ad Soyad / Yetkili <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={clientName}
                      onChange={(e) => setClientName(e.target.value)}
                      placeholder="Örn: Mimar Selin Yılmaz"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Firma / Şirket Adı
                    </label>
                    <input
                      type="text"
                      value={clientCompany}
                      onChange={(e) => setClientCompany(e.target.value)}
                      placeholder="Örn: Yılmaz Mimarlık Ltd."
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      E-Posta Adresi <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="ornek@sirket.com"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Telefon Numarası <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="+90 5xx xxx xx xx"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Faaliyet Alanınız (Kullanıcı Tipi)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      { id: 'architect', label: 'Mimar / Tasarımcı' },
                      { id: 'engineer', label: 'Statik Mühendisi' },
                      { id: 'contractor', label: 'Müteahhit / İnşaat' },
                      { id: 'glazier', label: 'Camcı / Atölye' },
                      { id: 'stove_manufacturer', label: 'Şömine & Soba Üreticisi' },
                      { id: 'individual', label: 'Bireysel Kullanıcı' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setClientType(item.id as ClientType)}
                        className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-colors ${
                          clientType === item.id
                            ? 'bg-amber-50 border-[#C58B38] text-[#C58B38] font-bold shadow-xs'
                            : 'bg-white border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Teslimat & Proje Konumu */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="text-xs font-bold uppercase tracking-wider text-[#C58B38]">
                  2. Şantiye / Teslimat Bilgisi
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Şehir</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="İstanbul, Ankara, İzmir..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">İlçe</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      placeholder="Başakşehir, Çankaya vb."
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Hedef Teslim Tarihi
                    </label>
                    <input
                      type="date"
                      value={requiredDeliveryDate}
                      onChange={(e) => setRequiredDeliveryDate(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs text-gray-900 focus:outline-none focus:border-[#C58B38] shadow-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 3. CAD / Dosya Yükleme & Notlar */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="text-xs font-bold uppercase tracking-wider text-[#C58B38]">
                  3. Çizim / Teknik Dosya & Şartname Notu
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Mimari Çizim / CAD / DWG / PDF veya Fotoğraf Ekle
                  </label>
                  <div className="border-2 border-dashed border-gray-300 hover:border-[#C58B38] bg-gray-50/50 rounded-2xl p-6 text-center space-y-2 transition-colors">
                    <Upload className="w-8 h-8 text-[#C58B38] mx-auto" />
                    <div className="text-xs text-gray-700 font-medium">
                      {fileAttachment ? (
                        <span className="text-emerald-700 font-bold">{fileAttachment.name} ({Math.round(fileAttachment.size / 1024)} KB)</span>
                      ) : (
                        'Dosyayı sürükleyin veya bilgisayarınızdan seçin'
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500">
                      Desteklenen formatlar: DWG, DXF, PDF, PNG, JPG, ZIP (Maks. 25 MB)
                    </p>
                    <input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setFileAttachment(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="quote-file-input"
                    />
                    <label
                      htmlFor="quote-file-input"
                      className="inline-block mt-2 px-4 py-1.5 rounded-lg bg-white hover:bg-gray-50 text-xs text-gray-800 font-medium border border-gray-200 shadow-xs cursor-pointer transition-colors"
                    >
                      Dosya Seç
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Özel Notlar veya Şartname Maddeleri
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="İhale şartnamesi, cam katman detayları veya montaj koşulları..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C58B38] shadow-xs"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-sm uppercase tracking-wider shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>
                    Teklif Hazırlanıyor {uploadProgress > 0 ? `(%${uploadProgress})` : ''}...
                  </span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    <span>Teklif Talebini Gönder</span>
                  </>
                )}
              </button>

              <div className="text-center text-[11px] text-gray-500">
                Bilgileriniz gizlilik politikamıza uygun olarak yalnızca teklif hazırlığı amacıyla kullanılır.
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
};
