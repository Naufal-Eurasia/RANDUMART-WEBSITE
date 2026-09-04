import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { localCart } = await req.json();
    const userId = (session.user as any).id;

    if (!Array.isArray(localCart) || localCart.length === 0) {
      const finalDbCart = await prisma.cartItem.findMany({
        where: { userId },
        include: {
          product: {
            select: { id: true, name: true, price: true, images: { select: { url: true }, where: { isPrimary: true }, take: 1 }, stock: true }
          }
        }
      });
      return NextResponse.json(finalDbCart);
    }

    // Ambil semua isi cart database saat ini
    const dbCartItems = await prisma.cartItem.findMany({
      where: { userId }
    });

    // Map existing db items by productId for quick access
    const dbCartMap = new Map(dbCartItems.map(item => [item.productId, item]));

    // Looping item dari localStorage dan upsert ke database
    for (const item of localCart) {
      // Pastikan product id valid dan cek stock realtime
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product || !product.isPublished) continue;

      const existingItem = dbCartMap.get(item.productId);

      // Merge quantity
      const newQty = (existingItem?.quantity || 0) + item.quantity;
      // Jangan lebih dari stok yang tersedia (cegah eksploitasi)
      const finalQty = Math.min(newQty, product.stock);

      // specification dari cart lokal menang kalau diisi, kalau tidak pertahankan yang di DB
      const finalSpecification = item.specification !== undefined
        ? (item.specification || null)
        : (existingItem?.specification ?? null);

      if (finalQty > 0) {
        await prisma.cartItem.upsert({
          where: {
            userId_productId: {
              userId,
              productId: item.productId
            }
          },
          update: {
            quantity: finalQty,
            specification: finalSpecification
          },
          create: {
            userId,
            productId: item.productId,
            quantity: finalQty,
            specification: finalSpecification
          }
        });
      }
    }

    // Return the updated db cart
    const finalDbCart = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            originalPrice: true,
            discount: true,
            stock: true,
            images: { select: { url: true }, where: { isPrimary: true }, take: 1 }
          }
        }
      }
    });

    return NextResponse.json(finalDbCart);
  } catch (error) {
    console.error('Cart sync error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}