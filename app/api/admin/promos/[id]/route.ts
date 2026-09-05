import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';
import { PromoType } from '@prisma/client';

// PUT /api/admin/promos/[id] — update data banner ATAU toggle isActive
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      // Field lama
      title,
      imageUrl,
      linkUrl,
      position,
      isActive,
      // Field baru
      description,
      type,
      discountValue,
      startDate,
      endDate,
      productIds,
      layout,
    } = body as {
      title?: string;
      imageUrl?: string;
      linkUrl?: string;
      position?: number;
      isActive?: boolean;
      description?: string;
      type?: PromoType;
      discountValue?: number | null;
      startDate?: string | null;
      endDate?: string | null;
      productIds?: string[];
      layout?: string;
    };

    // ── Validasi field lama ─────────────────────────────────────────────────
    const data: Record<string, unknown> = {};
    if (title !== undefined) {
      if (!title.trim()) return NextResponse.json({ message: 'Judul banner wajib diisi' }, { status: 400 });
      data.title = title.trim();
    }
    if (imageUrl !== undefined) {
      if (!imageUrl.trim()) return NextResponse.json({ message: 'Gambar banner wajib diisi' }, { status: 400 });
      data.imageUrl = imageUrl.trim();
    }
    if (linkUrl !== undefined) data.linkUrl = linkUrl?.trim() || null;
    if (position !== undefined) data.position = position;
    if (isActive !== undefined) data.isActive = isActive;

    // ── Validasi & assignment field baru ────────────────────────────────────
    if (description !== undefined) data.description = description?.trim() || null;

    if (type !== undefined) {
      const validPromoTypes: PromoType[] = ['FLASH_SALE', 'DISCOUNT_PERCENT', 'CUSTOM'];
      if (!validPromoTypes.includes(type)) {
        return NextResponse.json(
          { message: `type tidak valid. Pilihan: ${validPromoTypes.join(', ')}` },
          { status: 400 },
        );
      }
      data.type = type;
    }

    if (discountValue !== undefined) {
      if (discountValue !== null && (discountValue < 0 || discountValue > 100)) {
        return NextResponse.json(
          { message: 'discountValue harus antara 0 dan 100' },
          { status: 400 },
        );
      }
      data.discountValue = discountValue;
    }

    // Parse & validasi tanggal (hanya jika keduanya dikirim bersamaan)
    const resolvedStart = startDate !== undefined ? (startDate ? new Date(startDate) : null) : undefined;
    const resolvedEnd   = endDate   !== undefined ? (endDate   ? new Date(endDate)   : null) : undefined;

    if (resolvedStart !== undefined) {
      if (resolvedStart !== null && isNaN(resolvedStart.getTime())) {
        return NextResponse.json({ message: 'Format startDate tidak valid' }, { status: 400 });
      }
      data.startDate = resolvedStart;
    }
    if (resolvedEnd !== undefined) {
      if (resolvedEnd !== null && isNaN(resolvedEnd.getTime())) {
        return NextResponse.json({ message: 'Format endDate tidak valid' }, { status: 400 });
      }
      data.endDate = resolvedEnd;
    }

    // Validasi urutan tanggal (gunakan nilai lama dari DB jika salah satu tidak dikirim)
    if (resolvedStart !== undefined || resolvedEnd !== undefined) {
      // Ambil data existing jika hanya salah satu tanggal yang dikirim
      let effectiveStart = resolvedStart;
      let effectiveEnd   = resolvedEnd;

      if (effectiveStart === undefined || effectiveEnd === undefined) {
        const existing = await prisma.promoBanner.findUnique({
          where: { id: params.id },
          select: { startDate: true, endDate: true },
        });
        if (effectiveStart === undefined) effectiveStart = existing?.startDate ?? null;
        if (effectiveEnd   === undefined) effectiveEnd   = existing?.endDate   ?? null;
      }

      if (effectiveStart && effectiveEnd && effectiveEnd <= effectiveStart) {
        return NextResponse.json(
          { message: 'endDate harus lebih besar dari startDate' },
          { status: 400 },
        );
      }
    }

    if (productIds !== undefined) data.productIds = productIds;
    if (layout !== undefined) data.layout = layout?.trim() || 'card';

    const promo = await prisma.promoBanner.update({ where: { id: params.id }, data });
    return NextResponse.json(promo);
  } catch (error) {
    console.error('PUT /api/admin/promos/[id] error:', error);
    return NextResponse.json({ message: 'Error updating promo banner' }, { status: 500 });
  }
}

// DELETE /api/admin/promos/[id] — hapus banner promo
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    await prisma.promoBanner.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Banner promo berhasil dihapus' });
  } catch (error) {
    console.error('DELETE /api/admin/promos/[id] error:', error);
    return NextResponse.json({ message: 'Error deleting promo banner' }, { status: 500 });
  }
}
