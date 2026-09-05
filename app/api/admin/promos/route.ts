import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';
import { PromoType } from '@prisma/client';

// GET /api/admin/promos — ambil semua banner promo
export async function GET() {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const promos = await prisma.promoBanner.findMany({
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(promos);
  } catch (error) {
    console.error('GET /api/admin/promos error:', error);
    return NextResponse.json({ message: 'Error fetching promo banners' }, { status: 500 });
  }
}

// POST /api/admin/promos — buat banner promo baru (default Draft/nonaktif)
export async function POST(req: Request) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      // Field lama
      title,
      imageUrl,
      linkUrl,
      position,
      // Field baru
      description,
      type,
      discountValue,
      startDate,
      endDate,
      productIds,
      layout,
    } = body as {
      title: string;
      imageUrl: string;
      linkUrl?: string;
      position?: number;
      description?: string;
      type?: PromoType;
      discountValue?: number;
      startDate?: string;
      endDate?: string;
      productIds?: string[];
      layout?: string;
    };

    // ── Validasi wajib ──────────────────────────────────────────────────────
    if (!title || !title.trim()) {
      return NextResponse.json({ message: 'Judul banner wajib diisi' }, { status: 400 });
    }
    if (!imageUrl || !imageUrl.trim()) {
      return NextResponse.json({ message: 'Gambar banner wajib diisi' }, { status: 400 });
    }

    // ── Validasi field baru ─────────────────────────────────────────────────
    if (discountValue !== undefined && discountValue !== null) {
      if (discountValue < 0 || discountValue > 100) {
        return NextResponse.json(
          { message: 'discountValue harus antara 0 dan 100' },
          { status: 400 },
        );
      }
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return NextResponse.json({ message: 'Format tanggal tidak valid' }, { status: 400 });
      }
      if (end <= start) {
        return NextResponse.json(
          { message: 'endDate harus lebih besar dari startDate' },
          { status: 400 },
        );
      }
    }

    // ── Validasi enum PromoType ─────────────────────────────────────────────
    const validPromoTypes: PromoType[] = ['FLASH_SALE', 'DISCOUNT_PERCENT', 'CUSTOM'];
    if (type !== undefined && !validPromoTypes.includes(type)) {
      return NextResponse.json(
        { message: `type tidak valid. Pilihan: ${validPromoTypes.join(', ')}` },
        { status: 400 },
      );
    }

    const promo = await prisma.promoBanner.create({
      data: {
        // Field lama
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl?.trim() || null,
        position: position ?? null,
        isActive: false, // selalu mulai sebagai Draft
        // Field baru
        description: description?.trim() || null,
        type: type ?? 'DISCOUNT_PERCENT',
        discountValue: discountValue ?? null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        productIds: productIds ?? [],
        layout: layout?.trim() || 'card',
      },
    });

    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/promos error:', error);
    return NextResponse.json({ message: 'Error creating promo banner' }, { status: 500 });
  }
}
