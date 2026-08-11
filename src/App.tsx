import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

import { HomeView } from './views/HomeView';
import { MarketplaceView } from './views/MarketplaceView';
import { ProductDetailView } from './views/ProductDetailView';
import { HomestayView } from './views/HomestayView';
import { TourPackagesView } from './views/TourPackagesView';
import { VillageDetailView } from './views/VillageDetailView';
import { CartView } from './views/CartView';
import { SellerDashboardView } from './views/SellerDashboardView';
import { AuthView } from './views/AuthView';

const MainContent: React.FC = () => {
  const { page } = useApp();

  return (
    <main className="min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        {page === 'home' && <HomeView />}
        {page === 'marketplace' && <MarketplaceView />}
        {page === 'product-detail' && <ProductDetailView />}
        {page === 'homestay' && <HomestayView />}
        {page === 'paket-wisata' && <TourPackagesView />}
        {page === 'desa-detail' && <VillageDetailView />}
        {page === 'cart' && <CartView />}
        {page === 'dashboard' && <SellerDashboardView />}
        {page === 'auth' && <AuthView />}
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
