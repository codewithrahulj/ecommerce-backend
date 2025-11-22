import logger from "#utils/logger/logger.js";

import { PrismaClient } from "../../../generated/prisma";

export const prisma = new PrismaClient({
  log: [
    // {
    //   emit: "event",
    //   level: "query",
    // },
    { emit: "event", level: "error" },
  ],
});

// prisma.$on("query", (e: any) => {
//   logger.info(e.query, "Query");
//   logger.info(e.params, "Params");
//   logger.info(`${e.duration} ms`, "Duration: ");
// });

prisma.$on("error", (e) => {
  if (e.target !== "tokens.create" && e.target !== "raydiumPools.create") {
    logger.error(e, "DB Error");
  }
});
