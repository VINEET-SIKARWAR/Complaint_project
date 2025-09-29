-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "staffRequest" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "role" SET DEFAULT 'citizen';
