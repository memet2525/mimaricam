import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from '../router/Router';
import { PRODUCTS, CATEGORIES } from '../data/catalog';
import { productService } from '../services/productService';
import { Product } from '../types';
import { SeoHead } from '../components/seo/SeoHead';
import { StorageImage } from '../components/common/StorageImage';
import { Search, ArrowRight, Sparkles } from 'lucide-react';

export const ProductsCatalogPage: React.FC = () => {
  const { navigate } = useRouter();

  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFireRating, setSelectedFireRating] = useState<string>('all');

  useEffect(() => {
    productService.getProducts().then(setProductsList);
  }, []);

  const filteredProducts = useMemo(() => {
    return productsList.filter((p) => {
      const matchSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' || p.categoryId === selectedCategory || p.categorySlug === selectedCategory;

      const matchFire =
        selectedFireRating === 'all' ||
        (selectedFireRating === 'fire_only' && p.fireRating !== 'NONE') ||
        p.fireRating === selectedFireRating;

      return matchSearch && matchCategory && matchFire;
    });
  }, [searchQuery, selectedCategory, selectedFireRating]);

  const seoData = {
    title: 'Tüm Cam Çözümleri Kataloğu | Yangın, ROBAX ve Mimari Camlar',
    description: 'MimariCam ürün kataloğu. EI30-EI120 yangın camları, SCHOTT ROBAX® şömine camları, akustik lamine ve temperli emniyet camları. Teknik özellikleri inceleyin, teklif alın.',
    canonical: 'https://mimaricam.com/urunler',
    h1: 'Mimari ve Yangına Dayanıklı Cam Kataloğu',
  };

  return (
    <>
      <SeoHead seo={seoData} />
      <div className="min-h-screen bg-white py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#C58B38]">
                Ürün Kataloğu
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
                Tüm Cam Çözümlerimiz
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                Projelerinize özel milimetrik ebatlama, yangın dayanım sınıfları ve teknik dokümantasyon.
              </p>
            </div>

            <button
              type="button"
              onClick={() => navigate('/camini-tasarla')}
              className="px-5 py-2.5 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 self-start md:self-auto shadow-xs transition-all"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Camını Tasarla</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-2xl space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Ürün adı, kod veya teknik özellik ara (örn: EI60, ROBAX, lamine)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#C58B38] shadow-xs"
                />
              </div>

              {/* Fire Rating Quick Filter */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                {[
                  { id: 'all', label: 'Tüm Sınıflar' },
                  { id: 'fire_only', label: 'Yangın Camları' },
                  { id: 'EI30', label: 'EI30' },
                  { id: 'EI60', label: 'EI60' },
                  { id: 'EI90', label: 'EI90' },
                  { id: 'EI120', label: 'EI120' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedFireRating(item.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                      selectedFireRating === item.id
                        ? 'bg-[#C58B38] text-white shadow-xs'
                        : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category horizontal pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-[#C58B38] text-white font-bold shadow-xs'
                    : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200'
                }`}
              >
                Tüm Kategoriler
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-[#C58B38] text-white font-bold shadow-xs'
                      : 'bg-white text-gray-700 hover:text-gray-900 border border-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((p) => (
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
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  {p.fireRating !== 'NONE' ? (
                    <span className="absolute top-3 right-3 text-xs font-mono font-bold bg-[#C58B38] text-white px-2.5 py-0.5 rounded-md shadow-sm">
                      {p.fireRating}
                    </span>
                  ) : (
                    <span className="absolute top-3 right-3 text-[10px] font-mono bg-white/90 text-gray-800 px-2.5 py-0.5 rounded-md border border-gray-200 shadow-xs">
                      {p.categoryName}
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

          {filteredProducts.length === 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-12 text-center text-gray-600 text-sm">
              Arama kriterlerine uygun ürün bulunamadı. Özel ölçü için bizimle iletişime geçebilirsiniz.
            </div>
          )}
        </div>
      </div>
    </>
  );
};
