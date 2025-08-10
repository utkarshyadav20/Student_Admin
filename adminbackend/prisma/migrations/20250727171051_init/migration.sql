-- AlterTable
ALTER TABLE "students" ADD COLUMN     "added_at" TIMESTAMP(3),
ADD COLUMN     "edited_at" TIMESTAMP(3),
ADD COLUMN     "image" BYTEA;

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "course" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    "added_at" TIMESTAMP(3),
    "edited_at" TIMESTAMP(3),

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phoneCode" TEXT NOT NULL,
    "emojiU" TEXT NOT NULL,
    "native" TEXT NOT NULL,

    CONSTRAINT "tbl_countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbl_states" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "stateCode" TEXT NOT NULL,
    "countryId" INTEGER NOT NULL,

    CONSTRAINT "tbl_states_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_course_key" ON "courses"("course");

-- CreateIndex
CREATE INDEX "courses_course_idx" ON "courses"("course");

-- CreateIndex
CREATE INDEX "tbl_countries_name_idx" ON "tbl_countries"("name");

-- CreateIndex
CREATE INDEX "tbl_states_countryId_idx" ON "tbl_states"("countryId");

-- CreateIndex
CREATE INDEX "students_email_idx" ON "students"("email");

-- CreateIndex
CREATE INDEX "students_course_idx" ON "students"("course");

-- AddForeignKey
ALTER TABLE "students" ADD CONSTRAINT "students_course_fkey" FOREIGN KEY ("course") REFERENCES "courses"("course") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tbl_states" ADD CONSTRAINT "tbl_states_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "tbl_countries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
