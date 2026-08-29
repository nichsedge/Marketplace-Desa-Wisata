import { Village, Product, Review, Order, User } from '../types';

export const INITIAL_VILLAGES: Village[] = [
  {
    id: 'des-01',
    name: 'Desa Wisata Suntenjaya',
    location: 'Kec. Lembang, Kab. Bandung Barat',
    province: 'Jawa Barat',
    rating: 4.9,
    totalReviews: 284,
    villageAltitude: '1.290 mdpl',
    description: 'Desa Suntenjaya menawarkan keindahan lanskap lereng Gunung Palasari, perkebunan sayur organik terasering, cagar budaya megalitikum Batu Loceng, serta kopi Arabika specialty di kawasan Lembang.',
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
    managerName: 'Kang Asep Suhendar (PIC Desa Suntenjaya)',
    totalListings: 14,
    headOfVillage: 'H. Asep Wahyono',
    villageSecretary: 'Iwan Setiawan',
    villageArea: '845 Ha',
    population: '12.450 Jiwa',
    dusunCount: 4,
    vision: 'Terwujudnya Desa Suntenjaya yang Mandiri, Sejahtera, Berbudaya, dan Berbasis Digital Terdepan di Kawasan Lembang.',
    missions: [
      'Meningkatkan kualitas pelayanan publik melalui digitalisasi.',
      'Mendorong pertumbuhan ekonomi kerakyatan dan UMKM desa.',
      'Melestarikan cagar budaya dan kearifan lokal Sunda.',
      'Membangun pariwisata berkelanjutan berbasis masyarakat.'
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
      { role: 'Ketua Pokdarwis / PIC', name: 'Kang Asep Suhendar' }
    ]
  },
  {
    id: 'des-02',
    name: 'Desa Wisata Cibodas',
    location: 'Kec. Lembang, Kab. Bandung Barat',
    province: 'Jawa Barat',
    rating: 4.8,
    totalReviews: 215,
    villageAltitude: '1.250 mdpl',
    description: 'Desa Cibodas terkenal dengan lembah agrowisata bunga potong, kebun paprika hidroponik, pesona air terjun Curug Maribaya, dan homestay bernuansa alam pedesaan Lembang.',
    history: 'Desa Cibodas merupakan desa induk di koridor Maribaya Lembang yang terkenal subur sejak era kolonial sebagai pusat holtikultura dan sumber mata air pegunungan.',
    culture: 'Masyarakat agraris Sunda dengan tradisi tani bunga krisan, budidaya paprika greenhouse, serta seni bela diri pencak silat dan rampak kendang.',
    highlights: [
      'Agrowisata Bunga Potong & Krisan',
      'Wisata Alam Lembah Maribaya',
      'Greenhouse Paprika & Tomat Cherry',
      'Homestay Asri Nuansa Sungai',
      'Sentra Olahan Selai & Keripik Sayur'
    ],
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80'
    ],
    mapLocation: 'Jl. Maribaya Barat No. 88, Desa Cibodas, Kec. Lembang, Kab. Bandung Barat 40391',
    contactPhone: '+62 813-9485-1122',
    instagram: '@wisatacibodaslembang',
    managerName: 'Kang Dadang Herdiana (PIC Desa Cibodas)',
    totalListings: 10,
    headOfVillage: 'Drs. H. Dedi Setiadi',
    villageSecretary: 'Agus Rahmat, S.Sos',
    villageArea: '720 Ha',
    population: '14.200 Jiwa',
    dusunCount: 4,
    vision: 'Menjadikan Desa Cibodas sebagai Sentra Agrowisata Bunga dan Holtikultura Terdepan di Jawa Barat.',
    missions: [
      'Pengembangan agrowisata berbasis teknologi ramah lingkungan.',
      'Peningkatan kapasitas petani muda dan UMKM bunga hias.',
      'Pelestarian sumber daya air dan kelestarian alam Maribaya.'
    ],
    officeAddress: 'Jl. Maribaya No. 88, Cibodas, Lembang, Bandung Barat 40391',
    villageApparatus: [
      { role: 'Kepala Desa', name: 'Drs. H. Dedi Setiadi' },
      { role: 'Sekretaris Desa', name: 'Agus Rahmat, S.Sos' },
      { role: 'Ketua Pokdarwis / PIC', name: 'Kang Dadang Herdiana' }
    ]
  },
  {
    id: 'des-03',
    name: 'Desa Wisata Cikole',
    location: 'Kec. Lembang, Kab. Bandung Barat',
    province: 'Jawa Barat',
    rating: 4.9,
    totalReviews: 340,
    villageAltitude: '1.400 mdpl',
    description: 'Desa Cikole berada tepat di kaki Gunung Tangkuban Parahu, terkenal dengan hutan pinus yang megah, glamping eksklusif, kebun anggrek hutan, dan kopi lereng gunung.',
    history: 'Cikole telah lama menjadi ikon wisata alam pegunungan Lembang dengan hamparan hutan pinus alami seluas ratusan hektar yang kini dikelola harmonis bersama masyarakat.',
    culture: 'Budaya pelestarian hutan pinus, seni karinding bambu, tradisi kopi manual brew khas pegunungan, dan petualangan alam terbuka.',
    highlights: [
      'Hutan Pinus Megah Cikole',
      'Taman Konservasi Anggrek Hutan',
      'Wisata Kopi Lereng Tangkuban Parahu',
      'Glamping & Camping Ground Pegunungan',
      'Jalur Offroad & Edukasi Rimba'
    ],
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80'
    ],
    mapLocation: 'Jl. Raya Tangkuban Parahu KM. 28, Cikole, Kec. Lembang, Kab. Bandung Barat 40391',
    contactPhone: '+62 821-3344-9988',
    instagram: '@cikolewisatalembang',
    managerName: 'Kang Dadan Ridwan (PIC Desa Cikole)',
    totalListings: 12,
    headOfVillage: 'H. Jajat Sudrajat',
    villageSecretary: 'Maman Suratman',
    villageArea: '980 Ha',
    population: '11.800 Jiwa',
    dusunCount: 4,
    vision: 'Mewujudkan Ekowisata Hutan Pinus dan Konservasi Alam Berkelanjutan di Kawasan Cikole Lembang.',
    missions: [
      'Konservasi flora fauna hutan dataran tinggi.',
      'Pemberdayaan masyarakat pemandu wisata dan homestay hutan.',
      'Promosi pariwisata ramah lingkungan berbasis alam bebas.'
    ],
    officeAddress: 'Jl. Raya Tangkuban Parahu KM 28, Cikole, Lembang 40391',
    villageApparatus: [
      { role: 'Kepala Desa', name: 'H. Jajat Sudrajat' },
      { role: 'Sekretaris Desa', name: 'Maman Suratman' },
      { role: 'Ketua Pokdarwis / PIC', name: 'Kang Dadan Ridwan' }
    ]
  },
  {
    id: 'des-04',
    name: 'Desa Wisata Jayagiri',
    location: 'Kec. Lembang, Kab. Bandung Barat',
    province: 'Jawa Barat',
    rating: 4.8,
    totalReviews: 180,
    villageAltitude: '1.350 mdpl',
    description: 'Desa Jayagiri merupakan gerbang rimba legendaris menuju kawah Tangkuban Parahu, dikelilingi kebun teh asri, jalur trekking sejuk, dan peternakan domba garut.',
    history: 'Jayagiri melegenda dalam seni dan sastra Sunda sebagai kawasan hutan alam berkabut sejuk dengan jalur lintas alam tertua di Bandung Raya.',
    culture: 'Masyarakat penjaga mata air, perkebunan teh rakyat, tradisi seni pencak silat, dan peternakan hewan unggulan pedesaan.',
    highlights: [
      'Pintu Rimba Trekking Jayagiri',
      'Hamparan Kebun Teh Hijau Alami',
      'Homestay Rumah Panggung Sunda',
      'Edukasi Peternakan Domba & Sayuran',
      'Kuliner Nasi Timbel Daun Pisang'
    ],
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80'
    ],
    mapLocation: 'Jl. Jayagiri No. 12, Kec. Lembang, Kab. Bandung Barat 40391',
    contactPhone: '+62 857-2233-7711',
    instagram: '@jayagiri.lembang',
    managerName: 'Teh Eni Rohaeni (PIC Desa Jayagiri)',
    totalListings: 8,
    headOfVillage: 'Cecep Sunandar',
    villageSecretary: 'Endang Kusnadi',
    villageArea: '650 Ha',
    population: '9.850 Jiwa',
    dusunCount: 3,
    vision: 'Pengembangan Ekowisata Rimba dan Pelestarian Perkebunan Teh Tradisional Jayagiri.',
    missions: [
      'Mendorong homestay ramah lingkungan berbasis rumah warga.',
      'Melatih generasi muda sebagai pemandu trekking bersertifikasi.',
      'Menjaga kelestarian mata air dan kawasan resapan lereng gunung.'
    ],
    officeAddress: 'Jl. Jayagiri No. 12, Lembang, Bandung Barat 40391',
    villageApparatus: [
      { role: 'Kepala Desa', name: 'Cecep Sunandar' },
      { role: 'Sekretaris Desa', name: 'Endang Kusnadi' },
      { role: 'Ketua Pokdarwis / PIC', name: 'Teh Eni Rohaeni' }
    ]
  },
  {
    id: 'des-05',
    name: 'Desa Wisata Wangunsari',
    location: 'Kec. Lembang, Kab. Bandung Barat',
    province: 'Jawa Barat',
    rating: 4.8,
    totalReviews: 165,
    villageAltitude: '1.200 mdpl',
    description: 'Desa Wangunsari terkenal sebagai sentra kreasi seni bambu Sunda, agrowisata petik stroberi manis, budidaya jamur tiram organik, dan kampung edukasi ramah anak.',
    history: 'Desa Wangunsari berkembang pesat sebagai desa kreatif berbasis agribisnis dan sanggar seni budaya Sunda yang aktif membina generasi muda.',
    culture: 'Seni degung, calung renteng, kerajinan anyaman bambu, serta kebiasaan gotong royong panen stroberi dan sayuran pekarangan.',
    highlights: [
      'Petik Stroberi Segar Dataran Tinggi',
      'Sanggar Seni Budaya Sunda & Degung',
      'Budidaya Jamur Tiram & Olahan Keripik',
      'Workshop Anyaman Bambu Kreatif',
      'Edukasi Pertanian Hidroponik Desa'
    ],
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80'
    ],
    mapLocation: 'Jl. Wangunsari Raya No. 45, Kec. Lembang, Kab. Bandung Barat 40391',
    contactPhone: '+62 818-0911-5544',
    instagram: '@wangunsari.lembang',
    managerName: 'Kang Sandi Permana (PIC Desa Wangunsari)',
    totalListings: 7,
    headOfVillage: 'H. Diki Firmansyah',
    villageSecretary: 'Teten Rohimat',
    villageArea: '540 Ha',
    population: '8.700 Jiwa',
    dusunCount: 3,
    vision: 'Terwujudnya Desa Wangunsari sebagai Kampung Edukasi Agrowisata Kreatif dan Berkarakter Budaya.',
    missions: [
      'Membina sanggar seni dan kerajinan bambu lokal.',
      'Mengembangkan paket edukasi tani untuk pelajar dan keluarga.',
      'Meningkatkan nilai jual produk olahan buah dan jamur desa.'
    ],
    officeAddress: 'Jl. Wangunsari Raya No. 45, Lembang, Bandung Barat 40391',
    villageApparatus: [
      { role: 'Kepala Desa', name: 'H. Diki Firmansyah' },
      { role: 'Sekretaris Desa', name: 'Teten Rohimat' },
      { role: 'Ketua Pokdarwis / PIC', name: 'Kang Sandi Permana' }
    ]
  }
];

