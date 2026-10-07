import React from 'react';
import { GlassConfigurator } from '../components/configurator/GlassConfigurator';
import { SeoHead } from '../components/seo/SeoHead';
import { StorageImage } from '../components/common/StorageImage';
import { imageRegistry } from '../services/imageService';
import { Sparkles, Shield, Cpu, Compass } from 'lucide-react';

export const ConfiguratorPage: React.FC = () => {
  const seoData = {
    title: 'MimariCam - Şömine Camı ve Kapak Hesaplayıcı',
    description: 'Ölçünü gir, fiyatını al, anında sipariş ver!',
    canonical: 'https://mimaricam.com/camini-tasarla',
    h1: 'Ölçünü Gir. Fiyatını Anında Gör. Siparişini Ver.',
  };

  return (
    <>
      <SeoHead seo={seoData} />
      <div className="min-h-screen bg-[#F8F9FA] py-3.5 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-2">
          {/* Header Message */}
          <div className="text-center max-w-xl mx-auto pt-0.5 pb-1">
            <h1 className="text-base sm:text-lg md:text-xl font-black tracking-tight leading-none bg-gradient-to-r from-[#A8721E] via-[#C58A2B] to-[#D89B3D] bg-clip-text text-transparent drop-shadow-[0_1px_2px_rgba(197,138,43,0.2)]">
              Ölçünü Gir. Fiyatını Anında Gör. Siparişini Ver.
            </h1>
          </div>

          {/* Configurator Component */}
          <GlassConfigurator />

          {/* Technical Guidance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="bg-white border border-gray-200 shadow-xs p-5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-[#C58B38] font-semibold text-sm">
                <Shield className="w-4 h-4" />
                <span>Isı ve Yangın Dayanımı</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Şöminelerde SCHOTT ROBAX® 4mm (800°C dayanım), yangın kapılarında ise EI30 veya EI60 intumescent yangın camları tercih edilmelidir.
              </p>
            </div>

            <div className="bg-white border border-gray-200 shadow-xs p-5 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-[#C58B38] font-semibold text-sm">
                <Cpu className="w-4 h-4" />
                <span>Hassas CNC & Su Jeti Delik Delme</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Kulp, menteşe veya sabitleme delikleri temperleme öncesinde milimetrik su jeti ile açılır ve havşalanır.
              </p>
            </div>

            <div className="bg-white border border-gray-200 shadow-xs p-5 rounded-xl space-y-2">
              <div className="h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 mb-2">
                <StorageImage
                  fileName={imageRegistry.mimariCamTasarimi}
                  alt="Mimari Cam Tasarımı"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex items-center gap-2 text-[#C58B38] font-semibold text-sm">
                <Sparkles className="w-4 h-4" />
                <span>Kavisli & Bombe Cam Üretimi</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                Şömine veya dairesel cepheler için merkez yay derinliğini (orta bombe mm) girmeniz yeterlidir; kalıplarımız buna göre optimize edilir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
