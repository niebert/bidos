#
# Mon Feb 16 22:18:05 CET 2015
#

# sh
SHELL = /usr/local/bin/zsh
SHELLFLAGS = --extendedglob

# env
USER = $(shell whoami)
OS = $(shell uname -s)

# ch
REMOTE_HOST = 92.51.147.239
API_PORT_DEVELOPMENT = 3000
WWW_PORT_DEVELOPMENT = 3001
API_PORT_PRODUCTION = 3002
WWW_PORT_PRODUCTION = 3003

# db
DB_SETUP = bin/db_setup.sql
DB_DEFAULTS = bin/db_defaults.sql
DB_SAMPLES = bin/db_samples.sql

# pwd
BASE_DIR = .

# fs
IGNOREFILE = $(BASE_DIR)/.gitignore
REMOVEFILES = `cat $(IGNOREFILE)` *bz2

# proj
NAME = $(shell jq -r '.name' package.json)
VERSION = $(shell jq -r '.version' package.json)
BUILD = $(shell cat .build)

# deploy
DEPLOY_PATH = $(NAME)
DEPLOY_CMD = "cd $(DEPLOY_PATH); make install"

# pkg
TARBALL = $(NAME)-$(VERSION)-$(BUILD).tar.gz
BACKUP = $(NAME)-$(VERSION)-`date '+%Y%m%d%H%M%S'`.tar.bz2

# dist
DIST_DIR = $(BASE_DIR)/app/dist
DIST_TEMPLATES = $(DIST_DIR)/templates

# build
BUILD_DIR = $(BASE_DIR)/app/build

# cordova
CORDOVA_DIR = $(BASE_DIR)/app/apk
APK_DIR = $(CORDOVA_DIR)/www
APK_BUILD = $(CORDOVA_DIR)/platforms/android/ant-build/CordovaApp-debug.apk
APK_DIST = $(BUILD_DIR)/$(NAME)-$(VERSION)-$(BUILD).apk

# github
GITHUB_REPOSITORY = https://github.com/rwilhelm/bidos.git

# --------------------------------------------------------------------------------------------------

ifeq (${NODE_ENV},production)
	PORT=$(WWW_PORT_PRODUCTION)
	DATABASE = $(name)_production
	ENVIRONMENT = --production
else
	PORT=$(WWW_PORT_DEVELOPMENT)
	DATABASE = $(name)_development
	ENVIRONMENT = --development
endif

# --------------------------------------------------------------------------------------------------

# HOW TO DO THIS
# 1. make install: installs dependencies
# 2. make dist: build stuff and put it into app/dist
# 3. make api: run api
# 4. make db: get the database ready
# 4. make www: run web server that serves app/dist
# 5. go to http://$(REMOTE_HOST):$(PORT)
# 6. play with the database: psql bidos_development

default: dist
deploy: git-deploy
install: npm bower
db: dbreset dbinit dbsetup
js: js-app

# --------------------------------------------------------------------------------------------------

# version
version:
	@echo $(NAME)
	@echo $(VERSION)
	@echo $(BUILD)

# install
npm:
	@echo installing node modules
	@npm install $(ENVIRONMENT)

bower:
	@echo installing bower components
	@bower install

# dev build iteration
dev: js css templates manifest
	@echo "done"

# things are served from here
dist: clean js css templates manifest cordova img icons
	@echo "done"

icons:
	@echo "copying icons"
	@bin/copy_icons.sh

cordova:
	@echo "copying cordova files"
	@cp app/assets/cordova/* app/dist

img:
	@echo "copying images"
	@cp -r app/assets/img app/dist

css:
	@echo "running sass"
	@gulp css 1>/dev/null

js-app:
	@echo "bundling project scripts"
	@gulp js-app 1>/dev/null

js-vendor:
	@echo "bundling vendor scripts"
	@gulp js-vendor 1>/dev/null

js-vendor-alt:
	@browserify app/src/lib.js | tee app/dist/vendor.js | uglifyjs > app/dist/vendor.min.js

manifest:
	@echo generating manifest
	@bin/manifest.sh > $(DIST_DIR)/manifest.appcache

link:
	@echo "creating symlinks"
	@ln -sF ../../bower_components app/dist/lib

# apk
apk: dist
	@echo building apk
	@test -d $(BUILD_DIR) || mkdir $(BUILD_DIR)
	@cd $(CORDOVA_DIR) && cordova build 1>/dev/null
	@cp $(APK_BUILD) $(APK_DIST)

# templates
templates:
	@echo copying templates
	@test -d $(DIST_TEMPLATES) || mkdir $(DIST_TEMPLATES)
	@cp app/src/**/*.html $(DIST_TEMPLATES)
	@mv $(DIST_TEMPLATES)/index.html app/dist

