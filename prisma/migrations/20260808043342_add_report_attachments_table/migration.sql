-- CreateTable
CREATE TABLE "ReportAttachment" (
    "id" SERIAL NOT NULL,
    "reportId" INTEGER NOT NULL,
    "contributorId" TEXT NOT NULL,
    "attachmentImage" TEXT,
    "attachmentLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReportAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReportAttachment_reportId_idx" ON "ReportAttachment"("reportId");

-- CreateIndex
CREATE INDEX "ReportAttachment_contributorId_idx" ON "ReportAttachment"("contributorId");

-- CreateIndex
CREATE UNIQUE INDEX "ReportAttachment_reportId_contributorId_key" ON "ReportAttachment"("reportId", "contributorId");

-- AddForeignKey
ALTER TABLE "ReportAttachment" ADD CONSTRAINT "ReportAttachment_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "Report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportAttachment" ADD CONSTRAINT "ReportAttachment_contributorId_fkey" FOREIGN KEY ("contributorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
