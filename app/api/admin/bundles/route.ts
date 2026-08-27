import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';
import { BundleType } from '@prisma/client';

// GET /api/admin/bundles — ambil semua bundle beserta item & produknya
export async function GET() {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const bundles = await prisma.bundle.findMany({
      include: {
        items: {
          include: {
            product: {
              include: { category: true, images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(bundles);
  } catch (error) {
    console.error('GET /api/admin/bundles error:', error);
    return NextResponse.json({ message: 'Error fetching bundles' }, { status: 500 });
  }
}

// POST /api/admin/bundles — buat bundle/parsel baru
export async function POST(req: Request) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      name,
      type,
      imageUrl,
      description,
      price,
      details,
      items,
    } = body as {
      name: string;
      type?: BundleType;
      imageUrl?: string;
      description?: string;
      price: number | string;
      details?: string;
      items?: { productId: string; quantity: number }[];
    };

    const bundleType: BundleType = type === 'PARSEL' ? 'PARSEL' : 'BUNDLING';

    if (!name || !name.trim()) {
      return NextResponse.json({ message: 'Nama bundle wajib diisi' }, { status: 400 });
    }
    if (price === undefined || price === null || price === '' || Number.isNaN(Number(price))) {
      return NextResponse.json({ message: 'Harga jual wajib diisi' }, { status: 400 });
    }
    if (bundleType === 'BUNDLING' && (!items || items.length === 0)) {
      return NextResponse.json({ message: 'Minimal 1 produk harus dipilih untuk Bundling' }, { status: 400 });
    }

    const bundle = await prisma.bundle.create({
      data: {
        name: name.trim(),
        type: bundleType,
        imageUrl: imageUrl?.trim() || null,
        description: description?.trim() || null,
        price: Number(price),
        details: details?.trim() || null,
        items: bundleType === 'BUNDLING' && items
          ? {
              create: items.map((item) => ({
                productId: item.productId,
                quantity: Number(item.quantity) || 1,
              })),
            }
          : undefined,
      },
      include: {
        items: { include: { product: true } },
      },
    });

    return NextResponse.json(bundle, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/bundles error:', error);
    return NextResponse.json({ message: 'Error creating bundle' }, { status: 500 });
  }
}
