# BiDoS - Bildungsdokumentationssystem

## Installation & Setup

### Voraussetzungen

- postgres 9.4.0+
- node 0.11.14+
- gulp (`npm install gulp -g`)
- bower (`npm install bower -g`)

### 1. Datenbank (1/2)

```
createuser bidos
```

### 2. Server

```
git clone https://github.com/rwilhelm/bidos.git
cd bidos
make install
npm start
```

Die benötigten Pakete des Projekts müssten jetzt installiert sein und der Server auf Port 3000 laufen.

### 3. Datenbank (2/2)

```
make db
```

Die Datenbank ist nun eingerichtet mit notwendigen Resourcen (Stand: Ende 2014) vorpopuliert. Das user interface müsste unter der Adresse des Servers auf **Port 3000** erreichbar sein. Nachdem man sich mit als **admin** mit dem Passwort **123** eingeloggt hat, sollte man zuerst in der Benutzerverwaltung das Passwort für den Admin-Benutzer ändern.


## Hinweise

- Nicht von Administratoren erstellte Benutzer müssen das flag *enabled* (Default: *false*) gesetzt haben, um sich einloggen zu können. Dazu in der Benutzerverwaltung auf den Benutzer klicken und die Einstellung dort ändern und speichern.

