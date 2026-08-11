import React, { createContext, useContext, useState } from 'react';
import { Product, Village, CartItem, Order, Review, User, ProductCategory, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_VILLAGES, INITIAL_REVIEWS, INITIAL_ORDERS } from '../data/mockData';

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

  // User Auth
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;

  // Seller Dashboard Actions
  addProduct: (newProd: Omit<Product, 'id' | 'rating' | 'totalReviews'>) => void;
  updateProduct: (updatedProd: Product) => void;
  deleteProduct: (productId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Reviews
  addReview: (productId: string, rating: number, comment: string) => void;

  // Toast
  toast: ToastState | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [page, setPage] = useState<PageRoute>('home');
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
  const [villages] = useState<Village[]>(INITIAL_VILLAGES);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);

  // User auth state (default null or sample user)
  const [currentUser, setCurrentUser] = useState<User | null>({
    id: 'usr-demo-01',
    name: 'Budi Wisatawan',
    email: 'budi@example.com',
    role: 'wisatawan',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  });

  // Toast state
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const navigateTo = (route: PageRoute, productId?: string, villageId?: string) => {
    setPage(route);
    if (productId) setSelectedProductId(productId);
    if (villageId) setSelectedVillageId(villageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
      totalAmount: cartTotal + 5000, // include village service fee
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

  const logout = () => {
    setCurrentUser(null);
    showToast('Anda telah keluar dari akun.', 'info');
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
      logout,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
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