// Presets for PIC Users across Kawasan Lembang
export const MOCK_PICS: User[] = [
  {
    id: 'pic-suntenjaya',
    name: 'Kang Asep Suhendar',
    email: 'asep.suhendar@sabasunten.id',
    role: 'penjual',
    phone: '+6281220763734',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    villageName: 'Desa Wisata Suntenjaya',
    sellerName: 'Pokdarwis Saba Sunten / BUMDes Suntenjaya',
    picVillageId: 'des-01',
    picVillageName: 'Desa Wisata Suntenjaya',
    picRoleTitle: 'PIC Pokdarwis Saba Sunten'
  },
  {
    id: 'pic-cibodas',
    name: 'Kang Dadang Herdiana',
    email: 'dadang.cibodas@sabasunten.id',
    role: 'penjual',
    phone: '+6281394851122',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    villageName: 'Desa Wisata Cibodas',
    sellerName: 'Pokdarwis Lembah Cibodas Maribaya',
    picVillageId: 'des-02',
    picVillageName: 'Desa Wisata Cibodas',
    picRoleTitle: 'PIC Desa Wisata Cibodas'
  },
  {
    id: 'pic-cikole',
    name: 'Kang Dadan Ridwan',
    email: 'dadan.cikole@sabasunten.id',
    role: 'penjual',
    phone: '+6282133449988',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    villageName: 'Desa Wisata Cikole',
    sellerName: 'Pokdarwis Rimba Pinus Cikole',
    picVillageId: 'des-03',
    picVillageName: 'Desa Wisata Cikole',
    picRoleTitle: 'PIC Desa Wisata Cikole'
  },
  {
    id: 'pic-jayagiri',
    name: 'Teh Eni Rohaeni',
    email: 'eni.jayagiri@sabasunten.id',
    role: 'penjual',
    phone: '+6285722337711',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    villageName: 'Desa Wisata Jayagiri',
    sellerName: 'Pokdarwis Rimba & Teh Jayagiri',
    picVillageId: 'des-04',
    picVillageName: 'Desa Wisata Jayagiri',
    picRoleTitle: 'PIC Desa Wisata Jayagiri'
  },
  {
    id: 'pic-wangunsari',
    name: 'Kang Sandi Permana',
    email: 'sandi.wangunsari@sabasunten.id',
    role: 'penjual',
    phone: '+6281809115544',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    villageName: 'Desa Wisata Wangunsari',
    sellerName: 'Pokdarwis Seni & Agro Wangunsari',
    picVillageId: 'des-05',
    picVillageName: 'Desa Wisata Wangunsari',
    picRoleTitle: 'PIC Desa Wisata Wangunsari'
  }
];

