#
# Mon Feb 16 22:18:05 CET 2015
#

SHELL = /usr/local/bin/zsh

USER = $(shell whoami)
OS = $(shell uname -s)
REMOTE_HOST = 92.51.147.239
DB_SETUP_FILE = bin/db_setup.sql
DB_DEFAULTS_FILE = bin/db_defaults.sql
DB_SAMPLES_FILE = bin/db_samples.sql

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

VERSION = $(shell gulp version 2>&1 >/dev/null)
DIST_DIR = $(BASEDIR)/app/dist
APK_BUILD = $(BASEDIR)/app/apk/platforms/android/ant-build/CordovaApp-debug.apk
APK_DIST = $(DIST_DIR)/bidos-`gulp version 1>/dev/null`.apk
CORDOVA_DIR = $(BASEDIR)/app/apk/www
VERSION =($(grep '\bversion|\bname' package.json | cut -d: -f2- | sed 's/[",]//g'))

install: npm bower
build: dist
db: dbreset dbinit dbsetup
deploy: git-deploy

# START STUFF

api:
	nodemon app/api/index.js -w app/api

www:
	nodemon bin/www_server.js -w app/src

# INSTALL DEPENDENCIES

npm:
	@echo installing node modules
	@npm install $(ENVIRONMENT)

bower:
	@echo installing bower components
	@bower install

# BUILD SOURCES AND PREPARE DIST DIR

dist: clean
	@gulp build
	@bin/manifest.sh
	@ln -sFv ../../bower_components app/dist/lib
	@cp -v app/assets/cordova* app/dist
	@cp -rv app/assets/img app/dist
	@bin/copy_icons.sh




# SETUP DATABASE

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
	psql -U bidos -f $(DB_DEFAULTS_FILE) $(DATABASE)
	psql -U bidos -f $(DB_SAMPLES_FILE) $(DATABASE)
else
	psql -f $(DB_SETUP_FILE) $(DATABASE)
	psql -f $(DB_DEFAULTS_FILE) $(DATABASE)
	psql -f $(DB_SAMPLES_FILE) $(DATABASE)
endif

dbsetup:
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 0, "name": "Admin", "email": "admin@bidos", "password": "123", "username": "admin", "enabled": true }' localhost:$(PORT)/auth/signup
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 1, "name": "René Wilhelm", "email": "rene.wilhelm@gmail.com", "password": "123", "group_id": 7 }' localhost:$(PORT)/auth/signup
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 2, "name": "Hans Jonas", "email": "hjonasd@uni-freiburg.de", "password": "123" }' localhost:$(PORT)/auth/signup

# CORDOVA STUFF

apk-build: cordova-copy
	echo "building (2/2)"
	cd $(BASEDIR)/app/apk && cordova build 1>/dev/null
	echo done!
	echo $(APK_DIST)

# cp -v $(APK_BUILD) $(APK_DIST)
apk-dist:
	gulp copyApkToDist 1>/dev/null

apk: src-build cordova-copy apk-build apk-dist
	echo build successful

# CLEANUP
clean:
	rm -r app/dist

distclean:
	@rm -rf $(REMOVEFILES)

tarball:
	@tar cjpf $(TARBALL) --exclude-from=$(IGNOREFILE) --exclude=$(TARBALL) $(BASEDIR)

# DEPLOY

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






PHONY = .
