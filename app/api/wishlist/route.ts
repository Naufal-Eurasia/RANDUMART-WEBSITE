import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;
    const wishlist = await prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true, name: true, price: true, originalPrice: true, discount: true, stock: true,
            images: { where: { isPrimary: true }, take: 1 }
          }
        }
      }
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { productId } = await req.json();
    const userId = (session.user as any).id;

    // Pakai upsert agar tidak duplicate key error jika dipanggil berkali-kali
    const item = await prisma.wishlistItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: {},
      create: { userId, productId }
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');
    const userId = (session.user as any).id;

    if (productId) {
      await prisma.wishlistItem.delete({
        where: { userId_productId: { userId, productId } }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}