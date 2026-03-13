import type { PrismaClient as PrismaClientType } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

let prisma: PrismaClientType;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  const globalAny = global as any;
  if (!globalAny.prisma) {
    globalAny.prisma = new PrismaClient();
  }
  prisma = globalAny.prisma;
}

export { prisma };


