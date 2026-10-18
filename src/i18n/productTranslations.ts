import { Product, Village, ProductCategory } from '../types';

export interface LocalizedProductData {
  title: string;
  description: string;
  highlights: string[];
  facilities?: string[];
  unit: string;
  packages?: { name: string; price: number; unit: string; description: string; highlights?: string[] }[];
  itinerary?: { time: string; activity: string }[];
}

export interface LocalizedVillageData {
  description: string;
  history: string;
  culture: string;
  highlights: string[];
}

export const PRODUCT_TRANSLATIONS_EN: Record<string, LocalizedProductData> = {
  // 1. Suntenjaya Coffee
  'real-suntenjaya-kopi-angling': {
    title: 'Pasir Angling Suntenjaya Single Origin Arabica Coffee (200g Pouch)',
    unit: '/200g pouch',
    description: 'Authentic single origin Arabica specialty coffee grown at 1,400 - 1,700 MASL on the slopes of Mount Palasari, Pasir Angling, Suntenjaya. Organically shade-grown under rainforest canopy, handpicked at peak ripeness (full red cherry), dried inside hygienic solar greenhouses, and roasted to medium profile with floral, fruity notes and balanced caramel sweetness. Officially certified Halal Indonesia ID32110001490620223. Official Instagram: @pasiranglingkopi_.',
    highlights: [
      '100% Single Origin Arabica Pasir Angling (1,400–1,700 MASL)',
      'Official Halal Certified ID32110001490620223',
      'Hygienic Solar Greenhouse Drying Process',
      'Medium Roast with Floral & Sweet Caramel Notes',
      'Airtight Aluminum Foil Zipper Pouch + Degassing Valve'
    ]
  },

  // 2. Suntenjaya Camping
  'real-suntenjaya-camping-angling': {
    title: 'Pasir Angling Suntenjaya Eco-Tourism Camping Ground Pass',
    unit: '/person/night',
    description: 'A serene and scenic campsite atop the ridge of Pasir Angling, Suntenjaya (1,400 MASL), offering a 360-degree panorama of North Bandung mountains, terraced vegetable plantations, and a morning sea of clouds. Equipped with essential amenities including fresh mountain spring water restrooms, campfire grounds, and local community security.',
    highlights: [
      '1,400 MASL Cool Mountain Climate',
      'Spectacular Sunrise & Sea of Clouds Panorama',
      'Clean Mountain Spring Water & Restroom Facilities',
      'Spacious, Safe & Family-Friendly Grounds'
    ],
    facilities: [
      'Clean Restrooms',
      'Fresh Mountain Spring Water',
      'Motorcycle & Car Parking',
      'Campfire Grounds',
      'Local Warung / Stalls'
    ]
  },

  // 3. Suntenjaya Hiking
  'real-suntenjaya-hiking-angling': {
    title: 'Pasir Angling Hillside & Plantation Trekking Pass',
    unit: '/person',
    description: 'Leisurely nature trail passing through Suntenjaya village paths, shade-grown Arabica coffee groves, lush green terraced vegetables, and leading up to the rim of Pasir Angling ridge. Ideal for morning walkers, landscape photographers, and families.',
    highlights: [
      'Safe Trails Maintained by Local Villagers',
      'Crisp Mountain Air of Mount Palasari Slopes',
      'Terraced Vegetable Farms & Coffee Grove Views',
      'Beginner-Friendly & Nature Enthusiast Approved'
    ]
  },

  // 4. Suntenjaya Live-In
  'real-suntenjaya-livein-induksemang': {
    title: 'Suntenjaya Village Host Family Live-In Cultural Package (2D1N)',
    unit: '/package/person',
    description: 'An authentic cultural immersion living alongside Suntenjaya farming families (host family / induk semang). Guests stay in local homes, join daily activities such as picking fresh terraced vegetables, tending Arabica coffee trees, and enjoying warm traditional Sundanese home-cooked meals.',
    highlights: [
      '1 Night Stay with a Welcoming Local Host Family',
      '3x Authentic Traditional Sundanese Home-Cooked Meals',
      'Hands-on Coffee Farming & Vegetable Harvesting',
      'Local Wisdom & Sundanese "Gotong Royong" Culture'
    ],
    facilities: [
      'Cozy Clean Room in Villager Home',
      '3x Daily Meals',
      'Local Villager Guide',
      'Hot Bath Water'
    ],
    itinerary: [
      { time: '14:00', activity: 'Welcome reception at Village Hall & host family matching' },
      { time: '16:00', activity: 'Afternoon walking tour around terraced vegetable farms & dairy interaction' },
      { time: '19:00', activity: 'Dinner with host family & cultural storytelling session' },
      { time: '06:00', activity: 'Sunrise walk to Pasir Angling ridge & traditional Liwet rice breakfast' },
      { time: '08:30', activity: 'Hands-on coffee cherry harvesting & solar greenhouse processing tour' },
      { time: '12:00', activity: 'Farewell lunch & departure' }
    ]
  },

  // 5. Suntenjaya Homestay
  'real-suntenjaya-homestay-warga': {
    title: 'Palasari Slopes Traditional Village Homestay Suntenjaya',
    unit: '/night',
    description: 'A cool, peaceful homestay in local villager homes on the slopes of Mount Palasari, Suntenjaya (1,290 MASL). Enjoy misty mountain breezes, lush terraced farm views, cozy terraces adorned with highland plants, and genuine Pasundan village hospitality.',
    highlights: [
      'Crisp Mountain Climate at 1,290 MASL on Mount Palasari',
      'Scenic Home Terrace with Highland Flora',
      'Panoramic Views Overlooking Terraced Farms',
      'Spotless Rooms with Warm Water Shower Facilities'
    ],
    facilities: [
      'Clean Beds & Warm Blankets',
      'Bathroom with Hot Water',
      'Complimentary Hot Tea & Suntenjaya Arabica Coffee',
      'Motorcycle & Car Parking'
    ]
  },

  // 6. Suntenjaya Techno-Ecology
  'real-suntenjaya-tekno-ekologi': {
    title: 'Suntenjaya Techno-Ecological Agriculture Field Study Package',
    unit: '/edu package',
    description: 'An integrated educational tour showcasing sustainable farming technology and ecology. Explore the full circular cycle of eco-friendly farming: cattle waste biogas energy conversion, steep hillside contour terracing, and modern solar greenhouse coffee post-harvest processing.',
    highlights: [
      'Circular Biogas Conversion from Dairy Waste into Clean Energy',
      'Soil Conservation Techniques for Steep Mountain Terracing',
      'Modern Solar Greenhouse Coffee Processing Facility Tour',
      'Guided by Village Agricultural Practitioners'
    ]
  },

  // 7. Cikole Land Rover Expedition
  'real-cikole-offroad-landrover-abah': {
    title: 'Cikole Pine Rainforest Land Rover Offroad Expedition by Abah Dadan',
    unit: '/pax (min. 6 persons)',
    description: 'A legendary rainforest offroad adventure aboard classic 4x4 Land Rovers led by pioneer Abah Dadan & seasoned crew. Traverse extreme mud ruts, volcanic rock paths, splash ponds, and towering pine canopies. Includes 6 comprehensive route tiers from Cikole, Tangkuban Parahu via Upas Hill Track 11, to Ciwidey and Pangalengan.',
    highlights: [
      'Classic Certified 4x4 Land Rover Fleet in Prime Condition',
      'Includes Full Buffet Lunch & Traditional Coffee Break',
      'Includes Perhutani Forestry & Official Community Checkpoint Passes',
      'Upas Hill Sunrise & Tangkuban Parahu Crater Track 11 Options',
      'Guided by Senior Pioneer Driver Abah Dadan & Friendly Team'
    ],
    facilities: [
      'Classic 4x4 Land Rover + Experienced Driver',
      'Fuel, Forestry Permits & Community Checkpoints',
      '1x Buffet Lunch',
      '1x Traditional Coffee Break',
      'Mineral Water 330ml',
      'Standard Outdoor First Aid Kit'
    ],
    packages: [
      {
        name: 'Package 01: Cikole Land Rover Adventure',
        price: 295000,
        unit: '/pax nett',
        description: 'Pine forest offroad through mud tracks and rocky slopes. Includes 1x buffet lunch, 1x coffee break, mineral water, Perhutani forestry permit & community portal.',
        highlights: ['Cikole Pine Forest Mud Track', 'Buffet Lunch & Coffee Break', 'Forestry & Portal Permits']
      },
      {
        name: 'Package 02: Cikole Adventure & Outbound Fun Games',
        price: 335000,
        unit: '/pax nett',
        description: 'Land Rover offroad combined with treasure hunt and team building games complete with professional game master, facilitators, game equipment, lunch & coffee.',
        highlights: ['Offroad + Team Building Games', 'Professional Game Master & Facilitators', 'Lunch, Coffee Break & Permits']
      },
      {
        name: 'Package 03: Upas Hill Sunrise Tangkuban Parahu (Track 11)',
        price: 435000,
        unit: '/pax nett',
        description: 'Spectacular early morning joyride to Upas Hill witnessing Tangkuban Parahu volcanic crater sunrise via Track 11. Includes lunch, coffee break, and permits.',
        highlights: ['Tangkuban Parahu Crater Sunrise View', 'Iconic Track 11 Route', 'Lunch & Coffee Break']
      },
      {
        name: 'Package 04: Cikole & Tangkuban Parahu Crater Regular Route',
        price: 410000,
        unit: '/pax nett',
        description: 'Offroad adventure and scenic visit to Tangkuban Parahu main crater via regular route. Includes entrance tickets, buffet lunch, and coffee break.',
        highlights: ['Offroad + Tangkuban Parahu Crater Tour', 'All-Inclusive Entrance Passes', 'Lunch & Coffee Break']
      },
      {
        name: 'Package 05: Ciwidey / Rancabali Glamping Lakeside',
        price: 325000,
        unit: '/pax nett',
        description: 'Offroad through Ciwidey tea plantations and visit to Phinisi Glamping Lakeside. Includes tea plantation permits, portal fees, lunch, and coffee break.',
        highlights: ['Ciwidey Tea Plantation Offroad', 'Phinisi Lakeside Visit', 'Lunch & Coffee Break']
      },
      {
        name: 'Package 06: Pangalengan Land Rover Adventure',
        price: 285000,
        unit: '/pax nett',
        description: 'Land Rover adventure cutting through misty tea hills of Pangalengan. Includes plantation permits, community checkpoints, buffet lunch, and coffee break.',
        highlights: ['Pangalengan Rolling Tea Hills Panorama', 'Winding Mud Track Adrenaline Rush', 'Lunch & Coffee Break']
      }
    ]
  },

  // 8. Cikole Land Rover Fleet Rental
  'real-cikole-sewa-armada-landrover': {
    title: 'Private 4x4 Land Rover Fleet Charter Cikole Sukawana (Driver & Fuel Included)',
    unit: '/vehicle/day',
    description: 'Charter an entire classic Land Rover Series 4x4 for private groups or families (capacity up to 7 passengers). Includes a skilled local driver familiar with Sukawana-Cikole terrain, fuel, and aesthetic photo stops in the pine forest.',
    highlights: [
      'Private Capacity up to 7 Passengers per Fleet',
      'Includes Experienced Senior Driver & Fuel',
      'Freedom to Explore Pine Forest Trails & Tea Plantations',
      'Flexible Stops at Scenic Panoramic Photo Spots'
    ],
    facilities: [
      '1 Unit Classic 4x4 Land Rover',
      'Experienced Senior Driver',
      'Full Fuel During Trip',
      'Standard Outdoor First Aid'
    ]
  },

  // 9. Cikole Extreme Offroad Track 11
  'real-cikole-offroad-ekstrem-sukawana': {
    title: 'Upas Hill Sunrise Joyride & Extreme Mud Offroad Track 11 Sukawana',
    unit: '/pax (min. 6 persons)',
    description: 'The thrill of conquering deep mud trenches and volcanic boulder paths on extreme Track 11 up to Upas Hill peak for an unforgettable sunrise against Mount Tangkuban Parahu crater. Lembang\'s ultimate adrenaline adventure.',
    highlights: [
      'Spectacular Sunrise from Upas Hill Tangkuban Parahu',
      'Iconic Extreme Mud Track 11 Sukawana',
      'Includes Breakfast, Coffee Break & Forestry Entry Passes',
      'Guided by Senior Drivers Specialized in Wet Mud Ruts'
    ],
    facilities: [
      'Extreme-Spec 4x4 Fleet + Driver',
      'Fuel, Forestry Permits & Checkpoints',
      '1x Breakfast / Buffet Lunch',
      '1x Warm Coffee Break',
      'First Aid & Activity Insurance'
    ]
  },

  // 10. Jayagiri Coffee
  'real-jayagiri-maguru-kopi': {
    title: 'Maguru Kopi Legend Jayagiri (Traditional Coffee by Pa Maliki)',
    unit: '/cup',
    description: 'Legendary brewed coffee served at the Jayagiri hiking gateway that has welcomed trekkers for generations. Brewed directly by Pa Maliki with traditional methods, warming authentic coffee lovers amidst cool mist and towering pines.',
    highlights: [
      'Authentic Brew at the Jayagiri Mountain Trailhead',
      'Choice of Jayagiri Arabica & Traditional Robusta Tubruk',
      'Cozy Rustic Wooden Hut Atmosphere in the Pine Woods',
      'Served Steaming Hot to Complement Cold Mountain Air'
    ]
  },

  // 11. Gudangkahuripan Gamelan
  'real-gudangkahuripan-gamelan-budaya': {
    title: 'Sundanese Gamelan, Traditional Dance & Cultural Heritage Workshop',
    unit: '/participant',
    description: 'An interactive Pasundan arts and cultural immersion workshop led by senior cultural maestro Pa Mei Wisana. Participants learn hands-on how to play Degung/Salendro gamelan instruments, learn foundational Jaipong dance movements, and discover the living philosophy of Lembang\'s ancestral heritage.',
    highlights: [
      'Hands-on Playing of Authentic Sundanese Degung Gamelan',
      'Introduction to Foundational Pasundan Traditional Dance Movements',
      'Historical Storytelling & Local Cultural Philosophy Session',
      'Mentored by Village Master Musicians & Artists'
    ]
  },

  // 12. Wangunsari Tahu Susu
  'real-wangunsari-tahu-susu': {
    title: 'Fresh Silken Milk Tofu Wangunsari (Pack of 10 Pcs)',
    unit: '/pack (10 pcs)',
    description: 'Legendary milk tofu made by Pa Agus in Wangunsari, Lembang, celebrated for its silky-smooth interior and crispy exterior when fried. Made with premium non-GMO soybeans and pure fresh cow milk from local dairy farmers. 100% preservative-free, packaged hygienically in Tahu Agus 10-piece packs for only Rp 5,000.',
    highlights: [
      'Affordable Price: Rp 5,000 per Pack (10 Pcs)',
      'Melt-in-the-Mouth Texture Inside, Crispy Outside',
      'Blended with Authentic Pure Lembang Cow Milk',
      'Hygienic & Free from Chemical Preservatives',
      'A Must-Buy Savory Snack & Traditional Souvenir'
    ]
  },

  // 13. Wangunsari Kicimpring
  'real-wangunsari-kicimpring': {
    title: 'Crispy Savory Cassava Kicimpring Wangunsari (250g)',
    unit: '/250g pack',
    description: 'Traditional Sundanese spiced cassava crackers handmade by Bu Agustian in Wangunsari Village. Blended with fresh scallions, garlic, coriander, and red chili, delivering an ultra-crispy crunch and deeply savory flavor.',
    highlights: [
      '100% Quality Local Cassava',
      'Natural Scallion & Herb Seasoning',
      'Delightfully Crispy, Never Hard',
      'Timeless Traditional Sundanese Snack'
    ]
  },

  // 14. Wangunsari Ranginang
  'real-wangunsari-ranginang': {
    title: 'Savory Terasi Sticky Rice Crackers Ranginang Bu Entin (1 Kg)',
    unit: '/kg (~50 pcs)',
    description: 'Handcrafted sticky rice crackers infused with savory Sundanese terasi (shrimp paste) from Bu Entin\'s Kitchen in Wangunsari. Expands into a light, airy, and deeply satisfying crisp when fried without sticking to your teeth. Approximately 50 pieces per 1 kg pack.',
    highlights: [
      'Authentic Savory Shrimp Paste (Terasi) Flavor',
      '1 Kg Pack (~50 Pcs) for Rp 65,000',
      'Selected Farmer-Harvested Glutinous Rice',
      'Puffs Up Perfectly with Maximum Crispiness',
      'Available Ready-to-Fry or Pre-Fried'
    ]
  },

  // 15. Wangunsari Peuyeum Ketan
  'real-wangunsari-peuyeum-ketan': {
    title: 'Water Apple Leaf Fermented Sweet Rice Peuyeum Wangunsari (Pre-Order)',
    unit: '/mini tub (16 pcs)',
    description: 'Naturally fermented black glutinous rice tapai wrapped in fresh water apple leaves. Sweet, juicy, and infused with traditional yeast aroma with a silky texture best enjoyed chilled. Pre-Order required at least 4 days in advance, orders accepted on Saturdays and Sundays only.',
    highlights: [
      'Pre-Order Min. 4 Days (Orders on Sat & Sun Only)',
      'Natural Yeast Fermentation Passed Down Generations',
      'Fresh Aromatic Water Apple Leaf Wrap',
      'Sweet Refreshing Tapai Juice',
      'Hygienically Packed in Convenient Mini Tubs'
    ]
  },

  // 16. Sukajaya Yoghurt
  'real-sukajaya-yoghurt-alami': {
    title: 'Probiotic Fruit Yoghurt Assortment by Toko Barokah Pa Emin (250ml Bottle)',
    unit: '/250ml bottle',
    description: 'Thick, probiotic-rich yoghurt (Yoghvit & Stick Mat Pochi) made directly from 100% fresh dairy milk from Sukajaya farmers at Toko Barokah Pa Emin. Free of artificial colors and sweeteners, available in lychee, durian, grape, and mixed fruit flavors.',
    highlights: [
      'Authentic Production by Toko Barokah Pa Emin Sukajaya',
      'Made from Morning-Fresh Dairy Cow Milk',
      'Rich in Beneficial Probiotics Supporting Digestion',
      'Available in Yoghvit Bottles & Mat Pochi Yoghurt Sticks',
      'Hygienic Packaging with Official Certification'
    ]
  },

  // 17. Sukajaya Fresh Cow Milk
  'real-sukajaya-susu-murni-segar': {
    title: 'Fresh Pure Pasteurized Cow Milk Toko Barokah Pa Emin (1 Liter Bottle)',
    unit: '/liter',
    description: 'Pure fresh cow milk daily milked from dairy cows on the slopes of Sukajaya and marketed directly through Toko Barokah Pa Emin. Gently pasteurized under temperature control to ensure hygiene while preserving its rich natural creaminess and nutritional value.',
    highlights: [
      'Fresh Daily Milk from Toko Barokah Pa Emin',
      'Safe Hygienic Pasteurization Ready to Drink',
      'High in Calcium, Healthy Fats & Natural Protein',
      'Fast Chilled Delivery'
    ]
  },

  // 18. Sukajaya Tahu Susu
  'real-sukajaya-tahu-susu': {
    title: 'Silken Milk Tofu Barokah Sukajaya by Pa Emin (1 Box)',
    unit: '/box',
    description: 'Delicious specialty milk tofu produced by Tahu Susu Barokah (Pa Emin) in Citespong, Sukajaya Village. Combining rich soy protein with pure fresh dairy milk without preservatives. Officially certified Halal with NIB 5122300062931.',
    highlights: [
      'Produced by Tahu Susu Barokah Pa Emin in Sukajaya',
      'Certified Halal & Official NIB 5122300062931',
      'Blended with Fresh Milk from Sukajaya Dairy Farmers',
      'Crispy Outside, Incredibly Soft and Melting Inside'
    ]
  }
};

