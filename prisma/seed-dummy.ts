import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const categoryImages: Record<string, string[]> = {
  herbal: [
    'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=800&auto=format&fit=crop',
  ],
  beauty: [
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1631214524020-7e18db9a8f92?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop',
  ],
  "face-care": [
    'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop',
  ],
  "body-care": [
    'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556227834-09f1de7a7d14?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599305090598-fe179d501227?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop',
  ],
  "personal-care": [
    'https://images.unsplash.com/photo-1585232004423-244e0e6904e3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1626784215021-2e39ccf971cd?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1607006344380-b6775a0824a7?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&auto=format&fit=crop',
  ],
  "baby-kids": [
    'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop',
  ],
  supplements: [
    'https://images.unsplash.com/photo-1550572017-4fcdbb59cc32?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&auto=format&fit=crop',
  ],
  "healthy-food": [
    'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1490885578174-acda8905c2c6?w=800&auto=format&fit=crop',
  ],
  "home-care": [
    'https://images.unsplash.com/photo-1563453392212-326f5e854473?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=800&auto=format&fit=crop',
  ],
  "gift-package": [
    'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800&auto=format&fit=crop',
  ],
};

function getImages(catSlug: string, productIndex: number, count: number): string[] {
  const pool = categoryImages[catSlug] || categoryImages['beauty'];
  const result: string[] = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[(productIndex + i) % pool.length]);
  }
  return result;
}

interface SeedProduct {
  name: string;
  cat: string;
  catSlug: string;
  price: number;
  discount: number;
  galleryCount: number;
  tags: string[];
  short: string;
  desc: string;
  bestSeller?: boolean;
  isNew?: boolean;
  stock: number;
}

