-- CreateEnum
CREATE TYPE "public"."RequestType" AS ENUM ('HOUSEKEEPING', 'MAINTENANCE', 'CONCIERGE', 'GENERAL', 'FOOD_ORDER');

-- CreateEnum
CREATE TYPE "public"."RequestPriority" AS ENUM ('URGENT', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "public"."RequestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "public"."guest_requests" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "type" "public"."RequestType" NOT NULL,
    "priority" "public"."RequestPriority" NOT NULL,
    "status" "public"."RequestStatus" NOT NULL DEFAULT 'PENDING',
    "description" TEXT NOT NULL,
    "notes" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hotelId" TEXT NOT NULL,

    CONSTRAINT "guest_requests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."guest_requests" ADD CONSTRAINT "guest_requests_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "public"."hotels"("id") ON DELETE CASCADE ON UPDATE CASCADE;
