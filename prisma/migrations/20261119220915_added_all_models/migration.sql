/*
  Warnings:

  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Users";

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "steam_id" VARCHAR(20) NOT NULL,
    "display_name" TEXT,
    "avatar" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "asset_id" VARCHAR(64) NOT NULL,
    "market_hash_name" TEXT NOT NULL,
    "name" TEXT,
    "type" TEXT,
    "exterior" TEXT,
    "price_cents" INTEGER,
    "price_source" TEXT,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "float_value" DECIMAL(10,8),
    "paint_seed" INTEGER,
    "paint_index" INTEGER,
    "phase" TEXT,
    "icon_url" TEXT,
    "tradable" BOOLEAN NOT NULL DEFAULT true,
    "marketable" BOOLEAN NOT NULL DEFAULT true,
    "last_updated" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_snapshots" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_value_cents" INTEGER NOT NULL,
    "item_count" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_steam_id_key" ON "users"("steam_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_items_user_id_asset_id_key" ON "inventory_items"("user_id", "asset_id");

-- CreateIndex
CREATE INDEX "inventory_snapshots_user_id_created_at_idx" ON "inventory_snapshots"("user_id", "created_at" DESC);

-- AddForeignKey
ALTER TABLE "inventory_items" ADD CONSTRAINT "inventory_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_snapshots" ADD CONSTRAINT "inventory_snapshots_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
