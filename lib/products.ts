import { Product, BlogPost, Testimonial } from './types';

const img = (id: number, w = 800) =>
  `https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop`;

const reviewNames = ['Siti Rahmawati', 'Dewi Lestari', 'Budi Santoso', 'Putri Anggraini', 'Rina Wijaya', 'Ahmad Fauzi', 'Maya Sari', 'Lina Marlina', 'Eka Pratama', 'Yuni Kartika'];

const avatarImgs = [
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
];

function makeReviews(seed: number, count: number) {
  const comments = [
    'Produknya bagus banget, hasilnya terasa dalam seminggu!',
    'Pengiriman cepat, packing aman. Akan beli lagi.',
    'Kualitas oke, cocok untuk kulit sensitif saya.',
    'Sudah pakai 2 bulan, hasilnya memuaskan.',
    'Wangi nya enak dan natural, suka!',
    'Harga sebanding dengan kualitas. Recommended.',
    'Membantu masalah kulit saya. Terima kasih SR12!',
    'Aman untuk anak-anak, bahan alami terasa.',
  ];
  const out = [];
  for (let i = 0; i < count; i++) {
    out.push({
      id: `r${seed}-${i}`,
      name: reviewNames[(seed + i) % reviewNames.length],
      avatar: avatarImgs[(seed + i) % avatarImgs.length],
      rating: 4 + ((seed + i) % 2),
      date: `2024-0${((seed + i) % 9) + 1}-1${(i % 9)}`,
      comment: comments[(seed + i) % comments.length],
    });
  }
  return out;
}

type Seed = {
  name: string;
  cat: string;
  catSlug: string;
  price: number;
  discount: number;
  imageId: number;
  galleryIds: number[];
  tags: string[];
  badges: any[];
  bpom: string;
  short: string;
  desc: string;
  benefits: string[];
  ingredients: string;
  usage: string;
  bestSeller?: boolean;
  isNew?: boolean;
  limited?: boolean;
  stock: number;
};

