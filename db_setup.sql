
-- warning! dangerous stuff!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- use faker to generate random children, groups and users

-- do i need junction tables _and_ foreign keys? can't i just do my joins `ON`
-- the foreign keys instead of `USING` the junction table?

-- `ON` vs `USING` when doing joins: http://stackoverflow.com/a/10432141/220472

-- TABLE roles
CREATE TABLE IF NOT EXISTS roles (
  role_id       SERIAL PRIMARY KEY,
  rolename      TEXT UNIQUE NOT NULL,
  description   TEXT
);

-- TABLE groups
CREATE TABLE IF NOT EXISTS groups (
  group_id      SERIAL PRIMARY KEY,
  groupname     TEXT UNIQUE NOT NULL,
  description   TEXT
);

-- TABLE users
CREATE TABLE IF NOT EXISTS users (
  user_id       SERIAL PRIMARY KEY,
  role_id       INT REFERENCES roles(role_id),
  group_id      INT REFERENCES groups(group_id),
  username      TEXT UNIQUE NOT NULL,
  email         TEXT UNIQUE NOT NULL,
  password      TEXT NOT NULL,
  fname         TEXT,
  lname         TEXT
);

-- TABLE children
CREATE TABLE IF NOT EXISTS children (
  child_id      SERIAL PRIMARY KEY,
  group_id      INT REFERENCES groups(group_id),
  fname         TEXT NOT NULL,
  lname         TEXT NOT NULL
);

-- TABLE surveys
CREATE TABLE IF NOT EXISTS surveys (
  survey_id     SERIAL PRIMARY KEY,
  child_id      INT REFERENCES children(child_id),
  title         TEXT NOT NULL,
  description   TEXT
);

-- TABLE items
CREATE TABLE IF NOT EXISTS items (
  item_id       SERIAL PRIMARY KEY,
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

-- JUNCTION TABLE groups_children
CREATE TABLE IF NOT EXISTS groups_children (
  group_id      INT REFERENCES groups(group_id),
  child_id      INT REFERENCES children(child_id)
);

-- JUNCTION TABLE surveys_items
CREATE TABLE IF NOT EXISTS surveys_items (
  survey_id     INT REFERENCES surveys(survey_id),
  item_id       INT REFERENCES items(item_id)
);

-- JUNCTION TABLE surveys_children
CREATE TABLE IF NOT EXISTS surveys_children (
  survey_id     INT REFERENCES surveys(survey_id),
  child_id      INT REFERENCES children(child_id)
);

-- roles
INSERT INTO roles (rolename) VALUES ('admin');
INSERT INTO roles (rolename) VALUES ('practitioner');
INSERT INTO roles (rolename) VALUES ('scientist');

-- default users are set in ./Makefile via curl

-- all users
CREATE VIEW all_users AS
  SELECT user_id, username, email, fname, lname, rolename FROM users
  INNER JOIN roles ON users.role_id = roles.role_id;

-- all users belonging to groups
CREATE VIEW all_user_with_a_group AS
  SELECT user_id, username, email, fname, lname, rolename, groupname FROM users
  INNER JOIN roles ON users.role_id = roles.role_id
  INNER JOIN groups ON users.group_id = groups.group_id;

-- auth table to run authentication queries against
-- return value will be the clients user obj encoded in the jwt token
CREATE VIEW auth AS
  SELECT user_id, username, rolename as role, email, password, fname, lname FROM users
  INNER JOIN roles ON users.role_id = roles.role_id;

-- EOF
