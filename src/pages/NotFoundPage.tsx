import React from 'react';
import { useRouter } from '../router/Router';
import { SeoHead } from '../components/seo/SeoHead';
import { Flame, ArrowRight, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useRouter();

  const seoData = {
    title: '404 Sayfa Bulunamadı | MimariCam',
    description: 'Aradığınız sayfa bulunamadı veya taşınmış olabilir. MimariCam şömine camı ve yangın camı çözümleri için ana sayfayı ziyaret edin.',
    canonical: 'https://mimaricam.com/404',
    h1: 'Aradığınız Sayfa Bulunamadı',
    noindex: true,
  };

  return (
    <>
      <SeoHead seo={seoData} />
      <div className="min-h-[80vh] bg-[#F8F9FA] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white border border-gray-200 rounded-[32px] p-8 text-center shadow-xl space-y-6">
          <div className="w-20 h-20 bg-amber-50 border border-amber-200 text-[#C58B38] rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Flame className="w-10 h-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-600">
              Hata 404 • Sayfa Bulunamadı
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight">
              Aradığınız Sayfa Bulunamadı
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Ulaşmaya çalıştığınız sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak erişilemiyor olabilir.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/camini-tasarla')}
              className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#C58B38] hover:bg-[#b0782e] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              <Home className="w-4 h-4" />
              <span>Camını Tasarla (Ana Sayfa)</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/urunler')}
              className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-300 bg-white hover:bg-gray-100 text-gray-800 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Ürün Kataloğu</span>
              <ArrowRight className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
