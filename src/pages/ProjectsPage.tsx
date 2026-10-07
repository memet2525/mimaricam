import React from 'react';
import { useRouter } from '../router/Router';
import { REFERENCE_PROJECTS } from '../data/catalog';
import { SeoHead } from '../components/seo/SeoHead';
import { StorageImage } from '../components/common/StorageImage';
import { Building, MapPin } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  const { navigate } = useRouter();

  const seoData = {
    title: 'Referans Projeler | Mimari ve Yangın Camı Uygulamaları',
    description: 'MimariCam referans projeleri. Finans merkezleri, havalimanları, rezidanslar ve otellerde gerçekleştirilen yangın camı ve strüktürel cephe camı uygulamaları.',
    canonical: 'https://mimaricam.com/projeler',
    h1: 'Referans Mimari Projelerimiz',
  };

  return (
    <>
      <SeoHead seo={seoData} />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#C58B38] text-xs font-semibold">
              <Building className="w-3.5 h-3.5" />
              <span>Mimari Sahada Başarıyla Tamamlanan İmalatlar</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
              Referans Projeler
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Türkiye’nin prestijli gökdelenleri, kamu ulaşım terminalleri ve özel villa şömineleri için ürettiğimiz cam çözümleri.
            </p>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {REFERENCE_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="bg-white border border-gray-200 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  <div className="h-60 relative overflow-hidden bg-gray-100">
                    {proj.storageFileName ? (
                      <StorageImage
                        fileName={proj.storageFileName}
                        fallbackSrc={proj.imageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={proj.imageUrl}
                        alt={proj.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    <span className="absolute bottom-4 left-4 bg-white/95 text-gray-800 text-xs px-3 py-1 rounded-lg border border-gray-200 shadow-xs backdrop-blur-md flex items-center gap-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#C58B38]" />
                      <span>{proj.location}</span>
                    </span>
                    <span className="absolute top-4 right-4 bg-[#C58B38] text-white text-xs font-mono font-bold px-2.5 py-1 rounded-lg shadow-xs">
                      {proj.year}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-bold text-gray-900">{proj.title}</h3>
                    {proj.architect && (
                      <div className="text-xs text-[#C58B38] font-medium">
                        Mimari Grup: {proj.architect}
                      </div>
                    )}
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 space-y-4">
                  <div className="border-t border-gray-100 pt-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Kullanılan Cam Sistemleri:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {proj.glassTypesUsed.map((type, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md border border-gray-200 font-medium"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Project Quote CTA */}
          <div className="bg-gradient-to-r from-gray-50 via-white to-amber-50/30 border border-gray-200 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-xs">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Sizin Projeniz İçin de Güvenilir Cam Çözümü Üretelim
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
              Şantiye şartnamenizi veya CAD detaylarınızı iletin, mühendislik ekibimiz gereken tüm yangın test belgeleriyle birlikte teklifinizi hazırlasın.
            </p>
            <div className="pt-2 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/camini-tasarla')}
                className="px-6 py-3 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors"
              >
                Camını Tasarla
              </button>
              <button
                type="button"
                onClick={() => navigate('/teklif-al')}
                className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs border border-gray-200 shadow-xs transition-colors"
              >
                Proje İçin Teklif Al
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
