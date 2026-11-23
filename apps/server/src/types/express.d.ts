import {User as DbUser} from "../../src/generated/prisma/client.js";
declare global {
  namespace Express {
    interface User extends DbUser {}
  }
}
export {};
