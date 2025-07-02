-- AlterTable
ALTER TABLE "Clip" ADD COLUMN     "clipId" TEXT,
ADD COLUMN     "fileSize" TEXT,
ADD COLUMN     "previewText" TEXT;

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "aspectRatio" TEXT,
ADD COLUMN     "numClipsRequested" INTEGER;
