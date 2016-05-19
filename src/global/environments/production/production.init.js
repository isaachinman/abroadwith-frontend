const fs = require('fs')

// Write domains file
fs.createReadStream('src/global/environments/production/production_domains.json').pipe(fs.createWriteStream('src/global/constants/domains.json'))

// Write server settings file
fs.createReadStream('src/global/environments/production/production_ServerSettings.js').pipe(fs.createWriteStream('src/ServerSettings.js'))