const seeds: SeedProduct[] = [
  // HERBAL
  { name: 'SR12 Habbatussauda Capsule', cat: 'Herbal', catSlug: 'herbal', price: 85000, discount: 20, galleryCount: 3, tags: ['immunity', 'herbal'], short: 'Kapsul habbatussauda murni untuk imun tubuh.', desc: 'Kapsul ekstrak habbatussauda (Nigella sativa) premium pilihan, diproses dengan teknologi modern tanpa bahan kimia. Membantu menjaga daya tahan tubuh dan kesehatan pernapasan.', bestSeller: true, stock: 120 },
  { name: 'SR12 Kunyit Asem Drink', cat: 'Herbal', catSlug: 'herbal', price: 35000, discount: 15, galleryCount: 2, tags: ['herbal', 'immunity'], short: 'Minuman tradisional kunyit asem segar.', desc: 'Jamu kunyit asem tradisional dengan rasa segar, diproduksi secara higienis.', isNew: true, stock: 200 },
  { name: 'SR12 Daun Sirih Extract', cat: 'Herbal', catSlug: 'herbal', price: 45000, discount: 10, galleryCount: 2, tags: ['herbal'], short: 'Ekstrak daun sirih untuk kebersihan intim.', desc: 'Ekstrak daun sirih murni dalam kemasan praktis untuk menjaga kebersihan area kewanitaan.', stock: 80 },
  { name: 'SR12 Temulawak Plus Capsule', cat: 'Herbal', catSlug: 'herbal', price: 55000, discount: 25, galleryCount: 2, tags: ['herbal', 'immunity'], short: 'Kapsul temulawak untuk kesehatan hati.', desc: 'Kapsul temulawak berkualitas tinggi untuk menjaga kesehatan hati dan pencernaan.', bestSeller: true, stock: 150 },
  { name: 'SR12 Lidah Buaya Juice', cat: 'Herbal', catSlug: 'herbal', price: 40000, discount: 0, galleryCount: 1, tags: ['herbal'], short: 'Jus lidah buaya murni untuk pencernaan.', desc: 'Jus lidah buaya 100% tanpa pengawet untuk kesehatan pencernaan.', stock: 90 },
  // BEAUTY
  { name: 'SR12 Matte Lipstick Velvet', cat: 'Beauty', catSlug: 'beauty', price: 95000, discount: 30, galleryCount: 3, tags: ['beauty', 'makeup'], short: 'Lipstick matte tahan lama 12 jam.', desc: 'Lipstick matte dengan formula velvet yang ringan, tahan hingga 12 jam tanpa membuat bibir kering.', bestSeller: true, stock: 75 },
  { name: 'SR12 Cushion Foundation Glow', cat: 'Beauty', catSlug: 'beauty', price: 145000, discount: 20, galleryCount: 2, tags: ['beauty', 'makeup'], short: 'Cushion foundation finish glowing natural.', desc: 'Cushion foundation dengan coverage buildable dan finish glowing natural, dilengkapi SPF 30.', isNew: true, stock: 60 },
  { name: 'SR12 Eyeshadow Palette Nude', cat: 'Beauty', catSlug: 'beauty', price: 125000, discount: 15, galleryCount: 2, tags: ['beauty', 'makeup'], short: 'Palette eyeshadow 12 shade nude.', desc: 'Palette eyeshadow 12 warna dengan kombinasi matte dan shimmer untuk look nude sehari-hari.', stock: 40 },
  { name: 'SR12 Lip Tint Cherry', cat: 'Beauty', catSlug: 'beauty', price: 65000, discount: 10, galleryCount: 2, tags: ['beauty', 'makeup'], short: 'Lip tint cherry dengan finish segar.', desc: 'Lip tint ringan dengan warna cherry segar, tahan lama dan tidak lengket.', stock: 110 },
  { name: 'SR12 Blush On Rosy', cat: 'Beauty', catSlug: 'beauty', price: 78000, discount: 0, galleryCount: 2, tags: ['beauty', 'makeup'], short: 'Blush on powder finish rosy natural.', desc: 'Blush on powder halus dengan warna rosy natural, mudah di-blend dan tahan lama.', stock: 95 },
  // FACE CARE
  { name: 'SR12 Vitamin C Serum 10%', cat: 'Face Care', catSlug: 'face-care', price: 120000, discount: 25, galleryCount: 3, tags: ['brightening', 'face-care'], short: 'Serum vitamin C 10% untuk wajah cerah.', desc: 'Serum dengan 10% Vitamin C murni untuk mencerahkan wajah, menyamarkan noda hitam, dan melindungi dari radikal bebas.', bestSeller: true, stock: 85 },
  { name: 'SR12 Hyaluronic Acid Serum', cat: 'Face Care', catSlug: 'face-care', price: 110000, discount: 15, galleryCount: 2, tags: ['face-care', 'brightening'], short: 'Serum hyaluronic acid melembapkan intens.', desc: 'Serum dengan multi-weight hyaluronic acid untuk hidrasi intens hingga lapisan kulit terdalam.', isNew: true, stock: 70 },
  { name: 'SR12 Niacinamide 5% Serum', cat: 'Face Care', catSlug: 'face-care', price: 98000, discount: 20, galleryCount: 2, tags: ['acne', 'face-care'], short: 'Serum niacinamide 5% untuk pori & jerawat.', desc: 'Serum niacinamide 5% untuk mengecilkan pori-pori dan mengontrol produksi minyak berlebih.', bestSeller: true, stock: 100 },
  { name: 'SR12 Gentle Facial Cleanser', cat: 'Face Care', catSlug: 'face-care', price: 65000, discount: 10, galleryCount: 2, tags: ['face-care'], short: 'Sabun wajah lembut pH 5.5.', desc: 'Facial cleanser dengan pH 5.5 yang lembut, membersihkan tanpa membuat kulit kering.', stock: 130 },
  { name: 'SR12 Sunscreen SPF 50 PA++++', cat: 'Face Care', catSlug: 'face-care', price: 89000, discount: 0, galleryCount: 2, tags: ['face-care', 'brightening'], short: 'Sunscreen ringan SPF 50 PA++++.', desc: 'Sunscreen non-greasy dengan SPF 50 PA++++ untuk perlindungan maksimal dari UVA/UVB.', stock: 90 },
  // BODY CARE
  { name: 'SR12 Body Lotion Shea Butter', cat: 'Body Care', catSlug: 'body-care', price: 75000, discount: 20, galleryCount: 2, tags: ['body-care'], short: 'Body lotion shea butter melembapkan 24 jam.', desc: 'Body lotion dengan shea butter dan vitamin E untuk kulit tubuh lembap hingga 24 jam.', bestSeller: true, stock: 140 },
  { name: 'SR12 Body Wash Aromatherapy', cat: 'Body Care', catSlug: 'body-care', price: 55000, discount: 15, galleryCount: 2, tags: ['body-care'], short: 'Body wash aromaterapi relaksasi spa.', desc: 'Body wash dengan essential oil lavender dan chamomile untuk sensasi spa di rumah.', stock: 120 },
  { name: 'SR12 Body Scrub Coffee', cat: 'Body Care', catSlug: 'body-care', price: 68000, discount: 25, galleryCount: 2, tags: ['body-care'], short: 'Body scrub kopi mengangkat sel kulit mati.', desc: 'Body scrub dengan kopi arabika untuk mengangkat sel kulit mati dan mengencangkan kulit.', isNew: true, stock: 80 },
  { name: 'SR12 Hand Cream Lavender', cat: 'Body Care', catSlug: 'body-care', price: 42000, discount: 0, galleryCount: 2, tags: ['body-care'], short: 'Hand cream lavender melembutkan tangan.', desc: 'Hand cream ringan dengan lavender untuk tangan lembut dan wangi sepanjang hari.', stock: 160 },
  // PERSONAL CARE
  { name: 'SR12 Herbal Shampoo Aloe', cat: 'Personal Care', catSlug: 'personal-care', price: 58000, discount: 20, galleryCount: 2, tags: ['hair-care', 'personal-care'], short: 'Shampoo herbal aloe vera untuk rambut sehat.', desc: 'Shampoo dengan ekstrak aloe vera dan ginseng untuk rambut sehat, lembut, dan tidak mudah rontok.', bestSeller: true, stock: 110 },
  { name: 'SR12 Conditioner Argan Oil', cat: 'Personal Care', catSlug: 'personal-care', price: 62000, discount: 15, galleryCount: 2, tags: ['hair-care', 'personal-care'], short: 'Conditioner argan oil untuk rambut halus.', desc: 'Conditioner dengan argan oil maroko untuk rambut halus, berkilau, dan mudah ditata.', stock: 95 },
  { name: 'SR12 Natural Toothpaste Mint', cat: 'Personal Care', catSlug: 'personal-care', price: 32000, discount: 10, galleryCount: 2, tags: ['personal-care'], short: 'Pasta gigi herbal mint alami.', desc: 'Pasta gigi dengan minyak peppermint dan ekstrak sirih untuk gigi sehat dan napas segar.', stock: 200 },
  { name: 'SR12 Deodorant Roll-On Natural', cat: 'Personal Care', catSlug: 'personal-care', price: 38000, discount: 0, galleryCount: 2, tags: ['personal-care'], short: 'Deodorant roll-on tanpa aluminium.', desc: 'Deodorant roll-on natural tanpa aluminium dan paraben, aman untuk kulit sensitif.', isNew: true, stock: 130 },
  // BABY & KIDS
  { name: 'SR12 Baby Lotion Calendula', cat: 'Baby & Kids', catSlug: 'baby-kids', price: 68000, discount: 15, galleryCount: 2, tags: ['baby-kids'], short: 'Lotion bayi calendula lembut dan aman.', desc: 'Lotion bayi dengan ekstrak calendula yang lembut dan aman untuk kulit sensitif bayi.', stock: 90 },
  { name: 'SR12 Baby Shampoo Tear-Free', cat: 'Baby & Kids', catSlug: 'baby-kids', price: 55000, discount: 10, galleryCount: 2, tags: ['baby-kids'], short: 'Shampoo bayi bebas air mata.', desc: 'Shampoo bayi dengan formula tear-free yang lembut membersihkan tanpa perih di mata.', bestSeller: true, stock: 120 },
  { name: 'SR12 Baby Oil Lavender', cat: 'Baby & Kids', catSlug: 'baby-kids', price: 48000, discount: 0, galleryCount: 2, tags: ['baby-kids'], short: 'Minyak bayi lavender untuk pijat lembut.', desc: 'Minyak bayi dengan lavender untuk pijat lembut yang menenangkan dan menjaga kelembapan.', stock: 85 },
  // SUPPLEMENTS
  { name: 'SR12 Multivitamin Daily', cat: 'Supplements', catSlug: 'supplements', price: 135000, discount: 20, galleryCount: 2, tags: ['immunity', 'supplements'], short: 'Multivitamin harian untuk energi & imun.', desc: 'Multivitamin lengkap dengan 13 vitamin dan 9 mineral untuk energi dan imun harian.', bestSeller: true, stock: 100 },
  { name: 'SR12 Omega 3 Fish Oil', cat: 'Supplements', catSlug: 'supplements', price: 115000, discount: 15, galleryCount: 2, tags: ['supplements', 'immunity'], short: 'Omega 3 fish oil untuk jantung & otak.', desc: 'Softgel omega 3 dari fish oil murni untuk kesehatan jantung dan fungsi otak.', stock: 90 },
  { name: 'SR12 Vitamin C 1000mg Effervescent', cat: 'Supplements', catSlug: 'supplements', price: 78000, discount: 25, galleryCount: 2, tags: ['immunity', 'supplements'], short: 'Vitamin C 1000mg effervescent segar.', desc: 'Tablet effervescent vitamin C 1000mg dengan rasa jeruk segar untuk imun harian.', isNew: true, stock: 150 },
  { name: 'SR12 Collagen Drink 5000mg', cat: 'Supplements', catSlug: 'supplements', price: 185000, discount: 30, galleryCount: 2, tags: ['anti-aging', 'supplements'], short: 'Minuman kolagen 5000mg untuk kulit kenyal.', desc: 'Minuman kolagen marine 5000mg dengan vitamin C untuk kulit kenyal dan bercahaya.', stock: 50 },
  // HEALTHY FOOD
  { name: 'SR12 Madu Hutan Murni 500g', cat: 'Healthy Food', catSlug: 'healthy-food', price: 125000, discount: 15, galleryCount: 2, tags: ['healthy-food', 'immunity'], short: 'Madu hutan murni 500g tanpa pemanis.', desc: 'Madu hutan murni 100% tanpa pemanis tambahan, kaya antioksidan dan energi alami.', bestSeller: true, stock: 130 },
  { name: 'SR12 Kurma Ajwa Premium 500g', cat: 'Healthy Food', catSlug: 'healthy-food', price: 98000, discount: 10, galleryCount: 2, tags: ['healthy-food'], short: 'Kurma ajwa premium 500g Madinah.', desc: 'Kurma ajwa premium dari Madinah, lembut dan manis alami, kaya serat dan zat besi.', stock: 80 },
  { name: 'SR12 Granola Mix Berry', cat: 'Healthy Food', catSlug: 'healthy-food', price: 65000, discount: 20, galleryCount: 2, tags: ['healthy-food'], short: 'Granola mix berry untuk sarapan sehat.', desc: 'Granola dengan campuran berry kering dan oat utuh, tinggi serat untuk sarapan sehat.', isNew: true, stock: 100 },
  // HOME CARE
  { name: 'SR12 Floor Cleaner Lemon', cat: 'Home Care', catSlug: 'home-care', price: 35000, discount: 15, galleryCount: 2, tags: ['home-care'], short: 'Pembersih lantai lemon biodegradable.', desc: 'Pembersih lantai dengan formula biodegradable dan aroma lemon segar, aman untuk keluarga.', stock: 180 },
  { name: 'SR12 Dish Wash Plant-Based', cat: 'Home Care', catSlug: 'home-care', price: 42000, discount: 10, galleryCount: 2, tags: ['home-care'], short: 'Sabun cuci piring plant-based lembut.', desc: 'Sabun cuci piring dari bahan nabati yang lembut di tangan dan ramah lingkungan.', isNew: true, stock: 140 },
  // GIFT PACKAGE
  { name: 'SR12 Wellness Gift Box', cat: 'Gift Package', catSlug: 'gift-package', price: 350000, discount: 20, galleryCount: 2, tags: ['gift-package'], short: 'Paket hadiah wellness lengkap premium.', desc: 'Paket hadiah eksklusif berisi herbal, skincare, dan suplemen pilihan dengan kemasan mewah.', stock: 25 },
  { name: 'SR12 Beauty Hamper Rose', cat: 'Gift Package', catSlug: 'gift-package', price: 425000, discount: 15, galleryCount: 2, tags: ['gift-package'], short: 'Hamper kecantikan tema rose eksklusif.', desc: 'Hamper kecantikan dengan tema rose, berisi lipstick, serum, dan body lotion edisi terbatas.', stock: 15 },
];

