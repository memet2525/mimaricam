import React, { useState, useEffect } from 'react';
import { useRouter } from '../router/Router';
import { CATEGORIES, PRODUCTS } from '../data/catalog';
import { productService } from '../services/productService';
import { Category, Product } from '../types';
import { SeoHead } from '../components/seo/SeoHead';
import { StorageImage } from '../components/common/StorageImage';
import { resolveImageUrl } from '../services/imageService';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { params, navigate } = useRouter();
  const slug = params.slug || 'yangin-camlari';

  const [category, setCategory] = useState<Category>(
    () => CATEGORIES.find((c) => c.slug === slug) || CATEGORIES[0]
  );
  const [products, setProducts] = useState<Product[]>(
    () => PRODUCTS.filter((p) => p.categoryId === category.id || p.categorySlug === category.slug)
  );

  useEffect(() => {
    productService.getCategories().then((cats) => {
      const found = cats.find((c) => c.slug === slug);
      if (found) setCategory(found);
    });
    productService.getProducts().then((allProds) => {
      setProducts(allProds.filter((p) => p.categoryId === category.id || p.categorySlug === slug || p.categorySlug === category.slug));
    });
  }, [slug, category.id, category.slug]);

  const seoData = {
    title: `${category.name} | Teknik Özellikler ve Ebatlama`,
    description: `${category.name} çözümleri. ${category.shortDesc} Milimetrik özel ebat kesim, sertifikalı üretim ve anında teklif.`,
    canonical: `https://mimaricam.com/kategori/${category.slug}`,
    h1: `${category.name} - MimariCam`,
    ogImage: resolveImageUrl(category.imageUrl),
  };

  return (
    <>
      <SeoHead seo={seoData} />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Category Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-gray-50 via-white to-amber-50/20 border border-gray-200 p-8 sm:p-14 shadow-xs">
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <StorageImage
                imageName={category.imageUrl}
                alt={category.name}
                width={1200}
                height={400}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#C58B38] text-xs font-semibold">
                <Shield className="w-3.5 h-3.5" />
                <span>{category.fireClassRange || 'Mimari Standart'}</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black text-gray-900 tracking-tight">
                {category.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {category.description}
              </p>

              <div className="pt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => navigate('/camini-tasarla')}
                  className="px-6 py-3 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Bu Kategoride Camını Tasarla</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/teklif-al')}
                  className="px-6 py-3 rounded-xl bg-white hover:bg-gray-50 text-gray-800 font-semibold text-xs border border-gray-200 shadow-xs transition-all"
                >
                  Toplu Teklif İste
                </button>
              </div>
            </div>
          </div>

          {/* Products in this category */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                {category.name} Ürünleri
              </h2>
              <span className="text-xs text-gray-500 font-mono">
                {products.length} Ürün Listelendi
              </span>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => navigate(`/urun/${p.slug}`)}
                    className="bg-white border border-gray-200 hover:border-[#C58B38] shadow-xs hover:shadow-md rounded-2xl overflow-hidden cursor-pointer group flex flex-col justify-between transition-all duration-200 hover:-translate-y-1"
                  >
                    <div className="h-48 relative overflow-hidden bg-gray-100">
                      <StorageImage
                        key={`${p.id}-${p.imageUrl}`}
                        imageName={p.imageUrl}
                        alt={p.name}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                      {p.fireRating !== 'NONE' && (
                        <span className="absolute top-3 right-3 text-xs font-mono font-bold bg-[#C58B38] text-white px-2.5 py-0.5 rounded-md shadow-sm">
                          {p.fireRating}
                        </span>
                      )}
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="text-[11px] text-gray-400 font-mono mb-1">{p.code}</div>
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-[#C58B38] transition-colors">
                          {p.name}
                        </h3>
                        <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                          {p.summary}
                        </p>
                      </div>

                      <div className="space-y-3 pt-3 border-t border-gray-100">
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Kalınlık:</span>
                          <span className="font-mono text-gray-800 font-medium">{p.thicknessMm}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-[#C58B38] font-semibold pt-1">
                          <span>Detayları İncele</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center space-y-4">
                <p className="text-gray-600 text-sm">
                  Bu kategoride projenize özel ölçü ve formda CNC imalat yapılmaktadır.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/camini-tasarla')}
                  className="px-6 py-3 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs uppercase shadow-xs transition-colors"
                >
                  Camını Tasarla & Teklif İste
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
