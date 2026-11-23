// Base URL of the React frontend; auth redirects send the browser here.
// Defaults to the Vite dev server.
export const CLIENT_URL = (process.env.CLIENT_URL ?? "http://localhost:5173").replace(/\/$/, "");
