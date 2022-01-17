const fs = require('fs');
require('dotenv').config()
console.log('Writing enviroment variables to env.json file...')
fs.writeFileSync('env.json', JSON.stringify(process.env))
console.log('Done!')