
-- warning! dangerous stuff!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- use faker to generate random kids, groups and users

-- do i need junction tables _and_ foreign keys? can't i just do my joins `ON`
-- the foreign keys instead of `USING` the junction table?

-- `ON` vs `USING` when doing joins: http://stackoverflow.com/a/10432141/220472

-- things have titles, creatures and multitudes of creatures have names. but
-- files have names!

--   http://stackoverflow.com/questions/5527632/c-sharp-naming-convention-title-vs-name

-- referenced ids look like <referenced_table_name>_id

-- TABLE roles
CREATE TABLE IF NOT EXISTS roles (
  id            SERIAL PRIMARY KEY,

  name          TEXT UNIQUE NOT NULL,

  description   TEXT,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE groups
CREATE TABLE IF NOT EXISTS groups (
  id            SERIAL PRIMARY KEY,

  name          TEXT UNIQUE NOT NULL,

  description   TEXT,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE users
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,

  role_id       INT REFERENCES roles(id),
  group_id      INT REFERENCES groups(id),

  email         TEXT UNIQUE NOT NULL,
  username      TEXT UNIQUE NOT NULL,

  password      TEXT NOT NULL,

  organization  TEXT,
  phone         TEXT,
  name          TEXT,

  verified      BOOLEAN DEFAULT FALSE,
  verified_at   TIMESTAMP,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE kids
CREATE TABLE IF NOT EXISTS kids (
  id            SERIAL PRIMARY KEY,

  group_id      INT REFERENCES groups(id),

  name          TEXT NOT NULL,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE surveys
CREATE TABLE IF NOT EXISTS surveys (
  id            SERIAL PRIMARY KEY,

  kid_id        INT REFERENCES kids(id),

  title         TEXT NOT NULL,

  description   TEXT,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE items
CREATE TABLE IF NOT EXISTS items (
  id            SERIAL PRIMARY KEY,

  survey_id     INT REFERENCES surveys(id),

  title         TEXT NOT NULL,

  description   TEXT,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





-- JUNCTION TABLE roles_users
CREATE TABLE IF NOT EXISTS roles_users (
  role_id       INT REFERENCES roles(id),
  user_id       INT REFERENCES users(id)
);

-- JUNCTION TABLE groups_users
CREATE TABLE IF NOT EXISTS groups_users (
  group_id      INT REFERENCES groups(id),
  user_id       INT REFERENCES users(id)
);

-- JUNCTION TABLE groups_kids
CREATE TABLE IF NOT EXISTS groups_kids (
  group_id      INT REFERENCES groups(id),
  kid_id        INT REFERENCES kids(id)
);

-- JUNCTION TABLE surveys_items
CREATE TABLE IF NOT EXISTS surveys_items (
  survey_id     INT REFERENCES surveys(id),
  item_id       INT REFERENCES items(id)
);

-- JUNCTION TABLE surveys_kids
CREATE TABLE IF NOT EXISTS surveys_kids (
  survey_id     INT REFERENCES surveys(id),
  kid_id        INT REFERENCES kids(id)
);





-- roles
INSERT INTO roles (name) VALUES ('admin');
INSERT INTO roles (name) VALUES ('practitioner');
INSERT INTO roles (name) VALUES ('scientist');





-- auth table to run authentication queries against
-- return value will be the clients user obj encoded in the jwt token
CREATE VIEW auth AS
  SELECT users.id, username, roles.name as role, email, password FROM users
  INNER JOIN roles ON users.role_id = roles.id;





-- AUTOMATICALLY UPDATE MODIFIED_AT
-- http://www.revsys.com/blog/2006/aug/04/automatically-updating-a-timestamp-column-in-postgresql/

CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.modified_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_modtime BEFORE UPDATE
ON users FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_kids_modtime BEFORE UPDATE
ON kids FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_groups_modtime BEFORE UPDATE
ON groups FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_items_modtime BEFORE UPDATE
ON items FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_surveys_modtime BEFORE UPDATE
ON surveys FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

-- EOF
