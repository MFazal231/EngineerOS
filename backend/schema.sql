CREATE TABLE IF NOT EXISTS dsa_topics (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO dsa_topics (name, slug)
VALUES
    ('Arrays', 'arrays'),
    ('Strings', 'strings'),
    ('Binary Search', 'binary-search')
ON CONFLICT (slug) DO NOTHING;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dsa_problem_progress (
    topic_slug VARCHAR(100) NOT NULL REFERENCES dsa_topics(slug) ON DELETE CASCADE,
    problem_id INTEGER NOT NULL CHECK (problem_id > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('not-started', 'in-progress', 'solved')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (topic_slug, problem_id)
);

ALTER TABLE dsa_problem_progress
    ADD COLUMN IF NOT EXISTS user_id INTEGER;

INSERT INTO users (name, email, password_hash)
VALUES ('Legacy EngineerOS Profile', 'legacy@engineeros.local', '$2b$12$rEArf.1YfnIGiwovfZ8O2O8OSAW.OAdIOV0glp9O21mKvPYTjfOCS')
ON CONFLICT (email) DO NOTHING;

UPDATE dsa_problem_progress
SET user_id = (SELECT id FROM users WHERE email = 'legacy@engineeros.local')
WHERE user_id IS NULL;

ALTER TABLE dsa_problem_progress
    ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE dsa_problem_progress
    DROP CONSTRAINT IF EXISTS dsa_problem_progress_pkey;

ALTER TABLE dsa_problem_progress
    ADD PRIMARY KEY (user_id, topic_slug, problem_id);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'dsa_problem_progress_user_id_fkey'
    ) THEN
        ALTER TABLE dsa_problem_progress
            ADD CONSTRAINT dsa_problem_progress_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
    END IF;
END $$;
