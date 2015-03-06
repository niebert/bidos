-- BIDOS DEFAULT DATA

/* A PERSONALE KOMPETENZEN */
INSERT INTO domains (name) VALUES ('Personale Kompetenzen');

/* Umgang mit eigenen Emotionen */
INSERT INTO subdomains (domain_id, name) VALUES ('1', 'Umgang mit eigenen Emotionen');
INSERT INTO items (subdomain_id, name) VALUES ('1', 'Wahrnehmung eigener Emotionen');
INSERT INTO items (subdomain_id, name) VALUES ('1', 'Ursachen und Wirkungen von Emotionen');
INSERT INTO items (subdomain_id, name) VALUES ('1', 'Regulierung eigener Emotionen I');
INSERT INTO items (subdomain_id, name) VALUES ('1', 'Regulierung eigener Emotionen II');

/* Selbstbewusstsein */
INSERT INTO subdomains (domain_id, name) VALUES ('1', 'Selbstbewusstsein');
INSERT INTO items (subdomain_id, name) VALUES ('2', 'Erkennen eigener Fähigkeiten');
INSERT INTO items (subdomain_id, name) VALUES ('2', 'Vergleichen eigener Fähigkeiten');
INSERT INTO items (subdomain_id, name) VALUES ('2', 'Selbstwirksamkeit');
INSERT INTO items (subdomain_id, name) VALUES ('2', 'Vertreten der eigenen Interessen und Meinungen');
INSERT INTO items (subdomain_id, name) VALUES ('2', 'Durchsetzen eigener Interessen');

/* Selbständigkeit */
INSERT INTO subdomains (domain_id, name) VALUES ('1', 'Selbständigkeit');
INSERT INTO items (subdomain_id, name) VALUES ('3', 'Selbstständiges Handeln I');
INSERT INTO items (subdomain_id, name) VALUES ('3', 'Selbstständiges Handeln II');
INSERT INTO items (subdomain_id, name) VALUES ('3', 'Selbstorganisation');

/* Spiel- und Lernverhalten */
INSERT INTO subdomains (domain_id, name) VALUES ('1', 'Spiel- und Lernverhalten');
INSERT INTO items (subdomain_id, name) VALUES ('4', 'Aufgabenorientierung');
INSERT INTO items (subdomain_id, name) VALUES ('4', 'Anstrengungsbereitschaft');
INSERT INTO items (subdomain_id, name) VALUES ('4', 'Ausdauer');
INSERT INTO items (subdomain_id, name) VALUES ('4', 'Explorations- und Lernfreude');

/* Sprache im fachlichen Kontext */
INSERT INTO subdomains (domain_id, name) VALUES ('1', 'Sprache im fachlichen Kontext');
INSERT INTO items (subdomain_id, name) VALUES ('5', 'Fachsprache');




INSERT INTO behaviours (item_id, niveau, text) VALUES ('1', '1', 'benennt eigene Emotionen und Fähigkeiten');
INSERT INTO behaviours (item_id, niveau, text) VALUES ('1', '2', 'stellt Verbindungen zwischen eigenen Emotionen und Situationen her');
INSERT INTO behaviours (item_id, niveau, text) VALUES ('1', '3', 'stellt Verbindungen zwischen verschiedenen eigenen Emotionen in der gleichen Situation her');

INSERT INTO behaviours (item_id, niveau, text) VALUES ('2', '1', '(er-)kennt Ursachen von eigenen Emotionen');
INSERT INTO behaviours (item_id, niveau, text) VALUES ('2', '2', '(er-)kennt unterschiedliche Ursachen und/oder Wirkungen von eigenen Emotionen');
INSERT INTO behaviours (item_id, niveau, text) VALUES ('2', '3', '(er-)kennt unterschiedliche Ursachen und Wirkungen von komplexen eigenen Emotionen');

INSERT INTO behaviours (item_id, niveau, text) VALUES ('3', '1', 'reguliert eigene Emotionen durch Rückzug aus der emotionsgeladenen Situation');
INSERT INTO behaviours (item_id, niveau, text) VALUES ('3', '2', 'reguliert eigene Emotionen durch Manipulation der emotionsauslösenden Situation (z.B. Ablenkung in der Situation)');
INSERT INTO behaviours (item_id, niveau, text) VALUES ('3', '3', 'reguliert eigene Emotionen durch gedankliche Ablenkung, Austausch mit Anderen oder sozial angemessenes Verbergen');