const categoriesToCreate = [
  { name: 'Beauty', slug: 'beauty', emoji: '💄' },
  { name: 'Face Care', slug: 'face-care', emoji: '✨' },
  { name: 'Body Care', slug: 'body-care', emoji: '🧴' },
  { name: 'Personal Care', slug: 'personal-care', emoji: '🧼' },
  { name: 'Baby & Kids', slug: 'baby-kids', emoji: '👶' },
  { name: 'Supplements', slug: 'supplements', emoji: '💊' },
  { name: 'Healthy Food', slug: 'healthy-food', emoji: '🍯' },
  { name: 'Home Care', slug: 'home-care', emoji: '🏠' },
  { name: 'Gift Package', slug: 'gift-package', emoji: '🎁' },
];

function makeSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function main() {
  console.log('🌱 Starting seed...\n');
  const categoryMap = new Map<string, string>();
  const existingCats = await prisma.category.findMany();
  for (const cat of existingCats) {
    categoryMap.set(cat.slug, cat.id);
    console.log(`  ⏭️  Kategori sudah ada: ${cat.name} (${cat.slug})`);
  }

  for (const cat of categoriesToCreate) {
    if (!categoryMap.has(cat.slug)) {
      const created = await prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: { name: cat.name, slug: cat.slug, emoji: cat.emoji },
      });
      categoryMap.set(cat.slug, created.id);
      console.log(`  ✅ Kategori dibuat: ${cat.name} (${cat.slug})`);
    }
  }

  console.log(`\n📦 Total kategori tersedia: ${categoryMap.size}\n`);

  let created = 0;
  let skipped = 0;
  const catProductIndex: Record<string, number> = {};

  for (const s of seeds) {
    const slug = makeSlug(s.name);
    const categoryId = categoryMap.get(s.catSlug);

    if (!categoryId) {
      console.log(`  ❌ Kategori tidak ditemukan: ${s.catSlug} (skip: ${s.name})`);
      continue;
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      console.log(`  ⏭️  Slug sudah ada: ${slug} (skip)`);
      skipped++;
      continue;
    }

    const originalPrice = s.discount > 0 ? Math.round(s.price / (1 - s.discount / 100)) : null;
    const pIdx = catProductIndex[s.catSlug] ?? 0;
    catProductIndex[s.catSlug] = pIdx + 1;
    const imageUrls = getImages(s.catSlug, pIdx, s.galleryCount);

    const product = await prisma.product.create({
      data: {
        name: s.name,
        slug,
        description: s.desc,
        price: s.price,
        originalPrice,
        discount: s.discount || null,
        stock: s.stock,
        rating: 4 + (pIdx % 10) / 10,
        reviewCount: 24 + ((pIdx * 7) % 180),
        isBestSeller: s.bestSeller ?? false,
        isNew: s.isNew ?? false,
        tags: s.tags,
        isPublished: true,
        categoryId,
        images: {
          create: imageUrls.map((url, idx) => ({ url, isPrimary: idx === 0 })),
        },
      },
    });

    created++;
    console.log(`  ✅ Produk dibuat: ${product.name} (${slug}) — ${imageUrls.length} gambar`);
  }

  console.log(`\n🎉 Seed selesai! Dibuat: ${created}, Diskip: ${skipped}`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Seed gagal:', e);
  prisma.$disconnect();
  process.exit(1);
});
