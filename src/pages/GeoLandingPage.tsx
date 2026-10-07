import React from 'react';
import { useRouter } from '../router/Router';
import { GEO_PAGES, PRODUCTS } from '../data/catalog';
import { SeoHead } from '../components/seo/SeoHead';
import { StorageImage } from '../components/common/StorageImage';
import {
  MapPin,
  Phone,
  Shield,
  Truck,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const GeoLandingPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const citySlug = params.city || 'istanbul';

  const geoData = GEO_PAGES.find((g) => g.slug === citySlug) || GEO_PAGES[0];
  const featuredProducts = PRODUCTS.filter((p) =>
    geoData.featuredProductSlugs.includes(p.slug)
  );

  const seoData = {
    title: geoData.title,
    description: geoData.metaDescription,
    canonical: `https://mimaricam.com/sehir/${geoData.slug}`,
    h1: geoData.h1,
    schemaJson: {
      '@type': 'LocalBusiness',
      name: `MimariCam ${geoData.city}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: geoData.city,
        addressCountry: 'TR',
        streetAddress: geoData.address,
      },
      telephone: geoData.phone,
      url: `https://mimaricam.com/sehir/${geoData.slug}`,
    },
  };

  return (
    <>
      <SeoHead seo={seoData} />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-gray-50 via-white to-amber-50/20 border border-gray-200 rounded-3xl p-8 sm:p-14 relative overflow-hidden shadow-xs">
            <div className="relative z-10 max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#C58B38] text-xs font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{geoData.city} Bölgesel Dağıtım ve Sevkiyat</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
                {geoData.h1}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {geoData.introText}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-gray-700">
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs">
                  <Phone className="w-3.5 h-3.5 text-[#C58B38]" />
                  <a href={`tel:${geoData.phone}`} className="font-semibold text-gray-900 hover:text-[#C58B38]">
                    {geoData.phone}
                  </a>
                </div>
                <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs">
                  <Truck className="w-3.5 h-3.5 text-[#C58B38]" />
                  <span>Şantiyeye Özel Kasa Ambalajlı Sevkiyat</span>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/camini-tasarla')}
                  className="px-6 py-3 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Özel Ölçü Tasarla & Sipariş Ver</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/teklif-al')}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs border border-gray-200 shadow-xs transition-all"
                >
                  {geoData.city} İçin Teklif Al
                </button>
              </div>
            </div>
          </div>

          {/* Key Regional Services */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#C58B38]" />
              <span>{geoData.city} İl ve İlçelerine Sağlanan Hizmetlerimiz</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {geoData.keyServices.map((service, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-700"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Regional Featured Products */}
          <div className="space-y-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {geoData.city} Bölgesinde En Çok Tercih Edilen Çözümler
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => navigate(`/urun/${p.slug}`)}
                  className="bg-white border border-gray-200 hover:border-[#C58B38] rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
                >
                  <div className="h-44 relative overflow-hidden bg-gray-100">
                    <StorageImage
                      imageName={p.imageUrl}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                    {p.fireRating !== 'NONE' && (
                      <span className="absolute top-3 right-3 text-xs font-mono font-bold bg-[#C58B38] text-white px-2 py-0.5 rounded shadow-sm">
                        {p.fireRating}
                      </span>
                    )}
                  </div>
                  <div className="p-5 space-y-2">
                    <div className="text-[10px] text-gray-400 font-mono">{p.code}</div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#C58B38] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2">{p.summary}</p>
                    <div className="pt-2 text-xs text-[#C58B38] font-semibold flex items-center gap-1">
                      <span>Detayları Gör</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
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
