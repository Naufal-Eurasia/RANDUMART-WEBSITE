import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';
import { BundleType } from '@prisma/client';

// GET /api/admin/bundles/[id] — detail satu bundle (untuk populate form edit)
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const bundle = await prisma.bundle.findUnique({
      where: { id: params.id },
      include: {
        items: {
          include: {
            product: {
              include: { images: { where: { isPrimary: true }, take: 1 } },
            },
          },
        },
      },
    });

    if (!bundle) return NextResponse.json({ message: 'Bundle tidak ditemukan' }, { status: 404 });
    return NextResponse.json(bundle);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching bundle' }, { status: 500 });
  }
}

// PUT /api/admin/bundles/[id] — update bundle/parsel (data + sync items)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
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
      sku,
      isPreorder,
      preorderDays,
      items,
    } = body as {
      name: string;
      type?: BundleType;
      imageUrl?: string;
      description?: string;
      price: number | string;
      details?: string;
      sku?: string;
      isPreorder?: boolean;
      preorderDays?: number | string;
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

    // Gunakan $transaction: hapus items lama, update data, insert items baru (jika Bundling)
    const [, updated] = await prisma.$transaction([
      prisma.bundleItem.deleteMany({ where: { bundleId: params.id } }),
      prisma.bundle.update({
        where: { id: params.id },
        data: {
          name: name.trim(),
          type: bundleType,
          imageUrl: imageUrl?.trim() || null,
          description: description?.trim() || null,
          price: Number(price),
          details: details?.trim() || null,
          sku: sku?.trim() || null,
          isPreorder: Boolean(isPreorder),
          preorderDays: isPreorder ? (Number(preorderDays) || 14) : null,
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
      }),
    ]);

    revalidateTag('bundles');
    return NextResponse.json(updated);
  } catch (error) {
    console.error('PUT /api/admin/bundles/[id] error:', error);
    return NextResponse.json({ message: 'Error updating bundle' }, { status: 500 });
  }
}

// DELETE /api/admin/bundles/[id] — hapus bundle (cascade hapus BundleItem via schema)
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.bundle.delete({ where: { id: params.id } });
    revalidateTag('bundles');
    return NextResponse.json({ message: 'Bundle berhasil dihapus' });
  } catch (error) {
    console.error('DELETE /api/admin/bundles/[id] error:', error);
    return NextResponse.json({ message: 'Error deleting bundle' }, { status: 500 });
  }
}
