import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { CATEGORIES, GEO_PAGES } from '../data/catalog';
import { productService } from '../services/productService';
import { Category } from '../types';
import { GlassConfigurator } from '../components/configurator/GlassConfigurator';
import { SeoHead } from '../components/seo/SeoHead';
import { StorageImage } from '../components/common/StorageImage';
import { imageRegistry } from '../services/imageService';
import {
  Building2,
  HardHat,
  Home,
  ArrowRight,
  Cpu,
  Calculator,
  Flame,
  Box,
  FileText,
  Award,
  Settings,
  Users,
  Globe,
  ChevronRight,
  Sparkles,
  MapPin,
  X,
  CheckCircle,
} from 'lucide-react';

const HOME_CATEGORY_CONFIG: Record<
  string,
  {
    imageUrl: string;
    alt: string;
  }
> = {
  'yangin-camlari': {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/ana%20sayfa%20gorselleri%2Fyangina-dayanikli-camlar-mimaricam.png?alt=media&token=7dda3633-2450-4cc3-a033-8d551417efb2',
    alt: 'Yangına dayanıklı camlar MimariCam',
  },
  'cat-yangin': {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/ana%20sayfa%20gorselleri%2Fyangina-dayanikli-camlar-mimaricam.png?alt=media&token=7dda3633-2450-4cc3-a033-8d551417efb2',
    alt: 'Yangına dayanıklı camlar MimariCam',
  },
  'isiya-dayanikli-camlar': {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/ana%20sayfa%20gorselleri%2Fisiya-dayanikli-camlar-mimaricam.png?alt=media&token=0bfe306e-7016-4051-aae2-5a3ea2e3e7b4',
    alt: 'Isıya dayanıklı camlar MimariCam',
  },
  'cat-isi': {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/ana%20sayfa%20gorselleri%2Fisiya-dayanikli-camlar-mimaricam.png?alt=media&token=0bfe306e-7016-4051-aae2-5a3ea2e3e7b4',
    alt: 'Isıya dayanıklı camlar MimariCam',
  },
  'somine-cami': {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/ana%20sayfa%20gorselleri%2Fsomine-camlari-mimaricam.png?alt=media&token=09baa487-25b6-4505-b80d-ee317d60c754',
    alt: 'Şömine camları MimariCam',
  },
  'cat-somine': {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/ana%20sayfa%20gorselleri%2Fsomine-camlari-mimaricam.png?alt=media&token=09baa487-25b6-4505-b80d-ee317d60c754',
    alt: 'Şömine camları MimariCam',
  },
  'soba-cami': {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/ana%20sayfa%20gorselleri%2Fsoba-camlari-mimaricam.png?alt=media&token=b0954274-b4c6-4ebe-bd15-1cf75ab4bad0',
    alt: 'Soba camları MimariCam',
  },
  'cat-soba': {
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/ana%20sayfa%20gorselleri%2Fsoba-camlari-mimaricam.png?alt=media&token=b0954274-b4c6-4ebe-bd15-1cf75ab4bad0',
    alt: 'Soba camları MimariCam',
  },
};

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [activeSlide, setActiveSlide] = useState(0);
  const [showAdvisorModal, setShowAdvisorModal] = useState(false);
  const [showConfiguratorSection, setShowConfiguratorSection] = useState(false);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  React.useEffect(() => {
    productService.getCategories().then(setCategories);
  }, []);

  // Hero Carousel Slide Files (0: Hero Slider / 1: Cam Çatı / 2: EI90 / 3: EI120)
  const heroSlideFiles = [
    imageRegistry.caminGucunuKesfetSlider,
    imageRegistry.homeCamCati,
    imageRegistry.ei90YanginCami,
    imageRegistry.ei120YanginCami,
  ];

  // Quick Advisor State
  const [advisorStep, setAdvisorStep] = useState<1 | 2>(1);
  const [selectedApplication, setSelectedApplication] = useState<string>('');

  const seoData = {
    title: 'Mimari Cam Çözümleri | Yangına ve Isıya Dayanıklı Cam Sistemleri',
    description:
      'Türkiye’nin lider mimari cam platformu. EI30-EI120 yangın camları, SCHOTT ROBAX® şömine camları ve özel ölçü mimari cam çözümleri. Camınızı tasarlayın, anında teklif alın.',
    canonical: 'https://mimaricam.com/',
    h1: 'Yangına Karşı Güven Mimarinin Geleceği - Mimari Cam Çözümleri',
    ogImage:
      'https://firebasestorage.googleapis.com/v0/b/mimaricam-7dbd6.firebasestorage.app/o/mimaricam-sosyal-medya-og-gorseli.png?alt=media&token=c0bf265b-49f1-4b82-9831-9c58a6af4d54',
    schemaJson: {
      '@type': 'WebSite',
      name: 'MimariCam',
      url: 'https://mimaricam.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://mimaricam.com/urunler?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  };

  const handleAdvisorSelect = (type: string) => {
    setSelectedApplication(type);
    setAdvisorStep(2);
  };

  return (
    <>
      <SeoHead seo={seoData} />

      <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-amber-100 selection:text-[#C58B38]">
        {/* ================================================================ */}
        {/* 1. HERO SECTION (LIGHT, AIRY, CORPORATE & PREMIUM)               */}
        {/* ================================================================ */}
        <section className="relative w-full min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] flex items-center overflow-hidden bg-gray-50 border-b border-gray-200">
          {/* Split Backdrop Image with Soft Pristine Scrim */}
          <div className="absolute inset-0 z-0">
            <StorageImage
              fileName={heroSlideFiles[activeSlide] || imageRegistry.caminGucunuKesfetHero}
              fallbackSrc="/src/assets/images/hero_fire_office_1790196602452.jpg"
              alt="Yangına Karşı Güven, Mimarinin Geleceği - Yangın Camı ve Yüksek Yapı Cephe Sistemleri"
              width={1920}
              height={1080}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {/* Light, fresh gradient overlay ensuring pristine contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/40"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/30"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-24 w-full flex flex-col justify-between min-h-[560px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1">
              {/* Left Column: Bold Headline & CTA */}
              <div className="lg:col-span-7 xl:col-span-8 space-y-5 sm:space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.12]">
                  <span className="block text-gray-900">Yangına</span>
                  <span className="block text-gray-900">Karşı Güven</span>
                  <span className="block text-[#C58B38]">Mimarinin</span>
                  <span className="block text-[#C58B38]">Geleceği</span>
                </h1>

                <p className="text-base sm:text-lg text-gray-700 max-w-md font-medium leading-relaxed">
                  İnsanları, yapıları ve geleceği koruyan sertifikalı mimari cam çözümleri.
                </p>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigate('/urunler')}
                    className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] active:scale-[0.98] text-white font-bold text-sm tracking-wide shadow-sm hover:shadow-md transition-all"
                  >
                    <span>Ürünleri İncele</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Transparent Architectural Creed Overlay */}
              <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 justify-end items-end h-full">
                <div className="text-right space-y-2 select-none pr-4 pb-6 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-gray-200/80 shadow-xs">
                  <div className="text-xs font-bold tracking-[0.25em] uppercase text-gray-800">ŞEFFAF</div>
                  <div className="text-xs font-bold tracking-[0.25em] uppercase text-[#C58B38]">GÜVENLİ</div>
                  <div className="text-xs font-bold tracking-[0.25em] uppercase text-gray-800">SÜRDÜRÜLEBİLİR</div>
                </div>
              </div>
            </div>

            {/* Bottom Carousel Indicator Dots */}
            <div className="flex items-center justify-center gap-2 pt-6">
              {[0, 1, 2, 3].map((idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSlide(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    activeSlide === idx
                      ? 'w-7 h-2 bg-[#C58B38]'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 2. USER ROLES BAR (4 ROUNDED LIGHT CARDS IN 1 ROW)               */}
        {/* ================================================================ */}
        <section className="relative z-20 -mt-6 sm:-mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            {/* Role 1: Mimarlar İçin */}
            <div
              onClick={() => navigate('/yangin-camlari')}
              className="bg-white hover:bg-amber-50/30 border border-gray-200 rounded-2xl p-5 sm:p-6 text-center cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#C58B38] mb-3 group-hover:scale-110 transition-transform">
                <Building2 className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#C58B38] transition-colors">
                Mimarlar İçin
              </h3>
            </div>

            {/* Role 2: Mühendisler İçin */}
            <div
              onClick={() => navigate('/teknik-bilgi')}
              className="bg-white hover:bg-amber-50/30 border border-gray-200 rounded-2xl p-5 sm:p-6 text-center cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#C58B38] mb-3 group-hover:scale-110 transition-transform">
                <HardHat className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#C58B38] transition-colors">
                Mühendisler İçin
              </h3>
            </div>

            {/* Role 3: Müteahhitler İçin */}
            <div
              onClick={() => navigate('/teklif-al')}
              className="bg-white hover:bg-amber-50/30 border border-gray-200 rounded-2xl p-5 sm:p-6 text-center cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#C58B38] mb-3 group-hover:scale-110 transition-transform">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8"
                >
                  <path d="M4 22h16" />
                  <path d="M7 22V5l7-3v20" />
                  <path d="M14 5h7l-4 4h-3" />
                  <path d="M21 9v7l-2 2" />
                  <path d="M7 11h7" />
                  <path d="M7 16h7" />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#C58B38] transition-colors">
                Müteahhitler İçin
              </h3>
            </div>

            {/* Role 4: Bireysel Kullanıcılar */}
            <div
              onClick={() => navigate('/camini-tasarla')}
              className="bg-white hover:bg-amber-50/30 border border-gray-200 rounded-2xl p-5 sm:p-6 text-center cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#C58B38] mb-3 group-hover:scale-110 transition-transform">
                <Home className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-[#C58B38] transition-colors">
                Bireysel Kullanıcılar
              </h3>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 3. "ÜRÜN KATEGORİLERİ" SECTION (EXACT 4 IMAGE CARDS)             */}
        {/* ================================================================ */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Ürün Kategorileri
            </h2>
            <button
              type="button"
              onClick={() => navigate('/urunler')}
              className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-[#C58B38] flex items-center gap-1 transition-colors"
            >
              <span>Tüm Kategoriler</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {categories.slice(0, 4).map((cat) => {
              const cardConfig =
                HOME_CATEGORY_CONFIG[cat.slug] ||
                HOME_CATEGORY_CONFIG[cat.id] || {
                  imageUrl: cat.imageUrl,
                  alt: `${cat.name} MimariCam`,
                };

              return (
                <div
                  key={cat.id}
                  onClick={() => navigate(`/kategori/${cat.slug}`)}
                  className="group relative h-80 sm:h-96 rounded-2xl overflow-hidden cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  <img
                    src={cardConfig.imageUrl}
                    alt={cardConfig.alt}
                    width={300}
                    height={380}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/85 via-gray-900/30 to-transparent"></div>
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <span className="text-base sm:text-lg font-bold text-white group-hover:text-[#E5A93C] transition-colors">
                      {cat.name}
                    </span>
                    <ArrowRight className="w-5 h-5 text-white group-hover:text-[#E5A93C] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================ */}
        {/* 4. "SIZE EN UYGUN CAMI BULUN" FEATURE BANNER                      */}
        {/* ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
          <div className="bg-amber-50/40 border border-amber-200/80 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-xs">
            <div className="max-w-2xl">
              <h3 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Size En Uygun Camı Bulun
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed">
                Projenize, ihtiyacınıza ve yangın yönetmeliklerine göre en doğru cam çözümünü akıllı asistan ile keşfedin.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAdvisorModal(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xs transition-colors shrink-0"
            >
              <Cpu className="w-5 h-5 text-white" />
              <span>Akıllı Cam Asistanı</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 5. TOOL / UTILITY GRID (4 CLEAN TILES)                            */}
        {/* ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Tile 1: Cam Kalınlığı Hesaplama */}
            <div
              onClick={() => {
                setShowConfiguratorSection(true);
                setTimeout(() => {
                  document.getElementById('cad-configurator-anchor')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 text-center cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#C58B38] mb-3 group-hover:scale-110 transition-transform">
                <Calculator className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#C58B38] transition-colors leading-snug">
                Cam Kalınlığı Hesaplama
              </h4>
            </div>

            {/* Tile 2: Yangın Dayanım Sınıfı Seçimi (EI, EW, E) */}
            <div
              onClick={() => navigate('/yangin-camlari')}
              className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 text-center cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#C58B38] mb-3 group-hover:scale-110 transition-transform">
                <Flame className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#C58B38] transition-colors leading-snug">
                Yangın Dayanım Sınıfı Seçimi (EI, EW, E)
              </h4>
            </div>

            {/* Tile 3: 3D Görselleştirme */}
            <div
              onClick={() => {
                setShowConfiguratorSection(true);
                setTimeout(() => {
                  document.getElementById('cad-configurator-anchor')?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 text-center cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#C58B38] mb-3 group-hover:scale-110 transition-transform">
                <Box className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#C58B38] transition-colors leading-snug">
                3D Görselleştirme
              </h4>
            </div>

            {/* Tile 4: Teknik Doküman ve Sertifikalar */}
            <div
              onClick={() => navigate('/teknik-bilgi')}
              className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 text-center cursor-pointer shadow-xs hover:shadow-md transition-all group flex flex-col items-center justify-center"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-[#C58B38] mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-[#C58B38] transition-colors leading-snug">
                Teknik Doküman ve Sertifikalar
              </h4>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* OPTIONAL/EXPANDABLE CAD CONFIGURATOR SECTION                     */}
        {/* ================================================================ */}
        {showConfiguratorSection && (
          <section id="cad-configurator-anchor" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-6 sm:p-8 text-gray-900 border border-gray-200 shadow-md">
              <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#C58B38]" />
                  <h3 className="text-xl font-bold text-gray-900">Camını Tasarla & Milimetrik CAD Çizim Alanı</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfiguratorSection(false)}
                  className="text-xs text-gray-700 hover:text-gray-900 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-200 font-medium"
                >
                  Kapat
                </button>
              </div>
              <GlassConfigurator />
            </div>
          </section>
        )}

        {/* ================================================================ */}
        {/* 6. "DAHA GÜVENLİ, DAHA ESTETİK..." PROJECT SHOWCASE BANNER        */}
        {/* ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-gray-50 via-white to-amber-50/20 text-gray-900 border border-gray-200 shadow-xs min-h-[280px] sm:min-h-[320px] flex items-center">
            {/* Background Architecture Photo on the Right */}
            <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 z-0">
              <StorageImage
                fileName={imageRegistry.homeBuyukProjeler}
                fallbackSrc="/src/assets/images/hero_glass_facade_1790195829672.jpg"
                alt="Mimarlıkta Güvenin Şeffaf Hali"
                width={800}
                height={320}
                loading="lazy"
                className="w-full h-full object-cover object-right"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/90 to-transparent"></div>
            </div>

            {/* Content Left */}
            <div className="relative z-10 p-6 sm:p-10 md:p-12 max-w-xl space-y-5">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight text-gray-900">
                Daha Güvenli, Daha Estetik, Daha Sürdürülebilir Yapılar İçin
              </h3>
              <div>
                <button
                  type="button"
                  onClick={() => navigate('/projeler')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#C58B38] hover:bg-[#b0792b] text-white font-semibold text-xs sm:text-sm tracking-wide shadow-xs transition-all"
                >
                  <span>Projelerimizi İnceleyin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Vertical Overlay Tag on Far Right */}
            <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-white/95 backdrop-blur-md border border-gray-200 p-5 rounded-xl text-center max-w-[180px] shadow-sm">
              <div className="text-[11px] font-mono tracking-widest text-[#C58B38] uppercase font-bold mb-1">
                MİMARLIKTA
              </div>
              <div className="text-sm font-black tracking-wider text-gray-900 uppercase">
                GÜVENİN
              </div>
              <div className="text-xs font-semibold tracking-wider text-gray-500 uppercase mt-0.5">
                ŞEFFAF HALİ
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 7. TRUST PROOF & STATS STRIP (4 METRICS)                          */}
        {/* ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {/* Metric 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 flex items-center justify-center text-[#C58B38] mb-2">
                  <Award className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-gray-900">
                  10+
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  Yıllık Deneyim
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 flex items-center justify-center text-[#C58B38] mb-2">
                  <Settings className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-gray-900">
                  500+
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  Tamamlanan Proje
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 flex items-center justify-center text-[#C58B38] mb-2">
                  <Users className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black font-mono tabular-nums text-gray-900">
                  1000+
                </div>
                <div className="text-xs text-gray-500 font-medium mt-0.5">
                  Mutlu Müşteri
                </div>
              </div>

              {/* Metric 4 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-10 h-10 flex items-center justify-center text-[#C58B38] mb-2">
                  <Globe className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="text-base sm:text-lg font-bold text-gray-900 mt-2">
                  Türkiye Geneli
                </div>
                <div className="text-xs text-gray-500 font-medium">
                  Hizmet Ağı
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 8. SUSTAINABILITY / GREEN BANNER                                  */}
        {/* ================================================================ */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="relative rounded-2xl overflow-hidden min-h-[140px] sm:min-h-[160px] flex items-center shadow-xs border border-gray-200">
            {/* Forest Canopy Background */}
            <div className="absolute inset-0 z-0">
              <img
                src="/src/assets/images/forest_sustainable_1790196635255.jpg"
                alt="Sürdürülebilir Cam Çözümleri"
                width={1200}
                height={160}
                loading="lazy"
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/70"></div>
            </div>

            <div className="relative z-10 w-full p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="text-white space-y-1">
                <div className="text-xs sm:text-sm text-emerald-300 font-semibold">
                  Daha Temiz Bir Gelecek İçin
                </div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Sürdürülebilir Cam Çözümleri
                </h3>
              </div>

              <button
                type="button"
                onClick={() => navigate('/teknik-bilgi')}
                className="inline-flex items-center gap-2 px-6 py-2.5 sm:py-3 rounded-xl bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs sm:text-sm shadow-xs transition-colors shrink-0"
              >
                <span>Hakkımızda</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 9. SEO & GEO REGIONAL HUB (LIGHT CORPORATE PALETTE)               */}
        {/* ================================================================ */}
        <section className="bg-gray-50 text-gray-900 py-12 border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#C58B38] font-bold uppercase tracking-wider">
                <MapPin className="w-4 h-4" />
                <span>Bölgesel Lojistik & Şantiye Teslimat Noktaları</span>
              </div>
              <div className="text-xs text-gray-500">
                Türkiye’nin 81 iline ahşap kasalı vinçli sevkiyat
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              {GEO_PAGES.map((geo) => (
                <button
                  key={geo.slug}
                  type="button"
                  onClick={() => navigate(`/sehir/${geo.slug}`)}
                  className="bg-white border border-gray-200 hover:border-[#C58B38] rounded-xl p-3 text-left transition-colors group flex items-center justify-between shadow-xs hover:shadow-sm"
                >
                  <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-[#C58B38]">
                    {geo.city}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#C58B38] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ================================================================ */}
      {/* AKILLI CAM ASİSTANI MODAL (AI CAM ASİSTANI)                      */}
      {/* ================================================================ */}
      {showAdvisorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setShowAdvisorModal(false)}
          ></div>
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl p-6 sm:p-8 z-10 border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                <Cpu className="w-5 h-5 text-[#C58B38]" />
                <span>Akıllı Cam Asistanı</span>
              </div>
              <button
                type="button"
                onClick={() => setShowAdvisorModal(false)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {advisorStep === 1 ? (
              <div className="mt-5 space-y-4">
                <p className="text-xs sm:text-sm text-gray-600">
                  Uygulama alanınızı seçin; yönetmeliğe ve kullanım amacına en uygun cam türünü belirleyelim:
                </p>
                <div className="grid grid-cols-1 gap-2.5">
                  {[
                    { label: 'Yangın Kaçış Merdiveni & Kapısı (EI30 - EI120)', type: 'yangin' },
                    { label: 'Şömine & Soba Ön Camı (800°C Termal Şok)', type: 'somine' },
                    { label: 'Bina Dış Cephesi & Giydirme Cephe (Low-E / Solar)', type: 'cephe' },
                    { label: 'Ofis Bölme Duvarı & İç Mimari Akustik', type: 'ic_mekan' },
                    { label: 'Özel Ölçü Bombeli veya Perfore Cam', type: 'ozel' },
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleAdvisorSelect(item.type)}
                      className="w-full text-left p-3.5 rounded-xl border border-gray-200 hover:border-[#C58B38] hover:bg-amber-50/30 text-xs sm:text-sm font-medium text-gray-800 transition-all flex items-center justify-between group"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-[#C58B38] transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-5 space-y-5">
                <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs sm:text-sm text-gray-800">
                  <div className="font-bold flex items-center gap-1.5 mb-1 text-[#C58B38]">
                    <CheckCircle className="w-4 h-4 text-[#C58B38]" />
                    Önerilen Çözüm Belirlendi:
                  </div>
                  {selectedApplication === 'yangin' && (
                    <p>
                      Binaların Yangından Korunması Yönetmeliği gereği EN 1364 akreditasyonlu <strong>EI60 / EI90 FlameGuard Yangın Camı</strong> kullanılması zorunludur.
                    </p>
                  )}
                  {selectedApplication === 'somine' && (
                    <p>
                      800°C doğrudan alev ve termal şoka dayanıklı <strong>SCHOTT ROBAX® 4mm / 5mm Cam-Seramik</strong> önerilir.
                    </p>
                  )}
                  {selectedApplication === 'cephe' && (
                    <p>
                      Rüzgar ve termal gerilmeye karşı temperli <strong>SolarCool Low-E Lamine Çift Cam</strong> idealdir.
                    </p>
                  )}
                  {selectedApplication === 'ic_mekan' && (
                    <p>
                      1B1 emniyet sınıfında 42 dB ses yalıtımlı <strong>Akustik Lamine Emniyet Camı</strong> uygundur.
                    </p>
                  )}
                  {selectedApplication === 'ozel' && (
                    <p>
                      CAD çiziminize göre CNC su jetiyle kesilmiş <strong>Özel Ölçü Temperli Cam</strong> önerilir.
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdvisorModal(false);
                      if (selectedApplication === 'yangin') navigate('/yangin-camlari');
                      else if (selectedApplication === 'somine') navigate('/kategori/somine-camlari');
                      else if (selectedApplication === 'cephe') navigate('/kategori/cephe-camlari');
                      else if (selectedApplication === 'ozel') navigate('/camini-tasarla');
                      else navigate('/urunler');
                    }}
                    className="flex-1 py-3 bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs sm:text-sm rounded-xl text-center shadow-xs"
                  >
                    Detayları ve Fiyatı Gör
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAdvisorModal(false);
                      navigate('/teklif-al');
                    }}
                    className="px-4 py-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs sm:text-sm rounded-xl border border-gray-200 text-center shadow-xs"
                  >
                    Hemen Teklif Al
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