export const VILLAGE_TRANSLATIONS_EN: Record<string, LocalizedVillageData> = {
  'des-01': {
    description: 'Suntenjaya offers breathtaking highland landscapes along Mount Palasari slopes, terraced vegetable plantations, the ancient Batu Loceng megalithic site, and premium specialty Arabica coffee in Lembang.',
    history: 'Suntenjaya originated as a fertile agrarian settlement on the slopes of Mount Palasari, Mount Manglayang, and Bukit Tunggul at 1,290 MASL. It has now grown into a renowned Arabica coffee center and self-reliant eco-agro village.',
    culture: 'The community upholds traditional Sundanese cultural wisdom, preservation of the historic Batu Loceng heritage site, Kadaplak wooden cart racing, and a spirit of solidarity between dairy farmers and growers.',
    highlights: [
      'Suntenjaya Arabica Specialty Coffee Center',
      'Batu Loceng Megalithic Cultural Heritage Site',
      'Serene Villager Homestays (Palasari Slopes)',
      'Pasir Angling Hillside Nature Excursions',
      'Techno-Ecological Agro-Tourism Education'
    ]
  },
  'des-03': {
    description: 'Cikole lies on the slopes of Mount Tangkuban Parahu, famous for majestic pine forests, camping packages, tent rentals, outdoor amusement passes, and 4x4 offroad Land Rover expeditions.',
    history: 'Cikole has long been an icon of highland nature tourism in Lembang, with natural misty pine forests managed cooperatively with the village community.',
    culture: 'Pine forest conservation culture, outdoor adventure, the legendary Land Rover offroad community, and warm forestry guide hospitality.',
    highlights: [
      'Pine Forest Camping Packages',
      'Full Canopy Tent & Mat Rentals',
      'Tangkuban Parahu 4x4 Offroad Rentals',
      'Recreation Spots & Crisp Nature Trails',
      'Ultra Cool Air at 1,400 MASL'
    ]
  },
  'des-04': {
    description: 'Jayagiri is renowned for pine forest hiking trails, Mount Putri sunrise vistas, lush ornamental plants, and Pa Maliki\'s legendary Maguru Kopi at the mountain trailhead.',
    history: 'Jayagiri has served for decades as the historic starting point for climbing Mount Tangkuban Parahu through cool, preserved pine woods.',
    culture: 'Mountain trekking traditions, eco-stewardship, highland ornamental horticulture, and cozy rustic coffee culture.',
    highlights: [
      'Jayagiri Trailhead Maguru Kopi Legend',
      'Pine Forest Trekking Trail & Mount Putri',
      'Highland Ornamental Plants & Succulents',
      'Scenic Mist & Cold Mountain Climate'
    ]
  },
  'des-05': {
    description: 'Wangunsari is a celebrated traditional culinary hub in Lembang, famous for melt-in-the-mouth milk tofu, crispy cassava kicimpring, savory shrimp paste ranginang, and sweet fermented peuyeum ketan.',
    history: 'Wangunsari has long been the culinary kitchen of Lembang, preserving artisanal food recipes across family generations.',
    culture: 'Sustained traditional culinary craft, household MSMEs, and authentic Pasundan recipe heritage.',
    highlights: [
      'Silken Milk Tofu Center (Rp 5,000/10 pcs)',
      'Crispy Savory Cassava Kicimpring UMKM',
      'Dapur Bu Entin Savory Terasi Ranginang',
      'Authentic Pre-Order Peuyeum Ketan Tapai'
    ]
  },
  'des-07': {
    description: 'Gudangkahuripan is a center for Sundanese traditional arts and culture in Lembang, presenting Jaipong dance, Degung gamelan workshops, and ancient oral history led by Pa Mei Wisana.',
    history: 'Gudangkahuripan preserves ancestral Pasundan art forms as an active cultural bridge for young generations and visiting tourists.',
    culture: 'Vibrant gamelan music, spirited Jaipong dance, traditional costume artistry, and cultural storytelling.',
    highlights: [
      'Hands-on Sundanese Degung Gamelan Workshop',
      'Traditional Jaipong Dance Masterclasses',
      'Local History & Cultural Storytelling',
      'Guided by Senior Village Cultural Maestro'
    ]
  },
  'des-08': {
    description: 'Sukajaya is the premier fresh dairy and processed milk village in Lembang, producing pure pasteurized milk, probiotic fruit yoghurt, and fresh milk tofu through Toko Barokah Pa Emin.',
    history: 'Sukajaya is recognized as one of the oldest dairy farming basins in Lembang, producing top-grade milk nurtured by rich volcanic soil.',
    culture: 'Dedicated cattle dairy husbandry, clean milking ethics, and cooperative dairy entrepreneurship.',
    highlights: [
      '100% Pure Fresh Daily Pasteurized Cow Milk',
      'Probiotic Yoghvit & Mat Pochi Yoghurt Sticks',
      'Certified Halal Tahu Susu Barokah',
      'Direct-from-Farmer Dairy Products'
    ]
  }
};

