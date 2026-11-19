-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "steam_id" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_steam_id_key" ON "Users"("steam_id");
