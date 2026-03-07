import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL || process.env.POSTGRES_PRISMA_URL || 'postgresql://localhost:5432/dev',
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
