import { cachedFetchJson } from "../../lib/cachedFetch.js";

const STEAM_WEB_API_KEY = process.env.STEAM_WEB_API_KEY;
if (!STEAM_WEB_API_KEY) throw new Error("STEAM_WEB_API_KEY is not set");

export type SteamWebApiItem = {
  assetid: string;
  markethashname: string;
  marketname: string;
  tag1: string | null;
  wear: "fn" | "mw" | "ft" | "ww" | "bs" | null;
  pricelatest: number | null;   // Steam price, in dollars
  image: string;
  marketable: boolean | null;
  tradable: boolean;
  float: {
    floatvalue: number | null;
    paintseed: number | null;
    paintindex: number | null;
    phase: string | null;
  };
  tradeprotected: boolean;
  tradeprotectedmaxdays: boolean;
}

export class InventoryClient {
  async fetchInventory(steamId: string): Promise<SteamWebApiItem[]> {
    const url = new URL("https://www.steamwebapi.com/steam/api/inventory");
    url.searchParams.set("steam_id", steamId);
    url.searchParams.set("game", "cs2");
    url.searchParams.set("trade_locked", "4");
    url.searchParams.set("key", STEAM_WEB_API_KEY!);

    return cachedFetchJson<SteamWebApiItem[]>(`steamwebapi-inventory-${steamId}`, url);
  }
}
