# BiDoS - Bildungsdokumentationssystem
Translation: Educational Report System

This is fork of Rene Wilhelm work for an educational report system developed and financed by the team around Prof. Dr. Gisela Kammermeyer University Koblenz-Landau. Appreciations to Rene Wilhelms work and ideas and the willingness to share the bidos system with the open source communtiy. The reduces costs so that other projects can build on that. 

## Installation & Setup

### Requirements

- postgres 9.4.0+
- node 0.11.14+
- gulp (`npm install gulp -g`)
- bower (`npm install bower -g`)

### 1. Database Create User (1/2)

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

### 3. Create Database (2/2)

```
make db
```

Die Datenbank ist nun eingerichtet mit notwendigen Resourcen (Stand: Ende 2014) vorpopuliert. Das user interface müsste unter der Adresse des Servers auf **Port 3000** erreichbar sein. Nachdem man sich mit als **admin** mit dem Passwort **123** eingeloggt hat, sollte man zuerst in der Benutzerverwaltung das Passwort für den Admin-Benutzer ändern.


## Additional Remarks

- Nicht von Administratoren erstellte Benutzer müssen das flag *enabled* (Default: *false*) gesetzt haben, um sich einloggen zu können. Dazu in der Benutzerverwaltung auf den Benutzer klicken und die Einstellung dort ändern und speichern.

