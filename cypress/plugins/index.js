// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const fs = require('fs-extra')
const path = require('path')

function getConfigurationByFile (file) {
   //file variable call the qa.json generic name
  const pathToConfigFile = path.resolve('cypress', 'config', `${file}.json`) 
  //directorio en la carpeta cypress, config y el archivo
  if(!fs.existsSync(pathToConfigFile)){
    return {}; //returning empty object if we do not have a file
  }

  return fs.readJson(pathToConfigFile)
}

module.exports = (on, config) => {
 // require('cypress-plugin-retries/lib/plugin')(on)
  const file = config.env.configFile // || 'development' quitamos ya que no tenemos ambiente llamado development dearrollo y solo queremos usar nuestro archivo qa.json


  return getConfigurationByFile(file)
}
