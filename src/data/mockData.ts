import { Village, Product, Review, Order } from '../types';

export const INITIAL_VILLAGES: Village[] = [
  {
    id: 'des-01',
    name: 'Desa Wisata Penglipuran',
    location: 'Kabupaten Bangli, Bali',
    province: 'Bali',
    rating: 4.9,
    totalReviews: 328,
    description: 'Desa adat terbersih di dunia yang terkenal dengan tata ruang arsitektur bambu khas Bali yang lestari dan asri.',
    history: 'Desa Penglipuran telah ada sejak zaman Kerajaan Bangli dan tetap mempertahankan konsep adat Tri Hita Karana dalam setiap jengkal bangunannya.',
    culture: 'Tradisi adat yang memuliakan pelestarian hutan bambu dan ritual tahunan Galungan serta Kuningan yang penuh warna.',
    highlights: ['Hutan Bambu Suci 75 Hektar', 'Arursitektur Rumah Tradisional', 'Minuman Khas Loloh Cemcem', 'Seni Kerajinan Bambu'],
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'
    ],
    mapLocation: 'Jl. Penglipuran, Kubu, Bangli, Bali 80611',
    contactPhone: '+62 812-3456-7890',
    instagram: '@penglipuran_village',
    managerName: 'I Wayan Suparta (Ketua Pengelola Desa)',
    totalListings: 14
  },
  {
    id: 'des-02',
    name: 'Desa Wisata Nglanggeran',
    location: 'Gunungkidul, DI Yogyakarta',
    province: 'DI Yogyakarta',
    rating: 4.8,
    totalReviews: 245,
    description: 'Desa wisata berbasis konservasi Gunung Api Purba dengan perkebunan kakao, Embung indah, dan tradisi lokal hangat.',
    history: 'Dulu daerah perbukitan berbatu, masyarakat Nglanggeran berhasil mentransformasi desa menjadi Juara Desa Wisata Terbaik ASEAN.',
    culture: 'Kesenian Reog, Jathilan, pembuatan olahan cokelat kakao tradisional, dan tradisi kenduri panen.',
    highlights: ['Pendakian Gunung Api Purba', 'Griya Cokelat Nglanggeran', 'Embung Nglanggeran Sunset', 'Live-in Homestay Warga'],
    image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=800&q=80'
    ],
    mapLocation: 'Nglanggeran, Patuk, Gunungkidul, Yogyakarta 55862',
    contactPhone: '+62 821-9876-5432',
    instagram: '@nglanggeran_village',
    managerName: 'Mas Sugeng (Kelompok Sadar Wisata)',
    totalListings: 18
  },
  {
    id: 'des-03',
    name: 'Desa Wisata Pentingsari',
    location: 'Sleman, DI Yogyakarta',
    province: 'DI Yogyakarta',
    rating: 4.8,
    totalReviews: 198,
    description: 'Desa ramah lingkungan di lereng Gunung Merapi dengan keunggulan pembelajaran budaya, membatik, dan bertani.',
    history: 'Berdiri sejak tahun 2008 mengusung konsep pemberdayaan masyarakat lokal secara mandiri dan edukatif.',
    culture: 'Workshop Batik Tulis, Karawitan Jawa, Jamu Tradisional, dan bajak sawah bersama kerbau.',
    highlights: ['Pengalaman Membajak Sawah', 'Workshop Membatik Motif Desa', 'Susur Sungai Kuno', 'Kuliner Nasi Megono'],
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
    ],
    mapLocation: 'Pentingsari, Umbulharjo, Cangkringan, Sleman, Yogyakarta',
    contactPhone: '+62 813-2211-4455',
    instagram: '@pentingsari_desawisata',
    managerName: 'Pak Dwi (Pokdarwis Pentingsari)',
    totalListings: 12
  },
  {
    id: 'des-04',
    name: 'Desa Wisata Pujon Kidul',
    location: 'Malang, Jawa Timur',
    province: 'Jawa Timur',
    rating: 4.7,
    totalReviews: 210,
    description: 'Desa wisata pertanian modern di perbukitan Malang dengan ikon Cafe Sawah, peternakan sapi perah, dan apel segar.',
    history: 'BUMDes Desa Pujon Kidul berhasil mengubah lahan pertanian warga menjadi destinasi eduwisata kuliner ikonik Jawa Timur.',
    culture: 'Pertanian sayur organik, pemerasan susu sapi segar, dan tarian tradisional Reog Malang.',
    highlights: ['Cafe Sawah Pujon', 'Petik Apel & Sayur Organik', 'Wisata Sapi Perah', 'ATV & Offroad Sawah'],
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    mapLocation: 'Pujon Kidul, Kec. Pujon, Kabupaten Malang, Jawa Timur',
    contactPhone: '+62 857-1122-3344',
    instagram: '@pujonkidul_official',
    managerName: 'Pak Udik (BUMDes Pujon)',
    totalListings: 15
  },
  {
    id: 'des-05',
    name: 'Desa Wisata Wae Rebo',
    location: 'Manggarai Barat, NTT',
    province: 'Nusa Tenggara Timur',
    rating: 4.9,
    totalReviews: 180,
    description: 'Desa adat di atas awan Flores dengan rumah adat Mbaru Niang yang mendapat Penghargaan Warisan Budaya UNESCO.',
    history: 'Telah dihuni selama 18 generasi, terisolasi indah di lembah pegunungan Flores dengan kelestarian tradisi utuh.',
    culture: 'Upacara adat Penti, kopi Flores olahan tangan, tarian Caci, dan kehangatan malam bersama warga desa.',
    highlights: ['Rumah Adat Mbaru Niang', 'Kopi Spesialti Wae Rebo', 'Trekking Lembah Hijau', 'Upacara Sambutan Warga'],
    image: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=800&q=80'
    ],
    mapLocation: 'Satar Lenda, Kec. Satarmese Barat, Kab. Manggarai Barat, NTT',
    contactPhone: '+62 812-9988-7766',
    instagram: '@waerebo_village',
    managerName: 'Tetua Adat Bapa Martinus',
    totalListings: 8
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- HOMESTAY ---
  {
    id: 'prod-01',
    title: 'Homestay Bamboo Asri Penglipuran',
    category: 'homestay',
    price: 350000,
    originalPrice: 450000,
    unit: '/malam',
    villageId: 'des-01',
    villageName: 'Desa Wisata Penglipuran',
    location: 'Bangli, Bali',
    rating: 4.9,
    totalReviews: 48,
    sellerName: 'I Wayan Suparta',
    sellerBadge: 'Tuan Rumah Teladan',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281234567890',
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Kamar homestay bergaya arsitektur bambu Bali otentik di tengah pemukiman adat Penglipuran. Nikmati suasana tenang, sarapan kue tradisional khas Bali, serta akses langsung menuju Hutan Bambu Suci.',
    highlights: ['Sarapan Khas Bali', 'Free Hutan Bambu Tour', 'WiFi Cepat', 'Kamar Mandi Dalam bersih'],
    facilities: ['Kasur King Size', 'Kamar Mandi Dalam', 'Air Panas', 'WiFi 50Mbps', 'Sarapan Tampah Bali', 'Handuk & Alat Mandi'],
    stockQuota: 4,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-02',
    title: 'Griya Joglo Gunung Purba Homestay',
    category: 'homestay',
    price: 280000,
    originalPrice: 350000,
    unit: '/malam',
    villageId: 'des-02',
    villageName: 'Desa Wisata Nglanggeran',
    location: 'Gunungkidul, DI Yogyakarta',
    rating: 4.8,
    totalReviews: 36,
    sellerName: 'Pak Sugeng Widodo',
    sellerBadge: 'Pengelola Pokdarwis',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282198765432',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Rumah Joglo kayu jati asli berumur 60 tahun dengan latar belakang pemandangan tebing Gunung Api Purba Nglanggeran. Udara sejuk pedesaan khas Gunungkidul.',
    highlights: ['View Gunung Purba', 'Welcome Drink Es Cokelat Kakao', 'Teras Luas', 'Parkir Mobil Aman'],
    facilities: ['2 Bed Utuh', 'Kamar Mandi Bersih', 'Teh/Kopi Bebas', 'WiFi Akses', 'Area Api Unggun'],
    stockQuota: 3,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-03',
    title: 'Homestay Live-In Joglo Pentingsari',
    category: 'homestay',
    price: 220000,
    unit: '/malam',
    villageId: 'des-03',
    villageName: 'Desa Wisata Pentingsari',
    location: 'Sleman, DI Yogyakarta',
    rating: 4.9,
    totalReviews: 29,
    sellerName: 'Ibu Maryati',
    sellerBadge: 'Induk Homestay Ramah',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281322114455',
    image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Homestay keluarga Jawa ramah di lereng Merapi. Termasuk makan malam hangat masakan rumahan Ibu Maryati seperti Sayur Lodeh dan Ayam Goreng Kampung.',
    highlights: ['Makan Rumah 2x', 'Suasana Keluarga Jawa', 'Belajar Jamu Tradisional'],
    facilities: ['Kamar Rapi', 'Sarapan & Makan Malam', 'Kipas Angin', 'Parkir Luas'],
    stockQuota: 5,
    isAvailable: true
  },

  // --- PAKET WISATA ---
  {
    id: 'prod-04',
    title: 'Paket Sunset Embung & Trekking Gunung Purba',
    category: 'paket-wisata',
    price: 185000,
    originalPrice: 220000,
    unit: '/orang',
    villageId: 'des-02',
    villageName: 'Desa Wisata Nglanggeran',
    location: 'Gunungkidul, Yogyakarta',
    rating: 4.9,
    totalReviews: 62,
    sellerName: 'Pokdarwis Nglanggeran',
    sellerBadge: 'Pemandu Resmi Desa',
    sellerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282198765432',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Petualangan sehari penuh mengeksplor puncaknya Gunung Api Purba Nglanggeran, belajar pengolahan cokelat di Griya Cokelat, dan menikmati pemandangan matahari terbenam di Embung Nglanggeran.',
    highlights: ['Trekking Puncak Gunung', 'Edukasi Kebun Kakao', 'Sunset Embung Nglanggeran', 'Makan Siang Nasi Liwet'],
    itinerary: [
      { time: '08:00', activity: 'Kumpul di Sekretariat Pokdarwis & Briefing' },
      { time: '08:30 - 11:30', activity: 'Pendakian Gunung Api Purba & Puncak Pos 5' },
      { time: '12:00 - 13:00', activity: 'Makan Siang Nasi Liwet Tampah Desa' },
      { time: '13:30 - 15:30', activity: 'Kunjungan Kebun Kakao & Workshop Cokelat' },
      { time: '16:00 - 18:00', activity: 'Nikmati Sunset di Embung Nglanggeran & Kopi' }
    ],
    facilities: ['Lokal Guide Pengalaman', 'Tiket Masuk All Object', 'Makan Siang Liwet', 'Snack Cokelat Desa', 'Asuransi Wisata'],
    stockQuota: 20,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-05',
    title: 'Paket Edukasi Membatik & Bajak Sawah (2 Hari 1 Malam)',
    category: 'paket-wisata',
    price: 450000,
    unit: '/orang',
    villageId: 'des-03',
    villageName: 'Desa Wisata Pentingsari',
    location: 'Sleman, Yogyakarta',
    rating: 4.8,
    totalReviews: 42,
    sellerName: 'Pak Dwi & Tim Pokdarwis',
    sellerBadge: 'Sertifikasi Kemenparekraf',
    sellerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281322114455',
    image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pengalaman immersive tinggal bersama warga desa, belajar canting batik tulis buatan sendiri yang bisa dibawa pulang, serta pengalaman membajak sawah tradisional dengan kerbau.',
    highlights: ['Kain Batik Hasil Sendiri', 'Bajak Sawah Kerbau', 'Menginap 1 Malam', 'Seni Karawitan Jawa'],
    itinerary: [
      { time: 'Hari 1 - 14:00', activity: 'Check-in Homestay & Welcome Jamu Beras Kencur' },
      { time: 'Hari 1 - 15:30', activity: 'Workshop Membatik Tulis dengan Canting' },
      { time: 'Hari 1 - 19:00', activity: 'Makan Malam & Pertunjukan Karawitan' },
      { time: 'Hari 2 - 07:00', activity: 'Aktivitas Membajak Sawah & Tanam Padi' },
      { time: 'Hari 2 - 11:00', activity: 'Mandi Sungai Kuno & Penutupan' }
    ],
    facilities: ['Homestay 1 Malam', 'Makan 3x', 'Peralatan Batik Lengkap', 'Pakaian Sawah Kebaya/Batik', 'Sertifikat Edukasi'],
    stockQuota: 15,
    isAvailable: true,
    isFeatured: true
  },

  // --- SUVENIR & KERAJINAN ---
  {
    id: 'prod-06',
    title: 'Kain Batik Tulis Motif Gunung Nglanggeran',
    category: 'suvenir',
    price: 325000,
    originalPrice: 380000,
    unit: '/pcs',
    villageId: 'des-02',
    villageName: 'Desa Wisata Nglanggeran',
    location: 'Gunungkidul, Yogyakarta',
    rating: 5.0,
    totalReviews: 18,
    sellerName: 'Sanggar Batik Ibu Sri',
    sellerBadge: 'Pengrajin Lokal',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282198765432',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Kain batik tulis halus katun primisima berkualitas tinggi. Diwarnai secara tradisional menggunakan pewarna alam alamiah seperti daun mangga dan kayu mahoni dengan garis khas landscape Gunung Api Purba.',
    highlights: ['100% Batik Tulis Manual', 'Pewarna Alam Ramah Lingkungan', 'Ukuran 2m x 1.15m'],
    stockQuota: 8,
    isAvailable: true
  },
  {
    id: 'prod-07',
    title: 'Tas Anyaman Bambu Handcrafted Penglipuran',
    category: 'suvenir',
    price: 145000,
    unit: '/pcs',
    villageId: 'des-01',
    villageName: 'Desa Wisata Penglipuran',
    location: 'Bangli, Bali',
    rating: 4.8,
    totalReviews: 31,
    sellerName: 'Koperasi Bambu Lestari',
    sellerBadge: 'Pengrajin Bambu Penglipuran',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281234567890',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tas etnik anyaman bambu petung pilihan khas hutan bambu Penglipuran. Awet, ringan, dan elegan untuk fashion sehari-hari maupun jalan-jalan pantai.',
    highlights: ['Anyaman Tangan Rapi', 'Lapisan Anti Jamur Natural', 'Strap Kulit Sintetis Elegan'],
    stockQuota: 12,
    isAvailable: true,
    isFeatured: true
  },

  // --- KULINER LOKAL ---
  {
    id: 'prod-08',
    title: 'Kopi Flores Wae Rebo Arabika Specialty (250g)',
    category: 'kuliner',
    price: 95000,
    originalPrice: 110000,
    unit: '/pouch',
    villageId: 'des-05',
    villageName: 'Desa Wisata Wae Rebo',
    location: 'Manggarai Barat, NTT',
    rating: 5.0,
    totalReviews: 54,
    sellerName: 'Kelompok Tani Kopi Mbaru Niang',
    sellerBadge: 'Produsen Kopi Adat',
    sellerAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281299887766',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Biji kopi organik kualitas ekspor yang ditanam di ketinggian 1.200 MDPL lereng gunung Wae Rebo. Dipetik merah dan sangrai tradisional khas masyarakat Flores.',
    highlights: ['Notes Caramel & Floral', 'Organik Tanpa Pestisida', 'Kemasan Valve Khusus'],
    stockQuota: 30,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-09',
    title: 'Cokelat Batang Kakao Murni Nglanggeran (Pack 5x50g)',
    category: 'kuliner',
    price: 85000,
    unit: '/pack',
    villageId: 'des-02',
    villageName: 'Desa Wisata Nglanggeran',
    location: 'Gunungkidul, Yogyakarta',
    rating: 4.9,
    totalReviews: 38,
    sellerName: 'Griya Cokelat Nglanggeran',
    sellerBadge: 'UMKM Unggulan Desa',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282198765432',
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Olahan cokelat asli peternak kakao desa Nglanggeran dengan kadar kakao 70%. Terdiri dari varian Dark Chocolate, Milk, Ginger Cokelat, dan Cokelat Pisang.',
    highlights: ['Kaya Antioksidan', 'Varian Rasa Unik Lokal', 'Halal & P-IRT Official'],
    stockQuota: 25,
    isAvailable: true
  },
  {
    id: 'prod-10',
    title: 'Minuman Segar Loloh Cemcem Botol (350ml)',
    category: 'kuliner',
    price: 15000,
    unit: '/botol',
    villageId: 'des-01',
    villageName: 'Desa Wisata Penglipuran',
    location: 'Bangli, Bali',
    rating: 4.7,
    totalReviews: 45,
    sellerName: 'Ibu Ni Luh Penglipuran',
    sellerBadge: 'Resep Herbal Leluhur',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281234567890',
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Minuman herbal sehat khas desa Penglipuran dibuat dari remasan daun cemcem segar, asam jawa, gula bali, dan parutan kelapa muda. Asam manis gurih menyegarkan!',
    highlights: ['Menurunkan Tekanan Darah', 'Sangat Menyegarkan', 'Tanpa Bahan Pengawet'],
    stockQuota: 50,
    isAvailable: true
  },

  // --- PRODUK UMKM ---
  {
    id: 'prod-11',
    title: 'Minyak Kelapa Murni (VCO) Tradisional 500ml',
    category: 'umkm',
    price: 65000,
    unit: '/botol',
    villageId: 'des-03',
    villageName: 'Desa Wisata Pentingsari',
    location: 'Sleman, Yogyakarta',
    rating: 4.8,
    totalReviews: 22,
    sellerName: 'Kelompok Wanita Tani Pentingsari',
    sellerBadge: 'UMKM Mandiri',
    sellerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281322114455',
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Virgin Coconut Oil buatan tangan ibu-ibu desa Pentingsari menggunakan kelapa segar lereng Merapi secara perasan dingin (cold pressed). Baik untuk kesehatan tubuh dan kecantikan kulit.',
    highlights: ['100% Virgin Murni', 'Perasan Cold-Pressed', 'Aroma Kelapa Segar Natural'],
    stockQuota: 20,
    isAvailable: true
  },
  {
    id: 'prod-12',
    title: 'Keripik Apel Sawah Organik Pujon (Pack 250g)',
    category: 'umkm',
    price: 35000,
    unit: '/pack',
    villageId: 'des-04',
    villageName: 'Desa Wisata Pujon Kidul',
    location: 'Malang, Jawa Timur',
    rating: 4.9,
    totalReviews: 67,
    sellerName: 'Oleh-oleh Cafe Sawah Malang',
    sellerBadge: 'Penjual Terlaris Pujon',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6285711223344',
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Keripik buah apel Manalagi Malang segar pilihan diproses dengan teknologi vacuum frying tanpa gula tambahan dan tanpa pemanis buatan. Renyah dan gurih manis buah alami.',
    highlights: ['Renyah Tanpa Minyak Berlebih', 'Apel Manalagi Asli Pujon', 'Tanpa Pengawet'],
    stockQuota: 40,
    isAvailable: true
  },

  // --- DESTINASI / TIKET ---
  {
    id: 'prod-13',
    title: 'Tiket Masuk & Voucher Cafe Sawah Pujon Kidul',
    category: 'destinasi',
    price: 25000,
    unit: '/orang',
    villageId: 'des-04',
    villageName: 'Desa Wisata Pujon Kidul',
    location: 'Malang, Jawa Timur',
    rating: 4.7,
    totalReviews: 89,
    sellerName: 'BUMDes Desa Pujon Kidul',
    sellerBadge: 'Official Ticket Desk',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6285711223344',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tiket terusan destinasi Cafe Sawah Pujon Kidul. Sudah termasuk voucher makan & minum senilai Rp 15.000 di gubuk-gubuk saung tengah sawah berlatar pegunungan.',
    highlights: ['Termasuk Voucher Makan', 'Akses Semua Photo Spot', 'Parkir Luas'],
    stockQuota: 100,
    isAvailable: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-01',
    authorName: 'Rian Prasetya',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2 hari lalu',
    comment: 'Pengalaman menginap di Homestay Penglipuran luar biasa! Pak Wayan sangat ramah, sarapan kue balinya enak sekali, dan udara malam desa dingin nan tenang.',
    userRole: 'Wisatawan Asal Jakarta'
  },
  {
    id: 'rev-02',
    productId: 'prod-04',
    authorName: 'Siti Rahmawati',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '1 minggu lalu',
    comment: 'Trekking ke Gunung Api Purba Nglanggeran worth it banget! Mas guide pinter cerita sejarah desa dan sunset di embung bener-bener magis.',
    userRole: 'Wisatawan Asal Bandung'
  },
  {
    id: 'rev-03',
    productId: 'prod-08',
    authorName: 'Budi Kurniawan',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '3 hari lalu',
    comment: 'Kopi Wae Rebo karakternya harum dan khas banget. Dikirim cepat dan packing amannya pakai bubble wrap lapis dua. Nanti mau order lagi.',
    userRole: 'Pencinta Kopi Surabaya'
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
        bookingDateStart: '2026-08-20',
        bookingDateEnd: '2026-08-22',
        guestCount: 2,
        notes: 'Minta sarapan tanpa pedas'
      }
    ],
    totalAmount: 705000,
    paymentMethod: 'QRIS Instant',
    status: 'diproses',
    createdAt: '11 Aug 2026, 09:30',
    notes: 'Pemesan minta jam check-in sekitar 14.00 WITA'
  },
  {
    id: 'ORD-2026-002',
    customerName: 'Fajar Hendra',
    customerEmail: 'fajar@example.com',
    customerPhone: '+6285678901234',
    items: [
      {
        product: INITIAL_PRODUCTS[3],
        quantity: 2,
        bookingDateStart: '2026-08-25',
        guestCount: 2
      },
      {
        product: INITIAL_PRODUCTS[8],
        quantity: 3
      }
    ],
    totalAmount: 630000,
    paymentMethod: 'Transfer BCA',
    status: 'selesai',
    createdAt: '10 Aug 2026, 16:15'
  }
];
