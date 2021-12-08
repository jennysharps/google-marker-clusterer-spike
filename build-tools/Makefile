.phony: default
default:
	npm install

.phony: refresh-data
refresh-data: default
	. ${NVM_DIR}/nvm.sh && nvm use && node ./cli/updateLocations