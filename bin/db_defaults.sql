-- BIDOS DEFAULT DATA

----------------------------------------------------------------------------------------------------

INSERT INTO institutions (name) VALUES ('Kindertagesstätte Villa Unibunt');

INSERT INTO institutions (name) VALUES ('Hort an der Grundschule Süd');
INSERT INTO institutions (name) VALUES ('Integrative Kindertagesstätte Lebenshilfe');
INSERT INTO institutions (name) VALUES ('Katholische Kindertagesstätte St. Maria');
INSERT INTO institutions (name) VALUES ('Katholische Kindertagesstätte Godramstein');

INSERT INTO groups (institution_id, name) VALUES ('1', 'Lustige Löwen');
INSERT INTO groups (institution_id, name) VALUES ('1', 'Bescheidene Bären');
INSERT INTO groups (institution_id, name) VALUES ('2', 'Schlaue Schafe');
INSERT INTO groups (institution_id, name) VALUES ('2', 'Fliegende Fische');
INSERT INTO groups (institution_id, name) VALUES ('3', 'Gut Holz');
INSERT INTO groups (institution_id, name) VALUES ('3', 'Waidmanns Heil');
INSERT INTO groups (institution_id, name) VALUES ('4', 'Flora und Faune');
INSERT INTO groups (institution_id, name) VALUES ('4', 'Schief und Krumm');
INSERT INTO groups (institution_id, name) VALUES ('5', 'Kain und Abel');
INSERT INTO groups (institution_id, name) VALUES ('5', 'Herz und Niere');

----------------------------------------------------------------------------------------------------

/* A PERSONALE KOMPETENZEN */
INSERT INTO domains (name) VALUES ('Personale Kompetenzen');

INSERT INTO subdomains (domain_id, name) VALUES ('1', 'Umgang mit eigenen Emotionen');
INSERT INTO subdomains (domain_id, name) VALUES ('1', 'Selbstbewusstsein');
INSERT INTO subdomains (domain_id, name) VALUES ('1', 'Selbständigkeit');
INSERT INTO subdomains (domain_id, name) VALUES ('1', 'Spiel- und Lernverhalten');
INSERT INTO subdomains (domain_id, name) VALUES ('1', 'Sprache im fachlichen Kontext');

/* Umgang mit eigenen Emotionen */
INSERT INTO items (subdomain_id, name) VALUES ('1', 'Wahrnehmung eigener Emotionen');
INSERT INTO items (subdomain_id, name) VALUES ('1', 'Ursachen und Wirkungen von Emotionen');
INSERT INTO items (subdomain_id, name) VALUES ('1', 'Regulierung eigener Emotionen I');
INSERT INTO items (subdomain_id, name) VALUES ('1', 'Regulierung eigener Emotionen II');

/* Selbstbewusstsein */
INSERT INTO items (subdomain_id, name) VALUES ('2', 'Erkennen eigener Fähigkeiten');
INSERT INTO items (subdomain_id, name) VALUES ('2', 'Vergleichen eigener Fähigkeiten');
INSERT INTO items (subdomain_id, name) VALUES ('2', 'Selbstwirksamkeit');
INSERT INTO items (subdomain_id, name) VALUES ('2', 'Vertreten der eigenen Interessen und Meinungen');
INSERT INTO items (subdomain_id, name) VALUES ('2', 'Durchsetzen eigener Interessen');

/* Selbständigkeit */
INSERT INTO items (subdomain_id, name) VALUES ('3', 'Selbstständiges Handeln I');
INSERT INTO items (subdomain_id, name) VALUES ('3', 'Selbstständiges Handeln II');
INSERT INTO items (subdomain_id, name) VALUES ('3', 'Selbstorganisation');

/* Spiel- und Lernverhalten */
INSERT INTO items (subdomain_id, name) VALUES ('4', 'Aufgabenorientierung');
INSERT INTO items (subdomain_id, name) VALUES ('4', 'Anstrengungsbereitschaft');
INSERT INTO items (subdomain_id, name) VALUES ('4', 'Ausdauer');
INSERT INTO items (subdomain_id, name) VALUES ('4', 'Explorations- und Lernfreude');

/* Sprache im fachlichen Kontext */
INSERT INTO items (subdomain_id, name) VALUES ('5', 'Fachsprache');

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
