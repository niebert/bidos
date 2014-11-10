

./server
========

The server consists of a back end and a front end.

The back end provides the data API, connects to the database via an ORM (Sequelize), handles authentication and authorization (JWT) and does the routing neccessary to apropriately answer API requests.

The front end provides two user interfaces: (1) one for administration (managing user accounts, deploying new surveys and general maintaineance etc.). (2) Another for scientific analysis of the existing survey data. In the latter, all personal data is anonymized.


back end
--------
koa
sequelize


### sessions

	with tokens you don't need sessions, i guess

### authentication

The header sent by the client via POST must contain a validable base64 encoded
payload.

      http://jwt.io/
      https://github.com/auth0/angular-jwt

#### authorization

### postgresql


front end
=========
angular
react


./mobile
========
ionic/cordova
angular
react

Glossary
--------

- **Person who conducts the survey:** investigator
- **Person who participates in the survey:** respondent


# stack

- postgresql
--------------------
- sequelize
- socket.io
- passport
- koa-jwt
- koa
- ------------------
- angular
- angular-jwt
- angular-ui-router