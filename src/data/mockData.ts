import { Village, Product, Review, Order, User } from '../types';
import { REAL_PRODUCTS } from './realProducts';

export const INITIAL_VILLAGES: Village[] = [
  {
    id: 'des-01',
    name: 'Desa Wisata Suntenjaya',
    location: 'Kec. Lembang, Kab. Bandung Barat',
    province: 'Jawa Barat',
    rating: 4.9,
    totalReviews: 284,
    villageAltitude: '1.290 mdpl',
    description: 'Desa Suntenjaya menawarkan keindahan lanskap lereng Gunung Palasari, perkebunan sayur terasering, cagar budaya megalitikum Batu Loceng, serta kopi Arabika specialty di kawasan Lembang.',
    history: 'Desa Suntenjaya bermula dari perkampungan agraris subur di lereng Gunung Palasari, Gunung Manglayang, dan Bukit Tunggul pada ketinggian 1.290 mdpl. Suntenjaya kini tumbuh sebagai sentra kopi Arabika dan agrowisata mandiri.',
    culture: 'Masyarakat menjunjung kearifan budaya Sunda, pelestarian Situs Bersejarah Batu Loceng, balap kereta kayu tradisional Kadaplak, serta tradisi gotong royong peternak dan petani.',
    highlights: [
      'Sentra Kopi Arabika Suntenjaya',
      'Situs Bersejarah Batu Loceng',
      'Homestay Asri Rumah Warga (Lereng Palasari)',
      'Wisata Lereng Pasir Angling',
      'Wisata Edukasi Tekno-Ekologi'
    ],
    image: '/images/client/pasir-angling/hero-valley-panorama.webp',
    gallery: [
      '/images/client/pasir-angling/hero-valley-panorama.webp',
      '/images/client/suntenjaya/hero-homestay-teras-kayu.webp',
      '/images/client/suntenjaya/homestay-teras-kebun.webp',
      '/images/client/kopi-angling/coffee-plantation-view.webp',
      '/images/client/batu-loceng/hero-batu-loceng-kuncen.webp',
      '/images/client/kopi-angling/hero-pouch-v60.webp'
    ],
    mapLocation: 'Jl. Maribaya Timur KM. 13,5, Desa Suntenjaya, Kec. Lembang, Kab. Bandung Barat 40391',
    officeAddress: 'Kantor Desa Suntenjaya, Jl. Maribaya Timur KM. 13,5, Desa Suntenjaya, Kec. Lembang, Kab. Bandung Barat, Jawa Barat 40391',
    officeMapEmbedUrl: 'https://maps.google.com/maps?q=Kantor+Desa+Suntenjaya+Lembang&t=&z=15&ie=UTF8&iwloc=&output=embed',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Desa+Suntenjaya+Lembang',
    contactPhone: '+62 812-2076-3734',
    instagram: '@suntenjaya.lembang',
    managerName: 'Kang Asep Suhendar (Admin Desa Suntenjaya)',
    totalListings: 6
  },
  {
    id: 'des-03',
    name: 'Desa Wisata Cikole',
    location: 'Kec. Lembang, Kab. Bandung Barat',
    province: 'Jawa Barat',
    rating: 4.9,
    totalReviews: 340,
    villageAltitude: '1.400 mdpl',
    description: 'Desa Cikole berada di lereng Gunung Tangkuban Parahu, terkenal dengan hutan pinus yang megah, paket camping, sewa tenda, tiket wahana rekreasi, dan persewaan armada offroad 4x4.',
    history: 'Cikole telah lama menjadi ikon wisata alam pegunungan Lembang dengan hamparan hutan pinus alami berkabut sejuk yang dikelola bersama masyarakat desa.',
    culture: 'Budaya pelestarian hutan pinus, petualangan alam terbuka, komunitas offroad Land Rover, dan keramahan pemandu wisata hutan.',
    highlights: [
      'Paket Camping Hutan Pinus',
      'Sewa Tenda & Matras Lengkap',
      'Sewa Offroad 4x4 Tangkuban Parahu',
      'Tiket Wahana & Spot Alam Sejuk',
      'Udara Super Sejuk 1.400 mdpl'
    ],
    image: '/images/client/offroad-cikole/convoy-pine-trail.webp',
    gallery: [
      '/images/client/offroad-cikole/convoy-pine-trail.webp',
      '/images/client/offroad-cikole/hero-abah-dadan-landy.webp',
      '/images/client/offroad-cikole/mud-splash-adventure.webp',
      '/images/unsplash/photo-1509316975850-ff9c5deb0cd9_w800.jpg'
    ],
    mapLocation: 'Jl. Raya Tangkuban Parahu KM. 28, Cikole, Kec. Lembang, Kab. Bandung Barat 40391',
    officeAddress: 'Kantor Desa Cikole, Jl. Raya Tangkuban Parahu KM. 28, Cikole, Kec. Lembang, Kab. Bandung Barat, Jawa Barat 40391',
    officeMapEmbedUrl: 'https://maps.google.com/maps?q=Kantor+Desa+Cikole+Lembang&t=&z=15&ie=UTF8&iwloc=&output=embed',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Desa+Cikole+Lembang',
    contactPhone: '+62 821-3344-9988',
    instagram: '@cikolewisatalembang',
    managerName: 'Kang Dadan Ridwan (Admin Desa Cikole)',
    totalListings: 3
  },
  {
    id: 'des-04',
    name: 'Desa Wisata Jayagiri',
    location: 'Kec. Lembang, Kab. Bandung Barat',
    province: 'Jawa Barat',
    rating: 4.8,
    totalReviews: 180,
    villageAltitude: '1.350 mdpl',
    description: 'Desa Jayagiri berada di lereng Gunung Tangkuban Parahu, terkenal dengan panorama samudra awan Gunung Putri, hutan pinus asri, jalur lintas alam legendaris, dan kedai Maguru Kopi Jayagiri.',
    history: 'Jayagiri melegenda dalam seni dan sastra Sunda sebagai kawasan hutan alam berkabut sejuk dengan jalur pendakian bersejarah menuju kawah Tangkuban Parahu dan benteng peninggalan kolonial.',
    culture: 'Masyarakat agraris penjaga kelestarian lereng gunung, pemandu lintas alam rimba, serta tradisi seduh kopi pegunungan bersama Pa Maliki.',
    highlights: [
      'Maguru Kopi Legend Jayagiri (Pa Maliki)',
      'Pesona Samudra Awan Gunung Putri',
      'Jalur Rimba Trekking Tangkuban Parahu',
      'Camping Ground Hutan Pinus Sejuk'
    ],
    image: '/images/real/gunung-putri-jayagiri.jpg',
    gallery: [
      '/images/real/gunung-putri-jayagiri.jpg',
      '/images/real/jayagiri-camping.jpg',
      '/images/unsplash/photo-1448375240586-882707db888b_w800.jpg',
      '/images/unsplash/photo-1514432324607-a09d9b4aefdd_w800.jpg'
    ],
    mapLocation: 'Jl. Jayagiri No. 12, Jayagiri, Kec. Lembang, Kab. Bandung Barat 40391',
    officeAddress: 'Kantor Desa Jayagiri, Jl. Jayagiri No. 12, Jayagiri, Kec. Lembang, Kab. Bandung Barat, Jawa Barat 40391',
    officeMapEmbedUrl: 'https://maps.google.com/maps?q=Kantor+Desa+Jayagiri+Lembang&t=&z=15&ie=UTF8&iwloc=&output=embed',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Desa+Jayagiri+Lembang',
    contactPhone: '+62 857-2233-7711',
    instagram: '@jayagiri.lembang',
    managerName: 'Teh Eni Rohaeni (Admin Desa Jayagiri)',
    totalListings: 1
  },
  {
    id: 'des-05',
    name: 'Desa Wisata Wangunsari',
    location: 'Kec. Lembang, Kab. Bandung Barat',
    province: 'Jawa Barat',
    rating: 4.8,
    totalReviews: 165,
    villageAltitude: '1.200 mdpl',
    description: 'Desa Wangunsari terkenal dengan produk kuliner legendaris khas Lembang seperti tahu susu lembut Tahu Agus, kicimpring singkong renyah, ranginang ketan terasi, dan peuyeum ketan manis daun jambu.',
    history: 'Desa Wangunsari berkembang pesat sebagai sentra kreasi kuliner tradisional UMKM panganan khas Jawa Barat yang berkualitas tinggi.',
    culture: 'Tradisi kuliner olahan tahu susu lembut, keterampilan mengolah kicimpring singkong, ranginang terasi gurih, dan tape peuyeum ketan fermentasi alami.',
    highlights: [
      'Tahu Susu Lembut Tahu Agus (Rp 5.000/kemasan)',
      'Kicimpring Singkong Renyah Gurih',
      'Ranginang Ketan Rasa Terasi (1 Kg)',
      'Peuyeum Ketan Daun Jambu (Sistem PO)'
    ],
    image: '/images/client/wangunsari/tahu-susu-agus-kemasan-10pcs.webp',
    gallery: [
      '/images/client/wangunsari/tahu-susu-agus-kemasan-10pcs.webp',
      '/images/client/wangunsari/kicimpring-singkong-renyah.webp',
      '/images/client/wangunsari/ranginang-terasi-khas-wangunsari.webp',
      '/images/client/wangunsari/peuyeum-ketan-daun-jambu.webp'
    ],
    mapLocation: 'Jl. Wangunsari Raya No. 45, Wangunsari, Kec. Lembang, Kab. Bandung Barat 40391',
    officeAddress: 'Kantor Desa Wangunsari, Jl. Wangunsari Raya No. 45, Wangunsari, Kec. Lembang, Kab. Bandung Barat, Jawa Barat 40391',
    officeMapEmbedUrl: 'https://maps.google.com/maps?q=Kantor+Desa+Wangunsari+Lembang&t=&z=15&ie=UTF8&iwloc=&output=embed',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Desa+Wangunsari+Lembang',
    contactPhone: '+62 818-0911-5544',
    instagram: '@wangunsari.lembang',
    managerName: 'Kang Sandi Permana (Admin Desa Wangunsari)',
    totalListings: 4
  },
  {
    id: 'des-07',
    name: 'Desa Wisata Gudangkahuripan',
    location: 'Kec. Lembang, Kab. Bandung Barat',
    province: 'Jawa Barat',
    rating: 4.8,
    totalReviews: 156,
    villageAltitude: '1.220 mdpl',
    description: 'Desa Wisata Gudangkahuripan menjunjung tinggi pelestarian seni budaya tradisional Pasundan, menghadirkan workshop seni gamelan degung/salendro, pelatihan tari Jaipong, dan literasi kearifan lokal bersama Sanggar Seni Kamandaka.',
    history: 'Sebagai salah satu pintu utama koridor wisata Lembang, Gudangkahuripan menjadi pusat edukasi kebudayaan Sunda dan apresiasi seni tari tradisional Jawa Barat.',
    culture: 'Pelestarian gerak tari Jaipong tradisional Sunda, kesenian gamelan degung, dan bincang literasi budaya bersama budayawan Pa Mei Wisana.',
    highlights: [
      'Workshop Tari Tradisional Jaipong',
      'Pelatihan Tabuh Gamelan Degung Sunda',
      'Literasi Kearifan Lokal & Sejarah Lembang',
      'Sanggar Seni Budaya Kamandaka'
    ],
    image: '/images/client/gudangkahuripan/hero-tari-jaipong-materi.webp',
    gallery: [
      '/images/client/gudangkahuripan/hero-tari-jaipong-materi.webp',
      '/images/client/gudangkahuripan/jaipong-peserta-senyum.webp',
      '/images/client/gudangkahuripan/jaipong-pelatihan-kompak.webp',
      '/images/client/gudangkahuripan/jaipong-praktek-lapangan.webp'
    ],
    mapLocation: 'Jl. Raya Lembang No. 145, Gudangkahuripan, Kec. Lembang, Kab. Bandung Barat 40391',
    officeAddress: 'Kantor Desa Gudangkahuripan, Jl. Raya Lembang No. 145, Gudangkahuripan, Kec. Lembang, Kab. Bandung Barat, Jawa Barat 40391',
    officeMapEmbedUrl: 'https://maps.google.com/maps?q=Kantor+Desa+Gudangkahuripan+Lembang&t=&z=15&ie=UTF8&iwloc=&output=embed',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Desa+Gudangkahuripan+Lembang',
    contactPhone: '+62 812-3344-7788',
    instagram: '@gudangkahuripan.lembang',
    managerName: 'Teh Rina Melati (Admin Desa Gudangkahuripan)',
    totalListings: 1
  },
  {
    id: 'des-08',
    name: 'Desa Wisata Sukajaya',
    location: 'Kec. Lembang, Kab. Bandung Barat',
    province: 'Jawa Barat',
    rating: 4.9,
    totalReviews: 172,
    villageAltitude: '1.270 mdpl',
    description: 'Desa Wisata Sukajaya terkenal dengan produk olahan susu murni perah segar, aneka olahan yoghurt sehat (Yoghvit & Mat Pochi), serta tahu susu lembut dari sentra peternakan dan Toko Barokah Pa Emin.',
    history: 'Dikelilingi kawasan peternakan sapi perah yang makmur di Kp. Citespong, Toko Barokah Pa Emin menjadi pionir pengolahan susu murni higienis berkualitas tinggi.',
    culture: 'Kerja keras peternak sapi perah lokal dalam menjaga kemurnian susu, higienitas pengolahan yoghurt berprobiotik, serta pembuatan tahu susu lembut tanpa pengawet.',
    highlights: [
      'Susu Sapi Murni Segar Pasteur (Pa Emin)',
      'Yoghurt Probiotik Botol & Stick Yoghvit',
      'Tahu Susu Lembut Barokah Sukajaya',
      'Sentra Toko Barokah Pa Emin Citespong'
    ],
    image: '/images/client/sukajaya/hero-toko-barokah-susu-murni.webp',
    gallery: [
      '/images/client/sukajaya/hero-toko-barokah-susu-murni.webp',
      '/images/client/sukajaya/hero-yoghvit-botol.webp',
      '/images/client/sukajaya/hero-tahu-susu-barokah.webp',
      '/images/client/sukajaya/yoghurt-stick-mat-pochi.webp'
    ],
    mapLocation: 'Jl. Sukajaya No. 18, Sukajaya, Kec. Lembang, Kab. Bandung Barat 40391',
    officeAddress: 'Kantor Desa Sukajaya, Jl. Sukajaya No. 18, Sukajaya, Kec. Lembang, Kab. Bandung Barat, Jawa Barat 40391',
    officeMapEmbedUrl: 'https://maps.google.com/maps?q=Kantor+Desa+Sukajaya+Lembang&t=&z=15&ie=UTF8&iwloc=&output=embed',
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Kantor+Desa+Sukajaya+Lembang',
    contactPhone: '+62 813-8899-6655',
    instagram: '@sukajaya.lembang',
    managerName: 'Kang Wawan Kurnia (Admin Desa Sukajaya)',
    totalListings: 3
  }
];

