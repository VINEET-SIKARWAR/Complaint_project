-- AlterTable
ALTER TABLE "public"."Complaint" ADD COLUMN     "hostelId" INTEGER;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "hostelId" INTEGER;

-- CreateTable
CREATE TABLE "public"."Hostel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "block" TEXT,

    CONSTRAINT "Hostel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "public"."Hostel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Complaint" ADD CONSTRAINT "Complaint_hostelId_fkey" FOREIGN KEY ("hostelId") REFERENCES "public"."Hostel"("id") ON DELETE SET NULL ON UPDATE CASCADE;