/**
 * Common unit translation mapper for bilingual display
 */
export const localizeUnit = (unit: string, language: 'id' | 'en'): string => {
  if (language === 'id') return unit;

  const unitMap: Record<string, string> = {
    '/malam': '/night',
    '/orang': '/person',
    '/orang/malam': '/person/night',
    '/paket/orang': '/package/person',
    '/paket': '/package',
    '/paket edukasi': '/edu package',
    '/pax': '/pax',
    '/pax (min 6 orang)': '/pax (min. 6 persons)',
    '/pax nett': '/pax nett',
    '/armada/hari': '/vehicle/day',
    '/cangkir': '/cup',
    '/peserta': '/participant',
    '/kemasan (10 pcs)': '/pack (10 pcs)',
    '/pouch 200gr': '/200g pouch',
    '/pouch': '/pouch',
    '/bungkus 250gr': '/250g pack',
    '/kg (+- 50 pcs)': '/kg (~50 pcs)',
    '/ember mini (isi 16 pcs)': '/mini tub (16 pcs)',
    '/botol 250ml': '/250ml bottle',
    '/liter': '/liter',
    '/kotak': '/box',
    '/hari': '/day',
    '/porsi': '/portion'
  };

  return unitMap[unit] || unit.replace('/orang', '/person').replace('/malam', '/night');
};

