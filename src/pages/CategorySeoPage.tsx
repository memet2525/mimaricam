import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/Router';
import { SeoHead } from '../components/seo/SeoHead';
import { CATEGORY_SEO_MAP, CATEGORY_SEO_LIST } from '../data/categorySeoPages';
import { CategorySeoItem } from '../data/categorySeoTypes';
import { GlassConfigurator } from '../components/configurator/GlassConfigurator';
import { FireGlassPriceCalculatorCard } from '../components/calculator/FireGlassPriceCalculatorCard';
import {
  Flame,
  Shield,
  Ruler,
  Wrench,
  AlertTriangle,
  HelpCircle,
  Calculator,
  ChevronRight,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Sparkles,
  PhoneCall,
  Layers,
  FileCheck2,
  Clock,
  Compass,
} from 'lucide-react';

interface CategorySeoPageProps {
  slug: string;
}

const CERAMIC_CALCULATOR_SLUGS = new Set([
  'seramik-cam',
  'soba-cami',
  'somine-cami',
  'pelet-soba-cami',
  'kuzine-soba-cami',
  'isiya-dayanikli-cam',
]);

const FIRE_AND_TEMPERED_SLUGS = new Set([
  'yangin-cami',
  'yangina-dayanikli-cam',
  'yangin-kapisi-cami',
  'yangin-guvenlik-cami',
  'yangin-emniyet-cami',
  'yangin-dayanimli-cam',
  'temperli-cam',
]);

const CATEGORY_PRIMARY_IMAGES: Record<string, string> = {
  'seramik-cam': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4',
  'soba-cami': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4',
  'somine-cami': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4',
  'pelet-soba-cami': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4',
  'kuzine-soba-cami': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4',
  'isiya-dayanikli-cam': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4',
  'yangin-cami': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fe30-yangin-cami-fiyat-hesaplama.png?alt=media&token=6749f48f-5eca-4d5b-9ae0-3bd64439592a',
  'yangina-dayanikli-cam': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fe60-yangina-dayanikli-cam-fiyat-hesaplama.png?alt=media&token=2f171f7c-b522-4077-aa31-116001c6148e',
  'yangin-kapisi-cami': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fe90-yangin-kapisi-cami-fiyat-hesaplama.png?alt=media&token=8b792855-cf59-4f89-a16c-9f3adeb278ef',
  'yangin-guvenlik-cami': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei30-yangin-guvenlik-cami-fiyat-hesaplama.png?alt=media&token=14023cd3-c9e3-40b4-8707-d01e6b17c260',
  'yangin-emniyet-cami': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei60-yangin-emniyet-cami-fiyat-hesaplama.png?alt=media&token=68b9bcf6-8f48-412e-b1b2-dbe52207b7f7',
  'yangin-dayanimli-cam': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-fiyat-hesaplama.png?alt=media&token=7044bccc-a18e-49d7-b1fe-7040d30636c4',
  'temperli-cam': 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/09-e-ew-yangin-cami-mimaricam.png?alt=media&token=bf957bd4-3af9-44ba-bd6f-ab1b081ef322',
};

