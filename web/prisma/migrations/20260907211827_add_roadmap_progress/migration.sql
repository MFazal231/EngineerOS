-- CreateTable
CREATE TABLE "roadmap_progress" (
    "user_id" INTEGER NOT NULL,
    "roadmap_slug" VARCHAR(100) NOT NULL,
    "step_id" VARCHAR(120) NOT NULL,
    "done" BOOLEAN NOT NULL DEFAULT false,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roadmap_progress_pkey" PRIMARY KEY ("user_id","roadmap_slug","step_id")
);

-- AddForeignKey
ALTER TABLE "roadmap_progress" ADD CONSTRAINT "roadmap_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

