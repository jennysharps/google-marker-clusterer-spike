.phony: default
default:
	npm install

.phony: local
local:
	npm run serve

.phony: refresh-data
refresh-data:
	node ./cli/updateLocations