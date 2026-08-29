import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';

// PUT /api/admin/promos/[id] — update data banner ATAU toggle isActive
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { title, imageUrl, linkUrl, position, isActive } = body as {
      title?: string; imageUrl?: string; linkUrl?: string; position?: number; isActive?: boolean;
    };

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
