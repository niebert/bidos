-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- D S I B :: E O F :: K U :: G I


----------------------------------------------------------------------------------------------------


CREATE TABLE IF NOT EXISTS institutions (
  id                SERIAL PRIMARY KEY,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name              TEXT UNIQUE NOT NULL,
  text              TEXT
);

CREATE TABLE IF NOT EXISTS groups (
  id                SERIAL PRIMARY KEY,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name              TEXT UNIQUE NOT NULL,
  text              TEXT,
  institution_id    INT REFERENCES institutions(id)
);

CREATE TABLE IF NOT EXISTS users (
  id                SERIAL PRIMARY KEY,
  institution_id    INT REFERENCES institutions(id),
  group_id          INT REFERENCES groups(id),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name              TEXT UNIQUE NOT NULL,
  role              INT NOT NULL,
  text              TEXT,
  disabled          BOOLEAN DEFAULT FALSE,
  approved          BOOLEAN DEFAULT FALSE,
  email             TEXT UNIQUE NOT NULL,
  username          TEXT UNIQUE NOT NULL,
  job               TEXT,
  password_hash     TEXT
);

ALTER TABLE groups ADD COLUMN author_id INT REFERENCES users(id);
ALTER TABLE institutions ADD COLUMN author_id INT REFERENCES users(id);
ALTER TABLE users ADD COLUMN author_id INT REFERENCES users(id);

CREATE TABLE IF NOT EXISTS kids (
  id                SERIAL PRIMARY KEY,
  author_id         INT REFERENCES users(id),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name              TEXT UNIQUE NOT NULL,
  text              TEXT,
  group_id          INT REFERENCES groups(id),
  enabled           BOOLEAN DEFAULT TRUE,
  bday              DATE,
  gender            INT,
  religion          INT,
  hands             INT
);


------------------------------------------------------------------------------------------------------------------------------------------------


CREATE TABLE IF NOT EXISTS domains (
  id                SERIAL PRIMARY KEY,
  author_id         INT REFERENCES users(id),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name              TEXT UNIQUE NOT NULL,
  text              TEXT,
  sort              INT
);


CREATE TABLE IF NOT EXISTS subdomains (
  id                SERIAL PRIMARY KEY,
  author_id         INT REFERENCES users(id),
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  name              TEXT NOT NULL,
  text              TEXT,
  domain_id         INT REFERENCES domains(id) NOT NULL,
  sort              INT
);


CREATE TABLE IF NOT EXISTS items (
  id                SERIAL PRIMARY KEY,
  author_id         INT REFERENCES users(id),
  subdomain_id      INT REFERENCES subdomains(id) NOT NULL,
  name              TEXT,
  text              TEXT,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS behaviours (
  id                SERIAL PRIMARY KEY,
  author_id         INT REFERENCES users(id),
  text              TEXT NOT NULL,
  item_id           INT REFERENCES items(id) NOT NULL,
  niveau            INT NOT NULL, -- 0=notyet, 1, 2, 3, 4=advanced
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS examples (
  id                SERIAL PRIMARY KEY,
  author_id         INT REFERENCES users(id),
  behaviour_id      INT REFERENCES behaviours(id) NOT NULL,
  observation_id    INT REFERENCES behaviours(id),
  text              TEXT,
  approved          BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS ideas (
  id                SERIAL PRIMARY KEY,
  author_id         INT REFERENCES users(id),
  behaviour_id      INT REFERENCES behaviours(id) NOT NULL,
  observation_id    INT REFERENCES behaviours(id),
  text              TEXT,
  approved          BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS observations (
  id                SERIAL PRIMARY KEY,
  author_id         INT REFERENCES users(id),
  user_id           INT REFERENCES users(id),
  item_id           INT REFERENCES items(id),
  kid_id            INT REFERENCES kids(id),
  niveau            INT,
  help              BOOLEAN,
  approved          BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS notes (
  id                SERIAL PRIMARY KEY,
  author_id         INT REFERENCES users(id),
  user_id           INT REFERENCES users(id),
  text              TEXT NOT NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


------------------------------------------------------------------------------------------------------------------------------------------------


CREATE TABLE IF NOT EXISTS password_reset (
  id                SERIAL PRIMARY KEY,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  user_id           INT REFERENCES users(id),
  hash              TEXT UNIQUE,
  expires           DATE
);


----------------------------------------------------------------------------------------------------


-- auth table to run authentication queries against (back end only!)
CREATE VIEW auth AS
SELECT users.id,
       username,
       email,
       role,
       password_hash,
       disabled,
       approved
FROM users;

-- list of usernames to check during registration process (front end)
-- TODO is this still in use?

CREATE VIEW usernames AS
SELECT username FROM users;

CREATE VIEW authors AS
SELECT id, name, role FROM users;


----------------------------------------------------------------------------------------------------


-- automatically update modified_at
-- http://www.revsys.com/blog/2006/aug/04/automatically-updating-a-timestamp-column-in-postgresql/

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_groups_modtime BEFORE UPDATE
ON groups FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_users_modtime BEFORE UPDATE
ON users FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_kids_modtime BEFORE UPDATE
ON kids FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_domains_modtime BEFORE UPDATE
ON domains FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_subdomains_modtime BEFORE UPDATE
ON subdomains FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_items_modtime BEFORE UPDATE
ON items FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_behaviours_modtime BEFORE UPDATE
ON behaviours FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_observations_modtime BEFORE UPDATE
ON observations FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_examples_modtime BEFORE UPDATE
ON examples FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_ideas_modtime BEFORE UPDATE
ON ideas FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

-- EOF
