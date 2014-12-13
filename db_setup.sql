
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
  password_hash TEXT NOT NULL,
  name          TEXT NOT NULL,

  role_id       INT REFERENCES roles(id), -- NOT NULL, FIXME
  group_id      INT REFERENCES groups(id),

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS kids (
  id            SERIAL PRIMARY KEY,

  name          TEXT NOT NULL,

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

  item_id       INT REFERENCES items(id) NOT NULL,

  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS examples (
  id            SERIAL PRIMARY KEY,

  behaviour_id  INT REFERENCES behaviours(id) NOT NULL,
  description   TEXT NOT NULL,

  verified      BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  modified_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABLE observations
CREATE TABLE IF NOT EXISTS observations (
  id            SERIAL PRIMARY KEY,

  value         INT NOT NULL, -- -2=advanced -1=notyet 0=na 1,2,3=niveau
  help          BOOLEAN DEFAULT false,

  item_id       INT REFERENCES behaviours(id) NOT NULL,
  author_id     INT REFERENCES users(id) NOT NULL,

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

-- auth table to run authentication queries against
CREATE VIEW auth AS
SELECT users.id,
       username,
       roles.name AS role,
       password_hash
FROM users
LEFT JOIN roles ON roles.id=role_id;

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

INSERT INTO kids (group_id, name) VALUES ('1', 'Wolf Prantl');
INSERT INTO kids (group_id, name) VALUES ('1', 'Heinrich Rothmann');
INSERT INTO kids (group_id, name) VALUES ('1', 'Joseph Priesner');
INSERT INTO kids (group_id, name) VALUES ('1', 'Helmina Rommel');
INSERT INTO kids (group_id, name) VALUES ('1', 'Hannah Boll');
INSERT INTO kids (group_id, name) VALUES ('1', 'Cecilia Wolff');
INSERT INTO kids (group_id, name) VALUES ('1', 'Fabian Bormann');
INSERT INTO kids (group_id, name) VALUES ('1', 'Detlev Haeberle');
INSERT INTO kids (group_id, name) VALUES ('1', 'Erik Eugster');
INSERT INTO kids (group_id, name) VALUES ('1', 'Cecilia Rabe');
INSERT INTO kids (group_id, name) VALUES ('1', 'Hildegard Lobe');
INSERT INTO kids (group_id, name) VALUES ('1', 'Eckhardt Drexler');
INSERT INTO kids (group_id, name) VALUES ('1', 'Alfons Heider');
INSERT INTO kids (group_id, name) VALUES ('1', 'Ben Stellwagen');
INSERT INTO kids (group_id, name) VALUES ('1', 'Nico Glas');
INSERT INTO kids (group_id, name) VALUES ('1', 'Willi Fähnrich');
INSERT INTO kids (group_id, name) VALUES ('1', 'Elisa Braunlich');
INSERT INTO kids (group_id, name) VALUES ('1', 'Hedwig Wintsch');
INSERT INTO kids (group_id, name) VALUES ('1', 'Johanna Rehder');
INSERT INTO kids (group_id, name) VALUES ('1', 'Christopher Huppert');
INSERT INTO kids (group_id, name) VALUES ('1', 'Brigitte Pichler');
INSERT INTO kids (group_id, name) VALUES ('1', 'Adam Josten');
INSERT INTO kids (group_id, name) VALUES ('1', 'Emma Uffermann');
INSERT INTO kids (group_id, name) VALUES ('1', 'Friedrich Brauner');
INSERT INTO kids (group_id, name) VALUES ('1', 'Hanns Faerber');

INSERT INTO kids (group_id, name) VALUES ('2', 'Albuin Christmann');
INSERT INTO kids (group_id, name) VALUES ('2', 'Felizitas Baader');
INSERT INTO kids (group_id, name) VALUES ('2', 'Elena Reger');
INSERT INTO kids (group_id, name) VALUES ('2', 'Frank Uffermann');
INSERT INTO kids (group_id, name) VALUES ('2', 'Christiane Tisch');
INSERT INTO kids (group_id, name) VALUES ('2', 'Johann Dillinger');
INSERT INTO kids (group_id, name) VALUES ('2', 'Johanne Veil');
INSERT INTO kids (group_id, name) VALUES ('2', 'Jonathan Deichgräber');
INSERT INTO kids (group_id, name) VALUES ('2', 'Kilian Macher');
INSERT INTO kids (group_id, name) VALUES ('2', 'Justin Korsch');
INSERT INTO kids (group_id, name) VALUES ('2', 'Felizia Holz');
INSERT INTO kids (group_id, name) VALUES ('2', 'Erica Reimold');
INSERT INTO kids (group_id, name) VALUES ('2', 'Alexandra Wendlinger');
INSERT INTO kids (group_id, name) VALUES ('2', 'Ingrid Berlepsch');
INSERT INTO kids (group_id, name) VALUES ('2', 'Niklas Hopfer');
INSERT INTO kids (group_id, name) VALUES ('2', 'Florentine Käutner');
INSERT INTO kids (group_id, name) VALUES ('2', 'Meike Kindler');
INSERT INTO kids (group_id, name) VALUES ('2', 'Beatrix Marks');
INSERT INTO kids (group_id, name) VALUES ('2', 'Heike Hesse');
INSERT INTO kids (group_id, name) VALUES ('2', 'Lili Imhoff');
INSERT INTO kids (group_id, name) VALUES ('2', 'Yannik Rothenstein');
INSERT INTO kids (group_id, name) VALUES ('2', 'Thomas Lemmer');
INSERT INTO kids (group_id, name) VALUES ('2', 'Marko Honigsmann');
INSERT INTO kids (group_id, name) VALUES ('2', 'Veit Pfisterer');
INSERT INTO kids (group_id, name) VALUES ('2', 'Philip Tegeler');

INSERT INTO kids (group_id, name) VALUES ('3', 'Patrizia Eichenberg');
INSERT INTO kids (group_id, name) VALUES ('3', 'Eckart Scherrer');
INSERT INTO kids (group_id, name) VALUES ('3', 'Hannelore Wallmann');
INSERT INTO kids (group_id, name) VALUES ('3', 'Evelyn Lauterbach');
INSERT INTO kids (group_id, name) VALUES ('3', 'Valentina Curschmann');
INSERT INTO kids (group_id, name) VALUES ('3', 'Angelina Bierbaum');
INSERT INTO kids (group_id, name) VALUES ('3', 'Linus Lobe');
INSERT INTO kids (group_id, name) VALUES ('3', 'Catrin Degener');
INSERT INTO kids (group_id, name) VALUES ('3', 'Gregor Kestenbaum');
INSERT INTO kids (group_id, name) VALUES ('3', 'Volker Kaulen');
INSERT INTO kids (group_id, name) VALUES ('3', 'Reinhold Balmer');
INSERT INTO kids (group_id, name) VALUES ('3', 'Elli Tausch');
INSERT INTO kids (group_id, name) VALUES ('3', 'Florentina Wilpert');
INSERT INTO kids (group_id, name) VALUES ('3', 'Walpurgis Hengsbach');
INSERT INTO kids (group_id, name) VALUES ('3', 'Walburg Wandesleben');
INSERT INTO kids (group_id, name) VALUES ('3', 'Marion Hammesfahr');
INSERT INTO kids (group_id, name) VALUES ('3', 'Beate Engel');
INSERT INTO kids (group_id, name) VALUES ('3', 'Marina Sehlmann');
INSERT INTO kids (group_id, name) VALUES ('3', 'Ben Achleitner');
INSERT INTO kids (group_id, name) VALUES ('3', 'Marie Seidl');
INSERT INTO kids (group_id, name) VALUES ('3', 'Asser Bleich');
INSERT INTO kids (group_id, name) VALUES ('3', 'Helge Wittgenstein');
INSERT INTO kids (group_id, name) VALUES ('3', 'Clara Braunlich');
INSERT INTO kids (group_id, name) VALUES ('3', 'Maja Härig');
INSERT INTO kids (group_id, name) VALUES ('3', 'Paula Hengstler');

INSERT INTO kids (group_id, name) VALUES ('4', 'Per Von Hardenberg');
INSERT INTO kids (group_id, name) VALUES ('4', 'Ingeborg Fincke');
INSERT INTO kids (group_id, name) VALUES ('4', 'Laura Feuerstein');
INSERT INTO kids (group_id, name) VALUES ('4', 'Adalger Himmler');
INSERT INTO kids (group_id, name) VALUES ('4', 'Gerwald Denker');
INSERT INTO kids (group_id, name) VALUES ('4', 'Koloman Goethe');
INSERT INTO kids (group_id, name) VALUES ('4', 'Hannes Seeliger');
INSERT INTO kids (group_id, name) VALUES ('4', 'Rupprecht Dreyfuss');
INSERT INTO kids (group_id, name) VALUES ('4', 'Theresia Neufeld');
INSERT INTO kids (group_id, name) VALUES ('4', 'Raimund Oppolzer');
INSERT INTO kids (group_id, name) VALUES ('4', 'Angelo Krist');
INSERT INTO kids (group_id, name) VALUES ('4', 'Klemens Augenstein');
INSERT INTO kids (group_id, name) VALUES ('4', 'Ottilie Strecker');
INSERT INTO kids (group_id, name) VALUES ('4', 'Oscar Grau');
INSERT INTO kids (group_id, name) VALUES ('4', 'Therese Stuhr');
INSERT INTO kids (group_id, name) VALUES ('4', 'Lea Hönigswald');
INSERT INTO kids (group_id, name) VALUES ('4', 'Erik Becken');
INSERT INTO kids (group_id, name) VALUES ('4', 'Andreas Tugendhat');
INSERT INTO kids (group_id, name) VALUES ('4', 'Eckhart Mertz');
INSERT INTO kids (group_id, name) VALUES ('4', 'Helge Gustloff');
INSERT INTO kids (group_id, name) VALUES ('4', 'Maja Heldmann');
INSERT INTO kids (group_id, name) VALUES ('4', 'Magdalena Eichinger');
INSERT INTO kids (group_id, name) VALUES ('4', 'Hartmut Landsberg');
INSERT INTO kids (group_id, name) VALUES ('4', 'Katja Niedenthal');
INSERT INTO kids (group_id, name) VALUES ('4', 'Emily Riedel');

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

INSERT INTO items (subdomain_id, title) VALUES ('5', 'Zuhören I');
INSERT INTO items (subdomain_id, title) VALUES ('5', 'Zuhören II');
INSERT INTO items (subdomain_id, title) VALUES ('5', 'Zuhören III');
INSERT INTO items (subdomain_id, title) VALUES ('5', 'Struktur des Erzählens');
INSERT INTO items (subdomain_id, title) VALUES ('5', 'Form des Erzählens');
INSERT INTO items (subdomain_id, title) VALUES ('5', 'Beschreiben');
INSERT INTO items (subdomain_id, title) VALUES ('5', 'Erklären');
INSERT INTO items (subdomain_id, title) VALUES ('5', 'Passiv — Konjunktiv');
INSERT INTO items (subdomain_id, title) VALUES ('5', 'Nebensätze');
INSERT INTO items (subdomain_id, title) VALUES ('5', 'Gesprächsbeteiligung');

INSERT INTO items (subdomain_id, title) VALUES ('6', 'Schreibfertigkeit');
INSERT INTO items (subdomain_id, title) VALUES ('6', 'Wörter schreiben');
INSERT INTO items (subdomain_id, title) VALUES ('6', 'Texte verfassen');

INSERT INTO items (subdomain_id, title) VALUES ('7', 'Lesefertigkeit I');
INSERT INTO items (subdomain_id, title) VALUES ('7', 'Lesefertigkeit II');
INSERT INTO items (subdomain_id, title) VALUES ('7', 'Leseverständnis');
INSERT INTO items (subdomain_id, title) VALUES ('7', 'Umgang mit Text und Medien');

INSERT INTO items (subdomain_id, title) VALUES ('8', 'Phonologische Bewusstheit I');
INSERT INTO items (subdomain_id, title) VALUES ('8', 'Phonologische Bewusstheit II');
INSERT INTO items (subdomain_id, title) VALUES ('8', 'Fehler korrigieren');
INSERT INTO items (subdomain_id, title) VALUES ('8', 'Situationsangemessenheit');
INSERT INTO items (subdomain_id, title) VALUES ('8', 'Mehrsprachigkeit');
INSERT INTO items (subdomain_id, title) VALUES ('8', 'Fachsprache');

INSERT INTO items (subdomain_id, title) VALUES ('9', 'Initiierung sozialer Kontakte');
INSERT INTO items (subdomain_id, title) VALUES ('9', 'Gezielte Wahl von Spiel- und Arbeitspartnern');
INSERT INTO items (subdomain_id, title) VALUES ('9', 'Gestaltung von freundschaftlichen Beziehungen');
INSERT INTO items (subdomain_id, title) VALUES ('9', 'Sprache zur Kontaktaufnahme und –aufrechterhaltung');
INSERT INTO items (subdomain_id, title) VALUES ('9', 'Andere verstehen');
INSERT INTO items (subdomain_id, title) VALUES ('9', 'Sich selbst Anderen gegenüber verständlich machen');

INSERT INTO items (subdomain_id, title) VALUES ('10', 'Beteiligung an sozialen Gruppenaktivitäten');
INSERT INTO items (subdomain_id, title) VALUES ('10', 'Beachtung sozialer (Spiel-)Regeln');
INSERT INTO items (subdomain_id, title) VALUES ('10', 'Gemeinsame Bewältigung von Kooperationsaufgaben');

INSERT INTO items (subdomain_id, title) VALUES ('11', 'Konflikte bewältigen I');
INSERT INTO items (subdomain_id, title) VALUES ('11', 'Konflikte bewältigen II');
INSERT INTO items (subdomain_id, title) VALUES ('11', 'Konfliktanlässe und –wirkungen erkennen');

INSERT INTO items (subdomain_id, title) VALUES ('12', 'Empathie');
INSERT INTO items (subdomain_id, title) VALUES ('12', 'Wahrnehmung der Subjektivität von Perspektiven');
INSERT INTO items (subdomain_id, title) VALUES ('12', 'Koordination von Perspektiven');
INSERT INTO items (subdomain_id, title) VALUES ('12', 'Fachsprache');

INSERT INTO items (subdomain_id, title) VALUES ('13', 'Zählen I');
INSERT INTO items (subdomain_id, title) VALUES ('13', 'Zählen II');
INSERT INTO items (subdomain_id, title) VALUES ('13', 'Zählen III');
INSERT INTO items (subdomain_id, title) VALUES ('13', 'Zählen IV');
INSERT INTO items (subdomain_id, title) VALUES ('13', 'Mengen I');
INSERT INTO items (subdomain_id, title) VALUES ('13', 'Mengen II');
INSERT INTO items (subdomain_id, title) VALUES ('13', 'Mengen III');
INSERT INTO items (subdomain_id, title) VALUES ('13', 'Symbole');
INSERT INTO items (subdomain_id, title) VALUES ('13', 'Operationen I');
INSERT INTO items (subdomain_id, title) VALUES ('13', 'Operationen II');

INSERT INTO items (subdomain_id, title) VALUES ('14', 'Raum und Form I');
INSERT INTO items (subdomain_id, title) VALUES ('14', 'Raum und Form II');
INSERT INTO items (subdomain_id, title) VALUES ('14', 'Flächenformen I');
INSERT INTO items (subdomain_id, title) VALUES ('14', 'Flächenformen II');

INSERT INTO items (subdomain_id, title) VALUES ('15', 'Muster und Strukturen');

INSERT INTO items (subdomain_id, title) VALUES ('16', 'Größen und Messen I');
INSERT INTO items (subdomain_id, title) VALUES ('16', 'Größen und Messen II');
INSERT INTO items (subdomain_id, title) VALUES ('16', 'Größen und Messen III');

INSERT INTO items (subdomain_id, title) VALUES ('17', 'Daten, Häufigkeit, Wahrscheinlichkeit I');
INSERT INTO items (subdomain_id, title) VALUES ('17', 'Daten, Häufigkeit, Wahrscheinlichkeit II');
INSERT INTO items (subdomain_id, title) VALUES ('17', 'Daten, Häufigkeit, Wahrscheinlichkeit III');
INSERT INTO items (subdomain_id, title) VALUES ('17', 'Fachsprache');

INSERT INTO behaviours (item_id, niveau, description) VALUES ('1', '1', 'benennt eigene Emotionen und Fähigkeiten');
INSERT INTO behaviours (item_id, niveau, description) VALUES ('1', '2', 'stellt Verbindungen zwischen eigenen Emotionen und Situationen her');
INSERT INTO behaviours (item_id, niveau, description) VALUES ('1', '3', 'stellt Verbindungen zwischen verschiedenen eigenen Emotionen in der gleichen Situation her');

INSERT INTO behaviours (item_id, niveau, description) VALUES ('2', '1', '(er-)kennt Ursachen von eigenen Emotionen');
INSERT INTO behaviours (item_id, niveau, description) VALUES ('2', '2', '(er-)kennt unterschiedliche Ursachen und/oder Wirkungen von eigenen Emotionen');
INSERT INTO behaviours (item_id, niveau, description) VALUES ('2', '3', '(er-)kennt unterschiedliche Ursachen und Wirkungen von komplexen eigenen Emotionen');

-- INSERT INTO behaviours (item_id, niveau, description) VALUES ('2', '1', 'stellt Verbindungen zwischen verschiedenen eigenen Emotionen in der gleichen Situation her');
-- INSERT INTO behaviours (item_id, niveau, description) VALUES ('2', '2', 'stellt Verbindungen zwischen verschiedenen eigenen Emotionen in der gleichen Situation her');
-- INSERT INTO behaviours (item_id, niveau, description) VALUES ('2', '3', 'stellt Verbindungen zwischen verschiedenen eigenen Emotionen in der gleichen Situation her');

INSERT INTO examples (behaviour_id, description) VALUES ('1', '"Ich habe ein ganz komisches Kribbeln im Bauch." (Vorfreude)');
INSERT INTO examples (behaviour_id, description) VALUES ('2', '"Ich habe da ganz schön weinen müssen, weil ich mir arg weh getan habe."');
INSERT INTO examples (behaviour_id, description) VALUES ('3', 'erzählt, dass es einerseits wütend auf seinen Bruder ist, aber zugleich auch traurig ist wegen des Streits mit ihm.');


-- EOF

