-- CreateTable
CREATE TABLE "Character" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "locations" JSONB[],

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnonymousUser" (
    "id" TEXT NOT NULL,

    CONSTRAINT "AnonymousUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "anonymous_user_id" TEXT,
    "level" INTEGER NOT NULL,
    "completionTime" INTEGER NOT NULL,
    "playerName" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Character_name_key" ON "Character"("name");

-- CreateIndex
CREATE INDEX "Result_anonymous_user_id_idx" ON "Result"("anonymous_user_id");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_anonymous_user_id_fkey" FOREIGN KEY ("anonymous_user_id") REFERENCES "AnonymousUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
