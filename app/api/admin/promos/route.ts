import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';

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
    const { title, imageUrl, linkUrl, position } = body as {
      title: string; imageUrl: string; linkUrl?: string; position?: number;
    };

    if (!title || !title.trim()) {
      return NextResponse.json({ message: 'Judul banner wajib diisi' }, { status: 400 });
    }
    if (!imageUrl || !imageUrl.trim()) {
      return NextResponse.json({ message: 'Gambar banner wajib diisi' }, { status: 400 });
    }

    const promo = await prisma.promoBanner.create({
      data: {
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        linkUrl: linkUrl?.trim() || null,
        position: position ?? null,
        isActive: false, // selalu mulai sebagai Draft
      },
    });

    return NextResponse.json(promo, { status: 201 });
  } catch (error) {
    console.error('POST /api/admin/promos error:', error);
    return NextResponse.json({ message: 'Error creating promo banner' }, { status: 500 });
  }
}