const seeds: Seed[] = [
  // HERBAL
  { name: 'SR12 Habbatussauda Capsule', cat: 'Herbal', catSlug: 'herbal', price: 85000, discount: 20, imageId: 4753990, galleryIds: [4753990, 4753989, 4753991], tags: ['immunity', 'herbal'], badges: ['best-seller', 'bpom', 'halal'], bpom: 'BPOM TR 1923456781', short: 'Kapsul habbatussauda murni untuk imun tubuh.', desc: 'Kapsul ekstrak habbatussauda (Nigella sativa) premium pilihan, diproses dengan teknologi modern tanpa bahan kimia. Membantu menjaga daya tahan tubuh dan kesehatan pernapasan.', benefits: ['Meningkatkan imunitas', 'Menjaga kesehatan pernapasan', 'Antioksidan alami'], ingredients: 'Ekstrak Habbatussauda (Nigella sativa) 500mg, Kapsul Halal.', usage: 'Konsumsi 2 kapsul sehari setelah makan.', bestSeller: true, stock: 120 },
  { name: 'SR12 Kunyit Asem Drink', cat: 'Herbal', catSlug: 'herbal', price: 35000, discount: 15, imageId: 4753989, galleryIds: [4753989, 4753990], tags: ['herbal', 'immunity'], badges: ['new-arrival', 'bpom', 'halal'], bpom: 'BPOM TR 1923456782', short: 'Minuman tradisional kunyit asem segar.', desc: 'Jamu kunyit asem tradisional dengan rasa segar, diproduksi secara higienis. Membantu menjaga stamina dan melancarkan haid.', benefits: ['Menjaga stamina', 'Melancarkan haid', 'Antioksidan'], ingredients: 'Kunyit, Asem Jawa, Gula Aren, Air.', usage: 'Minum 1 sachet 2x sehari.', isNew: true, stock: 200 },
  { name: 'SR12 Daun Sirih Extract', cat: 'Herbal', catSlug: 'herbal', price: 45000, discount: 10, imageId: 4753991, galleryIds: [4753991, 4753990], tags: ['herbal'], badges: ['bpom', 'halal'], bpom: 'BPOM TR 1923456783', short: 'Ekstrak daun sirih untuk kebersihan intim.', desc: 'Ekstrak daun sirih murni dalam kemasan praktis untuk menjaga kebersihan area kewanitaan.', benefits: ['Antibakteri alami', 'Menjaga kebersihan intim', 'Mengurangi bau tidak sedap'], ingredients: 'Ekstrak Daun Sirih 300mg, Air.', usage: 'Gunakan sesuai petunjuk kemasan.', stock: 80 },
  { name: 'SR12 Temulawak Plus Capsule', cat: 'Herbal', catSlug: 'herbal', price: 55000, discount: 25, imageId: 4753992, galleryIds: [4753992, 4753990], tags: ['herbal', 'immunity'], badges: ['best-seller', 'bpom', 'halal'], bpom: 'BPOM TR 1923456784', short: 'Kapsul temulawak untuk kesehatan hati.', desc: 'Kapsul temulawak berkualitas tinggi untuk menjaga kesehatan hati dan pencernaan.', benefits: ['Menjaga kesehatan hati', 'Melancarkan pencernaan', 'Menambah nafsu makan'], ingredients: 'Ekstrak Temulawak 400mg, Kapsul Halal.', usage: 'Konsumsi 2 kapsul sehari.', bestSeller: true, stock: 150 },
  { name: 'SR12 Lidah Buaya Juice', cat: 'Herbal', catSlug: 'herbal', price: 40000, discount: 0, imageId: 4753993, galleryIds: [4753993], tags: ['herbal'], badges: ['bpom', 'halal'], bpom: 'BPOM TR 1923456785', short: 'Jus lidah buaya murni untuk pencernaan.', desc: 'Jus lidah buaya 100% tanpa pengawet untuk kesehatan pencernaan.', benefits: ['Melancarkan pencernaan', 'Melembutkan kulit dari dalam', 'Vitamin alami'], ingredients: 'Lidah Buaya 100%, Madu.', usage: 'Minum 30ml sehari.', stock: 90 },
  // BEAUTY
  { name: 'SR12 Matte Lipstick Velvet', cat: 'Beauty', catSlug: 'beauty', price: 95000, discount: 30, imageId: 2533266, galleryIds: [2533266, 2533267, 2533268], tags: ['beauty', 'makeup'], badges: ['best-seller', 'bpom', 'halal'], bpom: 'BPOM NA 1823456781', short: 'Lipstick matte tahan lama 12 jam.', desc: 'Lipstick matte dengan formula velvet yang ringan, tahan hingga 12 jam tanpa membuat bibir kering.', benefits: ['Tahan lama 12 jam', 'Tidak membuat bibir kering', 'Warna pigmen tinggi'], ingredients: 'Castor Oil, Vitamin E, Mika, Beeswax.', usage: 'Aplikasikan pada bibir secara merata.', bestSeller: true, stock: 75 },
  { name: 'SR12 Cushion Foundation Glow', cat: 'Beauty', catSlug: 'beauty', price: 145000, discount: 20, imageId: 2533267, galleryIds: [2533267, 2533266], tags: ['beauty', 'makeup'], badges: ['new-arrival', 'bpom'], bpom: 'BPOM NA 1823456782', short: 'Cushion foundation finish glowing natural.', desc: 'Cushion foundation dengan coverage buildable dan finish glowing natural, dilengkapi SPF 30.', benefits: ['SPF 30 PA+++', 'Coverage buildable', 'Finish glowing alami'], ingredients: 'Niacinamide, Hyaluronic Acid, Titanium Dioxide.', usage: 'Tap dengan sponge pada wajah.', isNew: true, stock: 60 },
  { name: 'SR12 Eyeshadow Palette Nude', cat: 'Beauty', catSlug: 'beauty', price: 125000, discount: 15, imageId: 2533268, galleryIds: [2533268, 2533266], tags: ['beauty', 'makeup'], badges: ['limited', 'bpom'], bpom: 'BPOM NA 1823456783', short: 'Palette eyeshadow 12 shade nude.', desc: 'Palette eyeshadow 12 warna dengan kombinasi matte dan shimmer untuk look nude sehari-hari.', benefits: ['12 shade nude', 'Matte & shimmer', 'Pigmen tinggi blendable'], ingredients: 'Mika, Talc, Dimethicone, Vitamin E.', usage: 'Aplikasikan dengan kuas eyeshadow.', limited: true, stock: 40 },
  { name: 'SR12 Lip Tint Cherry', cat: 'Beauty', catSlug: 'beauty', price: 65000, discount: 10, imageId: 2533269, galleryIds: [2533269, 2533266], tags: ['beauty', 'makeup'], badges: ['bpom', 'halal'], bpom: 'BPOM NA 1823456784', short: 'Lip tint cherry dengan finish segar.', desc: 'Lip tint ringan dengan warna cherry segar, tahan lama dan tidak lengket.', benefits: ['Tahan lama', 'Ringan tidak lengket', 'Warna cherry segar'], ingredients: 'Water, Glycerin, Castor Oil, Colorant.', usage: 'Aplikasikan tipis pada bibir.', stock: 110 },
  { name: 'SR12 Blush On Rosy', cat: 'Beauty', catSlug: 'beauty', price: 78000, discount: 0, imageId: 2533270, galleryIds: [2533270, 2533266], tags: ['beauty', 'makeup'], badges: ['bpom'], bpom: 'BPOM NA 1823456785', short: 'Blush on powder finish rosy natural.', desc: 'Blush on powder halus dengan warna rosy natural, mudah di-blend dan tahan lama.', benefits: ['Warna rosy natural', 'Mudah di-blend', 'Tahan lama'], ingredients: 'Talc, Mika, Dimethicone.', usage: 'Aplikasikan pada pipi dengan kuas.', stock: 95 },
  // FACE CARE
  { name: 'SR12 Vitamin C Serum 10%', cat: 'Face Care', catSlug: 'face-care', price: 120000, discount: 25, imageId: 3018845, galleryIds: [3018845, 3018846, 3018847], tags: ['brightening', 'face-care'], badges: ['best-seller', 'bpom'], bpom: 'BPOM NA 1823456791', short: 'Serum vitamin C 10% untuk wajah cerah.', desc: 'Serum dengan 10% Vitamin C murni untuk mencerahkan wajah, menyamarkan noda hitam, dan melindungi dari radikal bebas.', benefits: ['Mencerahkan wajah', 'Menyamarkan noda hitam', 'Antioksidan'], ingredients: 'Aqua, Ethyl Ascorbic Acid 10%, Hyaluronic Acid, Glycerin.', usage: 'Pakai 3-4 tetes pagi & malam sebelum moisturizer.', bestSeller: true, stock: 85 },
  { name: 'SR12 Hyaluronic Acid Serum', cat: 'Face Care', catSlug: 'face-care', price: 110000, discount: 15, imageId: 3018846, galleryIds: [3018846, 3018845], tags: ['face-care', 'brightening'], badges: ['new-arrival', 'bpom'], bpom: 'BPOM NA 1823456792', short: 'Serum hyaluronic acid melembapkan intens.', desc: 'Serum dengan multi-weight hyaluronic acid untuk hidrasi intens hingga lapisan kulit terdalam.', benefits: ['Hidrasi intens', 'Mengencangkan kulit', 'Cocok semua jenis kulit'], ingredients: 'Aqua, Sodium Hyaluronate 2%, Glycerin, Panthenol.', usage: 'Pakai 3-4 tetes setelah toner.', isNew: true, stock: 70 },
  { name: 'SR12 Niacinamide 5% Serum', cat: 'Face Care', catSlug: 'face-care', price: 98000, discount: 20, imageId: 3018847, galleryIds: [3018847, 3018845], tags: ['acne', 'face-care'], badges: ['best-seller', 'bpom'], bpom: 'BPOM NA 1823456793', short: 'Serum niacinamide 5% untuk pori & jerawat.', desc: 'Serum niacinamide 5% untuk mengecilkan pori-pori dan mengontrol produksi minyak berlebih.', benefits: ['Mengecilkan pori-pori', 'Kontrol minyak', 'Meredakan jerawat'], ingredients: 'Aqua, Niacinamide 5%, Zinc PCA, Glycerin.', usage: 'Pakai 3-4 tetes malam hari.', bestSeller: true, stock: 100 },
  { name: 'SR12 Gentle Facial Cleanser', cat: 'Face Care', catSlug: 'face-care', price: 65000, discount: 10, imageId: 3018848, galleryIds: [3018848, 3018845], tags: ['face-care'], badges: ['bpom', 'halal'], bpom: 'BPOM NA 1823456794', short: 'Sabun wajah lembut pH 5.5.', desc: 'Facial cleanser dengan pH 5.5 yang lembut, membersihkan tanpa membuat kulit kering.', benefits: ['pH 5.5 seimbang', 'Membersihkan tanpa kering', 'Cocok kulit sensitif'], ingredients: 'Aqua, Coco-Glucoside, Glycerin, Aloe Vera.', usage: 'Gunakan 2x sehari saat mencuci wajah.', stock: 130 },
  { name: 'SR12 Sunscreen SPF 50 PA++++', cat: 'Face Care', catSlug: 'face-care', price: 89000, discount: 0, imageId: 3018849, galleryIds: [3018849, 3018845], tags: ['face-care', 'brightening'], badges: ['bpom'], bpom: 'BPOM NA 1823456795', short: 'Sunscreen ringan SPF 50 PA++++.', desc: 'Sunscreen non-greasy dengan SPF 50 PA++++ untuk perlindungan maksimal dari UVA/UVB.', benefits: ['SPF 50 PA++++', 'Non-greasy', 'No white cast'], ingredients: 'Aqua, Ethylhexyl Methoxycinnamate, Zinc Oxide, Niacinamide.', usage: 'Aplikasikan 15 menit sebelum aktivitas luar.', stock: 90 },
  // BODY CARE
  { name: 'SR12 Body Lotion Shea Butter', cat: 'Body Care', catSlug: 'body-care', price: 75000, discount: 20, imageId: 4202325, galleryIds: [4202325, 4202326], tags: ['body-care'], badges: ['best-seller', 'bpom', 'halal'], bpom: 'BPOM NA 1823456801', short: 'Body lotion shea butter melembapkan 24 jam.', desc: 'Body lotion dengan shea butter dan vitamin E untuk kulit tubuh lembap hingga 24 jam.', benefits: ['Lembap 24 jam', 'Shea butter alami', 'Cepat meresap'], ingredients: 'Aqua, Shea Butter, Glycerin, Vitamin E.', usage: 'Aplikasikan ke seluruh tubuh setelah mandi.', bestSeller: true, stock: 140 },
  { name: 'SR12 Body Wash Aromatherapy', cat: 'Body Care', catSlug: 'body-care', price: 55000, discount: 15, imageId: 4202326, galleryIds: [4202326, 4202325], tags: ['body-care'], badges: ['bpom'], bpom: 'BPOM NA 1823456802', short: 'Body wash aromaterapi relaksasi spa.', desc: 'Body wash dengan essential oil lavender dan chamomile untuk sensasi spa di rumah.', benefits: ['Aromaterapi relaksasi', 'Membersihkan lembut', 'Buih lembut'], ingredients: 'Aqua, Sodium Laureth Sulfate, Lavender Oil, Chamomile Extract.', usage: 'Tuangkan pada spons, usap ke tubuh.', stock: 120 },
  { name: 'SR12 Body Scrub Coffee', cat: 'Body Care', catSlug: 'body-care', price: 68000, discount: 25, imageId: 4202327, galleryIds: [4202327, 4202325], tags: ['body-care'], badges: ['new-arrival', 'bpom'], bpom: 'BPOM NA 1823456803', short: 'Body scrub kopi mengangkat sel kulit mati.', desc: 'Body scrub dengan kopi arabika untuk mengangkat sel kulit mati dan mengencangkan kulit.', benefits: ['Mengangkat sel kulit mati', 'Mengencangkan kulit', 'Aroma kopi menyegarkan'], ingredients: 'Coffea Arabica, Glycerin, Coconut Oil, Sugar.', usage: 'Gosok lembut pada kulit basah, bilas.', isNew: true, stock: 80 },
  { name: 'SR12 Hand Cream Lavender', cat: 'Body Care', catSlug: 'body-care', price: 42000, discount: 0, imageId: 4202328, galleryIds: [4202328, 4202325], tags: ['body-care'], badges: ['bpom'], bpom: 'BPOM NA 1823456804', short: 'Hand cream lavender melembutkan tangan.', desc: 'Hand cream ringan dengan lavender untuk tangan lembut dan wangi sepanjang hari.', benefits: ['Melembutkan tangan', 'Aroma lavender', 'Cepat meresap'], ingredients: 'Aqua, Glycerin, Lavender Oil, Shea Butter.', usage: 'Aplikasikan ke tangan kapan saja.', stock: 160 },
  // PERSONAL CARE
  { name: 'SR12 Herbal Shampoo Aloe', cat: 'Personal Care', catSlug: 'personal-care', price: 58000, discount: 20, imageId: 4202924, galleryIds: [4202924, 4202925], tags: ['hair-care', 'personal-care'], badges: ['best-seller', 'bpom', 'halal'], bpom: 'BPOM NA 1823456811', short: 'Shampoo herbal aloe vera untuk rambut sehat.', desc: 'Shampoo dengan ekstrak aloe vera dan ginseng untuk rambut sehat, lembut, dan tidak mudah rontok.', benefits: ['Mengurangi rontok', 'Rambut lembut', 'Bahan herbal'], ingredients: 'Aqua, Aloe Vera Extract, Ginseng, Sodium Laureth Sulfate.', usage: 'Gunakan 2-3x seminggu.', bestSeller: true, stock: 110 },
  { name: 'SR12 Conditioner Argan Oil', cat: 'Personal Care', catSlug: 'personal-care', price: 62000, discount: 15, imageId: 4202925, galleryIds: [4202925, 4202924], tags: ['hair-care', 'personal-care'], badges: ['bpom'], bpom: 'BPOM NA 1823456812', short: 'Conditioner argan oil untuk rambut halus.', desc: 'Conditioner dengan argan oil maroko untuk rambut halus, berkilau, dan mudah ditata.', benefits: ['Rambut berkilau', 'Mudah ditata', 'Argan oil maroko'], ingredients: 'Aqua, Argania Spinosa Oil, Glycerin, Panthenol.', usage: 'Setelah shampoo, diamkan 3 menit, bilas.', stock: 95 },
  { name: 'SR12 Natural Toothpaste Mint', cat: 'Personal Care', catSlug: 'personal-care', price: 32000, discount: 10, imageId: 4202926, galleryIds: [4202926, 4202924], tags: ['personal-care'], badges: ['bpom', 'halal'], bpom: 'BPOM NA 1823456813', short: 'Pasta gigi herbal mint alami.', desc: 'Pasta gigi dengan minyak peppermint dan ekstrak sirih untuk gigi sehat dan napas segar.', benefits: ['Gigi sehat', 'Napas segar', 'Tanpa SLS'], ingredients: 'Calcium Carbonate, Peppermint Oil, Sirih Extract.', usage: 'Sikat gigi 2x sehari.', stock: 200 },
  { name: 'SR12 Deodorant Roll-On Natural', cat: 'Personal Care', catSlug: 'personal-care', price: 38000, discount: 0, imageId: 4202927, galleryIds: [4202927, 4202924], tags: ['personal-care'], badges: ['new-arrival', 'bpom'], bpom: 'BPOM NA 1823456814', short: 'Deodorant roll-on tanpa aluminium.', desc: 'Deodorant roll-on natural tanpa aluminium dan paraben, aman untuk kulit sensitif.', benefits: ['Tanpa aluminium', 'Aman kulit sensitif', 'Tahan 24 jam'], ingredients: 'Aqua, Aloe Vera, Zinc Ricinoleate, Essential Oil.', usage: 'Aplikasikan ke ketiak bersih.', isNew: true, stock: 130 },
  // BABY & KIDS
  { name: 'SR12 Baby Lotion Calendula', cat: 'Baby & Kids', catSlug: 'baby-kids', price: 68000, discount: 15, imageId: 3933254, galleryIds: [3933254, 3933255], tags: ['baby-kids'], badges: ['bpom', 'halal'], bpom: 'BPOM NA 1823456821', short: 'Lotion bayi calendula lembut dan aman.', desc: 'Lotion bayi dengan ekstrak calendula yang lembut dan aman untuk kulit sensitif bayi.', benefits: ['Lembut untuk bayi', 'Calendula alami', 'Bebas parfum keras'], ingredients: 'Aqua, Calendula Extract, Shea Butter, Panthenol.', usage: 'Aplikasikan ke kulit bayi setelah mandi.', stock: 90 },
  { name: 'SR12 Baby Shampoo Tear-Free', cat: 'Baby & Kids', catSlug: 'baby-kids', price: 55000, discount: 10, imageId: 3933255, galleryIds: [3933255, 3933254], tags: ['baby-kids'], badges: ['best-seller', 'bpom', 'halal'], bpom: 'BPOM NA 1823456822', short: 'Shampoo bayi bebas air mata.', desc: 'Shampoo bayi dengan formula tear-free yang lembut membersihkan tanpa perih di mata.', benefits: ['Tear-free', 'Lembut di mata', 'Rambut lembut'], ingredients: 'Aqua, Coco-Glucoside, Aloe Vera, Chamomile.', usage: 'Gunakan sedikit saat mandi bayi.', bestSeller: true, stock: 120 },
  { name: 'SR12 Baby Oil Lavender', cat: 'Baby & Kids', catSlug: 'baby-kids', price: 48000, discount: 0, imageId: 3933256, galleryIds: [3933256, 3933254], tags: ['baby-kids'], badges: ['bpom', 'halal'], bpom: 'BPOM NA 1823456823', short: 'Minyak bayi lavender untuk pijat lembut.', desc: 'Minyak bayi dengan lavender untuk pijat lembut yang menenangkan dan menjaga kelembapan.', benefits: ['Menenangkan bayi', 'Melembapkan', 'Aroma lavender lembut'], ingredients: 'Mineral Oil, Lavender Oil, Vitamin E.', usage: 'Tuang sedikit, pijat lembut ke kulit bayi.', stock: 85 },
  // SUPPLEMENTS
  { name: 'SR12 Multivitamin Daily', cat: 'Supplements', catSlug: 'supplements', price: 135000, discount: 20, imageId: 3683074, galleryIds: [3683074, 3683075], tags: ['immunity', 'supplements'], badges: ['best-seller', 'bpom', 'halal'], bpom: 'BPOM TR 1923456831', short: 'Multivitamin harian untuk energi & imun.', desc: 'Multivitamin lengkap dengan 13 vitamin dan 9 mineral untuk energi dan imun harian.', benefits: ['13 vitamin 9 mineral', 'Menambah energi', 'Menjaga imun'], ingredients: 'Vitamin A, B, C, D, E, Zinc, Iron, Calcium.', usage: 'Konsumsi 1 tablet sehari setelah sarapan.', bestSeller: true, stock: 100 },
  { name: 'SR12 Omega 3 Fish Oil', cat: 'Supplements', catSlug: 'supplements', price: 115000, discount: 15, imageId: 3683075, galleryIds: [3683075, 3683074], tags: ['supplements', 'immunity'], badges: ['bpom', 'halal'], bpom: 'BPOM TR 1923456832', short: 'Omega 3 fish oil untuk jantung & otak.', desc: 'Softgel omega 3 dari fish oil murni untuk kesehatan jantung dan fungsi otak.', benefits: ['Jantung sehat', 'Fungsi otak optimal', 'EPA & DHA tinggi'], ingredients: 'Fish Oil 1000mg, EPA 180mg, DHA 120mg.', usage: 'Konsumsi 2 softgel sehari.', stock: 90 },
  { name: 'SR12 Vitamin C 1000mg Effervescent', cat: 'Supplements', catSlug: 'supplements', price: 78000, discount: 25, imageId: 3683076, galleryIds: [3683076, 3683074], tags: ['immunity', 'supplements'], badges: ['new-arrival', 'bpom', 'halal'], bpom: 'BPOM TR 1923456833', short: 'Vitamin C 1000mg effervescent segar.', desc: 'Tablet effervescent vitamin C 1000mg dengan rasa jeruk segar untuk imun harian.', benefits: ['Vitamin C 1000mg', 'Rasa jeruk segar', 'Cepat diserap'], ingredients: 'Ascorbic Acid 1000mg, Sodium Bicarbonate, Citrus Flavor.', usage: 'Larutkan 1 tablet ke gelas air.', isNew: true, stock: 150 },
  { name: 'SR12 Collagen Drink 5000mg', cat: 'Supplements', catSlug: 'supplements', price: 185000, discount: 30, imageId: 3683077, galleryIds: [3683077, 3683074], tags: ['anti-aging', 'supplements'], badges: ['limited', 'bpom', 'halal'], bpom: 'BPOM TR 1923456834', short: 'Minuman kolagen 5000mg untuk kulit kenyal.', desc: 'Minuman kolagen marine 5000mg dengan vitamin C untuk kulit kenyal dan bercahaya.', benefits: ['Kulit kenyal', 'Mengurangi kerut', 'Kolagen marine'], ingredients: 'Marine Collagen 5000mg, Vitamin C, Hyaluronic Acid.', usage: 'Minum 1 botol sehari sebelum tidur.', limited: true, stock: 50 },
  // HEALTHY FOOD
  { name: 'SR12 Madu Hutan Murni 500g', cat: 'Healthy Food', catSlug: 'healthy-food', price: 125000, discount: 15, imageId: 56882, galleryIds: [56882, 56883], tags: ['healthy-food', 'immunity'], badges: ['best-seller', 'bpom', 'halal'], bpom: 'BPOM TR 1923456841', short: 'Madu hutan murni 500g tanpa pemanis.', desc: 'Madu hutan murni 100% tanpa pemanis tambahan, kaya antioksidan dan energi alami.', benefits: ['100% murni', 'Kaya antioksidan', 'Energi alami'], ingredients: 'Madu Hutan 100%.', usage: 'Konsumsi 1 sendok makan pagi hari.', bestSeller: true, stock: 130 },
  { name: 'SR12 Kurma Ajwa Premium 500g', cat: 'Healthy Food', catSlug: 'healthy-food', price: 98000, discount: 10, imageId: 7437483, galleryIds: [7437483, 56882], tags: ['healthy-food'], badges: ['bpom', 'halal'], bpom: 'BPOM TR 1923456842', short: 'Kurma ajwa premium 500g Madinah.', desc: 'Kurma ajwa premium dari Madinah, lembut dan manis alami, kaya serat dan zat besi.', benefits: ['Kaya serat', 'Zat besi tinggi', 'Manis alami'], ingredients: 'Kurma Ajwa 100%.', usage: 'Konsumsi 3-5 butir sehari.', stock: 80 },
  { name: 'SR12 Granola Mix Berry', cat: 'Healthy Food', catSlug: 'healthy-food', price: 65000, discount: 20, imageId: 7437484, galleryIds: [7437484, 56882], tags: ['healthy-food'], badges: ['new-arrival', 'bpom', 'halal'], bpom: 'BPOM TR 1923456843', short: 'Granola mix berry untuk sarapan sehat.', desc: 'Granola dengan campuran berry kering dan oat utuh, tinggi serat untuk sarapan sehat.', benefits: ['Tinggi serat', 'Tanpa gula tambahan', 'Berry antioksidan'], ingredients: 'Oat, Cranberry, Blueberry, Almond, Honey.', usage: 'Sajikan dengan susu atau yogurt.', isNew: true, stock: 100 },
  // HOME CARE
  { name: 'SR12 Floor Cleaner Lemon', cat: 'Home Care', catSlug: 'home-care', price: 35000, discount: 15, imageId: 4108715, galleryIds: [4108715, 4108716], tags: ['home-care'], badges: ['bpom'], bpom: 'BPOM TR 1923456851', short: 'Pembersih lantai lemon biodegradable.', desc: 'Pembersih lantai dengan formula biodegradable dan aroma lemon segar, aman untuk keluarga.', benefits: ['Biodegradable', 'Aroma lemon', 'Aman untuk anak'], ingredients: 'Aqua, Citric Acid, Lemon Oil, Surfactant.', usage: 'Larutkan 1 tutup ke 1 liter air.', stock: 180 },
  { name: 'SR12 Dish Wash Plant-Based', cat: 'Home Care', catSlug: 'home-care', price: 42000, discount: 10, imageId: 4108716, galleryIds: [4108716, 4108715], tags: ['home-care'], badges: ['new-arrival', 'bpom'], bpom: 'BPOM TR 1923456852', short: 'Sabun cuci piring plant-based lembut.', desc: 'Sabun cuci piring dari bahan nabati yang lembut di tangan dan ramah lingkungan.', benefits: ['Plant-based', 'Lembut di tangan', 'Ramah lingkungan'], ingredients: 'Aqua, Plant Surfactant, Aloe Vera, Citrus Oil.', usage: 'Tuang sedikit ke spons, cuci piring.', isNew: true, stock: 140 },
  // GIFT PACKAGE
  { name: 'SR12 Wellness Gift Box', cat: 'Gift Package', catSlug: 'gift-package', price: 350000, discount: 20, imageId: 6211262, galleryIds: [6211262, 6211263], tags: ['gift-package'], badges: ['limited', 'official'], bpom: 'BPOM TR 1923456861', short: 'Paket hadiah wellness lengkap premium.', desc: 'Paket hadiah eksklusif berisi herbal, skincare, dan suplemen pilihan dengan kemasan mewah.', benefits: ['Kemasan mewah', 'Isi lengkap', 'Cocok untuk hadiah'], ingredients: 'Isi paket: 3 produk herbal, 2 skincare, 1 suplemen.', usage: 'Buka kemasan, gunakan produk sesuai petunjuk.', limited: true, stock: 25 },
  { name: 'SR12 Beauty Hamper Rose', cat: 'Gift Package', catSlug: 'gift-package', price: 425000, discount: 15, imageId: 6211263, galleryIds: [6211263, 6211262], tags: ['gift-package'], badges: ['limited', 'official'], bpom: 'BPOM TR 1923456862', short: 'Hamper kecantikan tema rose eksklusif.', desc: 'Hamper kecantikan dengan tema rose, berisi lipstick, serum, dan body lotion edisi terbatas.', benefits: ['Edisi terbatas', 'Tema rose elegan', 'Kemasan premium'], ingredients: 'Isi paket: lipstick, serum, body lotion, hand cream.', usage: 'Gunakan produk sesuai petunjuk masing-masing.', limited: true, stock: 15 },
];

