export type ProductCategory = 
  | 'homestay'
  | 'suvenir'
  | 'kuliner'
  | 'paket-wisata'
  | 'umkm'
  | 'destinasi';

export interface Village {
  id: string;
  name: string;
  location: string; // e.g. "Gunungkidul, DI Yogyakarta"
  province: string;
  rating: number;
  totalReviews: number;
  description: string;
  history: string;
  culture: string;
  highlights: string[];
  image: string;
  gallery: string[];
  mapLocation: string;
  contactPhone: string;
  instagram: string;
  managerName: string;
  totalListings: number;
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  unit: string; // e.g. "/malam", "/pcs", "/porsi", "/paket"
  villageId: string;
  villageName: string;
  location: string;
  rating: number;
  totalReviews: number;
  sellerName: string;
  sellerBadge: string;
  sellerAvatar: string;
  sellerPhone: string;
  image: string;
  gallery: string[];
  description: string;
  highlights: string[];
  facilities?: string[]; // WiFi, Sarapan, Parkir, AC, etc.
  itinerary?: { time: string; activity: string }[];
  stockQuota: number;
  isAvailable: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  bookingDateStart?: string;
  bookingDateEnd?: string;
  guestCount?: number;
  notes?: string;
}

export type OrderStatus = 'menunggu' | 'diproses' | 'selesai' | 'dibatalkan';

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
  userRole?: string;
}

export type UserRole = 'wisatawan' | 'penjual';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  villageName?: string;
  sellerName?: string;
}
