import React from 'react';
import { useRouter } from '../router/Router';
import { TECHNICAL_DOCUMENTS } from '../data/catalog';
import { SeoHead } from '../components/seo/SeoHead';
import { StorageImage } from '../components/common/StorageImage';
import { imageRegistry } from '../services/imageService';
import {
  FileText,
  Download,
  Thermometer,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const TechnicalCenterPage: React.FC = () => {
  const { navigate } = useRouter();

  const seoData = {
    title: 'Teknik Bilgi Merkezi | Yangın Camı ve Isı Standartları',
    description: 'EN 1364, EN 13501-2 yangın dayanım standartları, E, EW, EI30-EI120 sınıfları, SCHOTT ROBAX® termal dayanım parametreleri ve akustik lamine cam teknik kılavuzu.',
    canonical: 'https://mimaricam.com/teknik-bilgi',
    h1: 'Teknik Bilgi Merkezi - Mimari ve Yangın Camı Standartları',
  };

  return (
    <>
      <SeoHead seo={seoData} />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-14">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#C58B38] text-xs font-semibold">
              <FileText className="w-3.5 h-3.5" />
              <span>Mühendislik ve Şartname Kılavuzları</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
              Teknik Bilgi Merkezi
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Mimarlar, statik mühendisleri ve yangın danışmanları için Avrupa standartlarında teknik föyler, test raporları ve cam seçim kriterleri.
            </p>
          </div>

          {/* 1. Yangın Camı Kapsamlı Karşılaştırma Matrisi */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 space-y-6 shadow-xs">
            <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden relative border border-gray-200 bg-gray-100 shadow-xs">
              <StorageImage
                fileName={imageRegistry.camKalinligi}
                alt="Cam Kalınlığı ve Yangın Camı Karşılaştırma Matrisi"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-[#C58B38] font-bold uppercase tracking-wider">
                  EN 13501-2 & EN 1364 Kriterleri
                </span>
                <h2 className="text-2xl font-bold text-gray-900 mt-1">
                  Yangın Camı Sınıflarının Karşılaştırılması
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('/yangin-camlari')}
                className="text-xs font-semibold text-[#C58B38] hover:underline flex items-center gap-1 self-start"
              >
                <span>Yangın Camları Sayfası</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-semibold uppercase tracking-wider bg-gray-50/50">
                    <th className="py-3 px-4">Sınıf</th>
                    <th className="py-3 px-4">Alev & Duman (E)</th>
                    <th className="py-3 px-4">Radyant Isı (EW)</th>
                    <th className="py-3 px-4">Isı Yalıtımı (EI)</th>
                    <th className="py-3 px-4">Kritik Kullanım Alanı</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr className="hover:bg-amber-50/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#C58B38]">E30 - E120</td>
                    <td className="py-3.5 px-4 text-emerald-700">✓ 30-120 Dk Bütünlük</td>
                    <td className="py-3.5 px-4 text-gray-400">✕ Filtrelemez</td>
                    <td className="py-3.5 px-4 text-gray-400">✕ İzolasyon Yok</td>
                    <td className="py-3.5 px-4 text-gray-600">Dış cephe alev sıçrama bariyerleri</td>
                  </tr>
                  <tr className="hover:bg-amber-50/20">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#C58B38]">EW30 - EW90</td>
                    <td className="py-3.5 px-4 text-emerald-700">✓ 30-90 Dk Bütünlük</td>
                    <td className="py-3.5 px-4 text-emerald-700">✓ &lt;15 kW/m² Sınır</td>
                    <td className="py-3.5 px-4 text-gray-400">✕ İzolasyon Yok</td>
                    <td className="py-3.5 px-4 text-gray-600">Komşu parsel cephe sınırları</td>
                  </tr>
                  <tr className="hover:bg-amber-50/20 bg-amber-50/40 font-medium">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#C58B38]">EI30 (17mm)</td>
                    <td className="py-3.5 px-4 text-emerald-700">✓ 30 Dk Bütünlük</td>
                    <td className="py-3.5 px-4 text-emerald-700">✓ %100 Radyasyon Blokajı</td>
                    <td className="py-3.5 px-4 text-[#C58B38] font-bold">✓ 30 Dk Isı Yalıtımı (&lt;140°C)</td>
                    <td className="py-3.5 px-4 text-gray-800">Otel ve konut yangın kaçış holleri</td>
                  </tr>
                  <tr className="hover:bg-amber-50/20 bg-amber-50/40 font-medium">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#C58B38]">EI60 (25mm)</td>
                    <td className="py-3.5 px-4 text-emerald-700">✓ 60 Dk Bütünlük</td>
                    <td className="py-3.5 px-4 text-emerald-700">✓ %100 Radyasyon Blokajı</td>
                    <td className="py-3.5 px-4 text-[#C58B38] font-bold">✓ 60 Dk Isı Yalıtımı (&lt;140°C)</td>
                    <td className="py-3.5 px-4 text-gray-800">Hastaneler, AVM yangın duvarları</td>
                  </tr>
                  <tr className="hover:bg-amber-50/20 bg-amber-50/40 font-medium">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#C58B38]">EI90 - EI120</td>
                    <td className="py-3.5 px-4 text-emerald-700">✓ 90-120 Dk Bütünlük</td>
                    <td className="py-3.5 px-4 text-emerald-700">✓ %100 Radyasyon Blokajı</td>
                    <td className="py-3.5 px-4 text-[#C58B38] font-bold">✓ 90-120 Dk Isı Yalıtımı</td>
                    <td className="py-3.5 px-4 text-gray-800">Metro, havalimanı ve kamu sığınakları</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 2. SCHOTT ROBAX® ve Isı Dayanımı Rehberi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-[#C58B38] font-semibold text-xs uppercase tracking-wider">
                <Thermometer className="w-4 h-4 text-[#C58B38]" />
                <span>SCHOTT ROBAX® Cam-Seramik Bilimi</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Neden Standart Temperli Cam Şöminede Kullanılamaz?
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Standart temperli camlar en fazla 200°C - 250°C sıcaklık gradyanına dayanabilir. Şöminede doğrudan alev teması anında sıcaklık saniyeler içinde 500°C üzerine çıkar. Temperli cam yüksek genleşme katsayısı nedeniyle anında patlar.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                <div className="text-gray-600">
                  <span className="text-[#C58B38] font-bold font-mono">SCHOTT ROBAX®:</span> Termal genleşme katsayısı α ≈ 0 (-0.3 x 10⁻⁶/K). Sıcakken üzerine soğuk su dökülse dahi termal şoktan etkilenmez.
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
              <div className="flex items-center gap-2 text-[#C58B38] font-semibold text-xs uppercase tracking-wider">
                <Layers className="w-4 h-4 text-[#C58B38]" />
                <span>Akustik ve Güvenlikli Lamine Camlar</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Akustik PVB ile 50 dB Ses İzolasyonu
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Rezonans frekans kırılmasını önleyen çok katmanlı akustik lamine camlar, bulvar cephelerindeki araç trafiği ve havalimanı kalkış gürültüsünü 42 dB ila 50 dB arasında söndürür. Kırıldığında insan güvenliğini tehlikeye atmayan 1B1 sınıfı güvenlik sunar.
              </p>
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-2 text-xs">
                <div className="text-gray-600">
                  <span className="text-[#C58B38] font-bold font-mono">Kombinasyon:</span> 4+4.2 SoundSafe / 5+5.2 SoundSafe / 6+6.2 SoundSafe
                </div>
              </div>
            </div>
          </div>

          {/* 3. İndirilebilir Teknik Dokümanlar Listesi */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Teknik Şartnameler ve CAD İndirme
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TECHNICAL_DOCUMENTS.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#C58B38] font-mono font-bold">{doc.standardCode}</span>
                      <span className="text-gray-400 font-mono uppercase">{doc.fileType} • {doc.fileSizeMb} MB</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{doc.title}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{doc.description}</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate('/teklif-al')}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#C58B38]" />
                    <span>Dokümanı İste</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
