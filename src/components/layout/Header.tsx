import React, { useState } from 'react';
import { useRouter } from '../../router/Router';
import { CATEGORIES } from '../../data/catalog';
import { CATEGORY_SEO_LIST } from '../../data/categorySeoPages';
import { StorageImage } from '../common/StorageImage';
import {
  Menu,
  X,
  Flame,
  ChevronRight,
  Calculator,
  Compass,
  FileText,
  Phone,
  Layers,
  Sparkles,
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentPath, navigate } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-20 sm:h-22 flex items-center justify-between">
          {/* Left: Hamburger Menu Button + MimariCam Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-1 sm:-ml-2 rounded-xl text-gray-700 hover:text-black hover:bg-gray-100 transition-colors focus:outline-none shrink-0"
              aria-label="Menüyü Aç/Kapat"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
            </button>

            {/* MimariCam Logo */}
            <div
              onClick={() => handleNav('/')}
              className="cursor-pointer flex items-center transition-opacity hover:opacity-90 select-none min-w-0"
            >
              <StorageImage
                imageName="00-mimaricam-logo.png"
                alt="MimariCam - Şömine ve Yangın Camı Çözümleri"
                width={300}
                height={70}
                className="w-[205px] sm:w-[240px] md:w-[275px] lg:w-[300px] max-w-[calc(100vw-145px)] sm:max-w-none max-h-16 sm:max-h-18 h-auto object-contain"
              />
            </div>
          </div>

          {/* Center: Desktop Navigation Quick Links (Visible on Tablet & Desktop) */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-3">
            <button
              type="button"
              onClick={() => handleNav('/camini-tasarla')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentPath === '/camini-tasarla'
                  ? 'bg-[#C58A2B] text-white shadow-xs'
                  : 'bg-amber-50 hover:bg-amber-100/70 border border-amber-200/80 text-[#8B5E19]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Şömine Camı & Kapak</span>
              <span className="text-[10px] bg-[#C58A2B] text-white px-1.5 py-0.5 rounded font-mono font-bold">
                YENİ
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('/yangin-camlari')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentPath === '/yangin-camlari'
                  ? 'text-[#C58B38] font-bold'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Yangın Camları
            </button>

            <button
              type="button"
              onClick={() => handleNav('/urunler')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentPath === '/urunler'
                  ? 'text-[#C58B38] font-bold'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Ürünler
            </button>

            <button
              type="button"
              onClick={() => handleNav('/projeler')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                currentPath === '/projeler'
                  ? 'text-[#C58B38] font-bold'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Projeler
            </button>
          </nav>

          {/* Right: Teklif Al Button */}
          <div className="flex items-center shrink-0 ml-2">
            <button
              type="button"
              onClick={() => handleNav('/teklif-al')}
              className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] active:scale-[0.98] text-white font-bold text-xs sm:text-sm tracking-wide shadow-xs transition-all whitespace-nowrap cursor-pointer"
            >
              Teklif Al
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Drawer Menu (Açılır Hamburger Menü Paneli) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Arka Plan Karartması */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menü Çekmecesi */}
          <div className="relative w-84 max-w-[85vw] bg-white h-full shadow-2xl z-50 flex flex-col justify-between overflow-y-auto">
            <div className="p-5 sm:p-6 space-y-5">
              {/* Header inside drawer */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => handleNav('/')}
                >
                  <StorageImage
                    imageName="00-mimaricam-logo.png"
                    alt="MimariCam - Şömine ve Yangın Camı Çözümleri"
                    width={150}
                    height={35}
                    className="h-8 max-w-[150px] w-auto object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 1. 🔥 ŞÖMİNE CAMI & KAPAK HESAPLAMA (EN ÜSTTE ÖNE ÇIKAN HESAPLAMA BAĞLANTISI) */}
              <button
                type="button"
                onClick={() => handleNav('/camini-tasarla')}
                className="w-full text-left px-3.5 py-3 rounded-2xl bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-300/80 text-amber-950 flex items-center justify-between shadow-2xs hover:from-amber-100 hover:to-amber-200/50 transition-all cursor-pointer"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#C58A2B] fill-[#C58A2B]" />
                    <span className="font-bold text-xs text-[#7A4F13]">
                      Şömine Camı & Kapak Hesaplama
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-[#C58A2B] text-white font-mono text-[9px] font-bold">
                      YENİ
                    </span>
                  </div>
                  <p className="text-[10px] text-amber-800/80 pl-6">
                    Canlı Simülatör, Milimetrik Ölçü & WhatsApp Siparişi
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-700 shrink-0" />
              </button>

              {/* 2. KATEGORİLER (13 Kategori Listesi - Hesaplama Kartının Hemen Altında) */}
              <div className="pt-2 border-t border-gray-100 space-y-2">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#C58A2B]" />
                    <span>Kategoriler</span>
                  </span>
                  <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-bold">
                    13 Kategori
                  </span>
                </div>
                <div className="space-y-0.5">
                  {CATEGORY_SEO_LIST.map((cat, idx) => (
                    <a
                      key={cat.slug}
                      href={cat.path}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav(cat.path);
                      }}
                      className={`w-full text-left px-2 sm:px-2.5 py-2 text-xs rounded-xl transition-all flex items-center justify-between gap-1.5 group ${
                        currentPath === cat.path
                          ? 'bg-amber-50 text-[#C58A2B] font-bold border border-amber-200/60'
                          : 'text-gray-700 hover:text-black hover:bg-gray-100'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span className="text-[10px] text-gray-400 font-mono w-4 shrink-0">
                          {idx + 1}.
                        </span>
                        <span className="truncate">{cat.name}</span>
                      </span>

                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleNav(cat.path);
                            setTimeout(() => {
                              const el = document.getElementById('fiyat-hesapla');
                              if (el) el.scrollIntoView({ behavior: 'smooth' });
                            }, 100);
                          }}
                          className="text-[9px] font-extrabold uppercase tracking-tight px-1.5 py-0.5 rounded bg-gradient-to-r from-[#B97F24] via-[#C58A2B] to-[#D89B3D] hover:brightness-110 active:scale-95 text-white shadow-2xs transition-all whitespace-nowrap cursor-pointer select-none"
                          title={`${cat.name} Anında Fiyat Al`}
                        >
                          ANINDA FİYAT AL
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#C58A2B] group-hover:translate-x-0.5 transition-all shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* 3. DİĞER SAYFALAR & KURUMSAL BAĞLANTILAR */}
              <div className="pt-4 border-t border-gray-100 space-y-1">
                {/* Ana Sayfa */}
                <button
                  type="button"
                  onClick={() => handleNav('/')}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Ana Sayfa</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* Tüm Ürün Kataloğu */}
                <button
                  type="button"
                  onClick={() => handleNav('/urunler')}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Tüm Ürün Kataloğu (11 Kategori)</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* Referans Projeler */}
                <button
                  type="button"
                  onClick={() => handleNav('/projeler')}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span>Referans Projeler</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* Teknik Bilgi Merkezi */}
                <button
                  type="button"
                  onClick={() => handleNav('/teknik-bilgi')}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-gray-500" />
                    <span>Teknik Bilgi Merkezi & Belgeler</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>

                {/* İletişim */}
                <button
                  type="button"
                  onClick={() => handleNav('/iletisim')}
                  className="w-full text-left px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                    <span>İletişim & Fabrika Adresi</span>
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Çekmece Alt Bölümü: Hızlı Teklif Al Butonu */}
            <div className="p-5 bg-gray-50 border-t border-gray-100 space-y-2">
              <button
                type="button"
                onClick={() => handleNav('/teklif-al')}
                className="w-full py-3 bg-gradient-to-r from-[#B97F24] via-[#C58A2B] to-[#D89B3D] hover:from-[#A8721E] hover:to-[#C58A2B] text-white font-bold text-xs rounded-xl shadow-xs text-center transition-all cursor-pointer"
              >
                Hemen Fiyat & Teklif Al
              </button>
              <div className="text-center text-[10px] text-gray-400">
                MimariCam Endüstriyel ve Mimari Cam Sistemleri
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
