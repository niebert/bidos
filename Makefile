BASEDIR = .

ifeq (${NODE_ENV},production)
PORT=3105
DATABASE = bidos_development
ENVIRONMENT = --production
else
PORT=3000
DATABASE = bidos_development
endif

IGNOREFILE = $(BASEDIR)/.gitignore
REMOVEFILES = `cat $(IGNOREFILE)` *bz2

NAME = bidos-server
TARBALL = $(NAME)-`date '+%Y%m%d'`.tar.bz2

REMOTE_HOST = rene@141.26.69.238
REMOTE_PATH = $(NAME)

DEPLOY_CMD = "cd $(REMOTE_PATH); make setup"
FOREVER_CMD = "PORT=$(PORT) forever start -w -a -o out.log -e err.log server.js"

DB_SETUP_FILE = ./db_setup.sql

install: npm bower

bower:
	@echo installing bower components
	@bower install

npm:
	@echo installing node modules
	@npm install $(ENVIRONMENT)

clean:
	@rm -rf $(REMOVEFILES)

tarball:
	@tar cjpf $(TARBALL) --exclude-from=$(IGNOREFILE) --exclude=$(TARBALL) $(BASEDIR)

forever:
	@echo starting server on port $(PORT)
	@$(FOREVER_CMD)

deploy:
	@echo deploying to $(REMOTE_HOST):$(REMOTE_PATH)
	@rsync -av $(BASEDIR) $(REMOTE_HOST):$(REMOTE_PATH) --exclude-from=$(IGNOREFILE)
	@ssh $(REMOTE_HOST)

dball: dbreset dbinit dbsetup
dball-osx: dbreset-osx dbinit dbsetup

# FIXME: find a better way to do all this w/o sudo and/or drop the whole
# database. afaict updating a postgres view is not so simple.

dbreset-osx:
	dropdb bidos_development
	createdb -O bidos bidos_development

dbreset:
	sudo -u postgres dropdb bidos_development
	sudo -u postgres createdb -O rene bidos_development

dbinit:
	@echo initializing database $(DATABASE)
	@psql -U bidos -f $(DB_SETUP_FILE) $(DATABASE)

# TODO: do this via node, i.e. find out how to call my own middleware to create default users

dbsetup:
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "name": "Admin", "email": "admin@bidos", "password": "123", "username": "admin", "role_id": "1" }' localhost:$(PORT)/auth/signup
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "name": "René Wilhelm", "email": "rene.wilhelm@gmail.com", "password": "123", "role_id": "2" }' localhost:$(PORT)/auth/signup
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "name": "Hans Jonas", "email": "hjonasd@uni-freiburg.de", "password": "123", "role_id": "3" }' localhost:$(PORT)/auth/signup
