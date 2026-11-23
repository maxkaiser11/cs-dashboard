import { Router } from "express";
import passport from "passport";
import steamController from "./steam.controller.js";
import { CLIENT_URL } from "../../lib/config.js";

const router = Router();

router.get("/auth/steam", passport.authenticate("steam"));
router.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: `${CLIENT_URL}/?login=failed` }),
  steamController.handleCallback,
);
router.get("/auth/me", steamController.me);
router.get("/auth/logout", steamController.logout);

export default router;
