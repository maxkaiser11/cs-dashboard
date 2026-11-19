import { Router } from "express";
import passport from "passport";
import steamController from "./steam.controller.js";

const router = Router();

router.get("/auth/steam", passport.authenticate("steam"));
router.get(
  "/auth/steam/return",
  passport.authenticate("steam", { failureRedirect: "/login" }),
  steamController.handleCallback,
);
router.get("/auth/me", steamController.me);
router.get("/auth/logout", steamController.logout);

export default router;
