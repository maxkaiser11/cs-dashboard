import passport from "passport";
import { Strategy as SteamStrategy } from "passport-steam";
import steamService from "./steam.service.js";

const STEAM_API_KEY = process.env.STEAM_API_KEY;

if (!STEAM_API_KEY) {
  throw new Error("STEAM_API_KEY is required");
}

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:3000/auth/steam/return",
      realm: "http://localhost:3000/",
      apiKey: STEAM_API_KEY,
    },
    async (identifier, profile, done) => {
      try {
        const user = await steamService.findOrCreateUser(profile.id, {
          displayName: profile.displayName,
          avatar: profile.photos?.[2]?.value,
        });
        done(null, user);
      } catch (err) {
        done(err);
      }
    },
  ),
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await steamService.findById(id);
    done(null, user ?? false);
  } catch (err) {
    done(err);
  }
});
