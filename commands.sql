CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author text,
  url text NOT NULL,
  title text NOT NULL,
  likes integer DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES ('John Doe', 'https://anexampleblog.com/post-1', 'Post 1', 12);
INSERT INTO blogs (author, url, title, likes) VALUES ('John Doe', 'https://anexampleblog.com/post-2', 'Post 2', 5);