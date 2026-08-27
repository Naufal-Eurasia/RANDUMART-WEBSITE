import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function checkAdminAuth() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== 'ADMIN') {
    return false;
  }
  return true;
}