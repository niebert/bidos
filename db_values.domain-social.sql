INSERT INTO domains (title) VALUES ('Personale Kompetenzen');

INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Umgang mit eigenen Emotionen');
INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Selbstbewusstsein');
INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Selbständigkeit');
INSERT INTO subdomains (domain_id, title) VALUES ('1', 'Spiel- und Lernverhalten');

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

INSERT INTO behaviours (item_id, niveau, description) VALUES ('1', '1', 'benennt eigene Emotionen und Fähigkeiten');
INSERT INTO behaviours (item_id, niveau, description) VALUES ('1', '2', 'stellt Verbindungen zwischen eigenen Emotionen und Situationen her');
INSERT INTO behaviours (item_id, niveau, description) VALUES ('1', '3', 'stellt Verbindungen zwischen verschiedenen eigenen Emotionen in der gleichen Situation her');

INSERT INTO examples (behaviour_id, description) VALUES ('1', '"Ich habe ein ganz komisches Kribbeln im Bauch." (Vorfreude)');
INSERT INTO examples (behaviour_id, description) VALUES ('1', '"Ich habe ein ganz blödes Kribbeln im Bauch." (Vorfreude)');
INSERT INTO examples (behaviour_id, description) VALUES ('1', '"Ich muss mal." (Durchfall)');
INSERT INTO examples (behaviour_id, description) VALUES ('2', '"Ich habe da ganz schön weinen müssen, weil ich mir arg weh getan habe."');
INSERT INTO examples (behaviour_id, description) VALUES ('3', 'erzählt, dass es einerseits wütend auf seinen Bruder ist, aber zugleich auch traurig ist wegen des Streits mit ihm.');

-- EOF
