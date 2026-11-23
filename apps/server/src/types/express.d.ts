declare global {
  namespace Express {
    interface User {
      id: string;
      steamId: string;
      displayName: String;
      avatar?: string;
    }
  }
}
export {};