// Presets for Admin Desa Users across Kawasan Lembang (with demo credentials for authentications)
export const MOCK_PICS: User[] = [
  {
    id: 'admin-suntenjaya',
    name: 'Kang Asep Suhendar',
    username: 'admin.suntenjaya',
    password: 'suntenjaya123',
    email: 'asep.suhendar@sabalembang.id',
    role: 'penjual',
    phone: '+6281220763734',
    avatar: '/images/default-avatar.svg',
    villageName: 'Desa Wisata Suntenjaya',
    sellerName: 'Admin Desa Suntenjaya / BUMDes',
    picVillageId: 'des-01',
    picVillageName: 'Desa Wisata Suntenjaya',
    picRoleTitle: 'Admin Desa Suntenjaya'
  },
  {
    id: 'admin-cikole',
    name: 'Kang Dadan Ridwan',
    username: 'admin.cikole',
    password: 'cikole123',
    email: 'dadan.cikole@sabalembang.id',
    role: 'penjual',
    phone: '+6282133449988',
    avatar: '/images/default-avatar.svg',
    villageName: 'Desa Wisata Cikole',
    sellerName: 'Admin Desa Wisata Cikole',
    picVillageId: 'des-03',
    picVillageName: 'Desa Wisata Cikole',
    picRoleTitle: 'Admin Desa Cikole'
  },
  {
    id: 'admin-jayagiri',
    name: 'Teh Eni Rohaeni',
    username: 'admin.jayagiri',
    password: 'jayagiri123',
    email: 'eni.jayagiri@sabalembang.id',
    role: 'penjual',
    phone: '+6285722337711',
    avatar: '/images/default-avatar.svg',
    villageName: 'Desa Wisata Jayagiri',
    sellerName: 'Admin Desa Wisata Jayagiri',
    picVillageId: 'des-04',
    picVillageName: 'Desa Wisata Jayagiri',
    picRoleTitle: 'Admin Desa Jayagiri'
  },
  {
    id: 'admin-wangunsari',
    name: 'Kang Sandi Permana',
    username: 'admin.wangunsari',
    password: 'wangunsari123',
    email: 'sandi.wangunsari@sabalembang.id',
    role: 'penjual',
    phone: '+6281809115544',
    avatar: '/images/default-avatar.svg',
    villageName: 'Desa Wisata Wangunsari',
    sellerName: 'Admin Desa Wisata Wangunsari',
    picVillageId: 'des-05',
    picVillageName: 'Desa Wisata Wangunsari',
    picRoleTitle: 'Admin Desa Wangunsari'
  },
  {
    id: 'admin-gudangkahuripan',
    name: 'Teh Rina Melati',
    username: 'admin.gudangkahuripan',
    password: 'gudangkahuripan123',
    email: 'rina.gudangkahuripan@sabalembang.id',
    role: 'penjual',
    phone: '+6281233447788',
    avatar: '/images/default-avatar.svg',
    villageName: 'Desa Wisata Gudangkahuripan',
    sellerName: 'Admin Desa Wisata Gudangkahuripan',
    picVillageId: 'des-07',
    picVillageName: 'Desa Wisata Gudangkahuripan',
    picRoleTitle: 'Admin Desa Gudangkahuripan'
  },
  {
    id: 'admin-sukajaya',
    name: 'Kang Wawan Kurnia',
    username: 'admin.sukajaya',
    password: 'sukajaya123',
    email: 'wawan.sukajaya@sabalembang.id',
    role: 'penjual',
    phone: '+6281388996655',
    avatar: '/images/default-avatar.svg',
    villageName: 'Desa Wisata Sukajaya',
    sellerName: 'Admin Desa Wisata Sukajaya',
    picVillageId: 'des-08',
    picVillageName: 'Desa Wisata Sukajaya',
    picRoleTitle: 'Admin Desa Sukajaya'
  }
];

