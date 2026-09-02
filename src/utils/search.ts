import { Product } from '../types';

/**
 * Kamus Sinonim & Alias Pencarian Khas Pasundan / Wisata Lembang
 */
export const SYNONYM_MAP: Record<string, string[]> = {
  // Homestay & Penginapan
  homestay: ['penginapan', 'inap', 'villa', 'vila', 'kamar', 'rumah', 'lodging', 'hotel', 'sewa', 'glamping'],
  penginapan: ['homestay', 'inap', 'kamar', 'rumah', 'villa', 'vila', 'hotel'],
  glamping: ['camping', 'kemah', 'tenda', 'homestay', 'pinus', 'inap', 'camp'],
  camping: ['glamping', 'kemah', 'tenda', 'camp', 'pinus'],
  tenda: ['camping', 'glamping', 'kemah', 'dome'],
  kemah: ['camping', 'glamping', 'tenda'],
  villa: ['homestay', 'penginapan', 'sewa', 'rumah'],
  vila: ['homestay', 'penginapan', 'sewa', 'rumah'],
  hotel: ['homestay', 'penginapan', 'kamar'],
  inap: ['homestay', 'penginapan', 'kamar', 'sewa'],
  kamar: ['homestay', 'inap', 'sewa'],

  // Kopi & Komoditas Minuman
  kopi: ['coffee', 'arabika', 'robusta', 'single origin', 'biji kopi', 'kafe', 'espresso'],
  coffee: ['kopi', 'arabika', 'robusta', 'single origin'],
  arabika: ['kopi', 'arabica', 'specialty'],
  robusta: ['kopi'],
  teh: ['herbal', 'jamu', 'rempah', 'minuman'],
  minuman: ['kopi', 'teh', 'herbal', 'jamu', 'susu', 'yoghurt'],

  // Sembako & Sayuran
  sayur: ['sayuran', 'organik', 'selada', 'brokoli', 'wortel', 'tomat', 'sembako', 'panen'],
  sayuran: ['sayur', 'organik', 'selada', 'brokoli', 'wortel', 'tomat', 'sembako', 'panen'],
  sembako: ['sayur', 'sayuran', 'susu', 'organik'],
  organik: ['sayur', 'sayuran', 'sembako', 'tani'],
  vegetable: ['sayur', 'sayuran', 'organik'],

  // Susu & Olahan Susu
  susu: ['yoghurt', 'yogurt', 'keju', 'mentega', 'butter', 'cheese', 'perah', 'pasteurisasi'],
  yoghurt: ['yogurt', 'susu', 'probiotik', 'olahan'],
  yogurt: ['yoghurt', 'susu', 'probiotik'],
  keju: ['cheese', 'susu', 'artisan', 'olahan'],
  mentega: ['butter', 'susu', 'lemak susu'],
  butter: ['mentega', 'susu'],
  cheese: ['keju', 'susu'],

  // Buah & Herbal
  stroberi: ['strawberry', 'buah', 'herba', 'manis', 'petik'],
  strawberry: ['stroberi', 'buah', 'herba', 'petik'],
  lemon: ['jeruk', 'citrus', 'buah', 'california'],
  jeruk: ['lemon', 'citrus', 'buah'],
  buah: ['stroberi', 'lemon', 'herba', 'segar'],
  herbal: ['jamu', 'rempah', 'jahe', 'temulawak', 'serai', 'teh'],
  jamu: ['herbal', 'rempah', 'tradisional', 'jahe'],
  rempah: ['herbal', 'jamu', 'jahe'],

  // Kuliner & Camilan
  kuliner: ['makanan', 'tahu', 'bolu', 'camilan', 'keripik', 'snack', 'oleh-oleh', 'kriya'],
  makanan: ['kuliner', 'tahu', 'bolu', 'camilan', 'keripik'],
  tahu: ['tahu susu', 'kuliner', 'lembang'],
  bolu: ['bolu susu', 'kue', 'pastry', 'kuliner'],
  camilan: ['keripik', 'snack', 'kuliner', 'tempe'],
  keripik: ['camilan', 'tempe', 'snack', 'kuliner'],
  snack: ['camilan', 'keripik', 'kuliner'],

  // Wisata & Petualangan
  offroad: ['jeep', '4x4', 'land rover', 'landy', 'adventure', 'petualangan', 'rimba'],
  jeep: ['offroad', '4x4', 'land rover', 'landy'],
  trekking: ['hiking', 'lintas alam', 'susur rimba', 'hutan', 'jalan'],
  hiking: ['trekking', 'lintas alam', 'hutan', 'gunung'],
  wisata: ['tur', 'tour', 'paket', 'tiket', 'wahana', 'rekreasi', 'petualangan'],
  wahana: ['tiket', 'wisata', 'spot', 'rekreasi'],
  tiket: ['karcis', 'masuk', 'wahana', 'spot'],

  // Suvenir & Kerajinan
  suvenir: ['souvenir', 'oleh-oleh', 'kerajinan', 'kriya', 'anyaman', 'bambu', 'cinderamata'],
  souvenir: ['suvenir', 'oleh-oleh', 'kerajinan', 'kriya', 'anyaman'],
  kerajinan: ['kriya', 'anyaman', 'bambu', 'suvenir', 'souvenir', 'kadaplak'],
  kriya: ['kerajinan', 'anyaman', 'bambu', 'suvenir'],
  anyaman: ['bambu', 'kerajinan', 'kriya'],
  bambu: ['anyaman', 'kerajinan', 'kriya'],

  // Tanaman & Bunga
  tanaman: ['bunga', 'sukulen', 'kaktus', 'pot', 'flora', 'florikultura', 'media tanam'],
  bunga: ['tanaman', 'krisan', 'flora', 'agrowisata'],
  sukulen: ['succulent', 'kaktus', 'tanaman', 'pot'],
  pot: ['tembikar', 'keramik', 'tanaman', 'media tanam'],
  kaktus: ['sukulen', 'tanaman']
};

