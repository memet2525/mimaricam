import React, { useEffect, useState } from 'react';
import { useRouter } from '../router/Router';
import { legalPageService } from '../services/legalPageService';
import { LegalPage, LegalPageSlug } from '../types';
import { LEGAL_PAGES_CONFIG } from '../data/legalPagesData';
import { SeoHead } from '../components/seo/SeoHead';
import {
  Flame,
  ArrowLeft,
  Building2,
  FileText,
  ShieldCheck,
  RefreshCw,
  FileCheck,
  Cookie,
  Calendar,
  Shield,
  Phone,
  MessageCircle,
  Printer,
  Share2,
  Check,
  ChevronRight,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Building2,
  FileText,
  ShieldCheck,
  RefreshCw,
  FileCheck,
  Cookie,
};

interface LegalPageDetailProps {
  initialSlug?: string;
}

export const LegalPageDetail: React.FC<LegalPageDetailProps> = ({ initialSlug }) => {
  const { currentPath, navigate, params } = useRouter();

  // Slug extraction: either from prop, route params, or currentPath segments
  const activeSlug =
    initialSlug ||
    params.legalSlug ||
    currentPath.replace(/^\//, '').split('/')[0] ||
    'hakkimizda';

  const [page, setPage] = useState<LegalPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    legalPageService
      .getLegalPage(activeSlug)
      .then((data) => {
        if (isMounted) {
          setPage(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error('Error fetching legal page:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activeSlug]);

  const handleShare = () => {
    const url = `https://mimaricam.com/${activeSlug}`;
    if (navigator.share) {
      navigator.share({
        title: `${page?.title || 'Yasal Bilgilendirme'} | MimariCam`,
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Basic formatted rendering of markdown content
  const renderFormattedContent = (rawText: string) => {
    const lines = rawText.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();

      if (!trimmed) {
        return <div key={idx} className="h-3" />;
      }

      // H2 Header
      if (trimmed.startsWith('## ')) {
        return (
          <h2
            key={idx}
            className="text-xl sm:text-2xl font-bold text-gray-900 mt-8 mb-4 border-b border-gray-100 pb-2 flex items-center gap-2"
          >
            <span className="w-1.5 h-6 bg-[#C58B38] rounded-full inline-block"></span>
            {trimmed.replace('## ', '')}
          </h2>
        );
      }

      // H3 Header
      if (trimmed.startsWith('### ')) {
        return (
          <h3
            key={idx}
            className="text-base sm:text-lg font-bold text-gray-900 mt-6 mb-2 text-[#8B5E19]"
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
      }

      // H4 Header
      if (trimmed.startsWith('#### ')) {
        return (
          <h4
            key={idx}
            className="text-sm sm:text-base font-bold text-gray-800 mt-4 mb-1"
          >
            {trimmed.replace('#### ', '')}
          </h4>
        );
      }

      // Horizontal Divider
      if (trimmed === '---') {
        return <hr key={idx} className="my-6 border-gray-200" />;
      }

      // Bullet List Item
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const itemContent = trimmed.replace(/^(\*|-)\s+/, '');
        return (
          <li key={idx} className="ml-5 list-disc text-gray-700 text-sm leading-relaxed mb-1.5">
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemContent) }} />
          </li>
        );
      }

      // Numbered List Item
      if (/^\d+\.\s+/.test(trimmed)) {
        const itemContent = trimmed.replace(/^\d+\.\s+/, '');
        return (
          <li key={idx} className="ml-5 list-decimal text-gray-700 text-sm leading-relaxed mb-1.5">
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemContent) }} />
          </li>
        );
      }

      // Standard Paragraph
      return (
        <p
          key={idx}
          className="text-gray-700 text-sm sm:text-[15px] leading-relaxed mb-3"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
        />
      );
    });
  };

  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>');
  };

  const currentConfig = LEGAL_PAGES_CONFIG.find((p) => p.slug === activeSlug);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 select-text">
      <SeoHead
        seo={{
          title: page?.title || 'Yasal Bilgilendirme',
          description: page?.summary || 'MimariCam kurumsal ve yasal bilgilendirme metinleri.',
          canonical: `https://mimaricam.com/${activeSlug}`,
          h1: page?.title || 'Yasal Bilgilendirme',
        }}
      />

      {/* Top Banner with Back to Configurator CTA */}
      <div className="bg-stone-900 text-white border-b border-stone-800 py-3.5 px-4 sm:px-8 sticky top-0 z-30 shadow-md backdrop-blur-md bg-stone-900/95">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <Shield className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Resmi Yasal ve Kurumsal Dokümantasyon</span>
            <span className="text-stone-500">•</span>
            <span className="text-stone-400 font-mono text-[11px]">mimaricam.com</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/camini-tasarla')}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 group"
          >
            <Flame className="w-4 h-4 text-stone-950 group-hover:scale-110 transition-transform" />
            <span>← Şömine Camı & Kapak Konfigüratörüne Dön</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="hover:text-[#C58B38] transition-colors"
          >
            Ana Sayfa
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-gray-900 font-medium">{page?.title || 'Yasal Sayfalar'}</span>
        </div>

        {/* Main Grid: Sidebar navigation + Content card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Sidebar: Quick switch between 6 pages */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200/80 p-4 sm:p-5 shadow-xs">
              <div className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#C58B38]" />
                <span>Kurumsal & Yasal Sayfalar</span>
              </div>

              <div className="space-y-1.5">
                {LEGAL_PAGES_CONFIG.map((item) => {
                  const Icon = ICON_MAP[item.iconName] || FileText;
                  const isActive = activeSlug === item.slug;

                  return (
                    <button
                      key={item.slug}
                      type="button"
                      onClick={() => navigate(`/${item.slug}`)}
                      className={`w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        isActive
                          ? 'bg-[#C58B38] text-white shadow-xs font-bold'
                          : 'bg-gray-50/60 hover:bg-gray-100 text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-[#C58B38]'}`} />
                        <span className="truncate">{item.title}</span>
                      </div>
                      <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 pt-5 border-t border-gray-100 space-y-3 text-xs text-gray-600">
                <div className="font-bold text-gray-900 text-xs">Müşteri Destek & İletişim</div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#C58B38] shrink-0" />
                  <a href="tel:+905421452525" className="hover:text-[#C58B38] font-medium font-mono">
                    +90 542 145 25 25
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <a
                    href="https://wa.me/905421452525"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    WhatsApp Canlı Destek
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Banner */}
            <div className="bg-gradient-to-br from-amber-50 to-stone-100 rounded-2xl border border-amber-200/70 p-5 shadow-xs">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
                <Flame className="w-4 h-4 text-[#C58B38]" />
                <span>Özel Ölçü Cam İhtiyacınız mı Var?</span>
              </div>
              <p className="text-[11px] text-amber-950/80 leading-relaxed mb-4">
                Milimetrik ölçülerinizi girip anında net fabrika imalat fiyatını görebilir ve siparişinizi oluşturabilirsiniz.
              </p>
              <button
                type="button"
                onClick={() => navigate('/camini-tasarla')}
                className="w-full py-2.5 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs shadow-xs transition-colors"
              >
                Hemen Ölçü Gir & Hesapla →
              </button>
            </div>
          </div>

          {/* Right Main Content */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-gray-200/90 shadow-xl overflow-hidden p-6 sm:p-10">
              {/* Header Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200">
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-[#8B5E19] text-[11px] font-bold mb-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#C58B38]" />
                    <span>MimariCam Kurumsal Hükümler</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                    {page?.title || currentConfig?.title || 'Yasal Bilgilendirme'}
                  </h1>
                  {page?.summary && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-1.5 font-medium">
                      {page.summary}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors shadow-xs"
                    title="Paylaş veya Bağlantıyı Kopyala"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={handlePrint}
                    className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 transition-colors shadow-xs"
                    title="Yazdır"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Meta bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs text-gray-500 border-b border-gray-100 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>
                    Son Güncelleme:{' '}
                    <strong className="text-gray-700 font-medium">
                      {page?.updatedAt
                        ? new Date(page.updatedAt).toLocaleDateString('tr-TR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })
                        : '2026'}
                    </strong>
                  </span>
                </div>

                <div className="text-[11px] text-gray-400 font-mono">
                  Belge No: MC-LEG-{activeSlug.toUpperCase().substring(0, 8)}
                </div>
              </div>

              {/* Main Content Body */}
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 rounded-full border-2 border-[#C58B38] border-t-transparent animate-spin" />
                  <span className="text-xs text-gray-500">İçerik yükleniyor...</span>
                </div>
              ) : (
                <div className="prose max-w-none text-gray-700">
                  {renderFormattedContent(page?.content || '')}
                </div>
              )}

              {/* Bottom Back Button */}
              <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/camini-tasarla')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Camını Tasarla Konfigüratörüne Dön</span>
                </button>

                <div className="text-xs text-gray-400 text-center sm:text-right">
                  Gala Makina & MimariCam İmalat Sanayi
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