// Presets of authentic Lembang photos for quick gallery selection
export const LEMBANG_GALLERY_PRESETS = [
  {
    id: 'photo-1',
    title: 'Homestay Teras Kayu Asri Lereng Palasari',
    category: 'penginapan-lokal',
    villageId: 'des-01',
    villageName: 'Suntenjaya',
    url: '/images/client/suntenjaya/hero-homestay-teras-kayu.webp'
  },
  {
    id: 'photo-2',
    title: 'Tahu Susu Lembut Gurih Wangunsari',
    category: 'kuliner',
    villageId: 'des-05',
    villageName: 'Wangunsari',
    url: '/images/client/wangunsari/hero-tahu-susu.webp'
  },
  {
    id: 'photo-3',
    title: 'Hutan Pinus Sejuk Cikole Tangkuban Parahu',
    category: 'wisata-alam',
    villageId: 'des-03',
    villageName: 'Cikole',
    url: '/images/unsplash/photo-1448375240586-882707db888b_w800.jpg'
  },
  {
    id: 'photo-4',
    title: 'Kebun Kopi Arabika Suntenjaya',
    category: 'minuman-komoditas',
    villageId: 'des-01',
    villageName: 'Suntenjaya',
    url: '/images/unsplash/photo-1514432324607-a09d9b4aefdd_w800.jpg'
  },
  {
    id: 'photo-5',
    title: 'Tanaman Hias & Sukulen Asri Jayagiri',
    category: 'tanaman-hias',
    villageId: 'des-04',
    villageName: 'Jayagiri',
    url: '/images/unsplash/photo-1485955900006-10f4d324d411_w800.jpg'
  },
  {
    id: 'photo-7',
    title: 'Kuliner Tahu Susu & Bolu Wangunsari',
    category: 'kuliner',
    villageId: 'des-05',
    villageName: 'Wangunsari',
    url: '/images/tahu-susu-goreng.jpg'
  },
  {
    id: 'photo-8',
    title: 'Olahan Yoghurt & Susu Kemasan Sukajaya',
    category: 'olahan-susu',
    villageId: 'des-08',
    villageName: 'Sukajaya',
    url: '/images/unsplash/photo-1571212515416-fef01fc43637_w800.jpg'
  }
];

