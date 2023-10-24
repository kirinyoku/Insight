import { PrismaClient } from "@prisma/client";
/* 
  In production, it creates a new instance for every request. In development,
  it checks if there’s a cached instance of PrismaClient and uses that. 
  If not, it creates a new one and caches it. This is done to prevent 
  too many instances of PrismaClient in development and potentially reaching 
  the database connection limit. The instance is then exported as db for use 
  in other parts of your application.
*/
declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient; // var for global scope
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  // If it's production, create a new instance of PrismaClient
  prisma = new PrismaClient();
} else {
  // Check if there's a cached instance of PrismaClient
  if (!global.cachedPrisma) {
    // If there's no cached instance, create a new one and cache it
    global.cachedPrisma = new PrismaClient();
  }
  // Use the cached instance of PrismaClient
  prisma = global.cachedPrisma;
}

export const db = prisma;
