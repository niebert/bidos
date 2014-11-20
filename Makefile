BASEDIR = .

ifeq (${NODE_ENV},production)
PORT=3001
DATABASE = bidos_production
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

dbinit:
	@echo initializing database $(DATABASE)
	@psql -f $(DB_SETUP_FILE) $(DATABASE)
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "username": "admin", "password": "123", "email": "asdf@uni-koblenz.de", "name": "René Wilhelm" }' localhost:$(PORT)/signup
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "username": "rene", "password": "123", "email": "rene.wilhelm@uni-koblenz.de", "name": "René Wilhelm" }' localhost:$(PORT)/signup
	@psql -c "UPDATE users SET role_id = 1 WHERE id = 1" $(DATABASE)
	@psql -c "UPDATE users SET role_id = 2 WHERE id = 2" $(DATABASE)