export const INITIAL_MOCK_PRODUCTS: Product[] = [
  // =========================================================================
  // 1. MINUMAN & KOMODITAS — Desa: Suntenjaya (Kopi Arabika & Wisata Batu Loceng)
  // =========================================================================
  {
    id: 'prod-kopi-01',
    title: 'Biji Kopi Arabika Single Origin Suntenjaya Premium Kantongan (250g)',
    category: 'minuman-komoditas',
    price: 65000,
    originalPrice: 75000,
    unit: '/pouch',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Suntenjaya, Lembang',
    rating: 5.0,
    totalReviews: 112,
    sellerName: 'Kelompok Tani Kopi Batu Loceng',
    sellerBadge: 'Petani Kopi Juara',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6281220763734',
    image: '/images/client/kopi-angling/hero-pouch-v60.webp',
    gallery: [
      '/images/client/kopi-angling/hero-pouch-v60.webp',
      '/images/client/kopi-angling/coffee-plantation-view.webp',
      '/images/client/kopi-angling/coffee-cherries-tree.webp'
    ],
    description: 'Biji kopi Arabika premium single origin yang ditanam di ketinggian 1.290 mdpl lereng Gunung Palasari Suntenjaya. Dipetik merah sempurna dengan profil rasa floral lembut, asam segar citrus, dan manis karamel.',
    highlights: ['100% Arabika Specialty Grade 1', 'Pouch Valve Zipper Kedap Udara', 'Pilihan Biji Utuh / Gilingan'],
    stockQuota: 85,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-wisata-s01',
    title: 'Paket Wisata Edukasi Kebun Kopi & Situs Batu Loceng Suntenjaya',
    category: 'wisata-alam',
    price: 75000,
    unit: '/orang',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Suntenjaya, Lembang',
    rating: 4.9,
    totalReviews: 56,
    sellerName: 'Kelompok Sadar Wisata Batu Loceng',
    sellerBadge: 'Pengelola Wisata Budaya',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6281220763734',
    image: '/images/client/batu-loceng/hero-batu-loceng-kuncen.webp',
    gallery: [
      '/images/client/batu-loceng/hero-batu-loceng-kuncen.webp',
      '/images/client/batu-loceng/batu-loceng-sacred-stone.webp',
      '/images/client/batu-loceng/saung-cagar-budaya.webp'
    ],
    description: 'Jelajah agrowisata kebun kopi Arabika lereng Gunung Palasari dan napak tilas cagar budaya megalitikum Situs Batu Loceng Suntenjaya bersama juru kunci cagar budaya, include cupping kopi specialty hangat dan pemandu sejarah desa.',
    highlights: ['Wisata Sejarah Megalitikum Batu Loceng', 'Edukasi Petik & Sangrai Biji Kopi', 'Didampingi Kuncen Cagar Budaya'],
    stockQuota: 30,
    isAvailable: true,
    isFeatured: true
  },

  // =========================================================================
  // 4. BUAH & HERBA — Desa: Cikahuripan (Lemon segar, stroberi, dan herbal alami)
  // =========================================================================
  {
    id: 'prod-buah-01',
    title: 'Lemon California Segar Petik Kebun Cikahuripan (1 Kg)',
    category: 'buah-herba',
    price: 28000,
    originalPrice: 35000,
    unit: '/kg',
    villageId: 'des-06',
    villageName: 'Desa Wisata Cikahuripan',
    location: 'Cikahuripan, Lembang',
    rating: 4.9,
    totalReviews: 53,
    sellerName: 'Kebun Lemon Asri Cikahuripan',
    sellerBadge: 'Petani Buah Binaan',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6282219405566',
    image: '/images/unsplash/photo-1587496679742-bad502958fbf_w800.jpg',
    gallery: ['/images/unsplash/photo-1587496679742-bad502958fbf_w800.jpg'],
    description: 'Lemon California berkulit mulus kuning cerah kaya air dan sari vitamin C segar yang dipanen langsung dari perkebunan lereng Cikahuripan.',
    highlights: ['Air Lemon Melimpah', 'Bebas Lilin Pengawet', 'Dipetik Langsung Dari Pohon'],
    stockQuota: 45,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-buah-02',
    title: 'Stroberi Manis Dataran Tinggi Cikahuripan (1 Keranjang)',
    category: 'buah-herba',
    price: 35000,
    unit: '/keranjang',
    villageId: 'des-06',
    villageName: 'Desa Wisata Cikahuripan',
    location: 'Cikahuripan, Lembang',
    rating: 4.8,
    totalReviews: 61,
    sellerName: 'Petik Stroberi Cikahuripan',
    sellerBadge: 'Petani Stroberi Lokal',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6282219405566',
    image: '/images/unsplash/photo-1464965911861-746a04b4bca6_w800.jpg',
    gallery: ['/images/unsplash/photo-1464965911861-746a04b4bca6_w800.jpg'],
    description: 'Buah stroberi merah segar manis ranum khas hawa dingin Cikahuripan. Sangat cocok dinikmati langsung, dibuat jus, ataupun selai.',
    highlights: ['Manis Segar Alami', 'Kemasan Keranjang Anyaman Tradisional', 'Dipetik Hari Pengiriman'],
    stockQuota: 30,
    isAvailable: true
  },
  {
    id: 'prod-buah-03',
    title: 'Racikan Herbal Alami & Jamu Tradisional Khas Cikahuripan',
    category: 'buah-herba',
    price: 30000,
    unit: '/pack',
    villageId: 'des-06',
    villageName: 'Desa Wisata Cikahuripan',
    location: 'Cikahuripan, Lembang',
    rating: 4.9,
    totalReviews: 38,
    sellerName: 'Griya Herba Sehat Cikahuripan',
    sellerBadge: 'Pengolah Herba Alami',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6282219405566',
    image: '/images/unsplash/photo-1596040033229-a9821ebd058d_w800.jpg',
    gallery: ['/images/unsplash/photo-1596040033229-a9821ebd058d_w800.jpg'],
    description: 'Kombinasi simplisia jahe merah, serai wangi, temulawak, kapulaga, dan kayu manis pegunungan untuk menghangatkan tubuh dan menjaga daya tahan tubuh.',
    highlights: ['100% Rempah Murni Pilihan', 'Tanpa Tambahan Bahan Kimia', 'Mudah Diseduh Hangat'],
    stockQuota: 50,
    isAvailable: true
  },
  // =========================================================================
  // 3. WISATA ALAM — Desa: Cikole & Cikahuripan (Camping, tenda, tiket wahana, offroad)
  // =========================================================================
  {
    id: 'prod-wisata-c01',
    title: 'Paket Camping & Glamping Tenda Kanopi Pinus Cikole',
    category: 'wisata-alam',
    price: 220000,
    unit: '/tenda',
    villageId: 'des-03',
    villageName: 'Desa Wisata Cikole',
    location: 'Cikole, Lembang',
    rating: 4.9,
    totalReviews: 95,
    sellerName: 'Pengelola Rimba Pinus Cikole',
    sellerBadge: 'Pengelola Wisata Resmi',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6282133449988',
    image: '/images/unsplash/photo-1448375240586-882707db888b_w800.jpg',
    gallery: [
      '/images/unsplash/photo-1448375240586-882707db888b_w800.jpg',
      '/images/unsplash/photo-1509316975850-ff9c5deb0cd9_w800.jpg'
    ],
    description: 'Sensasi camping dan glamping kanopi hutan pinus Cikole (1.400 mdpl) include sewa tenda dome berkapasitas 4 orang, matras empuk, sleeping bag, penerangan, dan api unggun bersama.',
    highlights: ['Sensasi Glamping & Camping Pinus', 'Tenda Dome Kapasitas 4 Orang', 'Matras & Sleeping Bag Lengkap', 'Akses Toilet Bersih & Air Hangat'],
    stockQuota: 15,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-wisata-c02',
    title: 'Sewa Offroad Land Rover 4x4 Rimba Cikole Tangkuban Parahu',
    category: 'wisata-alam',
    price: 275000,
    unit: '/orang',
    villageId: 'des-03',
    villageName: 'Desa Wisata Cikole',
    location: 'Cikole, Lembang',
    rating: 5.0,
    totalReviews: 82,
    sellerName: 'Komunitas Landy Rimba Cikole',
    sellerBadge: 'Driver Profesional Berlisensi',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6282133449988',
    image: '/images/client/offroad-cikole/hero-abah-dadan-landy.webp',
    gallery: [
      '/images/client/offroad-cikole/hero-abah-dadan-landy.webp',
      '/images/client/offroad-cikole/convoy-pine-trail.webp',
      '/images/client/offroad-cikole/mud-splash-adventure.webp'
    ],
    description: 'Petualangan memacu adrenalin membelah jalur berlumpur hutan pinus Tangkuban Parahu dengan mobil 4x4 Land Rover klasik dipandu driver berpengalaman.',
    highlights: ['Mobil 4x4 + Driver Berpengalaman', 'Safety Helmet & Perlengkapan Standar', 'Spot Foto Hutan Pinus Eksklusif'],
    stockQuota: 12,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-wisata-c03',
    title: 'Tiket Masuk & Wahana Petualangan Hutan Pinus Cikole',
    category: 'wisata-alam',
    price: 35000,
    unit: '/orang',
    villageId: 'des-03',
    villageName: 'Desa Wisata Cikole',
    location: 'Cikole, Lembang',
    rating: 4.8,
    totalReviews: 64,
    sellerName: 'Loket Wisata Cikole',
    sellerBadge: 'Tiket Resmi Terverifikasi',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6282133449988',
    image: '/images/unsplash/photo-1473448912268-2022ce9509d8_w800.jpg',
    gallery: ['/images/unsplash/photo-1473448912268-2022ce9509d8_w800.jpg'],
    description: 'Tiket masuk area konservasi hutan pinus Cikole include akses jembatan gantung kanopi, spot foto alam berkabut, dan area santai keluarga.',
    highlights: ['Akses Bebas Seluruh Area Pinus', 'Jembatan Gantung Kanopi', 'Spot Foto Estetik Instagrammable'],
    stockQuota: 100,
    isAvailable: true
  },
  {
    id: 'prod-wisata-c04',
    title: 'Paket Glamping Mewah & Tenda Kanopi Hutan Pinus Cikole',
    category: 'wisata-alam',
    price: 450000,
    unit: '/malam',
    villageId: 'des-03',
    villageName: 'Desa Wisata Cikole',
    location: 'Cikole, Lembang',
    rating: 5.0,
    totalReviews: 78,
    sellerName: 'Pengelola Rimba Pinus Cikole',
    sellerBadge: 'Pengelola Wisata Resmi',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6282133449988',
    image: '/images/unsplash/photo-1509316975850-ff9c5deb0cd9_w800.jpg',
    gallery: [
      '/images/unsplash/photo-1509316975850-ff9c5deb0cd9_w800.jpg',
      '/images/unsplash/photo-1448375240586-882707db888b_w800.jpg'
    ],
    description: 'Pengalaman glamping mewah eksklusif di tengah rerimbunan kanopi pohon pinus Cikole dengan kasur springbed empuk, pemanas air water heater, fasilitas api unggun, dan sarapan pagi hangat.',
    highlights: ['Glamping Mewah Springbed Kasur Nyaman', 'Water Heater & Listrik Pribadi', 'Api Unggun & Sarapan Hangat Termasuk'],
    facilities: ['Kasur Springbed', 'Water Heater', 'Listrik & Colokan', 'Sarapan Pagi', 'Toilet Bersih'],
    stockQuota: 8,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-wisata-c05',
    title: 'Paket Wisata Paintball & Panahan Rimba Pinus Cikole',
    category: 'wisata-alam',
    price: 95000,
    unit: '/orang',
    villageId: 'des-03',
    villageName: 'Desa Wisata Cikole',
    location: 'Cikole, Lembang',
    rating: 4.8,
    totalReviews: 49,
    sellerName: 'Komunitas Paintball Cikole',
    sellerBadge: 'Instruktur Outbound Berlisensi',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6282133449988',
    image: '/images/unsplash/photo-1473448912268-2022ce9509d8_w800.jpg',
    gallery: ['/images/unsplash/photo-1473448912268-2022ce9509d8_w800.jpg'],
    description: 'Simulasi perang strategi seru di arena hutan pinus Cikole include 50 butir peluru, rompi pelindung tubuh, kacamata goggle, dan sesi latihan panahan (archery target).',
    highlights: ['50 Peluru + Full Safety Gear', 'Instruktur Outbound Berpengalaman', 'Arena Rimba Pinus Alami'],
    stockQuota: 40,
    isAvailable: true
  },

  // Wisata Alam — Desa Cikahuripan
  {
    id: 'prod-wisata-k01',
    title: 'Paket Camping Lereng Asri & Sewa Tenda Cikahuripan',
    category: 'wisata-alam',
    price: 180000,
    unit: '/tenda',
    villageId: 'des-06',
    villageName: 'Desa Wisata Cikahuripan',
    location: 'Cikahuripan, Lembang',
    rating: 4.9,
    totalReviews: 43,
    sellerName: 'Camping Ground Bukit Cikahuripan',
    sellerBadge: 'Pengelola Wisata Bukit',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6282219405566',
    image: '/images/unsplash/photo-1506744038136-46273834b3fb_w800.jpg',
    gallery: ['/images/unsplash/photo-1506744038136-46273834b3fb_w800.jpg'],
    description: 'Sensasi camping sejuk di lereng perbukitan Cikahuripan dengan pemandangan gemerlap lampu malam kota Bandung dan sunrise pagi yang memukau.',
    highlights: ['Citylight View & Sunrise Menawan', 'Tenda Dome + Matras Lengkap', 'Fasilitas Toilet & Listrik'],
    stockQuota: 20,
    isAvailable: true
  },
  {
    id: 'prod-wisata-k02',
    title: 'Sewa Offroad Rimba & Jalur Alam Perbukitan Cikahuripan',
    category: 'wisata-alam',
    price: 250000,
    unit: '/orang',
    villageId: 'des-06',
    villageName: 'Desa Wisata Cikahuripan',
    location: 'Cikahuripan, Lembang',
    rating: 4.8,
    totalReviews: 36,
    sellerName: 'Offroad Bukit Cikahuripan',
    sellerBadge: 'Driver Pemandu Alam',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6282219405566',
    image: '/images/unsplash/photo-1509316975850-ff9c5deb0cd9_w800.jpg',
    gallery: ['/images/unsplash/photo-1509316975850-ff9c5deb0cd9_w800.jpg'],
    description: 'Jelajah rute offroad perkebunan lemon, kebun teh tersembunyi, dan lembah hijau asri Cikahuripan dengan mobil jeep 4x4 tangguh.',
    highlights: ['Jalur Perkebunan & Perbukitan Sejuk', 'Singgah di Kebun Lemon Petik Langsung', 'Dokumentasi Foto Aksi Offroad'],
    stockQuota: 10,
    isAvailable: true
  },
  {
    id: 'prod-wisata-k03',
    title: 'Tiket Wahana & Spot Wisata Alam Panorama Cikahuripan',
    category: 'wisata-alam',
    price: 25000,
    unit: '/orang',
    villageId: 'des-06',
    villageName: 'Desa Wisata Cikahuripan',
    location: 'Cikahuripan, Lembang',
    rating: 4.8,
    totalReviews: 29,
    sellerName: 'Wahana Alam Cikahuripan',
    sellerBadge: 'Pengelola Destinasi',
    sellerAvatar: '/images/default-avatar.svg',
    sellerPhone: '+6282219405566',
    image: '/images/unsplash/photo-1464822759023-fed622ff2c3b_w800.jpg',
    gallery: ['/images/unsplash/photo-1464822759023-fed622ff2c3b_w800.jpg'],
    description: 'Tiket masuk spot gardu pandang bukit Cikahuripan include wahana ayunan langit dan spot foto latar pegunungan Lembang.',
    highlights: ['Gardu Pandang Pegunungan', 'Ayunan Langit Panorama', 'Udara Segar Alami Bebas Polusi'],
    stockQuota: 80,
    isAvailable: true
  },

];

