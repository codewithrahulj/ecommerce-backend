import { Prisma, PrismaClient } from "../../generated/prisma";
import { prisma } from "../utils/prisma/client";

export class BaseModel {
  public prisma = prisma;

  executeRaw = async (sql: Prisma.Sql) => {
    return await this.prisma.$executeRaw`${sql}`;
  };

  // DO NOT USE WHERE USER SUPPLIED INPUT IS PASSED
  executeRawUnsafe = async (sql: string) => {
    return await this.prisma.$executeRawUnsafe(sql);
  };

  switchPrismaClient(prismaClient: PrismaClient) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.prisma = prismaClient;
  }
}
