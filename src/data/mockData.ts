import { Village, Product, Review, Order } from '../types';

export const INITIAL_VILLAGES: Village[] = [
  {
    id: 'des-01',
    name: 'Desa Wisata Suntenjaya',
    location: 'Kec. Lembang, Kab. Bandung Barat',
    province: 'Jawa Barat',
    rating: 4.9,
    totalReviews: 284,
    description: 'Desa Suntenjaya menawarkan keindahan lanskap pegunungan yang asri, udara sejuk, serta budaya masyarakat lokal yang otentik. Menjadi destinasi unggulan untuk melepas penat di Kabupaten Bandung Barat.',
    history: 'Desa Suntenjaya bermula dari perkampungan agraris subur di lereng Gunung Palasari, Gunung Manglayang, dan Bukit Tunggul pada ketinggian 1.290 mdpl. Merupakan hasil pemekaran dari Desa Cibodas pada tahun 1979, Suntenjaya kini tumbuh sebagai Desa Mandiri berprestasi yang harmonis menjaga kearifan alam dan budaya Sunda.',
    culture: 'Masyarakat menjunjung kearifan budaya Sunda, pelestarian Situs Bersejarah Batu Loceng, balap kereta kayu tradisional Kadaplak, seni tari Jaipong & Calung, serta tradisi gotong royong peternak sapi perah dan petani sayur organik.',
    highlights: [
      'Situs Bersejarah Batu Loceng',
      'Edukasi Kopi Arabika Suntenjaya',
      'Wisata Sapi Perah Murni Lembang',
      'Live-in Kampung Pasir Angling',
      'Taman Bincarung & Bukit Tunggul',
      'Agrowisata Petik Sayur Organik'
    ],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
    ],
    mapLocation: 'Jl. Maribaya Timur KM. 13,5, Desa Suntenjaya, Kec. Lembang, Kab. Bandung Barat, Jawa Barat 40391',
    contactPhone: '+62 812-2076-3734',
    instagram: '@sabasunten.id',
    managerName: 'Kang Asep Suhendar (Pokdarwis Saba Sunten)',
    totalListings: 16,
    // Data Resmi Pemerintah Desa Suntenjaya (sinkron desasuntenjaya.site)
    headOfVillage: 'H. Asep Wahyono',
    villageSecretary: 'Iwan Setiawan',
    villageArea: '845 Ha',
    population: '12.450 Jiwa',
    dusunCount: 4,
    vision: 'Terwujudnya Desa Suntenjaya yang Mandiri, Sejahtera, Berbudaya, dan Berbasis Digital Terdepan di Kabupaten Bandung Barat.',
    missions: [
      'Meningkatkan kualitas pelayanan publik melalui digitalisasi.',
      'Mendorong pertumbuhan ekonomi kerakyatan dan UMKM.',
      'Melestarikan seni dan budaya lokal Sunda.',
      'Meningkatkan pembangunan infrastruktur desa yang merata.'
    ],
    silamotUrl: 'https://desasuntenjaya.site',
    officeAddress: 'Jl. Maribaya Timur KM. 13,5, Desa Suntenjaya, Kec. Lembang, Kab. Bandung Barat 40391',
    dusuns: [
      {
        id: 'dusun-1',
        name: 'Dusun I - Pasir Angling',
        kadus: 'Hilman Nugraha',
        description: 'Wilayah tertinggi dengan panorama pemandangan pegunungan Lembang dan Bandung Raya yang sejuk dan asri.',
        highlights: 'Homestay Pasir Angling, Pertanian Sayur Organik, Spot Sunrise'
      },
      {
        id: 'dusun-2',
        name: 'Dusun II - Batu Loceng',
        kadus: 'Kiki Andrian',
        description: 'Pusat cagar budaya Sunda kuno dan sentra perkebunan Kopi Arabika Single Origin lereng pegunungan.',
        highlights: 'Situs Bersejarah Batu Loceng, Kebun Kopi Arabika, Saung Bambu'
      },
      {
        id: 'dusun-3',
        name: 'Dusun III - Cikawari & Bincarung',
        kadus: 'Vicky Permana Putra',
        description: 'Kawasan konservasi hutan pinus dan sentra peternakan sapi perah penghasil susu murni berkualitas.',
        highlights: 'Hutan Pinus Taman Bincarung, Peternakan Sapi Perah KPSBU, Camping Ground'
      },
      {
        id: 'dusun-4',
        name: 'Dusun IV - Suntenjaya Pusat',
        kadus: 'Sandi Agustin E.P.',
        description: 'Pusat administrasi pemerintahan desa dan sentra kerajinan tradisional balap kayu Kadaplak.',
        highlights: 'Kantor Desa & Layanan SILAMOT, Pengrajin Kadaplak, UMKM Olahan Susu'
      }
    ],
    villageApparatus: [
      { role: 'Kepala Desa', name: 'H. Asep Wahyono' },
      { role: 'Sekretaris Desa', name: 'Iwan Setiawan' },
      { role: 'Kaur Perencanaan', name: 'Fajar Risdiana' },
      { role: 'Kaur Keuangan', name: 'Kania Puspitasari' },
      { role: 'Kaur Tata Usaha & Umum', name: 'Rony Fasyrah' },
      { role: 'Kasi Pemerintahan Desa', name: 'Rahmat S. M.' },
      { role: 'Kasi Pelayanan Desa', name: 'Tiarawati' },
      { role: 'Ketua Pokdarwis Saba Sunten', name: 'Kang Asep Suhendar' }
    ]
  },
  {
    id: 'des-02',
    name: 'Desa Wisata Penglipuran',
    location: 'Kabupaten Bangli, Bali',
    province: 'Bali',
    rating: 4.9,
    totalReviews: 328,
    description: 'Desa adat terbersih di dunia yang terkenal dengan tata ruang arsitektur bambu khas Bali yang lestari dan asri.',
    history: 'Desa Penglipuran telah ada sejak zaman Kerajaan Bangli dan tetap mempertahankan konsep adat Tri Hita Karana.',
    culture: 'Tradisi adat yang memuliakan pelestarian hutan bambu dan ritual tahunan Galungan serta Kuningan.',
    highlights: ['Hutan Bambu Suci 75 Hektar', 'Arsitektur Rumah Tradisional', 'Minuman Khas Loloh Cemcem', 'Seni Kerajinan Bambu'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80'
    ],
    mapLocation: 'Jl. Penglipuran, Kubu, Bangli, Bali 80611',
    contactPhone: '+62 812-3456-7890',
    instagram: '@penglipuran_village',
    managerName: 'I Wayan Suparta (Ketua Pengelola Desa)',
    totalListings: 8
  },
  {
    id: 'des-03',
    name: 'Desa Wisata Nglanggeran',
    location: 'Gunungkidul, DI Yogyakarta',
    province: 'DI Yogyakarta',
    rating: 4.8,
    totalReviews: 245,
    description: 'Desa wisata berbasis konservasi Gunung Api Purba dengan perkebunan kakao, Embung indah, dan tradisi lokal hangat.',
    history: 'Masyarakat Nglanggeran berhasil mentransformasi kawasan perbukitan purba menjadi Juara Desa Wisata Terbaik ASEAN.',
    culture: 'Kesenian Reog, Jathilan, pembuatan olahan cokelat kakao tradisional, dan tradisi kenduri panen.',
    highlights: ['Pendakian Gunung Api Purba', 'Griya Cokelat Nglanggeran', 'Embung Sunset', 'Live-in Homestay Warga'],
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80'
    ],
    mapLocation: 'Nglanggeran, Patuk, Gunungkidul, Yogyakarta 55862',
    contactPhone: '+62 821-9876-5432',
    instagram: '@nglanggeran_village',
    managerName: 'Mas Sugeng (Pokdarwis Nglanggeran)',
    totalListings: 6
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- HOMESTAY DESA SUNTENJAYA ---
  {
    id: 'prod-01',
    title: 'Homestay Saung Pasir Angling Suntenjaya',
    category: 'homestay',
    price: 250000,
    originalPrice: 320000,
    unit: '/malam',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 4.9,
    totalReviews: 52,
    sellerName: 'Kang Dadang & Keluarga',
    sellerBadge: 'Tuan Rumah Ramah Desa',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Homestay kayu bernuansa Sunda otentik di Kampung Pasir Angling, Desa Suntenjaya pada ketinggian 1.290 mdpl. Menikmati sejuknya udara pegunungan, pemandangan kebun sayur terasering, serta sarapan nasi liwet khas Sunda dan susu sapi perah segar.',
    highlights: [
      'Udara Sangat Sejuk 17-20°C',
      'Sarapan Nasi Liwet & Susu Segar',
      'Pemandangan Kebun & Lereng Palasari',
      'Akses Langsung ke Kebun Kopi & Sayur'
    ],
    facilities: ['Kamar Mandi Dalam Air Panas', 'Kasur Nyaman Queen Bed', 'WiFi Cepat', 'Sarapan Khas Sunda', 'Kopi Arabika Suntenjaya Gratis', 'Parkir Aman'],
    stockQuota: 5,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-02',
    title: 'Griya Palasari Mountain View Lodge',
    category: 'homestay',
    price: 320000,
    originalPrice: 400000,
    unit: '/malam',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 4.9,
    totalReviews: 39,
    sellerName: 'Ibu Nenden Suntenjaya',
    sellerBadge: 'Homestay Binaan Pokdarwis',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Penginapan keluarga luas berlatar belakang panorama Gunung Palasari dan Gunung Manglayang. Sangat cocok untuk healing dan melepas penat bersama keluarga tercinta.',
    highlights: ['Balkon Panoramic Gunung', 'Water Heater', 'Area Api Unggun Malam', 'Welcome Drink Teh Daun Kopi'],
    facilities: ['2 Bed King Size', 'Kamar Mandi Air Hangat', 'Dapur Bersama', 'Balkon View Gunung', 'WiFi', 'Area Parkir Luas'],
    stockQuota: 3,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-03',
    title: 'Saung Bambu Batu Loceng Eco-Stay',
    category: 'homestay',
    price: 220000,
    unit: '/malam',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 4.8,
    totalReviews: 27,
    sellerName: 'Pak Dedi Batu Loceng',
    sellerBadge: 'Pengelola Homestay Adat',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Bilik saung bambu alami dekat dengan kawasan Situs Budaya Batu Loceng. Rasakan suasana hening khas pedesaan Sunda dan suara gemericik air pegunungan yang menenangkan.',
    highlights: ['Dekat Situs Sejarah Batu Loceng', 'Suasana Sejuk Tenang', 'Termasuk Sarapan Tradisional'],
    facilities: ['Kamar Bersih & Nyaman', 'Kamar Mandi Bersih', 'Sarapan Surabi & Teh Hangat', 'Spot Api Unggun'],
    stockQuota: 4,
    isAvailable: true
  },

  // --- PAKET WISATA & EDUKASI SUNTENJAYA ---
  {
    id: 'prod-04',
    title: 'Paket Live-In Edukasi Pasir Angling (2 Hari 1 Malam)',
    category: 'paket-wisata',
    price: 350000,
    originalPrice: 420000,
    unit: '/orang',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 5.0,
    totalReviews: 76,
    sellerName: 'Pokdarwis Saba Sunten',
    sellerBadge: 'Pemandu Resmi Desa Suntenjaya',
    sellerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pengalaman autentik tinggal bersama keluarga warga Desa Suntenjaya. Wisatawan diajak memerah susu sapi perah di pagi hari, memetik sayuran organik langsung di ladang terasering, serta memproses biji kopi Arabika khas Pasir Angling.',
    highlights: [
      'Edukasi Perah Susu Sapi Segar',
      'Petik Sayur Organik Bawa Pulang',
      'Workshop Kopi Arabika Suntenjaya',
      'Makan Liwet Tampah Bareng Warga',
      'Menginap 1 Malam di Homestay Warga'
    ],
    itinerary: [
      { time: 'Hari 1 - 13:00', activity: 'Tiba di Sekretariat Saba Sunten, Welcome Drink Susu Segar & Check-in Homestay' },
      { time: 'Hari 1 - 14:30', activity: 'Jelajah Agrowisata & Praktik Petik Sayur Organik di Ladang Warga' },
      { time: 'Hari 1 - 16:30', activity: 'Workshop Edukasi Kopi Arabika Pasir Angling (Roasting & Cupping)' },
      { time: 'Hari 1 - 19:00', activity: 'Makan Malam Liwet Kastrol khas Sunda & Api Unggun' },
      { time: 'Hari 2 - 06:00', activity: 'Edukasi Praktik Memerah Susu Sapi Perah di Kandang Peternak Warga' },
      { time: 'Hari 2 - 08:30', activity: 'Sarapan Pagi, Pembagian Hasil Panen Sayur & Sayonara' }
    ],
    facilities: ['Akomodasi Homestay 1 Malam', 'Makan 3x (Liwet Tradisional)', 'Sayur Organik 2kg Bawa Pulang', 'Kopi Arabika Sample Pack', 'Guide Lokal', 'Asuransi'],
    stockQuota: 25,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-05',
    title: 'Trekking Situs Batu Loceng & Hutan Pinus Bincarung',
    category: 'paket-wisata',
    price: 95000,
    originalPrice: 120000,
    unit: '/orang',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 4.9,
    totalReviews: 48,
    sellerName: 'Komunitas Pemandu Batu Loceng',
    sellerBadge: 'Pemandu Budaya Terdaftar',
    sellerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Eksplorasi situs sejarah megalitikum Batu Loceng di Kampung Batu Loceng, napak tilas sejarah leluhur desa, mencoba permainan tradisional Sunda Kadaplak, dan menyusuri hutan pinus sejuk Taman Bincarung.',
    highlights: ['Pemandu Cerita Sejarah Situs', 'Mencoba Permainan Kadaplak', 'Foto Spot Hutan Pinus Bincarung', 'Snack & Kopi Tradisional'],
    itinerary: [
      { time: '08:30', activity: 'Kumpul di Gapura Situs Batu Loceng & Doa Pembuka' },
      { time: '09:00 - 10:30', activity: 'Eksplorasi Situs Batu Loceng & Mengenal Tradisi Sunda' },
      { time: '10:30 - 11:30', activity: 'Permainan Tradisional Kadaplak & Games Seru' },
      { time: '11:30 - 13:00', activity: 'Trekking Hutan Pinus Taman Bincarung & Rehat Kopi/Bandrek' }
    ],
    facilities: ['Tiket Masuk Semua Lokasi', 'Pemandu Sejarah', 'Kopi Arabika / Bandrek Hangat', 'Rebusan Ubi & Jagung Manis'],
    stockQuota: 30,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-06',
    title: 'Edukasi Kopi Arabika Suntenjaya & Barista Tani',
    category: 'paket-wisata',
    price: 125000,
    unit: '/orang',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 4.8,
    totalReviews: 34,
    sellerName: 'Kelompok Tani Kopi Pasir Angling',
    sellerBadge: 'Petani Kopi Juara',
    sellerAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Belajar proses dari biji hingga cangkir (bean to cup) kopi Arabika yang tumbuh di lereng Gunung Palasari 1.290 mdpl. Termasuk praktik roasting manual di atas wajan tanah liat dan teknik manual brew V60.',
    highlights: ['Petik Ceri Kopi Merah', 'Roasting Tradisional Wajan Tanah', 'Seduh Manual V60 & Cupping', 'Bawa Pulang Kopi 100g'],
    stockQuota: 20,
    isAvailable: true
  },

  // --- KULINER & PRODUK KHAS SUNTENJAYA ---
  {
    id: 'prod-07',
    title: 'Kopi Arabika Suntenjaya Single Origin (250g)',
    category: 'kuliner',
    price: 75000,
    originalPrice: 90000,
    unit: '/pouch',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 5.0,
    totalReviews: 88,
    sellerName: 'Koperasi Kopi Pasir Angling',
    sellerBadge: 'UMKM Unggulan Suntenjaya',
    sellerAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Kopi Arabika spesialti hasil panen petani Pasir Angling Desa Suntenjaya di ketinggian 1.290 mdpl. Memiliki citarasa asam buah yang lembut (fruity notes), aroma karamel manis, dan aftertaste yang bersih.',
    highlights: ['100% Arabika Lereng Palasari', 'Medium Roast Fresh', 'Tersedia Biji / Bubuk Halus'],
    stockQuota: 45,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-08',
    title: 'Susu Sapi Segar Murni Suntenjaya Lembang (1 Liter)',
    category: 'kuliner',
    price: 18000,
    unit: '/botol',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 4.9,
    totalReviews: 64,
    sellerName: 'Kelompok Peternak Sapi Suntenjaya',
    sellerBadge: 'Peternak Sapi Mandiri',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Susu murni segar hasil perahan langsung peternak sapi Desa Suntenjaya Lembang. Dipasteurisasi higienis tanpa tambahan air dan tanpa bahan pengawet.',
    highlights: ['100% Susu Murni Segar', 'Kaya Kalsium & Nutrisi Alami', 'Pasteurisasi Higienis'],
    stockQuota: 60,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-09',
    title: 'Yoghurt Probiotik Khas Desa Suntenjaya (500ml)',
    category: 'kuliner',
    price: 28000,
    unit: '/botol',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 4.9,
    totalReviews: 41,
    sellerName: 'Olahan Susu Mandiri Suntenjaya',
    sellerBadge: 'UMKM Binaan Desa',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Yoghurt fermentasi kental dari susu sapi murni Desa Suntenjaya dengan sari buah stroberi dan mangga asli. Asam segar alami dan menyehatkan pencernaan.',
    highlights: ['Bakteri Probiotik Baik', 'Tanpa Pemanis Buatan', 'Varian Stroberi & Original'],
    stockQuota: 35,
    isAvailable: true
  },

  // --- PRODUK UMKM TANI ORGANIK SUNTENJAYA ---
  {
    id: 'prod-10',
    title: 'Paket Sayuran Organik Segar Pasir Angling (Box 3kg)',
    category: 'umkm',
    price: 55000,
    originalPrice: 65000,
    unit: '/box',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 5.0,
    totalReviews: 92,
    sellerName: 'Kelompok Tani Sayur Organik Suntenjaya',
    sellerBadge: 'Pertanian Bersertifikat Organik',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Paket aneka sayuran segar dipetik langsung saat order: Brokoli hijau, Pakcoy mini, Wortel manis Lembang, Tomat Cherry segar, dan Selada Air. Ditanam tanpa pestisida kimia di tanah vulkanik subur.',
    highlights: ['Dipetik Pagi Hari Pengiriman', '100% Bebas Pestisida Kimia', 'Isi Box 5 Macam Sayuran'],
    stockQuota: 30,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-11',
    title: 'Keripik Bayam & Rempeyek Gurih Ibu-ibu Desa (Pack 200g)',
    category: 'umkm',
    price: 20000,
    unit: '/pack',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 4.8,
    totalReviews: 36,
    sellerName: 'KWT (Kelompok Wanita Tani) Suntenjaya',
    sellerBadge: 'Ibu-Ibu Berdaya',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Camilan renyah gurih olahan daun bayam organik petik kebun warga dengan bumbu rempah Sunda warisan leluhur. Renyah, tidak berminyak, dan sangat gurih.',
    highlights: ['Renyah & Gurih Alami', 'Tanpa Bahan Pengawet', 'Kemasan Klip Kedap Udara'],
    stockQuota: 50,
    isAvailable: true
  },

  // --- TIKET & DESTINASI WISATA SUNTENJAYA ---
  {
    id: 'prod-12',
    title: 'Tiket Wisata Alam Taman Bincarung & Camping Spot',
    category: 'destinasi',
    price: 20000,
    unit: '/orang',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 4.8,
    totalReviews: 73,
    sellerName: 'BUMDes Karya Mandiri Suntenjaya',
    sellerBadge: 'Official Ticket Saba Sunten',
    sellerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tiket masuk ke spot wisata alam Taman Bincarung Desa Suntenjaya. Menikmati hutan pinus yang tenang, pemandangan lembah hijau, serta area bersantai keluarga.',
    highlights: ['Akses Hutan Pinus', 'Spot Foto Instagramable', 'Area Hammock & Gazebo'],
    stockQuota: 200,
    isAvailable: true
  },
  {
    id: 'prod-13',
    title: 'Miniatur Kadaplak & Kerajinan Bambu Pasir Angling',
    category: 'suvenir',
    price: 65000,
    originalPrice: 80000,
    unit: '/pcs',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 4.9,
    totalReviews: 29,
    sellerName: 'Pengrajin Seni Sunda Suntenjaya',
    sellerBadge: 'Pengrajin Lokal Asli',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282122334455',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Souvenir miniatur Kadaplak (permainan papan luncur kayu tradisional Sunda yang legendaris di Desa Suntenjaya) dan hiasan anyaman bambu petung buatan pengrajin desa.',
    highlights: ['Kerajinan Tangan Kayu & Bambu', 'Ikon Permainan Tradisional Kadaplak', 'Finishing Halus & Ramah Lingkungan'],
    stockQuota: 20,
    isAvailable: true
  },

  // --- PRODUK DARI DESA MITRA ---
  {
    id: 'prod-14',
    title: 'Tas Anyaman Bambu Penglipuran Petung',
    category: 'suvenir',
    price: 145000,
    unit: '/pcs',
    villageId: 'des-02',
    villageName: 'Desa Wisata Penglipuran',
    location: 'Bangli, Bali',
    rating: 4.8,
    totalReviews: 31,
    sellerName: 'Koperasi Bambu Penglipuran',
    sellerBadge: 'Pengrajin Mitra',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281234567890',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tas etnik anyaman bambu petung pilihan khas desa adat Penglipuran.',
    highlights: ['Anyaman Tangan Rapi', 'Strap Kulit Sintetis'],
    stockQuota: 10,
    isAvailable: true
  },
  {
    id: 'prod-15',
    title: 'Kain Batik Tulis Motif Alam Nglanggeran',
    category: 'suvenir',
    price: 325000,
    unit: '/pcs',
    villageId: 'des-03',
    villageName: 'Desa Wisata Nglanggeran',
    location: 'Gunungkidul, Yogyakarta',
    rating: 5.0,
    totalReviews: 18,
    sellerName: 'Sanggar Batik Ibu Sri',
    sellerBadge: 'Pengrajin Batik Mitra',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282198765432',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Kain batik tulis halus katun primisima dengan pewarna alam ramah lingkungan.',
    highlights: ['100% Batik Tulis Manual', 'Pewarna Alam'],
    stockQuota: 8,
    isAvailable: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-04',
    authorName: 'Rian Prasetya',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2 hari lalu',
    comment: 'Pengalaman Live-in di Kampung Pasir Angling Suntenjaya berkesan banget! Udaranya dingin sejuk, anak-anak senang sekali belajar perah susu sapi segar langsung dari peternak, dan makan liwetnya nikmat luar biasa.',
    userRole: 'Wisatawan Asal Jakarta'
  },
  {
    id: 'rev-02',
    productId: 'prod-07',
    authorName: 'Budi Kurniawan',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '3 hari lalu',
    comment: 'Kopi Arabika Suntenjaya karakternya sangat harum, ada wangi floral dan manis karamel. Bangga bisa beli langsung dari petani desa lewat website sabasunten.id ini!',
    userRole: 'Pencinta Kopi Asal Bandung'
  },
  {
    id: 'rev-03',
    productId: 'prod-01',
    authorName: 'Siti Rahmawati',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '1 minggu lalu',
    comment: 'Homestay Saung Pasir Angling bersih, air hangatnya lancar, dan pemandangan paginya berkabut indah banget. Tuan rumah Kang Dadang sekeluarga sangat ramah melayani kami.',
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
        quantity: 1,
        bookingDateStart: '2026-08-28',
        bookingDateEnd: '2026-08-30',
        guestCount: 2,
        notes: 'Minta sarapan nasi liwet hangat jam 07.00 WIB'
      }
    ],
    totalAmount: 505000,
    paymentMethod: 'QRIS Instant',
    status: 'diproses',
    createdAt: '24 Aug 2026, 09:30',
    notes: 'Pemesan minta jam check-in sekitar 14.00 WIB di Pasir Angling'
  },
  {
    id: 'ORD-2026-002',
    customerName: 'Fajar Hendra',
    customerEmail: 'fajar@example.com',
    customerPhone: '+6285678901234',
    items: [
      {
        product: INITIAL_PRODUCTS[6],
        quantity: 2
      },
      {
        product: INITIAL_PRODUCTS[9],
        quantity: 1
      }
    ],
    totalAmount: 210000,
    paymentMethod: 'Transfer BCA',
    status: 'selesai',
    createdAt: '22 Aug 2026, 16:15'
  }
];
