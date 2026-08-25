import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id },
      include: { images: true, category: true }
    });
    
    if (!product) return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching product' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  try {
    const body = await req.json();
    const {
      name, slug, description, price, originalPrice, discount, 
      stock, categoryId, isBestSeller, isNew, tags, isPublished,
      rating, reviewCount, imageUrls
    } = body;

    const existing = await prisma.product.findFirst({ 
      where: { slug, id: { not: params.id } } 
    });
    if (existing) return NextResponse.json({ message: 'Slug sudah dipakai produk lain' }, { status: 400 });

    
    // Hapus gambar lama dan insert gambar baru (simple overwrite)
    if (imageUrls && Array.isArray(imageUrls)) {
      await prisma.productImage.deleteMany({ where: { productId: params.id } });
      await prisma.productImage.createMany({
        data: imageUrls.map((url: string, idx: number) => ({
          productId: params.id,
          url,
          isPrimary: idx === 0
        }))
      });
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        name,
        slug,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : null,
        discount: discount ? Number(discount) : null,
        stock: Number(stock),
        categoryId,
        isBestSeller: Boolean(isBestSeller),
        isNew: Boolean(isNew),
        tags: Array.isArray(tags) ? tags : [],
        isPublished: Boolean(isPublished),
        rating: rating !== undefined ? Number(rating) : 0,
        reviewCount: reviewCount !== undefined ? Number(reviewCount) : 0,
      }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('API PUT Product Error:', error);
    return NextResponse.json({ message: 'Error updating product' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  try {
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: params.id }
    });

    if (orderItemsCount > 0) {
      return NextResponse.json({
        message: "Produk ini punya riwayat transaksi, gunakan 'Nonaktifkan' alih-alih hapus"
      }, { status: 400 });
    }

    // FK BundleItem.product = Restrict, jadi delete akan gagal jadi 500 mentah tanpa cek ini
    const bundleItems = await prisma.bundleItem.findMany({
      where: { productId: params.id },
      select: { bundle: { select: { name: true } } },
    });

    if (bundleItems.length > 0) {
      const names = [...new Set(bundleItems.map((b) => b.bundle.name))].join(', ');
      return NextResponse.json({
        message: `Produk ini bagian dari bundle: ${names}. Keluarkan dari bundle dulu sebelum menghapus.`
      }, { status: 400 });
    }

    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: params.id } }),
      prisma.product.delete({ where: { id: params.id } })
    ]);

    return NextResponse.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('API DELETE Product Error:', error);
    return NextResponse.json({ message: 'Error deleting product' }, { status: 500 });
  }
}
