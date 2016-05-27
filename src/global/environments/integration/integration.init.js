const fs = require('fs')

// Write domains file
fs.createReadStream('src/global/environments/integration/integration_domains.json').pipe(fs.createWriteStream('src/global/constants/domains.json'))

// Write server settings file
fs.createReadStream('src/global/environments/integration/integration_ServerSettings.js').pipe(fs.createWriteStream('src/ServerSettings.js'))
