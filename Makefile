#
# Mon Feb 16 22:18:05 CET 2015
#

NO_COLOR=\x1b[0m
OK_COLOR=\x1b[32;06m
ERROR_COLOR=\x1b[31;01m
WARN_COLOR=\x1b[33;01m

# sh
SHELL = /usr/local/bin/zsh
SHELLFLAGS = --extendedglob

# env
USER = $(shell whoami)
OS = $(shell uname -s)

# ch
REMOTE_HOST = 92.51.147.239

API_PORT_PRODUCTION = 3000
WWW_PORT_PRODUCTION = 3001

API_PORT_DEVELOPMENT = 3002
WWW_PORT_DEVELOPMENT = 3003

API_PORT_TEST = 3004
WWW_PORT_TEST = 3005

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

# wildcards
TEMPLATES = app/src/**/*.html
SCRIPTS = app/src/**/*.js
STYLESHEETS = app/src/**/*.css

# --------------------------------------------------------------------------------------------------

ifeq (${NODE_ENV},production)
	PORT=$(WWW_PORT_PRODUCTION)
	DATABASE = $(NAME)_production
	ENVIRONMENT = --production
else ifeq (${NODE_ENV},test)
	PORT=$(WWW_PORT_TEST)
	DATABASE = $(NAME)_test
	ENVIRONMENT = --test
else
	PORT=$(WWW_PORT_DEVELOPMENT)
	DATABASE = $(NAME)_development
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
# 6. play with the database: psql $(DATABASE)

default: dist
deploy: git-deploy
install: npm bower
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
dev: dist-light
	@fswatch -0 -r -o app/src | xargs -0 -n1 -I{} make dist-light

dist-light: js css templates manifest
	@afplay /System/Library/Sounds/Morse.aiff
	@echo "`DATE` $(OK_COLOR) done $(NO_COLOR)"

# things are served from here
dist: clean js css templates img icons manifest
	@echo "done"
	@osascript -e 'display notification "done" with title "Title"'

icons:
	@echo "copying icons"
	@bin/copy_icons.sh

cordova:
	@echo "copying cordova files"
	@cp app/assets/cordova/* app/dist

img:
	@echo "copying images"
	@time cp -r app/assets/img app/dist

css:
	@echo "running sass"
	@time gulp css 1>/dev/null &

js-app:
	@afplay -r .08 /System/Library/Sounds/Morse.aiff &
	@echo "bundling project scripts"
	@time gulp js-app 1>/dev/null

js-vendor:
	@echo "bundling vendor scripts"
	@time gulp js-vendor 1>/dev/null

js-vendor-alt:
	@browserify app/src/lib.js | tee app/dist/vendor.js | uglifyjs > app/dist/vendor.min.js

manifest:
	@echo generating manifest
	@time bin/manifest.sh > $(DIST_DIR)/manifest.appcache

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

# just server static directories. there should be no need to listen for file changes
www:
	while iojs --harmony bin/www_server.js; do sleep 3; done

run-on-lg:
  DB_URL=postgres://postgres:liveandgov@localhost/$(DATABASE) PORT=3105 gulp"

www-simple:
	NODE_ENV=development iojs --harmony bin/www_server.sh

api-simple:
	NODE_ENV=development iojs --harmony app/api

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