/**
 * Stopwords bahasa Indonesia umum yang bisa dilewati jika ada kata kunci utama lainnya
 */
const STOP_WORDS = new Set([
  'di', 'ke', 'dari', 'yang', 'yg', 'dan', 'atau', 'pada', 'untuk', 
  'buat', 'ada', 'ini', 'itu', 'desa', 'wisata', 'kawasan', 'lembang',
  'kami', 'kita', 'bisa', 'dengan', 'dalam', 'paket'
]);

/**
 * Membangun korpus teks komprehensif dari sebuah produk untuk keperluan pencarian
 */
export function buildProductSearchText(p: Product): string {
  const parts: string[] = [
    p.title || '',
    p.category || '',
    (p.category || '').replace(/-/g, ' '),
    p.description || '',
    p.villageName || '',
    (p.villageName || '').replace('Desa Wisata ', ''),
    p.location || '',
    p.sellerName || '',
    p.sellerBadge || '',
    p.unit || '',
    ...(p.highlights || []),
    ...(p.facilities || [])
  ];

  // Tambahkan alias geografis dan keunikan desa
  const vName = (p.villageName || '').toLowerCase();
  if (vName.includes('suntenjaya')) {
    parts.push('batu loceng palasari kadaplak pasir angling');
  } else if (vName.includes('cibodas')) {
    parts.push('maribaya curug lembah maribaya kebun bunga krisan');
  } else if (vName.includes('cikole')) {
    parts.push('tangkuban parahu kanopi pinus glamping camping offroad');
  } else if (vName.includes('jayagiri')) {
    parts.push('tangkuban parahu rimba trekking sukulen kaktus florikultura');
  } else if (vName.includes('wangunsari')) {
    parts.push('tahu susu bolu susu keripik tempe anyaman bambu');
  } else if (vName.includes('cikahuripan')) {
    parts.push('lemon california stroberi herbal jamu bukit bukanagara');
  } else if (vName.includes('gudangkahuripan')) {
    parts.push('tahu susu bolu suvenir oleh-oleh');
  } else if (vName.includes('sukajaya')) {
    parts.push('yoghurt keju mentega olahan susu sapi');
  }

  return parts.join(' ').toLowerCase();
}

/**
 * Membersihkan kueri pencarian dari simbol/tanda baca ekstra
 */
export function cleanSearchQuery(query: string): string {
  if (!query) return '';
  return query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Menghitung skor relevansi produk terhadap kata kunci pencarian (0 - 100)
 * 0 = tidak cocok
 * > 0 = cocok (semakin tinggi semakin relevan)
 */
export function scoreProductSearch(product: Product, query: string): number {
  const cleanQ = cleanSearchQuery(query);
  if (!cleanQ) return 1;

  const productCorpus = buildProductSearchText(product);
  const titleLower = (product.title || '').toLowerCase();

  // 1. Direct match: Exact full phrase di dalam teks atau judul
  if (titleLower.includes(cleanQ)) {
    return 100;
  }
  if (productCorpus.includes(cleanQ)) {
    return 95;
  }

  // 2. Tokenisasi Multi-Kata
  const rawTokens = cleanQ.split(' ').filter(Boolean);
  if (rawTokens.length === 0) return 1;

  // Filter stopwords jika ada token non-stopword
  const nonStopTokens = rawTokens.filter(t => !STOP_WORDS.has(t));
  const activeTokens = nonStopTokens.length > 0 ? nonStopTokens : rawTokens;

  let matchedTokensCount = 0;
  let titleBonus = 0;

  for (const token of activeTokens) {
    let tokenMatched = false;

    // a. Cek langsung token ada di corpus
    if (productCorpus.includes(token)) {
      tokenMatched = true;
      if (titleLower.includes(token)) {
        titleBonus += 5;
      }
    }

    // b. Cek via sinonim/alias
    if (!tokenMatched) {
      const synonyms = SYNONYM_MAP[token] || [];
      for (const syn of synonyms) {
        if (productCorpus.includes(syn)) {
          tokenMatched = true;
          if (titleLower.includes(syn)) {
            titleBonus += 3;
          }
          break;
        }
      }
    }

    // c. Prefix matching / sub-word matching untuk kata >= 4 karakter (misal: "strober" -> "stroberi", "sayur" -> "sayuran")
    if (!tokenMatched && token.length >= 4) {
      const words = productCorpus.split(/[\s,.-]+/);
      if (words.some(w => w.startsWith(token) || (w.length >= 4 && token.startsWith(w)))) {
        tokenMatched = true;
      }
    }

    if (tokenMatched) {
      matchedTokensCount++;
    }
  }

  const ratio = matchedTokensCount / activeTokens.length;

  // Aturan kelolosan (Threshold):
  // 1 token: harus cocok (ratio === 1)
  if (activeTokens.length === 1 && ratio === 1) {
    return 80 + titleBonus;
  }
  // 2 token: keduanya harus cocok (ratio === 1)
  if (activeTokens.length === 2 && ratio === 1) {
    return 85 + titleBonus;
  }
  // 3+ token: minimal 65% token cocok
  if (activeTokens.length >= 3 && ratio >= 0.65) {
    return Math.round(ratio * 70) + titleBonus;
  }

  return 0;
}

/**
 * Helper boolean untuk filter sederhana: apakah produk cocok dengan pencarian?
 */
export function matchProductSearch(product: Product, query: string): boolean {
  if (!query || query.trim().length === 0) return true;
  return scoreProductSearch(product, query) > 0;
}