// Initial products catalog (100% Real client data; mock products hidden)
export const INITIAL_PRODUCTS: Product[] = [
  ...REAL_PRODUCTS
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'real-wangunsari-tahu-susu',
    authorName: 'Rian Prasetya',
    authorAvatar: '/images/default-avatar.svg',
    rating: 5,
    date: '2 hari lalu',
    comment: 'Tahu susu Wangunsari super lembut lumer di dalam dan gurihnya pas banget! Sangat cocok untuk oleh-oleh khas Lembang.',
    userRole: 'Wisatawan Asal Jakarta'
  },
  {
    id: 'rev-02',
    productId: 'real-suntenjaya-kopi-angling',
    authorName: 'Budi Kurniawan',
    authorAvatar: '/images/default-avatar.svg',
    rating: 5,
    date: '3 hari lalu',
    comment: 'Kopi Arabika Suntenjaya karakternya harum floral dan manis karamel. Luar biasa kualitas kopi petani Lembang!',
    userRole: 'Pencinta Kopi Asal Bandung'
  },
  {
    id: 'rev-03',
    productId: 'real-cikole-offroad-landrover-abah',
    authorName: 'Siti Rahmawati',
    authorAvatar: '/images/default-avatar.svg',
    rating: 5,
    date: '1 minggu lalu',
    comment: 'Offroad Sukawana Cikole bareng Land Rover Abah seru luar biasa menembus jalur lumpur hutan pinus. Pemandu ramah dan profesional!',
    userRole: 'Wisatawan Asal Tangerang'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-2026-001',
    customerName: 'Anisa Dian',
    customerEmail: 'anisa@example.com',
    customerPhone: '+6281234112233',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 2
      },
      {
        product: INITIAL_PRODUCTS[1],
        quantity: 3
      }
    ],
    totalAmount: 124000,
    paymentMethod: 'WhatsApp Fast Checkout',
    status: 'diproses',
    createdAt: '02 Sep 2026, 09:30',
    notes: 'Mohon dikirim pagi jam 08.00 WIB'
  }
];
