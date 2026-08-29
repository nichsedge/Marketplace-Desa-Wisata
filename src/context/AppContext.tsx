import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Village, CartItem, Order, Review, User, ProductCategory, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_VILLAGES, INITIAL_REVIEWS, INITIAL_ORDERS, MOCK_PICS } from '../data/mockData';

export type PageRoute = 
  | 'home' 
  | 'marketplace' 
  | 'homestay' 
  | 'paket-wisata' 
  | 'desa-detail' 
  | 'product-detail' 
  | 'cart' 
  | 'dashboard' 
  | 'auth';

interface ToastState {
  message: string;
  type: 'success' | 'info' | 'error';
  id: number;
}

interface AppContextType {
  // Navigation & Page state
  page: PageRoute;
  selectedProductId: string | null;
  selectedVillageId: string | null;
  navigateTo: (route: PageRoute, productId?: string, villageId?: string) => void;

  // Search & Filter state
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  categoryFilter: ProductCategory | 'all';
  setCategoryFilter: (cat: ProductCategory | 'all') => void;
  villageFilter: string | 'all';
  setVillageFilter: (vId: string | 'all') => void;
  priceFilter: number;
  setPriceFilter: (p: number) => void;
  ratingFilter: number;
  setRatingFilter: (r: number) => void;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating';
  setSortBy: (sort: 'popular' | 'price-asc' | 'price-desc' | 'rating') => void;
  resetFilters: () => void;