export const products: Product[] = seeds.map((s, i) => {
  const originalPrice = s.discount > 0 ? Math.round(s.price / (1 - s.discount / 100)) : undefined;
  return {
    id: `sr12-${i + 1}`,
    slug: s.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    name: s.name,
    category: s.cat,
    categorySlug: s.catSlug,
    price: s.price,
    originalPrice,
    discount: s.discount || undefined,
    image: img(s.imageId, 800),
    images: s.galleryIds.map((id) => ({ url: img(id, 1200) })),
    rating: 4 + ((i % 10) / 10),
    reviewCount: 24 + (i * 7) % 180,
    description: s.desc,
    shortDescription: s.short,
    benefits: s.benefits,
    ingredients: s.ingredients,
    usage: s.usage,
    bpom: s.bpom,
    halal: s.badges.includes('halal'),
    stock: s.stock,
    tags: s.tags,
    badges: s.badges,
    reviews: makeReviews(i + 1, 3),
    bestSeller: s.bestSeller,
    isNew: s.isNew,
    limited: s.limited,
  };
});

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(slug: string) {
  return products.filter((p) => p.categorySlug === slug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id)
    .slice(0, limit);
}

export const blogPosts: BlogPost[] = [
  {
    id: 'b1',
    slug: 'manfaat-habbatussauda',
    title: '7 Manfaat Habbatussauda untuk Kesehatan Tubuh',
    excerpt: 'Tanaman habbatussauda dikenal sebagai obat segala penyakit. Simak manfaatnya untuk imunitas dan kesehatan harian.',
    category: 'Herbal Education',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
    author: 'Tim SR12',
    date: '2024-06-12',
    readTime: '5 menit',
  },
  {
    id: 'b2',
    slug: 'rutin-skincare-pagi',
    title: 'Rutin Skincare Pagi untuk Pemula',
    excerpt: 'Belum tahu urutan skincare pagi? Ini panduan lengkap untuk pemula dengan produk yang tepat.',
    category: 'Skincare Guide',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
    author: 'Dewi Lestari',
    date: '2024-06-20',
    readTime: '6 menit',
  },
  {
    id: 'b3',
    slug: 'tips-brightening-wajah',
    title: '5 Tips Brightening Wajah Secara Alami',
    excerpt: 'Wajah kusam? Ikuti 5 tips sederhana untuk mencerahkan wajah dengan bahan alami dan produk yang tepat.',
    category: 'Beauty Tips',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
    author: 'Putri Anggraini',
    date: '2024-07-01',
    readTime: '4 menit',
  },
  {
    id: 'b4',
    slug: 'menjaga-imun-keluarga',
    title: 'Cara Menjaga Imun Keluarga di Musim Hujan',
    excerpt: 'Musim hujan identik dengan flu. Begini cara menjaga imun keluarga dengan suplemen dan herbal alami.',
    category: 'Health Tips',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=800&auto=format&fit=crop',
    author: 'Tim SR12',
    date: '2024-07-10',
    readTime: '7 menit',
  },
];

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Siti Rahmawati',
    location: 'Jakarta',
    avatar: avatarImgs[0],
    rating: 5,
    comment: 'Produk herbal SR12 benar-benar berkualitas. Setelah rutin konsumsi habbatussauda, saya jarang sakit lagi!',
    product: 'SR12 Habbatussauda Capsule',
  },
  {
    id: 't2',
    name: 'Dewi Lestari',
    location: 'Bandung',
    avatar: avatarImgs[1],
    rating: 5,
    comment: 'Serum vitamin C-nya bikin wajah cerah banget. Packing rapi, pengiriman cepat. Recommended!',
    product: 'SR12 Vitamin C Serum 10%',
  },
  {
    id: 't3',
    name: 'Ahmad Fauzi',
    location: 'Surabaya',
    avatar: avatarImgs[2],
    rating: 5,
    comment: 'Multivitamin SR12 jadi andalan keluarga. Anak-anak juga suka karena effervescent-nya enak.',
    product: 'SR12 Vitamin C 1000mg Effervescent',
  },
  {
    id: 't4',
    name: 'Maya Sari',
    location: 'Yogyakarta',
    avatar: avatarImgs[3],
    rating: 5,
    comment: 'Lipstick matte-nya tahan lama banget, warnanya juga cantik. Akan repurchase!',
    product: 'SR12 Matte Lipstick Velvet',
  },
  {
    id: 't5',
    name: 'Rina Wijaya',
    location: 'Medan',
    avatar: avatarImgs[4],
    rating: 5,
    comment: 'Body scrub kopinya wangi banget dan kulit jadi halus. Sensasi spa di rumah!',
    product: 'SR12 Body Scrub Coffee',
  },
];

