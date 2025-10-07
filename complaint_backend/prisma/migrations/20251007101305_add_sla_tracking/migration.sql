-- AlterTable
ALTER TABLE "public"."Complaint" ADD COLUMN     "breached" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slaHours" INTEGER NOT NULL DEFAULT 48;