/**
 * Returns a localized copy of the Product based on active language
 */
export const getLocalizedProduct = (product: Product, language: 'id' | 'en'): Product => {
  if (language === 'id') return product;

  const trans = PRODUCT_TRANSLATIONS_EN[product.id];
  if (!trans) {
    // If not found in English map, translate unit as minimum fallback
    return {
      ...product,
      unit: localizeUnit(product.unit, 'en')
    };
  }

  return {
    ...product,
    title: trans.title,
    description: trans.description,
    highlights: trans.highlights,
    facilities: trans.facilities || product.facilities,
    unit: trans.unit,
    packages: trans.packages || product.packages,
    itinerary: trans.itinerary || product.itinerary
  };
};

/**
 * Returns a localized copy of the Village based on active language
 */
export const getLocalizedVillage = (village: Village, language: 'id' | 'en'): Village => {
  if (language === 'id') return village;

  const trans = VILLAGE_TRANSLATIONS_EN[village.id];
  if (!trans) return village;

  return {
    ...village,
    description: trans.description,
    history: trans.history,
    culture: trans.culture,
    highlights: trans.highlights
  };
};

/**
 * Localized Category Label
 */
export const getLocalizedCategoryName = (category: ProductCategory | string, language: 'id' | 'en'): string => {
  if (language === 'id') {
    switch (category) {
      case 'minuman-komoditas': return 'Minuman & Komoditas';
      case 'wisata-alam':
      case 'paket-wisata': return 'Wisata Alam & Edukasi';
      case 'kuliner': return 'Kuliner & Camilan Tradisional';
      case 'olahan-susu': return 'Olahan Susu Kemasan';
      case 'penginapan-lokal':
      case 'homestay': return 'Penginapan Lokal & Homestay';
      case 'sembako': return 'Sembako & Hasil Bumi';
      case 'tanaman-hias': return 'Tanaman Hias & Sukulen';
      case 'suvenir': return 'Suvenir & Kriya';
      case 'umkm': return 'Produk UMKM';
      case 'destinasi': return 'Tiket Wahana';
      default: return 'Produk Desa';
    }
  }

  switch (category) {
    case 'minuman-komoditas': return 'Coffee & Specialty Crops';
    case 'wisata-alam':
    case 'paket-wisata': return 'Eco-Tours & Nature';
    case 'kuliner': return 'Traditional Culinary';
    case 'olahan-susu': return 'Packaged Dairy Products';
    case 'penginapan-lokal':
    case 'homestay': return 'Local Stays & Homestays';
    case 'sembako': return 'Staples & Farm Produce';
    case 'tanaman-hias': return 'Highland Plants & Flora';
    case 'suvenir': return 'Souvenirs & Crafts';
    case 'umkm': return 'Village MSME Goods';
    case 'destinasi': return 'Tourism Tickets';
    default: return 'Village Product';
  }
};
