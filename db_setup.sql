
-- warning! dangerous stuff!
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

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




-- untouched, unsynced
CREATE TABLE IF NOT EXISTS roles (
  id            SERIAL PRIMARY KEY,
  name          TEXT UNIQUE NOT NULL
);






CREATE TABLE IF NOT EXISTS groups (
  id            SERIAL PRIMARY KEY,

  name          TEXT UNIQUE NOT NULL,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





CREATE TABLE IF NOT EXISTS users (
  id            SERIAL PRIMARY KEY,

  email         TEXT UNIQUE NOT NULL,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT,
  institution   TEXT,
  name          TEXT NOT NULL,
  status        INT DEFAULT 1, -- -1=deactivated 0=normal 1=pending

  role_id       INT REFERENCES roles(id), -- NOT NULL, FIXME
  group_id      INT REFERENCES groups(id),

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





CREATE TABLE IF NOT EXISTS kids (
  id            SERIAL PRIMARY KEY,

  name          TEXT NOT NULL,

  age           INT,
  sex           INT,

  group_id      INT REFERENCES groups(id),

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





CREATE TABLE IF NOT EXISTS domains (
  id            SERIAL PRIMARY KEY,

  title         TEXT NOT NULL,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





CREATE TABLE IF NOT EXISTS subdomains (
  id            SERIAL PRIMARY KEY,

  title         TEXT NOT NULL,

  domain_id     INT REFERENCES domains(id) NOT NULL,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





CREATE TABLE IF NOT EXISTS items (
  id            SERIAL PRIMARY KEY,

  title         TEXT NOT NULL,

  subdomain_id  INT REFERENCES subdomains(id) NOT NULL,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





CREATE TABLE IF NOT EXISTS behaviours (
  id            SERIAL PRIMARY KEY,

  niveau        INT NOT NULL,
  description   TEXT NOT NULL,

  item_id       INT REFERENCES items(id), -- TODO NOT NULL

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





CREATE TABLE IF NOT EXISTS examples (
  id            SERIAL PRIMARY KEY,

  behaviour_id  INT REFERENCES behaviours(id), -- TODO NOT NULL
  description   TEXT NOT NULL,

  verified      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





-- TABLE observations
CREATE TABLE IF NOT EXISTS observations (
  id            SERIAL PRIMARY KEY,

  value         INT NOT NULL, -- -2=advanced -1=behind 0=unknown 1,2,3=niveau
  help          BOOLEAN DEFAULT false,

  item_id       INT REFERENCES behaviours(id),
  author_id     INT REFERENCES users(id),
  kid_id        INT REFERENCES kids(id),

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);





-- -- JUNCTION TABLE roles_users
-- CREATE TABLE IF NOT EXISTS roles_users (
--   role_id       INT REFERENCES roles(id),
--   user_id       INT REFERENCES users(id)
-- );

-- -- JUNCTION TABLE groups_users
-- CREATE TABLE IF NOT EXISTS groups_users (
--   group_id      INT REFERENCES groups(id),
--   user_id       INT REFERENCES users(id)
-- );

-- -- JUNCTION TABLE groups_kids
-- CREATE TABLE IF NOT EXISTS groups_kids (
--   group_id      INT REFERENCES groups(id),
--   kid_id        INT REFERENCES kids(id)
-- );

-- -- JUNCTION TABLE domains_subdomains
-- CREATE TABLE IF NOT EXISTS domains_subdomains (
--   domain_id     INT REFERENCES domains(id),
--   subdomain_id  INT REFERENCES subdomains(id)
-- );

-- -- JUNCTION TABLE subdomains_items
-- CREATE TABLE IF NOT EXISTS subdomains_items (
--   subdomain_id  INT REFERENCES subdomains(id),
--   item_id       INT REFERENCES items(id)
-- );

-- -- JUNCTION TABLE items_behaviours
-- CREATE TABLE IF NOT EXISTS items_behaviours (
--   item_id       INT REFERENCES items(id),
--   behaviour_id  INT REFERENCES behaviours(id)
-- );

-- auth table to run authentication queries against (back end only!)
CREATE VIEW auth AS
SELECT users.id,
       username,
       email,
       roles.name AS role,
       password_hash
FROM users
LEFT JOIN roles ON roles.id=role_id;

-- auth table to run authentication queries against
CREATE VIEW usernames AS
SELECT username FROM users;

-- resource 1: categories + items
CREATE VIEW item_resources AS

/* domain */
SELECT array_agg(row_to_json(t)) AS domains
FROM
  (SELECT id,
          title,

     /* subdomain */
     (SELECT array_to_json(array_agg(row_to_json(u)))
      FROM
        (SELECT id,
                domain_id,
                title,

           /* item */
           (SELECT array_to_json(array_agg(row_to_json(v)))
            FROM
              (SELECT id,
                      subdomain_id,
                      title,

                 /* behaviour */
                 (SELECT array_to_json(array_agg(row_to_json(w)))
                  FROM
                    (SELECT id,
                            item_id,
                            description,
                            niveau,

                       /* example */
                       (SELECT array_to_json(array_agg(row_to_json(x)))
                        FROM
                          (SELECT id,
                                  behaviour_id,
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

-- resource 2: groups + kids
CREATE VIEW kid_resources AS

/* group */
SELECT array_agg(row_to_json(t)) AS groups
FROM
  (SELECT id,
          name,

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

CREATE TRIGGER update_behaviours_modtime BEFORE UPDATE
ON behaviours FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_observations_modtime BEFORE UPDATE
ON observations FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_domains_modtime BEFORE UPDATE
ON domains FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_subdomains_modtime BEFORE UPDATE
ON subdomains FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();

CREATE TRIGGER update_examples_modtime BEFORE UPDATE
ON examples FOR EACH ROW EXECUTE PROCEDURE
update_modified_column();





















































































-- roles
INSERT INTO roles (name) VALUES ('admin');
INSERT INTO roles (name) VALUES ('practitioner');
INSERT INTO roles (name) VALUES ('scientist');

INSERT INTO groups (name) VALUES ('Fuchsia.io');
INSERT INTO groups (name) VALUES ('Polymer Industries');
INSERT INTO groups (name) VALUES ('Aperture Labs');
INSERT INTO groups (name) VALUES ('Fracture.org');






/* A PERSONALE KOMPETENZEN */
INSERT INTO domains (title) VALUES ('Personale Kompetenzen');

INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Umgang mit eigenen Emotionen');
INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Selbstbewusstsein');
INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Selbständigkeit');
INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Spiel- und Lernverhalten');
INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Sprache im fachlichen Kontext');

/* Umgang mit eigenen Emotionen */
INSERT INTO items (subdomain_id, title) VALUES ('1', 'Wahrnehmung eigener Emotionen');
INSERT INTO items (subdomain_id, title) VALUES ('1', 'Ursachen und Wirkungen von Emotionen');
INSERT INTO items (subdomain_id, title) VALUES ('1', 'Regulierung eigener Emotionen I');
INSERT INTO items (subdomain_id, title) VALUES ('1', 'Regulierung eigener Emotionen II');

/* Selbstbewusstsein */
INSERT INTO items (subdomain_id, title) VALUES ('2', 'Erkennen eigener Fähigkeiten');
INSERT INTO items (subdomain_id, title) VALUES ('2', 'Vergleichen eigener Fähigkeiten');
INSERT INTO items (subdomain_id, title) VALUES ('2', 'Selbstwirksamkeit');
INSERT INTO items (subdomain_id, title) VALUES ('2', 'Vertreten der eigenen Interessen und Meinungen');
INSERT INTO items (subdomain_id, title) VALUES ('2', 'Durchsetzen eigener Interessen');

/* Selbständigkeit */
INSERT INTO items (subdomain_id, title) VALUES ('3', 'Selbstständiges Handeln I');
INSERT INTO items (subdomain_id, title) VALUES ('3', 'Selbstständiges Handeln II');
INSERT INTO items (subdomain_id, title) VALUES ('3', 'Selbstorganisation');

/* Spiel- und Lernverhalten */
INSERT INTO items (subdomain_id, title) VALUES ('4', 'Aufgabenorientierung');
INSERT INTO items (subdomain_id, title) VALUES ('4', 'Anstrengungsbereitschaft');
INSERT INTO items (subdomain_id, title) VALUES ('4', 'Ausdauer');
INSERT INTO items (subdomain_id, title) VALUES ('4', 'Explorations- und Lernfreude');

/* Sprache im fachlichen Kontext */
INSERT INTO items (subdomain_id, title) VALUES ('5', 'Fachsprache');





/* B SCHRIFTLICHE UND SPRACHLICHE KOMPETENZEN */
INSERT INTO domains (title) VALUES ('Schriftliche und sprachliche Kompetenzen');

INSERT INTO subdomains (domain_id, title) VALUES ('2', 'Sprechen und Zuhören');
INSERT INTO subdomains (domain_id, title) VALUES ('2', 'Schreiben');
INSERT INTO subdomains (domain_id, title) VALUES ('2', 'Lesen/Umgang mit Texten und Medien');
INSERT INTO subdomains (domain_id, title) VALUES ('2', 'Sprachaufmerksamkeit');
INSERT INTO subdomains (domain_id, title) VALUES ('2', 'Sprache im fachlichen Kontext');

/* Sprechen und Zuhören */
INSERT INTO items (subdomain_id, title) VALUES ('6', 'Zuhören I');
INSERT INTO items (subdomain_id, title) VALUES ('6', 'Zuhören II');
INSERT INTO items (subdomain_id, title) VALUES ('6', 'Zuhören III');
INSERT INTO items (subdomain_id, title) VALUES ('6', 'Struktur des Erzählens');
INSERT INTO items (subdomain_id, title) VALUES ('6', 'Form des Erzählens');
INSERT INTO items (subdomain_id, title) VALUES ('6', 'Beschreiben');
INSERT INTO items (subdomain_id, title) VALUES ('6', 'Erklären');
INSERT INTO items (subdomain_id, title) VALUES ('6', 'Passiv — Konjunktiv');
INSERT INTO items (subdomain_id, title) VALUES ('6', 'Nebensätze');
INSERT INTO items (subdomain_id, title) VALUES ('6', 'Gesprächsbeteiligung');

/* Schreiben */
INSERT INTO items (subdomain_id, title) VALUES ('7', 'Schreibfertigkeit');
INSERT INTO items (subdomain_id, title) VALUES ('7', 'Wörter schreiben');
INSERT INTO items (subdomain_id, title) VALUES ('7', 'Texte verfassen');

/* Lesen */
INSERT INTO items (subdomain_id, title) VALUES ('8', 'Lesefertigkeit I');
INSERT INTO items (subdomain_id, title) VALUES ('8', 'Lesefertigkeit II');
INSERT INTO items (subdomain_id, title) VALUES ('8', 'Leseverständnis');
INSERT INTO items (subdomain_id, title) VALUES ('8', 'Umgang mit Text und Medien');

/* Sprachaufmerksamkeit */
INSERT INTO items (subdomain_id, title) VALUES ('9', 'Phonologische Bewusstheit I');
INSERT INTO items (subdomain_id, title) VALUES ('9', 'Phonologische Bewusstheit II');
INSERT INTO items (subdomain_id, title) VALUES ('9', 'Fehler korrigieren');
INSERT INTO items (subdomain_id, title) VALUES ('9', 'Situationsangemessenheit');
INSERT INTO items (subdomain_id, title) VALUES ('9', 'Mehrsprachigkeit');

/* Sprache im fachlichen Kontext */
INSERT INTO items (subdomain_id, title) VALUES ('10', 'Fachsprache');





INSERT INTO domains (title) VALUES ('Soziale Kompetenzen');

INSERT INTO subdomains (domain_id, title) VALUES ('3', 'Kontakt');
INSERT INTO subdomains (domain_id, title) VALUES ('3', 'Kooperation');
INSERT INTO subdomains (domain_id, title) VALUES ('3', 'Konflikt');
INSERT INTO subdomains (domain_id, title) VALUES ('3', 'Perspektivenübernahme');
INSERT INTO subdomains (domain_id, title) VALUES ('3', 'Sprache im fachlichen Kontext');

/* Kontakt */
INSERT INTO items (subdomain_id, title) VALUES ('11', 'Initiierung sozialer Kontakte');
INSERT INTO items (subdomain_id, title) VALUES ('11', 'Gezielte Wahl von Spiel- und Arbeitspartnern');
INSERT INTO items (subdomain_id, title) VALUES ('11', 'Gestaltung von freundschaftlichen Beziehungen');
INSERT INTO items (subdomain_id, title) VALUES ('11', 'Sprache zur Kontaktaufnahme und –aufrechterhaltung');
INSERT INTO items (subdomain_id, title) VALUES ('11', 'Andere verstehen');
INSERT INTO items (subdomain_id, title) VALUES ('11', 'Sich selbst Anderen gegenüber verständlich machen');

/* Kooperation */
INSERT INTO items (subdomain_id, title) VALUES ('12', 'Beteiligung an sozialen Gruppenaktivitäten');
INSERT INTO items (subdomain_id, title) VALUES ('12', 'Beachtung sozialer (Spiel-)Regeln');
INSERT INTO items (subdomain_id, title) VALUES ('12', 'Gemeinsame Bewältigung von Kooperationsaufgaben');

/* Konflikt */
INSERT INTO items (subdomain_id, title) VALUES ('13', 'Konflikte bewältigen I');
INSERT INTO items (subdomain_id, title) VALUES ('13', 'Konflikte bewältigen II');
INSERT INTO items (subdomain_id, title) VALUES ('13', 'Konfliktanlässe und –wirkungen erkennen');

/* Perspektivenübernahme */
INSERT INTO items (subdomain_id, title) VALUES ('14', 'Empathie');
INSERT INTO items (subdomain_id, title) VALUES ('14', 'Wahrnehmung der Subjektivität von Perspektiven');
INSERT INTO items (subdomain_id, title) VALUES ('14', 'Koordination von Perspektiven');
INSERT INTO items (subdomain_id, title) VALUES ('14', 'Fachsprache');

/* Sprache im fachlichen Kontext */
INSERT INTO items (subdomain_id, title) VALUES ('15', 'Fachsprache');








INSERT INTO domains (title) VALUES ('Mathematische Kompetenzen');

INSERT INTO subdomains (domain_id, title) VALUES ('4', 'Zahlen und Operationen');
INSERT INTO subdomains (domain_id, title) VALUES ('4', 'Raum und Form');
INSERT INTO subdomains (domain_id, title) VALUES ('4', 'Muster und Strukturen');
INSERT INTO subdomains (domain_id, title) VALUES ('4', 'Größen und Messen');
INSERT INTO subdomains (domain_id, title) VALUES ('4', 'Daten, Häufigkeit, Wahrscheinlichkeit');
INSERT INTO subdomains (domain_id, title) VALUES ('4', 'Sprache im fachlichen Kontext');

/* Zahlen und Operationen */
INSERT INTO items (subdomain_id, title) VALUES ('16', 'Zählen I');
INSERT INTO items (subdomain_id, title) VALUES ('16', 'Zählen II');
INSERT INTO items (subdomain_id, title) VALUES ('16', 'Zählen III');
INSERT INTO items (subdomain_id, title) VALUES ('16', 'Zählen IV');
INSERT INTO items (subdomain_id, title) VALUES ('16', 'Mengen I');
INSERT INTO items (subdomain_id, title) VALUES ('16', 'Mengen II');
INSERT INTO items (subdomain_id, title) VALUES ('16', 'Mengen III');
INSERT INTO items (subdomain_id, title) VALUES ('16', 'Symbole');
INSERT INTO items (subdomain_id, title) VALUES ('16', 'Operationen I');
INSERT INTO items (subdomain_id, title) VALUES ('16', 'Operationen II');

/* Raum und Form */
INSERT INTO items (subdomain_id, title) VALUES ('17', 'Raum und Form I');
INSERT INTO items (subdomain_id, title) VALUES ('17', 'Raum und Form II');
INSERT INTO items (subdomain_id, title) VALUES ('17', 'Flächenformen I');
INSERT INTO items (subdomain_id, title) VALUES ('17', 'Flächenformen II');

/* Muster und Strukturen */
INSERT INTO items (subdomain_id, title) VALUES ('18', 'Muster und Strukturen');

/* Größen und Messen */
INSERT INTO items (subdomain_id, title) VALUES ('19', 'Größen und Messen I');
INSERT INTO items (subdomain_id, title) VALUES ('19', 'Größen und Messen II');
INSERT INTO items (subdomain_id, title) VALUES ('19', 'Größen und Messen III');

/* Daten, Häufigkeit, Wahrscheinlichkeit */
INSERT INTO items (subdomain_id, title) VALUES ('20', 'Daten, Häufigkeit, Wahrscheinlichkeit I');
INSERT INTO items (subdomain_id, title) VALUES ('20', 'Daten, Häufigkeit, Wahrscheinlichkeit II');
INSERT INTO items (subdomain_id, title) VALUES ('20', 'Daten, Häufigkeit, Wahrscheinlichkeit III');

/* Sprache im fachlichen Kontext */
INSERT INTO items (subdomain_id, title) VALUES ('21', 'Fachsprache');












INSERT INTO behaviours (item_id, niveau, description) VALUES ('1', '1', 'benennt eigene Emotionen und Fähigkeiten');
INSERT INTO behaviours (item_id, niveau, description) VALUES ('1', '2', 'stellt Verbindungen zwischen eigenen Emotionen und Situationen her');
INSERT INTO behaviours (item_id, niveau, description) VALUES ('1', '3', 'stellt Verbindungen zwischen verschiedenen eigenen Emotionen in der gleichen Situation her');

INSERT INTO behaviours (item_id, niveau, description) VALUES ('2', '1', '(er-)kennt Ursachen von eigenen Emotionen');
INSERT INTO behaviours (item_id, niveau, description) VALUES ('2', '2', '(er-)kennt unterschiedliche Ursachen und/oder Wirkungen von eigenen Emotionen');
INSERT INTO behaviours (item_id, niveau, description) VALUES ('2', '3', '(er-)kennt unterschiedliche Ursachen und Wirkungen von komplexen eigenen Emotionen');

INSERT INTO examples (behaviour_id, description) VALUES ('1', '"Ich habe ein ganz komisches Kribbeln im Bauch." (Vorfreude)');
INSERT INTO examples (behaviour_id, description) VALUES ('2', '"Ich habe da ganz schön weinen müssen, weil ich mir arg weh getan habe."');
INSERT INTO examples (behaviour_id, description) VALUES ('3', 'erzählt, dass es einerseits wütend auf seinen Bruder ist, aber zugleich auch traurig ist wegen des Streits mit ihm.');


-- EOF

