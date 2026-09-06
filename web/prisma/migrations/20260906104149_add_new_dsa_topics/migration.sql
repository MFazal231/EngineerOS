-- DataMigration
UPDATE "dsa_topics" SET "name" = 'Arrays & Hashing' WHERE "slug" = 'arrays';

INSERT INTO "dsa_topics" ("name", "slug") VALUES
  ('Two Pointers', 'two-pointers'),
  ('Stack', 'stack'),
  ('Sliding Window', 'sliding-window'),
  ('Linked List', 'linked-list'),
  ('Trees', 'trees'),
  ('Tries', 'tries'),
  ('Heap / Priority Queue', 'heap-priority-queue'),
  ('Backtracking', 'backtracking'),
  ('Graphs', 'graphs'),
  ('Advanced Graphs', 'advanced-graphs'),
  ('1-D Dynamic Programming', 'dp-1d'),
  ('Intervals', 'intervals'),
  ('Greedy', 'greedy'),
  ('2-D Dynamic Programming', 'dp-2d'),
  ('Bit Manipulation', 'bit-manipulation'),
  ('Math & Geometry', 'math-geometry')
ON CONFLICT ("slug") DO NOTHING;