INSERT INTO behaviours (item_id, niveau, text) VALUES ('4', '1', 'wartet kurz ab, bis es eine Belohnung (materiell oder immateriell) erhält');
INSERT INTO behaviours (item_id, niveau, text) VALUES ('4', '2', 'verzichtet zugunsten einer größeren (späteren) Belohnung auf eine kleinere (frühere)');
INSERT INTO behaviours (item_id, niveau, text) VALUES ('4', '3', 'verzichtet zugunsten einer größeren (späteren) Belohnung auf eine kleinere (frühere) und begründet dies');

INSERT INTO examples (behaviour_id, text) VALUES ('1', '"Ich  Kribbeln im Bauch."habe ein ganz komisches (Vorfreude)');
INSERT INTO examples (behaviour_id, text) VALUES ('1', '"Ich ganz komisches Kribbeln habe ein im Bauch." (Vorfreude)');
INSERT INTO examples (behaviour_id, text) VALUES ('1', '"Ich habe  Baibbeln im(Vorfuch." ein ganz komisches Krreude)');
INSERT INTO examples (behaviour_id, text) VALUES ('1', '"Ich habe ein ganz komisches Kribbeln im Bauch." (Vorfreude)');
INSERT INTO examples (behaviour_id, text) VALUES ('1', '"Ich habe ein ganz komisches Kribbeln im Bauch." (Vorfreude)');
INSERT INTO examples (behaviour_id, text) VALUES ('2', '"Ich habe da ganz schön weinen müssen, weil ich mir arg weh getan habe."');
INSERT INTO examples (behaviour_id, text) VALUES ('2', '"Ich hinen müssen, weil ich mirabe da ganz schön we arg weh getan habe."');
INSERT INTO examples (behaviour_id, text) VALUES ('2', '"Ich hw ganz schön weinen eh getanabe damüssen, weil ich mir arg  habe."');
INSERT INTO examples (behaviour_id, text) VALUES ('3', 'erzählt, dass es einerseits wütend auf seinen Bruder ist, aber zugleich auch traurig ist wegen des Streits mit ihm.');
INSERT INTO examples (behaviour_id, text) VALUES ('4', '"Ich freue mich immer, wenn Papa mir was mitbringt."');
INSERT INTO examples (behaviour_id, text) VALUES ('5', '"Ich freue mich, wenn ich ein Tor schieße, weil wir dann die Sieger sind"');
INSERT INTO examples (behaviour_id, text) VALUES ('6', 'Ich habe mich sehr geschämt, als ich beim Fahrradturnier runtergefallen bin, obwohl ich gar nichts dazu konnte, der Klotz lag …');
INSERT INTO examples (behaviour_id, text) VALUES ('7', 'läuft aus dem Raum, in dem sich Kinder zanken');
INSERT INTO examples (behaviour_id, text) VALUES ('8', 'lenkt sich nach einem Streit mit etwas Schönem, dem Anhören einer CD, ab');
INSERT INTO examples (behaviour_id, text) VALUES ('9', 'verbirgt Enttäuschung, wenn eine Erwartung nicht erfüllt wurde');
INSERT INTO examples (behaviour_id, text) VALUES ('10', 'räumt schnell auf, damit es früher nach draußen kann');
INSERT INTO examples (behaviour_id, text) VALUES ('11', 'wartet ab, damit später alle zusammen weggehen können');
INSERT INTO examples (behaviour_id, text) VALUES ('12', 'Ich spare mein Geld, damit ich mir später die Indianerfigur kaufen kann');





----------------------------------------------------------------------------------------------------

/* B SCHRIFTLICHE UND SPRACHLICHE KOMPETENZEN */
INSERT INTO domains (name) VALUES ('Schriftliche und sprachliche Kompetenzen');

INSERT INTO subdomains (domain_id, name) VALUES ('2', 'Sprechen und Zuhören');
INSERT INTO subdomains (domain_id, name) VALUES ('2', 'Schreiben');
INSERT INTO subdomains (domain_id, name) VALUES ('2', 'Lesen/Umgang mit Texten und Medien');
INSERT INTO subdomains (domain_id, name) VALUES ('2', 'Sprachaufmerksamkeit');
INSERT INTO subdomains (domain_id, name) VALUES ('2', 'Sprache im fachlichen Kontext');

