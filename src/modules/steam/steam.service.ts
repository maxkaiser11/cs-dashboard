

type SteamProfile = { displayName: string; avatar?: string };

const users = new Map<string, Express.User>();

class SteamService {
  async findOrCreateUser(steamId: string, profile: SteamProfile) {
    // TODO: DB look up or insert if not exist using prisma
    const exisiting = users.get(steamId);
    if (exisiting) return exisiting;

  const user: Express.User = {
      id: steamId,
      steamId,
      displayName: profile.displayName,
      avatar: profile.avatar
    }
    users.set(steamId, user);
    console.log("created user", user);
    return user ;
  }

  async findById(id: string): Promise<Express.User | undefined> {
    return users.get(id);
  }
}

export default new SteamService();
