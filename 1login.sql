USE ipl;

CREATE TABLE users (
    username VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(40) NOT NULL UNIQUE,
    password VARCHAR(20) NOT NULL
);
