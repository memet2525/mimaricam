import React, { useState } from 'react';
import { useRouter } from '../router/Router';
import { PRODUCTS } from '../data/catalog';
import { FireRating } from '../types';
import { SeoHead } from '../components/seo/SeoHead';
import { StorageImage } from '../components/common/StorageImage';
import { imageRegistry } from '../services/imageService';
import { FireGlassPriceCalculatorCard } from '../components/calculator/FireGlassPriceCalculatorCard';
import {
  Flame,
  Shield,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react';

export const FireGlassPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const initialClass = (params.fireClass?.toUpperCase() as FireRating) || 'EI60';
  const [selectedRating, setSelectedRating] = useState<FireRating>(
    ['EI30', 'EI60', 'EI90', 'EI120', 'EW', 'E'].includes(initialClass) ? initialClass : 'EI60'
  );

  const fireClasses: {
    rating: FireRating;
    title: string;
    subTitle: string;
    durationMinutes: number;
    insulation: boolean;
    radiation: boolean;
    integrity: boolean;
    desc: string;
    thickness: string;
    applications: string[];
  }[] = [
    {
      rating: 'EI30',
      title: 'EI30 Yangın Camı',
      subTitle: '30 Dakika Yangın Bütünlüğü ve Isı Yalıtımı',
      durationMinutes: 30,
      insulation: true,
      radiation: true,
      integrity: true,
      desc: 'İç mekan kaçış yolları, otel oda yangın kapıları ve konut koridorlarında alevi, dumanı ve ölümcül radyasyon ısısını 30 dakika boyunca bloke eder.',
      thickness: '17 mm',
      applications: ['Otel kapıları', 'Ofis koridor bölmeleri', 'Rezidans yangın holleri'],
    },
    {
      rating: 'EI60',
      title: 'EI60 Yangın Camı',
      subTitle: '60 Dakika Yangın Bütünlüğü ve Isı Yalıtımı',
      durationMinutes: 60,
      insulation: true,
      radiation: true,
      integrity: true,
      desc: 'Hastaneler, AVM yangın zonları, okullar ve yangın kaçış merdivenlerinde en yaygın kullanılan standart yangın camıdır.',
      thickness: '25 mm',
      applications: ['Hastane ameliyathaneleri', 'AVM yangın kompartımanları', 'Acil kaçış merdivenleri'],
    },
    {
      rating: 'EI90',
      title: 'EI90 Yangın Camı',
      subTitle: '90 Dakika Yüksek Performanslı Yangın Yalıtımı',
      durationMinutes: 90,
      insulation: true,
      radiation: true,
      integrity: true,
      desc: 'Havalimanları, metro istasyonları ve veri merkezleri gibi yüksek insan yoğunluğuna sahip kritik yapılarda 90 dakika kesintisiz koruma sağlar.',
      thickness: '35 mm',
      applications: ['Havalimanı terminalleri', 'Metro istasyonları', 'Veri merkezleri'],
    },
    {
      rating: 'EI120',
      title: 'EI120 Fortress Yangın Camı',
      subTitle: '120 Dakika (2 Saat) Maksimum Yangın Güvenliği',
      durationMinutes: 120,
      insulation: true,
      radiation: true,
      integrity: true,
      desc: '2 saat boyunca yangın tarafında 1150°C sıcaklık varken camın arkasında güvenli ortam sunan en üst düzey yangın dayanım seviyesidir.',
      thickness: '52 mm',
      applications: ['Kritik kamu binaları', 'Tünel kontrol merkezleri', 'Enerji ve petrokimya tesisleri'],
    },
    {
      rating: 'EW',
      title: 'EW Sınıfı Camlar',
      subTitle: 'Alev Bütünlüğü + Sınırlı Radyasyon Isı Kontrolü',
      durationMinutes: 60,
      insulation: false,
      radiation: true,
      integrity: true,
      desc: 'Alev ve dumanı durdururken ısı radyasyonunu 15 kW/m² altında sınırlandırarak bitişik binalara yangın sıçramasını önler.',
      thickness: '8 - 14 mm',
      applications: ['Bina cepheleri', 'Yangın saçakları', 'Atrium kenarları'],
    },
    {
      rating: 'E',
      title: 'E Sınıfı Camlar',
      subTitle: 'Yangın Bütünlüğü (Alev ve Duman Bariyeri)',
      durationMinutes: 30,
      insulation: false,
      radiation: false,
      integrity: true,
      desc: 'Isı yalıtımı gerektirmeyen ancak alev ve sıcak gaz geçişinin durdurulması istenen dış cephe ve çatı fenerliklerinde kullanılır.',
      thickness: '6 - 10 mm',
      applications: ['Dış cephe yangın şeritleri', 'Çatı duman tahliye kapakları'],
    },
  ];

  const currentInfo = fireClasses.find((f) => f.rating === selectedRating) || fireClasses[1];
  const matchingProducts = PRODUCTS.filter((p) => p.fireRating === selectedRating || (selectedRating === 'EI60' && p.fireRating === 'EI60'));

  const getFireClassImage = (rating: FireRating) => {
    switch (rating) {
      case 'EI120':
        return imageRegistry.ei120YanginCami;
      case 'EI90':
        return imageRegistry.ei90YanginCami;
      case 'EI30':
        return imageRegistry.ei30YanginCami;
      case 'E':
      case 'EW':
        return imageRegistry.eEwYanginCami;
      case 'EI60':
      default:
        return imageRegistry.yanginKapisiCami23;
    }
  };

  const seoData = {
    title: `${currentInfo.title} | Teknik Özellikler ve Fiyatlar`,
    description: `EN 1364 ve EN 13501 standartlarında sertifikalı ${currentInfo.title} çözümleri. Binaların yangından korunması yönetmeliğine tam uyumlu test belgeli camlar.`,
    canonical: `https://mimaricam.com/yangin-cami/${selectedRating.toLowerCase()}`,
    h1: `${currentInfo.title} - Mimari Yangın Güvenlik Sistemleri`,
  };

  return (
    <>
      <SeoHead seo={seoData} />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-[#C58B38] text-xs font-semibold">
              <Flame className="w-3.5 h-3.5" />
              <span>EN 13501-2 & EN 1364 Yangın Sınıflandırması</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
              Yangına Dayanıklı Cam Sistemleri
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Can ve mal güvenliğini teminat altına alan sertifikalı E, EW ve EI sınıflarını inceleyin; projenizin statik ve itfaiye şartnamesine uygun camı seçin.
            </p>
          </div>

          {/* Fire Class Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-gray-50 border border-gray-200 rounded-2xl max-w-4xl mx-auto shadow-xs">
            {fireClasses.map((item) => (
              <button
                key={item.rating}
                type="button"
                onClick={() => setSelectedRating(item.rating)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  selectedRating === item.rating
                    ? 'bg-[#C58B38] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }`}
              >
                <span>{item.rating}</span>
                <span className="text-[10px] opacity-80 font-mono">({item.durationMinutes} dk)</span>
              </button>
            ))}
          </div>

          {/* Selected Class Deep Technical Breakdown */}
          <div className="bg-white border border-gray-200 shadow-xs rounded-2xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="text-[#C58B38] text-xs font-mono font-bold uppercase tracking-wider mb-1">
                  Yangın Dayanım Seviyesi
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-gray-900">
                  {currentInfo.title}
                </h2>
                <p className="text-sm text-[#b0792b] font-medium mt-1">
                  {currentInfo.subTitle}
                </p>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {currentInfo.desc}
              </p>

              {/* 3 Pillars Matrix */}
              <div className="grid grid-cols-3 gap-3 pt-2">
                <div className={`p-3 rounded-xl border text-center ${currentInfo.integrity ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  <div className="text-xs font-bold">Bütünlük (E)</div>
                  <div className="text-[10px] mt-0.5">Alev & Duman</div>
                  <div className="text-xs font-mono font-bold mt-1">{currentInfo.integrity ? '✓ Sağlar' : '✕ Yok'}</div>
                </div>

                <div className={`p-3 rounded-xl border text-center ${currentInfo.radiation ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  <div className="text-xs font-bold">Radyasyon (W)</div>
                  <div className="text-[10px] mt-0.5">&lt; 15 kW/m²</div>
                  <div className="text-xs font-mono font-bold mt-1">{currentInfo.radiation ? '✓ Sağlar' : '✕ Yok'}</div>
                </div>

                <div className={`p-3 rounded-xl border text-center ${currentInfo.insulation ? 'bg-amber-50 border-amber-200 text-[#C58B38]' : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
                  <div className="text-xs font-bold">Yalıtım (I)</div>
                  <div className="text-[10px] mt-0.5">&lt; 140°C Soğuk Yüzey</div>
                  <div className="text-xs font-mono font-bold mt-1">{currentInfo.insulation ? '✓ Tam Koruma' : '✕ Yok'}</div>
                </div>
              </div>

              {/* Applications */}
              <div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Tavsiye Edilen Kullanım Alanları:
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentInfo.applications.map((app, idx) => (
                    <span key={idx} className="bg-gray-100 border border-gray-200 text-gray-700 text-xs px-3 py-1 rounded-lg">
                      {app}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => navigate('/camini-tasarla')}
                  className="px-6 py-3 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-all"
                >
                  {selectedRating} Camını Tasarla
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/teklif-al')}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs border border-gray-200 shadow-xs transition-all"
                >
                  Fiyat & Şartname Teklifi İste
                </button>
              </div>
            </div>

            {/* Right side Visual Card */}
            <div className="lg:col-span-5 bg-gray-50/80 border border-gray-200 rounded-2xl p-6 space-y-4">
              <div className="h-44 sm:h-48 w-full rounded-xl overflow-hidden relative border border-gray-200 bg-gray-100 shadow-xs">
                <StorageImage
                  fileName={getFireClassImage(selectedRating)}
                  alt={currentInfo.title}
                  width={500}
                  height={200}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#C58B38]" />
                <span>Teknik Parametre Değerleri</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">Nominal Kalınlık:</span>
                  <span className="font-mono font-bold text-gray-900">{currentInfo.thickness}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">Maksimum Yangın Süresi:</span>
                  <span className="font-mono font-bold text-[#C58B38]">{currentInfo.durationMinutes} Dakika</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">Test Standardı:</span>
                  <span className="font-mono text-gray-800 font-semibold">EN 1364-1 / EN 1634-1</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-500">Ses Yalıtımı (Rw):</span>
                  <span className="font-mono text-gray-900">41 - 47 dB</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">Optik Sınıf:</span>
                  <span className="font-mono text-gray-900">Sınıf 1 (Bozulmasız Şeffaflık)</span>
                </div>
              </div>

              <div className="bg-amber-50/80 border border-amber-200/80 p-3.5 rounded-xl text-amber-900 text-xs flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#C58B38] mt-0.5" />
                <span>
                  Yangın camlarının yangın kapısı veya bölme profili ile birlikte test edilmiş sertifikalı kombinasyonlarda kullanılması zorunludur.
                </span>
              </div>
            </div>
          </div>

          {/* Canlı Fiyat Hesaplama & WhatsApp Sipariş Kartı */}
          <div className="bg-gradient-to-b from-stone-50/80 to-white border border-amber-200/70 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-[11px] font-bold text-[#C58B38] uppercase tracking-widest block">
                CANLI ÖZEL ÖLÇÜ FİYAT HESAPLAMA
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
                {currentInfo.title} Fiyatı Hesapla & Sipariş Ver
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Genişlik, yükseklik ve adet girerek fabrikadan doğrudan satış tutarınızı görün ve WhatsApp üzerinden sipariş oluşturun.
              </p>
            </div>

            <FireGlassPriceCalculatorCard defaultRating={selectedRating as any} />
          </div>

          {/* Related Products */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-900">
              {selectedRating} Sertifikalı Ürünlerimiz
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {matchingProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/urun/${p.slug}`)}
                  className="bg-white border border-gray-200 hover:border-[#C58B38] rounded-xl overflow-hidden cursor-pointer group p-5 space-y-3 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono text-[#C58B38] font-bold">{p.fireRating}</span>
                    <span className="text-gray-500 font-mono">{p.thicknessMm}</span>
                  </div>
                  <h4 className="text-base font-bold text-gray-900 group-hover:text-[#C58B38] transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{p.summary}</p>
                  <div className="pt-2 text-xs text-[#C58B38] font-semibold flex items-center gap-1">
                    <span>Detayları İncele</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
