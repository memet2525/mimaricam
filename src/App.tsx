import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { RouterProvider, useRouter } from './router/Router';
import { BaseLayout } from './components/layout/BaseLayout';

// Pages
import { HomePage } from './pages/HomePage';
import { ConfiguratorPage } from './pages/ConfiguratorPage';
import { FireGlassPage } from './pages/FireGlassPage';
import { ProductsCatalogPage } from './pages/ProductsCatalogPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { TechnicalCenterPage } from './pages/TechnicalCenterPage';
import { QuotePage } from './pages/QuotePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { GeoLandingPage } from './pages/GeoLandingPage';
import { BossPage } from './pages/BossPage';
import { OrdersAdminPage } from './pages/OrdersAdminPage';
import { LegalPageDetail } from './pages/LegalPageDetail';
import { CategorySeoPage } from './pages/CategorySeoPage';
import { NotFoundPage } from './pages/NotFoundPage';

const SEO_CATEGORY_MAP: Record<string, string> = {
  '/seramik-cam': 'seramik-cam',
  '/soba-cami': 'soba-cami',
  '/somine-cami': 'somine-cami',
  '/pelet-soba-cami': 'pelet-soba-cami',
  '/kuzine-soba-cami': 'kuzine-soba-cami',
  '/isiya-dayanikli-cam': 'isiya-dayanikli-cam',
  '/yangin-cami': 'yangin-cami',
  '/yangina-dayanikli-cam': 'yangina-dayanikli-cam',
  '/yangin-kapisi-cami': 'yangin-kapisi-cami',
  '/yangin-guvenlik-cami': 'yangin-guvenlik-cami',
  '/yangin-emniyet-cami': 'yangin-emniyet-cami',
  '/yangin-dayanimli-cam': 'yangin-dayanimli-cam',
  '/temperli-cam': 'temperli-cam',
};

const LEGAL_SLUGS = [
  '/hakkimizda',
  '/mesafeli-satis-sozlesmesi',
  '/gizlilik-ve-guvenlik',
  '/iptal-ve-iade-kosullari',
  '/kisisel-veriler-politikasi',
  '/cerez-politikasi',
];

const AppRoutes: React.FC = () => {
  const { currentPath, navigate, params } = useRouter();

  // Root Homepage -> Otomatik /camini-tasarla rotasına yönlendir veya ConfiguratorPage render et
  if (currentPath === '/' || currentPath === '') {
    return <ConfiguratorPage />;
  }

  // Camını Tasarla / Özel Ölçü
  if (currentPath === '/camini-tasarla' || currentPath === '/ozel-olcu-cam') {
    return <ConfiguratorPage />;
  }

  // Anasayfa özel rotası (Kurumsal ana sayfa görüntülenmek istendiğinde)
  if (currentPath === '/anasayfa' || currentPath === '/home') {
    return <HomePage />;
  }

  // 13 SEO / GEO Kategori Rotaları
  const pathWithoutHash = (currentPath.split('#')[0] || currentPath).split('?')[0];
  const normalizedPath = pathWithoutHash.replace(/\/+$/, '') || '/';
  if (SEO_CATEGORY_MAP[normalizedPath]) {
    return <CategorySeoPage slug={SEO_CATEGORY_MAP[normalizedPath]} />;
  }

  // Yangın Camları Hub
  if (currentPath === '/yangin-camlari') {
    return <FireGlassPage />;
  }

  // Yangın Camı Sınıfı or City alias (/yangin-cami/ei60 or /yangin-cami/istanbul)
  if (currentPath.startsWith('/yangin-cami/')) {
    if (params.city) {
      return <GeoLandingPage />;
    }
    return <FireGlassPage />;
  }

  // Mimari Cam SEO Alias
  if (currentPath === '/mimari-cam') {
    params.slug = 'mimari-camlar';
    return <CategoryPage />;
  }

  // Catalog
  if (currentPath === '/urunler') {
    return <ProductsCatalogPage />;
  }

  // Category dynamic
  if (currentPath.startsWith('/kategori/')) {
    return <CategoryPage />;
  }

  // Product detail
  if (currentPath.startsWith('/urun/')) {
    return <ProductDetailPage />;
  }

  // Technical Knowledge Center
  if (currentPath === '/teknik-bilgi') {
    return <TechnicalCenterPage />;
  }

  // Quote Form
  if (currentPath === '/teklif-al') {
    return <QuotePage />;
  }

  // Projects
  if (currentPath === '/projeler') {
    return <ProjectsPage />;
  }

  // GEO City Landing Pages
  if (currentPath.startsWith('/sehir/')) {
    return <GeoLandingPage />;
  }

  // Legal & Corporate Pages (6 Footer Sayfası + /yasal/:slug)
  if (LEGAL_SLUGS.includes(currentPath) || currentPath.startsWith('/yasal/')) {
    return <LegalPageDetail />;
  }

  // Sipariş Yönetim ve İmalat Paneli - /siparisler, /siparis, /orders
  if (
    currentPath === '/siparisler' ||
    currentPath === '/siparis' ||
    currentPath === '/orders'
  ) {
    return <OrdersAdminPage />;
  }

  // Admin Area - /boss, /admin, or direct tab /admin/legal-pages
  if (
    currentPath === '/boss' ||
    currentPath === '/admin' ||
    currentPath === '/admin/legal-pages' ||
    currentPath === '/boss/legal-pages'
  ) {
    return <BossPage />;
  }

  // Fallback for unknown URLs -> 404 Not Found Page
  return <NotFoundPage />;
};

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider>
        <BaseLayout>
          <AppRoutes />
        </BaseLayout>
      </RouterProvider>
    </AuthProvider>
  );
}
