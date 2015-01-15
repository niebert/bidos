#
# Thu Jan 15 03:05:02 CET 2015
#

USER = $(shell whoami)
OS = $(shell uname -s)
REMOTE_HOST = 92.51.147.239
DB_SETUP_FILE = ./db_setup.sql

BASEDIR = .
IGNOREFILE = $(BASEDIR)/.gitignore
REMOVEFILES = `cat $(IGNOREFILE)` *bz2

NAME = bidos

TARBALL = $(NAME)-`date '+%Y%m%d'`.tar.bz2
REMOTE_PATH = $(NAME)

DEPLOY_CMD = "cd $(REMOTE_PATH); make install"
START_CMD = "gulp"


ifeq (${NODE_ENV},production)
	PORT=3001
	DATABASE = bidos_production
	ENVIRONMENT = --production
else
	PORT=3000
	DATABASE = bidos_development
endif


install: npm bower
db: dbreset dbinit dbsetup
deploy: git-deploy


git-deploy:
	ssh $(REMOTE_HOST) 'test -d bidos || git clone https://github.com/rwilhelm/bidos.git'
	ssh $(REMOTE_HOST) 'cd $(NAME) && git pull'
	ssh $(REMOTE_HOST) 'cd $(NAME) && make install'
	ssh $(REMOTE_HOST) 'cd $(NAME) && make db'
	@echo running in $(NODE_ENV) mode
	@echo open $(REMOTE_HOST):$(PATH)

rsync-deploy:
	@echo deploying to $(REMOTE_HOST):$(REMOTE_PATH)
	@rsync -av $(BASEDIR) $(REMOTE_HOST):$(REMOTE_PATH) --exclude-from=$(IGNOREFILE)
	@ssh $(REMOTE_HOST)

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

dbreset:
ifeq ($(OS),Darwin)
	dropdb bidos_development
	createdb -O $(USER) bidos_development
else
	sudo -u postgres dropdb bidos_development
	sudo -u postgres createdb -O $(USER) bidos_development
endif

dbinit:
ifeq ($(OS),Darwin)
	psql -U bidos -f $(DB_SETUP_FILE) $(DATABASE)
else
	psql -f $(DB_SETUP_FILE) $(DATABASE)
endif

dbsetup:
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "role_id": "1", "name": "Admin", "email": "admin@bidos", "password": "123", "username": "admin" }' localhost:$(PORT)/auth/signup
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "role_id": "2", "name": "René Wilhelm", "email": "rene.wilhelm@gmail.com", "password": "123" }' localhost:$(PORT)/auth/signup
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "role_id": "3", "name": "Hans Jonas", "email": "hjonasd@uni-freiburg.de", "password": "123" }' localhost:$(PORT)/auth/signup

PHONY = .