// Presets of authentic Lembang photos for quick gallery selection
export const LEMBANG_GALLERY_PRESETS = [
  {
    id: 'photo-1',
    title: 'Homestay Kayu Tradisional Pasir Angling',
    category: 'homestay',
    villageId: 'des-01',
    villageName: 'Suntenjaya',
    url: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-2',
    title: 'Kamar Melati Homestay Lereng Pegunungan',
    category: 'homestay',
    villageId: 'des-02',
    villageName: 'Cibodas',
    url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-3',
    title: 'Hutan Pinus Sejuk Cikole Tangkuban Parahu',
    category: 'paket-wisata',
    villageId: 'des-03',
    villageName: 'Cikole',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-4',
    title: 'Kebun Kopi Arabika Suntenjaya',
    category: 'kuliner',
    villageId: 'des-01',
    villageName: 'Suntenjaya',
    url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-5',
    title: 'Susu Sapi Murni Lembang KPSBU',
    category: 'kuliner',
    villageId: 'des-01',
    villageName: 'Suntenjaya',
    url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-6',
    title: 'Kebun Sayur & Terasering Maribaya',
    category: 'umkm',
    villageId: 'des-02',
    villageName: 'Cibodas',
    url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-7',
    title: 'Petik Stroberi Segar Wangunsari',
    category: 'umkm',
    villageId: 'des-05',
    villageName: 'Wangunsari',
    url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-8',
    title: 'Jalur Trekking Teh Jayagiri',
    category: 'paket-wisata',
    villageId: 'des-04',
    villageName: 'Jayagiri',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'photo-9',
    title: 'Kerajinan Kayu Kadaplak & Anyaman Bambu',
    category: 'suvenir',
    villageId: 'des-01',
    villageName: 'Suntenjaya',
    url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  // --- DESA WISATA SUNTENJAYA (KEC. LEMBANG) ---
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
    sellerName: 'Kang Dadang (Dusun I)',
    sellerBadge: 'Tuan Rumah Terverifikasi',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281220763734',
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Homestay kayu alami di titik tertinggi Dusun Pasir Angling Suntenjaya (1.290 mdpl). Menghadap langsung ke lembah hijau dengan panorama sunrise menakjubkan.',
    highlights: ['Pemandangan Sunrise Gunung', 'Udara Dingin Sejuk Alami', 'Termasuk Sarapan Liwet Sunda', 'Dekat Kebun Sayur Organik'],
    facilities: ['Kamar Tidur Nyaman', 'Air Hangat Water Heater', 'Sarapan Nasi Liwet', 'Free WiFi', 'Parkir Aman'],
    stockQuota: 4,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-02',
    title: 'Kopi Arabika Single Origin Suntenjaya (250g)',
    category: 'kuliner',
    price: 65000,
    originalPrice: 75000,
    unit: '/pack',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 5.0,
    totalReviews: 89,
    sellerName: 'Kelompok Tani Kopi Batu Loceng',
    sellerBadge: 'Petani Binaan Pokdarwis',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281220763734',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Kopi Arabika asli lereng Gunung Palasari Desa Suntenjaya yang dipetik merah sempurna (full wash & honey process) dengan citarasa floral segar dan manis karamel.',
    highlights: ['100% Arabika Grade 1', 'Ditanam di 1.290 mdpl', 'Roasting Fresh Tiap Minggu'],
    stockQuota: 45,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-03',
    title: 'Paket Edukasi Sapi Perah & Live-in 2H1M Suntenjaya',
    category: 'paket-wisata',
    price: 350000,
    unit: '/orang',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 4.9,
    totalReviews: 64,
    sellerName: 'Pokdarwis Saba Sunten',
    sellerBadge: 'Pengelola Resmi Desa',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281220763734',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Paket wisata edukasi lengkap mencakup menginap di homestay warga, praktik perah susu sapi murni KPSBU, panen sayur organik di kebun terasering, dan susur cagar budaya Batu Loceng.',
    highlights: ['Menginap 1 Malam di Homestay', 'Praktek Perah Susu Sapi', 'Petik Sayur Organik', '3x Makan Tradisional Sunda'],
    stockQuota: 20,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-04',
    title: 'Miniatur Permainan Kayu Kadaplak Suntenjaya',
    category: 'suvenir',
    price: 85000,
    unit: '/pcs',
    villageId: 'des-01',
    villageName: 'Desa Wisata Suntenjaya',
    location: 'Lembang, Bandung Barat',
    rating: 4.8,
    totalReviews: 29,
    sellerName: 'Bengkel Kayu Dusun IV',
    sellerBadge: 'Pengrajin Lokal',
    sellerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281220763734',
    image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80'],
    description: 'Miniatur pajangan kereta kayu Kadaplak (permainan balap papan luncur kayu tradisional Sunda yang legendaris di Suntenjaya). Dibuat manual dari kayu mahoni pilihan.',
    highlights: ['100% Handmade Kayu Mahoni', 'Ikon Permainan Tradisional Desa', 'Finishing Halus & Alami'],
    stockQuota: 25,
    isAvailable: true
  },

  // --- DESA WISATA CIBODAS (KEC. LEMBANG) ---
  {
    id: 'prod-05',
    title: 'Kamar Melati Homestay Lembah Maribaya',
    category: 'homestay',
    price: 250000,
    originalPrice: 300000,
    unit: '/malam',
    villageId: 'des-02',
    villageName: 'Desa Wisata Cibodas',
    location: 'Cibodas, Lembang',
    rating: 4.8,
    totalReviews: 41,
    sellerName: 'Ibu Nenden & Keluarga',
    sellerBadge: 'Tuan Rumah Ramah Cibodas',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281394851122',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Kamar nyaman bersih include sarapan pagi hangat khas pedesaan Cibodas. Berlokasi strategis dekat perkebunan bunga dan wisata air terjun Maribaya.',
    highlights: ['Kamar Bersih & Nyaman', 'Include Sarapan Hangat', 'Dekat Curug Maribaya', 'Suasana Tenang Alami'],
    facilities: ['Kasur Queen Bed', 'Water Heater', 'Sarapan Pagi', 'WiFi Gratis', 'Parkir Mobil'],
    stockQuota: 3,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-06',
    title: 'Paprika Segar Hidroponik Greenhouse Cibodas (1 Kg)',
    category: 'umkm',
    price: 38000,
    unit: '/kg',
    villageId: 'des-02',
    villageName: 'Desa Wisata Cibodas',
    location: 'Cibodas, Lembang',
    rating: 4.9,
    totalReviews: 38,
    sellerName: 'Kelompok Tani Paprika Cibodas',
    sellerBadge: 'Petani Mitra BUMDes',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281394851122',
    image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80'],
    description: 'Paprika merah, kuning, dan hijau segar kualitas ekspor dipanen langsung dari greenhouse hidroponik Desa Cibodas. Renyah, manis, dan bebas pestisida kimia berbahaya.',
    highlights: ['Petik Langsung Dari Pohon', 'Bebas Residu Pestisida', 'Pilihan Campur Warna'],
    stockQuota: 30,
    isAvailable: true
  },
  {
    id: 'prod-07',
    title: 'Paket Tour Agrowisata Bunga Krisan & Curug Maribaya',
    category: 'paket-wisata',
    price: 175000,
    unit: '/orang',
    villageId: 'des-02',
    villageName: 'Desa Wisata Cibodas',
    location: 'Cibodas, Lembang',
    rating: 4.9,
    totalReviews: 47,
    sellerName: 'Pokdarwis Lembah Cibodas',
    sellerBadge: 'Pemandu Lokal Resmi',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281394851122',
    image: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=800&q=80'],
    description: 'Jelajah pesona kebun bunga potong warna-warni, belajar merangkai bunga krisan, dan susur sungai asri menuju lembah Curug Maribaya bersama pemandu lokal.',
    highlights: ['Tiket Masuk Kebun Bunga & Curug', 'Workshop Rangkai Bunga', 'Makan Siang Nasi Timbel', 'Pemandu Lokal Ramah'],
    stockQuota: 25,
    isAvailable: true
  },

  // --- DESA WISATA CIKOLE (KEC. LEMBANG) ---
  {
    id: 'prod-08',
    title: 'Glamping Hutan Pinus Lereng Tangkuban Cikole',
    category: 'homestay',
    price: 450000,
    originalPrice: 550000,
    unit: '/malam',
    villageId: 'des-03',
    villageName: 'Desa Wisata Cikole',
    location: 'Cikole, Lembang',
    rating: 4.9,
    totalReviews: 76,
    sellerName: 'Pengelola Wisata Rimba Cikole',
    sellerBadge: 'Pengelola Berpengalaman',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282133449988',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Tenda glamping mewah di tengah kanopi hutan pinus Cikole yang sejuk (1.400 mdpl). Dilengkapi kasur springbed empuk, api unggun malam, dan fasilitas air hangat.',
    highlights: ['Tenda Glamping Nyaman', 'Api Unggun & Jagung Bakar', 'Water Heater & Kamar Mandi Bersih', 'Udara Super Sejuk'],
    facilities: ['Springbed 2 Orang', 'Kamar Mandi Privat', 'Sarapan & Welcome Drink', 'Peralatan BBQ', 'Area Parkir'],
    stockQuota: 6,
    isAvailable: true,
    isFeatured: true
  },
  {
    id: 'prod-09',
    title: 'Kopi Hutan Robusta & Arabika Cikole Blend (200g)',
    category: 'kuliner',
    price: 55000,
    unit: '/pack',
    villageId: 'des-03',
    villageName: 'Desa Wisata Cikole',
    location: 'Cikole, Lembang',
    rating: 4.8,
    totalReviews: 33,
    sellerName: 'Kopi Rimba Cikole',
    sellerBadge: 'UMKM Kopi Desa',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282133449988',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=800&q=80'],
    description: 'Blend istimewa biji kopi pilihan lereng Tangkuban Parahu dengan citarasa cokelat pekat dan aroma kayu pinus yang khas.',
    highlights: ['Medium Dark Roast', 'Aroma Cokelat & Herbal', 'Kemasan Pouch Zipper Valve'],
    stockQuota: 35,
    isAvailable: true
  },
  {
    id: 'prod-10',
    title: 'Paket Offroad Land Rover & Trekking Hutan Cikole',
    category: 'paket-wisata',
    price: 275000,
    unit: '/orang',
    villageId: 'des-03',
    villageName: 'Desa Wisata Cikole',
    location: 'Cikole, Lembang',
    rating: 5.0,
    totalReviews: 62,
    sellerName: 'Komunitas Landy Cikole',
    sellerBadge: 'Driver & Guide Profesional',
    sellerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6282133449988',
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'],
    description: 'Petualangan seru membelah jalur berlumpur hutan pinus Tangkuban Parahu dengan mobil 4x4 Land Rover klasik, diakhiri dengan seduhan kopi hangat di tengah hutan.',
    highlights: ['Mobil 4x4 Land Rover + Driver', 'Safety Helmet & Jas Hujan', 'Seduh Kopi Hutan Gratis', 'Dokumentasi Foto'],
    stockQuota: 15,
    isAvailable: true
  },

  // --- DESA WISATA JAYAGIRI (KEC. LEMBANG) ---
  {
    id: 'prod-11',
    title: 'Homestay Rumah Panggung Sunda Jayagiri',
    category: 'homestay',
    price: 220000,
    unit: '/malam',
    villageId: 'des-04',
    villageName: 'Desa Wisata Jayagiri',
    location: 'Jayagiri, Lembang',
    rating: 4.8,
    totalReviews: 31,
    sellerName: 'Abah Engkos Jayagiri',
    sellerBadge: 'Sesepuh Desa',
    sellerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6285722337711',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80'],
    description: 'Homestay arsitektur rumah panggung Sunda tradisional berbahan kayu dan anyaman bambu sasak di tepi hutan rimba Jayagiri yang tenang dan menyejukkan.',
    highlights: ['Arsitektur Tradisional Asli', 'Udara Segar Alami Rimba', 'Teh Poci Herbal Gratis', 'Dekat Jalur Lintas Alam'],
    facilities: ['Kamar Tidur Bersih', 'Kamar Mandi Luar Bersih', 'Dapur Bersama', 'Teras Menghadap Hutan'],
    stockQuota: 3,
    isAvailable: true
  },
  {
    id: 'prod-12',
    title: 'Paket Trekking Pintu Rimba Jayagiri ke Kawah Ratu',
    category: 'paket-wisata',
    price: 150000,
    unit: '/orang',
    villageId: 'des-04',
    villageName: 'Desa Wisata Jayagiri',
    location: 'Jayagiri, Lembang',
    rating: 4.9,
    totalReviews: 48,
    sellerName: 'Pokdarwis Rimba Jayagiri',
    sellerBadge: 'Ranger Desa Bersertifikat',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6285722337711',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80'],
    description: 'Trekking menyusuri jalur legendaris hutan Jayagiri yang rimbun dan berkabut hingga ke bibir Kawah Ratu Tangkuban Parahu dipandu oleh ranger lokal ramah.',
    highlights: ['Pemandu Jalur Berpengalaman', 'Tiket Masuk Rimba', 'Snack Rebusan & Air Mineral', 'First Aid / P3K Siaga'],
    stockQuota: 20,
    isAvailable: true
  },

  // --- DESA WISATA WANGUNSARI (KEC. LEMBANG) ---
  {
    id: 'prod-13',
    title: 'Stroberi Segar Dataran Tinggi Wangunsari (1 Keranjang)',
    category: 'umkm',
    price: 45000,
    unit: '/keranjang',
    villageId: 'des-05',
    villageName: 'Desa Wisata Wangunsari',
    location: 'Wangunsari, Lembang',
    rating: 4.9,
    totalReviews: 40,
    sellerName: 'Kebun Stroberi Ibu Rita',
    sellerBadge: 'Petani Stroberi Organik',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281809115544',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=800&q=80'],
    description: 'Buah stroberi segar manis ranum dipetik saat pesanan masuk dari kebun pekarangan Desa Wangunsari. Sangat segar kaya vitamin C.',
    highlights: ['Manis Segar Alami', 'Dipetik di Hari yang Sama', 'Kemasan Keranjang Anyaman Tradisional'],
    stockQuota: 25,
    isAvailable: true
  },
  {
    id: 'prod-14',
    title: 'Kerajinan Anyaman Bambu Kreatif & Suvenir Sunda',
    category: 'suvenir',
    price: 60000,
    unit: '/pcs',
    villageId: 'des-05',
    villageName: 'Desa Wisata Wangunsari',
    location: 'Wangunsari, Lembang',
    rating: 4.8,
    totalReviews: 24,
    sellerName: 'Sanggar Bambu Wangunsari',
    sellerBadge: 'Pengrajin Seni Budaya',
    sellerAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
    sellerPhone: '+6281809115544',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'],
    description: 'Peralatan rumah tangga etnik dan kap lampu cantik dari anyaman bambu petung karya pengrajin sanggar desa Wangunsari.',
    highlights: ['Anyaman Halus & Kuat', 'Pernis Natural Anti Rayap', 'Desain Etnik Modern'],
    stockQuota: 18,
    isAvailable: true
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-01',
    productId: 'prod-03',
    authorName: 'Rian Prasetya',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '2 hari lalu',
    comment: 'Pengalaman Live-in di Kampung Pasir Angling Suntenjaya berkesan banget! Udaranya dingin sejuk, anak-anak senang sekali belajar perah susu sapi segar langsung dari peternak, dan makan liwetnya nikmat luar biasa.',
    userRole: 'Wisatawan Asal Jakarta'
  },
  {
    id: 'rev-02',
    productId: 'prod-02',
    authorName: 'Budi Kurniawan',
    authorAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '3 hari lalu',
    comment: 'Kopi Arabika Suntenjaya karakternya sangat harum, ada wangi floral dan manis karamel. Luar biasa kopi pegunungan Lembang!',
    userRole: 'Pencinta Kopi Asal Bandung'
  },
  {
    id: 'rev-03',
    productId: 'prod-01',
    authorName: 'Siti Rahmawati',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '1 minggu lalu',
    comment: 'Homestay Saung Pasir Angling bersih, air hangatnya lancar, dan pemandangan paginya berkabut indah banget. Tuan rumah sekeluarga sangat ramah melayani kami.',
    userRole: 'Wisatawan Asal Tangerang'
  },
  {
    id: 'rev-04',
    productId: 'prod-05',
    authorName: 'Fajar Nugraha',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    rating: 5,
    date: '4 hari lalu',
    comment: 'Kamar Melati Homestay di Cibodas sangat bersih dan sarapannya enak. Tempatnya dekat ke Maribaya, pelayanan PIC ramah dan informatif.',
    userRole: 'Wisatawan Asal Bekasi'
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
    totalAmount: 500000,
    paymentMethod: 'WhatsApp Fast Checkout',
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
        product: INITIAL_PRODUCTS[1],
        quantity: 2
      },
      {
        product: INITIAL_PRODUCTS[5],
        quantity: 2
      }
    ],
    totalAmount: 206000,
    paymentMethod: 'WhatsApp Fast Checkout',
    status: 'selesai',
    createdAt: '22 Aug 2026, 16:15'
  }
];