export const whyChoose = [
  { icon: 'Leaf', title: 'Pilihan Produk Herbal', desc: 'Menyediakan beragam pilihan produk herbal dan kebutuhan kesehatan untuk melengkapi kebutuhan Anda dan keluarga.' },
  { icon: 'Landmark', title: 'Spesialis Oleh-Oleh Umrah & Haji', desc: 'Pilihan produk yang cocok dijadikan buah tangan untuk keluarga, kerabat, sahabat, maupun rekan kerja setelah pulang dari Tanah Suci.' },
  { icon: 'Gift', title: 'Paket Oleh-Oleh Praktis', desc: 'Tersedia pilihan paket yang praktis untuk memudahkan jamaah menyiapkan oleh-oleh tanpa harus repot memilih satu per satu.' },
  { icon: 'Package', title: 'Bisa Pesan Jumlah Banyak', desc: 'Melayani kebutuhan personal hingga pemesanan dalam jumlah besar untuk jamaah, keluarga, komunitas, maupun perusahaan.' },
  { icon: 'SlidersHorizontal', title: 'Bisa Disesuaikan dengan Kebutuhan', desc: 'Pilihan produk dan paket dapat dikonsultasikan sesuai kebutuhan, jumlah penerima, dan anggaran.' },
  { icon: 'ShieldCheck', title: 'Produk Terpercaya', desc: 'Mengutamakan produk yang jelas asal-usulnya dan memenuhi ketentuan serta perizinan yang berlaku sesuai kategori produknya.' },
  { icon: 'Truck', title: 'Pengiriman Praktis', desc: 'Pesanan dapat dikirim ke berbagai wilayah Indonesia sehingga Anda tidak perlu repot membawa atau mencari oleh-oleh sendiri.' },
  { icon: 'Headphones', title: 'Dibantu Tim yang Responsif', desc: 'Tim Randumart siap membantu memilih produk, menentukan paket, hingga proses pemesanan dan pengiriman.' },
];

export const stats = [
  { label: 'Total Products', value: 380, suffix: '+' },
  { label: 'Happy Customers', value: 25000, suffix: '+' },
  { label: 'Years Experience', value: 12, suffix: '' },
  { label: 'Orders Completed', value: 85000, suffix: '+' },
];
