import express from "express";
import session from "express-session";
import passport from "passport";
import "./modules/steam/steam.strategy.js";
import steamRoutes from "./modules/steam/steam.routes.js";
import inventoryRouter from "./modules/inventory/inventory.routes.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use(steamRoutes);
app.use("/api/inventory/", inventoryRouter);

// TODO: Placeholer for now, after implement in dashboard module
app.get("/dashboard", (req, res) => {
  if (!req.user) return res.redirect("/auth/steam");
res.redirect("/api/inventory/me")
});

app.listen(PORT, () => {
  console.log(`Server running on ${process.env.PORT}`);
});
