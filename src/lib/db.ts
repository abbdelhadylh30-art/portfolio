import { PrismaClient } from '@prisma/client'

// Reuse a single PrismaClient instance across hot-reloads in dev to
// avoid exhausting DB connections. In production (Vercel serverless)
// a fresh client is created per lambda invocation, which is fine.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Only log queries in development — logging in production wastes
    // serverless CPU and can cause issues if stdout isn't available.
    log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db