export const CategorySeoPage: React.FC<CategorySeoPageProps> = ({ slug }) => {
  const { navigate } = useRouter();
  const category: CategorySeoItem = CATEGORY_SEO_MAP.get(slug) || CATEGORY_SEO_LIST[0];
  const hasCeramicCalculator = CERAMIC_CALCULATOR_SLUGS.has(category.slug);
  const isFireOrTempered = FIRE_AND_TEMPERED_SLUGS.has(category.slug);
  const isTempered = category.slug === 'temperli-cam';
  const isFireGlass = isFireOrTempered && !isTempered;

  const primaryImageUrl =
    CATEGORY_PRIMARY_IMAGES[category.slug] || CATEGORY_PRIMARY_IMAGES['seramik-cam'];

  // Fiyat hesaplama placeholder alanı için yerel ölçü önizleme state'i
  const [previewWidth, setPreviewWidth] = useState<string>('60');
  const [previewHeight, setPreviewHeight] = useState<string>('40');
  const [previewQty, setPreviewQty] = useState<number>(1);

  const parsedW = parseFloat(previewWidth) || 0;
  const parsedH = parseFloat(previewHeight) || 0;
  const approxM2 = Math.max(0.25, (parsedW * parsedH) / 10000);

  const relatedCategories = category.relatedCategorySlugs
    .map((relSlug) => CATEGORY_SEO_MAP.get(relSlug))
    .filter(Boolean) as CategorySeoItem[];

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.replace(/^#/, '');
      const element = document.getElementById(targetId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [slug]);

  const seoData = {
    title: category.title,
    description: category.metaDescription,
    canonical: category.canonical,
    h1: category.h1,
    ogImage: primaryImageUrl,
    schemaJson: {
      '@type': 'Product',
      name: category.name,
      image: primaryImageUrl,
      description: category.metaDescription,
      brand: {
        '@type': 'Brand',
        name: 'MimariCam',
      },
      category: category.name,
      url: category.canonical,
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'TRY',
        lowPrice: '1200',
        highPrice: '45000',
        offerCount: '1',
        availability: 'https://schema.org/InStock',
      },
    },
    imageObject: {
      '@type': 'ImageObject' as const,
      contentUrl: primaryImageUrl,
      name: `${category.name} - MimariCam`,
      description: category.metaDescription,
    },
  };

  return (
    <>
      <SeoHead seo={seoData} />

      <div className="min-h-screen bg-stone-50/60 pb-20">
        {/* ========================================================= */}
        {/* 1. ÜST BÖLÜM (HERO VEYA ÇALIŞAN HESAPLAYICI)             */}
        {/* ========================================================= */}
        {hasCeramicCalculator ? (
          /* 6 Seramik Cam Kategorisi İçin Sayfanın En Üstündeki Çalışan Hesaplayıcı */
          <section className="bg-[#F8F9FA] border-b border-gray-200/90 pt-4 pb-6 px-3 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-3">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-gray-500">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/');
                  }}
                  className="hover:text-[#C58A2B] transition-colors"
                >
                  Ana Sayfa
                </a>
                <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-[#C58A2B] font-semibold">{category.name}</span>
              </nav>

              {/* Kategori Başlığı & Badge */}
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-[11px] font-semibold">
                  <Sparkles className="w-3 h-3 text-[#C58A2B]" />
                  <span>{category.badge}</span>
                </div>
                <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                  {category.h1}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                  {category.intro}
                </p>
              </div>

              {/* Kullanıcının talep ettiği güçlü mesaj */}
              <div className="text-center pt-2 pb-1">
                <h2 className="text-base sm:text-lg md:text-xl font-black tracking-tight leading-none bg-gradient-to-r from-[#A8721E] via-[#C58A2B] to-[#D89B3D] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(197,138,43,0.2)]">
                  Ölçünü Gir, Fiyatını Anında Gör. Siparişini Ver.
                </h2>
              </div>

              {/* Ana sayfadaki çalışan seramik cam fiyat hesaplama aracı */}
              <div id="fiyat-hesapla" className="w-full">
                <GlassConfigurator />
              </div>
            </div>
          </section>
        ) : isFireOrTempered ? (
          /* 7 Yangın ve Temperli Cam Kategorisi İçin Sayfanın En Üstündeki Çalışan Hesaplayıcı */
          <section className="bg-[#F8F9FA] border-b border-gray-200/90 pt-3 pb-6 px-3 sm:px-6">
            <div className="max-w-5xl mx-auto space-y-3">
              {/* Güçlü Mesaj */}
              <div className="text-center pt-1 pb-1">
                <h2 className="text-base sm:text-lg md:text-xl font-black tracking-tight leading-none bg-gradient-to-r from-[#A8721E] via-[#C58A2B] to-[#D89B3D] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(197,138,43,0.2)]">
                  Ölçünü Gir, Fiyatını Anında Gör. Siparişini Ver.
                </h2>
              </div>

              <div id="fiyat-hesapla" className="max-w-md sm:max-w-xl mx-auto w-full mt-2">
                <FireGlassPriceCalculatorCard
                  categoryName={category.name}
                  categorySlug={category.slug}
                  isTempered={isTempered}
                  defaultRating={isTempered ? "EN 12150" : "EI60"}
                />
              </div>
            </div>
          </section>
        ) : (
          /* Diğer Kategoriler İçin Standart Hero Bölümü */
          <section className="bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-amber-900/30">
            <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-black/60 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10 space-y-6">
              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-400">
                <a
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/');
                  }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Ana Sayfa
                </a>
                <ChevronRight className="w-3.5 h-3.5 text-stone-600" />
                <span className="text-amber-400/90 font-medium">{category.name}</span>
              </nav>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{category.badge}</span>
              </div>

              {/* H1 Title */}
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight max-w-4xl">
                {category.h1}
              </h1>

              {/* Intro text */}
              <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-3xl font-normal">
                {category.intro}
              </p>

              {/* Hızlı Eylem & Fiyat Çağrısı */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#fiyat-hesapla"
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#B97F24] via-[#C58A2B] to-[#D89B3D] hover:from-[#A8721E] hover:to-[#C58A2B] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-amber-950/40 flex items-center gap-2.5 transition-all transform active:scale-98"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Ölçünü Gir, Anında Fiyatını Al</span>
                </a>

                <a
                  href="#montaj-rehberi"
                  className="px-5 py-3.5 rounded-xl bg-stone-800/80 hover:bg-stone-800 text-stone-200 border border-stone-700/80 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <Wrench className="w-4 h-4 text-amber-400" />
                  <span>Ölçü & Montaj Kılavuzu</span>
                </a>

                <a
                  href="tel:05421452525"
                  className="inline-flex items-center gap-2 text-xs text-stone-400 hover:text-white px-3 py-2 transition-colors font-mono ml-auto sm:ml-0"
                >
                  <PhoneCall className="w-4 h-4 text-emerald-400" />
                  <span>Teknik Danışma: 0542 145 25 25</span>
                </a>
              </div>
            </div>
          </section>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-14">
          {/* ========================================================= */}
          {/* 2. DİĞER HESAPLAYICISI OLMAYAN KATEGORİLER İÇİN PLACEHOLDER */}
          {/* ========================================================= */}
          {!hasCeramicCalculator && !isFireOrTempered && (
            <section id="fiyat-hesapla" className="scroll-mt-24">
              <div className="bg-white rounded-3xl border-2 border-amber-500/30 p-6 sm:p-8 lg:p-10 shadow-xl shadow-amber-900/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="relative z-10 space-y-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-5">
                    <div className="space-y-1">
                      <span className="text-[11px] font-bold text-[#C58A2B] uppercase tracking-widest block">
                        ONLİNE ÖZEL ÖLÇÜ FİYATLANDIRMA
                      </span>
                      <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                        Ölçünü Gir, Anında Fiyatını Al
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {category.name} ihtiyacınız için ölçülerinizi belirleyin; fabrikadan doğrudan milimetrik üretim fiyatınızı görün.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        <FileCheck2 className="w-3.5 h-3.5" />
                        <span>{category.priceCalculationInfo.standardThickness}</span>
                      </span>
                    </div>
                  </div>

                  {/* Hızlı Ölçü Giriş ve Yönlendirme Alanı */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Genişlik */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">
                          Genişlik (G) [cm]:
                        </label>
                        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-[#C58A2B] focus-within:bg-white transition-all">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={previewWidth}
                            onChange={(e) => setPreviewWidth(e.target.value.replace(/[^0-9.]/g, ''))}
                            className="w-full bg-transparent text-sm font-mono font-bold text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="60"
                          />
                          <span className="text-xs text-gray-400 font-bold ml-1">cm</span>
                        </div>
                      </div>

                      {/* Yükseklik */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">
                          Yükseklik (Y) [cm]:
                        </label>
                        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-[#C58A2B] focus-within:bg-white transition-all">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={previewHeight}
                            onChange={(e) => setPreviewHeight(e.target.value.replace(/[^0-9.]/g, ''))}
                            className="w-full bg-transparent text-sm font-mono font-bold text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="40"
                          />
                          <span className="text-xs text-gray-400 font-bold ml-1">cm</span>
                        </div>
                      </div>

                      {/* Adet */}
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-700 block">
                          Sipariş Adeti:
                        </label>
                        <div className="flex items-center bg-gray-50 border border-gray-300 rounded-xl px-3 py-2.5 focus-within:border-[#C58A2B] focus-within:bg-white transition-all">
                          <input
                            type="text"
                            inputMode="numeric"
                            value={previewQty}
                            onChange={(e) => setPreviewQty(Math.max(1, parseInt(e.target.value.replace(/[^0-9]/g, '')) || 1))}
                            className="w-full bg-transparent text-sm font-mono font-bold text-gray-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="1"
                          />
                          <span className="text-xs text-gray-400 font-bold ml-1">Adet</span>
                        </div>
                      </div>
                    </div>

                    {/* CTA Buton */}
                    <div className="lg:col-span-4 flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => navigate('/camini-tasarla')}
                        className="w-full py-4 px-6 rounded-2xl bg-[#C58A2B] hover:bg-[#b07823] text-white font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-amber-900/10 transition-all cursor-pointer transform active:scale-98"
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Hesaplayıcıda Aç & Sipariş Ver</span>
                        <ArrowRight className="w-4 h-4 text-white" />
                      </button>
                      <span className="text-[11px] text-gray-400 text-center">
                        Hesaplanan Cam Alanı: <strong className="text-gray-700 font-mono">{approxM2.toFixed(3)} m²</strong>
                      </span>
                    </div>
                  </div>

                  {/* Açıklama ve güven maddeleri */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Ahşap Zırhlı Sandık Kargo Garantisi</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Lazer ve CNC Hassas Kenar Rodajı</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Aynı Gün Üretim & Hızlı Gönderim</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ========================================================= */}
          {/* 3. BU ÜRÜN NEDİR? & NEREDE KULLANILIR? */}
          {/* ========================================================= */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Bu Ürün Nedir */}
            <section className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-[#C58A2B]">
                <Layers className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Teknik Tanım & Özellikler</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {category.whatIs.title}
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed font-normal">
                {category.whatIs.description}
              </p>

              <div className="space-y-2.5 pt-2">
                {category.whatIs.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 bg-stone-50 p-3 rounded-xl border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-[#C58A2B] shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Nerede Kullanılır */}
            <section className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-amber-700">
                <Compass className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Kullanım Alanları</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {category.whereUsed.title}
              </h2>

              <div className="space-y-3 pt-1">
                {category.whereUsed.items.map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/70 hover:bg-gray-50 transition-colors">
                    <h3 className="text-xs font-bold text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ========================================================= */}
          {/* 4. GÖRSEL SEO VE TEKNİK ÇİZİM ALANLARI */}
          {/* ========================================================= */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#C58A2B] uppercase tracking-wider block">
                GÖRSEL TEKNİK REHBER & FOTOĞRAFLAR
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {category.name} Görsel İnceleme ve Montaj Detayları
              </h2>
            </div>

            {/* 4 Kartlık Görsel Grid: Ürün, Ölçü, Montaj, Kullanım Alanı */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Ürün Görseli */}
              <div className="bg-stone-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col group">
                {isFireGlass || isTempered ? (
                  <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center">
                    <img
                      src={
                        isTempered
                          ? 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/09-e-ew-yangin-cami-mimaricam.png?alt=media&token=bf957bd4-3af9-44ba-bd6f-ab1b081ef322'
                          : 'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-sertifikali-urun.png?alt=media&token=cf251cee-46cb-4e7b-8a77-0f0038df006d'
                      }
                      alt={category.visuals.product.alt}
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-full object-contain block"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold font-mono z-10">
                      {category.visuals.product.tag}
                    </div>
                  </div>
                ) : hasCeramicCalculator ? (
                  <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Feramik-cam-schott-robax-4mm-isiya-dayanikli.png?alt=media&token=e0711ba3-00b0-4e47-a6ea-3ef1173f15c4"
                      alt={category.visuals.product.alt}
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-full object-contain block"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold font-mono z-10">
                      {category.visuals.product.tag}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-stone-800 to-stone-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold font-mono">
                      {category.visuals.product.tag}
                    </div>
                    <Layers className="w-10 h-10 text-amber-400 mb-2 opacity-90 group-hover:scale-105 transition-transform" />
                    <span className="text-xs font-bold text-white px-2">
                      {category.visuals.product.title}
                    </span>
                  </div>
                )}
                <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-gray-900 block leading-tight mb-1">
                      {category.visuals.product.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-snug">{category.visuals.product.desc}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono block pt-1 border-t border-gray-100/50">
                    Alt: {category.visuals.product.alt}
                  </span>
                </div>
              </div>

              {/* 2. Ölçü Alma Görseli */}
              <div className="bg-stone-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col group">
                {isFireGlass || isTempered ? (
                  <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-dograma-olcusu.png?alt=media&token=a4ae92c4-0980-410c-aaf3-18fa8ab9a45a"
                      alt={category.visuals.measure.alt}
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-full object-contain block"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold font-mono z-10">
                      {category.visuals.measure.tag}
                    </div>
                  </div>
                ) : hasCeramicCalculator ? (
                  <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-kapak-cerceve-ici-olcu-alma.png?alt=media&token=56284421-1dca-455d-a127-1280fd9cb5b8"
                      alt={category.visuals.measure.alt}
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-full object-contain block"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold font-mono z-10">
                      {category.visuals.measure.tag}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-amber-950 to-stone-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold font-mono">
                      {category.visuals.measure.tag}
                    </div>
                    <Ruler className="w-10 h-10 text-amber-400 mb-2 opacity-90 group-hover:scale-105 transition-transform" />
                    <span className="text-xs font-bold text-white px-2">
                      {category.visuals.measure.title}
                    </span>
                  </div>
                )}
                <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-gray-900 block leading-tight mb-1">
                      {category.visuals.measure.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-snug">{category.visuals.measure.desc}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono block pt-1 border-t border-gray-100/50">
                    Alt: {category.visuals.measure.alt}
                  </span>
                </div>
              </div>

              {/* 3. Montaj Görseli */}
              <div className="bg-stone-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col group">
                {isFireGlass || isTempered ? (
                  <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-montaj-detayi.png?alt=media&token=d8bfba88-bb37-4b6d-81e0-42e3932149a7"
                      alt={category.visuals.install.alt}
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-full object-contain block"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold font-mono z-10">
                      {category.visuals.install.tag}
                    </div>
                  </div>
                ) : hasCeramicCalculator ? (
                  <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-fitil-destekli-guvenli-montaj.png?alt=media&token=9c8769a2-c28f-45a9-9cfb-ed51b055bb95"
                      alt={category.visuals.install.alt}
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-full object-contain block"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold font-mono z-10">
                      {category.visuals.install.tag}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-stone-900 to-zinc-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold font-mono">
                      {category.visuals.install.tag}
                    </div>
                    <Wrench className="w-10 h-10 text-amber-400 mb-2 opacity-90 group-hover:scale-105 transition-transform" />
                    <span className="text-xs font-bold text-white px-2">
                      {category.visuals.install.title}
                    </span>
                  </div>
                )}
                <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-gray-900 block leading-tight mb-1">
                      {category.visuals.install.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-snug">{category.visuals.install.desc}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono block pt-1 border-t border-gray-100/50">
                    Alt: {category.visuals.install.alt}
                  </span>
                </div>
              </div>

              {/* 4. Uygulama Görseli */}
              <div className="bg-stone-50 rounded-2xl border border-gray-200 overflow-hidden flex flex-col group">
                {isFireGlass || isTempered ? (
                  <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fei90-yangin-dayanimli-cam-yangin-bolme-duvari.png?alt=media&token=887277ab-8b97-45bb-84b3-4677c1431ab8"
                      alt={category.visuals.application.alt}
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-full object-contain block"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold font-mono z-10">
                      {category.visuals.application.tag}
                    </div>
                  </div>
                ) : hasCeramicCalculator ? (
                  <div className="aspect-[4/3] bg-slate-50 relative overflow-hidden flex items-center justify-center">
                    <img
                      src="https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/yeni%20hesaplayici%20resimler%2Fseramik-cam-somine-pelet-soba-alev-goruntusu.png?alt=media&token=8c06e5c1-a622-4341-b5b8-e5dbb6810b04"
                      alt={category.visuals.application.alt}
                      width={400}
                      height={300}
                      loading="lazy"
                      className="w-full h-full object-contain block"
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold font-mono z-10">
                      {category.visuals.application.tag}
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-orange-950 to-stone-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-amber-300 text-[10px] font-bold font-mono">
                      {category.visuals.application.tag}
                    </div>
                    <Flame className="w-10 h-10 text-orange-400 mb-2 opacity-90 group-hover:scale-105 transition-transform" />
                    <span className="text-xs font-bold text-white px-2">
                      {category.visuals.application.title}
                    </span>
                  </div>
                )}
                <div className="p-3.5 space-y-1 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-gray-900 block leading-tight mb-1">
                      {category.visuals.application.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-snug">{category.visuals.application.desc}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 font-mono block pt-1 border-t border-gray-100/50">
                    Alt: {category.visuals.application.alt}
                  </span>
                </div>
              </div>
            </div>

            {/* Doğru vs Yanlış Montaj Karşılaştırma Alanı */}
            <div className="pt-4 border-t border-gray-100">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>Doğru ve Yanlış Montaj Karşılaştırması</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Doğru Montaj */}
                <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Doğru Montaj Yöntemi</span>
                  </div>
                  <p className="text-xs text-emerald-950 leading-relaxed">
                    {category.visuals.correctVsIncorrect.correctDesc}
                  </p>
                  <div className="text-[10px] text-emerald-700 font-mono">
                    Alt Metin: {category.visuals.correctVsIncorrect.correctAlt}
                  </div>
                </div>

                {/* Yanlış Montaj */}
                <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-2">
                  <div className="flex items-center gap-2 text-red-800 font-bold text-xs">
                    <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>Hatalı Montaj (Çatlama Riski)</span>
                  </div>
                  <p className="text-xs text-red-950 leading-relaxed">
                    {category.visuals.correctVsIncorrect.incorrectDesc}
                  </p>
                  <div className="text-[10px] text-red-700 font-mono">
                    Alt Metin: {category.visuals.correctVsIncorrect.incorrectAlt}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 5. ÖLÇÜSÜ NASIL ALINIR? */}
          {/* ========================================================= */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-[#C58A2B]">
              <Ruler className="w-5 h-5 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">Adım Adım Rehber</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {category.howToMeasure.title}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {category.howToMeasure.steps.map((st) => (
                <div key={st.step} className="p-4 rounded-2xl bg-stone-50 border border-gray-200 space-y-2 relative">
                  <div className="w-7 h-7 rounded-xl bg-[#C58A2B] text-white font-mono font-bold text-xs flex items-center justify-center shadow-xs">
                    {st.step}
                  </div>
                  <h3 className="text-xs font-bold text-gray-900 pt-1">{st.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{st.desc}</p>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed font-medium">
                <strong>Hayati Tolerans Kuralı: </strong>
                {category.howToMeasure.toleranceTip}
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 6. NASIL MONTE EDİLİR? & DİKKAT EDİLECEKLER */}
          {/* ========================================================= */}
          <div id="montaj-rehberi" className="grid grid-cols-1 lg:grid-cols-12 gap-8 scroll-mt-24">
            {/* Nasıl Monte Edilir */}
            <section className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-stone-700">
                <Wrench className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Uygulama Adımları</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {category.howToInstall.title}
              </h2>

              <div className="space-y-3">
                {category.howToInstall.steps.map((s) => (
                  <div key={s.step} className="flex items-start gap-3 p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="w-6 h-6 rounded-lg bg-stone-800 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {s.step}
                    </span>
                    <div className="space-y-0.5">
                      <h3 className="text-xs font-bold text-gray-900">{s.title}</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Montajda Dikkat Edilmesi Gerekenler */}
            <section className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-5">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider">Kritik Uyarılar</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {category.installationCautions.title}
              </h2>

              <div className="space-y-3">
                {category.installationCautions.points.map((pt, i) => (
                  <div
                    key={i}
                    className={`p-3.5 rounded-xl border text-xs leading-relaxed space-y-1 ${
                      pt.isWarning
                        ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                        : 'bg-gray-50 border-gray-100 text-gray-700'
                    }`}
                  >
                    <span className="font-bold block text-gray-900 flex items-center gap-1.5">
                      {pt.isWarning && <span className="text-red-500 font-black">!</span>}
                      {pt.title}
                    </span>
                    <p className="text-gray-600">{pt.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* ========================================================= */}
          {/* 7. CAM NEDEN ÇATLAR? (ÖZEL TEKNİK BÖLÜM) */}
          {/* ========================================================= */}
          <section className="bg-gradient-to-br from-stone-900 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-10 border border-amber-500/20 shadow-xl space-y-6">
            <div className="flex items-center gap-2 text-amber-400">
              <Flame className="w-5 h-5 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-widest">ÖNEMLİ TEKNİK BİLGİ</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {category.whyGlassCracks.title}
            </h2>

            <p className="text-amber-200/90 text-sm sm:text-base font-medium max-w-3xl leading-relaxed">
              {category.whyGlassCracks.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2">
                <h3 className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <span>1. Isıl Genleşme Farkı</span>
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {category.whyGlassCracks.thermalExpansionExplanation}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2">
                <h3 className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <span>2. Aşırı Sıkılan Vidalar</span>
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {category.whyGlassCracks.overtighteningExplanation}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-2">
                <h3 className="text-xs sm:text-sm font-bold text-amber-400 flex items-center gap-1.5">
                  <span>3. Yanmaz Fitil & Conta</span>
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {category.whyGlassCracks.gasketExplanation}
                </p>
              </div>
            </div>

            <div className="bg-amber-400/10 border border-amber-400/30 rounded-2xl p-4 sm:p-5 space-y-2">
              <span className="text-xs font-bold text-amber-300 block uppercase tracking-wider">
                Çatlamayı %100 Önleme Kuralları:
              </span>
              <ul className="space-y-1.5 text-xs text-stone-200">
                {category.whyGlassCracks.preventionRules.map((rule, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* ========================================================= */}
          {/* 8. SIKÇA SORULAN SORULAR (SSS) */}
          {/* ========================================================= */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs space-y-6">
            <div className="flex items-center gap-2 text-[#C58A2B]">
              <HelpCircle className="w-5 h-5 shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">Sıkça Sorulan Sorular</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {category.name} Hakkında Merak Edilenler
            </h2>

            <div className="divide-y divide-gray-100">
              {category.faqs.map((faq, index) => (
                <div key={index} className="py-4 space-y-1.5">
                  <h3 className="text-sm font-bold text-gray-900 flex items-start gap-2">
                    <span className="text-[#C58A2B] font-mono font-black shrink-0">S:</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 pl-5 leading-relaxed font-normal">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ========================================================= */}
          {/* 9. İÇ BAĞLANTILAR (İLGİLİ KATEGORİLER) */}
          {/* ========================================================= */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                İlgili Diğer MimariCam Kategorileri
              </h2>
              <span className="text-xs text-gray-400">Özel Cam Çözümleri</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {relatedCategories.map((rel) => (
                <a
                  key={rel.slug}
                  href={rel.path}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(rel.path);
                  }}
                  className="p-4 rounded-2xl bg-white border border-gray-200/80 hover:border-[#C58A2B] hover:shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#C58A2B] font-bold block">
                      {rel.badge.split('|')[0].trim()}
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#C58A2B] transition-colors line-clamp-1">
                      {rel.name}
                    </h3>
                  </div>
                  <div className="pt-3 flex items-center justify-between text-[11px] text-gray-400 group-hover:text-gray-900 font-medium">
                    <span>İncele</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C58A2B] group-hover:translate-x-1 transition-transform" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
};
