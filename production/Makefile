#!/usr/bin/env bash
root_project = ..
build = $(root_project)/production/build
release = $(root_project)/production/release

BG =\n\033[0;36m-- # Beginning
NC =\033[0m\n# No Color

version := $(shell git describe --tags --match="v*")

.PHONY: all
all: clean app

.PHONY: clean
clean:
	@(printf "${BG}Cleaning project${NC}")
		rm -rf $(build)
		rm -rf $(release)

.PHONY: npm
npm:
	@(printf "${BG}Installing NPM dependencies${NC}")
		cd $(root_project) && npm install

.PHONY: app
app: npm
	@(printf "${BG}Preparing build directory${NC}")
		mkdir -p $(build)
		mkdir -p $(release)

	@(printf "${BG}Preparing build directory${NC}")
		mkdir -p $(build)/src

	@(printf "${BG}Generating version file${NC}")
		echo "VERSION=$(version)" >$(build)/version.txt
		echo "BUILD_DATE=$(shell date --utc +%FT%TZ)" >>$(build)/version.txt

	@(printf "${BG}Copying app to build directory${NC}")
		cp -r $(root_project)/src/* $(build)/src/
		cp -r $(root_project)/node_modules $(build)/
		cp $(root_project)/lambda.ts $(build)/
		cp $(root_project)/package.json $(build)/
		cp $(root_project)/package-lock.json $(build)/
		cp $(root_project)/serverless.yml $(build)/

.PHONY: package
package: app
	@(printf "${BG}Creating package${NC}")
		cd $(build) && npx serverless package --package ../release

	@(printf "${BG}Package version $(version) is ready${NC}")
		echo $(version) >$(release)/latest.version

.PHONY: qa
qa:
	@(printf "${BG}Prepare log directory${NC}")
		mkdir -p $(root_project)/log

	@(printf "${BG}Running tests${NC}")
		cd $(root_project) && export FORCE_COLOR=1 && npm test

.PHONY: release
release:
	@(printf "${BG}Upload package to S3 repository${NC}")
		aws s3 cp $(release)/latest.version "s3://classdojo-release/dev/classdojo-backend.version";
		aws s3 cp $(release)/classdojo-backend.zip "s3://classdojo-release/dev/classdojo-backend.zip";
		aws s3 cp $(release)/classdojo-backend.zip "s3://classdojo-release/dev/classdojo-backend-$(version).zip";

		if [ `echo ${version} | egrep "^v[0-9]+(+\.[0-9]+){2}$$"` ]; then \
			aws s3 cp $(release)/latest.version "s3://classdojo-release/stable/classdojo-backend.version"; \
			aws s3 cp $(release)/classdojo-backend.zip "s3://classdojo-release/stable/classdojo-backend.zip"; \
			aws s3 cp $(release)/classdojo-backend.zip "s3://classdojo-release/stable/classdojo-backend-$(version).zip"; \
		fi
