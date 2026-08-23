import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';

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
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(bundles);
  } catch (error) {
    console.error('GET /api/admin/bundles error:', error);
    return NextResponse.json({ message: 'Error fetching bundles' }, { status: 500 });
  }
}

// POST /api/admin/bundles — buat bundle baru
export async function POST(req: Request) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { name, items } = body as { name: string; items: { productId: string; quantity: number }[] };

    if (!name || !name.trim()) {
      return NextResponse.json({ message: 'Nama bundle wajib diisi' }, { status: 400 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ message: 'Minimal 1 produk harus dipilih' }, { status: 400 });
    }

    const bundle = await prisma.bundle.create({
      data: {
        name: name.trim(),
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: Number(item.quantity) || 1,
          })),
        },
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
