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
