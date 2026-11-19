import { prisma } from "../../lib/prisma";

type SteamProfile = { displayName: string; avatar?: string };

const users = new Map<string, Express.User>();

class SteamService {
  async findOrCreateUser(steamId: string, profile: SteamProfile) {
    // TODO: DB look up or insert if not exist using prisma
    const exisiting = await prisma.users.findUnique({
      where: {steamId }
    })
    if (exisiting) return exisiting;

  return prisma.users.create({
      data: {
        steamId,
        displayName: profile.displayName,
        avatar: profile.avatar,
      }
    })
  }

  async findById(id: number) {
    return prisma.users.findUnique({where: {id}})
  }
}

export default new SteamService();
