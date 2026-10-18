import React, { Suspense, lazy } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

const HomeView = lazy(() => import('./views/HomeView').then(m => ({ default: m.HomeView })));
const MarketplaceView = lazy(() => import('./views/MarketplaceView').then(m => ({ default: m.MarketplaceView })));
const ProductDetailView = lazy(() => import('./views/ProductDetailView').then(m => ({ default: m.ProductDetailView })));
const HomestayView = lazy(() => import('./views/HomestayView').then(m => ({ default: m.HomestayView })));
const TourPackagesView = lazy(() => import('./views/TourPackagesView').then(m => ({ default: m.TourPackagesView })));
const VillageDetailView = lazy(() => import('./views/VillageDetailView').then(m => ({ default: m.VillageDetailView })));
const CartView = lazy(() => import('./views/CartView').then(m => ({ default: m.CartView })));
const AuthView = lazy(() => import('./views/AuthView').then(m => ({ default: m.AuthView })));
const SellerDashboardView = lazy(() => import('./views/SellerDashboardView').then(m => ({ default: m.SellerDashboardView })));

const ViewLoadingFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3" role="status" aria-label="Memuat halaman...">
    <div className="w-9 h-9 border-3 border-emerald-800 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-semibold text-stone-600 tracking-wide">Memuat Saba Lembang...</span>
  </div>
);

const MainContent: React.FC = () => {
  const { page } = useApp();

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <Suspense fallback={<ViewLoadingFallback />}>
          {page === 'home' && <HomeView />}
          {page === 'marketplace' && <MarketplaceView />}
          {page === 'product-detail' && <ProductDetailView />}
          {page === 'homestay' && <HomestayView />}
          {page === 'paket-wisata' && <TourPackagesView />}
          {page === 'desa-detail' && <VillageDetailView />}
          {page === 'cart' && <CartView />}
          {page === 'auth' && <AuthView />}
          {page === 'dashboard' && <SellerDashboardView />}
        </Suspense>
      </div>
      <Footer />
      <Toast />
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
