import type { NextFunction, Request, Response } from "express";
import steamService from "./steam.service.js";

type SteamServiceType = typeof steamService;

class SteamController {
  constructor(private steamService: SteamServiceType) {}

  handleCallback(_req: Request, res: Response) {
    res.redirect("/dashboard");
  }

  me = (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ error: "Not Logged in" });
    res.json(req.user);
  };

  logout(req: Request, res: Response, next: NextFunction) {
    req.logout((err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  }
}

export default new SteamController(steamService);
