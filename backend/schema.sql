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

CREATE TABLE IF NOT EXISTS dsa_problem_progress (
    topic_slug VARCHAR(100) NOT NULL REFERENCES dsa_topics(slug) ON DELETE CASCADE,
    problem_id INTEGER NOT NULL CHECK (problem_id > 0),
    status VARCHAR(20) NOT NULL CHECK (status IN ('not-started', 'in-progress', 'solved')),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (topic_slug, problem_id)
);
