import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

// Ensure we don't accidentally leak connection outside of edge/serverless functions
const connectionString = process.env.DATABASE_URL!

// Tanpa singleton, tiap HMR di dev bikin PrismaClient + koneksi WebSocket baru ke Neon
// dan yang lama tidak pernah ditutup.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma =
  globalForPrisma.prisma ?? new PrismaClient({ adapter: new PrismaNeon({ connectionString }) })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma