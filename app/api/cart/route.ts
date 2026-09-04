import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET cart items
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const userId = (session.user as any).id;
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true, name: true, price: true, originalPrice: true, discount: true, stock: true,
            images: { select: { url: true }, where: { isPrimary: true }, take: 1 }
          }
        }
      }
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

// ADD/UPDATE single item in cart (Regular operations)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const { productId, quantity, specification } = await req.json();
    const userId = (session.user as any).id;

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || !product.isPublished) return NextResponse.json({ message: 'Product unavailable' }, { status: 400 });

    const finalQty = Math.min(quantity, product.stock);
    if (finalQty <= 0) return NextResponse.json({ message: 'Invalid quantity' }, { status: 400 });

    // specification: detail varian/opsi yang dipilih user (mis. warna, ukuran).
    // Opsional — undefined berarti field tidak ikut diupdate saat quantity saja yang berubah.
    const item = await prisma.cartItem.upsert({
      where: { userId_productId: { userId, productId } },
      update: { quantity: finalQty, ...(specification !== undefined ? { specification: specification || null } : {}) },
      create: { userId, productId, quantity: finalQty, specification: specification || null }
    });

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}

// DELETE single item from cart
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

    const url = new URL(req.url);
    const productId = url.searchParams.get('productId');
    const userId = (session.user as any).id;

    if (productId) {
      await prisma.cartItem.delete({
        where: { userId_productId: { userId, productId } }
      });
    } else {
      // Clear entire cart
      await prisma.cartItem.deleteMany({
        where: { userId }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ message: 'Error' }, { status: 500 });
  }
}