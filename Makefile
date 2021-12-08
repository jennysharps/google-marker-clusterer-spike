.phony: default
default:
	cd build-tools && make

.phony: local
local:
	bundle exec jekyll serve --baseurl=""

.phony: refresh-data
refresh-data:
	cd build-tools && make refresh-data