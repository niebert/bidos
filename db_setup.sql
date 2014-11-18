
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
  description   TEXT
);

-- TABLE groups
CREATE TABLE IF NOT EXISTS groups (
  id            SERIAL PRIMARY KEY,
  name          TEXT UNIQUE NOT NULL,
  description   TEXT
);

-- TABLE users
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,
  role_id       INT REFERENCES roles(role_id),
  group_id      INT REFERENCES groups(group_id),
  email         TEXT UNIQUE NOT NULL,
  username      TEXT UNIQUE NOT NULL,
  password      TEXT NOT NULL,
  name          TEXT
);

-- TABLE kids
CREATE TABLE IF NOT EXISTS kids (
  id            SERIAL PRIMARY KEY,
  group_id      INT REFERENCES groups(group_id),
  name          TEXT NOT NULL
);

-- TABLE surveys
CREATE TABLE IF NOT EXISTS surveys (
  id            SERIAL PRIMARY KEY,
  kid_id        INT REFERENCES kids(kid_id),
  title         TEXT NOT NULL,
  description   TEXT
);

-- TABLE items
CREATE TABLE IF NOT EXISTS items (
  id            SERIAL PRIMARY KEY,
  survey_id     INT REFERENCES surveys(survey_id),
  title         TEXT NOT NULL,
  description   TEXT
);

-- JUNCTION TABLE roles_users
CREATE TABLE IF NOT EXISTS roles_users (
  role_id       INT REFERENCES roles(role_id),
  user_id       INT REFERENCES users(user_id)
);

-- JUNCTION TABLE groups_users
CREATE TABLE IF NOT EXISTS groups_users (
  group_id      INT REFERENCES groups(group_id),
  user_id       INT REFERENCES users(user_id)
);

-- JUNCTION TABLE groups_kids
CREATE TABLE IF NOT EXISTS groups_kids (
  group_id      INT REFERENCES groups(group_id),
  kid_id        INT REFERENCES kids(kid_id)
);

-- JUNCTION TABLE surveys_items
CREATE TABLE IF NOT EXISTS surveys_items (
  survey_id     INT REFERENCES surveys(survey_id),
  item_id       INT REFERENCES items(item_id)
);

-- JUNCTION TABLE surveys_kids
CREATE TABLE IF NOT EXISTS surveys_kids (
  survey_id     INT REFERENCES surveys(survey_id),
  kid_id        INT REFERENCES kids(kid_id)
);

-- roles
INSERT INTO roles (rolename) VALUES ('admin');
INSERT INTO roles (rolename) VALUES ('practitioner');
INSERT INTO roles (rolename) VALUES ('scientist');

-- default users are created in ./Makefile via curl (TODO)

-- all users
CREATE VIEW allUsers AS
  SELECT user_id, username, email, name, rolename as role FROM users
  INNER JOIN roles ON users.role_id = roles.role_id;

-- all users belonging to groups
CREATE VIEW all_user_with_a_group AS
  SELECT user_id, username, email, name, rolename as role, groupname FROM users
  INNER JOIN roles ON users.role_id = roles.role_id
  INNER JOIN groups ON users.group_id = groups.group_id;

-- auth table to run authentication queries against
-- return value will be the clients user obj encoded in the jwt token
CREATE VIEW auth AS
  SELECT user_id as id, username, rolename as role, email, password, name FROM users
  INNER JOIN roles ON users.role_id = roles.role_id;

-- EOF
