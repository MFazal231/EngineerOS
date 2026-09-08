import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// Timestamps are serialised without an offset, so Postgres resolves them using
// the session timezone. On a database set to anything but UTC that silently
// shifts every written instant — locally it put every `@updatedAt` 5h30m in the
// past, which made time-of-day insights nonsense. Neon already defaults to UTC;
// pinning it here makes every environment agree.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
  options: "-c timezone=UTC",
});

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
