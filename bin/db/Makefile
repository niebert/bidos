# sh
SHELL = /usr/local/bin/zsh
SHELLFLAGS = --extendedglob

# env
USER = $(shell whoami)
OS = $(shell uname -s)

# db
DB_SCHEMA = schema.sql
DB_DEFAULTS = defaults.sql

# pwd
BASE_DIR = .

# proj
NAME = bidos

# --------------------------------------------------------------------------------------------------

ifeq (${NODE_ENV},production)
	PORT=$(WWW_PORT_PRODUCTION)
	DATABASE = $(NAME)_production
	ENVIRONMENT = --production
else ifeq (${NODE_ENV},test)
	PORT=$(WWW_PORT_TEST)
	DATABASE = $(NAME)_test
	ENVIRONMENT = --test
else ifeq (${NODE_ENV},development)
	PORT=$(WWW_PORT_DEVELOPMENT)
	DATABASE = $(NAME)_development
	ENVIRONMENT = --development
else
	echo you need to set NODE_ENV=[development|production|test]
	exit 1
endif

# --------------------------------------------------------------------------------------------------

default: db
db: dbreset dbinit dbdefaults dbsamples

# --------------------------------------------------------------------------------------------------

dbcreate:
ifeq ($(OS),Darwin)
	createuser $(NAME)
	createdb -O $(NAME) $(NAME)_development
	createdb -O $(NAME) $(NAME)_production
	createdb -O $(NAME) $(NAME)_test
else
	sudo -u postgres createdb -O $(NAME) $(NAME)_development
	sudo -u postgres createdb -O $(NAME) $(NAME)_production
	sudo -u postgres createdb -O $(NAME) $(NAME)_test
	sudo -u postgres createuser $(NAME)
endif

dbdrop:
ifeq ($(OS),Darwin)
	dropdb $(NAME)_development
	dropdb $(NAME)_production
	dropdb $(NAME)_test
	dropuser $(NAME)
else
	sudo -u postgres dropdb $(NAME)_development
	sudo -u postgres dropdb $(NAME)_production
	sudo -u postgres dropdb $(NAME)_test
	sudo -u postgres dropuser $(NAME)
endif

# db: insert defaults from sql files
dbschema:
ifeq ($(OS),Darwin)
	psql -U $(NAME) -f $(DB_SCHEMA) $(DATABASE)
else
	psql -f $(DB_SCHEMA) $(DATABASE)
endif

dbdefaults:
ifeq ($(OS),Darwin)
	psql -U $(NAME) -f $(DB_DEFAULTS) $(DATABASE)
else
	psql -f $(DB_DEFAULTS) $(DATABASE)
endif

dbsamples:
ifeq ($(OS),Darwin)
	psql -U $(NAME) -f $(DB_SAMPLES) $(DATABASE)
else
	psql -f $(DB_SAMPLES) $(DATABASE)
endif

# db: add initial users via curl (for auth) TODO
dbusers:
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 0, "name": "Admin", "email": "admin@bidos", "password": "123", "username": "admin", "approved": true }' localhost:$(PORT)/auth/signup

PHONY = .
