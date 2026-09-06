-- DataMigration
-- One-off reset of fazalmohammad231@gmail.com's DSA progress and projects/tasks
-- (project_tasks cascades via its FK), for a clean re-test of the app. The
-- users row itself (account, login, admin flag) is untouched.
DELETE FROM "dsa_problem_progress"
WHERE "user_id" = (SELECT "id" FROM "users" WHERE "email" = 'fazalmohammad231@gmail.com');

DELETE FROM "projects"
WHERE "user_id" = (SELECT "id" FROM "users" WHERE "email" = 'fazalmohammad231@gmail.com');
