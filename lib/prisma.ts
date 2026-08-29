import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { neonConfig } from '@neondatabase/serverless'
import ws from 'ws'

neonConfig.webSocketConstructor = ws

// Ensure we don't accidentally leak connection outside of edge/serverless functions
const connectionString = process.env.DATABASE_URL!

const adapter = new PrismaNeon({ connectionString })
export const prisma = new PrismaClient({ adapter })