import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { AdminPage } from './AdminPage';
import { SeoHead } from '../components/seo/SeoHead';
import { Lock, Key, Eye, EyeOff, AlertCircle, ShieldCheck, Loader2 } from 'lucide-react';

const ADMIN_EMAIL = 'atlaspelet.com@gmail.com';

export const BossPage: React.FC = () => {
  const { user, isAdmin, loading, loginWithEmail, logout } = useAuth();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const seoData = {
    title: 'Yönetici Paneli | MimariCam',
    description: 'Yönetim ve İmalat Paneli',
    canonical: 'https://mimaricam.com/boss',
    h1: 'Yönetici Girişi',
    noindex: true,
  };

  // If session is being checked
  if (loading) {
    return (
      <>
        <SeoHead seo={seoData} />
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-[#C58B38] animate-spin" />
            <p className="text-xs text-gray-400 font-medium tracking-wide">
              Oturum kontrol ediliyor...
            </p>
          </div>
        </div>
      </>
    );
  }

  // If user is already authenticated and is the verified admin
  if (user && isAdmin) {
    return (
      <>
        <SeoHead seo={seoData} />
        <AdminPage />
      </>
    );
  }

  // Handle Login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!password.trim()) {
      setErrorMessage('Lütfen şifrenizi giriniz.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedUser = await loginWithEmail(ADMIN_EMAIL, password.trim());
      if (loggedUser.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await logout();
        setErrorMessage('Yetkisiz erişim.');
      }
    } catch (err: any) {
      console.error('Boss login error:', err);
      const code = err?.code || '';
      const msg = (err?.message || '').toLowerCase();

      if (
        code === 'auth/wrong-password' ||
        code === 'auth/invalid-credential' ||
        msg.includes('invalid_login_credentials') ||
        msg.includes('invalid-credential')
      ) {
        setErrorMessage('Hatalı şifre. Lütfen tekrar deneyiniz.');
      } else if (code === 'auth/too-many-requests' || msg.includes('too-many-requests')) {
        setErrorMessage('Çok sayıda başarısız deneme yapıldı. Lütfen biraz bekleyiniz.');
      } else if (code === 'auth/network-request-failed' || msg.includes('network')) {
        setErrorMessage('Bağlantı hatası oluştu. Lütfen internet bağlantınızı kontrol ediniz.');
      } else {
        setErrorMessage('Giriş başarısız. Lütfen şifrenizi kontrol ediniz.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SeoHead seo={seoData} />
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4 sm:p-6 py-12 select-none">
      <div className="w-full max-w-sm">
        {/* Discreet Login Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
          {/* Header */}
          <div className="pt-8 pb-6 px-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-[#C58B38] mx-auto mb-4 shadow-inner">
              <Lock className="w-7 h-7 text-[#C58B38]" />
            </div>
            <h1 className="text-base font-bold text-white tracking-wide">
              Yönetici Girişi
            </h1>
            <p className="text-[11px] text-gray-400 mt-1">
              Devam etmek için yönetici şifrenizi giriniz
            </p>
          </div>

          {/* Form */}
          <div className="px-6 pb-8 space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800/60 flex items-center gap-2.5 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1.5">
                  Şifre
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-950/80 border border-gray-700/80 rounded-xl text-xs text-white placeholder-gray-500 focus:bg-gray-950 focus:outline-none focus:border-[#C58B38] focus:ring-1 focus:ring-[#C58B38] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-xl bg-[#C58B38] hover:bg-[#b0792b] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Giriş Yapılıyor...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Giriş Yap</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-3 border-t border-gray-800/80 text-center">
              <a
                href="/"
                className="text-[11px] text-gray-400 hover:text-gray-200 transition-colors inline-block"
              >
                ← Ana Sayfa
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};
