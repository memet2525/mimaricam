import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/Router';
import { PRODUCTS } from '../data/catalog';
import { productService } from '../services/productService';
import { Product } from '../types';
import { SeoHead } from '../components/seo/SeoHead';
import { StorageImage } from '../components/common/StorageImage';
import { resolveImageUrl } from '../services/imageService';
import {
  Shield,
  Sparkles,
  FileText,
  Download,
  CheckCircle,
  ArrowRight,
  Award,
  Layers,
  Phone,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const slug = params.slug || '';

  const [product, setProduct] = useState<Product>(
    () => PRODUCTS.find((p) => p.slug === slug) || PRODUCTS[0]
  );

  useEffect(() => {
    productService.getProductBySlug(slug).then((found) => {
      if (found) setProduct(found);
    });
  }, [slug]);

  const resolvedProductImg = resolveImageUrl(product.imageUrl);

  const seoData = {
    title: `${product.name} | Teknik Özellikler ve Ebatlar`,
    description: `${product.name}. ${product.summary} Yangın sınıfı: ${product.fireRating}, Kalınlık: ${product.thicknessMm}. Sertifikaları inceleyin ve hemen teklif alın.`,
    canonical: `https://mimaricam.com/urun/${product.slug}`,
    h1: product.name,
    ogImage: resolvedProductImg,
    schemaJson: {
      '@type': 'Product',
      name: product.name,
      image: resolvedProductImg,
      description: product.summary,
      sku: product.code,
      brand: {
        '@type': 'Brand',
        name: 'MimariCam',
      },
      offers: {
        '@type': 'AggregateOffer',
        priceCurrency: 'TRY',
        price: '0.00',
        availability: 'https://schema.org/InStock',
      },
    },
  };

  const handleDesignThis = () => {
    navigate('/camini-tasarla');
  };

  const handleGetQuote = () => {
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('mimaricam_prefill_product', JSON.stringify(product));
    }
    navigate('/teklif-al');
  };

  return (
    <>
      <SeoHead seo={seoData} />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <button type="button" onClick={() => navigate('/')} className="hover:text-[#C58B38]">
              Ana Sayfa
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() => navigate(`/kategori/${product.categorySlug}`)}
              className="hover:text-[#C58B38]"
            >
              {product.categoryName}
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.code}</span>
          </div>

          {/* Product Hero Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Col: High-Res Real Product Visual (6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <div className="relative rounded-2xl overflow-hidden bg-gray-50 border border-gray-200 aspect-[4/3] flex items-center justify-center p-4 shadow-xs">
                <StorageImage
                  key={`${product.id}-${product.imageUrl}`}
                  imageName={product.imageUrl}
                  alt={product.name}
                  width={600}
                  height={450}
                  className="w-full h-full object-contain rounded-xl"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                {product.fireRating !== 'NONE' && (
                  <span className="absolute top-4 right-4 bg-[#C58B38] text-white font-mono font-bold text-sm px-3 py-1 rounded-lg shadow-sm">
                    {product.fireRating} Sertifikalı
                  </span>
                )}
                <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-gray-800 bg-white/90 px-3 py-1.5 rounded-lg border border-gray-200 shadow-xs backdrop-blur-md">
                  <Shield className="w-3.5 h-3.5 text-[#C58B38]" />
                  <span>Gerçek Ürün Numunesi / Orijinal Sevkiyat</span>
                </div>
              </div>

              {/* Technical limits pill card */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 border border-gray-200 p-4 rounded-xl text-xs shadow-xs">
                <div>
                  <span className="text-gray-500 block">Maksimum Üretim Ebatları:</span>
                  <span className="text-gray-900 font-mono font-bold text-sm">
                    {product.maxDimensions.width} x {product.maxDimensions.height} mm
                  </span>
                </div>
                <div>
                  <span className="text-gray-500 block">Kalınlık Seçenekleri:</span>
                  <span className="text-[#C58B38] font-mono font-bold text-sm">
                    {product.thicknessMm}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Col: Product Info & Actions (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-mono font-bold text-[#C58B38] bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded">
                    {product.code}
                  </span>
                  <span className="text-xs text-gray-500">{product.categoryName}</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                  {product.name}
                </h1>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Teknik Özellikler
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates Badges */}
              <div>
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Akredite Sertifikalar & Standartlar
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.certificates.map((cert, cIdx) => (
                    <span
                      key={cIdx}
                      className="inline-flex items-center gap-1.5 text-xs bg-amber-50/60 border border-amber-200 text-amber-900 font-mono px-3 py-1 rounded-lg"
                    >
                      <Award className="w-3.5 h-3.5 text-[#C58B38]" />
                      {cert}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Teklif Al & Camını Tasarla */}
              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleDesignThis}
                  className="flex-1 min-w-[200px] py-3.5 px-6 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs uppercase tracking-wider shadow-xs active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Bu Camı Özel Ölçüde Tasarla</span>
                </button>

                <button
                  type="button"
                  onClick={handleGetQuote}
                  className="py-3.5 px-6 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs border border-gray-200 shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <span>Teklif Al</span>
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              {/* Quick direct phone contact */}
              <div className="pt-2 text-xs text-gray-500 flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C58B38]" />
                <span>Teknik şartname ve CAD desteği için:</span>
                <a href="tel:+905421452525" className="text-[#C58B38] font-semibold hover:underline">
                  +90 542 145 25 25
                </a>
              </div>
            </div>
          </div>

          {/* Deep Details: Applications & Downloads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-200">
            {/* Applications */}
            <div className="bg-white border border-gray-200 shadow-xs rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#C58B38]" />
                <span>Kullanım ve Montaj Alanları</span>
              </h3>
              <ul className="space-y-2 text-xs text-gray-700">
                {product.applications.map((app, aIdx) => (
                  <li key={aIdx} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C58B38]"></span>
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technical Docs */}
            <div className="bg-white border border-gray-200 shadow-xs rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#C58B38]" />
                <span>Teknik Dokümanlar & Föyler</span>
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                  <div>
                    <div className="text-gray-900 font-medium">{product.name} Teknik Şartname Föyü</div>
                    <div className="text-[10px] text-gray-500">PDF • Akredite Yangın Test Özetleri Dahil</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate('/teklif-al')}
                    className="text-[#C58B38] hover:text-[#b0792b] flex items-center gap-1 font-semibold"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>İndir / İste</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
