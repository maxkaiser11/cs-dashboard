import type { User as DbUser } from "../generated/prisma/client.js";
declare global {
  namespace Express {
    interface User extends DbUser {}
  }
}
export {};
