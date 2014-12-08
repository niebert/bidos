-- roles
INSERT INTO roles (name) VALUES ('admin');
INSERT INTO roles (name) VALUES ('practitioner');
INSERT INTO roles (name) VALUES ('scientist');

INSERT INTO groups (name) VALUES ('Gruppe Rot-1');
INSERT INTO groups (name) VALUES ('Gruppe Blau');
INSERT INTO groups (name) VALUES ('Gruppe XY');

INSERT INTO kids (name, nickname, group_id) VALUES ('Luke Skywalker', 'xcxc', '1');
INSERT INTO kids (name, nickname, group_id) VALUES ('Leia Organa', 'wrgq', '1');
INSERT INTO kids (name, nickname, group_id) VALUES ('Han Solo', 'htej', '1');

INSERT INTO kids (name, nickname, group_id) VALUES ('Emma', 'aefg', '2');
INSERT INTO kids (name, nickname, group_id) VALUES ('Elsa', 'erge', '2');
INSERT INTO kids (name, nickname, group_id) VALUES ('Adam', 'vwwv', '2');
INSERT INTO kids (name, nickname, group_id) VALUES ('Marlene', 'ls', '2');

INSERT INTO kids (name, nickname, group_id) VALUES ('Matilda', 'h3wc', '3');
INSERT INTO kids (name, nickname, group_id) VALUES ('Johann', 'sdfs', '3');
INSERT INTO kids (name, nickname, group_id) VALUES ('India', 'v2vr', '3');
INSERT INTO kids (name, nickname, group_id) VALUES ('Margarethe', 'zrqd', '3');

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
INSERT INTO examples (behaviour_id, description) VALUES ('2', '"Ich habe da ganz schön weinen müssen, weil ich mir arg weh getan habe."');
INSERT INTO examples (behaviour_id, description) VALUES ('3', 'erzählt, dass es einerseits wütend auf seinen Bruder ist, aber zugleich auch traurig ist wegen des Streits mit ihm.');

-- INSERT INTO examples (behaviour_id, description) VALUES ('4', '(er-)kennt Ursachen von eigenen Emotionen');
-- INSERT INTO examples (behaviour_id, description) VALUES ('5', '(er-)kennt unterschiedliche Ursachen und/oder Wirkungen von eigenen Emotionen');
-- INSERT INTO examples (behaviour_id, description) VALUES ('6', '(er-)kennt unterschiedliche Ursachen und Wir- kungen von komplexen eigenen Emotionen');
