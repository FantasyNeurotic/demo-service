const env = require('../env')

module.exports = {
  debug: env.DEBUG === 'true' ? true : false,
  version: env.APP_VERSION || '1.0.0'
}