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
  location: string;
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
  // Official Village Government Data (desasuntenjaya.site)
  headOfVillage?: string;
  villageSecretary?: string;
  villageArea?: string;
  population?: string;
  dusunCount?: number;
  dusuns?: { id: string; name: string; kadus: string; description: string; highlights: string }[];
  vision?: string;
  missions?: string[];
  silamotUrl?: string;
  officeAddress?: string;
  villageApparatus?: { role: string; name: string }[];
  villageAltitude?: string;
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
  username?: string;
  password?: string;
  avatar?: string;
  villageName?: string;
  sellerName?: string;
  picVillageId?: string;
  picVillageName?: string;
  picRoleTitle?: string;
  phone?: string;
}