/* Sprechen und Zuhören */
INSERT INTO items (subdomain_id, name) VALUES ('6', 'Zuhören I');
INSERT INTO items (subdomain_id, name) VALUES ('6', 'Zuhören II');
INSERT INTO items (subdomain_id, name) VALUES ('6', 'Zuhören III');
INSERT INTO items (subdomain_id, name) VALUES ('6', 'Struktur des Erzählens');
INSERT INTO items (subdomain_id, name) VALUES ('6', 'Form des Erzählens');
INSERT INTO items (subdomain_id, name) VALUES ('6', 'Beschreiben');
INSERT INTO items (subdomain_id, name) VALUES ('6', 'Erklären');
INSERT INTO items (subdomain_id, name) VALUES ('6', 'Passiv — Konjunktiv');
INSERT INTO items (subdomain_id, name) VALUES ('6', 'Nebensätze');
INSERT INTO items (subdomain_id, name) VALUES ('6', 'Gesprächsbeteiligung');

/* Schreiben */
INSERT INTO items (subdomain_id, name) VALUES ('7', 'Schreibfertigkeit');
INSERT INTO items (subdomain_id, name) VALUES ('7', 'Wörter schreiben');
INSERT INTO items (subdomain_id, name) VALUES ('7', 'Texte verfassen');

/* Lesen */
INSERT INTO items (subdomain_id, name) VALUES ('8', 'Lesefertigkeit I');
INSERT INTO items (subdomain_id, name) VALUES ('8', 'Lesefertigkeit II');
INSERT INTO items (subdomain_id, name) VALUES ('8', 'Leseverständnis');
INSERT INTO items (subdomain_id, name) VALUES ('8', 'Umgang mit Text und Medien');

/* Sprachaufmerksamkeit */
INSERT INTO items (subdomain_id, name) VALUES ('9', 'Phonologische Bewusstheit I');
INSERT INTO items (subdomain_id, name) VALUES ('9', 'Phonologische Bewusstheit II');
INSERT INTO items (subdomain_id, name) VALUES ('9', 'Fehler korrigieren');
INSERT INTO items (subdomain_id, name) VALUES ('9', 'Situationsangemessenheit');
INSERT INTO items (subdomain_id, name) VALUES ('9', 'Mehrsprachigkeit');

/* Sprache im fachlichen Kontext */
INSERT INTO items (subdomain_id, name) VALUES ('10', 'Fachsprache');

----------------------------------------------------------------------------------------------------

INSERT INTO domains (name) VALUES ('Soziale Kompetenzen');

INSERT INTO subdomains (domain_id, name) VALUES ('3', 'Kontakt');
INSERT INTO subdomains (domain_id, name) VALUES ('3', 'Kooperation');
INSERT INTO subdomains (domain_id, name) VALUES ('3', 'Konflikt');
INSERT INTO subdomains (domain_id, name) VALUES ('3', 'Perspektivenübernahme');
INSERT INTO subdomains (domain_id, name) VALUES ('3', 'Sprache im fachlichen Kontext');

/* Kontakt */
INSERT INTO items (subdomain_id, name) VALUES ('11', 'Initiierung sozialer Kontakte');
INSERT INTO items (subdomain_id, name) VALUES ('11', 'Gezielte Wahl von Spiel- und Arbeitspartnern');
INSERT INTO items (subdomain_id, name) VALUES ('11', 'Gestaltung von freundschaftlichen Beziehungen');
INSERT INTO items (subdomain_id, name) VALUES ('11', 'Sprache zur Kontaktaufnahme und –aufrechterhaltung');
INSERT INTO items (subdomain_id, name) VALUES ('11', 'Andere verstehen');
INSERT INTO items (subdomain_id, name) VALUES ('11', 'Sich selbst Anderen gegenüber verständlich machen');

/* Kooperation */
INSERT INTO items (subdomain_id, name) VALUES ('12', 'Beteiligung an sozialen Gruppenaktivitäten');
INSERT INTO items (subdomain_id, name) VALUES ('12', 'Beachtung sozialer (Spiel-)Regeln');
INSERT INTO items (subdomain_id, name) VALUES ('12', 'Gemeinsame Bewältigung von Kooperationsaufgaben');

