import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const prismaClients = new Map<string, PrismaClient>();

export function getPrisma(connectionString: string): PrismaClient {
  const existingClient = prismaClients.get(connectionString);
  if (existingClient) return existingClient;

  const adapter = new PrismaNeon({ connectionString });
  const prisma = new PrismaClient({ adapter });

  prismaClients.set(connectionString, prisma);
  return prisma;
}
