import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  try {
    const { name, slug } = await req.json();
    if (!name || !slug) return NextResponse.json({ message: 'Name and slug required' }, { status: 400 });

    const existing = await prisma.category.findFirst({ where: { slug, id: { not: params.id } } });
    if (existing) return NextResponse.json({ message: 'Slug already exists' }, { status: 400 });

    const cat = await prisma.category.update({
      where: { id: params.id },
      data: { name, slug }
    });
    return NextResponse.json(cat);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating category' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  try {
    const count = await prisma.product.count({ where: { categoryId: params.id } });
    if (count > 0) return NextResponse.json({ message: 'Kategori tidak dapat dihapus karena masih memiliki produk' }, { status: 400 });

    await prisma.category.delete({ where: { id: params.id } });
    return NextResponse.json({ message: 'Category deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Error deleting category' }, { status: 500 });
  }
}