/* Konflikt */
INSERT INTO items (subdomain_id, name) VALUES ('13', 'Konflikte bewältigen I');
INSERT INTO items (subdomain_id, name) VALUES ('13', 'Konflikte bewältigen II');
INSERT INTO items (subdomain_id, name) VALUES ('13', 'Konfliktanlässe und –wirkungen erkennen');

/* Perspektivenübernahme */
INSERT INTO items (subdomain_id, name) VALUES ('14', 'Empathie');
INSERT INTO items (subdomain_id, name) VALUES ('14', 'Wahrnehmung der Subjektivität von Perspektiven');
INSERT INTO items (subdomain_id, name) VALUES ('14', 'Koordination von Perspektiven');

/* Sprache im fachlichen Kontext */
INSERT INTO items (subdomain_id, name) VALUES ('15', 'Fachsprache');

----------------------------------------------------------------------------------------------------

INSERT INTO domains (name) VALUES ('Mathematische Kompetenzen');

INSERT INTO subdomains (domain_id, name) VALUES ('4', 'Zahlen und Operationen');
INSERT INTO subdomains (domain_id, name) VALUES ('4', 'Raum und Form');
INSERT INTO subdomains (domain_id, name) VALUES ('4', 'Muster und Strukturen');
INSERT INTO subdomains (domain_id, name) VALUES ('4', 'Größen und Messen');
INSERT INTO subdomains (domain_id, name) VALUES ('4', 'Daten, Häufigkeit, Wahrscheinlichkeit');
INSERT INTO subdomains (domain_id, name) VALUES ('4', 'Sprache im fachlichen Kontext');

/* Zahlen und Operationen */
INSERT INTO items (subdomain_id, name) VALUES ('16', 'Zählen I');
INSERT INTO items (subdomain_id, name) VALUES ('16', 'Zählen II');
INSERT INTO items (subdomain_id, name) VALUES ('16', 'Zählen III');
INSERT INTO items (subdomain_id, name) VALUES ('16', 'Zählen IV');
INSERT INTO items (subdomain_id, name) VALUES ('16', 'Mengen I');
INSERT INTO items (subdomain_id, name) VALUES ('16', 'Mengen II');
INSERT INTO items (subdomain_id, name) VALUES ('16', 'Mengen III');
INSERT INTO items (subdomain_id, name) VALUES ('16', 'Symbole');
INSERT INTO items (subdomain_id, name) VALUES ('16', 'Operationen I');
INSERT INTO items (subdomain_id, name) VALUES ('16', 'Operationen II');

/* Raum und Form */
INSERT INTO items (subdomain_id, name) VALUES ('17', 'Raum und Form I');
INSERT INTO items (subdomain_id, name) VALUES ('17', 'Raum und Form II');
INSERT INTO items (subdomain_id, name) VALUES ('17', 'Flächenformen I');
INSERT INTO items (subdomain_id, name) VALUES ('17', 'Flächenformen II');

/* Muster und Strukturen */
INSERT INTO items (subdomain_id, name) VALUES ('18', 'Muster und Strukturen');

/* Größen und Messen */
INSERT INTO items (subdomain_id, name) VALUES ('19', 'Größen und Messen I');
INSERT INTO items (subdomain_id, name) VALUES ('19', 'Größen und Messen II');
INSERT INTO items (subdomain_id, name) VALUES ('19', 'Größen und Messen III');

/* Daten, Häufigkeit, Wahrscheinlichkeit */
INSERT INTO items (subdomain_id, name) VALUES ('20', 'Daten, Häufigkeit, Wahrscheinlichkeit I');
INSERT INTO items (subdomain_id, name) VALUES ('20', 'Daten, Häufigkeit, Wahrscheinlichkeit II');
INSERT INTO items (subdomain_id, name) VALUES ('20', 'Daten, Häufigkeit, Wahrscheinlichkeit III');

/* Sprache im fachlichen Kontext */
INSERT INTO items (subdomain_id, name) VALUES ('21', 'Fachsprache');

----------------------------------------------------------------------------------------------------
-- EOF