# run
api:
	nodemon app/api/index.js -w app/api -d4

www:
	nodemon bin/www_server.js -w app/src -d4

run-on-lg:
  DB_URL=postgres://postgres:liveandgov@localhost/bidos_development PORT=3105 gulp"

www-simple:
	NODE_ENV=development iojs --harmony bin/www_server.sh

api-simple:
	NODE_ENV=development iojs --harmony app/api

# db: drop database and create new
dbreset:
ifeq ($(OS),Darwin)
	dropdb bidos_development
	createdb -O $(USER) bidos_development
else
	sudo -u postgres dropdb bidos_development
	sudo -u postgres createdb -O $(USER) bidos_development
endif

# db: insert defaults from sql files
dbinit:
ifeq ($(OS),Darwin)
	psql -U bidos -f $(DB_SETUP) $(DATABASE)
	psql -U bidos -f $(DB_DEFAULTS) $(DATABASE)
	psql -U bidos -f $(DB_SAMPLES) $(DATABASE)
else
	psql -f $(DB_SETUP) $(DATABASE)
	psql -f $(DB_DEFAULTS) $(DATABASE)
	psql -f $(DB_SAMPLES) $(DATABASE)
endif

# db: add initial users via curl (for auth) TODO
dbsetup:
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 0, "name": "Admin", "email": "admin@bidos", "password": "123", "username": "admin", "approved": true }' localhost:$(PORT)/auth/signup | jq '.'
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 1, "name": "René Wilhelm", "email": "rene.wilhelm@gmail.com", "password": "123", "group_id": 7 }' localhost:$(PORT)/auth/signup | jq '.'
	@curl -s -XPOST -H "Content-Type: application/json" -d '{ "role": 2, "name": "Hans Jonas", "email": "hjonasd@uni-freiburg.de", "password": "123" }' localhost:$(PORT)/auth/signup | jq '.'

apk-build: cordova-copy
	echo "building (2/2)"
	cd $(BASE_DIR)/app/apk && cordova build 1>/dev/null
	echo done!
	echo $(APK_DIST)

# clean
clean:
	@echo "cleaning up"
	@rm -r app/dist
	@mkdir app/dist

distclean: clean
	@rm -rf $(REMOVEFILES)

# pkg
tarball:
	@tar czpf $(TARBALL) --exclude-from=$(IGNOREFILE) --exclude=$(TARBALL) $(BASE_DIR)

backup:
	@tar cjpf $(BACKUP) --exclude-from=$(IGNOREFILE) --exclude=$(BACKUP) $(BASE_DIR)

# deploy
deploy-git:
	ssh $(REMOTE_HOST) 'test -d bidos || git clone $(GITHUB_REPOSITORY)'
	ssh $(REMOTE_HOST) 'cd $(NAME) && git pull'
	ssh $(REMOTE_HOST) 'cd $(NAME) && make install'
	ssh $(REMOTE_HOST) 'cd $(NAME) && make db'
	@echo running in $(NODE_ENV) mode
	@echo open $(REMOTE_HOST):$(PATH)

deploy-rsync:
	@echo deploying to $(REMOTE_HOST):$(REMOTE_PATH)
	@rsync -av $(BASE_DIR) $(REMOTE_HOST):$(REMOTE_PATH) --exclude-from=$(IGNOREFILE)
	@ssh $(REMOTE_HOST)

test:
	./node_modules/mocha/bin/mocha --harmony test/apiSpec.js -u bdd -R spec --reporter=list -w

# TODO
PHONY = .
