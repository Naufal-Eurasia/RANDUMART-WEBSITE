import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-utils';

export async function GET() {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  try {
    const setting = await prisma.storeSetting.findUnique({ where: { id: 'singleton' } });
    return NextResponse.json(setting || { id: 'singleton', whatsappNumber: '6281234567890' });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching settings' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  if (!(await checkAdminAuth())) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  
  try {
    const { whatsappNumber } = await req.json();
    if (!whatsappNumber) return NextResponse.json({ message: 'Nomor WA wajib diisi' }, { status: 400 });

    const setting = await prisma.storeSetting.upsert({
      where: { id: 'singleton' },
      update: { whatsappNumber },
      create: { id: 'singleton', whatsappNumber }
    });

    return NextResponse.json(setting);
  } catch (error) {
    return NextResponse.json({ message: 'Error updating settings' }, { status: 500 });
  }
}
