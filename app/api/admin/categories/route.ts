import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET() {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { products: true } } }
    });
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching categories' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  try {
    const { name, slug } = await req.json();
    if (!name || !slug) return NextResponse.json({ message: 'Name and slug required' }, { status: 400 });

    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) return NextResponse.json({ message: 'Slug already exists' }, { status: 400 });

    const newCat = await prisma.category.create({ data: { name, slug } });
    return NextResponse.json(newCat, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error creating category' }, { status: 500 });
  }
}
