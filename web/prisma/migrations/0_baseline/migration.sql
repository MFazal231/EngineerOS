-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "dsa_problem_progress" (
    "topic_slug" VARCHAR(100) NOT NULL,
    "problem_id" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dsa_problem_progress_pkey" PRIMARY KEY ("topic_slug","problem_id")
);

-- CreateTable
CREATE TABLE "dsa_topics" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,

    CONSTRAINT "dsa_topics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dsa_topics_slug_key" ON "dsa_topics"("slug");

-- AddForeignKey
ALTER TABLE "dsa_problem_progress" ADD CONSTRAINT "dsa_problem_progress_topic_slug_fkey" FOREIGN KEY ("topic_slug") REFERENCES "dsa_topics"("slug") ON DELETE CASCADE ON UPDATE NO ACTION;

