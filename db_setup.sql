
-- warning! dangerous stuff!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

/*

  referenced ids look like <referenced_table_name>_id

  http://stackoverflow.com/questions/5527632/c-sharp-naming-convention-title-vs-name

  things have titles, creatures and multitudes of creatures have names, but files have names?

  do i need junction tables _and_ foreign keys? can't i just do my joins `ON`

  the foreign keys instead of `USING` the junction table?

  `ON` vs `USING` when doing joins: http://stackoverflow.com/a/10432141/220472

  TODO MAKE ALL TABLE NAMES SINGULAR (sucks due to reserved words/quoting)

  TODO cant hash password from here

 */

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

  verified      BOOLEAN DEFAULT FALSE,
  verified_at   TIMESTAMP,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE users
CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,

  email         TEXT UNIQUE NOT NULL,
  username      TEXT UNIQUE NOT NULL,
  password      TEXT NOT NULL, -- TODO rename to hash or similar
  name          TEXT,

  role_id       INT REFERENCES roles(id), -- TODO NOT NULL
  group_id      INT REFERENCES groups(id), -- TODO NOT NULL

  verified      BOOLEAN DEFAULT FALSE,
  verified_at   TIMESTAMP,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE kids
CREATE TABLE IF NOT EXISTS kids (
  id            SERIAL PRIMARY KEY,

  name          TEXT NOT NULL,

  alias      TEXT UNIQUE NOT NULL,

  group_id      INT REFERENCES groups(id),

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


/*
  domains
  └── subdomains
      └── items
          ├── behaviours
          │   └── examples
          └── sheets
              └── ratings
*/


-- TABLE domain ("kompetenzbereich")
CREATE TABLE IF NOT EXISTS domains (
  id            SERIAL PRIMARY KEY,

  title         TEXT NOT NULL,

  description   TEXT,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- TABLE subdomain ("teilbereich")
CREATE TABLE IF NOT EXISTS subdomains (
  id            SERIAL PRIMARY KEY,

  domain_id     INT REFERENCES domains(id) NOT NULL,
  title         TEXT NOT NULL,

  description   TEXT,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- TABLE items ("bausteine")
CREATE TABLE IF NOT EXISTS items (
  id            SERIAL PRIMARY KEY,

  subdomain_id  INT REFERENCES subdomains(id) NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- TABLE behaviours ("verhaltensbeschreibungen")
CREATE TABLE IF NOT EXISTS behaviours (
  id            SERIAL PRIMARY KEY,

  item_id       INT REFERENCES items(id) NOT NULL,
  level         INT NOT NULL, -- 1..3
  description   TEXT NOT NULL,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- TABLE examples
CREATE TABLE IF NOT EXISTS examples (
  id            SERIAL PRIMARY KEY,

  behaviour_id  INT REFERENCES behaviours(id) NOT NULL,
  description   TEXT NOT NULL,

  verified      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- TABLE answers
CREATE TABLE IF NOT EXISTS answers (
  id            SERIAL PRIMARY KEY,

  author_id     INT REFERENCES users(id) NOT NULL,
  behaviour_id    INT REFERENCES behaviours(id) NOT NULL,
  selection     INT NOT NULL,

  -- TODO use array to allow multiple examples
  -- create separate (attached) examples and reference them here
  -- mark the example as verified true/false
  example_id    INT REFERENCES examples(id),

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

-- JUNCTION TABLE domains_subdomains
CREATE TABLE IF NOT EXISTS domains_subdomains (
  domain_id     INT REFERENCES domains(id),
  subdomain_id  INT REFERENCES subdomains(id)
);

-- JUNCTION TABLE subdomains_items
CREATE TABLE IF NOT EXISTS subdomains_items (
  subdomain_id  INT REFERENCES subdomains(id),
  item_id       INT REFERENCES items(id)
);

-- JUNCTION TABLE items_behaviours
CREATE TABLE IF NOT EXISTS items_behaviours (
  item_id       INT REFERENCES items(id),
  behaviour_id    INT REFERENCES behaviours(id)
);


-- roles
INSERT INTO roles (name) VALUES ('admin');
INSERT INTO roles (name) VALUES ('practitioner');
INSERT INTO roles (name) VALUES ('scientist');

INSERT INTO groups (name) VALUES ('Rot-1');
INSERT INTO groups (name) VALUES ('Blau');
INSERT INTO groups (name) VALUES ('XY');

INSERT INTO kids (name, alias, group_id) VALUES ('Luke Skywalker', 'xcxc', '1');
INSERT INTO kids (name, alias, group_id) VALUES ('Leia Organa', 'wrgq', '1');
INSERT INTO kids (name, alias, group_id) VALUES ('Han Solo', 'htej', '1');

INSERT INTO kids (name, alias, group_id) VALUES ('Emma', 'aefg', '2');
INSERT INTO kids (name, alias, group_id) VALUES ('Elsa', 'erge', '2');
INSERT INTO kids (name, alias, group_id) VALUES ('Adam', 'vwwv', '2');

INSERT INTO kids (name, alias, group_id) VALUES ('Matilda', 'h3wc', '3');
INSERT INTO kids (name, alias, group_id) VALUES ('Johann', 'sdfs', '3');
INSERT INTO kids (name, alias, group_id) VALUES ('India', 'v2vr', '3');

INSERT INTO domains (title) VALUES ('Personale Kompetenzen');
INSERT INTO domains (title) VALUES ('Sprachliche Kompetenzen');
INSERT INTO domains (title) VALUES ('Soziale Kompetenzen');
INSERT INTO domains (title) VALUES ('Mathematische Kompetenzen');

INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Umgang mit eigenen Emotionen');
INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Selbstbewusstsein');
INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Selbständigkeit');
INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Spiel- und Lernverhalten');

INSERT INTO subdomains (domain_id, title) VALUES ('2', 'Sprechen und Zuhören');
INSERT INTO subdomains (domain_id, title) VALUES ('2', 'Schreiben');
INSERT INTO subdomains (domain_id, title) VALUES ('2', 'Lesen');
INSERT INTO subdomains (domain_id, title) VALUES ('2', 'Sprachaufmerksamkeit');

INSERT INTO subdomains (domain_id, title) VALUES ('3', 'Kontakt');
INSERT INTO subdomains (domain_id, title) VALUES ('3', 'Kooperation');
INSERT INTO subdomains (domain_id, title) VALUES ('3', 'Konflikt');
INSERT INTO subdomains (domain_id, title) VALUES ('3', 'Perspektivenübernahme');

INSERT INTO subdomains (domain_id, title) VALUES ('4', 'Zahlen und Operationen');
INSERT INTO subdomains (domain_id, title) VALUES ('4', 'Raum und Form');
INSERT INTO subdomains (domain_id, title) VALUES ('4', 'Muster und Strukturen');
INSERT INTO subdomains (domain_id, title) VALUES ('4', 'Größen und Messen');
INSERT INTO subdomains (domain_id, title) VALUES ('4', 'Daten, Häufigkeit, Wahrscheinlichkeit');

INSERT INTO items (subdomain_id, title) VALUES ('1', 'Wahrnehmung eigener Emotionen');
INSERT INTO items (subdomain_id, title) VALUES ('1', 'Ursachen und Wirkungen von Emotionen');
INSERT INTO items (subdomain_id, title) VALUES ('1', 'Regulierung eigener Emotionen I');
INSERT INTO items (subdomain_id, title) VALUES ('1', 'Regulierung eigener Emotionen II');

INSERT INTO items (subdomain_id, title) VALUES ('2', 'Erkennen eigener Fähigkeiten');
INSERT INTO items (subdomain_id, title) VALUES ('2', 'Vergleichen eigener Fähigkeiten');
INSERT INTO items (subdomain_id, title) VALUES ('2', 'Selbstwirksamkeit');
INSERT INTO items (subdomain_id, title) VALUES ('2', 'Vertreten der eigenen Interessen und Meinungen');
INSERT INTO items (subdomain_id, title) VALUES ('2', 'Durchsetzen eigener Interessen');

INSERT INTO items (subdomain_id, title) VALUES ('3', 'Selbstständiges Handeln I');
INSERT INTO items (subdomain_id, title) VALUES ('3', 'Selbstständiges Handeln II');
INSERT INTO items (subdomain_id, title) VALUES ('3', 'Selbstorganisation');

INSERT INTO items (subdomain_id, title) VALUES ('4', 'Aufgabenorientierung');
INSERT INTO items (subdomain_id, title) VALUES ('4', 'Anstrengungsbereitschaft');
INSERT INTO items (subdomain_id, title) VALUES ('4', 'Ausdauer');
INSERT INTO items (subdomain_id, title) VALUES ('4', 'Explorations- und Lernfreude');
INSERT INTO items (subdomain_id, title) VALUES ('4', 'Fachsprache');

INSERT INTO behaviours (item_id, level, description) VALUES ('1', '1', 'benennt eigene Emotionen und Fähigkeiten');
INSERT INTO behaviours (item_id, level, description) VALUES ('1', '2', 'stellt Verbindungen zwischen eigenen Emotionen und Situationen her');
INSERT INTO behaviours (item_id, level, description) VALUES ('1', '3', 'stellt Verbindungen zwischen verschiedenen eigenen Emotionen in der gleichen Situation her');

-- INSERT INTO behaviours (item_id, level, description) VALUES ('2', '1', 'stellt Verbindungen zwischen verschiedenen eigenen Emotionen in der gleichen Situation her');
-- INSERT INTO behaviours (item_id, level, description) VALUES ('2', '2', 'stellt Verbindungen zwischen verschiedenen eigenen Emotionen in der gleichen Situation her');
-- INSERT INTO behaviours (item_id, level, description) VALUES ('2', '3', 'stellt Verbindungen zwischen verschiedenen eigenen Emotionen in der gleichen Situation her');

INSERT INTO examples (behaviour_id, description) VALUES ('1', '"Ich habe ein ganz komisches Kribbeln im Bauch." (Vorfreude)');
INSERT INTO examples (behaviour_id, description) VALUES ('1', '"Ich habe ein ganz blödes Kribbeln im Bauch." (Vorfreude)');
INSERT INTO examples (behaviour_id, description) VALUES ('1', '"Ich muss mal." (Durchfall)');
INSERT INTO examples (behaviour_id, description) VALUES ('2', '"Ich habe da ganz schön weinen müssen, weil ich mir arg weh getan habe."');
INSERT INTO examples (behaviour_id, description) VALUES ('3', 'erzählt, dass es einerseits wütend auf seinen Bruder ist, aber zugleich auch traurig ist wegen des Streits mit ihm.');

-- INSERT INTO examples (behaviour_id, description) VALUES ('4', '(er-)kennt Ursachen von eigenen Emotionen');
-- INSERT INTO examples (behaviour_id, description) VALUES ('5', '(er-)kennt unterschiedliche Ursachen und/oder Wirkungen von eigenen Emotionen');
-- INSERT INTO examples (behaviour_id, description) VALUES ('6', '(er-)kennt unterschiedliche Ursachen und Wir- kungen von komplexen eigenen Emotionen');


-- auth table to run authentication queries against
-- return value will be the clients user obj encoded in the jwt token
CREATE VIEW auth AS
  SELECT id, username, password from users;
-- CREATE VIEW auth AS
--   SELECT users.id, username, roles.name as role, email, password FROM users
--   INNER JOIN roles ON users.role_id = roles.id;

-- everything thats needed to construct a leistungsbogen
CREATE VIEW domain AS
  SELECT
    d.id    AS domain_id,
    dd.id   AS subdomain_id,
    i.id    AS item_id,
    ii.id   AS behaviour_id,
    ex.id   AS example_id,
    ii.description AS behaviour_description,
    ex.description AS example_description
  FROM domains AS d
    INNER JOIN subdomains AS dd ON d.id=dd.domain_id
    INNER JOIN items      AS i  ON dd.id=i.subdomain_id
    INNER JOIN behaviours   AS ii ON i.id=ii.item_id
    INNER JOIN examples   AS ex ON ii.id=ex.behaviour_id;


/* Resource 1: Categories + Items
*/

CREATE VIEW item_resources AS

/* domain */
SELECT array_agg(row_to_json(t)) AS domains
FROM
  (SELECT id,
          title,
          description,

     /* subdomain */
     (SELECT array_to_json(array_agg(row_to_json(u)))
      FROM
        (SELECT id,
                title,
                description,

           /* item */
           (SELECT array_to_json(array_agg(row_to_json(v)))
            FROM
              (SELECT id,
                      title,
                      description,

                 /* behaviour */
                 (SELECT array_to_json(array_agg(row_to_json(w)))
                  FROM
                    (SELECT id,
                            description,
                            LEVEL,

                       /* example */
                       (SELECT array_to_json(array_agg(row_to_json(x)))
                        FROM
                          (SELECT id,
                                  description
                           FROM examples
                           WHERE behaviours.id = behaviour_id) AS x) AS examples
                     FROM behaviours
                     WHERE items.id = item_id) AS w) AS behaviours
               FROM items
               WHERE subdomains.id = subdomain_id) AS v) AS items
         FROM subdomains
         WHERE domains.id = domain_id) AS u) AS subdomains
   FROM domains) AS t;



/* Resource 2: Groups + Kids
*/

CREATE VIEW kid_resources AS

/* group */
SELECT array_agg(row_to_json(t)) AS groups
FROM
  (SELECT id,
          name,
          description,

     /* group */
     (SELECT array_to_json(array_agg(row_to_json(u)))
      FROM
        (SELECT id,
                name
         FROM kids
         WHERE groups.id = group_id) AS u) AS kids
   FROM groups) AS t;



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

-- EOF
