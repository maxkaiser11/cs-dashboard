import { prisma } from "../../lib/prisma.js";

type SteamProfile = { displayName: string; avatar?: string };

const users = new Map<string, Express.User>();

class SteamService {
  async findOrCreateUser(steamId: string, profile: SteamProfile) {
    // TODO: DB look up or insert if not exist using prisma
    const exisiting = await prisma.user.findUnique({
      where: {steamId }
    })
    if (exisiting) return exisiting;

  return prisma.user.create({
      data: {
        steamId,
        displayName: profile.displayName,
        avatar: profile.avatar,
      }
    })
  }

  async findById(id: number) {
    return prisma.user.findUnique({where: {id}})
  }
}

export default new SteamService();
