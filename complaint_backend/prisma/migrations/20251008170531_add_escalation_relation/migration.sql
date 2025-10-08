-- AlterTable
ALTER TABLE "public"."Complaint" ADD COLUMN     "escalatedById" INTEGER;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_escalatedById_fkey" FOREIGN KEY ("escalatedById") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
