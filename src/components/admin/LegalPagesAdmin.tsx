import React, { useState, useEffect, useRef } from 'react';
import { legalPageService } from '../../services/legalPageService';
import { LegalPage, LegalPageSlug } from '../../types';
import { LEGAL_PAGES_CONFIG, getSeedLegalPage } from '../../data/legalPagesData';
import { useRouter } from '../../router/Router';
import {
  FileText,
  Building2,
  ShieldCheck,
  RefreshCw,
  FileCheck,
  Cookie,
  Save,
  RotateCcw,
  ExternalLink,
  Eye,
  Edit3,
  CheckCircle2,
  AlertCircle,
  Heading,
  Bold,
  List,
  ListOrdered,
  Minus,
  Loader2,
  Calendar,
  Sparkles,
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Building2,
  FileText,
  ShieldCheck,
  RefreshCw,
  FileCheck,
  Cookie,
};

export const LegalPagesAdmin: React.FC = () => {
  const { navigate } = useRouter();

  const [pages, setPages] = useState<LegalPage[]>([]);
  const [selectedSlug, setSelectedSlug] = useState<LegalPageSlug>('hakkimizda');
  const [loading, setLoading] = useState(true);

  // Form states
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // View mode: 'edit' or 'preview'
  const [viewMode, setViewMode] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load all pages
  const loadAllPages = async () => {
    setLoading(true);
    try {
      const data = await legalPageService.getAllLegalPages();
      setPages(data);

      // Select active page
      const current = data.find((p) => p.slug === selectedSlug) || data[0];
      if (current) {
        setTitle(current.title);
        setSummary(current.summary || '');
        setContent(current.content);
      }
    } catch (err: any) {
      console.error('Error loading legal pages:', err);
      setErrorMsg('Sayfalar yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllPages();
  }, []);

  // When selected slug changes, populate form
  const handleSelectPage = (slug: LegalPageSlug) => {
    setSelectedSlug(slug);
    setSuccessMsg(null);
    setErrorMsg(null);

    const target = pages.find((p) => p.slug === slug);
    if (target) {
      setTitle(target.title);
      setSummary(target.summary || '');
      setContent(target.content);
    } else {
      const seed = getSeedLegalPage(slug);
      if (seed) {
        setTitle(seed.title);
        setSummary(seed.summary || '');
        setContent(seed.content);
      }
    }
  };

  // Save to Firestore
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const updated = await legalPageService.saveLegalPage(selectedSlug, {
        title,
        summary,
        content,
        updatedBy: 'Admin',
      });

      // Update local state
      setPages((prev) =>
        prev.map((p) => (p.slug === selectedSlug ? { ...p, ...updated, isCustom: true } : p))
      );

      setSuccessMsg('Sayfa içeriği Firestore veritabanına başarıyla kaydedildi ve anında yayına alındı.');
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err: any) {
      console.error('Save legal page error:', err);
      setErrorMsg(err?.message || 'Kaydedilirken bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset to seed content
  const handleResetToDefault = async () => {
    const seed = getSeedLegalPage(selectedSlug);
    if (!seed) return;

    if (!window.confirm(`"${seed.title}" sayfasının içeriğini orijinal fabrika taslak metnine sıfırlamak istediğinize emin misiniz?`)) {
      return;
    }

    setIsSaving(true);
    try {
      await legalPageService.resetToDefault(selectedSlug);
      setTitle(seed.title);
      setSummary(seed.summary || '');
      setContent(seed.content);

      setPages((prev) =>
        prev.map((p) => (p.slug === selectedSlug ? { ...seed, isCustom: false } : p))
      );

      setSuccessMsg('Sayfa içeriği varsayılan fabrika taslağına sıfırlandı.');
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Reset error:', err);
      setErrorMsg('Sıfırlama sırasında hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  // Markdown tool button helpers
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'metin';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const activePage = pages.find((p) => p.slug === selectedSlug);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-50 text-[#C58B38] border border-amber-200">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                Yasal & Kurumsal Sayfa Yönetimi
              </h2>
              <p className="text-xs text-gray-500">
                Footer'daki 6 kurumsal sayfanın metinlerini ve yasal şartlarını Firestore üzerinden canlı düzenleyin.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/${selectedSlug}`)}
          className="px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs"
        >
          <ExternalLink className="w-3.5 h-3.5 text-[#C58B38]" />
          <span>Canlı Sayfayı Gör (/{selectedSlug})</span>
        </button>
      </div>

      {/* Main Container: 6 Buttons Sidebar + Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: 6 Page Selector Tabs */}
        <div className="lg:col-span-4 space-y-2">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
            <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 px-1">
              Yasal Sayfa Seçimi (6 Sayfa)
            </div>

            <div className="space-y-1.5">
              {LEGAL_PAGES_CONFIG.map((cfg) => {
                const Icon = ICON_MAP[cfg.iconName] || FileText;
                const isSelected = selectedSlug === cfg.slug;
                const pageItem = pages.find((p) => p.slug === cfg.slug);
                const isCustom = pageItem?.isCustom ?? false;

                return (
                  <button
                    key={cfg.slug}
                    type="button"
                    onClick={() => handleSelectPage(cfg.slug)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition-all flex flex-col gap-1 border cursor-pointer ${
                      isSelected
                        ? 'bg-[#C58B38] text-white border-[#C58B38] shadow-sm'
                        : 'bg-gray-50/70 hover:bg-gray-100/90 text-gray-800 border-gray-200/80'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold truncate">
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-[#C58B38]'}`} />
                        <span className="truncate">{cfg.title}</span>
                      </div>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono uppercase shrink-0 font-medium ${
                          isSelected
                            ? 'bg-black/20 text-white'
                            : isCustom
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {isCustom ? 'Firestore' : 'Varsayılan'}
                      </span>
                    </div>

                    <div
                      className={`text-[11px] truncate ${
                        isSelected ? 'text-amber-100' : 'text-gray-500'
                      }`}
                    >
                      /{cfg.slug}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-gray-500 leading-relaxed">
              💡 <em>Not:</em> Düzenlenen sayfalar Firestore'da <code>legal_pages/{'{slug}'}</code> belgesine kaydedilir ve ziyaretçilere anlık olarak yansır.
            </div>
          </div>
        </div>

        {/* Right Column: Editor Form */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-gray-200 p-5 sm:p-7 shadow-xs">
          <form onSubmit={handleSave} className="space-y-5">
            {/* Feedback Banners */}
            {successMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">{successMsg}</span>
              </div>
            )}
            {errorMsg && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}

            {/* Title & Slug Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  Sayfa Başlığı
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#C58B38] font-semibold"
                  placeholder="Sayfa Başlığı"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-700 uppercase">
                  URL Yolu (Slug)
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-gray-100 border border-gray-200 text-xs text-gray-600 font-mono select-all">
                  /{selectedSlug}
                </div>
              </div>
            </div>

            {/* Short Summary */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-700 uppercase">
                Kısa Açıklama / Özet (Meta Description)
              </label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C58B38]"
                placeholder="Arama motorları ve sayfa başlığı altı için kısa özet"
              />
            </div>

            {/* Editor Toolbar & View Mode Toggle */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 p-2 sm:p-2.5 flex flex-wrap items-center justify-between gap-2">
                {/* Formatting Tools */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertMarkdown('## ', '\n')}
                    className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 text-xs flex items-center gap-1 font-bold"
                    title="Büyük Başlık (H2)"
                  >
                    <Heading className="w-3.5 h-3.5" />
                    <span>H2</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('### ', '\n')}
                    className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 text-xs flex items-center gap-1 font-bold"
                    title="Alt Başlık (H3)"
                  >
                    <Heading className="w-3 h-3" />
                    <span>H3</span>
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('**', '**')}
                    className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 text-xs"
                    title="Kalın Yazı"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('* ', '\n')}
                    className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 text-xs"
                    title="Madde Listesi"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('1. ', '\n')}
                    className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 text-xs"
                    title="Numaralı Liste"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdown('\n---\n')}
                    className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-700 text-xs"
                    title="Ayırıcı Çizgi"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* View Mode Toggle: Edit / Preview */}
                <div className="flex items-center gap-1 bg-gray-200/80 p-0.5 rounded-lg text-xs">
                  <button
                    type="button"
                    onClick={() => setViewMode('edit')}
                    className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors ${
                      viewMode === 'edit'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Düzenle</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 transition-colors ${
                      viewMode === 'preview'
                        ? 'bg-white text-gray-900 shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>Canlı Önizleme</span>
                  </button>
                </div>
              </div>

              {/* Editor or Preview Pane */}
              {viewMode === 'edit' ? (
                <textarea
                  ref={textareaRef}
                  required
                  rows={18}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-4 text-xs font-mono leading-relaxed text-gray-800 bg-white focus:outline-none resize-y min-h-[380px]"
                  placeholder="Sayfa içeriğini Markdown veya zengin metin formatında yazabilirsiniz..."
                />
              ) : (
                <div className="p-6 bg-white min-h-[380px] max-h-[500px] overflow-y-auto prose text-xs text-gray-700 leading-relaxed border-t border-gray-100">
                  <h1 className="text-xl font-bold text-gray-900 mb-4">{title}</h1>
                  {content.split('\n').map((line, i) => {
                    const tr = line.trim();
                    if (!tr) return <div key={i} className="h-2" />;
                    if (tr.startsWith('## ')) return <h2 key={i} className="text-base font-bold text-gray-900 mt-4 mb-2">{tr.replace('## ', '')}</h2>;
                    if (tr.startsWith('### ')) return <h3 key={i} className="text-sm font-bold text-[#8B5E19] mt-3 mb-1">{tr.replace('### ', '')}</h3>;
                    if (tr === '---') return <hr key={i} className="my-3 border-gray-200" />;
                    if (tr.startsWith('* ')) return <li key={i} className="ml-4 list-disc">{tr.replace('* ', '')}</li>;
                    return <p key={i} className="mb-2">{tr}</p>;
                  })}
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-3.5 h-3.5 text-gray-400" />
                <span>
                  Son Güncelleme:{' '}
                  {activePage?.updatedAt
                    ? new Date(activePage.updatedAt).toLocaleString('tr-TR')
                    : 'Henüz kaydedilmedi (Varsayılan şablon)'}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  disabled={isSaving}
                  className="px-3.5 py-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  title="İlk kurulumdaki fabrika taslağına dön"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                  <span>Varsayılana Sıfırla</span>
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Değişiklikleri Kaydet</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