  // Data
  products: Product[];
  villages: Village[];
  reviews: Review[];
  orders: Order[];
  
  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product, 
    quantity?: number, 
    dateStart?: string, 
    dateEnd?: string, 
    guestCount?: number, 
    notes?: string
  ) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;

  // Checkout
  placeOrder: (
    customerName: string, 
    customerEmail: string, 
    customerPhone: string, 
    paymentMethod: string, 
    notes?: string
  ) => Order;

  // User Auth (Admin / PIC only)
  currentUser: User | null;
  login: (user: User) => void;
  loginWithCredentials: (usernameOrEmail: string, password: string) => boolean;
  logout: () => void;

  // Seller / PIC Dashboard Actions
  addProduct: (newProd: Omit<Product, 'id' | 'rating' | 'totalReviews'>) => void;
  updateProduct: (updatedProd: Product) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateVillage: (updatedVillage: Village) => void;

  // Reviews
  addReview: (productId: string, rating: number, comment: string, authorName?: string) => void;

  // Toast
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialPage = (): PageRoute => {
  if (typeof window === 'undefined') return 'home';
  const hash = window.location.hash.replace('#', '').toLowerCase();
  const searchParams = new URLSearchParams(window.location.search);
  const pageParam = searchParams.get('page') || searchParams.get('route');
  const pathname = window.location.pathname.toLowerCase();

  if (
    hash === 'login' || 
    hash === 'auth' || 
    hash === 'admin' || 
    pageParam === 'auth' || 
    pageParam === 'login' || 
    pageParam === 'admin' ||
    pathname === '/login' || 
    pathname.startsWith('/login') ||
    pathname === '/admin' || 
    pathname.startsWith('/admin') ||
    pathname === '/auth' ||
    pathname.startsWith('/auth')
  ) {
    return 'auth';
  }
  if (hash === 'dashboard' || pageParam === 'dashboard' || pathname === '/dashboard' || pathname.startsWith('/dashboard')) {
    return 'dashboard';
  }
  if (hash === 'marketplace' || pageParam === 'marketplace' || pathname === '/marketplace' || pathname.startsWith('/marketplace')) return 'marketplace';
  if (hash === 'homestay' || pageParam === 'homestay' || pathname === '/homestay' || pathname.startsWith('/homestay')) return 'homestay';
  if (hash === 'paket-wisata' || pageParam === 'paket-wisata' || pathname === '/paket-wisata' || pathname.startsWith('/paket-wisata')) return 'paket-wisata';
  if (hash === 'desa-detail' || pageParam === 'desa-detail' || pathname === '/desa-detail' || pathname.startsWith('/desa-detail')) return 'desa-detail';
  if (hash === 'cart' || pageParam === 'cart' || pathname === '/cart' || pathname.startsWith('/cart')) return 'cart';

  return 'home';
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<PageRoute>(getInitialPage());
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedVillageId, setSelectedVillageId] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | 'all'>('all');
  const [villageFilter, setVillageFilter] = useState<string | 'all'>('all');
  const [priceFilter, setPriceFilter] = useState<number>(1000000);
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popular' | 'price-asc' | 'price-desc' | 'rating'>('popular');

  // Master Data
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [villages, setVillages] = useState<Village[]>(INITIAL_VILLAGES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // User auth state: Default is null (Regular Buyer/Guest doesn't need login)
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Toast state
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Synchronize browser history / URL with page changes
  const navigateTo = (route: PageRoute, productId?: string, villageId?: string) => {
    setPage(route);
    if (productId) setSelectedProductId(productId);
    if (villageId) setSelectedVillageId(villageId);

    if (typeof window !== 'undefined') {
      try {
        const cleanPath = route === 'home' ? '/' : route === 'auth' ? '/login' : `/${route}`;
        window.history.pushState({ route, productId, villageId }, '', cleanPath);
      } catch {
        // ignore navigation history error
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setPage(getInitialPage());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setVillageFilter('all');
    setPriceFilter(1000000);
    setRatingFilter(0);
    setSortBy('popular');
  };

  // Cart Operations
  const addToCart = (
    product: Product, 
    quantity = 1, 
    bookingDateStart?: string, 
    bookingDateEnd?: string, 
    guestCount?: number, 
    notes?: string
  ) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          bookingDateStart: bookingDateStart || updated[existingIndex].bookingDateStart,
          bookingDateEnd: bookingDateEnd || updated[existingIndex].bookingDateEnd,
          guestCount: guestCount || updated[existingIndex].guestCount,
          notes: notes || updated[existingIndex].notes
        };
        return updated;
      } else {
        return [
          ...prevCart, 
          { product, quantity, bookingDateStart, bookingDateEnd, guestCount, notes }
        ];
      }
    });
    showToast(`"${product.title}" telah ditambahkan ke keranjang pesanan!`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item berhasil dihapus dari keranjang.', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Place Order
  const placeOrder = (
    customerName: string, 
    customerEmail: string, 
    customerPhone: string, 
    paymentMethod: string, 
    notes?: string
  ) => {
    const newOrder: Order = {
      id: `ORD-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      customerName,
      customerEmail,
      customerPhone,
      items: [...cart],
      totalAmount: cartTotal,
      paymentMethod,
      status: 'diproses',
      createdAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      notes
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    showToast(`Pesanan #${newOrder.id} berhasil dibuat!`, 'success');
    return newOrder;
  };

  // Auth Operations
  const login = (user: User) => {
    setCurrentUser(user);
    showToast(`Selamat datang kembali, ${user.name}!`, 'success');
  };

  const loginWithCredentials = (usernameOrEmail: string, pass: string): boolean => {
    const cleanId = usernameOrEmail.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check Super Admin Kawasan master login
    if (
      (cleanId === 'admin.lembang' || cleanId === 'admin@sabasunten.id' || cleanId === 'admin') &&
      (cleanPass === 'lembang2026' || cleanPass === 'admin123')
    ) {
      const superAdminPic: User = {
        ...MOCK_PICS[0],
        name: 'Admin Kawasan Saba Lembang',
        picRoleTitle: 'Super Administrator Kawasan Lembang'
      };
      setCurrentUser(superAdminPic);
      showToast('Login berhasil! Selamat datang Admin Kawasan Lembang.', 'success');
      navigateTo('dashboard');
      return true;
    }

    // Match against official PIC accounts
    const matchedPic = MOCK_PICS.find(p => {
      const userMatch = (p.username && p.username.toLowerCase() === cleanId) || 
                        (p.email && p.email.toLowerCase() === cleanId);
      const passMatch = p.password === cleanPass;
      return userMatch && passMatch;
    });

    if (matchedPic) {
      setCurrentUser(matchedPic);
      showToast(`Login berhasil! Selamat datang ${matchedPic.name} (${matchedPic.picVillageName?.replace('Desa Wisata ', '')}).`, 'success');
      navigateTo('dashboard');
      return true;
    }

    showToast('Username atau password PIC salah. Silakan periksa kredensial demo.', 'error');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Anda telah keluar dari sesi PIC/Admin.', 'info');
    navigateTo('home');
  };

  // Seller Dashboard Actions
  const addProduct = (newProd: Omit<Product, 'id' | 'rating' | 'totalReviews'>) => {
    const created: Product = {
      ...newProd,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      totalReviews: 1
    };
    setProducts(prev => [created, ...prev]);
    showToast(`Produk baru "${created.title}" berhasil diterbitkan!`, 'success');
  };

  const updateProduct = (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
    showToast(`Data produk "${updatedProd.title}" berhasil diperbarui.`, 'success');
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    showToast('Produk berhasil dihapus.', 'info');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Status pesanan #${orderId} diubah menjadi "${status}".`, 'success');
  };

  const updateVillage = (updatedVillage: Village) => {
    setVillages(prev => prev.map(v => v.id === updatedVillage.id ? updatedVillage : v));
    showToast(`Data profil "${updatedVillage.name}" berhasil diperbarui.`, 'success');
  };

  const addReview = (productId: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId,
      authorName: currentUser ? currentUser.name : 'Wisatawan',
      authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      rating,
      date: 'Baru saja',
      comment,
      userRole: 'Wisatawan Terverifikasi'
    };
    setReviews(prev => [newRev, ...prev]);
    
    // update product rating & review count
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newTotal = p.totalReviews + 1;
        const newRating = Number(((p.rating * p.totalReviews + rating) / newTotal).toFixed(1));
        return { ...p, rating: newRating, totalReviews: newTotal };
      }
      return p;
    }));

    showToast('Terima kasih! Ulasan Anda telah terpublikasi.', 'success');
  };

  return (
    <AppContext.Provider value={{
      page,
      selectedProductId,
      selectedVillageId,
      navigateTo,
      searchQuery,
      setSearchQuery,
      categoryFilter,
      setCategoryFilter,
      villageFilter,
      setVillageFilter,
      priceFilter,
      setPriceFilter,
      ratingFilter,
      setRatingFilter,
      sortBy,
      setSortBy,
      resetFilters,
      products,
      villages,
      reviews,
      orders,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartTotal,
      cartCount,
      placeOrder,
      currentUser,
      login,
      loginWithCredentials,
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      updateVillage,
      addReview,
      toast,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
