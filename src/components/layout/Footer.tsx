import React from 'react';
import { useRouter } from '../../router/Router';
import { CATEGORIES } from '../../data/catalog';
import { StorageImage } from '../common/StorageImage';
import { Shield, Phone, Mail, MapPin, CheckCircle, Clock } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigate } = useRouter();

  const handleNav = (path: string) => {
    navigate(path);
  };

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 text-sm">
      {/* Upper Pre-footer banner */}
      <div className="border-b border-gray-200 bg-gray-50/80 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-xs">
              <Shield className="w-6 h-6 text-[#C58B38]" />
            </div>
            <div>
              <div className="text-gray-900 font-bold text-base">
                Yangın Yönetmeliğine & EN 1364 Normlarına Tam Uyum
              </div>
              <div className="text-xs text-gray-500">
                Akredite test laboratuvar onaylı EI30 - EI120 yangın camları ve SCHOTT yetkili işleme merkezi.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleNav('/camini-tasarla')}
              className="px-5 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#8B5E19] font-bold text-xs border border-amber-200/80 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>🔥 Şömine Camı & Kapak Hesapla</span>
            </button>
            <button
              type="button"
              onClick={() => handleNav('/teklif-al')}
              className="px-5 py-2.5 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              Kurumsal Teklif Al
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-8">
        {/* Col 1: Brand Info */}
        <div className="sm:col-span-2 lg:col-span-2 space-y-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav('/')}>
            <StorageImage
              imageName="00-mimaricam-logo.png"
              alt="MimariCam - Şömine ve Yangın Camı Çözümleri"
              width={160}
              height={36}
              className="h-9 w-auto object-contain"
            />
          </div>

          <p className="text-xs text-gray-600 leading-relaxed pr-4">
            Türkiye merkezli, yüksek kaliteli ve kurumsal mimari cam çözüm platformu. Yangına dayanıklı camlar (E, EW, EI sınıfları), SCHOTT ROBAX® şömine camları, strüktürel cephe camları ve özel ölçü CNC işleme çözümleri.
          </p>

          <div className="space-y-1.5 text-xs text-gray-600">
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C58B38] shrink-0 mt-0.5" />
              <span>KETHÜDA MAH. TRANSİT CAD. YENİ SANAYİ SİTESİ NO: 173/13B 25300 Pasinler, Erzurum / Türkiye</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#C58B38] shrink-0" />
              <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                <a href="tel:+905421452525" className="hover:text-[#C58B38] transition-colors font-medium">
                  +90 542 145 25 25
                </a>
                <span className="text-gray-300">|</span>
                <a href="tel:+904426060775" className="hover:text-[#C58B38] transition-colors">
                  0442 606 07 75 (Sabit)
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#C58B38] shrink-0" />
              <a href="mailto:info@mimaricam.com" className="hover:text-[#C58B38] transition-colors">
                info@mimaricam.com
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C58B38] shrink-0" />
              <span>Pazartesi - Cumartesi: 08:30 - 18:00</span>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-gray-500">
            Resmi Domainler: <span className="text-gray-700 font-mono">mimaricam.com</span> /{' '}
            <span className="text-gray-700 font-mono">mimaricam.com.tr</span>
          </div>
        </div>

        {/* Col 2: Kurumsal & Yasal */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-3 bg-[#C58B38] rounded-full inline-block"></span>
            <span>Kurumsal & Yasal</span>
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                type="button"
                onClick={() => handleNav('/hakkimizda')}
                className="hover:text-[#C58B38] transition-colors text-left text-gray-600 font-medium"
              >
                Hakkımızda
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('/mesafeli-satis-sozlesmesi')}
                className="hover:text-[#C58B38] transition-colors text-left text-gray-600"
              >
                Mesafeli Satış Sözleşmesi
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('/gizlilik-ve-guvenlik')}
                className="hover:text-[#C58B38] transition-colors text-left text-gray-600"
              >
                Gizlilik ve Güvenlik
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('/iptal-ve-iade-kosullari')}
                className="hover:text-[#C58B38] transition-colors text-left text-gray-600"
              >
                İptal ve İade Koşulları
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('/kisisel-veriler-politikasi')}
                className="hover:text-[#C58B38] transition-colors text-left text-gray-600"
              >
                Kişisel Veriler (KVKK)
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('/cerez-politikasi')}
                className="hover:text-[#C58B38] transition-colors text-left text-gray-600"
              >
                Çerez Politikası
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Ürün Kategorileri */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Cam Çözümleri
          </div>
          <ul className="space-y-2 text-xs">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => handleNav(`/kategori/${cat.slug}`)}
                  className="hover:text-[#C58B38] transition-colors text-left text-gray-600"
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Yangın Camı & Teknik */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Yangın Dayanım Sınıfları
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                type="button"
                onClick={() => handleNav('/yangin-cami/ei30')}
                className="hover:text-[#C58B38] transition-colors flex items-center justify-between w-full text-gray-600"
              >
                <span>EI30 Yangın Camı</span>
                <span className="text-[10px] text-gray-400 font-mono">30 dk</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('/yangin-cami/ei60')}
                className="hover:text-[#C58B38] transition-colors flex items-center justify-between w-full text-gray-600"
              >
                <span>EI60 Yangın Camı</span>
                <span className="text-[10px] text-[#C58B38] font-mono font-medium">60 dk</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('/yangin-cami/ei90')}
                className="hover:text-[#C58B38] transition-colors flex items-center justify-between w-full text-gray-600"
              >
                <span>EI90 Yangın Camı</span>
                <span className="text-[10px] text-gray-400 font-mono">90 dk</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('/yangin-cami/ei120')}
                className="hover:text-[#C58B38] transition-colors flex items-center justify-between w-full text-gray-600"
              >
                <span>EI120 Fortress Camı</span>
                <span className="text-[10px] text-gray-400 font-mono">120 dk</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('/teknik-bilgi')}
                className="hover:text-[#b0792b] transition-colors pt-2 block text-[#C58B38] font-semibold"
              >
                E vs EW vs EI Kılavuzu →
              </button>
            </li>
          </ul>
        </div>

        {/* Col 5: GEO Şehir Çözümleri */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-gray-900 uppercase tracking-wider">
            Bölgesel Sevkiyat & GEO
          </div>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                type="button"
                onClick={() => handleNav('/sehir/istanbul')}
                className="hover:text-[#C58B38] transition-colors text-gray-600"
              >
                İstanbul Yangın Camı
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('/sehir/ankara')}
                className="hover:text-[#C58B38] transition-colors text-gray-600"
              >
                Ankara Kamu ve Şantiye
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('/sehir/izmir')}
                className="hover:text-[#C58B38] transition-colors text-gray-600"
              >
                İzmir & Ege Şömine Camları
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleNav('/projeler')}
                className="hover:text-[#C58B38] transition-colors text-gray-600"
              >
                Tamamlanan Referanslar
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Sub-footer */}
      <div className="border-t border-gray-200 py-6 px-4 sm:px-8 bg-gray-50/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>© {new Date().getFullYear()} MimariCam (mimaricam.com). Tüm hakları saklıdır.</span>
            <div className="hidden sm:inline text-gray-300">|</div>
            <div className="flex flex-wrap items-center justify-center gap-3 text-[11px]">
              <button
                type="button"
                onClick={() => handleNav('/hakkimizda')}
                className="hover:text-[#C58B38] transition-colors"
              >
                Hakkımızda
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleNav('/mesafeli-satis-sozlesmesi')}
                className="hover:text-[#C58B38] transition-colors"
              >
                Mesafeli Satış
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleNav('/gizlilik-ve-guvenlik')}
                className="hover:text-[#C58B38] transition-colors"
              >
                Gizlilik
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleNav('/iptal-ve-iade-kosullari')}
                className="hover:text-[#C58B38] transition-colors"
              >
                İade Şartları
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleNav('/kisisel-veriler-politikasi')}
                className="hover:text-[#C58B38] transition-colors"
              >
                KVKK
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={() => handleNav('/cerez-politikasi')}
                className="hover:text-[#C58B38] transition-colors"
              >
                Çerezler
              </button>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>CE & TSE Onaylı İmalat</span>
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#C58B38]" />
              <span>SCHOTT ROBAX® Orijinal Seri No</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
