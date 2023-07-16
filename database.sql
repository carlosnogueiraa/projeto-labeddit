-- Active: 1680034004573@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    role TEXT NOT NULL,
    terms TEXT NOT NULL
);

INSERT INTO users VALUES(
    'u001',
    'fulano',
    'fulano@email.com',
    'fulano123',
    CURRENT_TIMESTAMP,
    'NORMAL',
    'accepted'
);

SELECT * FROM users;

DROP TABLE users;

CREATE TABLE posts(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    userId TEXT NOT NULL,
    userName TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER NOT NULL DEFAULT 0,
    dislikes INTEGER NOT NULL DEFAULT 0,
    comments INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY(userId) REFERENCES users(id)
);

DROP TABLE posts;

CREATE TABLE likes_dislikes(
    userId TEXT NOT NULL,
    postId TEXT NOT NULL,
    likes INTEGER NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(postId) REFERENCES posts(id)
);

DROP TABLE likes_dislikes;

CREATE TABLE comments(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    userId TEXT NOT NULL,
    postId TEXT NOT NULL,
    userName TEXT NOT NULL,
    content TEXT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    likes INTEGER NOT NULL,
    dislikes INTEGER NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(postId) REFERENCES posts(id)
);

DROP TABLE comments;

CREATE TABLE likes_dislikes_comments(
    userId TEXT NOT NULL,
    commentsId TEXT NOT NULL,
    postId TEXT NOT NULL,
    likes INTEGER NOT NULL,
    FOREIGN KEY(userId) REFERENCES users(id),
    FOREIGN KEY(commentsId) REFERENCES comments(id),
    FOREIGN KEY(postId) REFERENCES posts(id)
);

SELECT * FROM likes_dislikes_comments;

SELECT * FROM users;

DROP TABLE likes_dislikes_comments;

SELECT 
    posts.id AS postId,
    posts.content,
    posts.createdAt,
SUM(CASE WHEN like = 0 THEN 1 ELSE 0 END) AS dislike,
SUM(CASE WHEN like = 1 THEN 1 ELSE 0 END) AS like,
SUM(CASE WHEN likes_dislikes.like IS NULL THEN 1 ELSE 0 END) AS nullLikes
FROM posts
LEFT JOIN likes_dislikes ON posts.id = likes_dislikes.postId;

SELECT 
    posts.id,
    posts.content,
    users.email,
    likes_dislikes.like,
    users.email AS likedBy
FROM posts
LEFT JOIN users ON posts.userId = users.id
LEFT JOIN likes_dislikes ON posts.id = likes_dislikes.postId
LEFT JOIN users AS likedBy ON likes_dislikes.userId = likedBy.id;

SELECT * FROM posts
LEFT JOIN likes_dislikes ON likes_dislikes.like ===;


DELETE FROM likes_dislikes_comments;